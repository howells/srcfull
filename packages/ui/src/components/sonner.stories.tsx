import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta = {
  title: "Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sonner provides toast notifications for user feedback. It supports multiple variants, actions, and can be positioned anywhere on screen. Toaster must be included in your app layout.",
      },
    },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <div>
      <Button onClick={() => toast("This is a default toast")}>
        Show Toast
      </Button>
      <Toaster />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Toast supports different variants for different message types.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Default toast message")}>Default</Button>
      <Button onClick={() => toast.success("Changes saved successfully")}>
        Success
      </Button>
      <Button onClick={() => toast.error("Failed to save changes")}>
        Error
      </Button>
      <Button onClick={() => toast.warning("This action cannot be undone")}>
        Warning
      </Button>
      <Button onClick={() => toast.info("New update available")}>Info</Button>
      <Toaster />
    </div>
  ),
};

export const WithDescription: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Toasts can include additional description text for more context.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast.success("Changes saved", {
            description: "Your profile has been updated successfully.",
          })
        }
      >
        With Description
      </Button>
      <Button
        onClick={() =>
          toast.error("Upload failed", {
            description: "File size exceeds the 10MB limit.",
          })
        }
      >
        Error with Details
      </Button>
      <Toaster />
    </div>
  ),
};

export const WithAction: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Toasts can include action buttons for user interaction.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() =>
          toast("Event created", {
            action: {
              label: "View",
              onClick: () => console.log("View clicked"),
            },
          })
        }
      >
        With Action
      </Button>
      <Button
        onClick={() =>
          toast.error("Failed to delete", {
            action: {
              label: "Retry",
              onClick: () => console.log("Retry clicked"),
            },
          })
        }
      >
        Error with Retry
      </Button>
      <Toaster />
    </div>
  ),
};

export const Loading: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Show loading state with promise-based toasts that update automatically.",
      },
    },
  },
  render: () => (
    <div>
      <Button
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: "Uploading file…",
            success: "File uploaded successfully",
            error: "Upload failed",
          })
        }
      >
        Upload with Promise
      </Button>
      <Toaster />
    </div>
  ),
};

export const Positions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Control toast position using the position prop on Toaster.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Top left toast")}>
        Top Left (see code)
      </Button>
      <Button onClick={() => toast("Bottom right toast")}>
        Bottom Right (see code)
      </Button>
      <Toaster position="bottom-right" />
    </div>
  ),
};

export const Duration: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Control how long toasts remain visible with the duration option.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast("Quick toast", { duration: 1000 })}>
        1 second
      </Button>
      <Button onClick={() => toast("Normal toast", { duration: 3000 })}>
        3 seconds
      </Button>
      <Button
        onClick={() =>
          toast("Persistent toast", { duration: Number.POSITIVE_INFINITY })
        }
      >
        Infinite (must dismiss)
      </Button>
      <Toaster />
    </div>
  ),
};
