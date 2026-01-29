import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

const meta = {
  title: "Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Command palettes provide fast, keyboard-driven access to actions and navigation. They support search, grouping, and keyboard shortcuts for efficient interaction.",
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story
export const DialogOpen: Story = {
  render: () => (
    <CommandDialog onOpenChange={() => {}} open>
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem>Toggle theme</CommandItem>
          <CommandItem>Open settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem>Go to dashboard</CommandItem>
          <CommandItem>Open profile</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ),
};

// Docs-only stories
export const WithMultipleGroups: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Command palettes can organize items into multiple groups with headings and separators.",
      },
    },
  },
  render: () => (
    <CommandDialog onOpenChange={() => {}} open>
      <CommandInput placeholder="Search commands…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="File">
          <CommandItem>New file</CommandItem>
          <CommandItem>Open file…</CommandItem>
          <CommandItem>Save</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Edit">
          <CommandItem>Copy</CommandItem>
          <CommandItem>Paste</CommandItem>
          <CommandItem>Cut</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="View">
          <CommandItem>Zoom in</CommandItem>
          <CommandItem>Zoom out</CommandItem>
          <CommandItem>Fullscreen</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ),
};
