import type { Meta, StoryObj } from "@storybook/react";
import "@srcfull/tailwind-config/shared-styles.css";
import { AlertCircle, FileX, Inbox, Search, Users } from "lucide-react";
import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

const meta = {
  title: "Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays when there's no content. Provides context and suggests next actions.",
      },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - basic example
export const Base: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia icon={Inbox} variant="icon" />
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>
          Get started by creating a new conversation.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>New message</Button>
      </EmptyContent>
    </Empty>
  ),
};

// Docs-only stories showing comprehensive examples
export const NoSearchResults: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Empty state for search results with guidance on refining the search.",
      },
    },
  },
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia icon={Search} variant="icon" />
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search terms or filters to find what you're looking
          for.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Clear filters</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const NoFiles: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Empty state for file or document lists encouraging users to upload content.",
      },
    },
  },
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia icon={FileX} variant="icon" />
        <EmptyTitle>No files yet</EmptyTitle>
        <EmptyDescription>
          Upload your first file to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upload file</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const NoTeamMembers: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Empty state for team or user lists with action to invite members.",
      },
    },
  },
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia icon={Users} variant="icon" />
        <EmptyTitle>No team members</EmptyTitle>
        <EmptyDescription>
          Invite people to collaborate on your projects.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Invite members</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const WithoutAction: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Empty states don't always require an action button. Sometimes informational context is sufficient.",
      },
    },
  },
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia icon={Inbox} variant="icon" />
        <EmptyTitle>All caught up</EmptyTitle>
        <EmptyDescription>You have no pending notifications.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
