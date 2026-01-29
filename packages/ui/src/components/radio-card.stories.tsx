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
import { Icon } from "./icon";
import {
  RadioCardContent,
  RadioCardDescription,
  RadioCardGroup,
  RadioCardIcon,
  RadioCardItem,
  RadioCardTitle,
} from "./radio-card";

const meta = {
  title: "Radio Card Group",
  component: RadioCardGroup,
  tags: ["autodocs"],
  argTypes: {
    showIndicator: {
      control: "boolean",
      description: "Show radio button indicator",
    },
    defaultValue: {
      control: "text",
      description: "Default selected value",
    },
  },
  args: {
    showIndicator: true,
    defaultValue: "option-1",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Radio group presented as interactive cards. Supports icons, titles, descriptions, and optional radio indicators.",
      },
    },
  },
} satisfies Meta<typeof RadioCardGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story with controls
export const Base: Story = {
  render: (args) => (
    <RadioCardGroup {...args} className="max-w-md">
      <RadioCardItem value="option-1">
        <RadioCardContent>
          <RadioCardTitle>Option One</RadioCardTitle>
          <RadioCardDescription>
            Choose this option for the first selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-2">
        <RadioCardContent>
          <RadioCardTitle>Option Two</RadioCardTitle>
          <RadioCardDescription>
            Choose this option for the second selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-3">
        <RadioCardContent>
          <RadioCardTitle>Option Three</RadioCardTitle>
          <RadioCardDescription>
            Choose this option for the third selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

// Docs-only stories
export const BasicCards: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Basic radio cards with titles and descriptions.",
      },
    },
  },
  render: () => (
    <RadioCardGroup className="max-w-md" defaultValue="option-1">
      <RadioCardItem value="option-1">
        <RadioCardContent>
          <RadioCardTitle>Option One</RadioCardTitle>
          <RadioCardDescription>
            Choose this option for the first selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-2">
        <RadioCardContent>
          <RadioCardTitle>Option Two</RadioCardTitle>
          <RadioCardDescription>
            Choose this option for the second selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-3">
        <RadioCardContent>
          <RadioCardTitle>Option Three</RadioCardTitle>
          <RadioCardDescription>
            Choose this option for the third selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const WithoutIndicator: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Radio cards without visible radio indicators, relying on visual state changes.",
      },
    },
  },
  render: () => (
    <RadioCardGroup
      className="max-w-md"
      defaultValue="option-1"
      showIndicator={false}
    >
      <RadioCardItem value="option-1">
        <RadioCardContent>
          <RadioCardTitle>Option One</RadioCardTitle>
          <RadioCardDescription>
            Pure card selection without visible radio indicator.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-2">
        <RadioCardContent>
          <RadioCardTitle>Option Two</RadioCardTitle>
          <RadioCardDescription>
            Selection state is shown through border and background changes.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-3">
        <RadioCardContent>
          <RadioCardTitle>Option Three</RadioCardTitle>
          <RadioCardDescription>
            Hover and focus states remain fully accessible.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio cards enhanced with icons for visual context.",
      },
    },
  },
  render: () => (
    <RadioCardGroup className="max-w-md" defaultValue="starter">
      <RadioCardItem value="starter">
        <RadioCardIcon>
          <Icon icon={Rocket} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Starter Plan</RadioCardTitle>
          <RadioCardDescription>
            Perfect for individuals and small teams getting started.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="pro">
        <RadioCardIcon>
          <Icon icon={Zap} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Pro Plan</RadioCardTitle>
          <RadioCardDescription>
            Advanced features for growing businesses and professionals.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="enterprise">
        <RadioCardIcon>
          <Icon icon={Sparkles} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Enterprise Plan</RadioCardTitle>
          <RadioCardDescription>
            Custom solutions with dedicated support and SLAs.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const WithIconsNoIndicator: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio cards with icons but no visible radio indicators.",
      },
    },
  },
  render: () => (
    <RadioCardGroup
      className="max-w-md"
      defaultValue="credit-card"
      showIndicator={false}
    >
      <RadioCardItem value="credit-card">
        <RadioCardIcon>
          <Icon icon={CreditCard} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Credit Card</RadioCardTitle>
          <RadioCardDescription>
            Pay with your credit or debit card.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="bank">
        <RadioCardIcon>
          <Icon icon={Home} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Bank Transfer</RadioCardTitle>
          <RadioCardDescription>
            Direct bank transfer via ACH or wire.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const GridLayoutTwoColumns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio cards arranged in a two-column grid layout.",
      },
    },
  },
  render: () => (
    <RadioCardGroup className="max-w-2xl grid-cols-2" defaultValue="settings">
      <RadioCardItem value="settings">
        <RadioCardIcon>
          <Icon icon={Settings} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Settings</RadioCardTitle>
          <RadioCardDescription>
            Manage your account preferences.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="security">
        <RadioCardIcon>
          <Icon icon={Shield} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Security</RadioCardTitle>
          <RadioCardDescription>
            Configure security settings.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="team">
        <RadioCardIcon>
          <Icon icon={Users} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Team</RadioCardTitle>
          <RadioCardDescription>Manage team members.</RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="support">
        <RadioCardIcon>
          <Icon icon={MessageSquare} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Support</RadioCardTitle>
          <RadioCardDescription>Get help and assistance.</RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const GridLayoutThreeColumns: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio cards arranged in a three-column grid layout.",
      },
    },
  },
  render: () => (
    <RadioCardGroup
      className="max-w-4xl grid-cols-3"
      defaultValue="option-2"
      showIndicator={false}
    >
      <RadioCardItem value="option-1">
        <RadioCardContent>
          <RadioCardTitle>Basic</RadioCardTitle>
          <RadioCardDescription>Essential features only.</RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-2">
        <RadioCardContent>
          <RadioCardTitle>Standard</RadioCardTitle>
          <RadioCardDescription>Most popular choice.</RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-3">
        <RadioCardContent>
          <RadioCardTitle>Premium</RadioCardTitle>
          <RadioCardDescription>All features included.</RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const CompactStack: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Compact radio cards with titles only, no descriptions.",
      },
    },
  },
  render: () => (
    <RadioCardGroup className="max-w-sm" defaultValue="email">
      <RadioCardItem value="email">
        <RadioCardContent>
          <RadioCardTitle>Email Notifications</RadioCardTitle>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="push">
        <RadioCardContent>
          <RadioCardTitle>Push Notifications</RadioCardTitle>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="sms">
        <RadioCardContent>
          <RadioCardTitle>SMS Notifications</RadioCardTitle>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="none">
        <RadioCardContent>
          <RadioCardTitle>No Notifications</RadioCardTitle>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const WithDisabledState: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Radio cards can be disabled to prevent selection.",
      },
    },
  },
  render: () => (
    <RadioCardGroup className="max-w-md" defaultValue="option-1">
      <RadioCardItem value="option-1">
        <RadioCardContent>
          <RadioCardTitle>Available Option</RadioCardTitle>
          <RadioCardDescription>
            This option is available for selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem disabled value="option-2">
        <RadioCardContent>
          <RadioCardTitle>Disabled Option</RadioCardTitle>
          <RadioCardDescription>
            This option is currently unavailable.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-3">
        <RadioCardContent>
          <RadioCardTitle>Another Available Option</RadioCardTitle>
          <RadioCardDescription>
            This option is also available for selection.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const ComplexContent: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Radio cards can contain complex content like pricing, features, and custom layouts.",
      },
    },
  },
  render: () => (
    <RadioCardGroup className="max-w-xl" defaultValue="team">
      <RadioCardItem value="personal">
        <RadioCardIcon>
          <Icon icon={Home} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Personal Workspace</RadioCardTitle>
          <RadioCardDescription>
            For individual use only. Includes 5 GB storage and basic features.
          </RadioCardDescription>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-medium text-2xl">$0</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="team">
        <RadioCardIcon>
          <Icon icon={Users} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Team Workspace</RadioCardTitle>
          <RadioCardDescription>
            Collaborate with up to 10 team members. Includes 100 GB storage and
            advanced features.
          </RadioCardDescription>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-medium text-2xl">$29</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="business">
        <RadioCardIcon>
          <Icon icon={Briefcase} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Business Workspace</RadioCardTitle>
          <RadioCardDescription>
            Unlimited team members with 1 TB storage, priority support, and
            enterprise features.
          </RadioCardDescription>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-medium text-2xl">$99</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};

export const Playground: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Interactive playground for experimenting with radio card variations.",
      },
    },
  },
  render: (args) => (
    <RadioCardGroup {...args} className="max-w-md">
      <RadioCardItem value="option-1">
        <RadioCardIcon>
          <Icon icon={Rocket} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Option One</RadioCardTitle>
          <RadioCardDescription>
            Description for the first option.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem value="option-2">
        <RadioCardIcon>
          <Icon icon={Zap} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Option Two</RadioCardTitle>
          <RadioCardDescription>
            Description for the second option.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
      <RadioCardItem disabled value="option-3">
        <RadioCardIcon>
          <Icon icon={Settings} size="lg" />
        </RadioCardIcon>
        <RadioCardContent>
          <RadioCardTitle>Option Three (Disabled)</RadioCardTitle>
          <RadioCardDescription>
            This option is currently unavailable.
          </RadioCardDescription>
        </RadioCardContent>
      </RadioCardItem>
    </RadioCardGroup>
  ),
};
