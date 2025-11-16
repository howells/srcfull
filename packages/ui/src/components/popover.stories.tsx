import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Calendar, HelpCircle, Info, Settings } from "lucide-react";
import { Button } from "./button";
import { Icon } from "./icon";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Rich content in a floating panel anchored to a trigger. Supports various alignments and dismisses on outside clicks or Escape.",
      },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic popover with icon and content. Click outside or press escape to dismiss.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-start gap-2 text-sm">
          <Icon icon={Info} />
          <div>
            <div className="font-medium">Popover title</div>
            <div className="text-muted-foreground">
              Supporting text goes here. This is a simple popover example.
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Popovers can include icons to provide visual context for the content.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon icon={HelpCircle} />
          Help
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-start gap-3">
          <Icon icon={HelpCircle} className="text-blue-600" />
          <div className="space-y-1">
            <div className="font-semibold">Need help?</div>
            <div className="text-muted-foreground text-sm">
              Visit our documentation or contact support for assistance with this
              feature.
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Popovers can contain interactive elements like forms. They remain open while users interact with the content.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon icon={Settings} />
          Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithCustomWidth: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Popover width can be customized to accommodate different content sizes.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Narrow</Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-2">
            <h4 className="font-medium">Narrow popover</h4>
            <p className="text-muted-foreground text-sm">
              This popover has a narrow width.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Wide</Button>
        </PopoverTrigger>
        <PopoverContent className="w-96">
          <div className="space-y-2">
            <h4 className="font-medium">Wide popover</h4>
            <p className="text-muted-foreground text-sm">
              This popover has a wider width to accommodate more content. It can
              contain longer text and more complex layouts.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Alignments: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Popovers automatically position themselves relative to the trigger, but you can control the preferred alignment.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top">
          <div className="space-y-2">
            <h4 className="font-medium">Top aligned</h4>
            <p className="text-muted-foreground text-sm">
              Popover appears above the trigger.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom">
          <div className="space-y-2">
            <h4 className="font-medium">Bottom aligned</h4>
            <p className="text-muted-foreground text-sm">
              Popover appears below the trigger.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left">
          <div className="space-y-2">
            <h4 className="font-medium">Left aligned</h4>
            <p className="text-muted-foreground text-sm">
              Popover appears to the left.
            </p>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right">
          <div className="space-y-2">
            <h4 className="font-medium">Right aligned</h4>
            <p className="text-muted-foreground text-sm">
              Popover appears to the right.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const InfoPopover: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A common pattern for displaying contextual information using an info icon trigger.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-2">
      <span>Hover for more info</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Icon icon={Info} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Additional Information</h4>
            <p className="text-muted-foreground text-sm">
              This pattern is commonly used for inline help text and contextual
              information. The info icon is a familiar affordance that users
              expect to provide additional details.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const DatePickerPattern: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Example of a date picker pattern using a popover. This demonstrates how popovers can be used for more complex UI components.",
      },
    },
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Icon icon={Calendar} />
          Pick a date
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4">
          <div className="space-y-2">
            <div className="font-medium">Select date</div>
            <div className="text-muted-foreground text-sm">
              Calendar component would go here. This demonstrates how popovers can
              host complex interactive components like date pickers.
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
