import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { Checkbox } from "./checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field";
import { Input } from "./input";
import { Switch } from "./switch";

const meta = {
  title: "Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form field components that provide consistent structure for labels, inputs, descriptions, and error messages. Supports both vertical and horizontal orientations.",
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - vertical layout
export const Base: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <FieldContent>
            <Input id="name" placeholder="Jane Doe" />
            <FieldDescription>Shown to other users.</FieldDescription>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input id="email" placeholder="you@example.com" />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

// Docs-only stories showing comprehensive examples
export const VerticalLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Vertical layout stacks labels above inputs. Best for forms with longer labels or when maximizing vertical space.",
      },
    },
  },
  render: () => (
    <FieldSet>
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <FieldContent>
            <Input id="name" placeholder="Jane Doe" />
            <FieldDescription>Shown to other users.</FieldDescription>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input id="email" placeholder="you@example.com" />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const HorizontalLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Horizontal layout places labels beside inputs. Good for compact forms and settings pages.",
      },
    },
  },
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Settings</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldTitle>Notifications</FieldTitle>
          <FieldContent>
            <Switch />
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <FieldTitle>Auto-save</FieldTitle>
          <FieldContent>
            <Switch defaultChecked />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const WithErrors: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Fields can display validation errors inline below the input.",
      },
    },
  },
  render: () => (
    <FieldSet>
      <FieldLegend>Sign up</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <FieldContent>
            <Input aria-invalid id="username" placeholder="johndoe" />
            <FieldError errors={[{ message: "Username is already taken" }]} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input
              aria-invalid
              id="password"
              placeholder="••••••••"
              type="password"
            />
            <FieldError
              errors={[{ message: "Password must be at least 8 characters" }]}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const HorizontalWithError: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Horizontal fields can also display errors and use separators between field groups.",
      },
    },
  },
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">Preferences</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel asChild>
            <label className="sr-only" htmlFor="newsletter">
              Newsletter
            </label>
          </FieldLabel>
          <FieldContent>
            <Checkbox aria-invalid id="newsletter" />
            <FieldError errors={[{ message: "You must accept to proceed" }]} />
          </FieldContent>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field orientation="horizontal">
          <FieldTitle>Alternative Option</FieldTitle>
          <FieldContent>
            <Input placeholder="Optional" />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

export const WithDescriptions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Field descriptions provide helpful context without cluttering the label.",
      },
    },
  },
  render: () => (
    <FieldSet>
      <FieldLegend>API Configuration</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="api-key">API Key</FieldLabel>
          <FieldContent>
            <Input id="api-key" placeholder="sk_live_..." type="password" />
            <FieldDescription>
              Your secret API key. Keep this secure and never share it publicly.
            </FieldDescription>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="webhook-url">Webhook URL</FieldLabel>
          <FieldContent>
            <Input id="webhook-url" placeholder="https://example.com/webhook" />
            <FieldDescription>
              Events will be sent to this endpoint.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};
