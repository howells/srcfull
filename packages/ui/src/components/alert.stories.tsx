import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Icon } from "./icon";

const meta = {
  title: "Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "Visual style of the alert",
    },
  },
  args: {
    variant: "default",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Alerts display important information to users. They support default and destructive variants, and can include optional icons and titles.",
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls affect this single alert
export const Base: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can use alerts to highlight important information.
      </AlertDescription>
    </Alert>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Alerts can include icons to enhance visual communication. Icons are wrapped with the Icon component and automatically scale appropriately.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <Icon icon={Info} />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This alert includes an icon rendered via the Icon wrapper.
        </AlertDescription>
      </Alert>

      <Alert variant="default">
        <Icon icon={CheckCircle} />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your changes have been saved successfully.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <Icon icon={AlertTriangle} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Something requires your attention before proceeding.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <Icon icon={XCircle} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something broke. The icon uses the same size scale as other UI.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

export const WithoutTitle: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Alerts can be used with just a description for simpler messages.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert variant="default">
        <AlertDescription>
          This is a simple alert with only a description.
        </AlertDescription>
      </Alert>

      <Alert variant="default">
        <Icon icon={Info} />
        <AlertDescription>
          You can also combine an icon with just a description.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
