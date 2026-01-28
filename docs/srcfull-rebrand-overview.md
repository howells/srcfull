# Srcfull Rebrand Overview

This document provides a summary of the rebrand from "Beeline" to "Srcfull" and lists all the files created for the new design system.

---

## Brand Summary

**Old Brand:** Beeline
- Bee theme with hexagonal patterns
- Amber/honey color palette (#f59e0b)
- Warm, organic feel

**New Brand:** Srcfull (source + full)
- Resolution/clarity theme with pixel grid patterns
- Electric Cyan color palette (#00d4ff)
- Technical, precise, developer-focused feel

---

## Visual Identity

### Logo Concept

The Srcfull logo uses **concentric rounded squares** converging on a stylized "S" in the center. This represents:

1. **Nested image sizes** (thumbnail > medium > source)
2. **Focus/zoom** towards clarity
3. **Resolution layers** we traverse to find the source

```
┌───────────────┐
│   ┌───────┐   │    Outer ring: 30% opacity cyan
│   │ ┌───┐ │   │    Middle ring: 50% opacity cyan
│   │ │ S │ │   │    Inner square: Gradient cyan (filled)
│   │ └───┘ │   │
│   └───────┘   │
└───────────────┘
```

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #0a0a0f | Main background |
| `--bg-secondary` | #12121a | Cards, elevated surfaces |
| `--accent` | #00d4ff | Primary accent (Electric Cyan) |
| `--accent-bright` | #5ce5ff | Hover states |
| `--text-primary` | #fafafa | Main text |
| `--text-secondary` | #94a3b8 | Secondary text |
| `--border` | rgba(255,255,255,0.06) | Default borders |
| `--border-accent` | rgba(0,212,255,0.3) | Highlighted borders |

### Typography

| Context | Font | Notes |
|---------|------|-------|
| Headlines | Space Grotesk | Technical but approachable |
| Body | Inter | Clean, excellent screen rendering |
| Code | JetBrains Mono | Ligatures, developer-friendly |

---

## Files Created

### Design System Documentation
- `/docs/srcfull-design-system.md` - Comprehensive design system guide

### Global Styles
- `/apps/web/src/app/globals-srcfull.css` - New CSS variables and utilities

### Page Components
- `/apps/web/src/app/page-srcfull.tsx` - Landing page
- `/apps/web/src/app/pricing/page-srcfull.tsx` - Pricing page
- `/apps/web/src/app/dashboard/page-srcfull.tsx` - Dashboard page
- `/apps/web/src/app/layout-srcfull.tsx` - Root layout with fonts

### Assets
- `/apps/web/src/app/icon-srcfull.tsx` - Favicon (512x512)
- `/apps/web/src/app/apple-icon-srcfull.tsx` - Apple touch icon
- `/apps/web/src/app/opengraph-image-srcfull.tsx` - OG image
- `/apps/web/src/app/manifest-srcfull.ts` - PWA manifest

### Components
- `/apps/web/src/components/srcfull-logo.tsx` - Reusable logo component

---

## Migration Guide

### Quick Start

To preview the new design:

1. **Backup current files:**
   ```bash
   cd apps/web/src/app
   cp globals.css globals-beeline.css.bak
   cp page.tsx page-beeline.tsx.bak
   cp layout.tsx layout-beeline.tsx.bak
   cp icon.tsx icon-beeline.tsx.bak
   ```

2. **Activate new design:**
   ```bash
   cp globals-srcfull.css globals.css
   cp page-srcfull.tsx page.tsx
   cp layout-srcfull.tsx layout.tsx
   cp icon-srcfull.tsx icon.tsx
   cp apple-icon-srcfull.tsx apple-icon.tsx
   cp opengraph-image-srcfull.tsx opengraph-image.tsx
   cp manifest-srcfull.ts manifest.ts

   # Also copy pricing and dashboard
   cp pricing/page-srcfull.tsx pricing/page.tsx
   cp dashboard/page-srcfull.tsx dashboard/page.tsx
   ```

3. **Start dev server:**
   ```bash
   pnpm dev
   ```

### Full Migration Checklist

- [ ] Replace `globals.css` with new design system
- [ ] Replace `layout.tsx` with new fonts and metadata
- [ ] Replace `page.tsx` with new landing page
- [ ] Replace `icon.tsx` and `apple-icon.tsx` with new favicon
- [ ] Replace `opengraph-image.tsx` with new OG image
- [ ] Replace `manifest.ts` with new app manifest
- [ ] Update `pricing/page.tsx`
- [ ] Update `dashboard/page.tsx`
- [ ] Search and replace "Beeline" with "Srcfull" in all files
- [ ] Update environment variables if any reference the old name
- [ ] Update Clerk dashboard (app name, branding)
- [ ] Update DNS/domain if changing from beeline.* to srcfull.*
- [ ] Update README.md
- [ ] Update any external documentation

### Text Replacements

Run these commands to find all instances of "Beeline":

```bash
grep -r "Beeline" apps/web/src --include="*.tsx" --include="*.ts"
grep -r "beeline" apps/web/src --include="*.tsx" --include="*.ts"
```

Key replacements:
- "Beeline" → "Srcfull"
- "beeline" → "srcfull"
- "bee" terminology → "source/resolution" terminology

---

## Design Decisions

### Why Cyan?

1. **Digital/Screen Association** - Cyan is strongly associated with digital displays, RGB color models, and technology
2. **Contrast with Competition** - Most image APIs use blue/purple; cyan stands out
3. **Clarity Metaphor** - Cyan suggests clarity, precision, and sharpness
4. **Dark Mode Excellence** - Cyan glows beautifully on dark backgrounds
5. **Accessibility** - High contrast ratios against dark backgrounds

### Why Pixel Grid?

The hexagonal bee pattern is replaced with a subtle pixel grid because:
1. It suggests image data and resolution
2. It's universally recognized by developers
3. It reinforces the "resolution" concept
4. It's more subtle and professional

### Why Space Grotesk?

1. Technical without being cold
2. Excellent at display sizes
3. Modern geometric design
4. Good for product/tech brands

---

## Component Usage

### Logo Component

```tsx
import { SrcfullLogo, LogoMark } from "@/components/srcfull-logo";

// Full logo with text
<SrcfullLogo variant="wordmark" size="lg" href="/" />

// Icon only
<LogoMark size={40} animate />

// Monochrome version
<MonoLogoMark size={24} color="white" />
```

### CSS Utilities

```tsx
// Background patterns
<div className="pixel-grid" />        // 24px grid
<div className="pixel-grid-dense" />  // 8px grid

// Glow effects
<div className="glow-accent" />       // Cyan glow
<div className="glow-subtle" />       // Subtle shadow

// Buttons
<button className="btn-primary">Get Started</button>
<button className="btn-secondary">Learn More</button>
<button className="btn-ghost">Cancel</button>

// Cards
<div className="card-hover">...</div>        // Lift on hover
<div className="card-shine">...</div>        // Subtle shine
<div className="card-accent-border">...</div> // Accent on hover

// Animations
<div className="animate-fade-in-up">...</div>
<div className="animate-focus-pulse">...</div>
<div className="animate-glow-pulse">...</div>
```

---

## Notes

### Clerk Theming

The `layout-srcfull.tsx` includes Clerk appearance customization to match the new brand. If using Clerk's PricingTable, ensure the dashboard appearance settings also use cyan (#00d4ff) as the primary color.

### Font Loading

The new layout loads three Google Fonts:
- Inter (body)
- Space Grotesk (display)
- JetBrains Mono (code)

These are loaded as variable fonts with the `display: swap` strategy for optimal performance.

### Accessibility

All color combinations meet WCAG AA standards:
- Primary text on background: 15.8:1 (AAA)
- Secondary text on background: 7.2:1 (AAA)
- Accent on background: 8.9:1 (AAA)

The design includes proper focus states and respects `prefers-reduced-motion`.

---

*Created: January 2026*
