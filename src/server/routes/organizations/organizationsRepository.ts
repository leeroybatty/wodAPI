import { Response } from 'express';
import { queryDbConnection, referenceCache } from '../../sql';
import { AuthenticatedRequest } from '../../middleware/auth';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { createStringArrayPlaceholders } from '../helpers';
import { FilterOptions } from '../types';
import { MonsterTemplates } from '../monsters/types';

type OrganizationData = {
  name: string;
  book: string;
  page_number: number;
}

export async function getOrganizations(
  monsters: string[],
  options: FilterOptions
): Promise<ApiResponse<{ organizations: OrganizationData[] }>> {
  try {
    const { bookIds, exclude, include, faction, format } = options;
    let variables: (string | number)[] = [];

    let isIncluded = '';
    if (include && include.length > 0) {
      const inclusionPlaceholders = createStringArrayPlaceholders(include, variables.length + 1);
      isIncluded = `LOWER(o.name) IN (${inclusionPlaceholders})`;
      variables = [...variables, ...include];
    }

    let isAccessibleToMonster ='';
    if (monsters) { 
      const monsterIdList = [];
      for (let monster of monsters) {
        const monsterId = await referenceCache.getMonsterId(monster);
        monsterIdList.push(monsterId)
      }
      const monsterPlaceholders = createStringArrayPlaceholders(monsterIdList, variables.length + 1);
      isAccessibleToMonster = `(o.monster_id IS NULL OR o.monster_id IN (${monsterPlaceholders}))`;
      variables = [...variables, ...monsterIdList];
    } else {
      isAccessibleToMonster = 'o.monster_id IS NULL';
    }

    let isFoundInTheseBooks = ''
    if (bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
      isFoundInTheseBooks = `(o.book_id IS NULL OR o.book_id IN (${bookIdPlaceholders}))`;
      variables = [...variables, ...bookIds];
    }

    let isNotExcluded = '';
    if (exclude && exclude.length > 0) {
      const exclusionPlaceholders = createStringArrayPlaceholders(exclude, variables.length + 1);
      isNotExcluded += `LOWER(o.name) NOT IN (${exclusionPlaceholders})`;
      variables = [...variables, ...exclude];
    }

    const columns = format === "names"
      ? "o.name"
      : `o.id,
        o.name, 
       CASE 
          WHEN o.book_id IS NOT NULL THEN 
            json_build_object(
              'book_id', o.book_id,
              'book_name', b.name,
              'page_number', o.page_number
            )
          ELSE NULL
        END as reference`;

    const optionalCondition = (condition?: string) => condition || 'TRUE';

    let organizationQuery = `
      SELECT ${columns}
      FROM organizations o 
        LEFT JOIN organizations p ON p.id = o.parent_id
        LEFT JOIN wod_books b on b.id = o.book_id
      WHERE ${isFoundInTheseBooks}
        AND (
          ${optionalCondition(isAccessibleToMonster)}
          ${isIncluded ? ` OR ${isIncluded}` : ''}
        )
        ${isNotExcluded ? ` AND ${isNotExcluded}` : ''}
      ORDER BY o.name ASC;`;

    const organizationResult = await queryDbConnection(organizationQuery, variables);

    if (format === "names") {
      return createSuccessResponse({
        organizations: organizationResult.rows.map((entry) => entry.name)
      });
    }
    
    return createSuccessResponse({
      organizations: organizationResult.rows,
    });
    
  } catch (error) {
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

