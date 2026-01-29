# Dashboard Redesign

## Problem

The dashboard at `/dashboard` uses different visual patterns than the rest of the site (home, pricing). It has a different background, different header, different border radii, different font weights, and no footer. It feels like a different product.

## Design Principles

Match the home and pricing pages exactly:
- Same header (text logo, nav links, CTA)
- Same footer (border-top, logo, links)
- Same background (`dot-grid`)
- Same content width (`max-w-3xl` for content, `max-w-5xl` for header/footer)
- Same typography (mono label + large heading)
- Same component patterns (`code-block` for data, `badge` for status)
- Same border radius (`var(--radius-lg)` = 8px, not 2xl/16px)

## Layout

```
┌─────────────────────────────────────────────────────┐
│  srcfull              Pricing  Docs  [UserButton]   │  ← shared header
├─────────────────────────────────────────────────────┤
│                                                     │
│  Dashboard                         ← mono label     │
│  Welcome back, {email}             ← page heading   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Plan          Requests       Remaining     │    │  ← code-block table
│  │  ─────────────────────────────────────────  │    │     (like pricing table)
│  │  Pro           12,456/mo      37,544        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  API keys                          ← section label  │
│                                                     │
│  [Key name input          ] [Create key]            │  ← form row
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Key name       Prefix       Created   Revoke│    │  ← code-block table
│  │  ──────────────────────────────────────────  │    │     (like pricing table)
│  │  Production     sk_live_...   5m ago   [x]   │    │
│  │  Staging        sk_test_...   2d ago   [x]   │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Usage                             ← section label  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Endpoint        24h     7d       Total     │    │  ← code-block table
│  │  ──────────────────────────────────────────  │    │
│  │  /v1/transform   120     840      4,210     │    │
│  │  /v1/scrape      45      310      8,246     │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Quick reference                                    │
│                                                     │
│  ┌────────────────┐  ┌────────────────┐             │
│  │ POST /v1/trans  │  │ POST /v1/scrape│             │  ← cards (radius-lg)
│  │ Resolve single  │  │ Extract all    │             │
│  └────────────────┘  └────────────────┘             │
│                                                     │
│  View full documentation →                          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  srcfull                              Pricing       │  ← shared footer
└─────────────────────────────────────────────────────┘
```

## Non-pro state

```
┌─────────────────────────────────────────────────────┐
│  srcfull              Pricing  Docs  [UserButton]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Dashboard                         ← mono label     │
│  Get started                       ← heading        │
│                                                     │
│  Srcfull is a paid API. Subscribe to unlock         │
│  API access and key creation.                       │
│                                                     │
│  [View pricing]                    ← btn-primary    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  srcfull                              Pricing       │
└─────────────────────────────────────────────────────┘
```

## Specific Changes

### 1. Background
- Replace `pixel-grid-dense` with `dot-grid` (matches home/pricing)

### 2. Header
- Replace custom logo+heading header with shared site header
- Text logo `srcfull` on left (link to /)
- Nav: Pricing, Docs links + UserButton on right
- Same `max-w-5xl` container as home/pricing header

### 3. Page Title Area
- Mono label: `Dashboard` (like "Plans" on pricing, "Image extraction API" on home)
- Large heading: user email or "Welcome back"
- Same `text-4xl md:text-5xl font-medium tracking-tight` as other pages

### 4. Plan Stats → Code-Block Table
- Replace 3 separate QuickStatCard components with a single `code-block` table
- Matches the pricing page's table pattern exactly
- Header row: Plan | Requests | Remaining
- Single data row with current values
- Mono font throughout

### 5. API Keys → Code-Block Table
- Keep the create key form above (input + button, inline)
- Replace the card-per-key layout with a `code-block` table
- Header row: Name | Key | Created | Last used | (Revoke)
- Each key is a table row
- Revoke button as text link (matches ghost button style)

### 6. Usage → Code-Block Table
- Replace the 3 StatCard components + endpoint list with one `code-block` table
- Header row: Endpoint | 24h | 7d | Total
- One row per endpoint
- Summary row at bottom for totals

### 7. Quick Reference
- Keep as 2-column cards but use `card` class with `var(--radius-lg)` instead of `rounded-2xl`
- Keep the POST badge + endpoint + description pattern
- Keep the "View full documentation →" link

### 8. Footer
- Add shared footer (border-top, srcfull text, Pricing link)
- Matches home/pricing footer exactly

### 9. Content Width
- Main content: `max-w-3xl` (matches home/pricing)
- Header/footer: `max-w-5xl` (matches home/pricing)

### 10. Border Radius
- All `rounded-2xl` → use `card` class or explicit `rounded-lg` (8px)
- Matches the rest of the site

### 11. Font Weights
- Remove `font-bold` and `font-semibold` from headings
- Use `font-medium` like the rest of the site
- Section labels use mono text like pricing page labels

### 12. New Key Success Banner
- Keep the green success banner for newly created keys
- Use `var(--radius-lg)` instead of `rounded-lg` for consistency
- Pattern is fine, just needs radius alignment

### 13. Upgrade Prompt (non-pro)
- Simplify to match the editorial style of other pages
- No glowing card border (`glow-subtle`)
- Plain text + btn-primary CTA, same as pricing page CTA

## Implementation Notes

- Extract shared Header and Footer components (used on home, pricing, and dashboard)
- The dashboard-client.tsx components (ApiKeysSection, UsageSection) need to use `code-block` tables instead of custom card layouts
- Remove QuickStatCard and StatCard components (replaced by table rows)
- Keep QuickRefCard but update its border radius
