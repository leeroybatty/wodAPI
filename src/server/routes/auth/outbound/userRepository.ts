import { Response } from 'express';
import { queryDbConnection, getOneRowResult, editTable } from '@server/sql';
import { handleError, createErrorResponse, createSuccessResponse, QueryExecutionError, ValidationError } from '@errors';
import { ErrorKeys } from '@errors/errors.types';
import { ApiResponse } from '@server/apiResponse.types';
import { UserSession, CreatedUserResult, UserCredentials, PasswordResetCredentials, User } from '../types';
import { QueryResult } from 'pg';
import { GenericStringMap } from '@server/sql';
import { convertUTCStringToDate } from '@server/services/timestamps';

export async function getPasswordResetCredentials(
  hashedEmail: string
): Promise<PasswordResetCredentials> {
  const query = `
    SELECT
      id,
      password_reset_token,
      password_reset_expiry
    FROM users 
    WHERE hashed_email = $1
  `;

  const values = [hashedEmail];
  const result = await queryDbConnection(query, values);
  const credentials = getOneRowResult(result);
  
  if (!credentials) {
    throw new QueryExecutionError(
      "No user found with provided email",
      query,
      values,
      ErrorKeys.CREDENTIALS_MISSING
    );
  }
  
  return credentials as PasswordResetCredentials;
}

export async function editUser(
  id: number,
  update: Partial<User>
): Promise<QueryResult | null> {
  if (!id) {
    throw new ValidationError(
      'User ID required for edit',
      'editUser',
      [id],
      ErrorKeys.VALIDATION_ERROR
    );
  }
  
  const updatedValues: GenericStringMap = {
    ...update,
    password_reset_expiry: update.password_reset_expiry
      ? update.password_reset_expiry instanceof Date 
        ? update.password_reset_expiry
        : convertUTCStringToDate(update.password_reset_expiry)
      : null 
  };

  return await editTable(
    'users',
    'id',
    id,
    updatedValues
  );
}

export async function clearUserSession(
  userId: string,
  token: string
): Promise<boolean> {
  const query = `DELETE FROM users_sessions WHERE user_id = $1 and session_token = $2`;
  const values = [userId, token];
  const result = await queryDbConnection(query, values);
  
  const deletions = result.rowCount;
  return deletions === 1; 
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
  const result: QueryResult<UserSession> = await queryDbConnection(query, values);
  return getOneRowResult(result);
}

export async function getUserCredentials(
  hashedIdentifier: string
): Promise<UserCredentials | null> {
  const query = `
    SELECT
      id,
      username,
      email,
      password,
      password_reset_token,
      password_reset_expiry,
      verified,
      role
    FROM users 
    WHERE hashed_email = $1
  `;

  const values = [hashedIdentifier];
  const result: QueryResult<UserCredentials> = await queryDbConnection(query, values);
  return getOneRowResult(result) as UserCredentials | null;
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
  } catch (error: any) {
    const {code, constraint} = error;
    let errorKey = ErrorKeys.GENERAL_SERVER_ERROR;
    
    if (code === '23505') {
      switch (constraint) {
        case 'users_username_key':
          errorKey = ErrorKeys.USERNAME_TAKEN;
          break;
        case 'users_email_key':
          errorKey = ErrorKeys.EMAIL_TAKEN;
          break;
        default:
          errorKey = ErrorKeys.GENERAL_SERVER_ERROR;
          break;
      }
    }
    
    throw new QueryExecutionError(
      `Failed to create user: ${errorKey}`,
      query,
      values,
      errorKey
    );
  }
}