import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Separator } from "./separator";

const meta = {
  title: "Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "The orientation of the separator",
    },
    decorative: {
      control: "boolean",
      description: "Whether the separator is purely decorative (default: true)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Separator visually divides content sections. It can be horizontal or vertical and supports ARIA attributes for accessibility.",
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - controls available
export const Base: Story = {
  args: {
    orientation: "horizontal",
    decorative: true,
  },
  render: (args) => (
    <div className="w-80">
      <div className="py-2">Above</div>
      <Separator {...args} />
      <div className="py-2">Below</div>
    </div>
  ),
};

// Horizontal orientation
export const Horizontal: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Horizontal separator (default orientation).",
      },
    },
  },
  render: () => (
    <div className="w-80">
      <div className="py-2">Above</div>
      <Separator orientation="horizontal" />
      <div className="py-2">Below</div>
    </div>
  ),
};

// Vertical orientation
export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Vertical separator for dividing horizontal content.",
      },
    },
  },
  render: () => (
    <div className="flex h-24 items-center gap-4">
      <span>Left</span>
      <Separator orientation="vertical" />
      <span>Right</span>
    </div>
  ),
};

// In cards
export const InCards: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common usage of separators within card layouts to divide sections.",
      },
    },
  },
  render: () => (
    <div className="w-96 space-y-4">
      <div className="rounded-lg border p-4">
        <div className="font-medium">Card Title</div>
        <div className="mt-1 text-muted-foreground text-sm">
          Card description goes here
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="text-sm">Item 1</div>
          <div className="text-sm">Item 2</div>
          <div className="text-sm">Item 3</div>
        </div>
      </div>
    </div>
  ),
};

// In menus
export const InMenus: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Separators commonly divide menu sections for better organization.",
      },
    },
  },
  render: () => (
    <div className="w-56 rounded-md border bg-white p-1 shadow-md">
      <div className="px-2 py-1.5 text-sm hover:bg-neutral-50">New File</div>
      <div className="px-2 py-1.5 text-sm hover:bg-neutral-50">New Folder</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm hover:bg-neutral-50">Open</div>
      <div className="px-2 py-1.5 text-sm hover:bg-neutral-50">Save</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm hover:bg-neutral-50">Exit</div>
    </div>
  ),
};

// With custom spacing
export const WithCustomSpacing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Control spacing around separators using margin utilities.",
      },
    },
  },
  render: () => (
    <div className="w-80 space-y-8">
      <div>
        <div className="mb-2 text-sm font-medium">Tight spacing (my-2)</div>
        <div>Content above</div>
        <Separator className="my-2" />
        <div>Content below</div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Default spacing (my-4)</div>
        <div>Content above</div>
        <Separator className="my-4" />
        <div>Content below</div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Loose spacing (my-6)</div>
        <div>Content above</div>
        <Separator className="my-6" />
        <div>Content below</div>
      </div>
    </div>
  ),
};
