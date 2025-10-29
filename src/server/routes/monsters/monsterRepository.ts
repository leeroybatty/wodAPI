import { Response } from 'express';
import { queryDbConnection, referenceCache } from '../../sql';
import { AuthenticatedRequest } from '../../middleware/auth';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { createStringArrayPlaceholders, reconcileIncludeExclude } from '../helpers';
import { FilterOptions } from '../types';
import { 
  buildBookFilter,
  buildExceptionFilter,
  buildFactionFilter,
  buildMonsterFilter,
  buildColumns,
  optionalCondition
} from '../../sql/queryBuilders';

type MonsterData = {
  name: string;
  book: string;
  page_number: number;
}

export async function getMonsterAncestors(
  splats: string[],
  options: FilterOptions): Promise<ApiResponse<{ monsters: MonsterData[] }>> {
  try {
    const { exclude, include, format } = options;
    let variables: (string | number)[] = [];

    let splatList: string[] = [];
    if (splats.length > 0) {
      for (let splat of splats) {
        switch (splat) {
          case 'vampire':
            splatList.push('vampire', 'ghoul', 'revenant');
            break;
          case 'mage':
            splatList.push('mage', 'sorcerer', 'companion');
            break;
          case 'werewolf':
            splatList.push('shifter', 'kinfolk', 'possessed');
            break;
          case 'changeling':
            splatList.push('changeling', 'kinain');
            break;
          default:
            splatList.push(splat);
            break;
        }
      }
    }

    let combinedIncludes = [...(include || []), ...splatList];

    const reconciledIncludes = exclude 
    ? reconcileIncludeExclude(exclude, combinedIncludes)
    : combinedIncludes;

    const includeFilter = buildExceptionFilter(reconciledIncludes, variables, 'include', 'm');
    const isIncluded = includeFilter.condition;
    variables = includeFilter.variables;

    const excludeFilter = buildExceptionFilter(exclude, variables, 'exclude', 'm');
    const isNotExcluded = excludeFilter.condition;
    variables = excludeFilter.variables;
   
    const columns = buildColumns(format, 'm');

    const monsterQuery = `
      SELECT ${columns}
      FROM monsters m 
        LEFT JOIN wod_books b on b.id = m.book_id
      WHERE
        m.parent_id IS NULL
        ${isIncluded ? `AND ${isIncluded}` : ''}
        ${isNotExcluded ? `AND ${isNotExcluded}` : ''}
      ORDER BY m.id, m.name ASC
    `;

    const monsterResult = await queryDbConnection(monsterQuery, variables);

    if (format === "names") {
      return createSuccessResponse({
        monsters: monsterResult.rows.map((entry) => entry.name)
      });
    }
    
    return createSuccessResponse({
      monsters: monsterResult.rows
    });
    
  } catch (error) {
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export async function getMonsters(
  monsters: string[] | number[],
  options: FilterOptions
): Promise<ApiResponse<{ monsters: MonsterData[] }>> {
  try {
    const { bookIds, exclude, include, faction, format } = options;
    const monsterPlaceholders = createStringArrayPlaceholders(monsters);
    let variables: (string | number)[] = monsters;

    let isTypeOfMonster = ''
    function isNumberArray(arr: string[] | number[]): arr is number[] {
      return typeof arr[0] === 'number';
    }

    if (isNumberArray(monsters)) {
      isTypeOfMonster = monsters.length === 1
        ? `p.id = $1`
        : `p.id IN (${monsterPlaceholders})`;
    } else {
      isTypeOfMonster = monsters.length === 1 
        ? `LOWER(p.name) = $1`
        : `LOWER(p.name) IN (${monsterPlaceholders})`;
    }

    let isIncluded = '';
    if (include && include.length > 0) {
      const inclusionPlaceholders = createStringArrayPlaceholders(include, variables.length + 1);
      isIncluded = `LOWER(m.name) IN (${inclusionPlaceholders})`;
      variables = [...variables, ...include];
    }

    let isFoundInTheseBooks = ''
    if (bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
      isFoundInTheseBooks = `(m.book_id IS NULL OR m.book_id IN (${bookIdPlaceholders}))`;
      variables = [...variables, ...bookIds];
    }

    let isAccessibleToFaction = '';
    if (faction) {
      const orgId = await referenceCache.getOrganizationId(faction);
      const exactMatches = ['independent', 'tal\'mahe\'ra'];
      isAccessibleToFaction = exactMatches.includes(faction)
        ? `m.org_lock_id = $${variables.length + 1}`
        : `(m.org_lock_id IS NULL OR m.org_lock_id = $${variables.length + 1})`;
      variables.push(orgId);
    }

    let isNotExcluded = '';
    if (exclude && exclude.length > 0) {
      const exclusionPlaceholders = createStringArrayPlaceholders(exclude, variables.length + 1);
      isNotExcluded += `LOWER(m.name) NOT IN (${exclusionPlaceholders})`;
      variables = [...variables, ...exclude];
    }

    const columns = format === "names"
      ? "m.name"
      : `m.id,
        LOWER(m.name) as name,
        m.name as display, 
        o.name as faction,
        CASE 
          WHEN m.book_id IS NOT NULL THEN 
            json_build_object(
              'book_id', m.book_id,
              'book_name', b.name,
              'page_number', m.page_number
            )
          ELSE NULL
        END as reference`;

    let meetsFilteredConditions = '';
    if (isFoundInTheseBooks) {
      meetsFilteredConditions += isFoundInTheseBooks
    }
    if (isAccessibleToFaction) {
      meetsFilteredConditions += meetsFilteredConditions ? ' AND ' : "";
      meetsFilteredConditions += isAccessibleToFaction;
    }

    const monsterQuery = `
      SELECT ${columns}
      FROM monsters m 
        JOIN monsters p ON p.id = m.parent_id
        LEFT JOIN wod_books b on b.id = m.book_id
        LEFT JOIN organizations o on o.id = m.org_lock_id
      WHERE ${isTypeOfMonster}
      ${meetsFilteredConditions
        ? ` AND (${meetsFilteredConditions} ${isIncluded ? ` OR ${isIncluded}` : ''})`
        : `${isIncluded ? ` OR ${isIncluded}` : ''}`
      }
      ${isNotExcluded ? ` AND ${isNotExcluded}` : ''}
      ORDER BY m.name ASC
    `;

    const monsterResult = await queryDbConnection(monsterQuery, variables);

    if (format === "names") {
      return createSuccessResponse({
        monsters: monsterResult.rows.map((entry) => entry.name)
      });
    }
    
    return createSuccessResponse({
      monsters: monsterResult.rows
    });
    
  } catch (error) {
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

