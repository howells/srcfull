# Beeline Public API Design

## Overview

A public SaaS API that allows developers to scrape webpages and receive resolved high-quality image URLs with metadata.

## Architecture

### Auth Flow

- Polar for customer identity and future payments (same pattern as faceplacer)
- Email-only signup, session cookies for dashboard
- API keys for programmatic access (stored hashed, shown once on creation)

### API Structure

```
/api/v1/
├── /scrape          POST - Scrape a URL for images (requires API key)
├── /transform       POST - Transform a single image URL (requires API key)

/api/
├── /auth/signup     POST - Create user + Polar customer
├── /auth/session    GET  - Get current user from session
├── /auth/logout     POST - Clear session cookie
├── /keys            GET  - List user's API keys
├── /keys            POST - Generate new key
├── /keys/:id        DELETE - Revoke a key
├── /usage           GET  - Get usage stats
```

## Database Schema

### users

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| email | text | Unique |
| name | text | Optional |
| polarCustomerId | text | Polar customer ID |
| plan | text | "free" or "pro" |
| createdAt | timestamp | |

### api_keys

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| userId | uuid | FK → users |
| keyHash | text | bcrypt hash of full key |
| keyPrefix | text | First 8 chars for display (e.g., "sk_live_abc") |
| name | text | User-defined label |
| createdAt | timestamp | |
| lastUsedAt | timestamp | Updated on each use |

### usage_logs

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| apiKeyId | uuid | FK → api_keys |
| endpoint | text | "/scrape" or "/transform" |
| statusCode | integer | HTTP status returned |
| responseTimeMs | integer | Request duration |
| createdAt | timestamp | |

## API Response Format

### Scrape Endpoint

**Request:**
```
POST /api/v1/scrape
Authorization: Bearer sk_live_abc123...
Content-Type: application/json

{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com/article",
  "images": [
    {
      "original": "https://cdn.example.com/img/hero-400x300.jpg",
      "resolved": "https://cdn.example.com/img/hero.jpg",
      "originalSize": 45000,
      "resolvedSize": 890000,
      "sizeIncrease": "19.8x",
      "alt": "Mountain landscape at sunset",
      "context": "hero",
      "method": "pattern"
    }
  ],
  "stats": {
    "found": 12,
    "resolved": 10,
    "failed": 2,
    "durationMs": 4523
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "The provided URL is not valid"
  }
}
```

### Error Codes

| Code | Status | When |
|------|--------|------|
| UNAUTHORIZED | 401 | Missing or invalid API key |
| INVALID_URL | 400 | URL is malformed or empty |
| SCRAPE_FAILED | 502 | Couldn't fetch the target page |
| SCRAPE_TIMEOUT | 504 | Page took too long (>30s) |
| NO_IMAGES_FOUND | 200 | Success, but page had no images |
| RATE_LIMITED | 429 | Too many requests (future) |

## API Key Format

Format: `sk_live_` + 32 random alphanumeric characters

Example: `sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

Security:
- Full key shown only once on creation
- Only hash stored in database
- Prefix stored for display in dashboard

## MVP Scope

### Included

- Polar-based auth (email signup, session cookies)
- API key generation and management
- `/scrape` and `/transform` endpoints
- Usage tracking (logged but not enforced)
- Simple dashboard (keys, usage stats)

### Excluded (Future)

- Rate limit enforcement
- Paid tiers/billing integration
- Async job queue
- Public API documentation site
- Webhooks for users

## New Files

```
apps/web/src/
├── app/
│   ├── api/v1/scrape/route.ts
│   ├── api/v1/transform/route.ts
│   ├── api/auth/signup/route.ts
│   ├── api/auth/session/route.ts
│   ├── api/auth/logout/route.ts
│   ├── api/keys/route.ts
│   ├── api/keys/[id]/route.ts
│   └── api/usage/route.ts
├── dashboard/
│   ├── page.tsx
│   └── layout.tsx
├── db/schema.ts                 # Add users, api_keys, usage_logs
└── lib/
    ├── polar.ts                 # Polar client
    └── api-auth.ts              # Key validation helper
```

## Technical Decisions

- **Synchronous requests** - Scraping blocks until complete (simpler for clients)
- **Soft rate limiting** - Track usage now, enforce limits later once patterns emerge
- **Polar over Clerk** - Simpler, already used in faceplacer, handles future payments
