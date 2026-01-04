import bcrypt from 'bcrypt';
import crypto from 'crypto';

const KEY_PREFIX = 'sk_live_';
const KEY_LENGTH = 32;
const SALT_ROUNDS = 10;

export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(KEY_LENGTH);
  const key = randomBytes.toString('base64url').substring(0, KEY_LENGTH);
  return `${KEY_PREFIX}${key}`;
}

export function getKeyPrefix(key: string): string {
  return key.substring(0, 12);
}

export async function hashApiKey(key: string): Promise<string> {
  return bcrypt.hash(key, SALT_ROUNDS);
}

export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key, hash);
}
