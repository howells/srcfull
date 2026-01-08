import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Icon } from "../icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item-list-item";
import { ItemList } from "./item-list-root";

const meta = {
  title: "Item List Item",
  component: Item,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic item with icon, title, and description.
 */
export const Basic: Story = {
  render: () => (
    <ItemList variant="open">
      <Item>
        <ItemMedia icon="User" variant="icon" />
        <ItemContent>
          <ItemTitle>Jane Cooper</ItemTitle>
          <ItemDescription>Regional Paradigm Technician</ItemDescription>
        </ItemContent>
      </Item>
    </ItemList>
  ),
};

/**
 * Item with actions on the right side.
 */
export const WithActions: Story = {
  render: () => (
    <ItemList variant="separated">
      <Item>
        <ItemMedia icon="Package" variant="icon" />
        <ItemContent>
          <ItemTitle>New order received</ItemTitle>
          <ItemDescription>Order #12345 has been placed</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge>Pending</Badge>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Item with header for top-level metadata.
 */
export const WithHeader: Story = {
  render: () => (
    <ItemList variant="separated">
      <Item>
        <ItemHeader>
          <div className="flex items-center gap-2">
            <Icon name="GitBranch" size="xs" />
            <span className="font-medium text-xs">feature/new-ui</span>
          </div>
          <Badge variant="outline">2 hours ago</Badge>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Added new list component variants</ItemTitle>
          <ItemDescription>
            Implemented open, separated, and stacked styles for improved
            flexibility
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            View commit
          </Button>
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Item with footer for bottom metadata.
 */
export const WithFooter: Story = {
  render: () => (
    <ItemList variant="separated">
      <Item>
        <ItemMedia icon="FileText" variant="icon" />
        <ItemContent>
          <ItemTitle>Project Proposal</ItemTitle>
          <ItemDescription>Q4 2024 Planning Document</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-xs">
            Last edited 3 days ago
          </span>
          <div className="flex gap-2">
            <Button size="xs" variant="ghost">
              Share
            </Button>
            <Button size="xs" variant="ghost">
              Download
            </Button>
          </div>
        </ItemFooter>
      </Item>
    </ItemList>
  ),
};

/**
 * Item with image media instead of icon.
 */
export const WithImage: Story = {
  render: () => (
    <ItemList variant="open">
      <Item>
        <ItemMedia variant="image">
          <img
            alt="User avatar"
            height={100}
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            width={100}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Alex Johnson</ItemTitle>
          <ItemDescription>
            Senior Product Designer at Acme Inc.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            Contact
          </Button>
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Multiple content areas in a single item.
 */
export const MultipleContent: Story = {
  render: () => (
    <ItemList variant="separated">
      <Item>
        <ItemContent>
          <ItemTitle>Primary Information</ItemTitle>
          <ItemDescription>This is the main content area</ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemTitle>Secondary Info</ItemTitle>
          <ItemDescription>Additional metadata</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Item with custom separator between items.
 */
export const WithSeparator: Story = {
  render: () => (
    <ItemList variant="open">
      <Item>
        <ItemContent>
          <ItemTitle>First Section</ItemTitle>
          <ItemDescription>Content for the first section</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemContent>
          <ItemTitle>Second Section</ItemTitle>
          <ItemDescription>Content for the second section</ItemDescription>
        </ItemContent>
      </Item>
    </ItemList>
  ),
};

/**
 * Compact item with small size.
 */
export const CompactSize: Story = {
  render: () => (
    <ItemList variant="stacked">
      <Item size="sm">
        <ItemMedia icon="Mail" iconSize="xs" variant="icon" />
        <ItemContent>
          <ItemTitle>Email notifications</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="xs" />
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemMedia icon="MessageSquare" iconSize="xs" variant="icon" />
        <ItemContent>
          <ItemTitle>SMS notifications</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="xs" />
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Item without media (icon or image).
 */
export const WithoutMedia: Story = {
  render: () => (
    <ItemList variant="stacked">
      <Item>
        <ItemContent>
          <ItemTitle>General Settings</ItemTitle>
          <ItemDescription>Configure basic preferences</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Advanced Settings</ItemTitle>
          <ItemDescription>Configure advanced options</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Item with only title (no description).
 */
export const TitleOnly: Story = {
  render: () => (
    <ItemList variant="open">
      <Item>
        <ItemMedia icon="File" variant="icon" />
        <ItemContent>
          <ItemTitle>Document.pdf</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            <Icon name="Download" size="xs" />
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia icon="Image" variant="icon" />
        <ItemContent>
          <ItemTitle>Screenshot.png</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            <Icon name="Download" size="xs" />
          </Button>
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Complex item with header, footer, and multiple content areas.
 */
export const Complex: Story = {
  render: () => (
    <ItemList variant="separated">
      <Item>
        <ItemHeader>
          <div className="flex items-center gap-2">
            <Badge variant="default">New</Badge>
            <span className="text-muted-foreground text-xs">Posted today</span>
          </div>
          <Button size="xs" variant="ghost">
            <Icon name="MoreHorizontal" size="xs" />
          </Button>
        </ItemHeader>
        <ItemMedia icon="Briefcase" variant="icon" />
        <ItemContent>
          <ItemTitle>Creative Director</ItemTitle>
          <ItemDescription>
            Lead creative projects and collaborate with teams on brand
            initiatives.
          </ItemDescription>
        </ItemContent>
        <ItemContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Remote</Badge>
            <Badge variant="secondary">Full-time</Badge>
            <Badge variant="secondary">$120k-$150k</Badge>
          </div>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-xs">
            Acme Corporation · San Francisco, CA
          </span>
          <Button size="sm">Apply Now</Button>
        </ItemFooter>
      </Item>
    </ItemList>
  ),
};

/**
 * Clickable item using asChild with a link.
 */
export const ClickableItem: Story = {
  render: () => (
    <ItemList variant="stacked">
      <Item asChild>
        <a className="cursor-pointer" href="#profile">
          <ItemMedia icon="User" variant="icon" />
          <ItemContent>
            <ItemTitle>Profile Settings</ItemTitle>
            <ItemDescription>Manage your profile information</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Icon name="ChevronRight" size="sm" />
          </ItemActions>
        </a>
      </Item>
      <Item asChild>
        <a className="cursor-pointer" href="#account">
          <ItemMedia icon="Settings" variant="icon" />
          <ItemContent>
            <ItemTitle>Account Settings</ItemTitle>
            <ItemDescription>
              Configure your account preferences
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Icon name="ChevronRight" size="sm" />
          </ItemActions>
        </a>
      </Item>
    </ItemList>
  ),
};
