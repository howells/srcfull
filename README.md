# Beeline

Beeline is a paid-only API that extracts clean, full-resolution image URLs from web pages.

## What You Get

- **Public API**: scrape a page and return resolved image URLs
- **Resolver**: upgrades CDN URLs (query params, srcset, known transforms, probing)
- **Dashboard**: subscribe (Polar), create/revoke API keys, view usage

## Repo Layout

- `apps/web` — Next.js app (dashboard + API)
- `packages/ui` — shared UI components
- `data/patterns.json` — curated URL transform patterns

## Prerequisites

- Node.js `>=20.9.0`
- pnpm `9.x`

## Setup

```bash
pnpm install
cp apps/web/.env.local.example apps/web/.env.local
pnpm --filter web db:push
```

## Run

```bash
pnpm dev
```

Open `http://localhost:13000`.

## API

Create an API key in the dashboard, then:

```bash
curl -X POST http://localhost:13000/api/v1/transform \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/image.jpg"}'
```

```bash
curl -X POST http://localhost:13000/api/v1/scrape \
  -H "Authorization: Bearer sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","maxImages":20}'
```

## Scripts

- `pnpm dev` — run all apps (Turborepo)
- `pnpm lint` — Biome checks
- `pnpm --filter web test` — unit tests (Vitest)
- `pnpm build` — production build (Next.js)
