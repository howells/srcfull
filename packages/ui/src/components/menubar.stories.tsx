import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { ClipboardPaste, Copy, Scissors, Settings } from "lucide-react";
import { Icon } from "./icon";
import { MenubarContent } from "./menubar/menubar-content";
import { MenubarItem } from "./menubar/menubar-item";
import { MenubarMenu } from "./menubar/menubar-menu";
import { Menubar } from "./menubar/menubar-root";
import { MenubarSeparator } from "./menubar/menubar-separator";
import {
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "./menubar/menubar-sub";
import { MenubarTrigger } from "./menubar/menubar-trigger";

const meta = {
  title: "Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A horizontal menu bar for desktop-style applications. Provides quick access to commands.",
      },
    },
  },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story
export const Base: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>
              <Icon icon={Settings} />
              Preferences
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>General</MenubarItem>
              <MenubarItem>Advanced</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

// Docs-only stories
export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Menu items can include icons for better visual recognition.",
      },
    },
  },
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Icon icon={Copy} />
            Copy
          </MenubarItem>
          <MenubarItem>
            <Icon icon={Scissors} />
            Cut
          </MenubarItem>
          <MenubarItem>
            <Icon icon={ClipboardPaste} />
            Paste
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const WithSubmenus: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Menubar supports nested submenus for organizing related commands.",
      },
    },
  },
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New File</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Export as PDF</MenubarItem>
              <MenubarItem>Export as HTML</MenubarItem>
              <MenubarItem>Export as JSON</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarSubTrigger>
              <Icon icon={Settings} />
              Preferences
            </MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>General</MenubarItem>
              <MenubarItem>Advanced</MenubarItem>
              <MenubarItem>Privacy</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const MultipleMenus: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "A complete menubar with multiple top-level menus.",
      },
    },
  },
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab</MenubarItem>
          <MenubarItem>New Window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Close</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Icon icon={Copy} />
            Copy
          </MenubarItem>
          <MenubarItem>
            <Icon icon={ClipboardPaste} />
            Paste
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Full Screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
