import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  Copy,
  Download,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";

const meta = {
  title: "Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "List of actions or options. Supports nested submenus, checkboxes, radio groups, separators, and keyboard shortcuts.",
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic dropdown menu with sections, icons, and separators.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icon icon={User} />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Settings} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Mail} />
          Messages
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icon icon={LogOut} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Menu items can include icons for better visual scanning. Use the Icon component with appropriate sizing.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Icon icon={User} />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Settings} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Download} />
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Icon icon={LogOut} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithShortcuts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Display keyboard shortcuts to help users learn faster navigation patterns.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Icon icon={Copy} />
          Copy
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Copy} />
          Cut
          <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={Copy} />
          Paste
          <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithCheckboxes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Use checkbox items for options that can be toggled on or off independently.",
      },
    },
  },
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [emails, setEmails] = useState(false);
    const [updates, setUpdates] = useState(true);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Preferences</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Push Notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={emails}
            onCheckedChange={setEmails}
          >
            Email Notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={updates}
            onCheckedChange={setUpdates}
          >
            Product Updates
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithRadioGroup: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Use radio groups for mutually exclusive options where only one can be selected.",
      },
    },
  },
  render: () => {
    const [theme, setTheme] = useState("light");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Theme</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup onValueChange={setTheme} value={theme}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const WithSubmenu: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Create nested menus for hierarchical actions or options. Submenus open on hover or click.",
      },
    },
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Share</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Icon icon={Mail} />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon={MessageSquare} />
          Message
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon icon={UserPlus} />
            Invite users
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Icon icon={Mail} />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon={MessageSquare} />
              Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Icon icon={Copy} />
              Copy invite link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ComplexExample: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A comprehensive example combining multiple dropdown menu features: groups, separators, icons, shortcuts, checkboxes, radio groups, and submenus.",
      },
    },
  },
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [theme, setTheme] = useState("light");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon icon={User} />
              Profile
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon icon={Settings} />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon icon={Copy} />
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={notifications}
            onCheckedChange={setNotifications}
          >
            Notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup onValueChange={setTheme} value={theme}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Icon icon={LogOut} />
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
