import { Response } from 'express';
import { queryDbConnection } from '../../sql';
import { AuthenticatedRequest } from '../../middleware/auth';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { resolveBookIds, createStringArrayPlaceholders } from '../helpers';

export async function getMonsters(
  monster: string,
  bookIds?: number[],
  exclusions?: string[]
): Promise<ApiResponse<{ monsters: string[] }>> {
  try {
    
    let conditions = `WHERE LOWER(p.name) = $1`;
    let variables: (string | number)[] = [monster];

    if (!!bookIds && bookIds.length > 0) {
      const bookIdPlaceholders = createStringArrayPlaceholders(bookIds, 2);
      conditions += ` AND m.book_id IN (${bookIdPlaceholders})`;
      variables = [...variables, ...bookIds];
    }
    
    if (!!exclusions && exclusions.length > 0) {
      const monsterNamePlaceholders = createStringArrayPlaceholders(
        exclusions,
        variables.length + 1
      );
      conditions += ` AND LOWER(m.name) NOT IN (${monsterNamePlaceholders})`;
      variables = [...variables, ...exclusions];
    }
    
    const monsterQuery = `
      SELECT m.name as clan, m.page_number, b.name as book
      FROM monsters m 
        JOIN monsters p ON p.id = m.parent_id
        JOIN wod_books b on b.id = m.book_id
      ${conditions}
      ORDER BY m.name ASC
    `;
    
    const monsterResult = await queryDbConnection(monsterQuery, variables);
    
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