import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import {
  AlertCircle,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Heart,
  Home,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  ICON_OPTIONS,
  iconControlArgType,
} from "../stories/controls/icon-control";
import { Icon } from "./icon";

const meta = {
  title: "Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    icon: iconControlArgType,
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Icon component renders Lucide React icons with consistent sizing. Supports the full component size scale from 2xs to 2xl.",
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Base interactive story - controls affect this icon
export const Base: Story = {
  args: {
    icon: ICON_OPTIONS.ChevronRight,
    size: "base",
  },
};

// All sizes with shared controls
export const AllSizes: Story = {
  args: {
    icon: ICON_OPTIONS.Star,
  },
  render: ({ icon }) => (
    <div className="flex items-center gap-4 text-neutral-700">
      {(["2xs", "xs", "sm", "base", "lg", "xl", "2xl"] as const).map((size) => (
        <Icon icon={icon} key={size} size={size} />
      ))}
    </div>
  ),
};

// Common icons
export const CommonIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Examples of commonly used icons from Lucide React.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 text-neutral-700">
      <Icon icon={Search} />
      <Icon icon={Bell} />
      <Icon icon={Heart} />
      <Icon icon={Star} />
      <Icon icon={User} />
      <Icon icon={Settings} />
      <Icon icon={Mail} />
      <Icon icon={Calendar} />
      <Icon icon={Home} />
      <Icon icon={MessageSquare} />
    </div>
  ),
};

// Action icons
export const ActionIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Icons commonly used for actions and navigation.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 text-neutral-700">
      <Icon icon={Plus} />
      <Icon icon={Check} />
      <Icon icon={X} />
      <Icon icon={ChevronRight} />
    </div>
  ),
};

// Status icons
export const StatusIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Icons commonly used to indicate status or state.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 text-neutral-700">
      <Icon icon={Check} />
      <Icon icon={AlertCircle} />
      <Icon icon={Info} />
      <Icon icon={Zap} />
      <Icon icon={Star} />
    </div>
  ),
};

// Size comparison
export const SizeComparison: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Comparison of different icons at the same size.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 font-medium text-sm">Small (sm)</div>
        <div className="flex gap-4 text-neutral-700">
          <Icon icon={Heart} size="sm" />
          <Icon icon={Star} size="sm" />
          <Icon icon={Bell} size="sm" />
          <Icon icon={Mail} size="sm" />
          <Icon icon={User} size="sm" />
        </div>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Base (default)</div>
        <div className="flex gap-4 text-neutral-700">
          <Icon icon={Heart} size="base" />
          <Icon icon={Star} size="base" />
          <Icon icon={Bell} size="base" />
          <Icon icon={Mail} size="base" />
          <Icon icon={User} size="base" />
        </div>
      </div>
      <div>
        <div className="mb-2 font-medium text-sm">Large (lg)</div>
        <div className="flex gap-4 text-neutral-700">
          <Icon icon={Heart} size="lg" />
          <Icon icon={Star} size="lg" />
          <Icon icon={Bell} size="lg" />
          <Icon icon={Mail} size="lg" />
          <Icon icon={User} size="lg" />
        </div>
      </div>
    </div>
  ),
};
