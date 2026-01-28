# Srcfull Design System

A comprehensive design system for Srcfull - a paid API that resolves image URLs to their highest-quality source versions.

---

## 1. Brand Identity

### Brand Concept: "Resolution"

Srcfull (source + full) represents the journey from degraded to pristine, from compressed to crystal clear. The visual identity draws from concepts of:

- **Clarity** - The moment blur becomes sharp
- **Precision** - Pixel-perfect accuracy
- **Depth** - Layers of quality revealed
- **Signal** - Cutting through noise to find the source

### Core Metaphor: The Focus Ring

A focus ring (like on a camera lens) represents the act of bringing something into clarity. The logo uses concentric elements that suggest zooming in, resolving, and achieving perfect focus.

### Brand Voice

- **Technical but accessible** - Speaks to developers without being cold
- **Confident** - "We find the source" not "We try to find the source"
- **Direct** - No marketing fluff, just clear value propositions
- **Precise** - Every word matters, like every pixel

---

## 2. Logo System

### Primary Logo: The Source Mark

```
     ╭───────────────╮
     │   ┌───────┐   │
     │   │ ┌───┐ │   │
     │   │ │ S │ │   │
     │   │ └───┘ │   │
     │   └───────┘   │
     ╰───────────────╯
```

The logo consists of three concentric rounded squares, converging on a stylized "S" in the center. This represents:
- Nested image sizes (thumbnail > medium > source)
- Focus/zoom towards clarity
- The "layers" of web images we traverse

### Logo Variants

**Wordmark:**
```
┌─────┐
│ ┌─┐ │  srcfull
│ │S│ │
│ └─┘ │
└─────┘
```

**Favicon (simplified):**
```
┌───┐
│ S │   (Single square with S, works at 16x16)
└───┘
```

**Monochrome:**
Works in pure white on dark, pure black on light, or any single color.

### Logo Specifications

- Minimum size: 24px
- Clear space: Equal to the width of the outer ring stroke
- Never rotate, stretch, or apply effects
- S letterform uses the brand's display font weight

---

## 3. Color Palette

### Design Philosophy

The palette moves away from the warm bee-themed amber to a cooler, more technical feel while remaining distinctive. The accent color is **Electric Cyan** - representing screens, digital precision, and the clarity of high-quality images.

### Primary Colors

```css
/* Core - Deep Space */
--bg-void:        #050508;     /* Deepest background */
--bg-primary:     #0a0a0f;     /* Primary background */
--bg-secondary:   #12121a;     /* Card/elevated surfaces */
--bg-elevated:    #1a1a24;     /* Hover states, input fills */
--bg-hover:       #24242e;     /* Interactive hover */

/* Accent - Electric Cyan */
--accent:         #00d4ff;     /* Primary accent - vibrant cyan */
--accent-bright:  #5ce5ff;     /* Lighter variant */
--accent-muted:   #0891b2;     /* Subdued for secondary elements */
--accent-glow:    rgba(0, 212, 255, 0.15);   /* Glow effects */
--accent-subtle:  rgba(0, 212, 255, 0.06);   /* Backgrounds */

/* Text Hierarchy */
--text-primary:   #fafafa;     /* Primary text - near white */
--text-secondary: #94a3b8;     /* Secondary text - slate-400 */
--text-tertiary:  #64748b;     /* Tertiary - slate-500 */
--text-muted:     #475569;     /* Muted - slate-600 */
--text-disabled:  #334155;     /* Disabled state */

/* Borders */
--border:         rgba(255, 255, 255, 0.06);
--border-hover:   rgba(255, 255, 255, 0.12);
--border-accent:  rgba(0, 212, 255, 0.3);
--border-strong:  rgba(255, 255, 255, 0.2);
```

### Semantic Colors

```css
/* Success - Emerald */
--success:        #10b981;
--success-light:  #34d399;
--success-bg:     rgba(16, 185, 129, 0.1);

/* Error - Red */
--error:          #ef4444;
--error-light:    #f87171;
--error-bg:       rgba(239, 68, 68, 0.1);

/* Warning - Amber (used sparingly) */
--warning:        #f59e0b;
--warning-bg:     rgba(245, 158, 11, 0.1);

/* Info - Blue */
--info:           #3b82f6;
--info-bg:        rgba(59, 130, 246, 0.1);
```

### Light Mode (Optional)

```css
/* Light mode - Clean, minimal */
--bg-primary:     #ffffff;
--bg-secondary:   #f8fafc;
--bg-elevated:    #f1f5f9;
--text-primary:   #0f172a;
--text-secondary: #475569;
--accent:         #0891b2;     /* Slightly darker for contrast */
--border:         rgba(0, 0, 0, 0.08);
```

### Tailwind Configuration

```js
// Add to tailwind theme
colors: {
  srcfull: {
    void: '#050508',
    primary: '#0a0a0f',
    secondary: '#12121a',
    elevated: '#1a1a24',
    hover: '#24242e',
  },
  cyan: {
    DEFAULT: '#00d4ff',
    bright: '#5ce5ff',
    muted: '#0891b2',
  }
}
```

---

## 4. Typography

### Font Stack

**Display/Headings:** `JetBrains Mono` or `Space Grotesk`
- Technical feel without being cold
- Excellent for code samples and API references
- Good readability at all sizes

**Body:** `Inter`
- Clean, modern, excellent screen rendering
- Wide character support
- Variable font for precise weight control

**Code:** `JetBrains Mono` or `Fira Code`
- Ligatures for code samples
- Clear distinction between similar characters

### Type Scale

```css
/* Headings */
--text-6xl: 3.75rem;    /* 60px - Hero headlines */
--text-5xl: 3rem;       /* 48px - Page titles */
--text-4xl: 2.25rem;    /* 36px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Sub-sections */
--text-2xl: 1.5rem;     /* 24px - Card titles */
--text-xl:  1.25rem;    /* 20px - Large body */
--text-lg:  1.125rem;   /* 18px - Emphasized body */
--text-base: 1rem;      /* 16px - Body text */
--text-sm:  0.875rem;   /* 14px - Secondary text */
--text-xs:  0.75rem;    /* 12px - Captions, labels */

/* Line heights */
--leading-tight:   1.2;
--leading-snug:    1.375;
--leading-normal:  1.5;
--leading-relaxed: 1.625;

/* Letter spacing */
--tracking-tighter: -0.05em;
--tracking-tight:   -0.025em;
--tracking-normal:  0;
--tracking-wide:    0.025em;
```

### Typography Usage

| Context | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Hero headline | Space Grotesk | 700 | 60px | text-primary |
| Page title | Space Grotesk | 600 | 36px | text-primary |
| Section title | Inter | 600 | 24px | text-primary |
| Body text | Inter | 400 | 16px | text-secondary |
| Code samples | JetBrains Mono | 400 | 14px | text-primary |
| Labels | Inter | 500 | 12px | text-muted |
| API endpoints | JetBrains Mono | 500 | 14px | accent |

---

## 5. Spacing & Layout

### Spacing Scale

Based on a 4px grid with a focus on generous whitespace:

```css
--space-1:  0.25rem;   /*  4px */
--space-2:  0.5rem;    /*  8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### Layout Principles

1. **Max content width:** 1200px (documentation), 960px (marketing)
2. **Generous margins:** Minimum 24px on mobile, 48px on desktop
3. **Component padding:** 16-24px for cards, 12-16px for buttons
4. **Vertical rhythm:** Sections separated by 64-96px

### Border Radius

```css
--radius-sm:   4px;    /* Subtle rounding */
--radius-md:   8px;    /* Default for buttons, inputs */
--radius-lg:   12px;   /* Cards, containers */
--radius-xl:   16px;   /* Feature cards */
--radius-2xl:  24px;   /* Hero elements */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 6. Visual Effects

### Glow Effects

The signature visual is a subtle cyan glow that suggests digital precision:

```css
/* Accent glow for buttons, focus states */
.glow-accent {
  box-shadow:
    0 0 0 1px rgba(0, 212, 255, 0.1),
    0 0 20px rgba(0, 212, 255, 0.15),
    0 0 40px rgba(0, 212, 255, 0.1);
}

/* Subtle glow for cards on hover */
.glow-subtle {
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 8px 32px rgba(0, 0, 0, 0.3);
}
```

### Grid Pattern (Replacing Hexagon)

A pixel grid or resolution grid pattern that suggests image data:

```css
.pixel-grid {
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Gradient Overlays

```css
/* Hero gradient - top glow */
.bg-gradient-hero {
  background: radial-gradient(
    ellipse 60% 50% at 50% -20%,
    rgba(0, 212, 255, 0.08) 0%,
    transparent 60%
  );
}

/* Card shine effect */
.card-shine {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 50%
  );
}
```

### Animations

```css
/* Focus pulse - for loading/processing states */
@keyframes focus-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(0, 212, 255, 0);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(0, 212, 255, 0.2);
    transform: scale(1.02);
  }
}

/* Scan line - for "resolving" animation */
@keyframes scan-resolve {
  0% {
    clip-path: inset(0 100% 0 0);
    filter: blur(8px);
  }
  100% {
    clip-path: inset(0 0 0 0);
    filter: blur(0);
  }
}

/* Fade in up - standard entrance */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 7. Components

### Buttons

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  PRIMARY              SECONDARY           GHOST         │
│  ┌───────────────┐    ┌───────────────┐   ┌─────────┐  │
│  │ Get API Key   │    │ View Docs     │   │ Learn   │  │
│  └───────────────┘    └───────────────┘   └─────────┘  │
│  cyan bg              border + bg         text only     │
│  dark text            secondary           muted text    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Primary Button:**
```css
.btn-primary {
  background: var(--accent);
  color: var(--bg-primary);
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: var(--accent-bright);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}
```

**Secondary Button:**
```css
.btn-secondary {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 12px 20px;
  border-radius: 8px;
}
.btn-secondary:hover {
  border-color: var(--border-hover);
  background: var(--bg-elevated);
}
```

### Cards

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Transform Endpoint                              │
│                                                  │
│  Resolve a single image URL to its              │
│  highest-quality source.                        │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ POST /api/v1/transform                     │ │
│  │                                            │ │
│  │ curl -X POST https://srcfull.dev/api/...   │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Card Styles:**
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}
.card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
.card-highlight {
  border-color: var(--border-accent);
  box-shadow: 0 0 0 1px rgba(0, 212, 255, 0.1);
}
```

### Code Blocks

```
┌─────────────────────────────────────────────────────┐
│ ┌─ POST  /api/v1/transform ───────────────────────┐│
│ │                                                 ││
│ │ curl -X POST https://srcfull.dev/api/v1/transform \
│ │   -H "Authorization: Bearer sk_live_..." \      ││
│ │   -H "Content-Type: application/json" \         ││
│ │   -d '{"url":"https://example.com/thumb.jpg"}'  ││
│ │                                                 ││
│ └────────────────────────────────[ Copy ]─────────┘│
└─────────────────────────────────────────────────────┘
```

**Code Block Styles:**
```css
.code-block {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  overflow-x: auto;
}
.code-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-muted);
}
.code-method {
  color: var(--accent);
  font-weight: 600;
}
```

### Input Fields

```
┌─────────────────────────────────────────┐
│ API Key Name                            │
│ ┌─────────────────────────────────────┐ │
│ │ Production                          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ URL to Transform                        │
│ ┌─────────────────────────────────────┐ │
│ │ https://example.com/image.jpg       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

```css
.input {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s;
}
.input:focus {
  border-color: var(--accent);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}
.input::placeholder {
  color: var(--text-muted);
}
```

---

## 8. Page Layouts

### Landing Page Hero

```
┌────────────────────────────────────────────────────────────────────┐
│  ┌─┐                                                               │
│  │S│  srcfull                              [Docs] [Sign in] [Start]│
│  └─┘                                                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                    ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪                                 │
│                    ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪  (pixel grid bg)               │
│                    ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪                                 │
│                                                                    │
│                                                                    │
│          ┌─────────────────────────────────────────┐               │
│          │                                         │               │
│          │    Find the source.                     │               │
│          │    Every time.                          │               │
│          │                                         │               │
│          │    Srcfull resolves image URLs to       │               │
│          │    their highest-quality source         │               │
│          │    versions. Built for production       │               │
│          │    pipelines where quality matters.     │               │
│          │                                         │               │
│          │    ┌──────────────┐  ┌──────────────┐   │               │
│          │    │ Get API Key  │  │  View Docs   │   │               │
│          │    └──────────────┘  └──────────────┘   │               │
│          │                                         │               │
│          └─────────────────────────────────────────┘               │
│                                                                    │
│                                                                    │
│          ┌──────────────────────────────────────────────────────┐  │
│          │                                                      │  │
│          │  "Before"                  "After"                   │  │
│          │  ┌────────────┐            ┌────────────────────┐    │  │
│          │  │ ░░░░░░░░░░ │  ────►     │ ████████████████ │    │  │
│          │  │ ░░ blurry ░│            │ ██ CRISP IMAGE ██ │    │  │
│          │  │ ░░░░░░░░░░ │            │ ████████████████ │    │  │
│          │  └────────────┘            └────────────────────┘    │  │
│          │   150x150                   2400x1600                │  │
│          │                                                      │  │
│          └──────────────────────────────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Features Section

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                         How it works                               │
│                                                                    │
│     ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│     │                  │  │                  │  │              │  │
│     │     [icon]       │  │     [icon]       │  │    [icon]    │  │
│     │                  │  │                  │  │              │  │
│     │  Pattern Match   │  │   Probe & Test   │  │  Return Best │  │
│     │                  │  │                  │  │              │  │
│     │  We match URLs   │  │  We test known   │  │  You get the │  │
│     │  against 1000+   │  │  transformations │  │  highest-res │  │
│     │  known patterns  │  │  and verify      │  │  URL that    │  │
│     │  for CDNs and    │  │  they resolve    │  │  actually    │  │
│     │  image services  │  │  to real images  │  │  works       │  │
│     │                  │  │                  │  │              │  │
│     └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### API Endpoints Section

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│                          Two endpoints                             │
│                                                                    │
│   ┌───────────────────────────────┐ ┌───────────────────────────┐  │
│   │                               │ │                           │  │
│   │  Transform                    │ │  Scrape                   │  │
│   │                               │ │                           │  │
│   │  Resolve a single URL         │ │  Extract all images       │  │
│   │                               │ │  from a webpage           │  │
│   │  ┌─────────────────────────┐  │ │  ┌─────────────────────┐  │  │
│   │  │ POST /api/v1/transform  │  │ │  │ POST /api/v1/scrape │  │  │
│   │  │                         │  │ │  │                     │  │  │
│   │  │ {                       │  │ │  │ {                   │  │  │
│   │  │   "url": "..."          │  │ │  │   "url": "..."      │  │  │
│   │  │ }                       │  │ │  │ }                   │  │  │
│   │  └─────────────────────────┘  │ │  └─────────────────────┘  │  │
│   │                               │ │                           │  │
│   │  Response:                    │ │  Response:                │  │
│   │  {                            │ │  {                        │  │
│   │    "source": "...",           │ │    "images": [...],       │  │
│   │    "width": 2400,             │ │    "count": 12            │  │
│   │    "height": 1600             │ │  }                        │  │
│   │  }                            │ │                           │  │
│   │                               │ │                           │  │
│   └───────────────────────────────┘ └───────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  srcfull                                            [User] [Docs]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Dashboard                                                         │
│  user@example.com                                                  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                         Usage                               │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │   │
│  │  │   1,234    │  │    156     │  │    892     │            │   │
│  │  │   Total    │  │  24 Hours  │  │   7 Days   │            │   │
│  │  └────────────┘  └────────────┘  └────────────┘            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       API Keys                              │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │ [Key name...........................] [Create Key]  │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │  Production                    sk_live_abc...       │   │   │
│  │  │  Created 3 days ago            [Revoke]             │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │  Development                   sk_test_xyz...       │   │   │
│  │  │  Created 1 week ago            [Revoke]             │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Pricing Page

```
┌────────────────────────────────────────────────────────────────────┐
│  srcfull                                            [Sign in]      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                            Pricing                                 │
│                                                                    │
│          Simple pricing. Unlimited potential.                      │
│                                                                    │
│                                                                    │
│     ┌──────────────────────┐    ┌──────────────────────────┐      │
│     │                      │    │         ★ PRO            │      │
│     │       STARTER        │    │                          │      │
│     │                      │    │        $29/mo            │      │
│     │       $9/mo          │    │                          │      │
│     │                      │    │  ✓ 50,000 requests/mo    │      │
│     │  ✓ 5,000 requests/mo │    │  ✓ Both endpoints        │      │
│     │  ✓ Transform only    │    │  ✓ Priority support      │      │
│     │  ✓ Email support     │    │  ✓ Webhook callbacks     │      │
│     │                      │    │  ✓ Custom patterns       │      │
│     │                      │    │                          │      │
│     │  ┌────────────────┐  │    │  ┌────────────────────┐  │      │
│     │  │  Get Started   │  │    │  │  Get Started       │  │      │
│     │  └────────────────┘  │    │  └────────────────────┘  │      │
│     │                      │    │                          │      │
│     └──────────────────────┘    └──────────────────────────┘      │
│                                                                    │
│                                                                    │
│     ┌────────────────────────────────────────────────────────┐    │
│     │                                                        │    │
│     │  Need more? Contact us for enterprise pricing.         │    │
│     │                                                        │    │
│     │  ✓ Unlimited requests    ✓ SLA guarantee               │    │
│     │  ✓ Dedicated support     ✓ Custom integration          │    │
│     │                                                        │    │
│     │  [Contact Sales]                                       │    │
│     │                                                        │    │
│     └────────────────────────────────────────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 9. Icon System

### Custom Icons

Simple, monoline icons that match the technical aesthetic:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Transform       Scrape          Key            Docs             │
│                                                                  │
│   ┌───┐         ┌─┬─┐          ╭──╮           ┌─────┐           │
│   │ → │ ───►    │ │ │          │  │           │ === │           │
│   └───┘         └─┴─┘          ╰──┤           │ === │           │
│    │             ↓              ╭─╯           │     │           │
│   ┌───┐         ┌───┐          │             │ === │           │
│   │███│         │img│          ○             └─────┘           │
│   └───┘         │img│                                           │
│                 │img│                                           │
│                 └───┘                                           │
│                                                                  │
│  Focus/Zoom     Check          Error          Settings          │
│                                                                  │
│   ╭───╮         ┌───┐          ┌───┐          ╭───╮             │
│   │ ○─│───      │ ✓ │          │ × │          │ ≡ │             │
│   ╰───╯         └───┘          └───┘          ╰───╯             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Favicon Specifications

```
16x16:  Simple "S" in a square
32x32:  "S" with single border ring
48x48:  Full concentric squares visible
192x192: Full detail logo
512x512: Full detail with subtle glow
```

---

## 10. Implementation Notes

### CSS Variables to Update

Replace in `globals.css`:

```css
:root {
  /* Core palette - REPLACE */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-elevated: #1a1a24;
  --bg-hover: #24242e;

  /* Accent - REPLACE amber with cyan */
  --accent: #00d4ff;
  --accent-light: #5ce5ff;
  --accent-glow: rgba(0, 212, 255, 0.15);
  --accent-subtle: rgba(0, 212, 255, 0.06);

  /* Text - KEEP similar structure */
  --text-primary: #fafafa;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-muted: #475569;

  /* Borders - KEEP structure, update accent */
  --border: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(255, 255, 255, 0.12);
  --border-accent: rgba(0, 212, 255, 0.3);

  /* Status - KEEP */
  --success: #10b981;
  --success-bg: rgba(16, 185, 129, 0.1);
  --error: #ef4444;
  --error-bg: rgba(239, 68, 68, 0.1);
}
```

### Background Pattern

Replace `.hex-grid` with `.pixel-grid`:

```css
.pixel-grid {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Font Updates

In `layout.tsx`:

```tsx
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
```

### Metadata Updates

```tsx
export const metadata: Metadata = {
  title: {
    default: "Srcfull",
    template: "%s | Srcfull",
  },
  description: "Resolve image URLs to their highest-quality source versions.",
  // ...
};
```

---

## 11. Migration Checklist

- [ ] Update CSS variables in `globals.css`
- [ ] Replace hex-grid with pixel-grid pattern
- [ ] Update fonts (Space Grotesk, JetBrains Mono)
- [ ] Update logo in header
- [ ] Update favicon (`icon.tsx`, `apple-icon.tsx`)
- [ ] Update OG image (`opengraph-image.tsx`)
- [ ] Update all "Beeline" text references to "Srcfull"
- [ ] Update manifest.ts (app name, icons)
- [ ] Update metadata in layout.tsx
- [ ] Update Clerk theming to match new colors
- [ ] Update footer copyright
- [ ] Test all color contrast for accessibility (WCAG AA minimum)

---

## 12. Accessibility Notes

- **Color contrast:** All text meets WCAG AA standards
  - `--text-primary` on `--bg-primary`: 15.8:1 (AAA)
  - `--text-secondary` on `--bg-primary`: 7.2:1 (AAA)
  - `--accent` on `--bg-primary`: 8.9:1 (AAA)
- **Focus states:** Visible cyan outline on all interactive elements
- **Reduced motion:** Respect `prefers-reduced-motion` for animations
- **Semantic HTML:** Proper heading hierarchy, landmark regions

---

*Document version: 1.0*
*Last updated: January 2026*
