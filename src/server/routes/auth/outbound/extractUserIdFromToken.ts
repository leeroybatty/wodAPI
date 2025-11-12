/**
 * Extracts and validates user ID from a JWT token.
 * 
 * This function decodes a JWT token and extracts the user ID from it.
 * The jwt.verify() call automatically validates the token signature and expiration.
 * 
 * @param {string} token - The JWT token from which the user ID should be extracted.
 * @returns {string} A string containing the user ID, derived from the JWT's sub claim.
 * @throws Throws an error if the token is invalid, expired, or missing.
 */
import jwt from 'jsonwebtoken';
import { requireEnvVar } from '@logger/envcheck';
import { ErrorKeys } from '../../../errors/errors.types';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export function extractUserIdFromToken(token: string): string {
  if (!token) {
    throw new Error(ErrorKeys.SESSION_INVALID);
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY_JWT);
    
    if (typeof decoded === 'object' && decoded.sub) {
      return decoded.sub as string;
    }
    
    throw new Error(ErrorKeys.SESSION_INVALID);
  } catch (error) {
    throw new Error(ErrorKeys.SESSION_INVALID);
  }
}

export default extractUserIdFromToken;