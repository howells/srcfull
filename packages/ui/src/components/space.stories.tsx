import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Space } from "./space";

const meta = {
  title: "Layout/Space",
  component: Space,
  tags: ["autodocs"],
  argTypes: {
    w: {
      control: "select",
      options: [
        undefined,
        "2xs",
        "xs",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        8,
        16,
        24,
        32,
      ],
      description: "Width using token or pixel value",
    },
    h: {
      control: "select",
      options: [
        undefined,
        "2xs",
        "xs",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        8,
        16,
        24,
        32,
      ],
      description: "Height using token or pixel value",
    },
  },
  args: {
    w: undefined,
    h: "base",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Creates whitespace between elements. Use for vertical (height) or horizontal (width) spacing.",
      },
    },
  },
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <div>
      <div className="rounded-md border bg-neutral-50 p-3 text-sm">Above</div>
      <Space {...args} />
      <div className="rounded-md border bg-neutral-50 p-3 text-sm">Below</div>
    </div>
  ),
};

export const VerticalSpacing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Vertical spacing using token-based heights.",
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map((size) => (
        <div key={size}>
          <div className="mb-2 font-medium text-sm">{size} spacing</div>
          <div>
            <div className="rounded-md border bg-neutral-50 p-3 text-sm">
              Above
            </div>
            <Space h={size} />
            <div className="rounded-md border bg-neutral-50 p-3 text-sm">
              Below
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const HorizontalSpacing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Horizontal spacing using token-based widths.",
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map((size) => (
        <div key={size}>
          <div className="mb-2 font-medium text-sm">{size} spacing</div>
          <div className="flex items-center">
            <div className="rounded-md border bg-neutral-50 p-3 text-sm">
              Left
            </div>
            <Space w={size} />
            <div className="rounded-md border bg-neutral-50 p-3 text-sm">
              Right
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const PixelValues: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Spacing can also use pixel values for precise control.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 font-medium text-sm">8px vertical</div>
        <div>
          <div className="rounded-md border bg-neutral-50 p-3 text-sm">
            Above
          </div>
          <Space h={8} />
          <div className="rounded-md border bg-neutral-50 p-3 text-sm">
            Below
          </div>
        </div>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">24px horizontal</div>
        <div className="flex items-center">
          <div className="rounded-md border bg-neutral-50 p-3 text-sm">
            Left
          </div>
          <Space w={24} />
          <div className="rounded-md border bg-neutral-50 p-3 text-sm">
            Right
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InLayouts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common usage of Space in layout compositions.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <div className="rounded-lg border p-4">
        <div className="font-medium">Section Title</div>
        <Space h="sm" />
        <div className="text-muted-foreground text-sm">
          This is some content in the section.
        </div>
        <Space h="base" />
        <div className="flex gap-2">
          <div className="rounded-md bg-neutral-100 p-2 text-sm">Item 1</div>
          <div className="rounded-md bg-neutral-100 p-2 text-sm">Item 2</div>
        </div>
      </div>
    </div>
  ),
};
