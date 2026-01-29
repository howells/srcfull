import type { Meta, StoryObj } from "@storybook/react-vite";
import "@srcfull/tailwind-config/shared-styles.css";
import {
  Diamond,
  Droplet,
  Flame,
  Home,
  Ruler,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { iconControlArgType } from "../stories/controls/icon-control";
import { AttributeCard } from "./attribute-card";

const meta = {
  title: "Attribute Card",
  component: AttributeCard,
  tags: ["autodocs"],
  argTypes: {
    attributeLabel: {
      control: "text",
      description: "The label for the attribute (e.g., 'Durability')",
    },
    valueLabel: {
      control: "text",
      description: "The main value text (e.g., 'Medium Duty')",
    },
    valueSubLabel: {
      control: "text",
      description: "Optional secondary text (e.g., 'Residential & commercial')",
    },
    icon: iconControlArgType,
  },
  args: {
    attributeLabel: "Durability",
    valueLabel: "Medium Duty",
    valueSubLabel: "Residential & commercial",
    icon: Diamond,
    className: "max-w-xs",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Attribute cards display a single characteristic or specification with an optional icon. Perfect for product specifications, material properties, or feature highlights.",
      },
    },
  },
} satisfies Meta<typeof AttributeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - all controls available
export const Base: Story = {
  render: (args) => <AttributeCard {...args} />,
};

export const MaterialProperties: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Display various material properties and specifications.",
      },
    },
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AttributeCard
        attributeLabel="Durability"
        className="max-w-xs"
        icon={Diamond}
        valueLabel="Medium Duty"
        valueSubLabel="Residential & commercial"
      />
      <AttributeCard
        attributeLabel="Water Resistance"
        className="max-w-xs"
        icon={Droplet}
        valueLabel="High"
        valueSubLabel="Suitable for wet areas"
      />
      <AttributeCard
        attributeLabel="Fire Rating"
        className="max-w-xs"
        icon={Flame}
        valueLabel="Class A"
        valueSubLabel="ASTM E84 certified"
      />
      <AttributeCard
        attributeLabel="Thickness"
        className="max-w-xs"
        icon={Ruler}
        valueLabel="12mm"
        valueSubLabel="Standard commercial grade"
      />
      <AttributeCard
        attributeLabel="Warranty"
        className="max-w-xs"
        icon={ShieldCheck}
        valueLabel="25 Years"
        valueSubLabel="Residential use only"
      />
      <AttributeCard
        attributeLabel="Finish"
        className="max-w-xs"
        icon={Sparkles}
        valueLabel="Polished"
        valueSubLabel="High gloss surface"
      />
    </div>
  ),
};

export const WithoutIcon: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Attribute cards work well without icons for a cleaner look.",
      },
    },
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AttributeCard
        attributeLabel="Coverage"
        className="max-w-xs"
        valueLabel="500 sq ft"
        valueSubLabel="Per box"
      />
      <AttributeCard
        attributeLabel="Installation"
        className="max-w-xs"
        valueLabel="Floating"
        valueSubLabel="Click-lock system"
      />
      <AttributeCard
        attributeLabel="Origin"
        className="max-w-xs"
        valueLabel="Italy"
        valueSubLabel="Imported"
      />
      <AttributeCard
        attributeLabel="Lead Time"
        className="max-w-xs"
        valueLabel="3-5 Days"
        valueSubLabel="In stock items"
      />
    </div>
  ),
};

export const WithoutSubLabel: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Cards can omit the sub-label for simpler displays.",
      },
    },
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <AttributeCard
        attributeLabel="Style"
        className="max-w-xs"
        icon={Home}
        valueLabel="Contemporary"
      />
      <AttributeCard
        attributeLabel="Certification"
        className="max-w-xs"
        icon={ShieldCheck}
        valueLabel="LEED Certified"
      />
      <AttributeCard
        attributeLabel="Performance"
        className="max-w-xs"
        icon={Zap}
        valueLabel="Premium"
      />
    </div>
  ),
};

export const ProductSpecifications: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Example of product specification cards for an e-commerce product page.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Product Specifications</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AttributeCard
          attributeLabel="Material Type"
          className="max-w-xs"
          icon={Diamond}
          valueLabel="Porcelain Tile"
          valueSubLabel="Full body construction"
        />
        <AttributeCard
          attributeLabel="Application"
          className="max-w-xs"
          icon={Home}
          valueLabel="Indoor/Outdoor"
          valueSubLabel="Freeze-thaw resistant"
        />
        <AttributeCard
          attributeLabel="Surface Treatment"
          className="max-w-xs"
          icon={Sparkles}
          valueLabel="Nano Technology"
          valueSubLabel="Stain resistant coating"
        />
        <AttributeCard
          attributeLabel="Slip Resistance"
          className="max-w-xs"
          icon={ShieldCheck}
          valueLabel="R10"
          valueSubLabel="DIN 51130 rated"
        />
        <AttributeCard
          attributeLabel="Color Variation"
          className="max-w-xs"
          icon={Droplet}
          valueLabel="V3 - Moderate"
          valueSubLabel="Random pattern"
        />
        <AttributeCard
          attributeLabel="Rectified Edges"
          className="max-w-xs"
          icon={Ruler}
          valueLabel="Yes"
          valueSubLabel="Precise dimensions"
        />
      </div>
    </div>
  ),
};

export const SingleCard: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "A single attribute card at full width.",
      },
    },
  },
  render: () => (
    <div className="max-w-xs">
      <AttributeCard
        attributeLabel="Environmental Impact"
        icon={ShieldCheck}
        valueLabel="Carbon Neutral"
        valueSubLabel="Certified by Climate Neutral organization. All manufacturing emissions offset through renewable energy credits and verified carbon offset projects."
      />
    </div>
  ),
};
