import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";

const meta = {
  title: "Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Label text",
    },
    htmlFor: {
      control: "text",
      description: "ID of the form element this label is for",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Label provides an accessible label for form controls. It automatically associates with form elements via the htmlFor prop and supports click-to-focus behavior.",
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - controls available
export const Base: Story = {
  args: {
    children: "Email",
    htmlFor: "email",
  },
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-2">
      <Label {...args} />
      <Input id={args.htmlFor} placeholder="you@example.com" />
    </div>
  ),
};

// With text input
export const WithTextInput: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Labels with text input fields.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="you@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="••••••••" type="password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" />
      </div>
    </div>
  ),
};

// With checkbox
export const WithCheckbox: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Labels work with checkboxes for accessible form controls.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing">Send me marketing emails</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="newsletter" />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
    </div>
  ),
};

// With radio group
export const WithRadioGroup: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Labels with radio button groups.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <Label>Notification Preference</Label>
      <RadioGroup defaultValue="all">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="all" value="all" />
          <Label htmlFor="all">All notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="important" value="important" />
          <Label htmlFor="important">Important only</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="none" value="none" />
          <Label htmlFor="none">None</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

// With switch
export const WithSwitch: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Labels paired with switch toggles.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Push Notifications</Label>
        <Switch id="notifications" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-save">Auto Save</Label>
        <Switch defaultChecked id="auto-save" />
      </div>
    </div>
  ),
};

// Required fields
export const RequiredFields: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Labels can indicate required fields with an asterisk.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="required-email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input id="required-email" placeholder="you@example.com" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="required-name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input id="required-name" placeholder="John Doe" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="optional-phone">Phone (optional)</Label>
        <Input id="optional-phone" placeholder="+1 (555) 000-0000" />
      </div>
    </div>
  ),
};

// With helper text
export const WithHelperText: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Labels with helper text for additional context.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="johndoe" />
        <p className="text-muted-foreground text-xs">
          Your username will be visible to other users.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Input id="bio" placeholder="Tell us about yourself" />
        <p className="text-muted-foreground text-xs">Maximum 160 characters.</p>
      </div>
    </div>
  ),
};
