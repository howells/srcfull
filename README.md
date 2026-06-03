# Srcfull

`srcfull` is a package-first toolkit for extracting and upgrading web image URLs.

It is designed as a standalone library and CLI for image extraction and source resolution. The focus is:

- extract image candidates from HTML
- filter obvious junk like logos and icons
- resolve CDN/transformed URLs back to larger originals
- probe likely source variants when no curated pattern exists
- optionally plug in HTML fetchers like ScrapingBee, Browserbase, and Kernel, plus fallback image providers like Firecrawl

It handles the page-shape problems that usually make this kind of package annoying in practice:

- relative image paths resolved against the page URL
- lazy-loaded image attributes like `data-src`, `data-srcset`, and `data-original`
- `img srcset`, `picture source`, inline background images, and social/meta image tags
- private-host blocking for both page scraping and image validation
- `HEAD` fallback to ranged `GET` for hosts that refuse metadata requests
- persistent file-backed cache/pattern stores for repeat runs

## Install

```bash
pnpm add @howells/srcfull
```

## Library Usage

```ts
import { scrapePage, resolveImageUrl } from "@howells/srcfull";

const resolved = await resolveImageUrl(
  "https://cdn.example.com/image.jpg?w=400&q=80"
);

const page = await scrapePage("https://example.com/product-page");
```

`scrapePage()` normalizes relative candidates against the page URL before validation and resolution, so typical product/article HTML works without extra preprocessing.

If you need rendered HTML instead of plain `fetch`, inject a custom fetcher:

```ts
import { scrapePage } from "@howells/srcfull";
import { createScrapingBeeHtmlFetcher } from "@howells/srcfull/providers/scrapingbee";

const fetchHtml = createScrapingBeeHtmlFetcher({
  apiKey: process.env.SCRAPINGBEE_API_KEY!,
});

const result = await scrapePage("https://example.com", { fetchHtml });
```

For hosted browser rendering without adding Playwright to your app, use Kernel:

```ts
import { scrapePage } from "@howells/srcfull";
import { createKernelHtmlFetcher } from "@howells/srcfull/providers/kernel";

const fetchHtml = createKernelHtmlFetcher({
  apiKey: process.env.KERNEL_API_KEY!,
  stealth: true,
});

const result = await scrapePage("https://example.com", { fetchHtml });
```

For fast raw HTML through Browserbase's Fetch API:

```ts
import { scrapePage } from "@howells/srcfull";
import { createBrowserbaseFetchHtmlFetcher } from "@howells/srcfull/providers/browserbase";

const fetchHtml = createBrowserbaseFetchHtmlFetcher({
  apiKey: process.env.BROWSERBASE_API_KEY!,
  proxies: true,
});

const result = await scrapePage("https://example.com", { fetchHtml });
```

If you want the built-in fetcher with different timeout or header behavior:

```ts
import { createDefaultHtmlFetcher, scrapePage } from "@howells/srcfull";

const fetchHtml = createDefaultHtmlFetcher({
  timeoutMs: 15_000,
  headers: {
    "Accept-Language": "en-GB,en;q=0.9",
  },
});

const result = await scrapePage("https://example.com", { fetchHtml });
```

For image-only fallback:

```ts
import { createFirecrawlImageFallback } from "@howells/srcfull/providers/firecrawl";
```

If you want candidate extraction without the rest of the pipeline:

```ts
import { extractImageCandidatesFromHtml } from "@howells/srcfull";

const candidates = extractImageCandidatesFromHtml(
  html,
  "https://example.com/product-page"
);
```

For repeat jobs, persist cache and learned patterns on disk:

```ts
import {
  createFileCache,
  createFilePatternStore,
  resolveImageUrl,
} from "@howells/srcfull";

const cache = createFileCache({ filePath: ".srcfull/cache.json" });
const patternStore = createFilePatternStore({
  filePath: ".srcfull/patterns.json",
});

const result = await resolveImageUrl("https://cdn.example.com/photo.jpg?w=400", {
  cache,
  patternStore,
});
```

## CLI

```bash
srcfull resolve 'https://cdn.example.com/photo.jpg?w=300'
srcfull scrape 'https://example.com/listing' --max-images=12
srcfull scrape 'https://example.com/listing' --max-images=12 --min-size=300 --resolve-concurrency=8
srcfull scrape 'https://example.com/listing' --fetcher=kernel
srcfull --version
```

The JSON response from `scrape` includes `stats.returned` as well as `found`, `resolved`, `failed`, and `durationMs`.

## Demo Page

There is a self-contained demo page generated at `demo/index.html`.

```bash
pnpm demo:build
pnpm demo:serve
```

The page is generated from real calls to the package, so the HTML samples, extracted candidates, resolved URLs, and persisted cache/pattern snapshots are actual outputs rather than hand-written mockups.

## Development

```bash
pnpm test
pnpm test:live-patterns
pnpm typecheck
pnpm build
```

`pnpm test:live-patterns` revalidates the researched real-world CDN fixtures in `test/fixtures/curated-patterns.json` against the network.
