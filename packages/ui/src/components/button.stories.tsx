import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";
import "@srcfull/tailwind-config/shared-styles.css";
import { sizeArgType } from "../lib/storybook";
import {
  ICON_OPTIONS,
  iconControlArgType,
} from "../stories/controls/icon-control";
import { Button } from "./button";

const meta = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    icon: { ...iconControlArgType, defaultValue: ICON_OPTIONS.None },
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "secondary",
        "destructive",
        "outline",
        "dashed",
      ],
      defaultValue: "default",
    },
    appearance: {
      control: "select",
      options: ["solid", "ghost"],
      defaultValue: "solid",
    },
    mode: {
      control: "select",
      options: ["default", "icon", "link"],
      defaultValue: "default",
    },
    radius: {
      control: "select",
      options: ["default", "full"],
      defaultValue: "default",
    },
    underline: {
      control: "select",
      options: ["none", "solid", "dashed"],
      defaultValue: "none",
    },
    underlined: {
      control: "select",
      options: ["none", "solid", "dashed"],
      defaultValue: "none",
    },
    size: sizeArgType,
    iconPlacement: {
      control: "select",
      options: ["start", "end"],
      defaultValue: "start",
    },
    loading: { control: "boolean", defaultValue: false },
    disabled: { control: "boolean", defaultValue: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Interactive elements that trigger actions. Supports variants, sizes, loading states, and icons.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - all controls available
export const Base: Story = {
  args: {
    children: "Button",
    icon: ICON_OPTIONS.ChevronRight,
    size: "base",
    variant: "default",
  },
};

// All variants with shared controls
export const AllVariants: Story = {
  args: {
    icon: ICON_OPTIONS.Star,
    size: "base",
  },
  render: ({ icon, size }) => (
    <div className="flex flex-wrap gap-2">
      {(
        [
          "default",
          "primary",
          "secondary",
          "destructive",
          "outline",
          "dashed",
        ] as const
      ).map((variant) => (
        <Button icon={icon} key={variant} size={size} variant={variant} />
      ))}
    </div>
  ),
};

// All text button sizes with shared controls
export const AllTextSizes: Story = {
  args: {
    icon: ICON_OPTIONS.Star,
    variant: "default",
  },
  render: ({ icon, variant }) => (
    <div className="flex flex-wrap items-center gap-2">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map((size) => (
        <Button icon={icon} key={size} size={size} variant={variant} />
      ))}
    </div>
  ),
};

// Icon mode in all sizes (replaces AllIconSizes)
export const IconModeAllSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Icon mode buttons in all sizes, demonstrating square aspect ratio",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map((size) => (
        <Button
          aria-label="Icon"
          icon={ICON_OPTIONS.Star}
          key={size}
          mode="icon"
          size={size}
        />
      ))}
    </div>
  ),
};

// Loading state
export const Loading: Story = {
  args: {
    loading: true,
    icon: ICON_OPTIONS.ChevronRight,
  },
};

// Loading with custom label
export const LoadingCustomLabel: Story = {
  args: {
    loading: true,
    loadingLabel: "Saving…",
    icon: ICON_OPTIONS.Check,
  },
};

// Loading with icon
export const LoadingWithIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Loading buttons can include icons. The spinner replaces the icon while maintaining proper spacing and alignment.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Button icon={ICON_OPTIONS.ChevronRight} loading />
      <Button icon={ICON_OPTIONS.Check} loading variant="secondary" />
      <Button icon={ICON_OPTIONS.Search} loading variant="outline" />
    </div>
  ),
};

// Variant x Appearance matrix
export const VariantAppearanceMatrix: Story = {
  parameters: {
    docs: {
      description: {
        story: "All variants combined with solid and ghost appearances",
      },
    },
  },
  render: () => {
    const variants = [
      "primary",
      "secondary",
      "destructive",
      "outline",
      "dashed",
    ] as const;
    const appearances = ["solid", "ghost"] as const;
    return (
      <div className="space-y-8">
        {appearances.map((appearance) => (
          <div className="space-y-2" key={appearance}>
            <h4 className="font-medium text-sm capitalize">{appearance}</h4>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <Button
                  appearance={appearance}
                  icon={ICON_OPTIONS.Star}
                  key={variant}
                  variant={variant}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

// Comprehensive matrix: variant x appearance x size
export const ComprehensiveMatrix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Complete matrix showing all combinations of variants, appearances, and sizes",
      },
    },
  },
  render: () => {
    const variants = [
      "primary",
      "secondary",
      "destructive",
      "outline",
      "dashed",
    ] as const;
    const appearances = ["solid", "ghost"] as const;
    const sizes = ["sm", "base", "lg"] as const;
    return (
      <div className="space-y-12">
        {appearances.map((appearance) => (
          <div className="space-y-6" key={appearance}>
            <h3 className="font-semibold text-lg capitalize">
              {appearance} Appearance
            </h3>
            {sizes.map((size) => (
              <div className="space-y-2" key={size}>
                <h4 className="font-medium text-muted-foreground text-xs uppercase">
                  {size}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <Button
                      appearance={appearance}
                      icon={ICON_OPTIONS.Star}
                      key={variant}
                      size={size}
                      variant={variant}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

// Mode showcase: default vs icon vs link
export const ModeShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the three modes: default (text), icon (square), and link (unstyled)",
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button icon={ICON_OPTIONS.Search} mode="default" />
        <Button aria-label="Search" icon={ICON_OPTIONS.Search} mode="icon" />
        <Button icon={ICON_OPTIONS.Search} mode="link" />
      </div>
      <div className="flex items-center gap-4">
        <Button icon={ICON_OPTIONS.Heart} mode="default" variant="secondary" />
        <Button
          aria-label="Like"
          icon={ICON_OPTIONS.Heart}
          mode="icon"
          variant="secondary"
        />
        <Button icon={ICON_OPTIONS.Heart} mode="link" />
      </div>
    </div>
  ),
};

// Link mode underline / underlined variations
export const LinkModeShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story: "Link mode with various underline styles (hover and persistent)",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Hover Underlines</h4>
        <div className="flex flex-wrap gap-4">
          <Button icon={ICON_OPTIONS.Link} mode="link" />
          <Button icon={ICON_OPTIONS.Link} mode="link" underline="solid" />
          <Button icon={ICON_OPTIONS.Link} mode="link" underline="dashed" />
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Persistent Underlines</h4>
        <div className="flex flex-wrap gap-4">
          <Button icon={ICON_OPTIONS.Link} mode="link" underlined="solid" />
          <Button icon={ICON_OPTIONS.Link} mode="link" underlined="dashed" />
        </div>
      </div>
    </div>
  ),
};

// Radius showcase for icon buttons
export const RadiusShowcase: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of default (rounded-md) and full (rounded-full) radius on icon buttons",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs">Default Radius</p>
        <div className="flex gap-2">
          <Button icon={ICON_OPTIONS.Heart} mode="icon" size="sm" />
          <Button icon={ICON_OPTIONS.Heart} mode="icon" size="base" />
          <Button icon={ICON_OPTIONS.Heart} mode="icon" size="lg" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs">Full Radius (Circle)</p>
        <div className="flex gap-2">
          <Button
            icon={ICON_OPTIONS.Heart}
            mode="icon"
            radius="full"
            size="sm"
          />
          <Button
            icon={ICON_OPTIONS.Heart}
            mode="icon"
            radius="full"
            size="base"
          />
          <Button
            icon={ICON_OPTIONS.Heart}
            mode="icon"
            radius="full"
            size="lg"
          />
        </div>
      </div>
    </div>
  ),
};

export const DashedVariant: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The dashed variant uses a dashed border for a distinct outline style",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["sm", "base", "lg"] as const).map((size) => (
        <Button
          icon={ICON_OPTIONS.Diamond}
          key={size}
          size={size}
          variant="dashed"
        />
      ))}
    </div>
  ),
};
// Loading sizes comparison
export const LoadingSizes: Story = {
  args: {
    icon: ICON_OPTIONS.ChevronRight,
  },
  render: ({ icon }) => (
    <div className="flex flex-wrap items-center gap-2">
      {(["2xs", "xs", "base", "lg", "xl", "2xl"] as const).map((size) => (
        <Button icon={icon} key={size} loading size={size} />
      ))}
    </div>
  ),
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

// With icon (left)
export const WithIconLeft: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button icon={ICON_OPTIONS.ChevronRight}>Submit</Button>
      <Button icon={ICON_OPTIONS.Check} variant="secondary">
        Complete
      </Button>
      <Button icon={ICON_OPTIONS.Search} variant="outline">
        Search
      </Button>
    </div>
  ),
};

// With icon (right)
export const WithIconRight: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button icon={ICON_OPTIONS.ChevronRight} iconPlacement="end">
        Continue
      </Button>
      <Button
        icon={ICON_OPTIONS.ChevronRight}
        iconPlacement="end"
        variant="secondary"
      >
        Next
      </Button>
    </div>
  ),
};
