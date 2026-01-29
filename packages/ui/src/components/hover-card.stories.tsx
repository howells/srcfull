import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Calendar, Info, Mail, User } from "lucide-react";
import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { Icon } from "./icon";

const meta = {
  title: "Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "HoverCard displays rich information in a popup when hovering over a trigger element. Built on Radix UI Hover Card primitive.",
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story
export const Base: Story = {
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button size="sm">Hover me</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-2 text-neutral-700 text-sm">
            <Icon icon={Info} />
            <div>
              <div className="font-medium">Hover title</div>
              <div className="text-neutral-600">Details shown on hover.</div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithUserProfile: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Example of a user profile card with avatar and details.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@username</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-neutral-200">
              <Icon icon={User} size="lg" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Jane Doe</div>
              <div className="text-neutral-600 text-sm">@username</div>
              <div className="mt-2 text-neutral-700 text-sm">
                Product designer passionate about creating delightful user
                experiences.
              </div>
              <div className="mt-3 flex gap-4 text-neutral-600 text-xs">
                <div>
                  <span className="font-semibold text-neutral-900">1.2k</span>{" "}
                  Following
                </div>
                <div>
                  <span className="font-semibold text-neutral-900">3.4k</span>{" "}
                  Followers
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const WithEventDetails: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Example of an event details card with date and location.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline">Team Meeting</Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-neutral-900">
                Team Sync Meeting
              </div>
              <div className="text-neutral-600 text-sm">
                Monthly team synchronization
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-700">
                <Icon icon={Calendar} size="sm" />
                <span>Monday, Jan 15, 2025 at 2:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Icon icon={Mail} size="sm" />
                <span>Conference Room A</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const MultipleCards: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Multiple hover cards can be used on the same page.",
      },
    },
  },
  render: () => (
    <div className="flex min-h-[200px] items-center justify-center gap-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button size="sm" variant="secondary">
            Info
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-2 text-sm">
            <Icon icon={Info} />
            <div>
              <div className="font-medium">Information</div>
              <div className="text-neutral-600">
                Helpful context appears here.
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button size="sm" variant="secondary">
            Profile
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-2 text-sm">
            <Icon icon={User} />
            <div>
              <div className="font-medium">User Profile</div>
              <div className="text-neutral-600">View user details.</div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <Button size="sm" variant="secondary">
            Schedule
          </Button>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex items-start gap-2 text-sm">
            <Icon icon={Calendar} />
            <div>
              <div className="font-medium">Calendar</div>
              <div className="text-neutral-600">Check your schedule.</div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
