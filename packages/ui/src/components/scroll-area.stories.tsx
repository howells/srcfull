import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Layout/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "Custom-styled scrollbars that match your design system.",
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <div className="h-40 w-64 rounded-md border p-2">
      <ScrollArea className="h-full w-full">
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div className="rounded-sm bg-neutral-50 p-2 text-sm" key={i}>
              Row {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Vertical scrolling with custom scrollbar styling.",
      },
    },
  },
  render: () => (
    <div className="h-60 w-80 rounded-md border p-4">
      <ScrollArea className="h-full w-full">
        <div className="space-y-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div className="rounded-sm bg-neutral-50 p-3 text-sm" key={i}>
              Item {i + 1} - This is a scrollable item
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const Horizontal: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Horizontal scrolling with custom scrollbar styling.",
      },
    },
  },
  render: () => (
    <div className="h-40 w-80 rounded-md border p-4">
      <ScrollArea className="h-full w-full">
        <div className="flex gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              className="flex-shrink-0 rounded-sm bg-neutral-50 p-3 text-sm"
              key={i}
            >
              Column {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const BothDirections: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "ScrollArea can handle both vertical and horizontal scrolling simultaneously.",
      },
    },
  },
  render: () => (
    <div className="h-60 w-80 rounded-md border p-4">
      <ScrollArea className="h-full w-full">
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div className="flex gap-2" key={i}>
              {Array.from({ length: 10 }).map((_, j) => (
                <div
                  className="flex-shrink-0 rounded-sm bg-neutral-50 p-3 text-sm"
                  key={j}
                >
                  {i + 1},{j + 1}
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const WithPadding: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "ScrollArea maintains padding around content while scrolling.",
      },
    },
  },
  render: () => (
    <div className="h-60 w-80 rounded-md border">
      <ScrollArea className="h-full w-full p-4">
        <div className="space-y-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <div className="rounded-sm bg-neutral-50 p-3 text-sm" key={i}>
              Padded item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
