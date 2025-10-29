import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { requireEnvVar } from "@logger/envcheck"

const emailSalt = requireEnvVar('EMAIL_SALT');
const passwordSalt = Number(requireEnvVar('SALT_ROUNDS_PASSWORD'));

/**
 * Hashes an email address using SHA-256 cryptographic hash function.
 * The hashing process uses a salt (emailSalt) combined with the email to ensure
 * additional security against rainbow table attacks. 
 * 
 * `emailSalt` comes from the .env.
 *
 * @param {string} email - The email address to be hashed.
 * @returns {string} The hashed representation of the email address in hexadecimal format.
 */
export function hashEmail(email: string) {
    const hash = crypto.createHash('sha256');
    hash.update(email + emailSalt);
    return hash.digest('hex');
}

/**
* Make a SHA256 hash with optional salt
* @param {string} data
* @param {string} [salt]  
* @returns {string} with the hashed value.
*/
export const createHash = function (data: string, salt?: string) {
  let sum = crypto.createHash('sha256')
  sum.update(data + salt)
  return sum.digest('hex')
}

/**
 * Hash a password.
 * @param {string} password - The plaintext password.
 * @returns {Promise<string>} - The hashed password.
 */
export async function hashPassword(stringToHash: string): Promise<string> {
    return await bcrypt.hash(stringToHash, passwordSalt);
}

/**
 * Compare a password to a hash.
 * @param {string} password - The plaintext password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
export async function compareHash(originalString: string, hashedString: string): Promise<boolean> {
    return bcrypt.compare(originalString, hashedString);
}

/**
 * Create a random string.
 * @returns {string} - The random string.
 */
export const createRandom = (): string => {
  return crypto.randomBytes(32).toString('hex');
}