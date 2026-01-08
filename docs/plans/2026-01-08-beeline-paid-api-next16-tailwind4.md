# Beeline Paid API (Polar) + Next 16 + Tailwind v4 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship Beeline as a paid-only, API-first product with Polar checkout + subscription gating, upgraded to Next.js 16 and Tailwind CSS v4.

**Architecture:** Customers authenticate to the dashboard with an email-only session cookie, but can only create API keys and use the public API when their Polar subscription is active. `/api/v1/*` is strictly API-key authenticated and additionally enforces the owning user has an active paid plan. Curated resolver patterns are bundled into the server build (no runtime `fs` reads). The web UI is login-required and centered on key management + usage.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Drizzle ORM + Neon, Polar (`@polar-sh/sdk`, `@polar-sh/nextjs`), Vitest, Playwright.

---

### Task 1: Fix the test runner (Vitest + Vite ESM)

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/vitest.config.ts`

**Step 1: Upgrade Vitest to a version that supports Vite 7 ESM**

Run:
```bash
pnpm --filter web add -D vitest@^4.0.16 @vitest/coverage-v8@^4.0.16
```

**Step 2: Align `vitest.config.ts` to a known-good pattern**

- Keep `environment: "node"`
- Keep `@` alias resolution

**Step 3: Verify tests execute**

Run:
```bash
pnpm --filter web test
```

Expected: Vitest starts (even if some tests fail).

---

### Task 2: Upgrade `apps/web` to Next.js 16 + React 19.2.x

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/next.config.ts`

**Step 1: Upgrade core runtime deps**

Set versions (match stable stack):
- `next`: `16.1.1`
- `react`: `19.2.3`
- `react-dom`: `19.2.3`
- `typescript`: `5.9.3`

**Step 2: Verify build**

Run:
```bash
pnpm --filter web build
```

Expected: `next build` succeeds.

---

### Task 3: Migrate `apps/web` to Tailwind v4 (CSS-first)

**Files:**
- Modify: `apps/web/postcss.config.mjs`
- Modify: `apps/web/src/app/globals.css`
- Delete: `apps/web/tailwind.config.ts` (if no longer needed)
- Modify: `apps/web/package.json`

**Step 1: Upgrade Tailwind dependencies**

Set:
- `tailwindcss`: `^4.1.17`
- `@tailwindcss/postcss`: `^4.1.17`

Remove:
- `autoprefixer` (optional)
- any Tailwind v3-only config usage

**Step 2: Update PostCSS config**

Use:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Step 3: Update globals CSS to Tailwind v4 directives**

- Replace Tailwind v3 directives with `@import "tailwindcss";`
- Add `@source` directives so Tailwind scans `apps/web/src` and `packages/ui/src`
- Keep the existing CSS variables and custom classes

**Step 4: Verify build**

Run:
```bash
pnpm --filter web build
```

Expected: `next build` succeeds and Tailwind styles compile.

---

### Task 4: Make the product paid-only with Polar checkout + subscription gating

**Files:**
- Modify: `apps/web/src/db/schema.ts` (add `polarSubscriptionId`)
- Modify: `apps/web/src/lib/polar.ts` (add config + shared helpers)
- Create: `apps/web/src/app/api/checkout/route.ts`
- Create: `apps/web/src/app/api/portal/route.ts`
- Create: `apps/web/src/app/api/webhooks/polar/route.ts`
- Create: `apps/web/src/app/auth/success/page.tsx`
- Create: `apps/web/src/app/auth/page.tsx` (or equivalent)
- Modify: `apps/web/src/lib/api-auth.ts` (enforce paid plan)
- Modify: `apps/web/src/app/api/keys/route.ts` (enforce paid plan)
- Modify: `apps/web/src/app/api/usage/route.ts` (optional: allow, but show empty if unpaid)
- Modify: `apps/web/src/app/api/scrape/route.ts` + `apps/web/src/app/api/transform/route.ts` (require session; optional)

**Step 1: Add subscription tracking to users table**

Add:
- `polarSubscriptionId: text("polar_subscription_id")` (nullable)

**Step 2: Implement checkout route**

Use `@polar-sh/nextjs` `Checkout`, success URL `.../auth/success?checkout_id={CHECKOUT_ID}` and base URL derived from:
- `NEXT_PUBLIC_APP_URL` OR `VERCEL_URL` fallback.

**Step 3: Implement auth success page**

On success:
- `polar.checkouts.get({ id: checkout_id })`
- Ensure `customerEmail` + `customerId` exist
- Create/update user with `polarCustomerId`
- Set `session` cookie (httpOnly, secure in prod)
- Redirect to `/dashboard`

**Step 4: Implement Polar webhooks**

Use `validateEvent` from `@polar-sh/sdk/webhooks` and update the user row by `polarCustomerId`:
- `subscription.created/updated`: if active → set `plan: "pro"` and store `polarSubscriptionId`
- `subscription.canceled`: set `plan: "free"` and clear `polarSubscriptionId`
- `checkout.created`: upsert user by email and attach `polarCustomerId`

**Step 5: Gate API key creation and public API**

- `/api/keys` `POST`: return `402 PAYMENT_REQUIRED` (or `403`) if `user.plan !== "pro"`
- `validateApiKey`: join to `users` and require `plan === "pro"` (reject otherwise)

**Step 6: Add customer portal route**

Use `CustomerPortal` from `@polar-sh/nextjs` to let logged-in users manage billing.

**Step 7: Verify end-to-end locally (happy path)**

Manual:
- Login (email)
- Subscribe (checkout) → `/auth/success` sets session
- Create API key
- Call `/api/v1/transform` with key

---

### Task 5: Bundle curated patterns (avoid runtime `fs`)

**Files:**
- Modify: `apps/web/src/lib/pattern-matcher.ts`

**Step 1: Replace runtime file reads with a static JSON import**

- Import `data/patterns.json` directly so it is bundled into the server build.
- Keep caching behavior.

**Step 2: Verify build**

Run:
```bash
pnpm --filter web build
```

---

### Task 6: Production SEO + metadata routes (per build checklist)

**Files:**
- Modify: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/robots.ts`
- Create: `apps/web/src/app/sitemap.ts`
- Create: `apps/web/src/app/manifest.ts`
- Create: `apps/web/src/app/opengraph-image.tsx`
- Create: `apps/web/src/app/icon.tsx`
- Create: `apps/web/src/app/apple-icon.tsx`

**Step 1: Add base metadata**

- Use `NEXT_PUBLIC_APP_URL` for `metadataBase`
- Add OpenGraph + Twitter + `robots`

**Step 2: Implement metadata routes**

- `robots.ts`, `sitemap.ts`, `manifest.ts`

**Step 3: Generate icons/OG dynamically**

- Use `ImageResponse` in `icon.tsx`, `apple-icon.tsx`, `opengraph-image.tsx`

---

### Task 7: Bring repo lint to green

**Files:**
- Modify: `packages/ui/src/**` (auto-fix)

**Step 1: Run Biome auto-fixes**

Run:
```bash
pnpm -C packages/ui exec biome check . --write
```

**Step 2: Re-run repo lint**

Run:
```bash
pnpm lint
```

Expected: Pass (or show a small, actionable set of remaining errors).

---

### Task 8: Update docs + env examples and verify “ship” commands

**Files:**
- Modify: `README.md`
- Modify: `apps/web/README.md`
- Modify: `apps/web/.env.local.example`

**Step 1: Update docs to match reality**

- Remove references to AI/streaming UI
- Document paid API endpoints and auth (API key)

**Step 2: Ensure env examples include all required vars**

Add:
- `DATABASE_URL=...`
- `POLAR_ACCESS_TOKEN=...`
- `POLAR_WEBHOOK_SECRET=...`
- `NEXT_PUBLIC_APP_URL=...`
- `NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID=...`
- `SCRAPINGBEE_API_KEY=...`

**Step 3: Verify**

Run:
```bash
pnpm type-check
pnpm build
pnpm --filter web test
pnpm lint
```

---

# Execution

Plan saved. I’ll implement it directly in this workspace (no worktree/branch/commits unless explicitly requested). If you want a worktree + branch, tell me where to create it (`.worktrees/` vs a global location) and I’ll switch to that flow.

