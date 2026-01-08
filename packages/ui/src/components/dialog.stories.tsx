import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { AlertTriangle, Info, Settings } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Icon } from "./icon";

const meta = {
  title: "Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal overlays that require interaction before returning to main content. Includes trigger, header, body, and optional footer.",
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story
export const Base: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A standard dialog with header, description, content, and footer actions. The trigger button opens the dialog.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>
            Short description for the dialog content goes here.
          </DialogDescription>
        </DialogHeader>
        <div className="text-neutral-600 text-sm">
          Body content can contain any elements.
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Interactive story - dialog with icon in title
export const WithIconInTitle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Dialogs can include icons in the title to provide visual context for the dialog's purpose.",
      },
    },
  },
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Preferences…</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon={Settings} />
            Preferences
          </DialogTitle>
          <DialogDescription>
            Configure your application settings.
          </DialogDescription>
        </DialogHeader>
        <div className="text-neutral-600 text-sm">
          General settings go here.
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
          <Button>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Documentation story - dialog patterns
export const DialogPatterns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Common dialog patterns for different use cases: informational, confirmation, and destructive actions.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Icon icon={Info} />
            Info dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Information</DialogTitle>
            <DialogDescription>
              This is an informational dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="text-neutral-600 text-sm">
            Informational dialogs provide details without requiring a decision.
          </div>
          <DialogFooter>
            <Button>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Confirmation dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="text-neutral-600 text-sm">
            This action will update your settings.
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Icon icon={AlertTriangle} />
            Destructive dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon icon={AlertTriangle} />
              Delete item
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="text-neutral-600 text-sm">
            This will permanently delete the item and all associated data.
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};

// Documentation story - footer patterns
export const FooterPatterns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Dialog footers follow common action patterns: single action for acknowledgment, dual actions for cancel/confirm flows, or no footer for passive dialogs.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Single action</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification</DialogTitle>
            <DialogDescription>Your changes have been saved.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Dual actions</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save changes</DialogTitle>
            <DialogDescription>
              Do you want to save your changes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Discard</Button>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">No footer</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Read-only content</DialogTitle>
            <DialogDescription>
              Close with the X button or press Escape.
            </DialogDescription>
          </DialogHeader>
          <div className="text-neutral-600 text-sm">
            Some dialogs don't require explicit actions and can be dismissed
            naturally.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
