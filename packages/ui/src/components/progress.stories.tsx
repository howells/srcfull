import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Progress } from "./progress";

const meta = {
  title: "Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A progress bar component that displays completion status of a task. Supports controlled value between 0-100 and accessible labels.",
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story with controls
export const Base: Story = {
  args: {
    value: 50,
  },
};

// Progress states
export const ProgressStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Progress bar at various completion percentages.",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">0%</div>
        <Progress value={0} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">25%</div>
        <Progress value={25} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">50%</div>
        <Progress value={50} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">75%</div>
        <Progress value={75} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">100%</div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

// With labels
export const WithLabels: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Progress bars with descriptive labels for context.",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Uploading files</span>
          <span className="text-muted-foreground text-sm">33%</span>
        </div>
        <Progress value={33} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Processing images</span>
          <span className="text-muted-foreground text-sm">67%</span>
        </div>
        <Progress value={67} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">Installation complete</span>
          <span className="text-muted-foreground text-sm">100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

// Different widths
export const DifferentWidths: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Progress bars adapt to container width.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <Progress value={60} />
      </div>
      <div className="w-3/4">
        <Progress value={60} />
      </div>
      <div className="w-1/2">
        <Progress value={60} />
      </div>
      <div className="w-1/4">
        <Progress value={60} />
      </div>
    </div>
  ),
};

// Indeterminate state
export const IndeterminateState: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Progress bar without a value shows indeterminate state (empty).",
      },
    },
  },
  render: () => (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">Loading…</div>
        <Progress />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-sm">
          Known progress (45%)
        </div>
        <Progress value={45} />
      </div>
    </div>
  ),
};
