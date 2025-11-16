import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { Button } from "./button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Slides up from the bottom. Built with Vaul for gesture support.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic drawer with header, content, and footer. Drag down or press escape to dismiss.",
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            This is a responsive drawer using Vaul.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 text-neutral-700 text-sm">Body content here.</div>
        <DrawerFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Drawers can contain forms and interactive content. Perfect for mobile-friendly input experiences.",
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="jane@example.com" type="email" />
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithScrollableContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Drawers handle scrollable content gracefully while maintaining the header and footer in place.",
      },
    },
  },
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>View details</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Terms and conditions</DrawerTitle>
          <DrawerDescription>
            Please review the following terms.
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[400px] overflow-y-auto p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <p className="mb-4 text-neutral-700 text-sm" key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          ))}
        </div>
        <DrawerFooter>
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
