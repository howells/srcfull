import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { AvatarFallback } from "./avatar/avatar-fallback";
import { AvatarImage } from "./avatar/avatar-image";
import { AvatarRoot as Avatar } from "./avatar/avatar-root";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import * as Masonry from "./masonry";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Layout/Masonry",
  component: Masonry.Root,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Grid layout with varying item heights. Supports column-count and column-width layouts, with optional linear (same-height rows) mode.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    columnCount: {
      control: "number",
      description: "Fixed number of columns (overrides columnWidth)",
    },
    columnWidth: {
      control: "number",
      description:
        "Minimum width of columns (responsive, auto-calculates column count)",
    },
    gap: {
      control: "number",
      description:
        "Gap between items in pixels, or object with column/row values",
    },
    linear: {
      control: "boolean",
      description:
        "Linear mode: items flow left-to-right, allowing same-height rows",
    },
  },
  args: {
    columnCount: undefined,
    columnWidth: 200,
    gap: 16,
    linear: false,
  },
} satisfies Meta<typeof Masonry.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple items for interactive and basic stories
const items = [
  { id: "1", title: "Item 1", description: "First item with some content" },
  {
    id: "2",
    title: "Item 2",
    description: "Second item with more text to demonstrate variable heights",
  },
  { id: "3", title: "Item 3", description: "Third item" },
  {
    id: "4",
    title: "Item 4",
    description:
      "Fourth item with even more content to show how masonry handles different heights efficiently",
  },
  { id: "5", title: "Item 5", description: "Fifth item" },
  { id: "6", title: "Item 6", description: "Sixth item with some content" },
  { id: "7", title: "Item 7", description: "Seventh item" },
  { id: "8", title: "Item 8", description: "Eighth item with content" },
];

// Complex content items for documentation stories
const contentItems = [
  {
    id: "1",
    type: "article",
    title: "Understanding React Server Components",
    description:
      "A deep dive into how React Server Components work and when to use them in your applications.",
    author: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    tags: ["React", "Next.js"],
    date: "2024-03-15",
  },
  {
    id: "2",
    type: "quote",
    content: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    tags: ["Inspiration"],
  },
  {
    id: "3",
    type: "article",
    title: "TypeScript 5.4 Features",
    description:
      "Exploring the new features and improvements in TypeScript 5.4, including NoInfer utility type and improved type narrowing.",
    author: "Michael Torres",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    tags: ["TypeScript", "JavaScript"],
    date: "2024-03-12",
  },
  {
    id: "4",
    type: "stats",
    title: "Performance Metrics",
    metrics: [
      { label: "First Contentful Paint", value: "1.2s" },
      { label: "Time to Interactive", value: "2.4s" },
      { label: "Largest Contentful Paint", value: "1.8s" },
    ],
    tags: ["Performance"],
  },
  {
    id: "5",
    type: "article",
    title: "Building Accessible Forms",
    description:
      "Learn how to create forms that are accessible to all users, with proper labels, error messages, and keyboard navigation. Best practices for WCAG compliance.",
    author: "Emma Wilson",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=350&fit=crop",
    tags: ["Accessibility", "HTML"],
    date: "2024-03-10",
  },
  {
    id: "6",
    type: "article",
    title: "Monorepo Strategies",
    description:
      "Effective strategies for managing large monorepos with Turborepo and pnpm workspaces.",
    author: "David Kim",
    tags: ["DevOps", "Tooling"],
    date: "2024-03-08",
  },
  {
    id: "7",
    type: "quote",
    content: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    tags: ["Design"],
  },
  {
    id: "8",
    type: "article",
    title: "CSS Container Queries in Production",
    description:
      "How to use CSS container queries to create truly responsive components that adapt to their container's size rather than the viewport.",
    author: "Lisa Park",
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=280&fit=crop",
    tags: ["CSS", "Responsive"],
    date: "2024-03-05",
  },
];

// Interactive story - controls affect this masonry layout
export const Base: Story = {
  render: (args) => (
    <Masonry.Root {...args} fallback={<Skeleton className="h-72 w-full" />}>
      {items.map((item) => (
        <Masonry.Item asChild key={item.id}>
          <div className="flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground shadow-xs">
            <div className="font-medium text-sm leading-tight sm:text-base">
              {item.title}
            </div>
            <span className="text-muted-foreground text-sm">
              {item.description}
            </span>
          </div>
        </Masonry.Item>
      ))}
    </Masonry.Root>
  ),
};

// Documentation stories with controls disabled
export const ContentGrid: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A complex masonry layout showcasing various content types including articles with images, quotes, and statistics. Demonstrates how masonry handles mixed content heights.",
      },
    },
  },
  render: () => (
    <Masonry.Root
      columnCount={3}
      fallback={<Skeleton className="h-72 w-full" />}
      gap={16}
    >
      {contentItems.map((item) => (
        <Masonry.Item key={item.id}>
          {item.type === "article" && (
            <Card className="overflow-hidden py-0">
              {item.image && (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    alt={item.title}
                    className="size-full object-cover"
                    height={900}
                    src={item.image}
                    width={1200}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarFallback>{item.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{item.author}</span>
                  {item.date && (
                    <span className="text-muted-foreground text-xs">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {item.type === "quote" && (
            <Card className="border-l-4 border-l-primary">
              <CardContent className="flex flex-col gap-3">
                <blockquote className="text-base italic leading-relaxed">
                  {item.content}
                </blockquote>
                <cite className="text-muted-foreground text-sm not-italic">
                  — {item.author}
                </cite>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {item.type === "stats" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {item.metrics.map((metric) => (
                  <div
                    className="flex items-center justify-between"
                    key={metric.label}
                  >
                    <span className="text-muted-foreground text-sm">
                      {metric.label}
                    </span>
                    <span className="font-medium font-mono text-base">
                      {metric.value}
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </Masonry.Item>
      ))}
    </Masonry.Root>
  ),
};

const linearItems = [
  {
    id: "1",
    number: 1,
    aspectRatio: "1/1",
  },
  {
    id: "2",
    number: 2,
    aspectRatio: "4/3",
  },
  {
    id: "3",
    number: 3,
    aspectRatio: "3/4",
  },
  {
    id: "4",
    number: 4,
    aspectRatio: "3/2",
  },
  {
    id: "5",
    number: 5,
    aspectRatio: "1/1",
  },
  {
    id: "6",
    number: 6,
    aspectRatio: "1/1",
  },
];

export const Linear: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Linear mode arranges items left-to-right in rows with consistent heights per row. Items with varying aspect ratios flow naturally, creating same-height rows instead of the staggered masonry pattern.",
      },
    },
  },
  render: () => (
    <Masonry.Root
      columnWidth={140}
      fallback={<Skeleton className="h-72 w-full" />}
      gap={10}
      linear
    >
      {linearItems.map((item) => (
        <Masonry.Item
          className="flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-xs"
          key={item.id}
          style={{ aspectRatio: item.aspectRatio }}
        >
          <span className="font-medium text-2xl">{item.number}</span>
        </Masonry.Item>
      ))}
    </Masonry.Root>
  ),
};

export const ColumnWidth: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Use columnWidth instead of columnCount for responsive layouts. The number of columns adjusts automatically based on available space, maintaining the minimum column width.",
      },
    },
  },
  render: () => (
    <Masonry.Root
      columnWidth={200}
      fallback={<Skeleton className="h-72 w-full" />}
      gap={16}
    >
      {items.map((item) => (
        <Masonry.Item asChild key={item.id}>
          <div className="flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground shadow-xs">
            <div className="font-medium text-sm leading-tight sm:text-base">
              {item.title}
            </div>
            <span className="text-muted-foreground text-sm">
              {item.description}
            </span>
          </div>
        </Masonry.Item>
      ))}
    </Masonry.Root>
  ),
};

export const CustomGap: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Customize horizontal and vertical spacing independently by passing an object with column and row values to the gap prop. This example uses 16px horizontal and 24px vertical spacing.",
      },
    },
  },
  render: () => (
    <Masonry.Root
      columnCount={2}
      fallback={<Skeleton className="h-72 w-full" />}
      gap={{ column: 16, row: 24 }}
    >
      {items.map((item) => (
        <Masonry.Item asChild key={item.id}>
          <div className="flex flex-col gap-2 rounded-md border bg-card p-6 text-card-foreground shadow-xs">
            <div className="font-medium text-base">{item.title}</div>
            <span className="text-muted-foreground text-sm">
              {item.description}
            </span>
          </div>
        </Masonry.Item>
      ))}
    </Masonry.Root>
  ),
};
