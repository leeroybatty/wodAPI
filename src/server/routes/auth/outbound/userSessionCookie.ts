import { generateToken } from './jwt';
import { requireEnvVar } from '../../../services/logger/envcheck';

const USER_AUTH_TOKEN_NAME = requireEnvVar('USER_AUTH_TOKEN_NAME');

export function createUserSessionCookie(userId: string): string {
  const { token, expirationDate } = generateToken(userId);
  
  return `${USER_AUTH_TOKEN_NAME}=${token}; HttpOnly; Path=/; Secure; SameSite=Lax; Expires=${expirationDate.toUTCString()};`;
}