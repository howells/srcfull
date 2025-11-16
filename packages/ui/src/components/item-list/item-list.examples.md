# ItemList Component Usage Guide

The `ItemList` component system provides three distinct list styles inspired by [Tailwind UI's stacked lists](https://tailwindcss.com/plus/ui-blocks/application-ui/lists/stacked-lists).

## Philosophy

**ItemList** is for displaying collections of repeated items. Use it instead of `Card` when you need to show multiple similar entries. `Card` is for single, rich content containers.

---

## Three List Styles

### 1. **Open** (Default)
Minimal list with dividers between items. No backgrounds.

```tsx
<ItemList variant="open">
  <Item>
    <ItemMedia variant="icon" icon="User" />
    <ItemContent>
      <ItemTitle>Jane Cooper</ItemTitle>
      <ItemDescription>Regional Paradigm Technician</ItemDescription>
    </ItemContent>
  </Item>
  <Item>
    <ItemMedia variant="icon" icon="User" />
    <ItemContent>
      <ItemTitle>Cody Fisher</ItemTitle>
      <ItemDescription>Product Directives Officer</ItemDescription>
    </ItemContent>
  </Item>
</ItemList>
```

**When to use**: Simple data lists, user directories, basic navigation menus.

---

### 2. **Separated**
Individual elevated items with gaps between them, each with card styling.

```tsx
<ItemList variant="separated">
  <Item variant="default">
    <ItemMedia variant="icon" icon="Package" />
    <ItemContent>
      <ItemTitle>New order received</ItemTitle>
      <ItemDescription>Order #12345 has been placed</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Badge>Pending</Badge>
    </ItemActions>
  </Item>
  <Item variant="default">
    <ItemMedia variant="icon" icon="Truck" />
    <ItemContent>
      <ItemTitle>Shipment dispatched</ItemTitle>
      <ItemDescription>Order #12344 has been shipped</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Badge>In Transit</Badge>
    </ItemActions>
  </Item>
</ItemList>
```

**When to use**: Dashboards, feature lists, notifications, activity feeds.

**Note**: This is **NOT** the same as the `Card` component. Use `separated` for repeated items; use `Card` for singular, structured content with header/footer/actions.

---

### 3. **Stacked**
Items connected together with no gaps. Rounded corners only on first/last items.

```tsx
<ItemList variant="stacked">
  <Item>
    <ItemMedia variant="icon" icon="Bell" />
    <ItemContent>
      <ItemTitle>Notifications</ItemTitle>
      <ItemDescription>Receive alerts about activity</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Icon name="ChevronRight" size="sm" />
    </ItemActions>
  </Item>
  <Item>
    <ItemMedia variant="icon" icon="Lock" />
    <ItemContent>
      <ItemTitle>Privacy & Security</ItemTitle>
      <ItemDescription>Manage your privacy settings</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Icon name="ChevronRight" size="sm" />
    </ItemActions>
  </Item>
</ItemList>
```

**When to use**: Settings pages, compact navigation menus, grouped actions.

---

## Component API

### ItemList

The semantic container for repeated items. Renders as `<ul>` or `<ol>`.

**Props:**
- `variant?: "open" | "separated" | "stacked"` (default: `"open"`)
- `ordered?: boolean` (default: `false`) - Render as `<ol>` instead of `<ul>`

### Item

Individual list items that adapt to their parent list. Renders as `<li>`.

**Props:**
- `variant?: "default" | "outline" | "muted"` (default: `"default"`)
- `size?: "default" | "sm"` (default: `"default"`)
- `asChild?: boolean` (use with Radix Slot for polymorphism)

### Sub-components

All sub-components render as `<div>` except where noted:

- **ItemMedia**: Icon, image, or custom media (left side)
- **ItemContent**: Main content area with title and description
- **ItemTitle**: Primary text (bold)
- **ItemDescription**: Secondary text (muted) - renders as `<p>`
- **ItemActions**: Right-side actions (buttons, badges, icons)
- **ItemHeader**: Top metadata row (spans full width)
- **ItemFooter**: Bottom metadata row (spans full width)
- **ItemSeparator**: Custom separator between items

---

## Size Variants

Use `size="sm"` for more compact lists:

```tsx
<ItemList variant="stacked">
  <Item size="sm">
    <ItemMedia variant="icon" icon="Mail" iconSize="xs" />
    <ItemContent>
      <ItemTitle>Email notifications</ItemTitle>
    </ItemContent>
    <ItemActions>
      <Icon name="ChevronRight" size="xs" />
    </ItemActions>
  </Item>
</ItemList>
```

---

## Item Variants in Separated Lists

In `separated` lists, use different `Item` variants for emphasis:

```tsx
<ItemList variant="separated">
  <Item variant="default">
    <ItemContent>
      <ItemTitle>Default</ItemTitle>
      <ItemDescription>Standard card background</ItemDescription>
    </ItemContent>
  </Item>

  <Item variant="outline">
    <ItemContent>
      <ItemTitle>Outline</ItemTitle>
      <ItemDescription>Emphasized border</ItemDescription>
    </ItemContent>
  </Item>

  <Item variant="muted">
    <ItemContent>
      <ItemTitle>Muted</ItemTitle>
      <ItemDescription>Subtle background</ItemDescription>
    </ItemContent>
  </Item>
</ItemList>
```

---

## Integration with Card

ItemList and Card work together beautifully:

### Pattern 1: ItemList Inside Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Team Members</CardTitle>
    <CardDescription>Manage your team</CardDescription>
  </CardHeader>
  <CardContent className="px-0">
    <ItemList variant="open">
      <Item>...</Item>
      <Item>...</Item>
    </ItemList>
  </CardContent>
</Card>
```

**Note**: Use `className="px-0"` on `CardContent` to let Items handle their own padding.

### Pattern 2: Stacked List as Card

```tsx
<Card bordered={false} className="p-0">
  <ItemList variant="stacked">
    <Item>Settings Item 1</Item>
    <Item>Settings Item 2</Item>
  </ItemList>
</Card>
```

### Pattern 3: Separated Items (No Card Wrapper)

```tsx
<ItemList variant="separated">
  <Item>Feature 1</Item>
  <Item>Feature 2</Item>
</ItemList>
```

---

## Imports

Since we use a folder structure without barrel files, import directly from the files:

```tsx
import { ItemList } from "@repo/ui/components/item-list/item-list-root";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions
} from "@repo/ui/components/item-list/item-list-item";
```

---

## Advanced: Clickable Items

Use `asChild` with Next.js Link or button elements:

```tsx
import Link from "next/link";

<ItemList variant="stacked">
  <Item asChild>
    <Link href="/settings/profile">
      <ItemContent>
        <ItemTitle>Profile Settings</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Icon name="ChevronRight" />
      </ItemActions>
    </Link>
  </Item>
</ItemList>
```

---

## Real-World Examples

### Settings Page

```tsx
<ItemList variant="stacked">
  <Item>
    <ItemContent>
      <ItemTitle>Profile Information</ItemTitle>
      <ItemDescription>Update your name, email, and photo</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm" variant="ghost">Edit</Button>
    </ItemActions>
  </Item>
  <Item>
    <ItemContent>
      <ItemTitle>Change Password</ItemTitle>
      <ItemDescription>Keep your account secure</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm" variant="ghost">Change</Button>
    </ItemActions>
  </Item>
</ItemList>
```

### Activity Feed

```tsx
<ItemList variant="separated">
  <Item>
    <ItemHeader>
      <div className="flex items-center gap-2">
        <Icon name="GitBranch" size="xs" />
        <span className="text-xs font-medium">feature/new-ui</span>
      </div>
      <Badge variant="outline">2 hours ago</Badge>
    </ItemHeader>
    <ItemContent>
      <ItemTitle>Added new list component variants</ItemTitle>
      <ItemDescription>
        Implemented open, separated, and stacked styles
      </ItemDescription>
    </ItemContent>
  </Item>
</ItemList>
```

### User Directory

```tsx
<ItemList variant="open">
  <Item>
    <ItemMedia variant="image">
      <img src="/avatars/jane.jpg" alt="Jane Cooper" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Jane Cooper</ItemTitle>
      <ItemDescription>jane@example.com</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm" variant="ghost">Contact</Button>
    </ItemActions>
  </Item>
</ItemList>
```

### Team Dashboard (in Card)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
    <CardDescription>What your team has been up to</CardDescription>
  </CardHeader>
  <CardContent className="px-0">
    <ItemList variant="open">
      <Item>
        <ItemMedia variant="icon" icon="User" />
        <ItemContent>
          <ItemTitle>Jane completed onboarding</ItemTitle>
          <ItemDescription>2 hours ago</ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon" icon="FileText" />
        <ItemContent>
          <ItemTitle>New document shared</ItemTitle>
          <ItemDescription>5 hours ago</ItemDescription>
        </ItemContent>
      </Item>
    </ItemList>
  </CardContent>
</Card>
```

---

## Design Philosophy

The component uses **context-aware styling**:

1. **ItemList** sets `data-variant` on the container
2. **Item** uses CSS group selectors to adapt automatically:
   ```css
   group-data-[variant=separated]/item-list:rounded-lg
   ```
3. This keeps the API simple while supporting complex layouts

Items automatically inherit the right borders, backgrounds, shadows, and spacing based on their parent list—no manual prop drilling needed!

---

## Card vs ItemList Quick Reference

| Use Case | Component | Example |
|----------|-----------|---------|
| Single dashboard widget | `Card` | Profile card, stats widget |
| List of users | `ItemList` | User directory, team members |
| Single form section | `Card` | Checkout form, contact form |
| Multiple notifications | `ItemList` | Activity feed, alerts |
| Settings menu | `ItemList` | Preferences list, account settings |
| Product feature highlight | `Card` | Hero feature, pricing tier |
| List of products | `ItemList` | Product grid items, search results |

**Rule of thumb**:
- Single, rich content = `Card`
- Multiple, repeated items = `ItemList`
