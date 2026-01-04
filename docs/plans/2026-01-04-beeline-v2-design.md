# Beeline v2 - Image Source Resolver

**Date:** 2026-01-04
**Status:** Ready for Implementation

## Overview

A self-improving image URL resolver that transforms CDN/resized image URLs into their highest-quality source versions. Learns patterns over time and works across web UI, API, and browser extension.

## Goals

- Transform any resized/cropped image URL → full-quality source URL
- Scrape webpages to extract and resolve all images
- Learn new CDN patterns automatically through probing
- Serve three interfaces: Web UI, REST API, Browser Extension

## Architecture

### Core Engine

Single `resolve(imageUrl)` function:

1. Check curated patterns (patterns.json) - instant match
2. Check learned patterns (Postgres) - fast lookup
3. If no match: probe the CDN (5-10 attempts)
4. If probe succeeds: learn pattern → save to Postgres
5. Return best URL found (or original as fallback)

### API Endpoints

| Endpoint | Input | Output | Use Case |
|----------|-------|--------|----------|
| `POST /api/transform` | Single image URL | Source URL | Extension, API clients |
| `POST /api/scrape` | Webpage URL | Array of source URLs | Web UI, bulk extraction |

### Storage

| Store | Contents | Purpose |
|-------|----------|---------|
| `patterns.json` | Curated CDN patterns | Ships with app, version controlled |
| Postgres `patterns` | Learned patterns | Auto-discovered, persisted |
| Postgres `cache` | URL → result cache | Avoid re-resolving same URLs |

## Pattern Matching

### Pattern Structure

```json
{
  "domain": "media.houseandgarden.co.uk",
  "match": "^(https?://media\\.[^/]+/photos/[a-f0-9]{24})(?:/.*)?$",
  "transform": "$1/master/w_2560,c_limit/image.jpg",
  "confidence": 0.95,
  "successes": 142
}
```

### Resolution Flow

```
URL comes in
    ↓
Match against curated patterns (patterns.json)
    ↓ no match
Match against learned patterns (Postgres, ordered by confidence)
    ↓ no match
Run probing sequence:
    1. Strip query params (w=, h=, width=, height=, q=, etc.)
    2. Try removing size suffixes (_800x600, -small, -thumb)
    3. Try larger dimensions (w_2560, width=2560)
    4. Try "original"/"master"/"full" path variants
    5. Try removing transformation path segments
    ↓
Validate each attempt (HEAD request - is it an image? is it larger?)
    ↓
If better image found:
    - Extract pattern from original → result transformation
    - Save to Postgres with confidence based on probe depth
    ↓
Return best URL (or original if nothing worked)
```

### Validation

A transformed URL is "better" if:
- Returns HTTP 200 with `Content-Type: image/*`
- Has larger `Content-Length` than original

## Database Schema

```sql
-- Learned URL patterns
CREATE TABLE patterns (
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
CREATE TABLE cache (
  original_url TEXT PRIMARY KEY,
  resolved_url TEXT NOT NULL,
  pattern_id INT REFERENCES patterns(id),
  resolved_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_patterns_domain ON patterns(domain);
CREATE INDEX idx_cache_expires ON cache(expires_at);
```

### Confidence Scoring

- Starts at 0.5 when pattern is first learned
- +0.1 per success (caps at 0.99)
- -0.2 per failure
- Patterns below 0.2 confidence get deleted

## API Design

### POST /api/transform

```json
// Request
{ "url": "https://media.site.com/photos/abc123/1:1/w_400/thumb.jpg" }

// Response
{
  "original": "https://media.site.com/photos/abc123/1:1/w_400/thumb.jpg",
  "resolved": "https://media.site.com/photos/abc123/master/w_2560/image.jpg",
  "method": "pattern",
  "confidence": 0.95,
  "sizeIncrease": "6.2x"
}
```

### POST /api/scrape

```json
// Request
{ "url": "https://www.houseandgarden.co.uk/topic/decoration" }

// Response
{
  "page": "https://www.houseandgarden.co.uk/topic/decoration",
  "images": [
    {
      "original": "https://media..../1:1/w_400/thumb.jpg",
      "resolved": "https://media..../master/w_2560/image.jpg",
      "method": "pattern"
    }
  ],
  "count": 20
}
```

### Error Codes

- `INVALID_URL` - Malformed URL provided
- `FETCH_FAILED` - Could not fetch page/image
- `NO_IMAGES` - No images found on page

## Frontend

### Structure

```
/app
  page.tsx              -- main UI with both modes
  /api/transform        -- single URL endpoint
  /api/scrape           -- page scrape endpoint
/components
  url-input.tsx         -- input + button
  image-card.tsx        -- thumbnail + copy action
  image-grid.tsx        -- grid of image-cards
  comparison-view.tsx   -- original vs resolved
```

### UI Modes

**Mode 1: Single URL Transform**
- Paste image URL → see original vs resolved side by side
- Copy resolved URL

**Mode 2: Page Scrape**
- Paste webpage URL → see grid of resolved images
- Copy all URLs or individual

### Tech Stack

- Next.js App Router
- Tailwind CSS
- Dark theme
- React hooks only (no state libraries)

## Migration Plan

### Delete

- `/app/api/chat/` - Replace with new endpoints
- `/lib/agent/` - AI agent code
- `/components/image-extractor.tsx` - Chat-based UI
- `/components/tool-progress.tsx` - Streaming UI
- `/components/shimmer-text.tsx` - Streaming UI
- AI SDK dependencies (`ai`, `@ai-sdk/*`)

### Keep & Refactor

- `/lib/tools/scrape-webpage.ts` - ScrapingBee integration
- `/lib/tools/extract-image-elements.ts` - Cheerio parsing
- `/lib/tools/match-known-patterns.ts` - Refactor into resolver
- `/data/patterns.json` - Curated patterns
- Dark theme CSS variables

### Add New

- `/lib/resolver.ts` - Core resolve() engine
- `/lib/prober.ts` - CDN probing logic
- `/lib/db.ts` - Postgres connection + queries
