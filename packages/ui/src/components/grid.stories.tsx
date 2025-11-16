import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Grid, GridCol } from "./grid";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 24, step: 1 } },
    gap: { control: { type: "range", min: 0, max: 48, step: 2 } },
    grow: { control: "boolean" },
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
  },
  args: {
    columns: 12,
    gap: 16,
    grow: false,
    justify: "flex-start",
    align: "stretch",
  },
  parameters: {
    docs: {
      description: {
        component:
          "A flexible grid system based on a 12-column layout by default. Supports column spanning, offsets, ordering, and responsive behavior.",
      },
    },
  },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - basic grid with controls
export const Base: Story = {
  render: (args) => (
    <Grid {...args}>
      <GridCol span={4}>
        <Box>1</Box>
      </GridCol>
      <GridCol span={4}>
        <Box>2</Box>
      </GridCol>
      <GridCol span={4}>
        <Box>3</Box>
      </GridCol>
      <GridCol span={4}>
        <Box>4</Box>
      </GridCol>
    </Grid>
  ),
};

// Docs-only stories showing comprehensive examples
export const ColumnSpans: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Grid columns can span different widths across the 12-column layout.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">Equal columns (4 each)</div>
        <Grid>
          <GridCol span={4}>
            <Box>span 4</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>span 4</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>span 4</Box>
          </GridCol>
        </Grid>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Mixed widths</div>
        <Grid>
          <GridCol span={8}>
            <Box>span 8</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>span 4</Box>
          </GridCol>
        </Grid>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Full width</div>
        <Grid>
          <GridCol span={12}>
            <Box>span 12</Box>
          </GridCol>
        </Grid>
      </div>
    </div>
  ),
};

export const OffsetsAndOrder: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Use offsets to create spacing and order props to control visual sequence.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">With offset</div>
        <Grid>
          <GridCol offset={3} span={3}>
            <Box>offset 3, span 3</Box>
          </GridCol>
          <GridCol span={3}>
            <Box>span 3</Box>
          </GridCol>
        </Grid>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Reordered</div>
        <Grid>
          <GridCol order={2} span={3}>
            <Box>Second (order 2)</Box>
          </GridCol>
          <GridCol order={3} span={3}>
            <Box>Third (order 3)</Box>
          </GridCol>
          <GridCol order={1} span={3}>
            <Box>First (order 1)</Box>
          </GridCol>
        </Grid>
      </div>
    </div>
  ),
};

export const Grow: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "When grow is enabled, columns without explicit spans distribute space equally.",
      },
    },
  },
  render: () => (
    <Grid grow>
      <GridCol>
        <Box>1</Box>
      </GridCol>
      <GridCol>
        <Box>2</Box>
      </GridCol>
      <GridCol>
        <Box>3</Box>
      </GridCol>
      <GridCol>
        <Box>4</Box>
      </GridCol>
      <GridCol>
        <Box>5</Box>
      </GridCol>
    </Grid>
  ),
};

export const GutterSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Adjust the gutter (gap) between columns with numeric values.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-2 text-sm font-medium">Gap: 8px</div>
        <Grid gap={8}>
          <GridCol span={4}>
            <Box>1</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>2</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>3</Box>
          </GridCol>
        </Grid>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Gap: 32px</div>
        <Grid gap={32}>
          <GridCol span={4}>
            <Box>1</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>2</Box>
          </GridCol>
          <GridCol span={4}>
            <Box>3</Box>
          </GridCol>
        </Grid>
      </div>
    </div>
  ),
};

export const ResponsiveLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common responsive pattern: full width on mobile, split on desktop.",
      },
    },
  },
  render: () => (
    <Grid>
      <GridCol span={12} spanMd={6}>
        <Box>Full on mobile, half on desktop</Box>
      </GridCol>
      <GridCol span={12} spanMd={6}>
        <Box>Full on mobile, half on desktop</Box>
      </GridCol>
    </Grid>
  ),
};

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-neutral-50 p-4 text-center text-neutral-700 text-sm">
      {children}
    </div>
  );
}
