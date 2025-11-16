import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Flex } from "./flex";

const meta = {
  title: "Layout/Flex",
  component: Flex,
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "row-reverse", "column", "column-reverse"],
    },
    wrap: { control: "select", options: ["nowrap", "wrap", "wrap-reverse"] },
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
    align: {
      control: "select",
      options: ["stretch", "flex-start", "flex-end", "center", "baseline"],
    },
    gap: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl", 0, 8, 16, 24],
    },
  },
  args: {
    direction: "row",
    wrap: "wrap",
    justify: "flex-start",
    align: "center",
    gap: "base",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Flexbox container with semantic props for direction, wrapping, justification, alignment, and gap.",
      },
    },
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - playground with all controls
export const Base: Story = {
  render: (args) => (
    <Flex {...args}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className="rounded-md border bg-neutral-50 p-3 text-neutral-700 text-sm"
          key={i}
        >
          {i + 1}
        </div>
      ))}
    </Flex>
  ),
};

// Docs-only stories showing comprehensive examples
export const Directions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Flex supports all flexbox direction values including reverse variants.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">Row</div>
        <Flex direction="row" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Row Reverse</div>
        <Flex direction="row-reverse" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Column</div>
        <Flex direction="column" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const Justification: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Control how items are distributed along the main axis with justify-content values.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">Flex Start</div>
        <Flex className="border" justify="flex-start" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Center</div>
        <Flex className="border" justify="center" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Space Between</div>
        <Flex className="border" justify="space-between">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const Alignment: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Control how items are aligned along the cross axis with align-items values.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">Flex Start</div>
        <Flex className="min-h-[120px] border" align="flex-start" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Center</div>
        <Flex className="min-h-[120px] border" align="center" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Stretch</div>
        <Flex className="min-h-[120px] border" align="stretch" gap="sm">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

export const GapSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Flex supports the full component size scale for gap spacing, plus numeric values.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">2xs Gap</div>
        <Flex gap="2xs">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Base Gap</div>
        <Flex gap="base">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">2xl Gap</div>
        <Flex gap="2xl">
          {[1, 2, 3].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Flex>
      </div>
    </div>
  ),
};

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-neutral-50 p-3 text-neutral-700 text-sm">
      {children}
    </div>
  );
}
