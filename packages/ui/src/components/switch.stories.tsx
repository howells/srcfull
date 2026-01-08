import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { useState } from "react";
import { Switch } from "./switch";

const meta = {
  title: "Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the switch interaction",
    },
    checked: {
      control: "boolean",
      description: "Controlled checked state",
    },
  },
  args: {
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A toggle switch control for binary on/off states. Commonly used in settings and preferences.",
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - controls affect this single switch
export const Base: Story = {
  args: {
    disabled: false,
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <Switch
          {...args}
          checked={checked}
          id="default-switch"
          onCheckedChange={setChecked}
        />
        <label
          className="cursor-pointer text-neutral-900 text-sm"
          htmlFor="default-switch"
        >
          {checked ? "Enabled" : "Disabled"}
        </label>
      </div>
    );
  },
};

// Docs-only stories showing comprehensive examples
export const DisabledStates: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Switches can be disabled in both checked and unchecked states.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch checked={false} disabled id="disabled-unchecked" />
        <label
          className="cursor-not-allowed text-neutral-500 text-sm"
          htmlFor="disabled-unchecked"
        >
          Disabled (unchecked)
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={true} disabled id="disabled-checked" />
        <label
          className="cursor-not-allowed text-neutral-500 text-sm"
          htmlFor="disabled-checked"
        >
          Disabled (checked)
        </label>
      </div>
    </div>
  ),
};

export const WithLabels: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Common pattern showing switches with descriptive labels and helper text, typically used in settings forms.",
      },
    },
  },
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [updates, setUpdates] = useState(true);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              className="cursor-pointer font-medium text-neutral-900 text-sm"
              htmlFor="notifications"
            >
              Push Notifications
            </label>
            <p className="text-neutral-500 text-xs">
              Receive notifications about your account activity
            </p>
          </div>
          <Switch
            checked={notifications}
            id="notifications"
            onCheckedChange={setNotifications}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              className="cursor-pointer font-medium text-neutral-900 text-sm"
              htmlFor="marketing"
            >
              Marketing Emails
            </label>
            <p className="text-neutral-500 text-xs">
              Receive emails about new products and features
            </p>
          </div>
          <Switch
            checked={marketing}
            id="marketing"
            onCheckedChange={setMarketing}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label
              className="cursor-pointer font-medium text-neutral-900 text-sm"
              htmlFor="updates"
            >
              Product Updates
            </label>
            <p className="text-neutral-500 text-xs">
              Get notified when we ship new features
            </p>
          </div>
          <Switch checked={updates} id="updates" onCheckedChange={setUpdates} />
        </div>
      </div>
    );
  },
};
