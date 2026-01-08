import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Hitbox } from "./hitbox";

const meta = {
  title: "Layout/Hitbox",
  component: Hitbox,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Preset size or custom CSS value (e.g., '10px', '2rem')",
    },
    position: {
      control: "select",
      options: [
        "all",
        "top",
        "bottom",
        "left",
        "right",
        "vertical",
        "horizontal",
      ],
      description: "Where to apply the hitbox expansion",
    },
    radius: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "Border radius matching the child element shape",
    },
    debug: {
      control: "boolean",
      description: "Visualize the hitbox area with a colored overlay",
    },
  },
  args: {
    size: "md",
    position: "all",
    radius: "md",
    debug: false,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Expands interactive area of small UI elements to meet accessibility guidelines (minimum 24px, 44px on mobile). Uses negative margin to extend clickable area without affecting layout.",
      },
    },
  },
} satisfies Meta<typeof Hitbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls affect this single hitbox
export const Base: Story = {
  render: (args) => (
    <Hitbox {...args}>
      <Checkbox />
    </Hitbox>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithButtons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Common use cases showing how Hitbox improves usability for small interactive elements.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="font-medium text-sm">Small Icon Button (needs hitbox)</p>
        <div className="flex items-center gap-4">
          <Hitbox debug size="lg">
            <Button className="size-8" size="icon" variant="outline">
              <span className="text-xs">×</span>
            </Button>
          </Hitbox>
          <p className="text-muted-foreground text-sm">
            With hitbox - easier to tap
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium text-sm">Checkbox in dense layout</p>
        <div className="flex items-center gap-2">
          <Hitbox debug>
            <Checkbox id="terms" />
          </Hitbox>
          <label
            className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="terms"
          >
            Accept terms and conditions
          </label>
        </div>
      </div>
    </div>
  ),
};

export const RealWorldExample: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A realistic task list showing Hitbox used with horizontal expansion to make checkboxes easier to click without affecting layout.",
      },
    },
  },
  render: () => (
    <div className="w-80 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <h3 className="mb-4 font-medium text-lg">Task List</h3>
      <div className="space-y-3">
        {[
          "Review pull request",
          "Update documentation",
          "Fix bug in auth flow",
          "Deploy to staging",
        ].map((task, i) => (
          <div className="flex items-center gap-3" key={i}>
            <Hitbox position="horizontal">
              <Checkbox id={`task-${i}`} />
            </Hitbox>
            <label
              className="flex-1 cursor-pointer text-sm"
              htmlFor={`task-${i}`}
            >
              {task}
            </label>
          </div>
        ))}
      </div>
    </div>
  ),
};
