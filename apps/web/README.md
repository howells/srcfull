# Web App

Next.js app for Beeline (dashboard + API).

## Development

```bash
pnpm dev
```

## API Endpoints

- `POST /api/v1/scrape` - scrape a page and resolve image URLs (API key required)
- `POST /api/v1/transform` - resolve a single image URL (API key required)
- `GET /api/checkout` - Polar checkout (subscription)
- `GET /api/portal` - Polar customer portal
- `POST /api/webhooks/polar` - Polar webhook receiver

## Environment Variables

See `.env.local.example`.
