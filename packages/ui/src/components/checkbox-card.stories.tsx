import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  Briefcase,
  CreditCard,
  Home,
  MessageSquare,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  CheckboxCardContent,
  CheckboxCardDescription,
  CheckboxCardGroup,
  CheckboxCardIcon,
  CheckboxCardItem,
  CheckboxCardTitle,
} from "./checkbox-card";
import { Icon } from "./icon";

const meta = {
  title: "Checkbox Card Group",
  component: CheckboxCardGroup,
  tags: ["autodocs"],
  argTypes: {
    showIndicator: {
      control: "boolean",
      description: "Show checkbox indicator",
    },
  },
  args: {
    showIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Multi-select options presented as interactive cards with icons and optional checkbox indicators.",
      },
    },
  },
} satisfies Meta<typeof CheckboxCardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - simplified for controls
export const Base: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(["option-1"]);

    return (
      <CheckboxCardGroup {...args} className="max-w-md">
        <CheckboxCardItem
          checked={selected.includes("option-1")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-1"]
                : prev.filter((v) => v !== "option-1")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Option One</CheckboxCardTitle>
            <CheckboxCardDescription>
              Choose this option for the first selection.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-2")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-2"]
                : prev.filter((v) => v !== "option-2")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Option Two</CheckboxCardTitle>
            <CheckboxCardDescription>
              Choose this option for the second selection.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-3")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-3"]
                : prev.filter((v) => v !== "option-3")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Option Three</CheckboxCardTitle>
            <CheckboxCardDescription>
              Choose this option for the third selection.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

// Docs-only stories
export const WithoutIndicator: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Set showIndicator to false to hide the checkbox indicator. Selection state is still visible through border and background changes.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["option-1"]);

    return (
      <CheckboxCardGroup className="max-w-md" showIndicator={false}>
        <CheckboxCardItem
          checked={selected.includes("option-1")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-1"]
                : prev.filter((v) => v !== "option-1")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Option One</CheckboxCardTitle>
            <CheckboxCardDescription>
              Pure card selection without visible checkbox indicator.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-2")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-2"]
                : prev.filter((v) => v !== "option-2")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Option Two</CheckboxCardTitle>
            <CheckboxCardDescription>
              Selection state is shown through border and background changes.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-3")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-3"]
                : prev.filter((v) => v !== "option-3")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Option Three</CheckboxCardTitle>
            <CheckboxCardDescription>
              Hover and focus states remain fully accessible.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Checkbox cards can include icons to visually represent each option, improving scannability and recognition.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["starter", "pro"]);

    return (
      <CheckboxCardGroup className="max-w-md">
        <CheckboxCardItem
          checked={selected.includes("starter")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "starter"]
                : prev.filter((v) => v !== "starter")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Rocket} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Starter Features</CheckboxCardTitle>
            <CheckboxCardDescription>
              Perfect for individuals and small teams getting started.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("pro")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "pro"] : prev.filter((v) => v !== "pro")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Zap} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Pro Features</CheckboxCardTitle>
            <CheckboxCardDescription>
              Advanced features for growing businesses and professionals.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("enterprise")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "enterprise"]
                : prev.filter((v) => v !== "enterprise")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Sparkles} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Enterprise Features</CheckboxCardTitle>
            <CheckboxCardDescription>
              Custom solutions with dedicated support and SLAs.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const WithIconsNoIndicator: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Combine icons with hidden indicators for a cleaner card-based selection interface.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["credit-card"]);

    return (
      <CheckboxCardGroup className="max-w-md" showIndicator={false}>
        <CheckboxCardItem
          checked={selected.includes("credit-card")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "credit-card"]
                : prev.filter((v) => v !== "credit-card")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={CreditCard} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Credit Card</CheckboxCardTitle>
            <CheckboxCardDescription>
              Pay with your credit or debit card.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("bank")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "bank"] : prev.filter((v) => v !== "bank")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Home} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Bank Transfer</CheckboxCardTitle>
            <CheckboxCardDescription>
              Direct bank transfer via ACH or wire.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const GridLayoutTwoColumns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Use grid layout classes to arrange checkbox cards in multiple columns for compact layouts.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["settings", "team"]);

    return (
      <CheckboxCardGroup className="max-w-2xl grid-cols-2">
        <CheckboxCardItem
          checked={selected.includes("settings")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "settings"]
                : prev.filter((v) => v !== "settings")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Settings} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Settings</CheckboxCardTitle>
            <CheckboxCardDescription>
              Manage your account preferences.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("security")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "security"]
                : prev.filter((v) => v !== "security")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Shield} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Security</CheckboxCardTitle>
            <CheckboxCardDescription>
              Configure security settings.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("team")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "team"] : prev.filter((v) => v !== "team")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Users} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Team</CheckboxCardTitle>
            <CheckboxCardDescription>
              Manage team members.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("support")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "support"]
                : prev.filter((v) => v !== "support")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={MessageSquare} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Support</CheckboxCardTitle>
            <CheckboxCardDescription>
              Get help and assistance.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const GridLayoutThreeColumns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Three-column grid layouts work well for simpler options with minimal content.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["option-2"]);

    return (
      <CheckboxCardGroup
        className="max-w-4xl grid-cols-3"
        showIndicator={false}
      >
        <CheckboxCardItem
          checked={selected.includes("option-1")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-1"]
                : prev.filter((v) => v !== "option-1")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Basic</CheckboxCardTitle>
            <CheckboxCardDescription>
              Essential features only.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-2")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-2"]
                : prev.filter((v) => v !== "option-2")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Standard</CheckboxCardTitle>
            <CheckboxCardDescription>
              Most popular choice.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-3")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-3"]
                : prev.filter((v) => v !== "option-3")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Premium</CheckboxCardTitle>
            <CheckboxCardDescription>
              All features included.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const CompactStack: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Compact stacked layout with title-only cards for simple selection lists.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["email", "push"]);

    return (
      <CheckboxCardGroup className="max-w-sm">
        <CheckboxCardItem
          checked={selected.includes("email")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "email"] : prev.filter((v) => v !== "email")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Email Notifications</CheckboxCardTitle>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("push")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "push"] : prev.filter((v) => v !== "push")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Push Notifications</CheckboxCardTitle>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("sms")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "sms"] : prev.filter((v) => v !== "sms")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>SMS Notifications</CheckboxCardTitle>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("none")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "none"] : prev.filter((v) => v !== "none")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>No Notifications</CheckboxCardTitle>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const WithDisabledState: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Checkbox cards can be disabled to prevent interaction while still displaying the option.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["option-1"]);

    return (
      <CheckboxCardGroup className="max-w-md">
        <CheckboxCardItem
          checked={selected.includes("option-1")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-1"]
                : prev.filter((v) => v !== "option-1")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Available Option</CheckboxCardTitle>
            <CheckboxCardDescription>
              This option is available for selection.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem disabled>
          <CheckboxCardContent>
            <CheckboxCardTitle>Disabled Option</CheckboxCardTitle>
            <CheckboxCardDescription>
              This option is currently unavailable.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-3")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-3"]
                : prev.filter((v) => v !== "option-3")
            );
          }}
        >
          <CheckboxCardContent>
            <CheckboxCardTitle>Another Available Option</CheckboxCardTitle>
            <CheckboxCardDescription>
              This option is also available for selection.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const ComplexContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Checkbox cards can contain complex content like pricing information, feature lists, or other rich content.",
      },
    },
  },
  render: () => {
    const [selected, setSelected] = useState<string[]>(["team"]);

    return (
      <CheckboxCardGroup className="max-w-xl">
        <CheckboxCardItem
          checked={selected.includes("personal")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "personal"]
                : prev.filter((v) => v !== "personal")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Home} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Personal Workspace</CheckboxCardTitle>
            <CheckboxCardDescription>
              For individual use only. Includes 5 GB storage and basic features.
            </CheckboxCardDescription>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-medium text-2xl">$0</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("team")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked ? [...prev, "team"] : prev.filter((v) => v !== "team")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Users} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Team Workspace</CheckboxCardTitle>
            <CheckboxCardDescription>
              Collaborate with up to 10 team members. Includes 100 GB storage
              and advanced features.
            </CheckboxCardDescription>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-medium text-2xl">$29</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("business")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "business"]
                : prev.filter((v) => v !== "business")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Briefcase} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Business Workspace</CheckboxCardTitle>
            <CheckboxCardDescription>
              Unlimited team members with 1 TB storage, priority support, and
              enterprise features.
            </CheckboxCardDescription>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-medium text-2xl">$99</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};

export const Playground: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Interactive playground with common patterns: icons, descriptions, and disabled state.",
      },
    },
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(["option-1"]);

    return (
      <CheckboxCardGroup {...args} className="max-w-md">
        <CheckboxCardItem
          checked={selected.includes("option-1")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-1"]
                : prev.filter((v) => v !== "option-1")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Rocket} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Option One</CheckboxCardTitle>
            <CheckboxCardDescription>
              Description for the first option.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem
          checked={selected.includes("option-2")}
          onCheckedChange={(checked) => {
            setSelected((prev) =>
              checked
                ? [...prev, "option-2"]
                : prev.filter((v) => v !== "option-2")
            );
          }}
        >
          <CheckboxCardIcon>
            <Icon icon={Zap} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Option Two</CheckboxCardTitle>
            <CheckboxCardDescription>
              Description for the second option.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
        <CheckboxCardItem disabled>
          <CheckboxCardIcon>
            <Icon icon={Settings} size="lg" />
          </CheckboxCardIcon>
          <CheckboxCardContent>
            <CheckboxCardTitle>Option Three (Disabled)</CheckboxCardTitle>
            <CheckboxCardDescription>
              This option is currently unavailable.
            </CheckboxCardDescription>
          </CheckboxCardContent>
        </CheckboxCardItem>
      </CheckboxCardGroup>
    );
  },
};
