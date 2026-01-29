import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { Calendar, Mail, User } from "lucide-react";
import { Icon } from "./icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the select",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Select component for choosing from a list of options. Supports grouping, separators, icons, and multiple trigger sizes.",
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    disabled: false,
  },
  render: (args) => (
    <Select {...args}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="lettuce">Lettuce</SelectItem>
          <SelectItem value="tomato">Tomato</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Simple: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Simple select without groups or separators.",
      },
    },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Choose an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">Option One</SelectItem>
        <SelectItem value="two">Option Two</SelectItem>
        <SelectItem value="three">Option Three</SelectItem>
        <SelectItem value="four">Option Four</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithIcons: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Select items can include icons for better visual recognition.",
      },
    },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Choose type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">
          <Icon icon={User} />
          <span>User</span>
        </SelectItem>
        <SelectItem value="mail">
          <Icon icon={Mail} />
          <span>Email</span>
        </SelectItem>
        <SelectItem value="calendar">
          <Icon icon={Calendar} />
          <span>Calendar</span>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const LongList: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Select handles long lists with scrolling.",
      },
    },
  },
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Choose a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="uk">United Kingdom</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
        <SelectItem value="au">Australia</SelectItem>
        <SelectItem value="de">Germany</SelectItem>
        <SelectItem value="fr">France</SelectItem>
        <SelectItem value="es">Spain</SelectItem>
        <SelectItem value="it">Italy</SelectItem>
        <SelectItem value="jp">Japan</SelectItem>
        <SelectItem value="cn">China</SelectItem>
        <SelectItem value="in">India</SelectItem>
        <SelectItem value="br">Brazil</SelectItem>
      </SelectContent>
    </Select>
  ),
};
