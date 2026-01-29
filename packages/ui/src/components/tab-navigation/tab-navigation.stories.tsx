import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Badge } from "../badge/badge-root";
import { TabNavigationLink } from "./tab-navigation-link";
import { TabNavigationList } from "./tab-navigation-list";
import { TabNavigation } from "./tab-navigation-root";

const meta = {
  title: "Tab Navigation",
  component: TabNavigation,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "underline"],
      description: "Visual style of the navigation tabs",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Navigation component for linking between pages with tab-like styling. Uses actual links for client-side routing.",
      },
    },
  },
} satisfies Meta<typeof TabNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    variant: "underline",
  },
  render: (args) => (
    <TabNavigation {...args}>
      <TabNavigationList>
        <TabNavigationLink active href="/dashboard">
          Dashboard
        </TabNavigationLink>
        <TabNavigationLink href="/analytics">Analytics</TabNavigationLink>
        <TabNavigationLink href="/settings">Settings</TabNavigationLink>
      </TabNavigationList>
    </TabNavigation>
  ),
};

export const DefaultStyle: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Default block-style navigation tabs with active state.",
      },
    },
  },
  render: () => (
    <TabNavigation variant="default">
      <TabNavigationList>
        <TabNavigationLink active href="/home">
          Home
        </TabNavigationLink>
        <TabNavigationLink href="/about">About</TabNavigationLink>
        <TabNavigationLink href="/contact">Contact</TabNavigationLink>
      </TabNavigationList>
    </TabNavigation>
  ),
};

export const Underline: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Underline variant with border-bottom indicator for active state.",
      },
    },
  },
  render: () => (
    <TabNavigation variant="underline">
      <TabNavigationList>
        <TabNavigationLink href="/overview">Overview</TabNavigationLink>
        <TabNavigationLink active href="/team">
          Team
        </TabNavigationLink>
        <TabNavigationLink href="/projects">Projects</TabNavigationLink>
        <TabNavigationLink href="/calendar">Calendar</TabNavigationLink>
      </TabNavigationList>
    </TabNavigation>
  ),
};

export const WithNextLink: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Use asChild prop to integrate with Next.js Link component for client-side routing. Example shows the pattern (actual Next.js Link not rendered in Storybook).",
      },
    },
  },
  render: () => (
    <TabNavigation variant="underline">
      <TabNavigationList>
        <TabNavigationLink active href="/dashboard">
          Dashboard (with asChild)
        </TabNavigationLink>
        <TabNavigationLink href="/reports">
          Reports (with asChild)
        </TabNavigationLink>
        <TabNavigationLink href="/settings">
          Settings (with asChild)
        </TabNavigationLink>
      </TabNavigationList>
    </TabNavigation>
  ),
};

export const WithBadge: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Navigation tabs with badge components for counts or status indicators.",
      },
    },
  },
  render: () => (
    <TabNavigation variant="underline">
      <TabNavigationList>
        <TabNavigationLink active href="/inbox">
          Inbox
          <Badge size="xs" variant="secondary">
            12
          </Badge>
        </TabNavigationLink>
        <TabNavigationLink href="/archived">
          Archived
          <Badge size="xs" variant="secondary">
            3
          </Badge>
        </TabNavigationLink>
        <TabNavigationLink href="/sent">Sent</TabNavigationLink>
      </TabNavigationList>
    </TabNavigation>
  ),
};

export const VerticalLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Vertical navigation layout for sidebars or secondary navigation.",
      },
    },
  },
  render: () => (
    <div className="w-64">
      <TabNavigation variant="underline">
        <TabNavigationList className="flex-col items-start">
          <TabNavigationLink active className="w-full" href="/profile">
            Profile
          </TabNavigationLink>
          <TabNavigationLink className="w-full" href="/account">
            Account
          </TabNavigationLink>
          <TabNavigationLink className="w-full" href="/appearance">
            Appearance
          </TabNavigationLink>
          <TabNavigationLink className="w-full" href="/notifications">
            Notifications
          </TabNavigationLink>
        </TabNavigationList>
      </TabNavigation>
    </div>
  ),
};
