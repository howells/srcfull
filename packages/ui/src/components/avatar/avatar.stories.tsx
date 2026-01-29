import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  getColorFromName,
  getInitials,
  getReadableTextColor,
} from "../../lib/color";
import type { ComponentSize } from "../../lib/size";
import {
  AVATAR_IMAGE_OPTIONS,
  avatarImageControlArgType,
} from "../../stories/controls/avatar-control";
import { AvatarBadge } from "./avatar-badge";
import { AvatarFallback } from "./avatar-fallback";
import { AvatarGroup } from "./avatar-group";
import { AvatarImage } from "./avatar-image";
import { AvatarRoot } from "./avatar-root";
import { AvatarStatus } from "./avatar-status";

const meta = {
  title: "Avatar",
  component: AvatarRoot,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "sm", "base", "lg", "xl", "2xl"],
      description: "Component size",
    },
    shape: {
      control: "select",
      options: ["circle", "square", "rounded"],
      description: "Avatar shape",
    },
    withRing: {
      control: "boolean",
      description: "Show ring around avatar",
    },
    imageSrc: avatarImageControlArgType,
    name: {
      control: "text",
      description: "Name for fallback initials, color generation, and alt text",
      table: {
        category: "Common",
      },
    },
  },
  args: {
    size: "base",
    shape: "circle",
    withRing: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Represents users or entities. Supports images with fallback to initials, status indicators, badges, and grouping.",
      },
    },
  },
} satisfies Meta<typeof AvatarRoot>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic avatar with all controls
export const Base: Story = {
  // @ts-expect-error - Storybook custom args not in component props
  args: {
    size: "base",
    shape: "circle",
    withRing: false,
    imageSrc: "None",
    name: "John Doe",
  },
  render: (args) => {
    const size = (args.size as ComponentSize) || "base";
    const imageSrcKey =
      ((args as Record<string, unknown>).imageSrc as string | undefined) || "";
    const imageSrc =
      imageSrcKey in AVATAR_IMAGE_OPTIONS
        ? AVATAR_IMAGE_OPTIONS[imageSrcKey as keyof typeof AVATAR_IMAGE_OPTIONS]
        : "";
    const name =
      ((args as Record<string, unknown>).name as string | undefined) || "User";

    const hasImage = imageSrc && imageSrc.trim() !== "";

    return (
      <AvatarRoot shape={args.shape} size={size} withRing={args.withRing}>
        {hasImage && <AvatarImage alt={name} key={imageSrc} src={imageSrc} />}
        <AvatarFallback name={name} size={size} />
      </AvatarRoot>
    );
  },
};

// All sizes
export const AllSizes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Avatar sizes from 2xs to 2xl with images.",
      },
    },
  },
  render: () => {
    const sizes: ComponentSize[] = [
      "2xs",
      "xs",
      "sm",
      "base",
      "lg",
      "xl",
      "2xl",
    ];
    const data = [
      { name: "Alex Chen", img: "https://i.pravatar.cc/128?img=1" },
      { name: "Jamie Lee", img: "https://i.pravatar.cc/128?img=2" },
      { name: "Taylor Kim", img: "https://i.pravatar.cc/128?img=3" },
      { name: "Riley Park", img: "https://i.pravatar.cc/128?img=4" },
      { name: "Jordan Wu", img: "https://i.pravatar.cc/128?img=5" },
      { name: "Morgan Li", img: "https://i.pravatar.cc/128?img=6" },
      { name: "Casey Tan", img: "https://i.pravatar.cc/128?img=7" },
    ];

    return (
      <div className="flex flex-wrap items-center gap-4">
        {sizes.map((size, idx) => {
          const { name, img } = data[idx];
          return (
            <div className="flex flex-col items-center gap-2" key={size}>
              <AvatarRoot size={size}>
                <AvatarImage alt={name} src={img} />
                <AvatarFallback name={name} size={size} />
              </AvatarRoot>
              <span className="text-muted-foreground text-xs">{size}</span>
            </div>
          );
        })}
      </div>
    );
  },
};

// All sizes with fallback
export const AllSizesFallback: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Avatar sizes showing fallback initials without images.",
      },
    },
  },
  render: () => {
    const sizes: ComponentSize[] = [
      "2xs",
      "xs",
      "sm",
      "base",
      "lg",
      "xl",
      "2xl",
    ];
    const names = [
      "Alex Chen",
      "Jamie Lee",
      "Taylor Kim",
      "Riley Park",
      "Jordan Wu",
      "Morgan Li",
      "Casey Tan",
    ];

    return (
      <div className="flex flex-wrap items-center gap-4">
        {sizes.map((size, idx) => {
          const name = names[idx];
          return (
            <div className="flex flex-col items-center gap-2" key={size}>
              <AvatarRoot size={size}>
                <AvatarFallback name={name} size={size} />
              </AvatarRoot>
              <span className="text-muted-foreground text-xs">{size}</span>
            </div>
          );
        })}
      </div>
    );
  },
};

// Shapes
export const Shapes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Different avatar shapes: circle, rounded, and square.",
      },
    },
  },
  render: () => {
    const shapes = [
      { shape: "circle" as const, label: "Circle" },
      { shape: "rounded" as const, label: "Rounded" },
      { shape: "square" as const, label: "Square" },
    ];

    return (
      <div className="flex items-center gap-6">
        {shapes.map(({ shape, label }) => (
          <div className="flex flex-col items-center gap-2" key={shape}>
            <AvatarRoot shape={shape} size="lg">
              <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=10" />
              <AvatarFallback name="Jane Doe" size="lg" />
            </AvatarRoot>
            <span className="text-muted-foreground text-xs">{label}</span>
          </div>
        ))}
      </div>
    );
  },
};

// With Ring
export const WithRing: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Avatars with decorative rings.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-4">
      <AvatarRoot size="lg" withRing>
        <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=11" />
        <AvatarFallback name="Sam Green" size="lg" />
      </AvatarRoot>
      <AvatarRoot ringColor="ring-blue-500" size="lg" withRing>
        <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=12" />
        <AvatarFallback name="Alex Blue" size="lg" />
      </AvatarRoot>
      <AvatarRoot ringColor="ring-purple-500" size="lg" withRing>
        <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=13" />
        <AvatarFallback name="Kim Purple" size="lg" />
      </AvatarRoot>
    </div>
  ),
};

// Status Indicators
export const WithStatus: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Avatars with status indicators showing online, away, busy, offline, and do-not-disturb states.",
      },
    },
  },
  render: () => {
    const statuses = [
      { status: "online" as const, name: "Online User", img: 1 },
      { status: "away" as const, name: "Away User", img: 2 },
      { status: "busy" as const, name: "Busy User", img: 3 },
      { status: "offline" as const, name: "Offline User", img: 4 },
      { status: "dnd" as const, name: "DND User", img: 5 },
    ];

    return (
      <div className="flex items-center gap-6">
        {statuses.map(({ status, name, img }) => (
          <div className="flex flex-col items-center gap-2" key={status}>
            <AvatarRoot size="lg">
              <AvatarImage
                alt={name}
                src={`https://i.pravatar.cc/128?img=${img}`}
              />
              <AvatarFallback name={name} size="lg" />
              <AvatarStatus size="lg" status={status} />
            </AvatarRoot>
            <span className="text-muted-foreground text-xs capitalize">
              {status}
            </span>
          </div>
        ))}
      </div>
    );
  },
};

// Badge/Notification Counts
export const WithBadge: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Avatars with notification badge counts.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <AvatarRoot size="lg">
          <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=20" />
          <AvatarFallback name="User One" size="lg" />
          <AvatarBadge count={3} size="lg" />
        </AvatarRoot>
        <span className="text-muted-foreground text-xs">Count: 3</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <AvatarRoot size="lg">
          <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=21" />
          <AvatarFallback name="User Two" size="lg" />
          <AvatarBadge count={25} size="lg" />
        </AvatarRoot>
        <span className="text-muted-foreground text-xs">Count: 25</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <AvatarRoot size="lg">
          <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=22" />
          <AvatarFallback name="User Three" size="lg" />
          <AvatarBadge count={150} size="lg" />
        </AvatarRoot>
        <span className="text-muted-foreground text-xs">Count: 150 (99+)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <AvatarRoot size="lg">
          <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=23" />
          <AvatarFallback name="User Four" size="lg" />
          <AvatarBadge dot size="lg" />
        </AvatarRoot>
        <span className="text-muted-foreground text-xs">Dot indicator</span>
      </div>
    </div>
  ),
};

// Combined Status and Badge
export const StatusAndBadge: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Avatars with both status indicators and notification badges.",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <AvatarRoot size="xl">
        <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=30" />
        <AvatarFallback name="Active User" size="xl" />
        <AvatarStatus position="bottom-right" size="xl" status="online" />
        <AvatarBadge count={5} position="top-right" size="xl" />
      </AvatarRoot>

      <AvatarRoot size="xl">
        <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=31" />
        <AvatarFallback name="Busy User" size="xl" />
        <AvatarStatus position="bottom-right" size="xl" status="busy" />
        <AvatarBadge count={12} position="top-right" size="xl" />
      </AvatarRoot>

      <AvatarRoot size="xl">
        <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=32" />
        <AvatarFallback name="Away User" size="xl" />
        <AvatarStatus position="bottom-right" size="xl" status="away" />
        <AvatarBadge dot position="top-right" size="xl" />
      </AvatarRoot>
    </div>
  ),
};

// Avatar Group
export const Group: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Multiple avatars grouped together with overlapping design. Supports limiting visible avatars and showing surplus count.",
      },
    },
  },
  render: () => {
    const users = [
      { name: "Alex Chen", img: "https://i.pravatar.cc/128?img=1" },
      { name: "Jamie Lee", img: "https://i.pravatar.cc/128?img=2" },
      { name: "Taylor Kim", img: "https://i.pravatar.cc/128?img=3" },
      { name: "Riley Park", img: "https://i.pravatar.cc/128?img=4" },
      { name: "Jordan Wu", img: "https://i.pravatar.cc/128?img=5" },
    ];

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-sm">Normal spacing</h4>
          <AvatarGroup>
            {users.map((user) => (
              <AvatarRoot key={user.name}>
                <AvatarImage alt={user.name} src={user.img} />
                <AvatarFallback name={user.name} />
              </AvatarRoot>
            ))}
          </AvatarGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-sm">With max count (3 visible)</h4>
          <AvatarGroup max={3}>
            {users.map((user) => (
              <AvatarRoot key={user.name}>
                <AvatarImage alt={user.name} src={user.img} />
                <AvatarFallback name={user.name} />
              </AvatarRoot>
            ))}
          </AvatarGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-sm">Large size with animation</h4>
          <AvatarGroup animate size="lg">
            {users.map((user) => (
              <AvatarRoot key={user.name}>
                <AvatarImage alt={user.name} src={user.img} />
                <AvatarFallback name={user.name} />
              </AvatarRoot>
            ))}
          </AvatarGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-sm">Tight spacing</h4>
          <AvatarGroup max={4} spacing="tight">
            {users.map((user) => (
              <AvatarRoot key={user.name}>
                <AvatarImage alt={user.name} src={user.img} />
                <AvatarFallback name={user.name} />
              </AvatarRoot>
            ))}
          </AvatarGroup>
        </div>
      </div>
    );
  },
};

// Color Generation
export const ColorsFromNames: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Avatars use deterministic color generation from names. Each name generates a consistent background color with readable text contrast using the color utilities.",
      },
    },
  },
  render: () => {
    const names = [
      "Ada Lovelace",
      "Grace Hopper",
      "Alan Turing",
      "Linus Torvalds",
      "Margaret Hamilton",
      "Tim Berners-Lee",
    ];
    return (
      <div className="flex flex-col gap-3">
        {names.map((n) => {
          const bg = getColorFromName(n);
          const fg = getReadableTextColor(bg);
          return (
            <div className="flex items-center gap-3" key={n}>
              <AvatarRoot>
                <AvatarFallback style={{ backgroundColor: bg, color: fg }}>
                  {getInitials(n) || "?"}
                </AvatarFallback>
              </AvatarRoot>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{n}</span>
                <span className="text-muted-foreground text-xs">
                  BG: {bg} / FG: {fg}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

// All features combined
export const KitchenSink: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Comprehensive example showing all avatar features together.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h4 className="font-medium text-sm">Individual Features</h4>
        <div className="flex flex-wrap items-center gap-6">
          <AvatarRoot size="xl" withRing>
            <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=40" />
            <AvatarFallback name="Ring User" size="xl" />
            <AvatarStatus size="xl" status="online" />
          </AvatarRoot>

          <AvatarRoot shape="rounded" size="xl">
            <AvatarImage alt="User" src="https://i.pravatar.cc/128?img=41" />
            <AvatarFallback name="Rounded User" size="xl" />
            <AvatarBadge count={7} size="xl" />
          </AvatarRoot>

          <AvatarRoot size="xl">
            <AvatarFallback name="Color User" size="xl" />
            <AvatarStatus size="xl" status="busy" />
            <AvatarBadge dot position="top-right" size="xl" />
          </AvatarRoot>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="font-medium text-sm">Team Group</h4>
        <AvatarGroup animate max={5} size="lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <AvatarRoot key={i}>
              <AvatarImage
                alt={`User ${i + 1}`}
                src={`https://i.pravatar.cc/128?img=${50 + i}`}
              />
              <AvatarFallback name={`User ${i + 1}`} />
              {i === 0 && <AvatarStatus status="online" />}
              {i === 1 && <AvatarBadge count={3} />}
            </AvatarRoot>
          ))}
        </AvatarGroup>
      </div>
    </div>
  ),
};
