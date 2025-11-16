import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Status, StatusIndicator, StatusLabel } from "./status";

const meta = {
  title: "Status",
  component: Status,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["online", "offline", "maintenance", "degraded"],
    },
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays system or service states with a colored indicator and label.",
      },
    },
  },
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - controls affect this status
export const Base: Story = {
  args: {
    status: "online",
    size: "base",
  },
  render: (args) => (
    <Status status={args.status} size={args.size}>
      <StatusIndicator size={args.size} />
      <StatusLabel />
    </Status>
  ),
};

// All status variants with shared controls
export const AllStatuses: Story = {
  args: {
    size: "base",
  },
  render: ({ size }) => (
    <div className="flex flex-col gap-2">
      {(["online", "offline", "maintenance", "degraded"] as const).map((s) => (
        <Status key={s} status={s} size={size}>
          <StatusIndicator size={size} />
          <StatusLabel />
        </Status>
      ))}
    </div>
  ),
};

// All sizes with shared controls
export const AllSizes: Story = {
  args: {
    status: "online",
  },
  render: ({ status }) => (
    <div className="flex flex-col gap-3">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map((sizeValue) => (
        <Status key={sizeValue} status={status} size={sizeValue}>
          <StatusIndicator size={sizeValue} />
          <StatusLabel />
        </Status>
      ))}
    </div>
  ),
};

// Indicator only (no label)
export const IndicatorOnly: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Status indicator can be used standalone without a label.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(["online", "offline", "maintenance", "degraded"] as const).map((s) => (
        <Status key={s} status={s} size="base">
          <StatusIndicator size="base" />
        </Status>
      ))}
    </div>
  ),
};

// In context example
export const InContext: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Example of status indicators used in a service status dashboard.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">API Service</div>
          <div className="text-xs text-muted-foreground">api.example.com</div>
        </div>
        <Status status="online" size="sm">
          <StatusIndicator size="sm" />
          <StatusLabel />
        </Status>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Database</div>
          <div className="text-xs text-muted-foreground">db.example.com</div>
        </div>
        <Status status="degraded" size="sm">
          <StatusIndicator size="sm" />
          <StatusLabel />
        </Status>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Cache Server</div>
          <div className="text-xs text-muted-foreground">cache.example.com</div>
        </div>
        <Status status="maintenance" size="sm">
          <StatusIndicator size="sm" />
          <StatusLabel />
        </Status>
      </div>
    </div>
  ),
};
