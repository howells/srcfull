import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

const meta = {
  title: "Layout/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Resizable panel components for creating adjustable layouts. Supports horizontal and vertical orientations with draggable handles.",
      },
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story
export const Horizontal: Story = {
  render: () => (
    <div className="h-40 w-full rounded-md border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Left
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Right
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

// Docs-only stories
export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Resizable panels arranged vertically.",
      },
    },
  },
  render: () => (
    <div className="h-80 w-full rounded-md border">
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Top
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Bottom
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const ThreePanels: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Three resizable panels for complex layouts.",
      },
    },
  },
  render: () => (
    <div className="h-40 w-full rounded-md border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center text-sm">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Main Content
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center text-sm">
            Details
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const WithoutHandle: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Resizable panels with a minimal handle (no visible grip indicator).",
      },
    },
  },
  render: () => (
    <div className="h-40 w-full rounded-md border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Left
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center text-sm">
            Right
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const NestedPanels: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Nested resizable panel groups for complex multi-dimensional layouts.",
      },
    },
  },
  render: () => (
    <div className="h-80 w-full rounded-md border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full items-center justify-center text-sm">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center text-sm">
                Main Content
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center text-sm">
                Footer
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const MinMaxSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Panels with minimum and maximum size constraints.",
      },
    },
  },
  render: () => (
    <div className="h-40 w-full rounded-md border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} maxSize={30} minSize={15}>
          <div className="flex h-full items-center justify-center text-sm">
            Min: 15%, Max: 30%
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80}>
          <div className="flex h-full items-center justify-center text-sm">
            Flexible
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
