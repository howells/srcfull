import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import { AccordionContent } from "./accordion-content";
import { AccordionItem } from "./accordion-item";
import { AccordionRoot as Accordion } from "./accordion-root";
import { AccordionTrigger } from "./accordion-trigger";

const meta = {
  title: "Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["single", "multiple"],
      description: "Whether one or multiple items can be open at a time",
    },
    collapsible: {
      control: "boolean",
      description: "Allow all items to be closed (single type only)",
    },
    variant: {
      control: "select",
      options: ["default", "outline", "solid"],
      description: "Visual variant of the accordion",
    },
    indicator: {
      control: "select",
      options: ["arrow", "plus", "none"],
      description: "Type of indicator icon",
    },
  },
  parameters: {
    docs: {
      description: {
        component: "A collapsible panel that can be expanded or collapsed.",
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    type: "single",
    collapsible: true,
    variant: "default",
    indicator: "arrow",
  },
  render: (args) => (
    <Accordion {...args} className="w-full lg:w-3/4">
      <AccordionItem value="item-1">
        <AccordionTrigger>Asset Management</AccordionTrigger>
        <AccordionContent>
          Organize and find your digital assets quickly across teams.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Brand Consistency</AccordionTrigger>
        <AccordionContent>
          Keep your brand materials up to date and easily accessible.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Team Collaboration</AccordionTrigger>
        <AccordionContent>
          Work together seamlessly with shared libraries and permissions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Outline: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Outline variant with bordered items and spacing between them.",
      },
    },
  },
  render: () => (
    <Accordion
      className="w-full lg:w-3/4"
      collapsible
      type="single"
      variant="outline"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Asset Management</AccordionTrigger>
        <AccordionContent>
          Organize and find your digital assets quickly across teams.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Brand Consistency</AccordionTrigger>
        <AccordionContent>
          Keep your brand materials up to date and easily accessible.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Team Collaboration</AccordionTrigger>
        <AccordionContent>
          Work together seamlessly with shared libraries and permissions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Solid: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Solid variant with background color and spacing between items.",
      },
    },
  },
  render: () => (
    <Accordion
      className="w-full lg:w-3/4"
      collapsible
      type="single"
      variant="solid"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Asset Management</AccordionTrigger>
        <AccordionContent>
          Organize and find your digital assets quickly across teams.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Brand Consistency</AccordionTrigger>
        <AccordionContent>
          Keep your brand materials up to date and easily accessible.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Team Collaboration</AccordionTrigger>
        <AccordionContent>
          Work together seamlessly with shared libraries and permissions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Indicator: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Different indicator types: arrow (default) and plus icon.",
      },
    },
  },
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-sm">
          Arrow Indicator (Default)
        </h3>
        <Accordion
          className="w-full lg:w-3/4"
          collapsible
          indicator="arrow"
          type="single"
          variant="outline"
        >
          <AccordionItem value="arrow-1">
            <AccordionTrigger>Asset Management</AccordionTrigger>
            <AccordionContent>
              Organize and find your digital assets quickly across teams.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="arrow-2">
            <AccordionTrigger>Brand Consistency</AccordionTrigger>
            <AccordionContent>
              Keep your brand materials up to date and easily accessible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-sm">Plus Indicator</h3>
        <Accordion
          className="w-full lg:w-3/4"
          collapsible
          indicator="plus"
          type="single"
          variant="outline"
        >
          <AccordionItem value="plus-1">
            <AccordionTrigger>Asset Management</AccordionTrigger>
            <AccordionContent>
              Organize and find your digital assets quickly across teams.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="plus-2">
            <AccordionTrigger>Brand Consistency</AccordionTrigger>
            <AccordionContent>
              Keep your brand materials up to date and easily accessible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  ),
};

export const Nested: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Nested accordions demonstrating hierarchical content organization.",
      },
    },
  },
  render: () => (
    <Accordion
      className="w-full lg:w-3/4"
      collapsible
      type="single"
      variant="outline"
    >
      <AccordionItem value="parent-1">
        <AccordionTrigger>Getting Started</AccordionTrigger>
        <AccordionContent>
          <Accordion
            className="ml-4"
            collapsible
            type="single"
            variant="default"
          >
            <AccordionItem value="nested-1-1">
              <AccordionTrigger>Installation</AccordionTrigger>
              <AccordionContent>
                Install the package using your preferred package manager.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-1-2">
              <AccordionTrigger>Configuration</AccordionTrigger>
              <AccordionContent>
                Configure the component in your project settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="parent-2">
        <AccordionTrigger>Advanced Usage</AccordionTrigger>
        <AccordionContent>
          <Accordion
            className="ml-4"
            collapsible
            type="single"
            variant="default"
          >
            <AccordionItem value="nested-2-1">
              <AccordionTrigger>Customization</AccordionTrigger>
              <AccordionContent>
                Customize the component to match your design system.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-2-2">
              <AccordionTrigger>API Reference</AccordionTrigger>
              <AccordionContent>
                Detailed API documentation for all component props.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
