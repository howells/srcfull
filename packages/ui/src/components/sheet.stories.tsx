import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sheet is a sliding panel that appears from the edge of the screen. It provides a focused overlay for forms, settings, or additional content without leaving the current page.",
      },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a description of what the sheet contains.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">Your content goes here.</div>
      </SheetContent>
    </Sheet>
  ),
};

export const Sides: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Sheets can slide in from any side: right (default), left, top, or bottom.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Right (Default)</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Right Side</SheetTitle>
            <SheetDescription>Slides in from the right edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Left</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Left Side</SheetTitle>
            <SheetDescription>Slides in from the left edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Top</Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Top Side</SheetTitle>
            <SheetDescription>Slides in from the top edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom Side</SheetTitle>
            <SheetDescription>Slides in from the bottom edge.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common use case: a sheet containing a form for user input.",
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit Profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when done.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              id="name"
              placeholder="Your name"
              type="text"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2"
              id="email"
              placeholder="your@email.com"
              type="email"
            />
          </div>
          <Button className="w-full">Save Changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const WithScrollableContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Sheets handle long content with internal scrolling while keeping the header fixed.",
      },
    },
  },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View Details</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Long Content</SheetTitle>
          <SheetDescription>
            This sheet demonstrates scrollable content.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {Array.from({ length: 30 }).map((_, i) => (
            <div className="rounded-md border p-4" key={i}>
              <div className="font-medium">Section {i + 1}</div>
              <div className="mt-1 text-muted-foreground text-sm">
                This is some content in section {i + 1}.
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
};
