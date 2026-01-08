import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Button } from "./button";
import { Center } from "./center";

const meta = {
  title: "Layout/Center",
  component: Center,
  tags: ["autodocs"],
  argTypes: {
    inline: {
      control: "boolean",
      description: "Use inline-flex instead of flex",
      defaultValue: false,
    },
    asChild: {
      control: "boolean",
      description: "Merge props with child element",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <div className="h-[400px] border border-gray-300 border-dashed">
      <Center className="h-full">
        <Button>Centered Button</Button>
      </Center>
    </div>
  ),
};

export const WithMultipleChildren: Story = {
  render: () => (
    <div className="h-[400px] border border-gray-300 border-dashed">
      <Center className="h-full gap-4">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </Center>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <div className="space-y-4">
      <p>
        This is a paragraph with{" "}
        <Center className="gap-2" inline>
          <span className="font-bold">inline</span>
          <span>centered</span>
          <span className="italic">content</span>
        </Center>{" "}
        in the middle.
      </p>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <div className="h-[400px] border border-gray-300 border-dashed">
      <Center asChild className="h-full">
        <section>
          <h2 className="mb-4 font-bold text-xl">Centered Section</h2>
          <p className="text-gray-600">This entire section is centered</p>
        </section>
      </Center>
    </div>
  ),
};

export const FullViewport: Story = {
  render: () => (
    <Center className="min-h-screen">
      <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-md">
        <h2 className="mb-2 font-bold text-xl">Centered Card</h2>
        <p className="mb-4 text-gray-600">Centered in the viewport</p>
        <Button>Action</Button>
      </div>
    </Center>
  ),
};
