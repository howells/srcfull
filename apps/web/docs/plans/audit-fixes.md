# Audit Fixes Plan

**Created:** 2026-01-28
**Status:** Complete (All actionable items done)
**Estimated Total:** ~18 hours

---

## Completed

### Critical (Done)
- [x] Timing attack fix — constant-time key validation with dummy hash
- [x] Database indexes — 6 indexes added (patterns, cache, api_keys, usage_logs)
- [x] N+1 query fix — consolidated to single query with conditional aggregation

### High Priority (Done)
- [x] Rate limiting — 100 req/min per API key on /api/v1/* routes
- [x] SSRF protection — blocks private IPs, localhost, metadata endpoints
- [x] Concurrency limit — max 5 concurrent outbound HTTP requests
- [x] Auth flow tests — 14 new tests for session and API keys (55 total)

### Medium Priority (Done)
- [x] Error handling consistency — `src/lib/api-response.ts` with `apiError()` and `apiSuccess()`
- [x] Cache cleanup job — `src/app/api/cron/cleanup/route.ts` + vercel.json cron at 3 AM daily
- [x] Environment variable validation — `src/lib/env.ts` with `validateEnv()` + `src/instrumentation.ts`

### New Files Created
- `src/lib/rate-limit.ts` — in-memory rate limiter
- `src/lib/url-validator.ts` — SSRF protection
- `src/lib/concurrency.ts` — request concurrency limiter
- `src/lib/api-response.ts` — standardized API error/success responses
- `src/lib/session.test.ts` — session tests
- `src/app/api/keys/route.test.ts` — API keys tests
- `src/app/api/cron/cleanup/route.ts` — cache cleanup cron job
- `src/instrumentation.ts` — startup env validation
- `vercel.json` — cron job configuration

---

## Critical (Fix Today) — ~3.5 hours

### 1. Timing Attack in API Key Validation
**File:** `src/lib/api-auth.ts`
**Risk:** Attackers can probe for valid key prefixes by measuring response times
**Fix:**
- Use constant-time comparison for key verification
- Add artificial delay to normalize response times regardless of match
- Consider using `crypto.timingSafeEqual()` for hash comparison

```typescript
import { timingSafeEqual } from "crypto";

// Compare in constant time
const isValid = timingSafeEqual(
  Buffer.from(computedHash),
  Buffer.from(storedHash)
);
```

**Time:** 30 min

---

### 2. Missing Database Indexes
**File:** `src/db/schema.ts`
**Risk:** Query performance degrades as tables grow
**Fix:** Add indexes for frequently queried columns:

```sql
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_usage_logs_api_key_id ON usage_logs(api_key_id);
CREATE INDEX idx_usage_logs_created_at ON usage_logs(created_at);
CREATE INDEX idx_cache_expires_at ON cache(expires_at);
CREATE INDEX idx_patterns_domain ON patterns(domain);
```

**Time:** 30 min

---

### 3. N+1 Query in Usage Stats
**File:** `src/app/api/usage/route.ts`
**Risk:** Performance issue with multiple API keys
**Fix:** Use a single aggregated query instead of looping:

```typescript
const stats = await db
  .select({
    apiKeyId: usageLogs.apiKeyId,
    count: sql<number>`count(*)`,
    avgResponseTime: sql<number>`avg(response_time_ms)`,
  })
  .from(usageLogs)
  .where(eq(usageLogs.apiKeyId, sql`ANY(${userKeyIds})`))
  .groupBy(usageLogs.apiKeyId);
```

**Time:** 1 hour

---

## High Priority (This Week) — ~8 hours

### 4. Rate Limiting
**Files:** `src/app/api/v1/scrape/route.ts`, `src/app/api/v1/transform/route.ts`
**Risk:** API abuse, cost overruns from ScrapingBee/Firecrawl
**Fix:**
- Add rate limiting middleware using Upstash Redis or in-memory store
- Suggested limits: 100 requests/minute per API key
- Return `429 Too Many Requests` when exceeded

**Time:** 2 hours

---

### 5. SSRF Protection
**Files:** `src/lib/tools/scrape-webpage.ts`, `src/lib/prober.ts`
**Risk:** Attackers can probe internal networks via URL parameters
**Fix:**
- Validate URLs before fetching
- Block private IP ranges (10.x, 172.16-31.x, 192.168.x, 127.x, localhost)
- Block internal hostnames

```typescript
function isPrivateUrl(url: string): boolean {
  const { hostname } = new URL(url);
  const privatePatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^169\.254\./,
  ];
  return privatePatterns.some(p => p.test(hostname));
}
```

**Time:** 1 hour

---

### 6. Unbounded Concurrency in Prober
**File:** `src/lib/prober.ts`
**Risk:** Can overwhelm target servers or exhaust connections
**Fix:**
- Add concurrency limit using p-limit or similar
- Current: unlimited `Promise.all()`
- Target: max 5 concurrent probes

**Time:** 30 min

---

### 7. Missing Auth Flow Tests
**Files:** `src/lib/session.ts`, `src/app/api/keys/route.ts`
**Risk:** Regressions in critical auth paths
**Fix:** Add tests for:
- Session creation for new Clerk users
- Email-based auto-linking for existing users
- API key creation/deletion
- Plan-gated access checks

**Time:** 3 hours

---

## Medium Priority (This Sprint) — ~6 hours

### 8. Error Handling Consistency ✅
**Files:** Various API routes
**Issue:** Inconsistent error response formats
**Fix:** Created `src/lib/api-response.ts` with `apiError()` and `apiSuccess()` helpers

---

### 9. Request Validation
**Files:** API routes
**Issue:** Some routes missing Zod validation
**Fix:** Add schema validation to all POST endpoints (already done for v1 routes)

---

### 10. Logging & Observability
**Issue:** Console.log only, no structured logging
**Fix:** Deferred — current logging sufficient for MVP

---

### 11. Cache Cleanup Job ✅
**File:** `src/app/api/cron/cleanup/route.ts`
**Fix:** Added Vercel cron job at 3 AM daily + `CRON_SECRET` auth

---

### 12. Environment Variable Validation ✅
**File:** `src/lib/env.ts`, `src/instrumentation.ts`
**Fix:** Added `validateEnv()` that runs at startup via Next.js instrumentation

---

## Low Priority (Backlog)

- [x] Add OpenAPI/Swagger documentation — `src/app/api/v1/openapi.json/route.ts`
- [ ] Add request/response logging middleware
- [ ] Consider adding API versioning strategy
- [x] Add health check endpoint — `src/app/api/health/route.ts`
- [ ] Consider adding webhook retry logic for Clerk events

---

## Implementation Order

1. **Today:** Items 1-3 (Critical security & performance)
2. **Tomorrow:** Items 4-5 (Rate limiting & SSRF)
3. **This week:** Items 6-7 (Concurrency & tests)
4. **Next sprint:** Items 8-12 (Polish)

---

## Verification

After each fix:
- [ ] Run `pnpm test`
- [ ] Run `pnpm build`
- [ ] Manual smoke test of affected endpoint
- [ ] Deploy to preview and verify
