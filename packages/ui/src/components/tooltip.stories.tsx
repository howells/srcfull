import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Position of the tooltip relative to the trigger",
    },
  },
  args: {
    side: "top",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays helpful text on hover or focus. Supports multiple positions with automatic overflow handling.",
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls affect this single tooltip
export const Base: Story = {
  args: {
    side: "top",
  },
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent side={args.side}>Tooltip text</TooltipContent>
    </Tooltip>
  ),
};
