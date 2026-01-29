import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { useState } from "react";
import { Slider } from "./slider";

const meta = {
  title: "Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Slider component for selecting a value or range from a continuous scale. Supports single value and range selection.",
      },
    },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Single value slider with default starting value.",
      },
    },
  },
  render: () => <Slider className="w-80" defaultValue={[50]} />,
};

export const Range: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Range slider for selecting a minimum and maximum value.",
      },
    },
  },
  render: () => <Slider className="w-80" defaultValue={[25, 75]} />,
};

export const WithSteps: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Slider with defined steps for discrete value selection.",
      },
    },
  },
  render: () => <Slider className="w-80" defaultValue={[50]} step={10} />,
};

export const MinMaxRange: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Slider with custom minimum and maximum values.",
      },
    },
  },
  render: () => (
    <Slider
      className="w-80"
      defaultValue={[500]}
      max={1000}
      min={0}
      step={50}
    />
  ),
};

export const Controlled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Controlled slider with value display.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState([50]);
    return (
      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground text-sm">Value: {value[0]}</div>
        <Slider className="w-80" onValueChange={setValue} value={value} />
      </div>
    );
  },
};

export const ControlledRange: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Controlled range slider with value display.",
      },
    },
  },
  render: () => {
    const [value, setValue] = useState([25, 75]);
    return (
      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground text-sm">
          Range: {value[0]} - {value[1]}
        </div>
        <Slider className="w-80" onValueChange={setValue} value={value} />
      </div>
    );
  },
};
