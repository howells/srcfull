import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Spinner } from "./spinner";

const meta = {
  title: "Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Spinner displays a loading indicator. It supports the full component size scale and is used for async operations or loading states.",
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - controls affect this spinner
export const Base: Story = {
  args: {
    size: "base",
  },
};

// All sizes with shared controls
export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Spinners support the full component size scale from 2xs to 2xl.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Spinner size="2xs" />
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="base" />
      <Spinner size="lg" />
      <Spinner size="xl" />
      <Spinner size="2xl" />
    </div>
  ),
};

// In context examples
export const InContext: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Example of spinners used in context with labels and descriptions.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Spinner size="sm" />
        <span className="text-muted-foreground text-sm">Loading…</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="base" />
        <span className="text-sm">Processing your request</span>
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="lg" />
        <div className="flex flex-col gap-1">
          <span className="font-medium text-base">Uploading files</span>
          <span className="text-muted-foreground text-xs">
            This may take a few moments
          </span>
        </div>
      </div>
    </div>
  ),
};
