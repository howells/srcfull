# Design Direction: Demo Page

## Aesthetic Direction
- **Mode:** Marketing/demo hybrid
- **Tone:** Editorial industrial
- **Memorable element:** A specimen-board pipeline with oversized numeric bands and a hard contrast between theatrical headlines and dense technical output
- **Typography:** Display: Iowan Old Style / Georgia fallback, Body: Helvetica Neue / Arial fallback, Mono: SF Mono / Consolas
- **Color strategy:** Carbon-black field with parchment data sheets, oxidized copper accent, cold signal-cyan secondary accent
- **Motion philosophy:** Almost still; subtle panel lift and line reveal only where it clarifies hierarchy

## Why The Previous Page Failed
- It looked soft and tasteful instead of precise and technical.
- The stacked “friendly cards” pattern made the package feel generic.
- The page buried the interesting part: the actual data transformations.

## Concrete Decisions
### Typography
- Hero heading becomes oversized serif display with very tight tracking and a hard left edge.
- Supporting copy becomes plain sans to create tension with the display face.
- Numbers and command labels use tabular mono treatment.

### Color Palette
- Background: `#0e0f10`
- Surface dark: `#17191b`
- Paper: `#ede6d8`
- Text on dark: `#f4efe7`
- Text on paper: `#161312`
- Muted: `#8b8377`
- Accent copper: `#c96b37`
- Accent cyan: `#7bc6cf`
- Rules/lines: `rgba(255,255,255,0.08)` on dark, `rgba(22,19,18,0.12)` on paper

### Spacing
- 8px base unit
- Outer frame: 32px mobile, 48px desktop
- Major section rhythm: 56-72px
- Panel padding: 18px compact, 24px standard, 32px hero

### Layout
- No soft hero card.
- Page opens with a split masthead: narrative at left, pipeline metrics at right.
- Main content becomes alternating dark rails and light specimen sheets.
- JSON/code panels become deliberate artifacts, not generic cards.
- Reproduction commands become a compressed operator footer instead of a “tips” section.

## Wireframe
### Desktop
```text
┌────────────────────────────────────────────────────────────────────┐
│ SRCFULL                                    live demo / specimen   │
│                                                                    │
│ How image extraction becomes                                      │
│ a usable pipeline.                 ┌────────────────────────────┐  │
│ short sharp lede                   │ found      resolved       │  │
│                                    │ returned   failed         │  │
│                                    └────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│ EXTRACTION RAIL                                                    │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ sample html                  │ │ normalized candidates        │ │
│ └──────────────────────────────┘ └──────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────┤
│ RESOLUTION SHEET                                                   │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ first run                    │ │ second run / cache hit       │ │
│ └──────────────────────────────┘ └──────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────┤
│ SCRAPE RAIL                                                        │
│ ┌────────────────────┬──────────────────────────────────────────┐ │
│ │ metric stack       │ scrape result json                      │ │
│ └────────────────────┴──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐  │
│ │ cache + pattern store                                       │  │
│ └──────────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────┤
│ operator commands / build / serve / open                          │
└────────────────────────────────────────────────────────────────────┘
```

### Mobile
```text
┌──────────────────────────────┐
│ SRCFULL / live demo          │
│ big headline                 │
│ short lede                   │
│ [found] [resolved]           │
│ [returned] [failed]          │
├──────────────────────────────┤
│ sample html                  │
├──────────────────────────────┤
│ candidates json              │
├──────────────────────────────┤
│ first run                    │
├──────────────────────────────┤
│ second run                   │
├──────────────────────────────┤
│ scrape result                │
├──────────────────────────────┤
│ cache + patterns             │
├──────────────────────────────┤
│ build / serve / open         │
└──────────────────────────────┘
```

## Anti-Patterns To Avoid
- Soft radial lifestyle gradients
- Rounded cards everywhere
- Friendly “feature” blurbs at the top of the page
- White/cream page with tasteful brown shadows as the dominant feel
- Hero → cards → cards → commands repetition without rhythm
