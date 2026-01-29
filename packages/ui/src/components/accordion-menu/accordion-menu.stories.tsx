import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import { FileText, Folder, Home, Settings, User, Users } from "lucide-react";
import { AccordionMenuGroup } from "./accordion-menu-group";
import { AccordionMenuIndicator } from "./accordion-menu-indicator";
import { AccordionMenuItem } from "./accordion-menu-item";
import { AccordionMenuLabel } from "./accordion-menu-label";
import { AccordionMenu } from "./accordion-menu-root";
import { AccordionMenuSeparator } from "./accordion-menu-separator";
import {
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from "./accordion-menu-sub";

const meta = {
  title: "Accordion Menu",
  component: AccordionMenu,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description: "Whether one or multiple items can be open at a time",
    },
    collapsible: {
      control: "boolean",
      description: "Allow all items to be closed (single type only)",
    },
    selectedValue: {
      control: "text",
      description: "The currently selected menu item value",
    },
  },
  args: {
    type: "single",
    collapsible: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A flexible accordion menu that supports multi-level navigation and integrates with your router to manage active states based on the current route.",
      },
    },
  },
} satisfies Meta<typeof AccordionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuItem value="home">
          <Home />
          <span>Home</span>
        </AccordionMenuItem>
        <AccordionMenuItem value="users">
          <Users />
          <span>Users</span>
        </AccordionMenuItem>
        <AccordionMenuItem value="settings">
          <Settings />
          <span>Settings</span>
        </AccordionMenuItem>
      </AccordionMenu>
    </div>
  ),
};

export const WithNestedSubmenus: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuItem value="home">
          <Home />
          <span>Home</span>
        </AccordionMenuItem>
        <AccordionMenuSub value="users">
          <AccordionMenuSubTrigger>
            <Users />
            <span>Users</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            collapsible={true}
            parentValue="users"
            type="single"
          >
            <AccordionMenuItem value="all-users">
              <User />
              <span>All Users</span>
            </AccordionMenuItem>
            <AccordionMenuItem value="admins">
              <User />
              <span>Admins</span>
            </AccordionMenuItem>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
        <AccordionMenuItem value="settings">
          <Settings />
          <span>Settings</span>
        </AccordionMenuItem>
      </AccordionMenu>
    </div>
  ),
};

export const WithLabelsAndSeparators: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuGroup>
          <AccordionMenuLabel>Navigation</AccordionMenuLabel>
          <AccordionMenuItem value="home">
            <Home />
            <span>Home</span>
          </AccordionMenuItem>
          <AccordionMenuItem value="users">
            <Users />
            <span>Users</span>
          </AccordionMenuItem>
        </AccordionMenuGroup>
        <AccordionMenuSeparator />
        <AccordionMenuGroup>
          <AccordionMenuLabel>Settings</AccordionMenuLabel>
          <AccordionMenuItem value="settings">
            <Settings />
            <span>Settings</span>
          </AccordionMenuItem>
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  ),
};

export const MultipleSelection: Story = {
  args: {
    type: "multiple",
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuSub value="files">
          <AccordionMenuSubTrigger>
            <Folder />
            <span>Files</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent parentValue="files" type="multiple">
            <AccordionMenuItem value="documents">
              <FileText />
              <span>Documents</span>
            </AccordionMenuItem>
            <AccordionMenuItem value="images">
              <FileText />
              <span>Images</span>
            </AccordionMenuItem>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
        <AccordionMenuSub value="users">
          <AccordionMenuSubTrigger>
            <Users />
            <span>Users</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent parentValue="users" type="multiple">
            <AccordionMenuItem value="all-users">
              <User />
              <span>All Users</span>
            </AccordionMenuItem>
            <AccordionMenuItem value="admins">
              <User />
              <span>Admins</span>
            </AccordionMenuItem>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      </AccordionMenu>
    </div>
  ),
};

export const WithSelectedValue: Story = {
  args: {
    type: "single",
    collapsible: true,
    selectedValue: "admins",
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuItem value="home">
          <Home />
          <span>Home</span>
        </AccordionMenuItem>
        <AccordionMenuSub value="users">
          <AccordionMenuSubTrigger>
            <Users />
            <span>Users</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            collapsible={true}
            parentValue="users"
            type="single"
          >
            <AccordionMenuItem value="all-users">
              <User />
              <span>All Users</span>
            </AccordionMenuItem>
            <AccordionMenuItem value="admins">
              <User />
              <span>Admins</span>
            </AccordionMenuItem>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      </AccordionMenu>
    </div>
  ),
};

export const DeeplyNested: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuSub value="level1">
          <AccordionMenuSubTrigger>
            <Folder />
            <span>Level 1</span>
          </AccordionMenuSubTrigger>
          <AccordionMenuSubContent
            collapsible={true}
            parentValue="level1"
            type="single"
          >
            <AccordionMenuSub value="level2">
              <AccordionMenuSubTrigger>
                <Folder />
                <span>Level 2</span>
              </AccordionMenuSubTrigger>
              <AccordionMenuSubContent
                collapsible={true}
                parentValue="level2"
                type="single"
              >
                <AccordionMenuItem value="item1">
                  <FileText />
                  <span>Item 1</span>
                </AccordionMenuItem>
                <AccordionMenuItem value="item2">
                  <FileText />
                  <span>Item 2</span>
                </AccordionMenuItem>
              </AccordionMenuSubContent>
            </AccordionMenuSub>
          </AccordionMenuSubContent>
        </AccordionMenuSub>
      </AccordionMenu>
    </div>
  ),
};

export const WithIndicators: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
  render: (args) => (
    <div className="w-64">
      <AccordionMenu {...args}>
        <AccordionMenuItem value="home">
          <Home />
          <span>Home</span>
          <AccordionMenuIndicator>⌘H</AccordionMenuIndicator>
        </AccordionMenuItem>
        <AccordionMenuItem value="users">
          <Users />
          <span>Users</span>
          <AccordionMenuIndicator>
            <span className="rounded bg-primary px-1.5 py-0.5 font-mono text-primary-foreground text-xs">
              23
            </span>
          </AccordionMenuIndicator>
        </AccordionMenuItem>
        <AccordionMenuItem value="settings">
          <Settings />
          <span>Settings</span>
          <AccordionMenuIndicator>⌘,</AccordionMenuIndicator>
        </AccordionMenuItem>
      </AccordionMenu>
    </div>
  ),
};
