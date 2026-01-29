import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Check, CreditCard, Home, Zap } from "lucide-react";
import { useState } from "react";
import { InputCard } from "./input-card";

const meta = {
  title: "InputCard",
  component: InputCard,
  tags: ["autodocs"],
  argTypes: {
    selected: {
      control: "boolean",
      description: "Whether the card is in a selected state",
    },
    disabled: {
      control: "boolean",
      description: "Whether the card is disabled",
    },
    asChild: {
      control: "boolean",
      description:
        "Renders the card as a child element using the Slot component",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A primitive card component designed for building custom input-based selection interfaces. Features focus, hover, and selected states with smooth transitions.",
      },
    },
  },
} satisfies Meta<typeof InputCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    selected: false,
    disabled: false,
    asChild: false,
    children: (
      <div className="p-6">
        <h3 className="font-semibold text-base">Input Card</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          A basic input card component.
        </p>
      </div>
    ),
  },
  render: (args) => (
    <div className="flex min-h-[200px] items-center justify-center">
      <InputCard {...args} className="w-full max-w-md" />
    </div>
  ),
};

export const Default: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic input card with default styling and hover states.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <InputCard className="w-full max-w-md">
        <div className="p-6">
          <h3 className="font-semibold text-base">Default Card</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Hover over this card to see the interactive states.
          </p>
        </div>
      </InputCard>
    </div>
  ),
};

export const Selected: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Selected state with prominent border and ring to indicate active selection.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center gap-4">
      <InputCard className="w-full max-w-xs" selected={false}>
        <div className="p-6">
          <h3 className="font-semibold text-base">Not Selected</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Default unselected state.
          </p>
        </div>
      </InputCard>
      <InputCard className="w-full max-w-xs" selected={true}>
        <div className="p-6">
          <h3 className="font-semibold text-base">Selected</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Active selected state with visual emphasis.
          </p>
        </div>
      </InputCard>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Disabled state with reduced opacity and no pointer interaction.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center gap-4">
      <InputCard className="w-full max-w-xs">
        <div className="p-6">
          <h3 className="font-semibold text-base">Enabled</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Interactive and available.
          </p>
        </div>
      </InputCard>
      <InputCard className="w-full max-w-xs" disabled>
        <div className="p-6">
          <h3 className="font-semibold text-base">Disabled</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Not available for interaction.
          </p>
        </div>
      </InputCard>
    </div>
  ),
};

export const InteractiveSelection: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Click to select cards. Demonstrates how to build a custom selection interface.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string | null>("option-1");

    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <InputCard
          className="w-full max-w-md cursor-pointer"
          onClick={() => setSelected("option-1")}
          selected={selected === "option-1"}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Home className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">Option One</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Choose this option for the first selection.
              </p>
            </div>
            {selected === "option-1" && (
              <Check className="size-5 shrink-0 text-foreground" />
            )}
          </div>
        </InputCard>

        <InputCard
          className="w-full max-w-md cursor-pointer"
          onClick={() => setSelected("option-2")}
          selected={selected === "option-2"}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">Option Two</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Choose this option for the second selection.
              </p>
            </div>
            {selected === "option-2" && (
              <Check className="size-5 shrink-0 text-foreground" />
            )}
          </div>
        </InputCard>

        <InputCard
          className="w-full max-w-md cursor-pointer"
          onClick={() => setSelected("option-3")}
          selected={selected === "option-3"}
        >
          <div className="flex items-start gap-4 p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base">Option Three</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Choose this option for the third selection.
              </p>
            </div>
            {selected === "option-3" && (
              <Check className="size-5 shrink-0 text-foreground" />
            )}
          </div>
        </InputCard>
      </div>
    );
  },
};

export const MultipleSelection: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Click cards to toggle multiple selections. Shows how to build a multi-select interface.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["feature-1"]);

    const toggleSelection = (value: string) => {
      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    };

    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <p className="mb-2 text-muted-foreground text-sm">
          Select multiple features
        </p>
        <InputCard
          className="w-full max-w-md cursor-pointer"
          onClick={() => toggleSelection("feature-1")}
          selected={selected.includes("feature-1")}
        >
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold text-base">Email Notifications</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Receive updates via email
              </p>
            </div>
            {selected.includes("feature-1") && (
              <Check className="size-5 shrink-0 text-foreground" />
            )}
          </div>
        </InputCard>

        <InputCard
          className="w-full max-w-md cursor-pointer"
          onClick={() => toggleSelection("feature-2")}
          selected={selected.includes("feature-2")}
        >
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold text-base">Push Notifications</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Get instant mobile alerts
              </p>
            </div>
            {selected.includes("feature-2") && (
              <Check className="size-5 shrink-0 text-foreground" />
            )}
          </div>
        </InputCard>

        <InputCard
          className="w-full max-w-md cursor-pointer"
          onClick={() => toggleSelection("feature-3")}
          selected={selected.includes("feature-3")}
        >
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-semibold text-base">SMS Notifications</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Receive text message updates
              </p>
            </div>
            {selected.includes("feature-3") && (
              <Check className="size-5 shrink-0 text-foreground" />
            )}
          </div>
        </InputCard>
      </div>
    );
  },
};

export const GridLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Input cards arranged in a responsive grid layout.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string>("basic");

    return (
      <div className="flex min-h-[300px] items-center justify-center p-8">
        <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <InputCard
            className="cursor-pointer"
            onClick={() => setSelected("basic")}
            selected={selected === "basic"}
          >
            <div className="p-6 text-center">
              <h3 className="font-semibold text-lg">Basic</h3>
              <p className="mt-4 font-bold text-3xl">$9</p>
              <p className="mt-1 text-muted-foreground text-sm">/month</p>
              <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                <li>5 GB storage</li>
                <li>Basic support</li>
                <li>1 user</li>
              </ul>
            </div>
          </InputCard>

          <InputCard
            className="cursor-pointer"
            onClick={() => setSelected("pro")}
            selected={selected === "pro"}
          >
            <div className="p-6 text-center">
              <h3 className="font-semibold text-lg">Pro</h3>
              <p className="mt-4 font-bold text-3xl">$29</p>
              <p className="mt-1 text-muted-foreground text-sm">/month</p>
              <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                <li>50 GB storage</li>
                <li>Priority support</li>
                <li>10 users</li>
              </ul>
            </div>
          </InputCard>

          <InputCard
            className="cursor-pointer"
            onClick={() => setSelected("enterprise")}
            selected={selected === "enterprise"}
          >
            <div className="p-6 text-center">
              <h3 className="font-semibold text-lg">Enterprise</h3>
              <p className="mt-4 font-bold text-3xl">$99</p>
              <p className="mt-1 text-muted-foreground text-sm">/month</p>
              <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                <li>Unlimited storage</li>
                <li>24/7 support</li>
                <li>Unlimited users</li>
              </ul>
            </div>
          </InputCard>
        </div>
      </div>
    );
  },
};

export const AsButton: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Using asChild prop to render as a native button element while maintaining card styling.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string>("button-1");

    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
        <InputCard
          asChild
          className="w-full max-w-md"
          selected={selected === "button-1"}
        >
          <button onClick={() => setSelected("button-1")} type="button">
            <div className="p-6 text-left">
              <h3 className="font-semibold text-base">Button Card One</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Rendered as a native button element.
              </p>
            </div>
          </button>
        </InputCard>

        <InputCard
          asChild
          className="w-full max-w-md"
          selected={selected === "button-2"}
        >
          <button onClick={() => setSelected("button-2")} type="button">
            <div className="p-6 text-left">
              <h3 className="font-semibold text-base">Button Card Two</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Full keyboard accessibility with native button.
              </p>
            </div>
          </button>
        </InputCard>
      </div>
    );
  },
};

export const CompactCards: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Compact cards with minimal padding for dense layouts.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string>("compact-2");

    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2">
        <InputCard
          className="w-full max-w-sm cursor-pointer"
          onClick={() => setSelected("compact-1")}
          selected={selected === "compact-1"}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-sm">Compact Option 1</span>
            {selected === "compact-1" && (
              <Check className="size-4 text-foreground" />
            )}
          </div>
        </InputCard>

        <InputCard
          className="w-full max-w-sm cursor-pointer"
          onClick={() => setSelected("compact-2")}
          selected={selected === "compact-2"}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-sm">Compact Option 2</span>
            {selected === "compact-2" && (
              <Check className="size-4 text-foreground" />
            )}
          </div>
        </InputCard>

        <InputCard
          className="w-full max-w-sm cursor-pointer"
          onClick={() => setSelected("compact-3")}
          selected={selected === "compact-3"}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-medium text-sm">Compact Option 3</span>
            {selected === "compact-3" && (
              <Check className="size-4 text-foreground" />
            )}
          </div>
        </InputCard>
      </div>
    );
  },
};
