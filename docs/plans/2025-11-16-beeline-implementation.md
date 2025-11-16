# Beeline AI Image Extractor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an AI agent that extracts clean, full-resolution image URLs from web pages with pattern learning.

**Architecture:** Turborepo monorepo with Next.js App Router app. AI agent uses specialized tools (scrape, extract, analyze, validate) orchestrated by Gemini Flash 2.5. Dual interface: streaming UI with AI SDK components and REST API.

**Tech Stack:** Next.js 14, TypeScript, AI SDK v5, Zod v4, OpenRouter, ScrapingBee, Cheerio, Tailwind CSS

---

## Task 1: Initialize Turborepo Structure

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `pnpm-workspace.yaml`
- Create: `apps/web/package.json`
- Create: `.npmrc`

**Step 1: Create root package.json**

```json
{
  "name": "beeline",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "type-check": "turbo type-check"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  },
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

**Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 4: Create .npmrc**

```
auto-install-peers=true
strict-peer-dependencies=false
```

**Step 5: Install Turbo**

Run: `pnpm install`
Expected: Creates node_modules and pnpm-lock.yaml

**Step 6: Commit**

```bash
git add package.json turbo.json pnpm-workspace.yaml .npmrc pnpm-lock.yaml
git commit -m "feat: initialize Turborepo structure"
```

---

## Task 2: Copy UI Package from Materia

**Files:**
- Copy: `~/Sites/materia/packages/ui` → `packages/ui`

**Step 1: Copy UI package**

Run: `cp -R ~/Sites/materia/packages/ui packages/ui`
Expected: packages/ui directory created with all components

**Step 2: Verify copy**

Run: `ls packages/ui`
Expected: See package.json and source files

**Step 3: Commit**

```bash
git add packages/ui
git commit -m "feat: add UI package from materia"
```

---

## Task 3: Set Up Next.js App

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/.env.local`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/postcss.config.mjs`

**Step 1: Create apps/web/package.json**

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "ai": "^4.0.38",
    "@ai-sdk/openai": "^1.0.6",
    "zod": "^4.0.0-beta.2",
    "cheerio": "^1.0.0",
    "scrapingbee": "^2.1.0",
    "@repo/ui": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "typescript": "^5.7.2",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
```

**Step 2: Create apps/web/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@repo/ui": ["../../packages/ui/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create root tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  }
}
```

**Step 4: Create apps/web/next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
```

**Step 5: Create apps/web/.env.local**

```env
SCRAPINGBEE_API_KEY=GRN37M4ZARHCAHD21AKZUKNKH4ERQ02WUGED02863UN6ZQWPGQB9CLAKZR6QRZ3N5Y20WQDFNU2GRPQH
OPENROUTER_API_KEY=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
```

**Step 6: Create apps/web/tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

**Step 7: Create apps/web/postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

**Step 8: Install dependencies**

Run: `pnpm install`
Expected: All packages installed

**Step 9: Commit**

```bash
git add apps/web tsconfig.base.json
git commit -m "feat: set up Next.js app with TypeScript"
```

---

## Task 4: Create App Structure and Globals

**Files:**
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/globals.css`

**Step 1: Create apps/web/src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 2: Create apps/web/src/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beeline - AI Image Extractor",
  description: "Extract clean, full-resolution images from any web page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

**Step 3: Create apps/web/src/app/page.tsx**

```typescript
export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Beeline</h1>
      <p className="mt-2 text-gray-600">AI Image Extractor</p>
    </main>
  );
}
```

**Step 4: Test dev server**

Run: `cd apps/web && pnpm dev`
Expected: Server starts on http://localhost:3000

**Step 5: Verify in browser**

Open: http://localhost:3000
Expected: See "Beeline" heading

**Step 6: Commit**

```bash
git add apps/web/src
git commit -m "feat: create basic Next.js app structure"
```

---

## Task 5: Create Patterns Data File

**Files:**
- Create: `data/patterns.json`

**Step 1: Create data/patterns.json with preseeded patterns**

```json
{
  "shopify": {
    "domain": "cdn.shopify.com",
    "pattern": "cdn\\.shopify\\.com/s/files/[^/]+/[^/]+",
    "stripParams": ["_\\d+x\\d+", "v=\\d+", "_crop_\\w+"],
    "stripSuffixes": ["_small", "_medium", "_large", "_grande", "_master"],
    "confidence": "high",
    "examples": [
      "https://cdn.shopify.com/s/files/1/0001/2345/products/image.jpg?v=1234"
    ]
  },
  "sanity": {
    "domain": "cdn.sanity.io",
    "pattern": "cdn\\.sanity\\.io/images/[^/]+/[^/]+/[^-]+-\\d+x\\d+\\.[a-z]+",
    "stripParams": ["\\?.*"],
    "sourceTransform": "remove dimension suffix, use original dimensions if known",
    "confidence": "high",
    "examples": [
      "https://cdn.sanity.io/images/project/production/abc123-800x600.jpg?w=400"
    ]
  },
  "cloudinary": {
    "domain": "res.cloudinary.com",
    "pattern": "res\\.cloudinary\\.com/[^/]+/image/upload/",
    "stripParams": ["w_\\d+", "h_\\d+", "c_\\w+", "q_\\d+", "f_\\w+", "dpr_[\\d.]+"],
    "preservePath": "everything after /upload/",
    "confidence": "high",
    "examples": [
      "https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill/sample.jpg"
    ]
  },
  "imgix": {
    "domain": ".imgix.net",
    "pattern": "\\.imgix\\.net/",
    "stripParams": ["w=\\d+", "h=\\d+", "fit=\\w+", "auto=\\w+", "q=\\d+", "fm=\\w+", "dpr=\\d+"],
    "confidence": "high",
    "examples": [
      "https://assets.imgix.net/image.jpg?w=800&h=600&fit=crop&auto=format"
    ]
  },
  "wordpress": {
    "domain": "wp-content/uploads",
    "pattern": "wp-content/uploads/\\d{4}/\\d{2}/",
    "stripSuffixes": ["-\\d+x\\d+"],
    "confidence": "medium",
    "examples": [
      "https://example.com/wp-content/uploads/2024/01/image-800x600.jpg"
    ]
  },
  "generic": {
    "domain": "*",
    "stripParams": ["w=\\d+", "h=\\d+", "width=\\d+", "height=\\d+", "resize=\\d+", "size=\\d+", "quality=\\d+", "q=\\d+"],
    "confidence": "low",
    "description": "Common resizing parameters to try stripping"
  }
}
```

**Step 2: Commit**

```bash
git add data/patterns.json
git commit -m "feat: add preseeded URL patterns for common CDNs"
```

---

## Task 6: Implement scrapeWebpage Tool

**Files:**
- Create: `apps/web/src/lib/tools/scrape-webpage.ts`
- Create: `apps/web/src/lib/tools/types.ts`

**Step 1: Create apps/web/src/lib/tools/types.ts**

```typescript
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ImageCandidate {
  url: string;
  source: 'img' | 'picture' | 'background';
  width?: number;
  height?: number;
  srcset?: string[];
  alt?: string;
}
```

**Step 2: Create apps/web/src/lib/tools/scrape-webpage.ts**

```typescript
import scrapingbee from 'scrapingbee';
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';

const client = new scrapingbee.ScrapingBeeClient(
  process.env.SCRAPINGBEE_API_KEY!
);

export const scrapeWebpage = tool({
  description: 'Scrapes a webpage and returns its HTML content using ScrapingBee',
  parameters: z.object({
    url: z.string().url().describe('The URL to scrape'),
  }),
  execute: async ({ url }): Promise<ToolResult<string>> => {
    try {
      const response = await client.get({
        url,
        params: {
          render_js: 'true',
          wait: '2000',
          block_resources: 'false',
        },
      });

      const html = response.data.toString();

      if (!html || html.length === 0) {
        return {
          success: false,
          error: 'Received empty response from ScrapingBee',
        };
      }

      return {
        success: true,
        data: html,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to scrape webpage: ${message}`,
      };
    }
  },
});
```

**Step 3: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 4: Commit**

```bash
git add apps/web/src/lib/tools/scrape-webpage.ts apps/web/src/lib/tools/types.ts
git commit -m "feat: implement scrapeWebpage tool"
```

---

## Task 7: Implement extractImageElements Tool

**Files:**
- Create: `apps/web/src/lib/tools/extract-image-elements.ts`

**Step 1: Create apps/web/src/lib/tools/extract-image-elements.ts**

```typescript
import * as cheerio from 'cheerio';
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult, ImageCandidate } from './types';

export const extractImageElements = tool({
  description: 'Extracts all image elements from HTML including img, picture, and CSS background images',
  parameters: z.object({
    html: z.string().describe('The HTML content to parse'),
  }),
  execute: async ({ html }): Promise<ToolResult<ImageCandidate[]>> => {
    try {
      const $ = cheerio.load(html);
      const candidates: ImageCandidate[] = [];

      // Extract from <img> tags
      $('img').each((_, el) => {
        const $el = $(el);
        const src = $el.attr('src');
        const srcset = $el.attr('srcset');
        const width = parseInt($el.attr('width') || '0', 10) || undefined;
        const height = parseInt($el.attr('height') || '0', 10) || undefined;
        const alt = $el.attr('alt');

        if (src) {
          const srcsetUrls = srcset
            ? srcset.split(',').map(s => s.trim().split(' ')[0])
            : [];

          candidates.push({
            url: src,
            source: 'img',
            width,
            height,
            srcset: srcsetUrls.length > 0 ? srcsetUrls : undefined,
            alt,
          });
        }
      });

      // Extract from <picture> tags
      $('picture source').each((_, el) => {
        const $el = $(el);
        const srcset = $el.attr('srcset');

        if (srcset) {
          const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
          urls.forEach(url => {
            candidates.push({
              url,
              source: 'picture',
              srcset: urls,
            });
          });
        }
      });

      // Extract from CSS background-image
      $('[style*="background-image"]').each((_, el) => {
        const $el = $(el);
        const style = $el.attr('style');
        if (style) {
          const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
          if (match && match[1]) {
            candidates.push({
              url: match[1],
              source: 'background',
            });
          }
        }
      });

      // Deduplicate by URL
      const uniqueCandidates = candidates.filter(
        (candidate, index, self) =>
          index === self.findIndex(c => c.url === candidate.url)
      );

      return {
        success: true,
        data: uniqueCandidates,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to extract images: ${message}`,
      };
    }
  },
});
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/lib/tools/extract-image-elements.ts
git commit -m "feat: implement extractImageElements tool"
```

---

## Task 8: Implement analyzeRenderedSizes Tool

**Files:**
- Create: `apps/web/src/lib/tools/analyze-rendered-sizes.ts`

**Step 1: Create apps/web/src/lib/tools/analyze-rendered-sizes.ts**

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult, ImageCandidate } from './types';

const ImageCandidateSchema = z.object({
  url: z.string(),
  source: z.enum(['img', 'picture', 'background']),
  width: z.number().optional(),
  height: z.number().optional(),
  srcset: z.array(z.string()).optional(),
  alt: z.string().optional(),
});

export const analyzeRenderedSizes = tool({
  description: 'Analyzes image candidates and filters to main images based on size',
  parameters: z.object({
    candidates: z.array(ImageCandidateSchema).describe('Array of image candidates to analyze'),
  }),
  execute: async ({ candidates }): Promise<ToolResult<ImageCandidate[]>> => {
    try {
      const MIN_SIZE = 200; // Minimum width or height to be considered a "main" image

      const mainImages = candidates.filter(candidate => {
        // If we have explicit dimensions, check them
        if (candidate.width || candidate.height) {
          const maxDimension = Math.max(candidate.width || 0, candidate.height || 0);
          return maxDimension >= MIN_SIZE;
        }

        // If we have srcset, assume it's likely a main image
        if (candidate.srcset && candidate.srcset.length > 0) {
          return true;
        }

        // Background images are often main images
        if (candidate.source === 'background') {
          return true;
        }

        // If no size info, include it (we'll validate later)
        return true;
      });

      // Sort by size (largest first) when we have dimension info
      mainImages.sort((a, b) => {
        const sizeA = Math.max(a.width || 0, a.height || 0);
        const sizeB = Math.max(b.width || 0, b.height || 0);
        return sizeB - sizeA;
      });

      return {
        success: true,
        data: mainImages,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to analyze image sizes: ${message}`,
      };
    }
  },
});
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/lib/tools/analyze-rendered-sizes.ts
git commit -m "feat: implement analyzeRenderedSizes tool"
```

---

## Task 9: Implement matchKnownPatterns Tool

**Files:**
- Create: `apps/web/src/lib/tools/match-known-patterns.ts`
- Create: `apps/web/src/lib/utils/patterns.ts`

**Step 1: Create apps/web/src/lib/utils/patterns.ts**

```typescript
import fs from 'fs';
import path from 'path';

export interface Pattern {
  domain: string;
  pattern?: string;
  stripParams?: string[];
  stripSuffixes?: string[];
  sourceTransform?: string;
  preservePath?: string;
  confidence: 'high' | 'medium' | 'low';
  examples?: string[];
  description?: string;
}

export type Patterns = Record<string, Pattern>;

let cachedPatterns: Patterns | null = null;

export function loadPatterns(): Patterns {
  if (cachedPatterns) {
    return cachedPatterns;
  }

  const patternsPath = path.join(process.cwd(), '../../data/patterns.json');
  const data = fs.readFileSync(patternsPath, 'utf-8');
  cachedPatterns = JSON.parse(data);
  return cachedPatterns;
}

export function savePatterns(patterns: Patterns): void {
  const patternsPath = path.join(process.cwd(), '../../data/patterns.json');
  fs.writeFileSync(patternsPath, JSON.stringify(patterns, null, 2));
  cachedPatterns = patterns;
}
```

**Step 2: Create apps/web/src/lib/tools/match-known-patterns.ts**

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';
import { loadPatterns } from '../utils/patterns';

export const matchKnownPatterns = tool({
  description: 'Checks if a URL matches known patterns and returns the clean source URL',
  parameters: z.object({
    url: z.string().url().describe('The image URL to check against known patterns'),
  }),
  execute: async ({ url }): Promise<ToolResult<string | null>> => {
    try {
      const patterns = loadPatterns();

      for (const [name, pattern] of Object.entries(patterns)) {
        // Skip generic pattern initially
        if (name === 'generic') continue;

        // Check if URL matches this pattern's domain
        if (!url.includes(pattern.domain)) continue;

        let cleanUrl = url;

        // Strip query parameters
        if (pattern.stripParams) {
          for (const param of pattern.stripParams) {
            const regex = new RegExp(param, 'g');
            cleanUrl = cleanUrl.replace(regex, '');
          }
          // Clean up leftover ? and & characters
          cleanUrl = cleanUrl.replace(/\?&/g, '?').replace(/\?$/g, '').replace(/&$/g, '');
        }

        // Strip suffixes from filename
        if (pattern.stripSuffixes) {
          for (const suffix of pattern.stripSuffixes) {
            const regex = new RegExp(suffix + '(\\.\\w+)$');
            cleanUrl = cleanUrl.replace(regex, '$1');
          }
        }

        // If we modified the URL, return it
        if (cleanUrl !== url) {
          return {
            success: true,
            data: cleanUrl,
          };
        }
      }

      // Try generic pattern as fallback
      const genericPattern = patterns.generic;
      if (genericPattern?.stripParams) {
        let cleanUrl = url;
        for (const param of genericPattern.stripParams) {
          const regex = new RegExp(`[?&]${param}`, 'g');
          cleanUrl = cleanUrl.replace(regex, '');
        }
        cleanUrl = cleanUrl.replace(/\?&/g, '?').replace(/\?$/g, '').replace(/&$/g, '');

        if (cleanUrl !== url) {
          return {
            success: true,
            data: cleanUrl,
          };
        }
      }

      // No pattern matched
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to match patterns: ${message}`,
      };
    }
  },
});
```

**Step 3: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 4: Commit**

```bash
git add apps/web/src/lib/tools/match-known-patterns.ts apps/web/src/lib/utils/patterns.ts
git commit -m "feat: implement matchKnownPatterns tool and pattern utilities"
```

---

## Task 10: Implement findSourceUrl Tool

**Files:**
- Create: `apps/web/src/lib/tools/find-source-url.ts`

**Step 1: Create apps/web/src/lib/tools/find-source-url.ts**

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';

export const findSourceUrl = tool({
  description: 'Generates candidate source URLs by trying different strategies',
  parameters: z.object({
    url: z.string().url().describe('The image URL to find source for'),
    srcset: z.array(z.string()).optional().describe('Optional srcset URLs to try'),
  }),
  execute: async ({ url, srcset }): Promise<ToolResult<string[]>> => {
    try {
      const candidates: string[] = [];

      // Strategy 1: Try largest srcset variant
      if (srcset && srcset.length > 0) {
        // Assume last in srcset is largest
        candidates.push(srcset[srcset.length - 1]);
      }

      // Strategy 2: Strip common resizing query parameters
      const urlObj = new URL(url);
      const resizingParams = [
        'w', 'h', 'width', 'height',
        'resize', 'size', 'quality', 'q',
        'fit', 'crop', 'auto', 'fm', 'format',
        'dpr', 'scale'
      ];

      resizingParams.forEach(param => {
        urlObj.searchParams.delete(param);
      });

      const strippedUrl = urlObj.toString();
      if (strippedUrl !== url) {
        candidates.push(strippedUrl);
      }

      // Strategy 3: Remove all query parameters
      const noQueryUrl = url.split('?')[0];
      if (noQueryUrl !== url && !candidates.includes(noQueryUrl)) {
        candidates.push(noQueryUrl);
      }

      // Strategy 4: Try removing size suffixes from filename
      const sizePatterns = [
        /-\d+x\d+(\.\w+)$/,  // -800x600.jpg
        /_\d+x\d+(\.\w+)$/,  // _800x600.jpg
        /-(?:small|medium|large|thumb|thumbnail)(\.\w+)$/,
      ];

      sizePatterns.forEach(pattern => {
        const match = url.match(pattern);
        if (match) {
          const cleaned = url.replace(pattern, match[1]);
          if (!candidates.includes(cleaned)) {
            candidates.push(cleaned);
          }
        }
      });

      // Always include original URL as fallback
      if (!candidates.includes(url)) {
        candidates.push(url);
      }

      return {
        success: true,
        data: candidates,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to find source URL: ${message}`,
      };
    }
  },
});
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/lib/tools/find-source-url.ts
git commit -m "feat: implement findSourceUrl tool"
```

---

## Task 11: Implement validateImageUrl Tool

**Files:**
- Create: `apps/web/src/lib/tools/validate-image-url.ts`

**Step 1: Create apps/web/src/lib/tools/validate-image-url.ts**

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';

export const validateImageUrl = tool({
  description: 'Validates that an image URL returns a 200 response',
  parameters: z.object({
    url: z.string().url().describe('The image URL to validate'),
  }),
  execute: async ({ url }): Promise<ToolResult<boolean>> => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
      });

      const isValid = response.ok && response.status === 200;

      return {
        success: true,
        data: isValid,
      };
    } catch (error) {
      // Network errors or invalid URLs
      return {
        success: true,
        data: false,
      };
    }
  },
});
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/lib/tools/validate-image-url.ts
git commit -m "feat: implement validateImageUrl tool"
```

---

## Task 12: Implement learnPattern Tool

**Files:**
- Create: `apps/web/src/lib/tools/learn-pattern.ts`

**Step 1: Create apps/web/src/lib/tools/learn-pattern.ts**

```typescript
import { tool } from 'ai';
import { z } from 'zod';
import type { ToolResult } from './types';
import { loadPatterns, savePatterns } from '../utils/patterns';

export const learnPattern = tool({
  description: 'Learns a new URL pattern from successful resolution',
  parameters: z.object({
    originalUrl: z.string().url().describe('The original image URL'),
    sourceUrl: z.string().url().describe('The resolved source URL'),
    domain: z.string().describe('The domain to associate this pattern with'),
  }),
  execute: async ({ originalUrl, sourceUrl, domain }): Promise<ToolResult<void>> => {
    try {
      // Don't learn if URLs are the same
      if (originalUrl === sourceUrl) {
        return { success: true };
      }

      const patterns = loadPatterns();

      // Extract what was stripped/changed
      const originalParams = new URL(originalUrl).searchParams;
      const sourceParams = new URL(sourceUrl).searchParams;

      const strippedParams: string[] = [];
      originalParams.forEach((_, key) => {
        if (!sourceParams.has(key)) {
          strippedParams.push(key);
        }
      });

      // Check if we already have a pattern for this domain
      const existingPattern = Object.entries(patterns).find(
        ([_, p]) => p.domain === domain
      );

      if (existingPattern) {
        const [name, pattern] = existingPattern;

        // Update stripParams if we found new ones
        const currentParams = pattern.stripParams || [];
        const newParams = strippedParams.filter(p => !currentParams.includes(p));

        if (newParams.length > 0) {
          patterns[name] = {
            ...pattern,
            stripParams: [...currentParams, ...newParams],
          };
          savePatterns(patterns);
        }
      } else if (strippedParams.length > 0) {
        // Create new pattern
        const patternName = domain.replace(/[^a-zA-Z0-9]/g, '_');
        patterns[patternName] = {
          domain,
          stripParams: strippedParams,
          confidence: 'low',
          examples: [originalUrl],
        };
        savePatterns(patterns);
      }

      return {
        success: true,
      };
    } catch (error) {
      // Don't fail the request if we can't learn
      // Just log and continue
      console.error('Failed to learn pattern:', error);
      return {
        success: true,
      };
    }
  },
});
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/lib/tools/learn-pattern.ts
git commit -m "feat: implement learnPattern tool"
```

---

## Task 13: Configure AI Agent with OpenRouter

**Files:**
- Create: `apps/web/src/lib/agent/config.ts`
- Create: `apps/web/src/lib/agent/tools.ts`

**Step 1: Create apps/web/src/lib/agent/tools.ts**

```typescript
import { scrapeWebpage } from '../tools/scrape-webpage';
import { extractImageElements } from '../tools/extract-image-elements';
import { analyzeRenderedSizes } from '../tools/analyze-rendered-sizes';
import { matchKnownPatterns } from '../tools/match-known-patterns';
import { findSourceUrl } from '../tools/find-source-url';
import { validateImageUrl } from '../tools/validate-image-url';
import { learnPattern } from '../tools/learn-pattern';

export const tools = {
  scrapeWebpage,
  extractImageElements,
  analyzeRenderedSizes,
  matchKnownPatterns,
  findSourceUrl,
  validateImageUrl,
  learnPattern,
};
```

**Step 2: Create apps/web/src/lib/agent/config.ts**

```typescript
import { createOpenAI } from '@ai-sdk/openai';

// Configure OpenRouter provider
export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Model configuration
export const model = openrouter('google/gemini-flash-1.5-8b');

// System prompt for the agent
export const systemPrompt = `You are an AI agent specialized in extracting clean, full-resolution image URLs from web pages.

Your goal is to:
1. Scrape the webpage HTML
2. Extract all image candidates (img, picture, background-image)
3. Identify the "main" images (largest rendered sizes, typically > 200px)
4. For each main image, find the cleanest source URL by:
   - First checking known patterns
   - Trying largest srcset variant
   - Stripping resizing query parameters
   - Validating URLs return 200 responses
5. Learn new patterns when you successfully resolve URLs
6. Return deduplicated array of clean image URLs

Important:
- Some URLs may require certain query parameters (auth, signatures) - only strip resizing params
- Goal is "cleanest URL at largest size possible"
- Use tools iteratively and strategically
- Learn patterns to improve future performance

Return the final list of clean image URLs.`;
```

**Step 3: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 4: Commit**

```bash
git add apps/web/src/lib/agent/config.ts apps/web/src/lib/agent/tools.ts
git commit -m "feat: configure AI agent with OpenRouter and Gemini Flash"
```

---

## Task 14: Create REST API Endpoint

**Files:**
- Create: `apps/web/src/app/api/extract-images/route.ts`

**Step 1: Create apps/web/src/app/api/extract-images/route.ts**

```typescript
import { generateText } from 'ai';
import { z } from 'zod';
import { model, systemPrompt } from '@/lib/agent/config';
import { tools } from '@/lib/agent/tools';

const RequestSchema = z.object({
  url: z.string().url(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = RequestSchema.parse(body);

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: `Extract all main images from this URL: ${url}`,
      tools,
      maxSteps: 10,
    });

    // Parse the response to extract image URLs
    const text = result.text;

    // Try to extract URLs from the response
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
    const urls = text.match(urlRegex) || [];

    // Deduplicate
    const uniqueUrls = [...new Set(urls)];

    return Response.json({
      images: uniqueUrls,
      message: result.text,
    });
  } catch (error) {
    console.error('Extract images error:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to extract images' },
      { status: 500 }
    );
  }
}
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/app/api/extract-images/route.ts
git commit -m "feat: create REST API endpoint for image extraction"
```

---

## Task 15: Create Streaming Chat API Endpoint

**Files:**
- Create: `apps/web/src/app/api/chat/route.ts`

**Step 1: Create apps/web/src/app/api/chat/route.ts**

```typescript
import { streamText } from 'ai';
import { model, systemPrompt } from '@/lib/agent/config';
import { tools } from '@/lib/agent/tools';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      tools,
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process chat' },
      { status: 500 }
    );
  }
}
```

**Step 2: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 3: Commit**

```bash
git add apps/web/src/app/api/chat/route.ts
git commit -m "feat: create streaming chat API endpoint"
```

---

## Task 16: Build Rich UI with AI SDK Components

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/components/image-extractor.tsx`
- Create: `apps/web/src/components/url-form.tsx`
- Create: `apps/web/src/components/image-results.tsx`

**Step 1: Create apps/web/src/components/url-form.tsx**

```typescript
'use client';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="url"
          name="url"
          placeholder="Enter a URL to extract images from..."
          required
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Extract'}
        </button>
      </div>
    </form>
  );
}
```

**Step 2: Create apps/web/src/components/image-results.tsx**

```typescript
'use client';

interface ImageResultsProps {
  images: string[];
}

export function ImageResults({ images }: ImageResultsProps) {
  if (images.length === 0) {
    return null;
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="w-full max-w-2xl mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Found {images.length} {images.length === 1 ? 'image' : 'images'}
      </h2>
      <div className="space-y-2">
        {images.map((url, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <code className="flex-1 text-sm text-gray-700 break-all">
              {url}
            </code>
            <button
              onClick={() => copyToClipboard(url)}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              title="Copy to clipboard"
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Create apps/web/src/components/image-extractor.tsx**

```typescript
'use client';

import { useChat } from 'ai/react';
import { UrlForm } from './url-form';
import { ImageResults } from './image-results';

export function ImageExtractor() {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
  });

  const handleSubmit = (url: string) => {
    append({
      role: 'user',
      content: `Extract all main images from this URL: ${url}`,
    });
  };

  // Extract URLs from the last assistant message
  const lastMessage = messages.filter(m => m.role === 'assistant').pop();
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
  const extractedUrls = lastMessage?.content.match(urlRegex) || [];
  const uniqueUrls = [...new Set(extractedUrls)];

  return (
    <div className="flex flex-col items-center w-full">
      <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Show agent progress during development */}
      {process.env.NODE_ENV === 'development' && messages.length > 0 && (
        <div className="w-full max-w-2xl mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Agent Progress:</h3>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {message.role}
              </div>
              <div className="text-sm whitespace-pre-wrap">
                {message.content}
              </div>
              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.toolInvocations.map((tool, toolIndex) => (
                    <div
                      key={toolIndex}
                      className="p-2 bg-white rounded border border-gray-200"
                    >
                      <div className="text-xs font-mono text-purple-600">
                        🔧 {tool.toolName}
                      </div>
                      {tool.state === 'result' && (
                        <div className="mt-1 text-xs text-gray-600">
                          ✓ Complete
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show final results */}
      <ImageResults images={uniqueUrls} />
    </div>
  );
}
```

**Step 4: Update apps/web/src/app/page.tsx**

```typescript
import { ImageExtractor } from '@/components/image-extractor';

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Beeline</h1>
          <p className="text-gray-600">
            AI-powered image extractor - get clean, full-resolution source URLs
          </p>
        </div>

        <ImageExtractor />
      </div>
    </main>
  );
}
```

**Step 5: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 6: Test in browser**

Run: `cd apps/web && pnpm dev`
Open: http://localhost:3000
Expected: See form, be able to submit URL

**Step 7: Commit**

```bash
git add apps/web/src/app/page.tsx apps/web/src/components
git commit -m "feat: build rich UI with AI SDK streaming components"
```

---

## Task 17: Test with Example URL

**Files:**
- None (testing)

**Step 1: Start dev server**

Run: `cd apps/web && pnpm dev`
Expected: Server running on http://localhost:3000

**Step 2: Test with kvadrat.dk URL**

1. Open http://localhost:3000
2. Enter: `https://www.kvadrat.dk/en/products/upholstery/8098-aaren`
3. Click "Extract"
4. Watch agent progress in development mode
5. Verify clean image URLs are returned

Expected: Agent scrapes page, finds images, returns clean URLs

**Step 3: Check patterns.json**

Run: `cat ../../data/patterns.json`
Expected: May see new learned patterns added

**Step 4: Document results**

Note any issues or improvements needed

---

## Task 18: Add Error Boundaries and Improved Error Handling

**Files:**
- Create: `apps/web/src/components/error-boundary.tsx`
- Modify: `apps/web/src/app/layout.tsx`

**Step 1: Create apps/web/src/components/error-boundary.tsx**

```typescript
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-red-800 font-semibold mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

**Step 2: Update apps/web/src/app/layout.tsx**

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

export const metadata: Metadata = {
  title: "Beeline - AI Image Extractor",
  description: "Extract clean, full-resolution images from any web page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
```

**Step 3: Test type checking**

Run: `cd apps/web && pnpm type-check`
Expected: No type errors

**Step 4: Commit**

```bash
git add apps/web/src/components/error-boundary.tsx apps/web/src/app/layout.tsx
git commit -m "feat: add error boundary for graceful error handling"
```

---

## Task 19: Add README Documentation

**Files:**
- Create: `README.md`
- Create: `apps/web/README.md`

**Step 1: Create README.md**

```markdown
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
```

**Step 2: Create apps/web/README.md**

```markdown
# Web App

Next.js application for Beeline image extractor.

## Development

```bash
pnpm dev
```

## API Endpoints

- `POST /api/extract-images` - REST API for programmatic access
- `POST /api/chat` - Streaming chat API for UI

## Environment Variables

See `.env.local.example`
```

**Step 3: Commit**

```bash
git add README.md apps/web/README.md
git commit -m "docs: add README documentation"
```

---

## Task 20: Final Testing and Verification

**Files:**
- None (testing)

**Step 1: Clean install**

Run: `rm -rf node_modules apps/web/node_modules pnpm-lock.yaml && pnpm install`
Expected: Fresh install completes successfully

**Step 2: Type check**

Run: `pnpm type-check`
Expected: No type errors

**Step 3: Build**

Run: `pnpm build`
Expected: Build succeeds

**Step 4: Test dev server**

Run: `pnpm dev`
Expected: Server starts successfully

**Step 5: Test with multiple URLs**

Test with:
1. `https://www.kvadrat.dk/en/products/upholstery/8098-aaren`
2. A Shopify store (if you know one)
3. A blog with WordPress images

Expected: Each returns clean image URLs

**Step 6: Verify pattern learning**

Run: `cat data/patterns.json`
Expected: See learned patterns from tested URLs

**Step 7: Test REST API**

Run:
```bash
curl -X POST http://localhost:3000/api/extract-images \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.kvadrat.dk/en/products/upholstery/8098-aaren"}'
```

Expected: Returns JSON with image URLs

**Step 8: Document any issues**

Create issues for any bugs or improvements needed

---

## Success Criteria

- ✅ Turborepo structure with Next.js app and UI package
- ✅ All 7 tools implemented and type-safe
- ✅ AI agent configured with Gemini Flash 2.5 via OpenRouter
- ✅ REST API endpoint working
- ✅ Streaming chat UI working with AI SDK components
- ✅ Preseeded patterns for common CDNs
- ✅ Pattern learning system functional
- ✅ Successfully extracts images from test URL
- ✅ No type errors
- ✅ Clean commits throughout

## Notes

- Uses AI SDK v5 and Zod v4 (beta) as specified
- OpenRouter provider configured correctly
- ScrapingBee with `render_js=true` for lazy-loaded images
- Development mode shows full agent progress
- Production mode shows simple processing state
- Error boundaries for graceful failures
- Pattern learning doesn't block requests on failure
