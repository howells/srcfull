import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Bold, Italic, Underline } from "lucide-react";
import { Icon } from "./icon";
import { Toggle } from "./toggle";

const meta = {
  title: "Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    pressed: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A two-state button that can be either on or off. Toggles are used for settings, filters, or other binary options. They support different variants and sizes.",
      },
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - all controls available
export const Base: Story = {
  args: {
    children: "Toggle",
    variant: "default",
    size: "default",
  },
};

// All variants with shared controls
export const AllVariants: Story = {
  args: {
    children: "Toggle",
    size: "default",
  },
  render: ({ children, size }) => (
    <div className="flex flex-wrap gap-2">
      {(["default", "outline"] as const).map((variant) => (
        <Toggle key={variant} size={size} variant={variant}>
          {children}
        </Toggle>
      ))}
    </div>
  ),
};

// All sizes with shared controls
export const AllSizes: Story = {
  args: {
    children: "Toggle",
    variant: "default",
  },
  render: ({ children, variant }) => (
    <div className="flex flex-wrap items-center gap-2">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Toggle key={size} size={size} variant={variant}>
          {children}
        </Toggle>
      ))}
    </div>
  ),
};

// Pressed state
export const Pressed: Story = {
  args: {
    pressed: true,
    children: "Pressed",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

// All states
export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Toggles can be in unpressed (off), pressed (on), or disabled states.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Toggle pressed={false}>Unpressed</Toggle>
      <Toggle pressed={true}>Pressed</Toggle>
      <Toggle disabled>Disabled</Toggle>
      <Toggle disabled pressed={true}>
        Pressed + Disabled
      </Toggle>
    </div>
  ),
};

// With icons pattern
export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Toggles can include icons from Lucide React. Common use case for toolbar formatting controls.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Bold">
        <Icon icon={Bold} />
      </Toggle>
      <Toggle aria-label="Italic">
        <Icon icon={Italic} />
      </Toggle>
      <Toggle aria-label="Underline">
        <Icon icon={Underline} />
      </Toggle>
    </div>
  ),
};
