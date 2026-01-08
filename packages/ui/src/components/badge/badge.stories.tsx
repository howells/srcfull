import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { sizeArgType } from "@repo/ui/lib/storybook";
import { Check } from "lucide-react";
import { BadgeButton } from "./badge-button";
import { BadgeDot } from "./badge-dot";
import { Badge } from "./badge-root";

const meta = {
  title: "Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "warning",
        "info",
        "purple",
        "rose",
        "outline",
        "destructive",
      ],
      description: "Specifies the badge's theme",
    },
    appearance: {
      control: "select",
      options: ["default", "light", "outline", "ghost"],
      description: "Determines the badge's visual appearance",
    },
    size: sizeArgType,
    shape: {
      control: "select",
      options: ["default", "circle"],
      description: "Determines the shape of the badge",
    },
    disabled: {
      control: "boolean",
      description: "Specifies whether the badge is disabled",
    },
    children: {
      control: "text",
      description: "Badge text content",
    },
    asChild: {
      control: "boolean",
      description:
        "Renders the badge as a child element using the Slot component",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Displays contextual metadata such as status, category, or notification counts.",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    children: "Badge",
    variant: "info",
    appearance: "default",
    size: "base",
    shape: "default",
    disabled: false,
    asChild: false,
  },
  render: (args) => <Badge {...args}>{args.children}</Badge>,
};

export const Bold: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Default appearance with bold, saturated backgrounds and white text.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="primary">Neutral</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="purple">Purple</Badge>
      <Badge variant="rose">Rose</Badge>
    </div>
  ),
};

export const Light: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Light appearance provides soft, calm badge styles with subtle backgrounds.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge appearance="light" variant="primary">
        Neutral
      </Badge>
      <Badge appearance="light" variant="secondary">
        Secondary
      </Badge>
      <Badge appearance="light" variant="info">
        Info
      </Badge>
      <Badge appearance="light" variant="success">
        Success
      </Badge>
      <Badge appearance="light" variant="warning">
        Warning
      </Badge>
      <Badge appearance="light" variant="purple">
        Purple
      </Badge>
      <Badge appearance="light" variant="rose">
        Rose
      </Badge>
    </div>
  ),
};

export const Outline: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Outline appearance features borders with subtle backgrounds.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge appearance="outline" variant="primary">
        Primary
      </Badge>
      <Badge appearance="outline" variant="secondary">
        Secondary
      </Badge>
      <Badge appearance="outline" variant="info">
        Info
      </Badge>
      <Badge appearance="outline" variant="success">
        Success
      </Badge>
      <Badge appearance="outline" variant="warning">
        Warning
      </Badge>
      <Badge appearance="outline" variant="purple">
        Purple
      </Badge>
      <Badge appearance="outline" variant="destructive">
        Destructive
      </Badge>
    </div>
  ),
};

export const Circle: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Circular badges ideal for counts and notification indicators.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge shape="circle" variant="primary">
        1
      </Badge>
      <Badge shape="circle" variant="secondary">
        2
      </Badge>
      <Badge shape="circle" variant="success">
        3
      </Badge>
      <Badge shape="circle" variant="warning">
        4
      </Badge>
      <Badge shape="circle" variant="info">
        5
      </Badge>
      <Badge shape="circle" variant="destructive">
        6
      </Badge>
    </div>
  ),
};

export const WithDot: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Badges with status dots for visual indicators.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge appearance="light" variant="primary">
        <BadgeDot />
        Neutral
      </Badge>
      <Badge appearance="light" variant="info">
        <BadgeDot />
        Info
      </Badge>
      <Badge appearance="light" variant="success">
        <BadgeDot />
        Success
      </Badge>
      <Badge appearance="light" variant="warning">
        <BadgeDot />
        Warning
      </Badge>
      <Badge appearance="light" variant="purple">
        <BadgeDot />
        Purple
      </Badge>
      <Badge appearance="light" variant="rose">
        <BadgeDot />
        Rose
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Badges with icons using children composition.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge appearance="light" variant="primary">
        <Check className="size-3" />
        Neutral
      </Badge>
      <Badge appearance="light" variant="info">
        <Check className="size-3" />
        Info
      </Badge>
      <Badge appearance="light" variant="success">
        <Check className="size-3" />
        Success
      </Badge>
      <Badge appearance="light" variant="warning">
        <Check className="size-3" />
        Warning
      </Badge>
      <Badge appearance="light" variant="purple">
        <Check className="size-3" />
        Purple
      </Badge>
      <Badge appearance="light" variant="rose">
        <Check className="size-3" />
        Rose
      </Badge>
    </div>
  ),
};

export const RemoveButton: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Dismissible badges with remove buttons.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge appearance="light" variant="primary">
        Neutral
        <BadgeButton onClick={() => console.log("Removed")} />
      </Badge>
      <Badge appearance="light" variant="info">
        Info
        <BadgeButton onClick={() => console.log("Removed")} />
      </Badge>
      <Badge appearance="light" variant="success">
        Success
        <BadgeButton onClick={() => console.log("Removed")} />
      </Badge>
      <Badge appearance="light" variant="warning">
        Warning
        <BadgeButton onClick={() => console.log("Removed")} />
      </Badge>
      <Badge appearance="light" variant="purple">
        Purple
        <BadgeButton onClick={() => console.log("Removed")} />
      </Badge>
      <Badge appearance="light" variant="rose">
        Rose
        <BadgeButton onClick={() => console.log("Removed")} />
      </Badge>
    </div>
  ),
};

export const Square: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Default badge styles with calm colors.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge appearance="light" variant="primary">
        Neutral
      </Badge>
      <Badge appearance="light" variant="info">
        Info
      </Badge>
      <Badge appearance="light" variant="success">
        Success
      </Badge>
      <Badge appearance="light" variant="warning">
        Warning
      </Badge>
      <Badge appearance="light" variant="purple">
        Purple
      </Badge>
      <Badge appearance="light" variant="rose">
        Rose
      </Badge>
    </div>
  ),
};

export const Size: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Badge size variants from xs to lg.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="2xs" variant="primary">
        2 Extra Small
      </Badge>
      <Badge size="xs" variant="primary">
        Extra Small
      </Badge>
      <Badge size="sm" variant="primary">
        Small
      </Badge>
      <Badge size="base" variant="primary">
        Base
      </Badge>
      <Badge size="lg" variant="primary">
        Large
      </Badge>
      <Badge size="xl" variant="primary">
        Extra Large
      </Badge>
      <Badge size="2xl" variant="primary">
        2 Extra Large
      </Badge>
    </div>
  ),
};

export const AsChild: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Render badge as a different element using asChild prop.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge asChild variant="primary">
        <a href="#link">Link Badge</a>
      </Badge>
      <Badge asChild variant="secondary">
        <button type="button">Button Badge</button>
      </Badge>
    </div>
  ),
};

export const Disabled: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Disabled state with reduced opacity.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge disabled variant="primary">
        Primary
      </Badge>
      <Badge disabled variant="secondary">
        Secondary
      </Badge>
      <Badge disabled variant="success">
        Success
      </Badge>
      <Badge disabled variant="warning">
        Warning
      </Badge>
      <Badge disabled variant="info">
        Info
      </Badge>
      <Badge disabled variant="destructive">
        Destructive
      </Badge>
    </div>
  ),
};
