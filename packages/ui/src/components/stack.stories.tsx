import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Stack } from "./stack";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  argTypes: {
    gap: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl", 0, 8, 16, 24],
    },
    align: {
      control: "select",
      options: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    },
    justify: {
      control: "select",
      options: [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ],
    },
  },
  args: {
    gap: "base",
    align: "stretch",
    justify: "flex-start",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Stack is a layout component for arranging children vertically. It provides consistent spacing, alignment, and justification options.",
      },
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls affect this stack
export const Base: Story = {
  render: (args) => (
    <Stack {...args}>
      <div className="rounded-md border bg-neutral-50 p-3 text-sm">One</div>
      <div className="rounded-md border bg-neutral-50 p-3 text-sm">Two</div>
      <div className="rounded-md border bg-neutral-50 p-3 text-sm">Three</div>
    </Stack>
  ),
};

// Docs-only stories showing comprehensive examples
export const GapSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Stack supports named gap sizes from the component size scale.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map(
        (gapSize) => (
          <div key={gapSize}>
            <div className="mb-2 text-muted-foreground text-xs">
              Gap: {gapSize}
            </div>
            <Stack gap={gapSize}>
              <div className="rounded-md border bg-neutral-50 p-2 text-sm">
                Item
              </div>
              <div className="rounded-md border bg-neutral-50 p-2 text-sm">
                Item
              </div>
              <div className="rounded-md border bg-neutral-50 p-2 text-sm">
                Item
              </div>
            </Stack>
          </div>
        )
      )}
    </div>
  ),
};

export const Alignment: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Stack supports standard flexbox alignment options for horizontal positioning.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        ["stretch", "flex-start", "flex-end", "center", "baseline"] as const
      ).map((alignValue) => (
        <div key={alignValue}>
          <div className="mb-2 text-muted-foreground text-xs">
            Align: {alignValue}
          </div>
          <Stack align={alignValue} gap="sm">
            <div className="w-32 rounded-md border bg-neutral-50 p-2 text-sm">
              Short
            </div>
            <div className="w-48 rounded-md border bg-neutral-50 p-2 text-sm">
              Medium
            </div>
            <div className="w-64 rounded-md border bg-neutral-50 p-2 text-sm">
              Longer item
            </div>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

export const Justification: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Stack supports standard flexbox justification options for vertical distribution.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(
        [
          "flex-start",
          "flex-end",
          "center",
          "space-between",
          "space-around",
          "space-evenly",
        ] as const
      ).map((justifyValue) => (
        <div className="min-w-[200px] flex-1" key={justifyValue}>
          <div className="mb-2 text-muted-foreground text-xs">
            Justify: {justifyValue}
          </div>
          <Stack
            className="h-48 rounded-md border bg-neutral-50 p-3"
            gap="0"
            justify={justifyValue}
          >
            <div className="rounded border bg-white p-2 text-xs">A</div>
            <div className="rounded border bg-white p-2 text-xs">B</div>
            <div className="rounded border bg-white p-2 text-xs">C</div>
          </Stack>
        </div>
      ))}
    </div>
  ),
};

export const CustomGap: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Stack also accepts numeric pixel values for precise gap control.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      {([0, 8, 16, 24] as const).map((gapValue) => (
        <div key={gapValue}>
          <div className="mb-2 text-muted-foreground text-xs">
            Gap: {gapValue}px
          </div>
          <Stack gap={gapValue}>
            <div className="rounded-md border bg-neutral-50 p-2 text-sm">
              Item
            </div>
            <div className="rounded-md border bg-neutral-50 p-2 text-sm">
              Item
            </div>
            <div className="rounded-md border bg-neutral-50 p-2 text-sm">
              Item
            </div>
          </Stack>
        </div>
      ))}
    </div>
  ),
};
