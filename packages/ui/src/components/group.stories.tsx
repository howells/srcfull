import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Group } from "./group";

const meta = {
  title: "Layout/Group",
  component: Group,
  tags: ["autodocs"],
  argTypes: {
    position: {
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
    wrap: { control: "boolean" },
  },
  args: {
    position: "flex-start",
    align: "center",
    gap: "base",
    wrap: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Group is a horizontal flexbox container that arranges children in a row with configurable alignment, spacing, and wrapping behavior.",
      },
    },
  },
} satisfies Meta<typeof Group>;

export default meta;
type Story = StoryObj<typeof meta>;

const ExampleItem = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-md border bg-neutral-50 p-3 text-neutral-700 text-sm">
    {children}
  </div>
);

// Interactive story - controls affect this group
export const Base: Story = {
  render: (args) => (
    <Group {...args}>
      {Array.from({ length: 5 }).map((_, i) => (
        <ExampleItem key={i}>{i + 1}</ExampleItem>
      ))}
    </Group>
  ),
};

// Docs-only stories showing comprehensive examples
export const Positions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Different horizontal alignment options for group children.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 font-medium text-sm">Flex Start</div>
        <Group position="flex-start">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Center</div>
        <Group position="center">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Flex End</div>
        <Group position="flex-end">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Space Between</div>
        <Group position="space-between">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Space Around</div>
        <Group position="space-around">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Space Evenly</div>
        <Group position="space-evenly">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
    </div>
  ),
};

export const Alignment: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Vertical alignment options for items of different heights.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 font-medium text-sm">Stretch (default)</div>
        <Group align="stretch">
          <ExampleItem>Short</ExampleItem>
          <div className="rounded-md border bg-neutral-50 p-6 text-neutral-700 text-sm">
            Tall
          </div>
          <ExampleItem>Short</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Flex Start</div>
        <Group align="flex-start">
          <ExampleItem>Short</ExampleItem>
          <div className="rounded-md border bg-neutral-50 p-6 text-neutral-700 text-sm">
            Tall
          </div>
          <ExampleItem>Short</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Center</div>
        <Group align="center">
          <ExampleItem>Short</ExampleItem>
          <div className="rounded-md border bg-neutral-50 p-6 text-neutral-700 text-sm">
            Tall
          </div>
          <ExampleItem>Short</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Flex End</div>
        <Group align="flex-end">
          <ExampleItem>Short</ExampleItem>
          <div className="rounded-md border bg-neutral-50 p-6 text-neutral-700 text-sm">
            Tall
          </div>
          <ExampleItem>Short</ExampleItem>
        </Group>
      </div>
    </div>
  ),
};

export const Gaps: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Different spacing options between group children.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 font-medium text-sm">2xs</div>
        <Group gap="2xs">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">xs</div>
        <Group gap="xs">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">sm</div>
        <Group gap="sm">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">base</div>
        <Group gap="base">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">lg</div>
        <Group gap="lg">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">xl</div>
        <Group gap="xl">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">2xl</div>
        <Group gap="2xl">
          <ExampleItem>1</ExampleItem>
          <ExampleItem>2</ExampleItem>
          <ExampleItem>3</ExampleItem>
        </Group>
      </div>
    </div>
  ),
};

export const Wrapping: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Groups can wrap children to multiple rows when space is limited.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 font-medium text-sm">No Wrap (default)</div>
        <Group wrap={false}>
          {Array.from({ length: 15 }).map((_, i) => (
            <ExampleItem key={i}>{i + 1}</ExampleItem>
          ))}
        </Group>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">With Wrap</div>
        <Group wrap={true}>
          {Array.from({ length: 15 }).map((_, i) => (
            <ExampleItem key={i}>{i + 1}</ExampleItem>
          ))}
        </Group>
      </div>
    </div>
  ),
};
