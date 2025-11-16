import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { Heading } from "./heading";

const meta = {
  title: "Heading",
  component: Heading,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: "select",
      options: ["1", "2", "3", "4", "5", "6"],
      labels: {
        "1": "h1",
        "2": "h2",
        "3": "h3",
        "4": "h4",
        "5": "h5",
        "6": "h6",
      },
      description: "The semantic HTML heading level (h1-h6)",
    },
    size: {
      control: "select",
      options: ["2xl", "xl", "lg", "base", "sm", "xs"],
      description: "The visual size (defaults to match level)",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Heading component supporting h1-h6 with customizable visual sizes. Visual size defaults to semantic level but can be overridden.",
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    level: "1",
    children: "Welcome to Materia",
  },
};

// All heading levels with matching sizes
export const Levels: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "All heading levels (h1-h6) with their default matching visual sizes.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Level h1 - Size 2xl - text-5xl (48px)</div>
        <Heading level="1">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Level h2 - Size xl - text-4xl (36px)</div>
        <Heading level="2">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Level h3 - Size lg - text-3xl (30px)</div>
        <Heading level="3">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Level h4 - Size base - text-2xl (24px)</div>
        <Heading level="4">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Level h5 - Size sm - text-xl (20px)</div>
        <Heading level="5">The quick brown fox jumps over the lazy dog</Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Level h6 - Size xs - text-lg (18px)</div>
        <Heading level="6">The quick brown fox jumps over the lazy dog</Heading>
      </div>
    </div>
  ),
};

// All visual sizes
export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "All available visual sizes demonstrated on h2 elements. Size 2xl is largest, xs is smallest.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Size 2xl - text-5xl (48px)</div>
        <Heading level="2" size="2xl">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Size xl - text-4xl (36px)</div>
        <Heading level="2" size="xl">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Size lg - text-3xl (30px)</div>
        <Heading level="2" size="lg">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Size base - text-2xl (24px)</div>
        <Heading level="2" size="base">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Size sm - text-xl (20px)</div>
        <Heading level="2" size="sm">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </div>
      <div>
        <div className="mb-2 text-xs text-muted-foreground">Size xs - text-lg (18px)</div>
        <Heading level="2" size="xs">
          The quick brown fox jumps over the lazy dog
        </Heading>
      </div>
    </div>
  ),
};
