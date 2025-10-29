import { Response } from 'express';
import { queryDbConnection, getOneRowResult } from '../../sql';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { UserSession } from '../types';

export async function getUserSession(
  token: string
): Promise<UserSession | null> {
  const query = `
    SELECT * FROM users_sessions WHERE session_token = $1
  `;

  const values = [token];
  const result = await queryDbConnection(query, values);

  try {
    return getOneRowResult(result);
  }
  catch (error) {
    return createErrorResponse(
      ErrorKeys.GENERAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Unknown error occurred'
    );
  }
};