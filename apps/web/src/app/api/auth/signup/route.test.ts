import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/polar', () => ({
  polar: {
    customers: {
      create: vi.fn(),
    },
  },
}));

vi.mock('@/db/client', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  },
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    set: vi.fn(),
  }),
}));

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates new user with Polar customer', async () => {
    const { polar } = await import('@/lib/polar');
    const { db } = await import('@/db/client');

    vi.mocked(polar.customers.create).mockResolvedValue({ id: 'polar_123' } as any);
    vi.mocked(db.select().from(null as any).where(null as any).limit).mockResolvedValue([]);
    vi.mocked(db.insert(null as any).values(null as any).returning).mockResolvedValue([
      { id: 'user_123', email: 'test@example.com' },
    ]);

    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(polar.customers.create).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('returns error for missing email', async () => {
    const { POST } = await import('./route');
    const request = new Request('http://localhost/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
