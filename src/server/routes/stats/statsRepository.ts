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
import { 
  buildBookFilter,
  buildExceptionFilter,
  buildFactionFilter,
  buildMonsterFilter,
  buildStatColumns,
  optionalCondition
} from '../../sql/queryBuilders';

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

const formatStatsResponse =  function(
  rows: StatsData[],
  format?: string
): { stats: StatsData[] | string[] } {

  if (format && format === "names") {
    const rowNames = rows
      .map((stat: any) => stat.name)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return {
      stats: rowNames
    };
  }

  const rowData = rows
    .sort((a: StatsData, b: StatsData) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
    return { stats: rowData };
}

export async function getStatDefinitions(
  categories: string[],
  options: StatsFilters
): Promise<ApiResponse<{ stats: StatsData[] | string[]  }>> {
  console.log(options)
  try {
    const { bookIds, exclude, include, monster, faction, format } = options;
    const statPlaceholders = createStringArrayPlaceholders(categories);
    let variables: (string | number)[] = categories;

    let isInCategory = categories.length === 1 
      ? `LOWER(p.name) = $1`
      : `LOWER(p.name) IN (${statPlaceholders})`;

    const includeFilter = buildExceptionFilter(include, variables, 'include');
    const isIncluded = includeFilter.condition;
    variables = includeFilter.variables;

    const bookFilter = buildBookFilter(bookIds, variables);
    const isFoundInTheseBooks = bookFilter.condition;
    variables = bookFilter.variables;

    const joins = `JOIN stats p ON p.id = s.parent_id
    LEFT JOIN wod_books b on b.id = s.book_id
    LEFT JOIN bridge_monsters_stats bms ON bms.stat_id = s.id`;

    const monsterFilter = await buildMonsterFilter(monster, variables);
    const isAccessibleToMonster = monsterFilter.condition;
    variables = monsterFilter.variables;

    const factionFilter = await buildFactionFilter(faction, variables);
    const isAccessibleToFaction = factionFilter.condition;
    variables = factionFilter.variables;

    const excludeFilter = buildExceptionFilter(exclude, variables, 'exclude');
    const isNotExcluded = excludeFilter.condition;
    variables = excludeFilter.variables;

    const columns = buildStatColumns(format);

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
    const formattedStats = formatStatsResponse(statsResult.rows, format); 

    return createSuccessResponse(formattedStats);

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
): Promise<ApiResponse<{ stats: StatsData[] | string[] }>> {
  try {
    const { bookIds, exclude, include, faction, format } = options;
    let variables: (string | number)[] = [];

    const includeFilter = buildExceptionFilter(include, variables, 'include');
    const isIncluded = includeFilter.condition;
    variables = includeFilter.variables;

    const bookFilter = buildBookFilter(bookIds, variables);
    const isFoundInTheseBooks = bookFilter.condition;
    variables = bookFilter.variables;

    const joins = `JOIN stats p ON p.id = s.parent_id
    LEFT JOIN wod_books b on b.id = s.book_id
    JOIN bridge_monsters_stats bms ON bms.stat_id = s.id`

    const monsterFilter = await buildMonsterFilter(monster, variables);
    const isAccessibleToMonster = monsterFilter.condition;
    variables = monsterFilter.variables;

    const isPower = `LOWER(p.name) IN ('disciplines','spheres','arts','numina','arcanoi','lores','edges','hekau')`;

    const factionFilter = await buildFactionFilter(faction, variables);
    const isAccessibleToFaction = factionFilter.condition;
    variables = factionFilter.variables;

    const excludeFilter = buildExceptionFilter(exclude, variables, 'exclude');
    const isNotExcluded = excludeFilter.condition;
    variables = excludeFilter.variables;

    const columns = buildStatColumns(format);

    const statsQuery = `
      SELECT ${columns}
      FROM stats s ${joins}
      WHERE ${isPower}
        AND (${optionalCondition(isAccessibleToMonster)}
            AND ${optionalCondition(isAccessibleToFaction)}
            AND ${optionalCondition(isFoundInTheseBooks)}
          ${isIncluded ? ` OR ${isIncluded}` : ''}
        )
        ${isNotExcluded ? ` AND ${isNotExcluded}` : ''}
      ORDER BY s.id, s.name ASC
    `; 

    const statsResult = await queryDbConnection(statsQuery, variables);
    const formattedStats = formatStatsResponse(statsResult.rows, format);
    
    return createSuccessResponse(formattedStats);
    
  } catch (error) {
    console.error('Query error:', error);
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}

export async function getRitualsByPath(
  pathId: number,
  options: FilterOptions & { level?: number }
): Promise<ApiResponse<{ stats: StatsData[] | string[] }>> {
  try {
    const { bookIds, include, exclude, format, level } = options;
    let variables: (string | number)[] = [pathId];

    const columns = format === 'names'
      ? 'r.id, r.name'
      : `r.id,
        LOWER(r.name) as name,
        r.name as display, 
        r.description,
        r.value as level,
        CASE 
          WHEN r.book_id IS NOT NULL THEN 
            json_build_object(
              'book_id', r.book_id,
              'book_name', b.name,
              'page_number', r.page_number
            )
        ELSE NULL
        END as reference`;

    const bookFilter = buildBookFilter(bookIds, variables, 'r');  // Use 'r' alias
    const isFoundInTheseBooks = bookFilter.condition;
    variables = bookFilter.variables;

    const includeFilter = buildExceptionFilter(include, variables, 'include', 'r');  // Use 'r' alias
    const isIncluded = includeFilter.condition;
    variables = includeFilter.variables;

    const excludeFilter = buildExceptionFilter(exclude, variables, 'exclude', 'r');  // Use 'r' alias
    const isNotExcluded = excludeFilter.condition;
    variables = excludeFilter.variables;

    let isThisLevel = '';
    if (level) {
      isThisLevel = `r.value = $${variables.length + 1}`;
      variables.push(level);
    }

    const statsQuery = `
      SELECT ${columns}
      FROM rituals r
      JOIN stats s on r.stat_id = s.id
      LEFT JOIN wod_books b on b.id = r.book_id
      WHERE s.id = $1
      AND (${optionalCondition(isFoundInTheseBooks)}
          AND ${optionalCondition(isThisLevel)}
          ${isIncluded ? `OR ${isIncluded}` : ''}
        )
        ${isNotExcluded ? ` AND ${isNotExcluded}` : ''}
      ORDER BY r.value, r.name, r.id ASC
    `;

    const statsResult = await queryDbConnection(statsQuery, variables);

    const formattedStats = formatStatsResponse(statsResult.rows, format);
    
    return createSuccessResponse(formattedStats);

  } catch (error) {
    console.error('Query error:', error);
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
}


export async function getVirtuesByPath(
  path: string,
  options: FilterOptions
): Promise<ApiResponse<{ stats: StatsData[] }>> {
  try {
    const { format } = options;

    const columns = format === "names"
      ? "DISTINCT s.id, s.name"
      : `DISTINCT ON (s.id) s.id,
        LOWER(s.name) as name,
        s.name as display, 
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
      FROM bridge_paths_virtues bpv
      JOIN stats s ON bpv.stat_id = s.id
      JOIN  stats path on path.id = bpv.path_id
      LEFT JOIN wod_books b on b.id = s.book_id
      WHERE LOWER(path.name) = LOWER($1)`;

    const variables = [path]

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