import { Response } from 'express';
import { queryDbConnection, getOneRowResult } from '../../sql';
import { handleError, createErrorResponse, createSuccessResponse } from '../../errors';
import { ErrorKeys } from '../../errors/errors.types';
import { ApiResponse } from '../../apiResponse.types';
import { UserSession, CreatedUserResult } from '../types';

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

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<CreatedUserResult> {
  const query = `
    INSERT INTO users
    (username, email, password)
    VALUES
    ($1, $2, $3)
    RETURNING id
  `;
  const values = [username, email, password];
  
  try {
    const result = await queryDbConnection(query, values);
    return getOneRowResult(result);
  }

  catch (error: any) {
    const {code, constraint} = error;
    let errorMessage = ErrorKeys.GENERAL_SERVER_ERROR;
    
    if (code && code === '23505') {
      switch (constraint) {
      case 'users_username_key':
        errorMessage = ErrorKeys.USERNAME_TAKEN;
        break;
      case 'users_email_key':
        errorMessage = ErrorKeys.EMAIL_TAKEN;
        break;
      default:
        errorMessage = ErrorKeys.GENERAL_SERVER_ERROR;
        break;
      }
    }
    throw new ClientError(errorMessage, code, constraint);
  }
};