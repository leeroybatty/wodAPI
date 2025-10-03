import { Response } from 'express';
import { queryDbConnection, referenceCache } from '../../sql';
import { AuthenticatedRequest } from '../../middleware/auth';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { createStringArrayPlaceholders } from '../helpers';
import { ValidFormat } from '../types';
import { StatsFilters } from './types';
import { FilterOptions } from '../types';

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
  options: StatsFilters
): Promise<ApiResponse<{ stats: StatsData[] }>> {
  console.log(options)
  try {
    const { bookIds, exclude, include, monster, faction, format } = options;
    const statPlaceholders = createStringArrayPlaceholders(categories);
    let variables: (string | number)[] = categories;

    let isInCategory = categories.length === 1 
      ? `LOWER(p.name) = $1`
      : `LOWER(p.name) IN (${statPlaceholders})`;

    let isIncluded = '';
    if (include && include.length > 0) {
      const inclusionPlaceholders = createStringArrayPlaceholders(include, variables.length + 1);
      isIncluded = `LOWER(s.name) IN (${inclusionPlaceholders})`;
      variables = [...variables, ...include];
    }
    
    let isFoundInTheseBooks = ''
    if (bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
      isFoundInTheseBooks = `(s.book_id IS NULL OR s.book_id IN (${bookIdPlaceholders}))`;
      variables = [...variables, ...bookIds];
    }

    let joins = `JOIN stats p ON p.id = s.parent_id
    LEFT JOIN wod_books b on b.id = s.book_id
    LEFT JOIN bridge_monsters_stats bms ON bms.stat_id = s.id`

    let isAccessibleToMonster ='';
    if (monster) { 
      const monsterIdList = await referenceCache.getMonsterChain(monster);
      const monsterPlaceholders = createStringArrayPlaceholders(monsterIdList, variables.length + 1);
      isAccessibleToMonster = `(bms.monster_id IS NULL OR bms.monster_id IN (${monsterPlaceholders}))`;
      variables = [...variables, ...monsterIdList];
    } else {
      isAccessibleToMonster = 'bms.monster_id IS NULL';
    }

    let isAccessibleToFaction = '';
    if (faction) {
      const orgId = await referenceCache.getOrganizationId(faction);
      isAccessibleToFaction = `(s.org_lock_id IS NULL OR s.org_lock_id = $${variables.length + 1})`;
      variables.push(orgId);
    } else {
      isAccessibleToFaction = 's.org_lock_id IS NULL';
    }

    let isNotExcluded = '';
    if (exclude && exclude.length > 0) {
      const exclusionPlaceholders = createStringArrayPlaceholders(exclude, variables.length + 1);
      isNotExcluded += `LOWER(s.name) NOT IN (${exclusionPlaceholders})`;
      variables = [...variables, ...exclude];
    }

    const columns = format === "names"
      ? "DISTINCT s.id, s.name"
      : `DISTINCT ON (s.id) s.id,
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

    const optionalCondition = (condition?: string) => condition || 'TRUE';

    const statsQuery = `
      SELECT ${columns}
      FROM stats s ${joins}
      WHERE ${isInCategory}
        AND (${optionalCondition(isAccessibleToMonster)}
            AND ${optionalCondition(isAccessibleToFaction)}
            AND ${optionalCondition(isFoundInTheseBooks)}
          ${isIncluded ? ` OR ${isIncluded}` : ''}
        )
        ${isNotExcluded ? ` AND ${isNotExcluded}` : ''}
      ORDER BY s.id, s.name ASC
    `;    

    const statsResult = await queryDbConnection(statsQuery, variables);

    if (format === "names") {
      return createSuccessResponse({
        stats: statsResult.rows.map((stat) => stat.name).sort((a, b) => a.name - b.name)
      });
    }
    
    return createSuccessResponse({
      stats: statsResult.rows.sort((a, b) => a - b)
    });
    
  } catch (error) {
    console.error('Query error:', error);
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}


export async function getAffinityPowers(
  monster: string,
  options: FilterOptions
): Promise<ApiResponse<{ stats: StatsData[] }>> {
  try {
    const { bookIds, exclude, include, faction, format } = options;
    let variables: (string | number)[] = [];

    let isIncluded = '';
    if (include && include.length > 0) {
      const inclusionPlaceholders = createStringArrayPlaceholders(include, variables.length + 1);
      isIncluded = `LOWER(s.name) IN (${inclusionPlaceholders})`;
      variables = [...variables, ...include];
    }
    
    let isFoundInTheseBooks = ''
    if (bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
      isFoundInTheseBooks = `(s.book_id IS NULL OR s.book_id IN (${bookIdPlaceholders}))`;
      variables = [...variables, ...bookIds];
    }

    let joins = `JOIN stats p ON p.id = s.parent_id
    LEFT JOIN wod_books b on b.id = s.book_id
    JOIN bridge_monsters_stats bms ON bms.stat_id = s.id`

    const monsterId = await referenceCache.getMonsterId(monster);
    const isAccessibleToMonster = `bms.monster_id = $${variables.length + 1}`;
    variables.push(monsterId);

    const isPower = `LOWER(p.name) IN ('disciplines','spheres','arts','numina','arcanoi','lores','edges','hekau')`;
  
    let isAccessibleToFaction = '';
    if (faction) {
      const orgId = await referenceCache.getOrganizationId(faction);
      isAccessibleToFaction = `(s.org_lock_id IS NULL OR s.org_lock_id = $${variables.length + 1})`;
      variables.push(orgId);
    } else {
      isAccessibleToFaction = 's.org_lock_id IS NULL';
    }

    let isNotExcluded = '';
    if (exclude && exclude.length > 0) {
      const exclusionPlaceholders = createStringArrayPlaceholders(exclude, variables.length + 1);
      isNotExcluded += `LOWER(s.name) NOT IN (${exclusionPlaceholders})`;
      variables = [...variables, ...exclude];
    }

    const columns = format === "names"
      ? "DISTINCT s.id, s.name"
      : `DISTINCT ON (s.id) s.id,
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

    const optionalCondition = (condition?: string) => condition || 'TRUE';

    const statsQuery = `
      SELECT ${columns}
      FROM stats s ${joins}
      WHERE ${isAccessibleToMonster} AND ${isPower}
        AND (${optionalCondition(isAccessibleToFaction)}
            AND ${optionalCondition(isFoundInTheseBooks)}
          ${isIncluded ? ` OR ${isIncluded}` : ''}
        )
        ${isNotExcluded ? ` AND ${isNotExcluded}` : ''}
      ORDER BY s.id, s.name ASC
    `;    

    const statsResult = await queryDbConnection(statsQuery, variables);

    if (format === "names") {
      return createSuccessResponse({
        stats: statsResult.rows.map((stat) => stat.name)
      });
    }
    
    return createSuccessResponse({
      stats: statsResult.rows
    });
    
  } catch (error) {
    console.error('Query error:', error);
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}