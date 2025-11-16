# Beeline

AI-powered tool that extracts clean, full-resolution image URLs from web pages.

## Features

- 🤖 AI agent with specialized tools for image extraction
- 🎯 Identifies "main" images (largest rendered)
- 🧹 Returns clean source URLs without resizing parameters
- 📚 Learns URL patterns for common CDNs (Shopify, Sanity, Cloudinary, etc.)
- 🔄 Dual interface: Rich streaming UI + REST API
- ⚡ Built with Next.js App Router and AI SDK v5

## Architecture

Turborepo monorepo with:
- `apps/web` - Next.js application
- `packages/ui` - Shared UI components
- `data/patterns.json` - Learned URL patterns

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Environment Variables

Create `apps/web/.env.local`:

```env
SCRAPINGBEE_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
pnpm build
```

## API Usage

### REST API

```bash
curl -X POST http://localhost:3000/api/extract-images \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

Response:
```json
{
  "images": [
    "https://cdn.example.com/image1.jpg",
    "https://cdn.example.com/image2.jpg"
  ]
}
```

## How It Works

1. **Scrape** - Fetches webpage HTML via ScrapingBee
2. **Extract** - Parses img, picture, and background-image elements
3. **Analyze** - Identifies largest rendered images (>200px)
4. **Resolve** - Finds clean source URLs using:
   - Known pattern matching
   - Largest srcset variant
   - Query parameter stripping
   - URL validation
5. **Learn** - Saves new patterns for future use

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- AI SDK v5 with Gemini Flash 2.5
- OpenRouter
- ScrapingBee
- Cheerio
- Tailwind CSS
