import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Checkbox component for binary choices with support for checked, unchecked, indeterminate, and disabled states.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - all controls available
export const Base: Story = {
  args: {
    checked: false,
    disabled: false,
  },
};

// All states
export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "All checkbox states including unchecked, checked, indeterminate, and disabled.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="checked" />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox checked="indeterminate" id="indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled id="disabled" />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked disabled id="disabled-checked" />
        <Label htmlFor="disabled-checked">Disabled & Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-invalid={true} id="error" />
        <Label htmlFor="error">Error state</Label>
      </div>
    </div>
  ),
};

// Checked state
export const Checked: Story = {
  args: {
    checked: true,
  },
};

// Indeterminate state
export const Indeterminate: Story = {
  args: {
    checked: "indeterminate",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

// Error state
export const Error: Story = {
  args: {
    "aria-invalid": true,
  },
};

// With label pattern
export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Checkbox paired with a label for better accessibility and usability.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};
