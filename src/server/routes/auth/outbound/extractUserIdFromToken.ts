/**
 * Checks a JWT from request headers and returns an ID based on decoding the sub.
 * 
 * This function optionally checks a token for validity, in case it needs to be 
 * called within an endpoint that is already checking for validity but needs to
 * know the actual user ID number for other purposes like passing user_id to bridge
 * tables.  The default assumption is to validate the token. 
 * 
 * @param {string} token - The token from which the user ID should be extracted.
 * @param {boolean} validateSession - Whether to validate the session, default true
 * @returns {string} A string containing the user ID, derived from the JWT's sub.
 * @throws Throws an error if decoding the token, getting user session, or any other operation fails.
 *
 */
import jwt from 'jsonwebtoken';
import { getUserSession } from './userRepository';
import { requireEnvVar } from '@logger/envcheck';
import { ErrorKeys } from '../../../errors/errors.types';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export async function extractUserIdFromToken (token: string, validateSession: boolean = true): Promise<string> {
  if (token) {
    const decodedRequestToken = jwt.verify(token, SECRET_KEY_JWT);
    if (validateSession) {
      const userSession = await getUserSession(token);
      if (!userSession || decodedRequestToken.sub !== userSession.user_id.toString()) {
        throw new Error(ErrorKeys.SESSION_INVALID);
      }
    }
    return decodedRequestToken.sub as string
  }
  throw new Error(ErrorKeys.SESSION_INVALID)
}

export default extractUserIdFromToken;