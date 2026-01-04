# Public API Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public SaaS API with Polar auth, API keys, and usage tracking.

**Architecture:** Polar handles customer identity. Users sign up with email, get a session cookie for the dashboard, and generate API keys for programmatic access. All API requests are logged for future rate limiting.

**Tech Stack:** Next.js API routes, Drizzle ORM, Polar SDK, bcrypt for key hashing, crypto for key generation.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `apps/web/package.json`

**Step 1: Install required packages**

Run:
```bash
cd /Users/danielhowells/Sites/beeline/apps/web && pnpm add @polar-sh/sdk bcrypt && pnpm add -D @types/bcrypt
```

**Step 2: Verify installation**

Run: `pnpm list @polar-sh/sdk bcrypt`
Expected: Both packages listed

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml && git commit -m "chore: add polar-sh/sdk and bcrypt dependencies"
```

---

### Task 2: Add Database Schema

**Files:**
- Modify: `apps/web/src/db/schema.ts`

**Step 1: Add users, api_keys, and usage_logs tables**

Add to `apps/web/src/db/schema.ts`:

```typescript
import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  real,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// ... existing patterns and cache tables ...

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  polarCustomerId: text('polar_customer_id').unique(),
  plan: text('plan', { enum: ['free', 'pro'] }).notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  keyHash: text('key_hash').notNull(),
  keyPrefix: text('key_prefix').notNull(),
  name: text('name').notNull().default('Default'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
});

export const usageLogs = pgTable('usage_logs', {
  id: serial('id').primaryKey(),
  apiKeyId: uuid('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull(),
  statusCode: integer('status_code').notNull(),
  responseTimeMs: integer('response_time_ms').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type ApiKey = InferSelectModel<typeof apiKeys>;
export type NewApiKey = InferInsertModel<typeof apiKeys>;
export type UsageLog = InferSelectModel<typeof usageLogs>;
export type NewUsageLog = InferInsertModel<typeof usageLogs>;
```

**Step 2: Push schema to database**

Run: `pnpm db:push`
Expected: Schema changes applied successfully

**Step 3: Commit**

```bash
git add src/db/schema.ts && git commit -m "feat: add users, api_keys, usage_logs tables"
```

---

### Task 3: Create Polar Client

**Files:**
- Create: `apps/web/src/lib/polar.ts`

**Step 1: Create Polar client module**

Create `apps/web/src/lib/polar.ts`:

```typescript
import { Polar } from '@polar-sh/sdk';

if (!process.env.POLAR_ACCESS_TOKEN) {
  throw new Error('POLAR_ACCESS_TOKEN environment variable is required');
}

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: 'production',
});
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/polar.ts && git commit -m "feat: add Polar client"
```

---

### Task 4: Create Auth Signup Route

**Files:**
- Create: `apps/web/src/app/api/auth/signup/route.ts`
- Test: `apps/web/src/app/api/auth/signup/route.test.ts`

**Step 1: Write the test**

Create `apps/web/src/app/api/auth/signup/route.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/app/api/auth/signup/route.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement the route**

Create `apps/web/src/app/api/auth/signup/route.ts`:

```typescript
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { polar } from '@/lib/polar';

const SignupSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = SignupSchema.parse(body);

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      // User exists - set session and return
      const cookieStore = await cookies();
      cookieStore.set('session', existingUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return NextResponse.json({ success: true });
    }

    // Create Polar customer
    const customer = await polar.customers.create({ email, name });

    // Create user in database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        polarCustomerId: customer.id,
      })
      .returning();

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed', code: 'SIGNUP_FAILED' },
      { status: 500 }
    );
  }
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/app/api/auth/signup/route.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/api/auth/signup && git commit -m "feat: add auth signup route with Polar integration"
```

---

### Task 5: Create Session Helper

**Files:**
- Create: `apps/web/src/lib/session.ts`

**Step 1: Create session helper**

Create `apps/web/src/lib/session.ts`:

```typescript
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users, type User } from '@/db/schema';

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value;

  if (!sessionId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionId))
    .limit(1);

  return user ?? null;
}

export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/session.ts && git commit -m "feat: add session helper"
```

---

### Task 6: Create Auth Session and Logout Routes

**Files:**
- Create: `apps/web/src/app/api/auth/session/route.ts`
- Create: `apps/web/src/app/api/auth/logout/route.ts`

**Step 1: Create session route**

Create `apps/web/src/app/api/auth/session/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    },
  });
}
```

**Step 2: Create logout route**

Create `apps/web/src/app/api/auth/logout/route.ts`:

```typescript
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return NextResponse.json({ success: true });
}
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/api/auth/session src/app/api/auth/logout && git commit -m "feat: add session and logout routes"
```

---

### Task 7: Create API Key Generation

**Files:**
- Create: `apps/web/src/lib/api-keys.ts`
- Test: `apps/web/src/lib/api-keys.test.ts`

**Step 1: Write the test**

Create `apps/web/src/lib/api-keys.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/api-keys.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement the module**

Create `apps/web/src/lib/api-keys.ts`:

```typescript
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
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/api-keys.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/api-keys.ts src/lib/api-keys.test.ts && git commit -m "feat: add API key generation and hashing utilities"
```

---

### Task 8: Create Keys API Routes

**Files:**
- Create: `apps/web/src/app/api/keys/route.ts`
- Create: `apps/web/src/app/api/keys/[id]/route.ts`

**Step 1: Create keys list and create route**

Create `apps/web/src/app/api/keys/route.ts`:

```typescript
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db/client';
import { apiKeys } from '@/db/schema';
import { requireSession } from '@/lib/session';
import { generateApiKey, hashApiKey, getKeyPrefix } from '@/lib/api-keys';

const CreateKeySchema = z.object({
  name: z.string().min(1).max(50).optional(),
});

export async function GET() {
  try {
    const user = await requireSession();

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id));

    return NextResponse.json({ keys });
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSession();
    const body = await request.json().catch(() => ({}));
    const { name } = CreateKeySchema.parse(body);

    const key = generateApiKey();
    const keyHash = await hashApiKey(key);
    const keyPrefix = getKeyPrefix(key);

    const [created] = await db
      .insert(apiKeys)
      .values({
        userId: user.id,
        keyHash,
        keyPrefix,
        name: name ?? 'Default',
      })
      .returning();

    // Return the full key ONLY on creation
    return NextResponse.json({
      key,
      id: created.id,
      name: created.name,
      keyPrefix,
      createdAt: created.createdAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid name', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
}
```

**Step 2: Create key delete route**

Create `apps/web/src/app/api/keys/[id]/route.ts`:

```typescript
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { apiKeys } from '@/db/schema';
import { requireSession } from '@/lib/session';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireSession();
    const { id } = await params;

    const result = await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Key not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
}
```

**Step 3: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/api/keys && git commit -m "feat: add API key management routes"
```

---

### Task 9: Create API Auth Middleware

**Files:**
- Create: `apps/web/src/lib/api-auth.ts`
- Test: `apps/web/src/lib/api-auth.test.ts`

**Step 1: Write the test**

Create `apps/web/src/lib/api-auth.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/api-auth.test.ts`
Expected: FAIL (module not found)

**Step 3: Implement the module**

Create `apps/web/src/lib/api-auth.ts`:

```typescript
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { apiKeys, usageLogs, type ApiKey } from '@/db/schema';
import { verifyApiKey } from './api-keys';

export async function validateApiKey(request: Request): Promise<ApiKey | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const key = authHeader.slice(7);
  if (!key.startsWith('sk_live_')) {
    return null;
  }

  // Find all keys with matching prefix
  const prefix = key.substring(0, 12);
  const candidates = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyPrefix, prefix));

  // Verify against each candidate
  for (const candidate of candidates) {
    if (await verifyApiKey(key, candidate.keyHash)) {
      // Update last used timestamp
      await db
        .update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, candidate.id));

      return candidate;
    }
  }

  return null;
}

export async function logUsage(
  apiKeyId: string,
  endpoint: string,
  statusCode: number,
  responseTimeMs: number
): Promise<void> {
  try {
    await db.insert(usageLogs).values({
      apiKeyId,
      endpoint,
      statusCode,
      responseTimeMs,
    });
  } catch {
    // Logging failure shouldn't break the request
  }
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/api-auth.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/api-auth.ts src/lib/api-auth.test.ts && git commit -m "feat: add API key validation and usage logging"
```

---

### Task 10: Create Public API v1 Scrape Endpoint

**Files:**
- Create: `apps/web/src/app/api/v1/scrape/route.ts`

**Step 1: Create v1 scrape route**

Create `apps/web/src/app/api/v1/scrape/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { executeScrapeWebpage } from '@/lib/tools/scrape-webpage';
import { executeExtractImageElements } from '@/lib/tools/extract-image-elements';
import { resolve } from '@/lib/resolver';
import { validateApiKey, logUsage } from '@/lib/api-auth';

const ScrapeRequestSchema = z.object({
  url: z.string().url(),
});

const MIN_SIZE = 200;
const LOGO_PATTERNS = [
  /logo/i, /icon/i, /favicon/i, /badge/i, /sprite/i,
  /thumbnail/i, /avatar/i, /social/i, /button/i,
];

export async function POST(request: Request) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { url } = ScrapeRequestSchema.parse(body);

    // Scrape the page
    const scrapeResult = await executeScrapeWebpage(url);
    if (!scrapeResult.success || !scrapeResult.data) {
      const response = NextResponse.json(
        { success: false, error: { code: 'SCRAPE_FAILED', message: 'Failed to fetch page' } },
        { status: 502 }
      );
      await logUsage(apiKey.id, '/v1/scrape', 502, Date.now() - startTime);
      return response;
    }

    // Extract image elements
    const extractResult = await executeExtractImageElements(scrapeResult.data);
    if (!extractResult.success || !extractResult.data) {
      const response = NextResponse.json(
        { success: false, error: { code: 'SCRAPE_FAILED', message: 'Failed to extract images' } },
        { status: 502 }
      );
      await logUsage(apiKey.id, '/v1/scrape', 502, Date.now() - startTime);
      return response;
    }

    // Filter to main images
    const candidates = extractResult.data.filter(img => {
      if (LOGO_PATTERNS.some(p => p.test(img.url))) return false;
      if (img.width && img.width < MIN_SIZE) return false;
      if (img.height && img.height < MIN_SIZE) return false;
      return true;
    });

    // Resolve each image
    const toResolve = candidates.slice(0, 20);
    const CONCURRENCY = 5;
    const results = [];
    let resolved = 0;
    let failed = 0;

    for (let i = 0; i < toResolve.length; i += CONCURRENCY) {
      const batch = toResolve.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (img) => {
          try {
            const result = await resolve(img.url);
            if (result.method !== 'fallback') resolved++;
            return {
              original: result.original,
              resolved: result.resolved,
              originalSize: null, // Could add size fetching
              resolvedSize: null,
              sizeIncrease: result.sizeIncrease ?? null,
              alt: img.alt ?? null,
              context: img.context ?? null,
              method: result.method,
            };
          } catch {
            failed++;
            return null;
          }
        })
      );
      results.push(...batchResults.filter(Boolean));
    }

    const response = NextResponse.json({
      success: true,
      url,
      images: results,
      stats: {
        found: extractResult.data.length,
        resolved,
        failed,
        durationMs: Date.now() - startTime,
      },
    });

    await logUsage(apiKey.id, '/v1/scrape', 200, Date.now() - startTime);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'The provided URL is not valid' } },
        { status: 400 }
      );
      await logUsage(apiKey.id, '/v1/scrape', 400, Date.now() - startTime);
      return response;
    }

    console.error('Scrape error:', error);
    const response = NextResponse.json(
      { success: false, error: { code: 'SCRAPE_FAILED', message: 'Failed to scrape page' } },
      { status: 500 }
    );
    await logUsage(apiKey.id, '/v1/scrape', 500, Date.now() - startTime);
    return response;
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/v1/scrape && git commit -m "feat: add public API v1 scrape endpoint"
```

---

### Task 11: Create Public API v1 Transform Endpoint

**Files:**
- Create: `apps/web/src/app/api/v1/transform/route.ts`

**Step 1: Create v1 transform route**

Create `apps/web/src/app/api/v1/transform/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolve } from '@/lib/resolver';
import { validateApiKey, logUsage } from '@/lib/api-auth';

const TransformRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  const startTime = Date.now();

  // Validate API key
  const apiKey = await validateApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key' } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { url } = TransformRequestSchema.parse(body);

    const result = await resolve(url);

    const response = NextResponse.json({
      success: true,
      original: result.original,
      resolved: result.resolved,
      method: result.method,
      confidence: result.confidence ?? null,
      sizeIncrease: result.sizeIncrease ?? null,
      durationMs: Date.now() - startTime,
    });

    await logUsage(apiKey.id, '/v1/transform', 200, Date.now() - startTime);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const response = NextResponse.json(
        { success: false, error: { code: 'INVALID_URL', message: 'The provided URL is not valid' } },
        { status: 400 }
      );
      await logUsage(apiKey.id, '/v1/transform', 400, Date.now() - startTime);
      return response;
    }

    console.error('Transform error:', error);
    const response = NextResponse.json(
      { success: false, error: { code: 'TRANSFORM_FAILED', message: 'Failed to transform URL' } },
      { status: 500 }
    );
    await logUsage(apiKey.id, '/v1/transform', 500, Date.now() - startTime);
    return response;
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/v1/transform && git commit -m "feat: add public API v1 transform endpoint"
```

---

### Task 12: Create Usage Stats Endpoint

**Files:**
- Create: `apps/web/src/app/api/usage/route.ts`

**Step 1: Create usage route**

Create `apps/web/src/app/api/usage/route.ts`:

```typescript
import { eq, sql, and, gte } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { apiKeys, usageLogs } from '@/db/schema';
import { requireSession } from '@/lib/session';

export async function GET() {
  try {
    const user = await requireSession();

    // Get user's API keys
    const keys = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id));

    if (keys.length === 0) {
      return NextResponse.json({
        totalRequests: 0,
        last24Hours: 0,
        last7Days: 0,
        byEndpoint: {},
      });
    }

    const keyIds = keys.map(k => k.id);
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total requests
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(sql`${usageLogs.apiKeyId} = ANY(${keyIds})`);

    // Get last 24 hours
    const [last24Result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(
        and(
          sql`${usageLogs.apiKeyId} = ANY(${keyIds})`,
          gte(usageLogs.createdAt, oneDayAgo)
        )
      );

    // Get last 7 days
    const [last7Result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(usageLogs)
      .where(
        and(
          sql`${usageLogs.apiKeyId} = ANY(${keyIds})`,
          gte(usageLogs.createdAt, sevenDaysAgo)
        )
      );

    // Get by endpoint
    const byEndpoint = await db
      .select({
        endpoint: usageLogs.endpoint,
        count: sql<number>`count(*)`,
      })
      .from(usageLogs)
      .where(sql`${usageLogs.apiKeyId} = ANY(${keyIds})`)
      .groupBy(usageLogs.endpoint);

    return NextResponse.json({
      totalRequests: Number(totalResult?.count ?? 0),
      last24Hours: Number(last24Result?.count ?? 0),
      last7Days: Number(last7Result?.count ?? 0),
      byEndpoint: Object.fromEntries(
        byEndpoint.map(e => [e.endpoint, Number(e.count)])
      ),
    });
  } catch {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add src/app/api/usage && git commit -m "feat: add usage stats endpoint"
```

---

### Task 13: Run All Tests and Final Verification

**Step 1: Run all tests**

Run: `pnpm test`
Expected: All tests pass

**Step 2: Run type check**

Run: `pnpm type-check`
Expected: No errors

**Step 3: Run lint**

Run: `pnpm lint`
Expected: No errors (or fix any that appear)

**Step 4: Push schema changes**

Run: `pnpm db:push`
Expected: Schema synced

**Step 5: Final commit if any fixes**

```bash
git add -A && git commit -m "fix: address lint and type issues" || echo "No fixes needed"
```

---

## Summary

This plan implements:

1. **Database schema** - users, api_keys, usage_logs tables
2. **Polar integration** - Customer creation on signup
3. **Session management** - Cookie-based auth for dashboard
4. **API key system** - Generate, list, revoke keys
5. **Public API** - /v1/scrape and /v1/transform endpoints
6. **Usage tracking** - Log all API requests

After implementation, users can:
1. Sign up with email (creates Polar customer)
2. Generate API keys from dashboard
3. Call `/api/v1/scrape` or `/api/v1/transform` with their key
4. View usage stats
