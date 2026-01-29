import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { useState } from "react";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    defaultValue: {
      control: "select",
      options: ["a", "b", "c"],
      description: "Default selected value",
    },
    disabled: {
      control: "boolean",
      description: "Disables all radio options",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "RadioGroup component for selecting a single option from a set of mutually exclusive choices.",
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  args: {
    defaultValue: "a",
    disabled: false,
  },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-a" value="a" />
        <Label htmlFor="rg-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-b" value="b" />
        <Label htmlFor="rg-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-c" value="c" />
        <Label htmlFor="rg-c">Option C</Label>
      </div>
    </RadioGroup>
  ),
};

// With descriptions
export const WithDescriptions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio options with descriptive text.",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="starter">
      <div className="flex items-start gap-2">
        <RadioGroupItem className="mt-1" id="starter" value="starter" />
        <div className="flex flex-col gap-1">
          <Label htmlFor="starter">Starter</Label>
          <p className="text-muted-foreground text-sm">
            Perfect for individuals and small projects
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioGroupItem className="mt-1" id="pro" value="pro" />
        <div className="flex flex-col gap-1">
          <Label htmlFor="pro">Pro</Label>
          <p className="text-muted-foreground text-sm">
            Great for growing teams and businesses
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioGroupItem className="mt-1" id="enterprise" value="enterprise" />
        <div className="flex flex-col gap-1">
          <Label htmlFor="enterprise">Enterprise</Label>
          <p className="text-muted-foreground text-sm">
            Advanced features for large organizations
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

// Disabled options
export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio group with disabled options.",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="enabled">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="enabled" value="enabled" />
        <Label htmlFor="enabled">Enabled option</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem disabled id="disabled1" value="disabled1" />
        <Label htmlFor="disabled1">Disabled option</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem disabled id="disabled2" value="disabled2" />
        <Label htmlFor="disabled2">Another disabled option</Label>
      </div>
    </RadioGroup>
  ),
};

// Horizontal layout
export const Horizontal: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio group with horizontal layout.",
      },
    },
  },
  render: () => (
    <RadioGroup className="flex gap-4" defaultValue="yes">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="yes" value="yes" />
        <Label htmlFor="yes">Yes</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="no" value="no" />
        <Label htmlFor="no">No</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="maybe" value="maybe" />
        <Label htmlFor="maybe">Maybe</Label>
      </div>
    </RadioGroup>
  ),
};
