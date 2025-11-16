import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { Combobox, type ComboboxItem, type ComboboxProps } from "./combobox";

const meta = {
  title: "Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
    items: { control: "object" },
    value: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    buttonWidth: { control: "text" },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const frameworks: ComboboxItem[] = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export const Playground: Story = {
  args: {
    items: frameworks,
    placeholder: "Select framework…",
    buttonWidth: 200,
  } satisfies Partial<ComboboxProps>,
  render: (args) => <Combobox {...args} />,
};
