import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  Bold,
  Italic,
  Layers,
  LayoutGrid,
  LayoutList,
  Monitor,
  Smartphone,
  Tablet,
  Underline,
} from "lucide-react";
import { sizeArgType, variantArgType } from "../lib/storybook";
import { Icon } from "./icon";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
    },
    variant: variantArgType,
    size: sizeArgType,
    spacing: {
      control: { type: "number", min: 0, max: 4, step: 1 },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Select one or multiple options from a set. Supports single and multi-select modes with various sizes and spacing.",
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - all controls available
export const Base: Story = {
  args: {
    type: "single",
    variant: "outline",
    size: "sm",
    spacing: 0,
  },
  render: (args) => (
    <ToggleGroup
      size={args.size}
      spacing={args.spacing}
      type={args.type}
      variant={args.variant}
    >
      <ToggleGroupItem aria-label="Desktop" icon={Monitor} value="desktop" />
      <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
      <ToggleGroupItem aria-label="Mobile" icon={Smartphone} value="mobile" />
    </ToggleGroup>
  ),
};

// Types (single vs multiple)
export const Types: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "ToggleGroup supports single-select (radio-like) and multi-select (checkbox-like) modes.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-muted-foreground text-xs">
          Single (one selection at a time)
        </div>
        <ToggleGroup type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">
          Multiple (multiple selections allowed)
        </div>
        <ToggleGroup type="multiple">
          <ToggleGroupItem aria-label="Bold" icon={Bold} value="bold" />
          <ToggleGroupItem aria-label="Italic" icon={Italic} value="italic" />
          <ToggleGroupItem
            aria-label="Underline"
            icon={Underline}
            value="underline"
          />
        </ToggleGroup>
      </div>
    </div>
  ),
};

// Variants
export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Available variants: default and outline (default).",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-muted-foreground text-xs">Default</div>
        <ToggleGroup type="single" variant="default">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">
          Outline (default)
        </div>
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "ToggleGroup supports all design system sizes: 2xs, xs, sm (default), base, lg, xl, 2xl. Icons automatically scale to match the size.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-muted-foreground text-xs">2xs</div>
        <ToggleGroup size="2xs" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">xs</div>
        <ToggleGroup size="xs" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">sm (default)</div>
        <ToggleGroup size="sm" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">base</div>
        <ToggleGroup size="base" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">lg</div>
        <ToggleGroup size="lg" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">xl</div>
        <ToggleGroup size="xl" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">2xl</div>
        <ToggleGroup size="2xl" type="single">
          <ToggleGroupItem
            aria-label="Desktop"
            icon={Monitor}
            value="desktop"
          />
          <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
          <ToggleGroupItem
            aria-label="Mobile"
            icon={Smartphone}
            value="mobile"
          />
        </ToggleGroup>
      </div>
    </div>
  ),
};

// Spacing options
export const Spacing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Control the gap between toggle items with the spacing prop (0-4). When spacing is 0 with outline variant, borders collapse properly to avoid doubling.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      {[0, 1, 2, 3, 4].map((spacingValue) => (
        <div key={spacingValue}>
          <div className="mb-2 text-muted-foreground text-xs">
            Spacing: {spacingValue}
          </div>
          <ToggleGroup spacing={spacingValue} type="single">
            <ToggleGroupItem
              aria-label="Desktop"
              icon={Monitor}
              value="desktop"
            />
            <ToggleGroupItem aria-label="Tablet" icon={Tablet} value="tablet" />
            <ToggleGroupItem
              aria-label="Mobile"
              icon={Smartphone}
              value="mobile"
            />
          </ToggleGroup>
        </div>
      ))}
    </div>
  ),
};

// With text pattern
export const WithText: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "ToggleGroup items can contain text labels alongside or instead of icons. Use the icon prop for automatic icon sizing and placement.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-muted-foreground text-xs">Text only</div>
        <ToggleGroup type="single">
          <ToggleGroupItem value="desktop">Desktop</ToggleGroupItem>
          <ToggleGroupItem value="tablet">Tablet</ToggleGroupItem>
          <ToggleGroupItem value="mobile">Mobile</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">
          Icon with text (using icon prop)
        </div>
        <ToggleGroup size="base" type="single">
          <ToggleGroupItem icon={Monitor} value="desktop">
            Desktop
          </ToggleGroupItem>
          <ToggleGroupItem icon={Tablet} value="tablet">
            Tablet
          </ToggleGroupItem>
          <ToggleGroupItem icon={Smartphone} value="mobile">
            Mobile
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};

// View modes (List, Grid, Stack)
export const ViewModes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Common pattern for view mode toggles with List, Grid, and Stack options.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-muted-foreground text-xs">Icons only</div>
        <ToggleGroup defaultValue="list" type="single">
          <ToggleGroupItem
            aria-label="List view"
            icon={LayoutList}
            value="list"
          />
          <ToggleGroupItem
            aria-label="Grid view"
            icon={LayoutGrid}
            value="grid"
          />
          <ToggleGroupItem
            aria-label="Stack view"
            icon={Layers}
            value="stack"
          />
        </ToggleGroup>
      </div>
      <div>
        <div className="mb-2 text-muted-foreground text-xs">
          Icons with labels
        </div>
        <ToggleGroup defaultValue="list" size="base" type="single">
          <ToggleGroupItem icon={LayoutList} value="list">
            List
          </ToggleGroupItem>
          <ToggleGroupItem icon={LayoutGrid} value="grid">
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem icon={Layers} value="stack">
            Stack
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
};
