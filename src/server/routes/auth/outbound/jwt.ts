import { requireEnvVar } from '../../../services/logger/envcheck'
import jwt from 'jsonwebtoken';

const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * 
 * This function creates a JWT token with a payload containing the user's ID
 * (`sub` field) and the issue/expiration timestamps. The token's expiration 
 * is controlled by the `durationInMilliseconds` argument. The token is signed
 * using a secret key (`SECRET_KEY_JWT`) retrieved from environment variables.
 * 
 * Note: The `SECRET_KEY_JWT` is assumed to be securely stored as an environment 
 * variable and is imported into this module for signing the JWT.
 *
 * @param {string} userId - The ID of the user for which the token will be generated.
 * @param {number} [durationInMilliseconds=1209600 * 1000] - Optional. The duration for 
 *        which the token will be valid, in milliseconds. Defaults to 14 days.
 * @returns {Object} An object containing the generated JWT token and its expiration date.
 * @property {string} token - The generated JWT token.
 * @property {Date} expirationDate - The date and time when the token will expire.
 * 
 * @example
 * const { token, expirationDate } = generateToken('123456');
 */
export function generateToken(userId: string, durationInMilliseconds: number = 1209600 * 1000) {
  const expirationDate = new Date(Date.now() + durationInMilliseconds);
  const rightNow = Math.floor(Date.now() / 1000);
  const unixExpiration = Math.floor(expirationDate.getTime() / 1000);

  const payload = {
    sub: userId,
    iat: rightNow,
    exp: unixExpiration
  };
  
  return {
    token: jwt.sign(payload, SECRET_KEY_JWT),
    expirationDate
  };
} 