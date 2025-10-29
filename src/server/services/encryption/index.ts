import crypto from 'crypto';
import { requireEnvVar } from '@logger/envcheck';

/** 
 * Represents the encryption key used for both encryption and decryption.
 * Sourced from environment variables and must be 32 bytes.
 * @type {string}
 */
const ENCRYPTION_KEY_32_BYTE = requireEnvVar('ENCRYPTION_KEY_32_BYTE');

/**
 * Retrieves the encryption key from the environment variable.
 * Converts the hexadecimal key to a Buffer for encryption and decryption.
 * 
 * @returns {Buffer} The encryption key as a buffer.
 */
function getEncryptionKey(): Buffer {
  return Buffer.from(ENCRYPTION_KEY_32_BYTE as string, 'hex');
}

/** 
 * Represents the length of the Initialization Vector (IV) used for encryption.
 * @type {number}
 */
const IV_LENGTH = 16;

/**
 * Encrypts a plain text string using AES-256-CBC encryption.
 * The encryption uses an Initialization Vector (IV) which is 
 * prepended to the encrypted result.
 *
 * @param {string} text - The plain text string to be encrypted.
 * @returns {string} The encrypted text in the format: 'iv:encryptedContent'.
 */
export function encrypt(text: string): string {    
    const ENCRYPTION_KEY_32_BYTE = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY_32_BYTE, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts an encrypted text string using AES-256-CBC decryption.
 * The decryption expects the text in the format: 'iv:encryptedContent'.
 *
 * @param {string} text - The encrypted text string to be decrypted.
 * @returns {string} The decrypted plain text string.
 */
export function decrypt(text: string): string {
    const ENCRYPTION_KEY_32_BYTE = getEncryptionKey();
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY_32_BYTE, iv);

    return Buffer.concat([decipher.update(encryptedText), decipher.final()]).toString('utf8');
}