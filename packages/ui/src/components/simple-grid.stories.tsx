import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { SimpleGrid } from "./simple-grid";

const meta = {
  title: "Layout/SimpleGrid",
  component: SimpleGrid,
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: { type: "number", min: 1, max: 12, step: 1 },
      description: "Number of columns in the grid",
    },
    spacing: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl", 0, 8, 16, 24],
      description: "Gap between grid items (token or pixel value)",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  args: {
    cols: 3,
    spacing: "base",
  },
  parameters: {
    docs: {
      description: {
        component:
          "SimpleGrid creates equal-width column layouts with configurable spacing. It uses CSS Grid under the hood for consistent, responsive layouts.",
      },
    },
  },
} satisfies Meta<typeof SimpleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <SimpleGrid {...args}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="rounded-md border bg-neutral-50 p-4 text-center text-neutral-700 text-sm"
          key={i}
        >
          {i + 1}
        </div>
      ))}
    </SimpleGrid>
  ),
};

export const ColumnCounts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "SimpleGrid supports 1 to 12 columns.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 font-medium text-sm">2 columns</div>
        <SimpleGrid cols={2} spacing="sm">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </SimpleGrid>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">3 columns</div>
        <SimpleGrid cols={3} spacing="sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </SimpleGrid>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">4 columns</div>
        <SimpleGrid cols={4} spacing="sm">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </SimpleGrid>
      </div>
    </div>
  ),
};

export const SpacingOptions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Control gap between items using token-based spacing values.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 font-medium text-sm">2xs spacing</div>
        <SimpleGrid cols={3} spacing="2xs">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </SimpleGrid>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">sm spacing</div>
        <SimpleGrid cols={3} spacing="sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </SimpleGrid>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">lg spacing</div>
        <SimpleGrid cols={3} spacing="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </SimpleGrid>
      </div>
    </div>
  ),
};

export const Cards: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Common use case: displaying card-based content in a grid layout.",
      },
    },
  },
  render: () => (
    <SimpleGrid cols={3} spacing="lg">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="rounded-lg border p-4" key={i}>
          <div className="mb-2 h-24 rounded-md bg-neutral-100" />
          <div className="font-medium">Card Title {i + 1}</div>
          <div className="mt-1 text-muted-foreground text-sm">
            Description for card {i + 1}.
          </div>
        </div>
      ))}
    </SimpleGrid>
  ),
};

export const PixelSpacing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Spacing can also be specified in pixels for precise control.",
      },
    },
  },
  render: () => (
    <SimpleGrid cols={3} spacing={8}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="rounded-md border bg-neutral-50 p-3 text-center text-sm"
          key={i}
        >
          {i + 1}
        </div>
      ))}
    </SimpleGrid>
  ),
};
