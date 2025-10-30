import { Response } from 'express';
import { queryDbConnection, getOneRowResult } from '@server/sql';
import { handleError, createErrorResponse, createSuccessResponse } from '@errors';
import { ErrorKeys } from '@errors/errors.types';
import { ApiResponse } from '@server/apiResponse.types';
import { UserSession, CreatedUserResult, UserCredentials } from '../types';
import { QueryResult } from 'pg';

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

export async function createUserSession(
  userId: string,
  token: string,
  expirationDate: Date
): Promise<UserSession | null> {
  const query = `
    INSERT INTO users_sessions
    (user_id, session_token, expiration_date)
    VALUES
    ($1, $2, $3)
    RETURNING user_id, id, session_token
  `;
  const values = [userId, token, expirationDate];

  try {
    const result: QueryResult<UserSession> = await queryDbConnection(query, values);
    return getOneRowResult(result);
  } catch (error: any) {
    throw error;
  }
};

export async function getUserCredentials(hashedIdentifier: string): Promise<UserCredentials | null> {
  const query = `SELECT
    id,
    username,
    email,
    password,
    password_reset_token,
    password_reset_expiry,
    verified,
    role
  FROM users WHERE hashed_email = $1`;

  const values = [hashedIdentifier]
  const result: QueryResult<UserCredentials> = await queryDbConnection(query, values);
  try {
    return getOneRowResult(result) as UserCredentials | null
  } catch (error: any) {
    throw error;
  }
};

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