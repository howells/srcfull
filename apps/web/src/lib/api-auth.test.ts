import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/db/client', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn(),
  },
}));

vi.mock('./api-keys', () => ({
  verifyApiKey: vi.fn(),
}));

describe('validateApiKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null for missing authorization header', async () => {
    const { validateApiKey } = await import('./api-auth');
    const request = new Request('http://localhost/api/v1/scrape', {
      method: 'POST',
    });

    const result = await validateApiKey(request);
    expect(result).toBeNull();
  });

  it('returns null for invalid bearer format', async () => {
    const { validateApiKey } = await import('./api-auth');
    const request = new Request('http://localhost/api/v1/scrape', {
      method: 'POST',
      headers: { Authorization: 'InvalidFormat' },
    });

    const result = await validateApiKey(request);
    expect(result).toBeNull();
  });

  it('returns api key record for valid key', async () => {
    const { db } = await import('@/db/client');
    const { verifyApiKey } = await import('./api-keys');

    const mockKey = { id: 'key_123', userId: 'user_123', keyHash: 'hash' };
    vi.mocked(db.select().from(null as any).where).mockResolvedValue([mockKey]);
    vi.mocked(verifyApiKey).mockResolvedValue(true);

    const { validateApiKey } = await import('./api-auth');
    const request = new Request('http://localhost/api/v1/scrape', {
      method: 'POST',
      headers: { Authorization: 'Bearer sk_live_test123' },
    });

    const result = await validateApiKey(request);
    expect(result).toEqual(mockKey);
  });
});
