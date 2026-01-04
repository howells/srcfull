import { describe, it, expect } from 'vitest';
import { generateApiKey, hashApiKey, verifyApiKey } from './api-keys';

describe('api-keys', () => {
  it('generates key with correct format', () => {
    const key = generateApiKey();
    expect(key).toMatch(/^sk_live_[a-zA-Z0-9]{32}$/);
  });

  it('generates unique keys', () => {
    const key1 = generateApiKey();
    const key2 = generateApiKey();
    expect(key1).not.toBe(key2);
  });

  it('hashes and verifies key correctly', async () => {
    const key = generateApiKey();
    const hash = await hashApiKey(key);

    expect(hash).not.toBe(key);
    expect(await verifyApiKey(key, hash)).toBe(true);
    expect(await verifyApiKey('wrong_key', hash)).toBe(false);
  });

  it('extracts prefix correctly', () => {
    const key = 'sk_live_abcdefghijklmnopqrstuvwxyz123456';
    expect(key.substring(0, 12)).toBe('sk_live_abcd');
  });
});
