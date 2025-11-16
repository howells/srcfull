import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes for sizing and styling",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Placeholder preview while content is loading. Maintains layout stability during async operations.",
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  args: {
    className: "h-6 w-40",
  },
};

// Common shapes
export const Shapes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common skeleton shapes for different content types.",
      },
    },
  },
  render: () => (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium">Text lines</div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Avatar</div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Button</div>
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Image</div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  ),
};

// Card layout
export const Card: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Skeleton layout for a loading card component.",
      },
    },
  },
  render: () => (
    <div className="w-72 rounded-xl border p-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
};

// List layout
export const List: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Skeleton layout for a loading list of items.",
      },
    },
  },
  render: () => (
    <div className="w-96 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="flex items-center gap-3" key={i}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
};

// Table layout
export const Table: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Skeleton layout for a loading table.",
      },
    },
  },
  render: () => (
    <div className="w-full space-y-2">
      <div className="flex gap-4">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="flex gap-4" key={i}>
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 flex-1" />
          <Skeleton className="h-6 flex-1" />
        </div>
      ))}
    </div>
  ),
};

// Profile layout
export const Profile: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Skeleton layout for a loading profile header.",
      },
    },
  },
  render: () => (
    <div className="w-96">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  ),
};
