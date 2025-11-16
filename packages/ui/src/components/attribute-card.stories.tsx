import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import { iconControlArgType } from "../stories/controls/icon-control";
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
        valueLabel="Medium Duty"
        valueSubLabel="Residential & commercial"
        icon={Diamond}
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Water Resistance"
        valueLabel="High"
        valueSubLabel="Suitable for wet areas"
        icon={Droplet}
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Fire Rating"
        valueLabel="Class A"
        valueSubLabel="ASTM E84 certified"
        icon={Flame}
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Thickness"
        valueLabel="12mm"
        valueSubLabel="Standard commercial grade"
        icon={Ruler}
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Warranty"
        valueLabel="25 Years"
        valueSubLabel="Residential use only"
        icon={ShieldCheck}
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Finish"
        valueLabel="Polished"
        valueSubLabel="High gloss surface"
        icon={Sparkles}
        className="max-w-xs"
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
        valueLabel="500 sq ft"
        valueSubLabel="Per box"
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Installation"
        valueLabel="Floating"
        valueSubLabel="Click-lock system"
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Origin"
        valueLabel="Italy"
        valueSubLabel="Imported"
        className="max-w-xs"
      />
      <AttributeCard
        attributeLabel="Lead Time"
        valueLabel="3-5 Days"
        valueSubLabel="In stock items"
        className="max-w-xs"
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
      <AttributeCard attributeLabel="Style" valueLabel="Contemporary" icon={Home} className="max-w-xs" />
      <AttributeCard attributeLabel="Certification" valueLabel="LEED Certified" icon={ShieldCheck} className="max-w-xs" />
      <AttributeCard attributeLabel="Performance" valueLabel="Premium" icon={Zap} className="max-w-xs" />
    </div>
  ),
};

export const ProductSpecifications: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Example of product specification cards for an e-commerce product page.",
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Product Specifications</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AttributeCard
          attributeLabel="Material Type"
          valueLabel="Porcelain Tile"
          valueSubLabel="Full body construction"
          icon={Diamond}
          className="max-w-xs"
        />
        <AttributeCard
          attributeLabel="Application"
          valueLabel="Indoor/Outdoor"
          valueSubLabel="Freeze-thaw resistant"
          icon={Home}
          className="max-w-xs"
        />
        <AttributeCard
          attributeLabel="Surface Treatment"
          valueLabel="Nano Technology"
          valueSubLabel="Stain resistant coating"
          icon={Sparkles}
          className="max-w-xs"
        />
        <AttributeCard
          attributeLabel="Slip Resistance"
          valueLabel="R10"
          valueSubLabel="DIN 51130 rated"
          icon={ShieldCheck}
          className="max-w-xs"
        />
        <AttributeCard
          attributeLabel="Color Variation"
          valueLabel="V3 - Moderate"
          valueSubLabel="Random pattern"
          icon={Droplet}
          className="max-w-xs"
        />
        <AttributeCard
          attributeLabel="Rectified Edges"
          valueLabel="Yes"
          valueSubLabel="Precise dimensions"
          icon={Ruler}
          className="max-w-xs"
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
        valueLabel="Carbon Neutral"
        valueSubLabel="Certified by Climate Neutral organization. All manufacturing emissions offset through renewable energy credits and verified carbon offset projects."
        icon={ShieldCheck}
      />
    </div>
  ),
};
