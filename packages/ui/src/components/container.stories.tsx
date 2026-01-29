import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Container } from "./container";

const meta = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    strategy: { control: "inline-radio", options: ["block", "grid"] },
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"],
    },
    fluid: { control: "boolean" },
    px: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl", 0, 8, 16, 24, 32],
    },
    py: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl", 0, 8, 16, 24, 32],
    },
  },
  args: {
    strategy: "block",
    size: "xl",
    fluid: false,
    px: "base",
    py: "sm",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Container components center content with a maximum width and consistent padding. They support block and grid strategies, with grid allowing breakout sections that span full width.",
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls enabled
export const Block: Story = {
  render: (args) => (
    <div className="bg-neutral-100 p-8">
      <Container {...args}>
        <div className="space-y-4">
          <div className="rounded-md border bg-white p-6 shadow-xs">
            <h3 className="font-medium text-lg text-neutral-900">
              Container Component
            </h3>
            <p className="mt-2 text-neutral-600 text-sm">
              The Container component centers content with a maximum width and
              optional padding. This ensures consistent layout across your
              application.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-md border bg-white p-4">
              <div className="font-medium text-neutral-900 text-sm">
                Max Width
              </div>
              <div className="mt-1 text-neutral-600 text-xs">
                Current: {args.fluid ? "100% (fluid)" : args.size}
              </div>
            </div>
            <div className="rounded-md border bg-white p-4">
              <div className="font-medium text-neutral-900 text-sm">
                Padding
              </div>
              <div className="mt-1 text-neutral-600 text-xs">
                X: {args.px}, Y: {args.py}
              </div>
            </div>
          </div>
          <div className="rounded-md bg-neutral-200/50 p-4 text-center text-neutral-500 text-xs">
            Resize the viewport to see how the container adapts
          </div>
        </div>
      </Container>
    </div>
  ),
};

export const GridStrategy: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Grid strategy allows content to break out of the container using the data-breakout attribute. This is useful for full-width sections within an otherwise constrained layout.",
      },
    },
  },
  args: { strategy: "grid" },
  render: (args) => (
    <div className="bg-neutral-100 p-8">
      <Container {...args}>
        <div className="rounded-md border bg-white p-6 shadow-xs">
          <h3 className="font-medium text-lg text-neutral-900">
            Grid Strategy
          </h3>
          <p className="mt-2 text-neutral-600 text-sm">
            This content is constrained to the container max-width and centered
            in the middle column.
          </p>
        </div>
        <div className="my-6" data-breakout>
          <div className="rounded-md border-primary/30 border-y-2 border-dashed bg-primary/5 p-6 text-center">
            <div className="font-medium text-primary text-sm">
              Breakout Section
            </div>
            <div className="mt-1 text-neutral-600 text-xs">
              This section uses{" "}
              <code className="rounded bg-neutral-200 px-1 py-0.5 font-mono">
                data-breakout
              </code>{" "}
              to span the full width, breaking out of the container constraints
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-md border bg-white p-4">
            <div className="font-medium text-neutral-900 text-sm">
              Back in Container
            </div>
            <div className="mt-1 text-neutral-600 text-xs">
              Content returns to the constrained middle column
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md bg-neutral-50 p-3 text-center text-neutral-600 text-xs">
              Column 1
            </div>
            <div className="rounded-md bg-neutral-50 p-3 text-center text-neutral-600 text-xs">
              Column 2
            </div>
            <div className="rounded-md bg-neutral-50 p-3 text-center text-neutral-600 text-xs">
              Column 3
            </div>
          </div>
        </div>
      </Container>
    </div>
  ),
};
