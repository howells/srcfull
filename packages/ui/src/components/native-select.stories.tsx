import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";

const meta = {
  title: "Native Select",
  component: NativeSelect,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A styled native HTML select element that provides a consistent appearance across browsers while maintaining native accessibility and mobile behavior.",
      },
    },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story with controls
export const Base: Story = {
  args: {
    disabled: false,
  },
  render: (args) => (
    <NativeSelect {...args} defaultValue="apple">
      <NativeSelectOptGroup label="Fruits">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="orange">Orange</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Vegetables">
        <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
        <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <NativeSelect {...args} defaultValue="option1">
      <NativeSelectOption value="option1">Option 1</NativeSelectOption>
      <NativeSelectOption value="option2">Option 2</NativeSelectOption>
      <NativeSelectOption value="option3">Option 3</NativeSelectOption>
    </NativeSelect>
  ),
};

// With opt groups
export const WithOptGroups: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Group related options together using NativeSelectOptGroup for better organization.",
      },
    },
  },
  render: () => (
    <NativeSelect defaultValue="ny">
      <NativeSelectOptGroup label="East Coast">
        <NativeSelectOption value="ny">New York</NativeSelectOption>
        <NativeSelectOption value="boston">Boston</NativeSelectOption>
        <NativeSelectOption value="miami">Miami</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="West Coast">
        <NativeSelectOption value="la">Los Angeles</NativeSelectOption>
        <NativeSelectOption value="sf">San Francisco</NativeSelectOption>
        <NativeSelectOption value="seattle">Seattle</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
};

// Simple list
export const SimpleList: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "A simple select without option groups.",
      },
    },
  },
  render: () => (
    <NativeSelect defaultValue="medium">
      <NativeSelectOption value="small">Small</NativeSelectOption>
      <NativeSelectOption value="medium">Medium</NativeSelectOption>
      <NativeSelectOption value="large">Large</NativeSelectOption>
      <NativeSelectOption value="xlarge">Extra Large</NativeSelectOption>
    </NativeSelect>
  ),
};

// Long options
export const LongOptions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Native select handles long option text gracefully.",
      },
    },
  },
  render: () => (
    <NativeSelect defaultValue="1">
      <NativeSelectOption value="1">
        Short option
      </NativeSelectOption>
      <NativeSelectOption value="2">
        This is a much longer option that demonstrates how the select handles
        extended text content
      </NativeSelectOption>
      <NativeSelectOption value="3">
        Another relatively long option with descriptive text
      </NativeSelectOption>
      <NativeSelectOption value="4">Brief</NativeSelectOption>
    </NativeSelect>
  ),
};
