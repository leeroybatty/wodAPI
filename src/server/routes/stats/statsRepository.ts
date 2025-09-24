import { Response } from 'express';
import { queryDbConnection, referenceCache } from '../../sql';
import { AuthenticatedRequest } from '../../middleware/auth';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { createStringArrayPlaceholders } from '../helpers';

export type ValidFormat = "all" | "names"

type StatsData = {
  id: string,
  name: string,
  description: string | null,
  reference?: {
    book_id: number | null,
    book_name: string | null,
    page_number: number | null
  }
};

export async function getStatDefinitions(
  categories: string[],
  options: {
    bookIds?: number[],
    exclude?: string[],
    include?: string[],
    monster?: string,
    faction?: string,
    fields?: ValidFormat
  }
): Promise<ApiResponse<{ stats: StatsData[] }>> {
  try {
    const { bookIds, exclude, include, monster, faction, fields } = options;
    console.log(options)
    const statPlaceholders = createStringArrayPlaceholders(categories);
    let variables: (string | number)[] = categories;

    let conditions = categories.length === 1 
      ? `WHERE LOWER(p.name) = $1`
      : `WHERE LOWER(p.name) IN (${statPlaceholders})`;

    let inclusionPlaceholders = '';
    let inclusionCondition = '';

    if (!!include && include.length > 0) {
      inclusionPlaceholders = createStringArrayPlaceholders(include, variables.length + 1);
      inclusionCondition = `LOWER(s.name) IN (${inclusionPlaceholders})`;
      variables = [...variables, ...include];
    }
    
    let bookConditions = '';
    if (!!bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
      let isFoundInBook = `(s.book_id IS NULL OR s.book_id IN (${bookIdPlaceholders}))`;
      variables = [...variables, ...bookIds];
      bookConditions = `AND ${isFoundInBook}`; 
      if (inclusionCondition) {
        bookConditions = ` AND (${isFoundInBook} OR ${inclusionCondition})`;
      }
    }
    conditions += bookConditions;

    if (!!exclude && exclude.length > 0) {
      const exclusionPlaceholders = createStringArrayPlaceholders(
        exclude,
        variables.length + 1
      );
      conditions += ` AND LOWER(s.name) NOT IN (${exclusionPlaceholders})`;
      variables = [...variables, ...exclude];
    }

    let joins = `JOIN stats p ON p.id = s.parent_id
    LEFT JOIN wod_books b on b.id = s.book_id`;

    let monsterConditions = '';
    if (monster) {
      joins += ` LEFT JOIN bridge_monsters_stats bcs ON bcs.stat_id = s.id`
      const monsterIdList = await referenceCache.getMonsterChain(monster);
      const monsterPlaceholders = createStringArrayPlaceholders(monsterIdList, variables.length + 1);
      const isSeenInMonster = `(bcs.monster_id IS NULL OR bcs.monster_id IN (${monsterPlaceholders}))`;
      variables = [...variables, ...monsterIdList];
      monsterConditions = ` AND ${isSeenInMonster}`;
      if (inclusionCondition) {
        monsterConditions = ` AND (${isSeenInMonster} OR ${inclusionCondition})`;
      }
    }
    conditions += monsterConditions;
    
    let factionConditions = '';
    if (faction) {
      const isSeenInFaction = `(s.org_lock_id IS NULL OR s.org_lock_id = $${variables.length + 1})`;
      const orgId = await referenceCache.getOrganizationId(faction);
      variables.push(orgId);
      factionConditions = ` AND ${isSeenInFaction}`;
      if (inclusionCondition) {
        factionConditions = ` AND (${isSeenInFaction} OR ${inclusionCondition})`;
      }
    }
    conditions += factionConditions;

    const columns = fields === "names"
      ? "s.name"
      : `s.id, 
        s.name, 
        s.description,
        CASE 
          WHEN s.book_id IS NOT NULL THEN 
            json_build_object(
              'book_id', s.book_id,
              'book_name', b.name,
              'page_number', s.page_number
            )
          ELSE NULL
        END as reference`

    const statsQuery = `
      SELECT ${columns}
      FROM stats s 
        ${joins}
      ${conditions}
      ORDER BY s.name ASC
    `;

    console.log(statsQuery)

    const statsResult = await queryDbConnection(statsQuery, variables);

    if (fields === "names") {
      return createSuccessResponse({
        stats: statsResult.rows.map((stat) => stat.name)
      });
    }
    
    return createSuccessResponse({
      stats: statsResult.rows,
    });
    
  } catch (error) {
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}