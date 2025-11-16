import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Textarea } from "./textarea";

const meta = {
  title: "Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
    rows: {
      control: "number",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Textarea is a multi-line text input component for longer form content. It extends the native textarea element with consistent styling and supports standard textarea attributes.",
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - all controls available
export const Base: Story = {
  args: {
    placeholder: "Write a message…",
    disabled: false,
    rows: 4,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea",
  },
};

// Error state
export const Error: Story = {
  args: {
    placeholder: "Invalid textarea",
    "aria-invalid": true,
  },
};

// All states
export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Textarea supports standard input states.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Default</div>
        <Textarea placeholder="Enter your text here…" />
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">With value</div>
        <Textarea defaultValue="This textarea has some content already filled in." />
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Disabled</div>
        <Textarea disabled placeholder="This textarea is disabled" />
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Error</div>
        <Textarea placeholder="Invalid textarea" aria-invalid={true} />
      </div>
    </div>
  ),
};

// Row sizes
export const RowSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Control the height of the textarea using the rows attribute.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Rows: 2</div>
        <Textarea rows={2} placeholder="Compact textarea…" />
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Rows: 4 (default)</div>
        <Textarea rows={4} placeholder="Standard textarea…" />
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Rows: 8</div>
        <Textarea rows={8} placeholder="Tall textarea…" />
      </div>
    </div>
  ),
};

// With label pattern
export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Example of textarea used with a label and helper text.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea id="description" placeholder="Enter a description…" />
        <p className="text-xs text-muted-foreground">Provide a detailed description of the item.</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="feedback" className="text-sm font-medium">
          Feedback
        </label>
        <Textarea id="feedback" rows={6} placeholder="Share your thoughts…" />
        <p className="text-xs text-muted-foreground">Your feedback helps us improve the product.</p>
      </div>
    </div>
  ),
};
