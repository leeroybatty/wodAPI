import { Response } from 'express';
import { queryDbConnection } from '../../sql';
import { AuthenticatedRequest } from '../../middleware/auth';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { createStringArrayPlaceholders } from '../helpers';

type StatsData = {
  id: string,
  name: string,
  description: string | null,
  page_number: number | null
  book: string | null
};

export async function getStatDefinitions(
  categories: string[],
  bookIds?: number[],
  exclude?: string[],
  include?: string[]
): Promise<ApiResponse<{ stats: StatsData[] }>> {
  try {
    
    const statPlaceholders = createStringArrayPlaceholders(categories);
    let variables: (string | number)[] = categories;

    let conditions = categories.length === 1 
      ? `WHERE LOWER(p.name) = $1`
      : `WHERE LOWER(p.name) IN (${statPlaceholders})`;
    
    let bookConditions = 's.book_id IS NULL';
    if (!!bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, variables.length + 1);
      bookConditions = `(s.book_id IS NULL OR s.book_id IN (${bookIdPlaceholders}))`;
      variables = [...variables, ...bookIds];
    }

    let inclusionConditions = '';
    if (!!include && include.length > 0) {
      const inclusionPlaceholders = createStringArrayPlaceholders(
        include,
        variables.length + 1
      );
      inclusionConditions = `LOWER(s.name) IN (${inclusionPlaceholders})`;
      variables = [...variables, ...include];
    }

    conditions = inclusionConditions
      ? conditions += ` AND (${bookConditions} OR ${inclusionConditions})`
      : conditions += ` AND ${bookConditions}`;
    
    if (!!exclude && exclude.length > 0) {
      const exclusionPlaceholders = createStringArrayPlaceholders(
        exclude,
        variables.length + 1
      );
      conditions += ` AND LOWER(s.name) NOT IN (${exclusionPlaceholders})`;
      variables = [...variables, ...exclude];
    }
    
    const statsQuery = `
      SELECT s.id, s.name, s.description, s.page_number, b.name as book
      FROM stats s 
        JOIN stats p ON p.id = s.parent_id
        LEFT JOIN wod_books b on b.id = s.book_id
      ${conditions}
      ORDER BY s.name ASC
    `;

    const statsResult = await queryDbConnection(statsQuery, variables);
    
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