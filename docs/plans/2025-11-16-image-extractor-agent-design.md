# AI Agent Image Extractor - Design Document

**Date:** 2025-11-16
**Project:** Beeline
**Status:** Ready for Implementation

## Overview

An AI-powered tool that extracts clean, full-resolution source URLs from web pages. The system uses an agentic architecture with specialized tools to handle various image hosting patterns, learn URL transformation rules, and return the largest, cleanest image URLs possible.

## Goals

- Extract "main" images from any web page (largest rendered images)
- Return clean source URLs with resizing parameters removed
- Handle images in `<img>`, `<picture>`, and CSS `background-image`
- Learn and remember URL patterns across common hosting platforms
- Provide both a rich streaming UI and a REST API

## Architecture

### Turborepo Structure

```
beeline/
├── apps/
│   └── web/              # Next.js app (App Router + TypeScript)
├── packages/
│   └── ui/               # UI components (copied from materia)
├── data/
│   └── patterns.json     # Learned URL patterns
├── turbo.json
└── package.json
```

### Technology Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **AI:** AI SDK v5 with Gemini Flash 2.5 via OpenRouter
- **Scraping:** ScrapingBee API
- **HTML Parsing:** Cheerio
- **Styling:** Tailwind CSS (via @repo/ui components)

### Dual Interface

**1. Rich Streaming UI** (`/`)
- Uses AI SDK UI components (`useChat`, streaming)
- Shows real-time agent thinking and tool executions
- Displays chain-of-thought reasoning
- Development: verbose output; Production: simple with optional detail
- Uses components from `@repo/ui` package exclusively

**2. REST API** (`/api/extract-images`)
- For programmatic access
- Returns final JSON only
- Same agent, no streaming

```
POST /api/extract-images
Body: { url: string }
Response: { images: string[] }
```

## Agent Architecture

### Core Strategy

The agent orchestrates image extraction through specialized tools, using an iterative approach:

1. Check learned patterns (fast, no API calls)
2. Try largest srcset variant
3. Strip known resizing query parameters
4. Validate each attempt (HEAD request for 200 response)
5. Use AI reasoning as last resort

### Agent Tools

**1. `scrapeWebpage(url: string)`**
- Uses ScrapingBee API with `render_js=true` for lazy-loaded images
- Returns HTML content
- Handles retries with exponential backoff

**2. `extractImageElements(html: string)`**
- Parses HTML for `<img>`, `<picture>`, CSS `background-image`
- Extracts all URLs including srcset variants
- Returns candidates with metadata (tag type, srcset values, dimensions)

**3. `analyzeRenderedSizes(images: ImageCandidate[])`**
- Determines largest rendered images based on srcset, width/height attributes
- Filters out small images (< 200px width)
- Returns prioritized "main" image candidates

**4. `matchKnownPatterns(url: string)`**
- Checks URL against patterns.json
- Applies known transformations for matched platforms
- Returns source URL or null

**5. `findSourceUrl(imageUrl: string)`**
- Tries multiple strategies: largest srcset → strip resizing params → pattern variations
- Returns array of candidate source URLs to validate
- Preserves non-resizing params (auth tokens, signatures)

**6. `validateImageUrl(url: string)`**
- HEAD request to check 200 response
- Returns boolean
- Handles CORS and authentication errors gracefully

**7. `learnPattern(originalUrl: string, sourceUrl: string, domain: string)`**
- Extracts pattern from successful URL resolution
- Updates patterns.json with new pattern
- Deduplicates and tracks confidence scores

## Data Flow

1. User submits URL → UI calls `/api/chat` (streaming) or external API calls `/api/extract-images`
2. Agent receives task: "Extract main images from [URL]"
3. Tool execution sequence:
   - `scrapeWebpage` → get HTML
   - `extractImageElements` → find all image sources
   - `analyzeRenderedSizes` → identify main images
   - For each main image:
     - `matchKnownPatterns` → check learned patterns
     - `findSourceUrl` → generate candidate source URLs
     - `validateImageUrl` → verify each candidate
     - `learnPattern` → save successful transformations
4. Return deduplicated array of clean URLs (order discovered, no sorting)

## Pattern Learning System

### patterns.json Structure

```json
{
  "shopify": {
    "pattern": "cdn.shopify.com/s/files/{hash}/{filename}",
    "strip": ["_\\d+x\\d+", "v=\\d+"],
    "confidence": "high"
  },
  "sanity": {
    "pattern": "cdn.sanity.io/images/{project}/{dataset}/{hash}-{dimensions}.{ext}",
    "strip": ["\\?.*", "-\\d+x\\d+"],
    "source_format": "{base}-{original_dimensions}.{ext}",
    "confidence": "high"
  },
  "cloudinary": {
    "pattern": "res.cloudinary.com/{cloud}/image/upload/",
    "strip": ["w_\\d+", "h_\\d+", "c_\\w+", "q_\\d+", "f_\\w+"],
    "confidence": "high"
  },
  "imgix": {
    "pattern": "*.imgix.net/",
    "strip": ["w=\\d+", "h=\\d+", "fit=\\w+", "auto=\\w+", "q=\\d+"],
    "confidence": "high"
  }
}
```

### Preseeded Patterns

Include patterns for:
- Shopify CDN
- Sanity.io
- Cloudinary
- Imgix
- WordPress media library
- Generic CDN params: `w=`, `h=`, `fit=`, `q=`, `auto=`, `fm=`, `dpr=`

### Learning Process

1. Agent successfully resolves image URL
2. Compare original URL to source URL
3. Extract common pattern elements (domain, path structure, parameter patterns)
4. Update patterns.json if new pattern detected
5. Track success rate for confidence scoring
6. Continue execution even if pattern learning fails (don't block requests)

## UI Components (AI SDK)

### Streaming Experience

Users see real-time progress:

```
Agent: Scraping https://www.kvadrat.dk/...
Tool: scrapeWebpage → Success (234KB HTML)
Agent: Found 47 image candidates...
Tool: analyzeRenderedSizes → 12 main images identified
Tool: matchKnownPatterns → 8 matched known patterns
Agent: Validating remaining 4 images...
Tool: validateImageUrl → 3 validated
Agent: ✓ Extracted 11 unique source URLs
```

### Components from @repo/ui

- Form inputs for URL submission
- Loading states and progress indicators
- Results display with copy buttons
- Error boundaries and error states
- **Chain-of-thought display** using AI SDK Elements

### Development vs Production

- **Development:** Full streaming output showing all tool calls and reasoning
- **Production:** Simple "Processing..." with optional detail view

## Error Handling

### Error Categories

**1. Scraping Failures**
- ScrapingBee API errors (rate limit, timeout, 403/404)
- Invalid/unreachable URLs
- **Handling:** Retry with exponential backoff, return clear error message

**2. No Images Found**
- Page has no images meeting size threshold
- All images are sprites, SVGs, or data URIs
- **Handling:** Return empty array with explanation

**3. Validation Failures**
- All source URL candidates return 404/403
- CORS or authentication-protected images
- **Handling:** Return best-effort URL with warning, let user try manually

**4. Pattern Learning Failures**
- Can't write to patterns.json (permissions)
- Malformed pattern data
- **Handling:** Log error, continue without learning

**5. Agent Failures**
- Model timeout or API error
- Tool execution errors
- **Handling:** Graceful degradation - return partial results if any tools succeeded

### Edge Cases

- **Lazy-loaded images:** Handle with ScrapingBee's `render_js=true`
- **Authentication-required images:** Return URL but mark as "validation failed"
- **Infinite scroll:** Only process initially loaded content (documented limitation)
- **Signed/authenticated URLs:** Preserve non-resizing query params (auth tokens, signatures)
- **Duplicate detection:** Hash-based deduplication for same image at different URLs

## Environment Variables

```
SCRAPINGBEE_API_KEY=GRN37M4ZARHCAHD21AKZUKNKH4ERQ02WUGED02863UN6ZQWPGQB9CLAKZR6QRZ3N5Y20WQDFNU2GRPQH
OPENROUTER_API_KEY=(to be provided during implementation)
```

## Implementation Plan

1. Set up Turborepo structure
2. Copy UI package from ~/Sites/materia/packages/ui
3. Initialize Next.js app with TypeScript and App Router
4. Implement tools one by one:
   - `scrapeWebpage`
   - `extractImageElements`
   - `analyzeRenderedSizes`
   - `matchKnownPatterns`
   - `findSourceUrl`
   - `validateImageUrl`
   - `learnPattern`
5. Configure AI agent with tools (Gemini Flash 2.5)
6. Build API endpoint (`/api/extract-images`)
7. Build streaming chat endpoint (`/api/chat`)
8. Create UI with AI SDK components
9. Preseed patterns.json
10. Test with example URL: https://www.kvadrat.dk/en/products/upholstery/8098-aaren
11. Iterate on pattern learning and accuracy

## Testing Strategy

- **Unit tests:** Each tool in isolation
- **Integration tests:** Real ScrapingBee API calls
- **Pattern validation:** Test against known sites (Shopify, Sanity, etc.)
- **Variety testing:** E-commerce, blogs, portfolios, different frameworks
- **Edge case testing:** Lazy-loading, authentication, infinite scroll

## Success Criteria

- Correctly extracts main images from test URL (kvadrat.dk)
- Returns clean source URLs without resizing parameters
- Learns and applies patterns for common CDNs
- Streams progress in UI using AI SDK components
- API returns results within reasonable time (< 30s for typical page)
- Handles errors gracefully without crashing

## Future Enhancements

- Premium proxy support in ScrapingBee (when needed)
- Image download functionality
- Batch URL processing
- Pattern confidence scoring and refinement
- Rate limiting and authentication for API
- Caching layer for frequently accessed URLs
- Support for video extraction
