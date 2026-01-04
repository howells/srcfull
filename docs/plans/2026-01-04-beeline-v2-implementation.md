# Beeline v2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a self-improving image URL resolver that transforms CDN/resized URLs into source URLs.

**Architecture:** Core `resolve()` function checks curated patterns, then learned patterns (Postgres), then probes CDN if unknown. Successful probes are saved as new patterns. Two API endpoints: `/transform` (single URL) and `/scrape` (page extraction).

**Tech Stack:** Next.js 15 (App Router), Postgres (via `postgres` package), Tailwind CSS, Vitest for testing.

---

## Phase 1: Database & Core Engine

### Task 1: Set Up Postgres Connection

**Files:**
- Create: `apps/web/src/lib/db.ts`
- Create: `apps/web/src/lib/db.test.ts`

**Step 1: Install postgres package**

Run: `pnpm add postgres --filter web`

**Step 2: Create database connection module**

```typescript
// apps/web/src/lib/db.ts
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export type Pattern = {
  id: number;
  domain: string;
  match_regex: string;
  transform: string;
  confidence: number;
  successes: number;
  failures: number;
  created_at: Date;
  last_used_at: Date;
};

export type CacheEntry = {
  original_url: string;
  resolved_url: string;
  pattern_id: number | null;
  resolved_at: Date;
  expires_at: Date;
};
```

**Step 3: Add DATABASE_URL to .env.local**

```bash
echo "DATABASE_URL=postgres://localhost:5432/beeline" >> apps/web/.env.local
```

**Step 4: Commit**

```bash
git add apps/web/src/lib/db.ts apps/web/.env.local pnpm-lock.yaml
git commit -m "feat: add postgres connection module"
```

---

### Task 2: Create Database Schema

**Files:**
- Create: `scripts/migrate.sql`

**Step 1: Write migration script**

```sql
-- scripts/migrate.sql

-- Learned URL patterns
CREATE TABLE IF NOT EXISTS patterns (
  id SERIAL PRIMARY KEY,
  domain TEXT NOT NULL,
  match_regex TEXT NOT NULL,
  transform TEXT NOT NULL,
  confidence REAL DEFAULT 0.5,
  successes INT DEFAULT 1,
  failures INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(domain, match_regex)
);

-- URL resolution cache
CREATE TABLE IF NOT EXISTS cache (
  original_url TEXT PRIMARY KEY,
  resolved_url TEXT NOT NULL,
  pattern_id INT REFERENCES patterns(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patterns_domain ON patterns(domain);
CREATE INDEX IF NOT EXISTS idx_patterns_confidence ON patterns(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache(expires_at);
```

**Step 2: Run migration locally**

Run: `psql -d beeline -f scripts/migrate.sql`

Expected: Tables created without errors.

**Step 3: Commit**

```bash
git add scripts/migrate.sql
git commit -m "feat: add database migration script"
```

---

### Task 3: Create Pattern Repository

**Files:**
- Create: `apps/web/src/lib/patterns-repo.ts`
- Create: `apps/web/src/lib/patterns-repo.test.ts`

**Step 1: Write the test**

```typescript
// apps/web/src/lib/patterns-repo.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findPatternByDomain, savePattern, incrementSuccess } from './patterns-repo';

// Mock the sql module
vi.mock('./db', () => ({
  sql: vi.fn(),
}));

describe('patterns-repo', () => {
  describe('findPatternByDomain', () => {
    it('returns patterns sorted by confidence', async () => {
      const { sql } = await import('./db');
      const mockPatterns = [
        { id: 1, domain: 'example.com', confidence: 0.9 },
        { id: 2, domain: 'example.com', confidence: 0.7 },
      ];
      vi.mocked(sql).mockResolvedValueOnce(mockPatterns as any);

      const result = await findPatternByDomain('example.com');

      expect(result).toEqual(mockPatterns);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter web test src/lib/patterns-repo.test.ts`

Expected: FAIL with "Cannot find module './patterns-repo'"

**Step 3: Write the implementation**

```typescript
// apps/web/src/lib/patterns-repo.ts
import { sql, type Pattern } from './db';

export async function findPatternByDomain(domain: string): Promise<Pattern[]> {
  return sql<Pattern[]>`
    SELECT * FROM patterns
    WHERE domain = ${domain}
    ORDER BY confidence DESC
  `;
}

export async function savePattern(
  domain: string,
  matchRegex: string,
  transform: string
): Promise<Pattern> {
  const [pattern] = await sql<Pattern[]>`
    INSERT INTO patterns (domain, match_regex, transform)
    VALUES (${domain}, ${matchRegex}, ${transform})
    ON CONFLICT (domain, match_regex)
    DO UPDATE SET successes = patterns.successes + 1, last_used_at = NOW()
    RETURNING *
  `;
  return pattern;
}

export async function incrementSuccess(patternId: number): Promise<void> {
  await sql`
    UPDATE patterns
    SET
      successes = successes + 1,
      confidence = LEAST(confidence + 0.1, 0.99),
      last_used_at = NOW()
    WHERE id = ${patternId}
  `;
}

export async function incrementFailure(patternId: number): Promise<void> {
  await sql`
    UPDATE patterns
    SET
      failures = failures + 1,
      confidence = confidence - 0.2
    WHERE id = ${patternId}
  `;

  // Delete low-confidence patterns
  await sql`DELETE FROM patterns WHERE confidence < 0.2`;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter web test src/lib/patterns-repo.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/patterns-repo.ts apps/web/src/lib/patterns-repo.test.ts
git commit -m "feat: add pattern repository for learned patterns"
```

---

### Task 4: Create Cache Repository

**Files:**
- Create: `apps/web/src/lib/cache-repo.ts`

**Step 1: Write the implementation**

```typescript
// apps/web/src/lib/cache-repo.ts
import { sql, type CacheEntry } from './db';

export async function getCached(originalUrl: string): Promise<string | null> {
  const [entry] = await sql<CacheEntry[]>`
    SELECT resolved_url FROM cache
    WHERE original_url = ${originalUrl}
    AND expires_at > NOW()
  `;
  return entry?.resolved_url ?? null;
}

export async function setCache(
  originalUrl: string,
  resolvedUrl: string,
  patternId?: number
): Promise<void> {
  await sql`
    INSERT INTO cache (original_url, resolved_url, pattern_id)
    VALUES (${originalUrl}, ${resolvedUrl}, ${patternId ?? null})
    ON CONFLICT (original_url)
    DO UPDATE SET
      resolved_url = ${resolvedUrl},
      pattern_id = ${patternId ?? null},
      resolved_at = NOW(),
      expires_at = NOW() + INTERVAL '7 days'
  `;
}

export async function clearExpiredCache(): Promise<number> {
  const result = await sql`
    DELETE FROM cache WHERE expires_at < NOW()
  `;
  return result.count;
}
```

**Step 2: Commit**

```bash
git add apps/web/src/lib/cache-repo.ts
git commit -m "feat: add cache repository"
```

---

## Phase 2: Core Resolver Engine

### Task 5: Create URL Validator

**Files:**
- Create: `apps/web/src/lib/validator.ts`
- Create: `apps/web/src/lib/validator.test.ts`

**Step 1: Write the test**

```typescript
// apps/web/src/lib/validator.test.ts
import { describe, it, expect, vi } from 'vitest';
import { validateImageUrl, type ValidationResult } from './validator';

describe('validateImageUrl', () => {
  it('returns valid for image content-type with size', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({
        'content-type': 'image/jpeg',
        'content-length': '50000',
      }),
    });

    const result = await validateImageUrl('https://example.com/image.jpg');

    expect(result.valid).toBe(true);
    expect(result.contentType).toBe('image/jpeg');
    expect(result.size).toBe(50000);
  });

  it('returns invalid for non-image content-type', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({
        'content-type': 'text/html',
      }),
    });

    const result = await validateImageUrl('https://example.com/page.html');

    expect(result.valid).toBe(false);
  });

  it('returns invalid for failed requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const result = await validateImageUrl('https://example.com/404.jpg');

    expect(result.valid).toBe(false);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter web test src/lib/validator.test.ts`

Expected: FAIL

**Step 3: Write the implementation**

```typescript
// apps/web/src/lib/validator.ts
export type ValidationResult = {
  valid: boolean;
  contentType?: string;
  size?: number;
};

export async function validateImageUrl(url: string): Promise<ValidationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Beeline/2.0)',
        'Accept': 'image/*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { valid: false };
    }

    const contentType = response.headers.get('content-type') ?? '';
    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : undefined;

    const isImage = contentType.startsWith('image/');

    return {
      valid: isImage,
      contentType: isImage ? contentType : undefined,
      size,
    };
  } catch {
    return { valid: false };
  }
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter web test src/lib/validator.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/validator.ts apps/web/src/lib/validator.test.ts
git commit -m "feat: add image URL validator"
```

---

### Task 6: Create CDN Prober

**Files:**
- Create: `apps/web/src/lib/prober.ts`
- Create: `apps/web/src/lib/prober.test.ts`

**Step 1: Write the test**

```typescript
// apps/web/src/lib/prober.test.ts
import { describe, it, expect, vi } from 'vitest';
import { generateCandidates } from './prober';

describe('generateCandidates', () => {
  it('strips common query params', () => {
    const url = 'https://example.com/image.jpg?w=400&h=300&q=80';
    const candidates = generateCandidates(url);

    expect(candidates).toContain('https://example.com/image.jpg');
  });

  it('tries larger dimensions', () => {
    const url = 'https://example.com/image.jpg?w=400';
    const candidates = generateCandidates(url);

    expect(candidates.some(c => c.includes('w=2560'))).toBe(true);
  });

  it('tries master/original path variants', () => {
    const url = 'https://cdn.example.com/photos/abc/1:1/w_400/image.jpg';
    const candidates = generateCandidates(url);

    expect(candidates.some(c => c.includes('/master/'))).toBe(true);
    expect(candidates.some(c => c.includes('/original/'))).toBe(true);
  });

  it('removes size suffixes from filename', () => {
    const url = 'https://example.com/image_800x600.jpg';
    const candidates = generateCandidates(url);

    expect(candidates).toContain('https://example.com/image.jpg');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter web test src/lib/prober.test.ts`

Expected: FAIL

**Step 3: Write the implementation**

```typescript
// apps/web/src/lib/prober.ts
import { validateImageUrl } from './validator';

const RESIZE_PARAMS = [
  'w', 'h', 'width', 'height', 'size', 'resize',
  'q', 'quality', 'fit', 'crop', 'auto', 'fm', 'format',
  'dpr', 'scale', 'blur', 'sharp',
];

const SIZE_SUFFIXES = [
  /_\d+x\d+(\.\w+)$/,
  /-\d+x\d+(\.\w+)$/,
  /_(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
  /-(?:small|medium|large|thumb|thumbnail)(\.\w+)$/i,
];

const PATH_VARIANTS = ['master', 'original', 'full', 'source', 'raw'];

export function generateCandidates(url: string): string[] {
  const candidates: string[] = [];

  try {
    const urlObj = new URL(url);

    // 1. Strip resize query params
    const strippedUrl = new URL(url);
    RESIZE_PARAMS.forEach(param => strippedUrl.searchParams.delete(param));
    if (strippedUrl.href !== url) {
      candidates.push(strippedUrl.href);
    }

    // 2. Try larger dimensions
    const largeUrl = new URL(url);
    if (largeUrl.searchParams.has('w')) {
      largeUrl.searchParams.set('w', '2560');
      largeUrl.searchParams.delete('h');
      candidates.push(largeUrl.href);
    }
    if (largeUrl.searchParams.has('width')) {
      largeUrl.searchParams.set('width', '2560');
      largeUrl.searchParams.delete('height');
      candidates.push(largeUrl.href);
    }

    // 3. Strip all query params
    const noQueryUrl = urlObj.origin + urlObj.pathname;
    if (noQueryUrl !== url && !candidates.includes(noQueryUrl)) {
      candidates.push(noQueryUrl);
    }

    // 4. Remove size suffixes from filename
    for (const pattern of SIZE_SUFFIXES) {
      const match = urlObj.pathname.match(pattern);
      if (match) {
        const cleanPath = urlObj.pathname.replace(pattern, match[1]);
        const cleanUrl = urlObj.origin + cleanPath + urlObj.search;
        if (!candidates.includes(cleanUrl)) {
          candidates.push(cleanUrl);
        }
      }
    }

    // 5. Try path variants (master, original, etc.)
    const pathParts = urlObj.pathname.split('/');
    for (const variant of PATH_VARIANTS) {
      // Try replacing aspect ratio segments like "1:1", "4:3"
      const variantParts = pathParts.map(part =>
        /^\d+:\d+$/.test(part) ? variant : part
      );
      if (variantParts.join('/') !== pathParts.join('/')) {
        const variantUrl = urlObj.origin + variantParts.join('/') + urlObj.search;
        if (!candidates.includes(variantUrl)) {
          candidates.push(variantUrl);
        }
      }
    }

  } catch {
    // Invalid URL, return empty
  }

  return candidates;
}

export type ProbeResult = {
  url: string;
  size: number;
  method: 'probed';
} | null;

export async function probeForSource(
  originalUrl: string,
  originalSize?: number
): Promise<ProbeResult> {
  const candidates = generateCandidates(originalUrl);

  let bestUrl = originalUrl;
  let bestSize = originalSize ?? 0;

  for (const candidate of candidates) {
    const validation = await validateImageUrl(candidate);

    if (validation.valid && validation.size && validation.size > bestSize) {
      bestUrl = candidate;
      bestSize = validation.size;
    }
  }

  if (bestUrl !== originalUrl) {
    return { url: bestUrl, size: bestSize, method: 'probed' };
  }

  return null;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter web test src/lib/prober.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/prober.ts apps/web/src/lib/prober.test.ts
git commit -m "feat: add CDN prober for discovering source URLs"
```

---

### Task 7: Refactor Pattern Matcher

**Files:**
- Modify: `apps/web/src/lib/tools/match-known-patterns.ts` → `apps/web/src/lib/pattern-matcher.ts`
- Create: `apps/web/src/lib/pattern-matcher.test.ts`

**Step 1: Write the test**

```typescript
// apps/web/src/lib/pattern-matcher.test.ts
import { describe, it, expect } from 'vitest';
import { matchCuratedPattern, applyPattern } from './pattern-matcher';

describe('matchCuratedPattern', () => {
  it('matches Condé Nast URLs and transforms to high-quality', () => {
    const url = 'https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg';
    const result = matchCuratedPattern(url);

    expect(result).toBe('https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/master/w_2560,c_limit/image.jpg');
  });

  it('returns null for unknown URLs', () => {
    const url = 'https://unknown-cdn.com/image.jpg';
    const result = matchCuratedPattern(url);

    expect(result).toBeNull();
  });
});

describe('applyPattern', () => {
  it('applies regex pattern with replacement', () => {
    const url = 'https://example.com/photos/abc123/small/image.jpg';
    const pattern = {
      match_regex: '^(https://example.com/photos/[^/]+)/small/(.+)$',
      transform: '$1/large/$2',
    };

    const result = applyPattern(url, pattern);

    expect(result).toBe('https://example.com/photos/abc123/large/image.jpg');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter web test src/lib/pattern-matcher.test.ts`

Expected: FAIL

**Step 3: Write the implementation**

```typescript
// apps/web/src/lib/pattern-matcher.ts
import fs from 'fs';
import path from 'path';

export type CuratedPattern = {
  domain: string;
  description?: string;
  extractSource?: {
    pattern: string;
    replacement: string;
  };
  stripParams?: string[];
  stripSuffixes?: string[];
  confidence: 'high' | 'medium' | 'low';
};

type CuratedPatterns = Record<string, CuratedPattern>;

let cachedPatterns: CuratedPatterns | null = null;

function loadCuratedPatterns(): CuratedPatterns {
  if (cachedPatterns) return cachedPatterns;

  try {
    const patternsPath = path.join(process.cwd(), '../../data/patterns.json');
    const data = fs.readFileSync(patternsPath, 'utf-8');
    cachedPatterns = JSON.parse(data);
    return cachedPatterns!;
  } catch {
    return {};
  }
}

export function matchCuratedPattern(url: string): string | null {
  const patterns = loadCuratedPatterns();

  for (const [name, pattern] of Object.entries(patterns)) {
    if (name === 'generic') continue;
    if (!url.includes(pattern.domain)) continue;

    // Try extractSource first
    if (pattern.extractSource) {
      const regex = new RegExp(pattern.extractSource.pattern);
      if (regex.test(url)) {
        return url.replace(regex, pattern.extractSource.replacement);
      }
    }

    // Try stripParams
    if (pattern.stripParams) {
      let cleanUrl = url;
      for (const param of pattern.stripParams) {
        cleanUrl = cleanUrl.replace(new RegExp(param, 'g'), '');
      }
      cleanUrl = cleanUrl
        .replace(/\?&/g, '?')
        .replace(/&&+/g, '&')
        .replace(/[?&]+$/g, '');

      if (cleanUrl !== url) return cleanUrl;
    }

    // Try stripSuffixes
    if (pattern.stripSuffixes) {
      let cleanUrl = url;
      for (const suffix of pattern.stripSuffixes) {
        cleanUrl = cleanUrl.replace(new RegExp(suffix + '(\\.\\w+)$'), '$1');
      }
      if (cleanUrl !== url) return cleanUrl;
    }
  }

  return null;
}

export function applyPattern(
  url: string,
  pattern: { match_regex: string; transform: string }
): string | null {
  try {
    const regex = new RegExp(pattern.match_regex);
    if (regex.test(url)) {
      return url.replace(regex, pattern.transform);
    }
  } catch {
    // Invalid regex
  }
  return null;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter web test src/lib/pattern-matcher.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/pattern-matcher.ts apps/web/src/lib/pattern-matcher.test.ts
git commit -m "feat: add pattern matcher for curated patterns"
```

---

### Task 8: Create Core Resolver

**Files:**
- Create: `apps/web/src/lib/resolver.ts`
- Create: `apps/web/src/lib/resolver.test.ts`

**Step 1: Write the test**

```typescript
// apps/web/src/lib/resolver.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolve, type ResolveResult } from './resolver';

vi.mock('./cache-repo', () => ({
  getCached: vi.fn(),
  setCache: vi.fn(),
}));

vi.mock('./patterns-repo', () => ({
  findPatternByDomain: vi.fn(),
  savePattern: vi.fn(),
  incrementSuccess: vi.fn(),
}));

vi.mock('./pattern-matcher', () => ({
  matchCuratedPattern: vi.fn(),
  applyPattern: vi.fn(),
}));

vi.mock('./prober', () => ({
  probeForSource: vi.fn(),
}));

vi.mock('./validator', () => ({
  validateImageUrl: vi.fn(),
}));

describe('resolve', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cached result if available', async () => {
    const { getCached } = await import('./cache-repo');
    vi.mocked(getCached).mockResolvedValue('https://cached.com/image.jpg');

    const result = await resolve('https://original.com/image.jpg');

    expect(result.resolved).toBe('https://cached.com/image.jpg');
    expect(result.method).toBe('cached');
  });

  it('uses curated pattern if matched', async () => {
    const { getCached } = await import('./cache-repo');
    const { matchCuratedPattern } = await import('./pattern-matcher');
    const { validateImageUrl } = await import('./validator');

    vi.mocked(getCached).mockResolvedValue(null);
    vi.mocked(matchCuratedPattern).mockReturnValue('https://source.com/image.jpg');
    vi.mocked(validateImageUrl).mockResolvedValue({ valid: true, size: 100000 });

    const result = await resolve('https://cdn.com/image.jpg');

    expect(result.resolved).toBe('https://source.com/image.jpg');
    expect(result.method).toBe('pattern');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --filter web test src/lib/resolver.test.ts`

Expected: FAIL

**Step 3: Write the implementation**

```typescript
// apps/web/src/lib/resolver.ts
import { getCached, setCache } from './cache-repo';
import { findPatternByDomain, savePattern, incrementSuccess } from './patterns-repo';
import { matchCuratedPattern, applyPattern } from './pattern-matcher';
import { probeForSource } from './prober';
import { validateImageUrl } from './validator';

export type ResolveResult = {
  original: string;
  resolved: string;
  method: 'cached' | 'pattern' | 'learned' | 'probed' | 'fallback';
  confidence?: number;
  sizeIncrease?: string;
};

export async function resolve(imageUrl: string): Promise<ResolveResult> {
  const original = imageUrl;

  // 1. Check cache
  try {
    const cached = await getCached(imageUrl);
    if (cached) {
      return { original, resolved: cached, method: 'cached' };
    }
  } catch {
    // Cache unavailable, continue
  }

  // Get original size for comparison
  const originalValidation = await validateImageUrl(imageUrl);
  const originalSize = originalValidation.size ?? 0;

  // 2. Try curated patterns
  const curatedResult = matchCuratedPattern(imageUrl);
  if (curatedResult) {
    const validation = await validateImageUrl(curatedResult);
    if (validation.valid) {
      const sizeIncrease = calculateSizeIncrease(originalSize, validation.size);
      await cacheResult(imageUrl, curatedResult);
      return {
        original,
        resolved: curatedResult,
        method: 'pattern',
        confidence: 0.95,
        sizeIncrease,
      };
    }
  }

  // 3. Try learned patterns
  try {
    const domain = new URL(imageUrl).hostname;
    const learnedPatterns = await findPatternByDomain(domain);

    for (const pattern of learnedPatterns) {
      const result = applyPattern(imageUrl, pattern);
      if (result) {
        const validation = await validateImageUrl(result);
        if (validation.valid) {
          await incrementSuccess(pattern.id);
          const sizeIncrease = calculateSizeIncrease(originalSize, validation.size);
          await cacheResult(imageUrl, result, pattern.id);
          return {
            original,
            resolved: result,
            method: 'learned',
            confidence: pattern.confidence,
            sizeIncrease,
          };
        }
      }
    }
  } catch {
    // Database unavailable, continue
  }

  // 4. Probe for source
  const probeResult = await probeForSource(imageUrl, originalSize);
  if (probeResult) {
    // Learn the pattern for next time
    await learnPattern(imageUrl, probeResult.url);
    const sizeIncrease = calculateSizeIncrease(originalSize, probeResult.size);
    await cacheResult(imageUrl, probeResult.url);
    return {
      original,
      resolved: probeResult.url,
      method: 'probed',
      confidence: 0.5,
      sizeIncrease,
    };
  }

  // 5. Fallback - return original
  return { original, resolved: imageUrl, method: 'fallback' };
}

async function cacheResult(
  original: string,
  resolved: string,
  patternId?: number
): Promise<void> {
  try {
    await setCache(original, resolved, patternId);
  } catch {
    // Cache write failed, not critical
  }
}

async function learnPattern(original: string, resolved: string): Promise<void> {
  try {
    const domain = new URL(original).hostname;
    // Create a simple pattern from this transformation
    // This is a basic implementation - could be smarter
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await savePattern(domain, `^${escaped}$`, resolved);
  } catch {
    // Learning failed, not critical
  }
}

function calculateSizeIncrease(original?: number, resolved?: number): string | undefined {
  if (!original || !resolved || original === 0) return undefined;
  const increase = resolved / original;
  if (increase <= 1) return undefined;
  return `${increase.toFixed(1)}x`;
}
```

**Step 4: Run test to verify it passes**

Run: `pnpm --filter web test src/lib/resolver.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add apps/web/src/lib/resolver.ts apps/web/src/lib/resolver.test.ts
git commit -m "feat: add core resolver engine"
```

---

## Phase 3: API Endpoints

### Task 9: Create Transform API

**Files:**
- Create: `apps/web/src/app/api/transform/route.ts`

**Step 1: Write the implementation**

```typescript
// apps/web/src/app/api/transform/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolve } from '@/lib/resolver';

const TransformRequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = TransformRequestSchema.parse(body);

    const result = await resolve(url);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL', code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    console.error('Transform error:', error);
    return NextResponse.json(
      { error: 'Failed to transform URL', code: 'TRANSFORM_FAILED' },
      { status: 500 }
    );
  }
}
```

**Step 2: Test manually**

Run: `curl -X POST http://localhost:13000/api/transform -H "Content-Type: application/json" -d '{"url":"https://media.houseandgarden.co.uk/photos/63e509b43404638ef031982b/1:1/w_400/thumb.jpg"}'`

Expected: JSON response with resolved URL

**Step 3: Commit**

```bash
git add apps/web/src/app/api/transform/route.ts
git commit -m "feat: add /api/transform endpoint"
```

---

### Task 10: Create Scrape API

**Files:**
- Create: `apps/web/src/app/api/scrape/route.ts`

**Step 1: Write the implementation**

```typescript
// apps/web/src/app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { executeScrapeWebpage } from '@/lib/tools/scrape-webpage';
import { executeExtractImageElements } from '@/lib/tools/extract-image-elements';
import { resolve } from '@/lib/resolver';

const ScrapeRequestSchema = z.object({
  url: z.string().url(),
});

const MIN_SIZE = 200;
const LOGO_PATTERNS = [
  /logo/i, /icon/i, /favicon/i, /badge/i, /sprite/i,
  /thumbnail/i, /avatar/i, /social/i, /button/i,
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = ScrapeRequestSchema.parse(body);

    // Scrape the page
    const scrapeResult = await executeScrapeWebpage(url);
    if (!scrapeResult.success || !scrapeResult.data) {
      return NextResponse.json(
        { error: 'Failed to fetch page', code: 'FETCH_FAILED' },
        { status: 500 }
      );
    }

    // Extract image elements
    const extractResult = await executeExtractImageElements(scrapeResult.data);
    if (!extractResult.success || !extractResult.data) {
      return NextResponse.json(
        { error: 'Failed to extract images', code: 'EXTRACT_FAILED' },
        { status: 500 }
      );
    }

    // Filter to main images
    const candidates = extractResult.data.filter(img => {
      if (LOGO_PATTERNS.some(p => p.test(img.url))) return false;
      if (img.width && img.width < MIN_SIZE) return false;
      if (img.height && img.height < MIN_SIZE) return false;
      return true;
    });

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: 'No images found', code: 'NO_IMAGES' },
        { status: 404 }
      );
    }

    // Resolve each image (limit to 20, parallel with concurrency)
    const toResolve = candidates.slice(0, 20);
    const CONCURRENCY = 5;
    const results = [];

    for (let i = 0; i < toResolve.length; i += CONCURRENCY) {
      const batch = toResolve.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(img => resolve(img.url))
      );
      results.push(...batchResults);
    }

    return NextResponse.json({
      page: url,
      images: results,
      count: results.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid URL', code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape page', code: 'SCRAPE_FAILED' },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add apps/web/src/app/api/scrape/route.ts
git commit -m "feat: add /api/scrape endpoint"
```

---

## Phase 4: Frontend (Clean Slate)

### Task 11: Delete Legacy Components

**Step 1: Remove old components and API**

```bash
rm -rf apps/web/src/components/image-extractor.tsx
rm -rf apps/web/src/components/url-form.tsx
rm -rf apps/web/src/components/image-results.tsx
rm -rf apps/web/src/components/tool-progress.tsx
rm -rf apps/web/src/components/shimmer-text.tsx
rm -rf apps/web/src/app/api/chat
rm -rf apps/web/src/lib/agent
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove legacy AI agent components"
```

---

### Task 12: Create URL Input Component

**Files:**
- Create: `apps/web/src/components/url-input.tsx`

**Step 1: Write the component**

```typescript
// apps/web/src/components/url-input.tsx
'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  placeholder?: string;
  buttonText?: string;
};

export function UrlInput({ onSubmit, isLoading, placeholder, buttonText }: Props) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder ?? 'Paste image or page URL...'}
        className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={!url.trim() || isLoading}
        className="px-6 py-3 bg-[var(--accent)] text-black font-medium rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Loading...' : buttonText ?? 'Go'}
      </button>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/url-input.tsx
git commit -m "feat: add url-input component"
```

---

### Task 13: Create Image Card Component

**Files:**
- Create: `apps/web/src/components/image-card.tsx`

**Step 1: Write the component**

```typescript
// apps/web/src/components/image-card.tsx
'use client';

import { useState } from 'react';
import type { ResolveResult } from '@/lib/resolver';

type Props = {
  result: ResolveResult;
};

export function ImageCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.resolved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
      <a
        href={result.resolved}
        target="_blank"
        rel="noopener noreferrer"
        className="block aspect-square"
      >
        <img
          src={result.resolved}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <a
          href={result.resolved}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-white text-black text-sm font-medium rounded hover:bg-gray-100"
        >
          Open
        </a>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-[var(--accent)] text-black text-sm font-medium rounded hover:bg-[var(--accent-hover)]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 text-xs text-white/80">
          <span className="px-1.5 py-0.5 bg-white/20 rounded">
            {result.method}
          </span>
          {result.sizeIncrease && (
            <span className="text-green-400">+{result.sizeIncrease}</span>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/image-card.tsx
git commit -m "feat: add image-card component"
```

---

### Task 14: Create Image Grid Component

**Files:**
- Create: `apps/web/src/components/image-grid.tsx`

**Step 1: Write the component**

```typescript
// apps/web/src/components/image-grid.tsx
'use client';

import { useState } from 'react';
import { ImageCard } from './image-card';
import type { ResolveResult } from '@/lib/resolver';

type Props = {
  results: ResolveResult[];
};

export function ImageGrid({ results }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = async () => {
    const urls = results.map(r => r.resolved).join('\n');
    await navigator.clipboard.writeText(urls);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">
          {results.length} image{results.length !== 1 ? 's' : ''} found
        </p>
        <button
          onClick={handleCopyAll}
          className="px-3 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded hover:border-[var(--accent)] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy All URLs'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((result, i) => (
          <ImageCard key={i} result={result} />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/image-grid.tsx
git commit -m "feat: add image-grid component"
```

---

### Task 15: Create Comparison View Component

**Files:**
- Create: `apps/web/src/components/comparison-view.tsx`

**Step 1: Write the component**

```typescript
// apps/web/src/components/comparison-view.tsx
'use client';

import { useState } from 'react';
import type { ResolveResult } from '@/lib/resolver';

type Props = {
  result: ResolveResult;
};

export function ComparisonView({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.resolved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isImproved = result.resolved !== result.original;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          result.method === 'fallback'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-green-500/20 text-green-400'
        }`}>
          {result.method}
        </span>
        {result.confidence && (
          <span className="text-xs text-[var(--text-muted)]">
            {Math.round(result.confidence * 100)}% confidence
          </span>
        )}
        {result.sizeIncrease && (
          <span className="text-xs text-green-400">
            +{result.sizeIncrease} larger
          </span>
        )}
      </div>

      <div className={`grid gap-4 ${isImproved ? 'md:grid-cols-2' : ''}`}>
        {isImproved && (
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Original</p>
            <div className="aspect-video bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
              <img
                src={result.original}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
            {isImproved ? 'Resolved' : 'Image'}
          </p>
          <div className="aspect-video bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden">
            <img
              src={result.resolved}
              alt="Resolved"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={result.resolved}
          readOnly
          className="flex-1 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded text-sm text-[var(--text-muted)] font-mono"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-[var(--accent)] text-black font-medium rounded hover:bg-[var(--accent-hover)] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <a
          href={result.resolved}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[var(--border)] rounded hover:border-[var(--accent)] transition-colors"
        >
          Open
        </a>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/components/comparison-view.tsx
git commit -m "feat: add comparison-view component"
```

---

### Task 16: Create Main Page

**Files:**
- Modify: `apps/web/src/app/page.tsx`

**Step 1: Write the page**

```typescript
// apps/web/src/app/page.tsx
'use client';

import { useState } from 'react';
import { UrlInput } from '@/components/url-input';
import { ComparisonView } from '@/components/comparison-view';
import { ImageGrid } from '@/components/image-grid';
import type { ResolveResult } from '@/lib/resolver';

type Mode = 'transform' | 'scrape';

export default function Home() {
  const [mode, setMode] = useState<Mode>('transform');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transformResult, setTransformResult] = useState<ResolveResult | null>(null);
  const [scrapeResults, setScrapeResults] = useState<ResolveResult[]>([]);

  const handleTransform = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTransformResult(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform URL');
      }

      setTransformResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrape = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setScrapeResults([]);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape page');
      }

      setScrapeResults(data.images);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Beeline</h1>
          <p className="text-[var(--text-muted)]">
            Get the source. Skip the resizing.
          </p>
        </header>

        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setMode('transform')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'transform'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Single URL
            </button>
            <button
              onClick={() => setMode('scrape')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'scrape'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Scrape Page
            </button>
          </div>

          {/* Input */}
          <UrlInput
            onSubmit={mode === 'transform' ? handleTransform : handleScrape}
            isLoading={isLoading}
            placeholder={
              mode === 'transform'
                ? 'Paste an image URL...'
                : 'Paste a webpage URL...'
            }
            buttonText={mode === 'transform' ? 'Get Source' : 'Extract All'}
          />

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Results */}
          {mode === 'transform' && transformResult && (
            <ComparisonView result={transformResult} />
          )}

          {mode === 'scrape' && scrapeResults.length > 0 && (
            <ImageGrid results={scrapeResults} />
          )}
        </div>
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat: create main page with transform and scrape modes"
```

---

## Phase 5: Cleanup

### Task 17: Remove AI SDK Dependencies

**Step 1: Uninstall packages**

```bash
pnpm remove ai @ai-sdk/openai @ai-sdk/google --filter web
```

**Step 2: Remove unused tool files**

```bash
rm -rf apps/web/src/lib/tools/analyze-rendered-sizes.ts
rm -rf apps/web/src/lib/tools/find-source-url.ts
rm -rf apps/web/src/lib/tools/learn-pattern.ts
rm -rf apps/web/src/lib/tools/validate-image-url.ts
rm -rf apps/web/src/lib/tools/match-known-patterns.ts
rm -rf apps/web/src/lib/tools/types.ts
rm -rf apps/web/src/lib/tools/tools.ts
```

**Step 3: Update imports if needed**

Check for any remaining imports from deleted files and update.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove AI SDK and unused tool files"
```

---

### Task 18: Final Verification

**Step 1: Run type check**

```bash
pnpm --filter web typecheck
```

Expected: No errors

**Step 2: Run tests**

```bash
pnpm --filter web test
```

Expected: All tests pass

**Step 3: Run dev server and test manually**

```bash
pnpm dev
```

Test both endpoints:
- Transform: Paste a Condé Nast image URL
- Scrape: Paste the House & Garden decoration page

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address issues from final verification"
```

---

## Summary

**18 tasks** covering:
- Database setup (Tasks 1-4)
- Core resolver engine (Tasks 5-8)
- API endpoints (Tasks 9-10)
- Frontend components (Tasks 11-16)
- Cleanup (Tasks 17-18)

Each task is designed to be completed in 5-15 minutes with clear verification steps.
