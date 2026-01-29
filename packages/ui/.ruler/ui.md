# UI Package Usage (MUST/SHOULD)

Scope: All apps in this monorepo (e.g., apps/web, apps/docs).

## Core Rule
- MUST import UI primitives/components from `@repo/ui`.
- MUST NOT duplicate those components inside app folders (e.g., `apps/web/app/components/ui`).
- SHOULD propose new primitives in `packages/ui` when missing instead of implementing them in apps.

## Imports
- Correct:
  - `import { Button } from "@repo/ui/components/button"`
  - `import { Icon } from "@repo/ui/components/icon"`
  - `import { Avatar } from "@repo/ui/components/avatar"`
- Avoid:
  - `@/components/ui/button` (app-local duplicates)

## Adding Components
1. Implement the primitive in `packages/ui/src/components/`.
2. Use shared utilities from `@repo/ui/lib/*`.
3. Add a Storybook story alongside to document usage.
4. Update apps to import from `@repo/ui`.

## Structure for Complex Components
- SHOULD split complex components into a folder with single-purpose files.
- Recommended layout (no barrel files):
  - `components/<component>/<component>-root.tsx` — root entry
  - `components/<component>/<component>-item.tsx` — item/part variants
  - `components/<component>/<component>-content.tsx` — content/body
  - `components/<component>/<component>-trigger.tsx` — triggers/controls
  - `components/<component>/<component>-context.tsx` — local context/hooks
- MUST NOT create `index.ts` barrels in component folders. Import explicit files.
- SHOULD use a tiny React context (local to the component folder) to share internal state across parts when needed.
- MUST keep existing Storybook stories; add or update stories alongside the component if split.

## Exceptions
- Feature- or app-specific composites (e.g., a particular Sidebar composition) MAY live in an app.
- If a composite becomes generic, promote it to `packages/ui`.

## Consistency
- Icons: use `@repo/ui/components/icon` with the shared size scale.
- Sizes: use the shared `ComponentSize` scale where applicable.
- Styling: rely on tokens and utilities from `@srcfull/tailwind-config`.

## Available Components
**Layout**: `container` (max-width wrapper), `center` (centers content), `flex` (flexbox), `grid` (CSS grid), `simple-grid` (auto-fit grid), `stack` (vertical/horizontal spacing), `space` (spacer), `group` (inline flex group), `masonry` (masonry layout)
**Navigation**: `breadcrumb`, `tabs`, `tab-navigation` (nav tabs), `menubar` (horizontal menu), `sidebar`, `pagination`, `stepper` (multi-step progress), `scrollspy` (scroll-linked nav)
**Forms**: `form`, `field` (label+input wrapper), `input`, `textarea`, `select`, `native-select`, `checkbox`, `radio-group`, `switch` (toggle), `toggle`, `toggle-group`, `slider`, `combobox` (searchable select), `editable` (inline edit), `file-upload`, `tag-input` (multi-value input)
**Display**: `text`, `heading`, `icon`, `avatar`, `badge`, `dot` (status dot), `status` (status badge), `swatch-group` (color swatches), `kbd` (keyboard key), `attribute-card` (key-value card)
**Feedback**: `alert`, `alert-dialog` (modal alert), `dialog` (modal), `drawer` (slide-out panel), `sheet` (bottom sheet), `popover`, `hover-card` (hover popover), `tooltip`, `spinner`, `progress`, `skeleton` (loading placeholder), `empty` (empty state), `sonner` (toast notifications)
**Data**: `table`, `data-grid` (sortable/filterable table), `description-list` (key-value list), `document-list`, `item-list`, `card`, `card-stack` (stacked cards), `details-panel` (expandable details)
**Interactive**: `button`, `button-group`, `accordion`, `accordion-menu` (nested accordion), `collapsible`, `command` (⌘K menu), `context-menu` (right-click menu), `dropdown-menu`, `resizable` (split panes), `scroll-area`, `sortable` (drag to reorder), `variant-selector` (product variants), `filters` (filter UI), `search`
**Utility**: `separator` (divider), `hitbox` (expand click area), `icon-container` (icon wrapper), `visually-hidden-input` (a11y), `tree` (tree view)

Rationale: Centralizing primitives in `@repo/ui` eliminates duplication, ensures consistent UX, and simplifies maintenance across apps.
