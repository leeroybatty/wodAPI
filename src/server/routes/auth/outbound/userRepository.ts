import { Response } from 'express';
import { queryDbConnection, getOneRowResult } from '@server/sql';
import { handleError, createErrorResponse, createSuccessResponse } from '@errors';
import { ErrorKeys } from '@errors/errors.types';
import { ApiResponse } from '@server/apiResponse.types';
import { UserSession, CreatedUserResult } from '../types';

// export async function getUserSession(
//   token: string
// ): Promise<UserSession | null> {
//   const query = `
//     SELECT * FROM users_sessions WHERE session_token = $1
//   `;
//   const values = [token];
//   const result = await queryDbConnection(query, values);
//   try {
//     return getOneRowResult(result);
//   }
//   catch (error) {
//     return createErrorResponse(
//       ErrorKeys.GENERAL_SERVER_ERROR,
//       error instanceof Error ? error.message : 'Unknown error occurred'
//     );
//   }
// };

export class UserDomainError extends Error {
  code?: string;
  constraint?: string;

  constructor(message: string, code?: string, constraint?: string) {
    super(message);
    this.name = 'User Database Error';
    this.code = code;
    this.constraint = constraint;
  }
}

export async function createUser(
  username: string,
  email: string,
  hashedEmail: string,
  password: string
): Promise<CreatedUserResult> {
  const query = `
    INSERT INTO users
    (username, email, hashed_email, password)
    VALUES
    ($1, $2, $3, $4)
    RETURNING id
  `;
  const values = [username, email, hashedEmail, password];
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
    throw new UserDomainError(errorMessage, code, constraint);
  }
};