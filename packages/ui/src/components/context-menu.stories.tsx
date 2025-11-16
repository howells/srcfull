import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Copy, Trash, Edit, Share2, Download } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";
import { Icon } from "./icon";

const meta = {
  title: "Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Contextual actions triggered by right-click or long-press. Supports keyboard navigation.",
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic context menu with labels, items, and separators. Right-click on the trigger area to open the menu.",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="rounded-md border p-6 text-neutral-700 text-sm">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Icon icon={Copy} />
          Copy
        </ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Context menu items can include icons for better visual recognition.",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="rounded-md border p-6 text-neutral-700 text-sm">
          Right click for actions
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Icon icon={Edit} />
          Edit
        </ContextMenuItem>
        <ContextMenuItem>
          <Icon icon={Copy} />
          Copy
        </ContextMenuItem>
        <ContextMenuItem>
          <Icon icon={Share2} />
          Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Icon icon={Download} />
          Download
        </ContextMenuItem>
        <ContextMenuItem>
          <Icon icon={Trash} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithSections: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Use labels and separators to organize menu items into logical sections.",
      },
    },
  },
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="rounded-md border p-6 text-neutral-700 text-sm">
          Right click for organized menu
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>
          <Icon icon={Edit} />
          Edit
        </ContextMenuItem>
        <ContextMenuItem>
          <Icon icon={Copy} />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Share</ContextMenuLabel>
        <ContextMenuItem>
          <Icon icon={Share2} />
          Share link
        </ContextMenuItem>
        <ContextMenuItem>
          <Icon icon={Download} />
          Export
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Icon icon={Trash} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
