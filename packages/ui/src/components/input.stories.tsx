import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import { Calendar, DollarSign, Lock, Mail, Search, User } from "lucide-react";
import { useState } from "react";
import {
  Input,
  InputAddon,
  InputClear,
  InputCopy,
  InputGroup,
  InputIcon,
  InputInGroup,
} from "./input";

const meta = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A flexible input component with support for addons, icons, clear buttons, copy functionality, and various input types.",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default - basic interactive story
export const Base: Story = {
  args: {
    type: "text",
    placeholder: "Type here…",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Disabled input",
    disabled: true,
  },
};

// Readonly state
export const Readonly: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input
        placeholder="Read-only input"
        readOnly
        type="text"
        value="This value is read-only"
      />
      <Input defaultValue="Default value (read-only)" readOnly type="text" />
    </div>
  ),
};

// Addon examples (left and right text addons)
export const Addon: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <InputGroup size="base">
        <InputAddon position="left" size="base">
          https://
        </InputAddon>
        <InputInGroup placeholder="example.com" size="base" type="text" />
      </InputGroup>

      <InputGroup size="base">
        <InputInGroup placeholder="Username" size="base" type="text" />
        <InputAddon position="right" size="base">
          @materia.dev
        </InputAddon>
      </InputGroup>

      <InputGroup size="base">
        <InputAddon position="left" size="base">
          $
        </InputAddon>
        <InputInGroup placeholder="0.00" size="base" type="number" />
        <InputAddon position="right" size="base">
          USD
        </InputAddon>
      </InputGroup>
    </div>
  ),
};

// Icon examples (left and right icons)
export const Icon: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <div className="relative">
        <InputIcon position="left" size="base">
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input className="pl-10" placeholder="Search…" type="text" />
      </div>

      <div className="relative">
        <InputIcon position="left" size="base">
          <Mail className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input className="pl-10" placeholder="Email address" type="email" />
      </div>

      <div className="relative">
        <InputIcon position="left" size="base">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input className="pl-10" placeholder="Password" type="password" />
      </div>

      <div className="relative">
        <InputIcon position="left" size="base">
          <User className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input className="pl-10" placeholder="Username" type="text" />
        <InputIcon position="right" size="base">
          <span className="text-green-600 text-xs dark:text-green-400">✓</span>
        </InputIcon>
      </div>
    </div>
  ),
};

// File input
export const File: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input type="file" />
      <Input multiple type="file" />
      <Input accept="image/*" type="file" />
    </div>
  ),
};

// Date input
export const Date: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <div className="relative">
        <InputIcon position="left" size="base">
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input className="pl-10" type="date" />
      </div>
    </div>
  ),
};

// Time input
export const Time: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input type="time" />
    </div>
  ),
};

// DateTime input
export const DateTime: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input type="datetime-local" />
    </div>
  ),
};

// Copy to clipboard
export const CopyToClipboard: Story = {
  render: () => {
    const [value] = useState("sk-proj-abc123xyz789");

    return (
      <div className="flex max-w-md flex-col gap-4">
        <div className="relative">
          <Input className="pr-20" readOnly type="text" value={value} />
          <InputCopy value={value} />
        </div>

        <div className="relative">
          <Input
            className="pr-20"
            defaultValue="https://github.com/materia/ui"
            readOnly
            type="text"
          />
          <InputCopy value="https://github.com/materia/ui" />
        </div>
      </div>
    );
  },
};

// Clear button
export const ClearButton: Story = {
  render: () => {
    const [value1, setValue1] = useState("Clear this text");
    const [value2, setValue2] = useState("");

    return (
      <div className="flex max-w-md flex-col gap-4">
        <div className="relative">
          <Input
            className="pr-10"
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Type to see clear button"
            type="text"
            value={value1}
          />
          {value1 && <InputClear onClear={() => setValue1("")} />}
        </div>

        <div className="relative">
          <InputIcon position="left" size="base">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputIcon>
          <Input
            className="pr-10 pl-10"
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Search with clear"
            type="text"
            value={value2}
          />
          {value2 && <InputClear onClear={() => setValue2("")} />}
        </div>
      </div>
    );
  },
};

// Size variants
export const Size: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input placeholder="Small input (sm) - h-8/32px" size="sm" />
      <Input placeholder="Base input (base) - h-9/36px - default" size="base" />
      <Input placeholder="Large input (lg) - h-10/40px" size="lg" />

      {/* With icons */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">With icons:</p>
        <div className="relative">
          <InputIcon position="left" size="sm">
            <Search className="h-3 w-3 text-muted-foreground" />
          </InputIcon>
          <Input className="pl-8" placeholder="Small with icon" size="sm" />
        </div>

        <div className="relative">
          <InputIcon position="left" size="base">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputIcon>
          <Input className="pl-10" placeholder="Base with icon" size="base" />
        </div>

        <div className="relative">
          <InputIcon position="left" size="lg">
            <Search className="h-5 w-5 text-muted-foreground" />
          </InputIcon>
          <Input className="pl-11" placeholder="Large with icon" size="lg" />
        </div>
      </div>

      {/* With addons */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">With addons:</p>
        <InputGroup size="sm">
          <InputAddon position="left" size="sm">
            $
          </InputAddon>
          <InputInGroup placeholder="0.00" size="sm" type="number" />
        </InputGroup>

        <InputGroup size="base">
          <InputAddon position="left" size="base">
            $
          </InputAddon>
          <InputInGroup placeholder="0.00" size="base" type="number" />
        </InputGroup>

        <InputGroup size="lg">
          <InputAddon position="left" size="lg">
            $
          </InputAddon>
          <InputInGroup placeholder="0.00" size="lg" type="number" />
        </InputGroup>
      </div>
    </div>
  ),
};

// Form example with validation states
export const Form: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      website: "",
      amount: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert("Form submitted successfully!");
      }
    };

    return (
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <InputIcon position="left" size="base">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </InputIcon>
            <Input
              aria-invalid={!!errors.email}
              className="pl-10"
              id="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              type="email"
              value={formData.email}
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <InputIcon position="left" size="base">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputIcon>
            <Input
              aria-invalid={!!errors.password}
              className="pl-10"
              id="password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              type="password"
              value={formData.password}
            />
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="website">
            Website
          </label>
          <InputGroup size="base">
            <InputAddon position="left" size="base">
              https://
            </InputAddon>
            <InputInGroup
              id="website"
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="example.com"
              size="base"
              type="text"
              value={formData.website}
            />
          </InputGroup>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm" htmlFor="amount">
            Amount
          </label>
          <InputGroup size="base">
            <InputAddon position="left" size="base">
              <DollarSign className="h-4 w-4" />
            </InputAddon>
            <InputInGroup
              id="amount"
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              size="base"
              type="number"
              value={formData.amount}
            />
            <InputAddon position="right" size="base">
              USD
            </InputAddon>
          </InputGroup>
        </div>

        <button
          className="mt-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          type="submit"
        >
          Submit
        </button>
      </form>
    );
  },
};

// All input types showcase
export const Types: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common input types for various data entry scenarios.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input placeholder="Text input" type="text" />
      <Input placeholder="Email address" type="email" />
      <Input placeholder="Password" type="password" />
      <Input placeholder="Search" type="search" />
      <Input placeholder="Number" type="number" />
      <Input placeholder="Phone number" type="tel" />
      <Input placeholder="URL" type="url" />
      <Input type="date" />
      <Input type="time" />
      <Input type="datetime-local" />
      <Input type="file" />
    </div>
  ),
};

// All states showcase
export const States: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Input states including default, disabled, read-only, and error states.",
      },
    },
  },
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <Input placeholder="Default state" />
      <Input disabled placeholder="Disabled state" />
      <Input readOnly value="Read-only value" />
      <Input defaultValue="With default value" />
      <Input aria-invalid={true} placeholder="Error state" />
      <Input defaultValue="Existing value" placeholder="With value" />
    </div>
  ),
};
