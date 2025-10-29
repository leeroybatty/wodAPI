/**
 * Creates a user session and constructs a cookie string for the generated session token.
 * 
 * This function first generates a JSON Web Token (JWT) for the given user ID. 
 * It then creates a user session in the database with the generated token and its
 * expiration date. Once the session is successfully created, a cookie string is
 * constructed using the token and various other attributes.
 * 
 * The cookie is set to be HttpOnly for security reasons, ensuring it's not accessible
 * via JavaScript. It's also marked as Secure, indicating it should only be transmitted
 * over HTTPS. The `SameSite` attribute is set to `Lax`, providing some level of CSRF
 * protection.
 *
 * Note: The function uses constants and utility functions from other modules
 * for token generation, user session creation, and to retrieve the name of the
 * authentication token.
 *
 * @param {string} userId - The ID of the user for which the session will be created.
 * @returns {Promise<string>} A promise that resolves to the constructed cookie string.
 * 
 * @throws Will throw an error if creating the user session or any other operation fails.
 *
 * @example
 * try {
 *   const cookie = await createUserSessionCookie('123456');
 *   // Set the cookie in the response header
 *   res.setHeader('Set-Cookie', cookie);
 * } catch (error) {
 *   console.error("Failed to create user session cookie:", error);
 * }
 */
import {generateToken} from './jwt';
import {createUserSession} from  './userRepository';
import {requireEnvVar} from '../../../services/logger/envcheck';

const USER_AUTH_TOKEN_NAME = requireEnvVar('USER_AUTH_TOKEN_NAME');

export async function createUserSessionCookie ( userId:string ): Promise<string> {
  const {token, expirationDate} = generateToken(userId);
  try {
    await createUserSession(
      userId,
      token,
      expirationDate
    );
    return `${USER_AUTH_TOKEN_NAME}=${token}; HttpOnly; Path=/;  Secure; SameSite=Lax; Expires=${expirationDate.toUTCString()};`;
  } catch (err) {
    throw err;
  }
}