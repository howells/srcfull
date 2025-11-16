import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { ArrowRight } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Icon } from "./icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./item-list/item-list-item";
import { ItemList } from "./item-list/item-list-root";

const meta = {
  title: "Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "inline-radio" },
      options: ["card", "muted"],
    },
    bordered: {
      control: { type: "boolean" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Containers for grouping related content. Supports header with title and description, content area, and optional footer.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// User-controllable playground story
export const Playground: Story = {
  args: {
    bordered: true,
    variant: "card",
  },
  parameters: {
    controls: { disable: false },
    docs: {
      description: {
        story:
          "Interactively toggle the border and switch between `card` and `muted` backgrounds.",
      },
    },
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Use controls to change appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-700 text-sm">
          This card responds to controls.
        </p>
      </CardContent>
    </Card>
  ),
};

// Base interactive story - basic card structure
export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "A basic card with header and content sections.",
      },
    },
  },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Short description of the card</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-700 text-sm">
          Content area can include any elements.
        </p>
      </CardContent>
    </Card>
  ),
};

// Variant: card (token-mapped white) — fixed, not controllable
export const VariantCard: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Card with variant set to "card" (white background via `bg-card`).',
      },
    },
  },
  render: () => (
    <Card variant="card">
      <CardHeader>
        <CardTitle>Card variant: card</CardTitle>
        <CardDescription>Token-mapped white background</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-700 text-sm">Content on white background.</p>
      </CardContent>
    </Card>
  ),
};

// Variant: muted (token-mapped gray) — fixed, not controllable
export const VariantMuted: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Card with variant set to "muted" (gray background via `bg-muted`).',
      },
    },
  },
  render: () => (
    <Card variant="muted">
      <CardHeader>
        <CardTitle>Card variant: muted</CardTitle>
        <CardDescription>Token-mapped gray background</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-700 text-sm">Content on muted background.</p>
      </CardContent>
    </Card>
  ),
};

// Card with action region
export const WithAction: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Cards can include an action region in the header for quick access to metadata or compact information.",
      },
    },
  },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Project Alpha</CardTitle>
        <CardDescription>Updated just now</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-700 text-sm">
          This card demonstrates the header layout with title and description.
        </p>
      </CardContent>
    </Card>
  ),
};

// Card layouts
export const Layouts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Cards can be composed in various ways depending on the content. Not all sections are required.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Header only</CardTitle>
          <CardDescription>Minimal card with just a header</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Header + Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 text-sm">
            This card has a header and content section.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Full card</CardTitle>
          <CardDescription>All sections included</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 text-sm">Complete card structure.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// Footer patterns
export const FooterPatterns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Common footer patterns for different use cases: single action, dual actions, or multiple actions with primary/secondary hierarchy.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Single action</CardTitle>
          <CardDescription>For simple, affirmative flows</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 text-sm">Single action footer.</p>
        </CardContent>
        <CardFooter>
          <Button size="xs">Continue</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dual actions</CardTitle>
          <CardDescription>Cancel and confirm pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 text-sm">
            Secondary action on left, primary on right.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="xs" variant="outline">
            Cancel
          </Button>
          <Button size="xs">Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Multiple actions</CardTitle>
          <CardDescription>Complex action hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 text-sm">
            Group related actions together.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="xs" variant="outline">
            Reset
          </Button>
          <Button size="xs" variant="outline">
            Save draft
          </Button>
          <Button size="xs">Publish</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

/**
 * Demonstrates Card with ItemList integration.
 * Card is for rich, singular content; ItemList is for repeated items inside.
 */
export const WithItemList: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Card and ItemList work together beautifully. Use Card for the container structure and ItemList for repeated content.",
      },
    },
  },
  render: () => (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <ItemList variant="open">
            <Item>
              <ItemMedia icon="User" variant="icon" />
              <ItemContent>
                <ItemTitle>Jane Cooper</ItemTitle>
                <ItemDescription>jane@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="default">Admin</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemMedia icon="User" variant="icon" />
              <ItemContent>
                <ItemTitle>Cody Fisher</ItemTitle>
                <ItemDescription>cody@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">Member</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemMedia icon="User" variant="icon" />
              <ItemContent>
                <ItemTitle>Esther Howard</ItemTitle>
                <ItemDescription>esther@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">Member</Badge>
              </ItemActions>
            </Item>
          </ItemList>
        </CardContent>
      </Card>

      <Card bordered={false} className="p-0">
        <ItemList variant="stacked">
          <Item>
            <ItemContent>
              <ItemTitle>Notifications</ItemTitle>
              <ItemDescription>
                Configure your notification preferences
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="sm" />
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Privacy</ItemTitle>
              <ItemDescription>Manage your privacy settings</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="sm" />
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Appearance</ItemTitle>
              <ItemDescription>
                Customize how the interface looks
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="sm" />
            </ItemActions>
          </Item>
        </ItemList>
      </Card>
    </div>
  ),
};
