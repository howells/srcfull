import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import {
  Input,
  InputGroup,
  InputInGroup,
  InputAddon,
  InputIcon,
  InputClear,
  InputCopy,
} from "./input";
import { useState } from "react";
import { Mail, Search, Lock, DollarSign, User, Calendar } from "lucide-react";

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
    <div className="flex flex-col gap-4 max-w-md">
      <Input
        type="text"
        value="This value is read-only"
        readOnly
        placeholder="Read-only input"
      />
      <Input
        type="text"
        defaultValue="Default value (read-only)"
        readOnly
      />
    </div>
  ),
};

// Addon examples (left and right text addons)
export const Addon: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <InputGroup size="base">
        <InputAddon position="left" size="base">
          https://
        </InputAddon>
        <InputInGroup
          size="base"
          type="text"
          placeholder="example.com"
        />
      </InputGroup>

      <InputGroup size="base">
        <InputInGroup
          size="base"
          type="text"
          placeholder="Username"
        />
        <InputAddon position="right" size="base">
          @materia.dev
        </InputAddon>
      </InputGroup>

      <InputGroup size="base">
        <InputAddon position="left" size="base">
          $
        </InputAddon>
        <InputInGroup
          size="base"
          type="number"
          placeholder="0.00"
        />
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
    <div className="flex flex-col gap-4 max-w-md">
      <div className="relative">
        <InputIcon position="left" size="base">
          <Search className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input
          type="text"
          placeholder="Search…"
          className="pl-10"
        />
      </div>

      <div className="relative">
        <InputIcon position="left" size="base">
          <Mail className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input
          type="email"
          placeholder="Email address"
          className="pl-10"
        />
      </div>

      <div className="relative">
        <InputIcon position="left" size="base">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input
          type="password"
          placeholder="Password"
          className="pl-10"
        />
      </div>

      <div className="relative">
        <InputIcon position="left" size="base">
          <User className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input
          type="text"
          placeholder="Username"
          className="pl-10"
        />
        <InputIcon position="right" size="base">
          <span className="text-xs text-green-600 dark:text-green-400">✓</span>
        </InputIcon>
      </div>
    </div>
  ),
};

// File input
export const File: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Input type="file" />
      <Input type="file" multiple />
      <Input type="file" accept="image/*" />
    </div>
  ),
};

// Date input
export const Date: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <div className="relative">
        <InputIcon position="left" size="base">
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </InputIcon>
        <Input type="date" className="pl-10" />
      </div>
    </div>
  ),
};

// Time input
export const Time: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Input type="time" />
    </div>
  ),
};

// DateTime input
export const DateTime: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Input type="datetime-local" />
    </div>
  ),
};

// Copy to clipboard
export const CopyToClipboard: Story = {
  render: () => {
    const [value] = useState("sk-proj-abc123xyz789");

    return (
      <div className="flex flex-col gap-4 max-w-md">
        <div className="relative">
          <Input
            type="text"
            value={value}
            readOnly
            className="pr-20"
          />
          <InputCopy value={value} />
        </div>

        <div className="relative">
          <Input
            type="text"
            defaultValue="https://github.com/materia/ui"
            readOnly
            className="pr-20"
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
      <div className="flex flex-col gap-4 max-w-md">
        <div className="relative">
          <Input
            type="text"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            placeholder="Type to see clear button"
            className="pr-10"
          />
          {value1 && <InputClear onClear={() => setValue1("")} />}
        </div>

        <div className="relative">
          <InputIcon position="left" size="base">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputIcon>
          <Input
            type="text"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            placeholder="Search with clear"
            className="pl-10 pr-10"
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
    <div className="flex flex-col gap-4 max-w-md">
      <Input size="sm" placeholder="Small input (sm) - h-8/32px" />
      <Input size="base" placeholder="Base input (base) - h-9/36px - default" />
      <Input size="lg" placeholder="Large input (lg) - h-10/40px" />

      {/* With icons */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">With icons:</p>
        <div className="relative">
          <InputIcon position="left" size="sm">
            <Search className="h-3 w-3 text-muted-foreground" />
          </InputIcon>
          <Input size="sm" placeholder="Small with icon" className="pl-8" />
        </div>

        <div className="relative">
          <InputIcon position="left" size="base">
            <Search className="h-4 w-4 text-muted-foreground" />
          </InputIcon>
          <Input size="base" placeholder="Base with icon" className="pl-10" />
        </div>

        <div className="relative">
          <InputIcon position="left" size="lg">
            <Search className="h-5 w-5 text-muted-foreground" />
          </InputIcon>
          <Input size="lg" placeholder="Large with icon" className="pl-11" />
        </div>
      </div>

      {/* With addons */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">With addons:</p>
        <InputGroup size="sm">
          <InputAddon position="left" size="sm">
            $
          </InputAddon>
          <InputInGroup size="sm" type="number" placeholder="0.00" />
        </InputGroup>

        <InputGroup size="base">
          <InputAddon position="left" size="base">
            $
          </InputAddon>
          <InputInGroup size="base" type="number" placeholder="0.00" />
        </InputGroup>

        <InputGroup size="lg">
          <InputAddon position="left" size="lg">
            $
          </InputAddon>
          <InputInGroup size="lg" type="number" placeholder="0.00" />
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <InputIcon position="left" size="base">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </InputIcon>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <InputIcon position="left" size="base">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </InputIcon>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              aria-invalid={!!errors.password}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="website" className="text-sm font-medium">
            Website
          </label>
          <InputGroup size="base">
            <InputAddon position="left" size="base">
              https://
            </InputAddon>
            <InputInGroup
              id="website"
              size="base"
              type="text"
              placeholder="example.com"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </InputGroup>
        </div>

        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount
          </label>
          <InputGroup size="base">
            <InputAddon position="left" size="base">
              <DollarSign className="h-4 w-4" />
            </InputAddon>
            <InputInGroup
              id="amount"
              size="base"
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
            <InputAddon position="right" size="base">
              USD
            </InputAddon>
          </InputGroup>
        </div>

        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
    <div className="flex flex-col gap-4 max-w-md">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input type="search" placeholder="Search" />
      <Input type="number" placeholder="Number" />
      <Input type="tel" placeholder="Phone number" />
      <Input type="url" placeholder="URL" />
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
        story: "Input states including default, disabled, read-only, and error states.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Input placeholder="Default state" />
      <Input placeholder="Disabled state" disabled />
      <Input value="Read-only value" readOnly />
      <Input defaultValue="With default value" />
      <Input placeholder="Error state" aria-invalid={true} />
      <Input placeholder="With value" defaultValue="Existing value" />
    </div>
  ),
};
