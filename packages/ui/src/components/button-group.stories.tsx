import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { ArrowRight, ChevronDown, Copy, Download, Search, Share } from "lucide-react";
import { Button } from "./button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Icon } from "./icon";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta = {
  title: "Button Group",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Combines related buttons into a single visual unit. Supports horizontal/vertical orientation and separators. Can be combined with Input, Select, and DropdownMenu.",
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Button groups can be oriented vertically.",
      },
    },
  },
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">One</Button>
      <Button variant="outline">Two</Button>
      <Button variant="outline">Three</Button>
    </ButtonGroup>
  ),
};

export const WithSeparators: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Use ButtonGroupSeparator to add visual dividers between buttons.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Preview</Button>
      <ButtonGroupSeparator />
      <Button>Publish</Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "ButtonGroupText displays non-interactive content within the group.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Previous</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>1 of 5</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  ),
};

export const NestedGroups: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Multiple button groups can be nested with spacing between clusters.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" icon={Copy} />
        <Button variant="outline" icon={Download} />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" icon={Share} />
      </ButtonGroup>
    </ButtonGroup>
  ),
};

export const WithInput: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Combine Input with Button for search interfaces and similar patterns.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Input placeholder="Search..." className="w-64" />
      <Button variant="outline" icon={Search}>
        Search
      </Button>
    </ButtonGroup>
  ),
};

export const WithSelect: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Pair Select with Button for currency selectors or multi-control interfaces.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Select defaultValue="usd">
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="usd">USD</SelectItem>
          <SelectItem value="eur">EUR</SelectItem>
          <SelectItem value="gbp">GBP</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="0.00" type="number" />
      <Button>Convert</Button>
    </ButtonGroup>
  ),
};

export const SplitButton: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Create split buttons by combining a primary action with a dropdown menu.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button>Create Project</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={ChevronDown} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>From Template</DropdownMenuItem>
          <DropdownMenuItem>From GitHub</DropdownMenuItem>
          <DropdownMenuItem>Import Existing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
};

export const ActionToolbar: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Combine multiple button groups for complex toolbars and action bars.",
      },
    },
  },
  render: () => (
    <div className="flex gap-2">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Bold
        </Button>
        <Button variant="outline" size="sm">
          Italic
        </Button>
        <Button variant="outline" size="sm">
          Underline
        </Button>
      </ButtonGroup>
      <ButtonGroupSeparator orientation="vertical" />
      <ButtonGroup>
        <Button variant="outline" size="sm">
          Left
        </Button>
        <Button variant="outline" size="sm">
          Center
        </Button>
        <Button variant="outline" size="sm">
          Right
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const Pagination: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Use button groups for pagination controls with status text.",
      },
    },
  },
  render: () => (
    <ButtonGroup>
      <Button variant="outline" disabled>
        Previous
      </Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>Page 3 of 10</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline">
        Next
        <Icon icon={ArrowRight} />
      </Button>
    </ButtonGroup>
  ),
};
