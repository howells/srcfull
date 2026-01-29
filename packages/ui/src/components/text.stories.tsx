import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import { Text } from "./text";

const meta = {
  title: "Text",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A text component for body copy. Renders a paragraph with optimal line length and consistent text sizing.",
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    children:
      "This is a paragraph of text with a maximum width optimized for readability.",
  },
};

export const LongForm: Story = {
  render: () => (
    <div className="space-y-4">
      <Text>
        Materia is an open-source collection of UI components and design
        patterns built with React, TypeScript, Tailwind CSS, and Motion.
      </Text>
      <Text>
        Each component is carefully crafted to provide a delightful user
        experience while maintaining accessibility and performance standards.
      </Text>
      <Text>
        The text component automatically constrains line length to improve
        readability, following established typography best practices.
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multiple paragraphs demonstrating the automatic line-length constraint.",
      },
    },
  },
};

export const CustomClassName: Story = {
  render: () => (
    <Text className="text-muted-foreground italic">
      Styled text with custom classes
    </Text>
  ),
  parameters: {
    docs: {
      description: {
        story: "Text can be customized with additional className props.",
      },
    },
  },
};
