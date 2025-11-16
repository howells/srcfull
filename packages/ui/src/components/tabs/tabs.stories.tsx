import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Calendar, Settings, User } from "lucide-react";
import { Badge } from "../badge";
import { Icon } from "../icon";
import { Text } from "../text";
import { sizeArgType } from "@repo/ui/lib/storybook";
import { Tabs } from "./tabs-root";
import { TabsContent } from "./tabs-content";
import { TabsList } from "./tabs-list";
import { TabsTrigger } from "./tabs-trigger";

const meta = {
  title: "Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "underline", "pill", "button", "line"],
      description: "Visual style of the tabs",
    },
    size: sizeArgType,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Organize content into separate views where only one is visible at a time. Supports multiple variants and sizes.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    variant: "default",
    size: "base",
    defaultValue: "tab1",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Account</TabsTrigger>
        <TabsTrigger value="tab2">Password</TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="mt-4 space-y-4">
        <div className="text-sm">
          <h3 className="mb-2 font-medium">Account Information</h3>
          <p className="text-muted-foreground">
            Manage your account settings and preferences here.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab2" className="mt-4 space-y-4">
        <div className="text-sm">
          <h3 className="mb-2 font-medium">Password Settings</h3>
          <p className="text-muted-foreground">
            Update your password and security settings.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tab3" className="mt-4 space-y-4">
        <div className="text-sm">
          <h3 className="mb-2 font-medium">Application Settings</h3>
          <p className="text-muted-foreground">
            Configure your application preferences and options.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const DefaultStyle: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Default pill-style tabs with a muted background.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-4">
        <Text className="text-muted-foreground">
          Default pill-style tabs with a muted background.
        </Text>
      </TabsContent>
      <TabsContent value="about" className="mt-4">
        <Text className="text-muted-foreground">About content.</Text>
      </TabsContent>
      <TabsContent value="contact" className="mt-4">
        <Text className="text-muted-foreground">Contact information.</Text>
      </TabsContent>
    </Tabs>
  ),
};

export const Pill: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Pill variant with fully rounded tabs.",
      },
    },
  },
  render: () => (
    <Tabs variant="pill" defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-4">
        <Text className="text-muted-foreground">
          Pill variant with rounded-full tabs.
        </Text>
      </TabsContent>
      <TabsContent value="about" className="mt-4">
        <Text className="text-muted-foreground">About content.</Text>
      </TabsContent>
      <TabsContent value="contact" className="mt-4">
        <Text className="text-muted-foreground">Contact information.</Text>
      </TabsContent>
    </Tabs>
  ),
};

export const Line: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Minimal line variant with border-bottom indicator.",
      },
    },
  },
  render: () => (
    <Tabs variant="line" defaultValue="returns">
      <TabsList>
        <TabsTrigger value="returns">Returns</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="warranty">Warranty</TabsTrigger>
      </TabsList>
      <div className="ml-2 mt-4">
        <TabsContent value="returns" className="space-y-2">
          <Text className="leading-7 text-muted-foreground">
            You have 60 days to return any part of your order for a refund in original, unused condition.
          </Text>
        </TabsContent>
        <TabsContent value="shipping" className="space-y-2">
          <Text className="leading-7 text-muted-foreground">
            We ship worldwide via UPS Expedited. Flat rate shipping available to most countries.
          </Text>
        </TabsContent>
        <TabsContent value="warranty" className="space-y-2">
          <Text className="leading-7 text-muted-foreground">
            Standard 1-year manufacturer's warranty covering defects in materials and workmanship.
          </Text>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const Button: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Button variant with bordered tabs.",
      },
    },
  },
  render: () => (
    <Tabs variant="button" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <Text className="text-muted-foreground">Overview dashboard content.</Text>
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <Text className="text-muted-foreground">Analytics and metrics.</Text>
      </TabsContent>
      <TabsContent value="reports" className="mt-4">
        <Text className="text-muted-foreground">Generated reports.</Text>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Tabs with icons alongside text labels.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">
          <Icon icon={User} />
          Profile
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <Icon icon={Calendar} />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon icon={Settings} />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-4">
        <Text className="text-muted-foreground">Profile settings and information.</Text>
      </TabsContent>
      <TabsContent value="calendar" className="mt-4">
        <Text className="text-muted-foreground">Calendar view and events.</Text>
      </TabsContent>
      <TabsContent value="settings" className="mt-4">
        <Text className="text-muted-foreground">Application settings.</Text>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadge: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Tabs with badge components for counts or status.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">
          All
          <Badge size="xs" variant="secondary">
            24
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="active">
          Active
          <Badge size="xs" variant="success">
            8
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending
          <Badge size="xs" variant="warning">
            3
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <Text className="text-muted-foreground">All items (24 total).</Text>
      </TabsContent>
      <TabsContent value="active" className="mt-4">
        <Text className="text-muted-foreground">Active items (8 total).</Text>
      </TabsContent>
      <TabsContent value="pending" className="mt-4">
        <Text className="text-muted-foreground">Pending items (3 total).</Text>
      </TabsContent>
    </Tabs>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "All available tab sizes: 2xs, xs, sm, base (default), lg, xl, 2xl.",
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">2 Extra Large (2xl)</p>
        <Tabs size="2xl" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Extra Large (xl)</p>
        <Tabs size="xl" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Large (lg)</p>
        <Tabs size="lg" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Base - Default</p>
        <Tabs size="base" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Small (sm)</p>
        <Tabs size="sm" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">Extra Small (xs)</p>
        <Tabs size="xs" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">2 Extra Small (2xs)</p>
        <Tabs size="2xs" defaultValue="home">
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Tabs with disabled state.",
      },
    },
  },
  render: () => (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="about" disabled>
          About (Disabled)
        </TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-4">
        <Text className="text-muted-foreground">
          The "About" tab is disabled and cannot be selected.
        </Text>
      </TabsContent>
      <TabsContent value="contact" className="mt-4">
        <Text className="text-muted-foreground">Contact information.</Text>
      </TabsContent>
    </Tabs>
  ),
};
