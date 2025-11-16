import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { VariantSelectorItem } from "./variant-selector-item";
import { VariantSelector } from "./variant-selector-root";

const meta = {
  title: "Variant Selector",
  component: VariantSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VariantSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// Color variants similar to the reference image
const colorVariants = [
  { value: "ivory", label: "Ivory", color: "#FFFFF0" },
  { value: "pearl", label: "Pearl", color: "#F5F5F0" },
  { value: "linen", label: "Linen", color: "#F0EBE3" },
  { value: "sand", label: "Sand", color: "#E8DCC8" },
  { value: "taupe", label: "Taupe", color: "#D4C4B0" },
  { value: "stone", label: "Stone", color: "#AFA393" },
  { value: "ash", label: "Ash", color: "#A8A196" },
  { value: "slate", label: "Slate", color: "#7A7568" },
  { value: "charcoal", label: "Charcoal", color: "#54524C" },
  { value: "graphite", label: "Graphite", color: "#3D3935" },
];

/**
 * Single selection mode - behaves like a radio group
 */
export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState("stone");

    return (
      <div className="w-full max-w-3xl p-8">
        <h3 className="mb-4 font-semibold text-lg">Select a color</h3>
        <VariantSelector mode="single" onValueChange={setValue} value={value}>
          {colorVariants.map((variant) => (
            <VariantSelectorItem
              color={variant.color}
              key={variant.value}
              label={variant.label}
              value={variant.value}
            />
          ))}
        </VariantSelector>
        <p className="mt-6 text-muted-foreground text-sm">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Multiple selection mode - behaves like a checkbox group
 */
export const MultipleSelect: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(["stone", "slate"]);

    return (
      <div className="w-full max-w-3xl p-8">
        <h3 className="mb-4 font-semibold text-lg">Select multiple colors</h3>
        <VariantSelector
          mode="multiple"
          onValueChange={setValues}
          value={values}
        >
          {colorVariants.map((variant) => (
            <VariantSelectorItem
              color={variant.color}
              key={variant.value}
              label={variant.label}
              value={variant.value}
            />
          ))}
        </VariantSelector>
        <p className="mt-6 text-muted-foreground text-sm">
          Selected: <strong>{values.join(", ") || "none"}</strong>
        </p>
      </div>
    );
  },
};

/**
 * With disabled options
 */
export const WithDisabled: Story = {
  render: () => {
    const [value, setValue] = useState("stone");

    return (
      <div className="w-full max-w-3xl p-8">
        <h3 className="mb-4 font-semibold text-lg">Some options disabled</h3>
        <VariantSelector mode="single" onValueChange={setValue} value={value}>
          {colorVariants.map((variant, index) => (
            <VariantSelectorItem
              color={variant.color}
              disabled={index % 3 === 0}
              key={variant.value}
              label={variant.label}
              value={variant.value}
            />
          ))}
        </VariantSelector>
        <p className="mt-6 text-muted-foreground text-sm">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

/**
 * With images (mock Next.js Image usage)
 */
export const WithImages: Story = {
  render: () => {
    const [value, setValue] = useState("fabric1");

    const fabricVariants = [
      { value: "fabric1", label: "Cotton" },
      { value: "fabric2", label: "Linen" },
      { value: "fabric3", label: "Wool" },
      { value: "fabric4", label: "Silk" },
    ];

    return (
      <div className="w-full max-w-3xl p-8">
        <h3 className="mb-4 font-semibold text-lg">Select a fabric</h3>
        <VariantSelector mode="single" onValueChange={setValue} value={value}>
          {fabricVariants.map((variant) => (
            <VariantSelectorItem
              image={
                <div className="flex size-full items-center justify-center bg-muted text-muted-foreground text-xs">
                  {variant.label}
                </div>
              }
              key={variant.value}
              label={variant.label}
              value={variant.value}
            />
          ))}
        </VariantSelector>
        <p className="mt-6 text-muted-foreground text-sm">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};

/**
 * Compact grid with fewer items
 */
export const Compact: Story = {
  render: () => {
    const [value, setValue] = useState("taupe");

    return (
      <div className="w-full max-w-xl p-8">
        <h3 className="mb-4 font-semibold text-lg">Neutral palette</h3>
        <VariantSelector mode="single" onValueChange={setValue} value={value}>
          {colorVariants.slice(0, 5).map((variant) => (
            <VariantSelectorItem
              color={variant.color}
              key={variant.value}
              label={variant.label}
              value={variant.value}
            />
          ))}
        </VariantSelector>
        <p className="mt-6 text-muted-foreground text-sm">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};
