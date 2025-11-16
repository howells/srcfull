import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import {
  AlertCircle,
  Check,
  Heart,
  Info,
  Package,
  Search,
  Star,
  Zap,
} from "lucide-react";
import { IconContainer } from "./icon-container";

const meta = {
  title: "Icon Container",
  component: IconContainer,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "base", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: [
        "default",
        "neutral",
        "muted",
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "destructive",
      ],
    },
    iconSize: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"],
    },
    centered: {
      control: "boolean",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "IconContainer wraps icons with a styled background container. Useful for empty states, feature highlights, and status indicators.",
      },
    },
  },
} satisfies Meta<typeof IconContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    icon: Package,
    size: "base",
    variant: "default",
    iconSize: "sm",
  },
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Available container sizes from sm to xl.",
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-4">
      <IconContainer icon={Package} size="sm" />
      <IconContainer icon={Package} size="base" />
      <IconContainer icon={Package} size="lg" />
      <IconContainer icon={Package} size="xl" />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Semantic variants with appropriate colors for different states and contexts.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <IconContainer icon={Package} variant="default" />
      <IconContainer icon={Star} variant="neutral" />
      <IconContainer icon={Heart} variant="muted" />
      <IconContainer icon={Zap} variant="primary" />
      <IconContainer icon={Check} variant="success" />
      <IconContainer icon={Info} variant="info" />
      <IconContainer icon={AlertCircle} variant="warning" />
      <IconContainer icon={AlertCircle} variant="destructive" />
    </div>
  ),
};

export const WithDifferentIconSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Icon size can be controlled independently from container size.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <IconContainer icon={Search} size="lg" iconSize="xs" />
      <IconContainer icon={Search} size="lg" iconSize="sm" />
      <IconContainer icon={Search} size="lg" iconSize="base" />
      <IconContainer icon={Search} size="lg" iconSize="lg" />
    </div>
  ),
};

export const InEmptyState: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common usage in empty states and feature cards.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col items-center gap-4 rounded-lg border border-dashed p-12 text-center">
      <IconContainer icon={Package} variant="neutral" />
      <div>
        <h3 className="mb-1 text-lg font-medium">No packages</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating your first package.
        </p>
      </div>
    </div>
  ),
};

export const StatusIndicators: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Using semantic variants to indicate different statuses.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <IconContainer icon={Check} variant="success" size="sm" />
        <span className="text-sm">Deployment successful</span>
      </div>
      <div className="flex items-center gap-3">
        <IconContainer icon={AlertCircle} variant="warning" size="sm" />
        <span className="text-sm">Warning: High memory usage</span>
      </div>
      <div className="flex items-center gap-3">
        <IconContainer icon={AlertCircle} variant="destructive" size="sm" />
        <span className="text-sm">Error: Connection failed</span>
      </div>
      <div className="flex items-center gap-3">
        <IconContainer icon={Info} variant="info" size="sm" />
        <span className="text-sm">New update available</span>
      </div>
    </div>
  ),
};
