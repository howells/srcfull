import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { Kbd, KbdGroup } from "../kbd";

const meta = {
  title: "Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The keyboard key(s) to display",
    },
  },
  args: {
    children: "K",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Kbd displays keyboard shortcuts and key combinations. Use KbdGroup to display multiple keys together.",
      },
    },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - controls affect this kbd
export const Base: Story = {
  render: (args) => <Kbd {...args} />,
};

// Docs-only stories showing comprehensive examples
export const SingleKeys: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Display individual keyboard keys.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Alt</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
    </div>
  ),
};

export const KeyCombinations: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Use KbdGroup to display key combinations.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>Delete</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Shift</Kbd>
        <Kbd>Enter</Kbd>
      </KbdGroup>
    </div>
  ),
};

export const CommonShortcuts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Examples of common keyboard shortcuts with labels.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Search</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Copy</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Paste</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>V</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Save</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Undo</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Z</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Redo</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Z</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};

export const NavigationShortcuts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Keyboard shortcuts for navigation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Go to next</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>↓</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Go to previous</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>↑</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Go back</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>←</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Go forward</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>→</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};

export const PlatformSpecific: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Different keyboard symbols for macOS and Windows/Linux.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-3 text-sm font-medium">macOS</div>
        <div className="flex flex-col gap-2">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>⌥</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>F</Kbd>
          </KbdGroup>
        </div>
      </div>
      <div>
        <div className="mb-3 text-sm font-medium">Windows/Linux</div>
        <div className="flex flex-col gap-2">
          <KbdGroup>
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <KbdGroup>
            <Kbd>Alt</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>F</Kbd>
          </KbdGroup>
        </div>
      </div>
    </div>
  ),
};
