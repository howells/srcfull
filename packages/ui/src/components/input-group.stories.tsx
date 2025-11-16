import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { Search, X, DollarSign, AtSign, Calendar } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

const meta = {
  title: "Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "InputGroup allows you to add prefix/suffix content to input fields. Supports icons, text labels, and action buttons positioned before, after, or vertically aligned with the input.",
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story
export const Base: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithPrefixAndSuffix: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Input groups can have both prefix and suffix addons.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
          <InputGroupText>Search</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Type to search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Clear">
            <X className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const IconPrefixes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Common patterns with icon prefixes for different input types.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <AtSign className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Email address" type="email" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <Calendar className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Select date" type="date" />
      </InputGroup>
    </div>
  ),
};

export const TextPrefixes: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Input groups with text labels as prefixes.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <DollarSign className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const WithActionButtons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Input groups with clickable button addons.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Search">
            <Search className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Type to search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Clear">
            <X className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const TextareaVariant: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Input groups work with textareas. Use block-start alignment for vertical positioning.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Notes</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea placeholder="Write something…" rows={3} />
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="block-start">
          <InputGroupText>Description</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea placeholder="Enter description..." rows={5} />
      </InputGroup>
    </div>
  ),
};

export const ComplexLayouts: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "More complex input group layouts combining multiple addons.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>Price</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon>
          <DollarSign className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" type="number" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <AtSign className="size-4" />
          <InputGroupText>Email</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="you@example.com" type="email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Verify">
            <Search className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
