import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import React from "react";
import { Swatch, SwatchGroup } from "./swatch-group";

const meta = {
  title: "Swatch Group",
  component: SwatchGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Row of selectable circular swatches for colors or images. Single selection.",
      },
    },
  },
} satisfies Meta<typeof SwatchGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  name: "Color Swatches",
  parameters: { controls: { disable: true } },
  render: () => (
    <SwatchGroup aria-label="Choose color" defaultValue="c1" size="md">
      <Swatch aria-label="Green slate" color="#46574c" value="c1" />
      <Swatch aria-label="Near black" color="#0c1310" value="c2" />
      <Swatch aria-label="Sage" color="#94a996" value="c3" />
      <Swatch aria-label="Deep teal" color="#183646" value="c4" />
      <Swatch aria-label="Charcoal" color="#0d1511" value="c5" />
    </SwatchGroup>
  ),
};

export const Images: Story = {
  name: "Image Swatches",
  parameters: { controls: { disable: true } },
  render: () => (
    <SwatchGroup aria-label="Choose pattern" defaultValue="i1" size="md">
      <Swatch aria-label="Variant one" value="i1">
        <img
          alt=""
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/one/80/80"
        />
      </Swatch>
      <Swatch aria-label="Variant two" value="i2">
        <img
          alt=""
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/two/80/80"
        />
      </Swatch>
      <Swatch aria-label="Variant three" value="i3">
        <img
          alt=""
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/three/80/80"
        />
      </Swatch>
      <Swatch aria-label="Variant four" value="i4">
        <img
          alt=""
          className="h-full w-full object-cover"
          src="https://picsum.photos/seed/four/80/80"
        />
      </Swatch>
    </SwatchGroup>
  ),
};

export const Sizes: Story = {
  name: "Sizes",
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-20 text-muted-foreground text-sm">Small</span>
        <SwatchGroup aria-label="Small colors" defaultValue="s1" size="sm">
          <Swatch aria-label="Green slate" color="#46574c" value="s1" />
          <Swatch aria-label="Near black" color="#0c1310" value="s2" />
          <Swatch aria-label="Sage" color="#94a996" value="s3" />
        </SwatchGroup>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-muted-foreground text-sm">Medium</span>
        <SwatchGroup aria-label="Medium colors" defaultValue="m1" size="md">
          <Swatch aria-label="Green slate" color="#46574c" value="m1" />
          <Swatch aria-label="Near black" color="#0c1310" value="m2" />
          <Swatch aria-label="Sage" color="#94a996" value="m3" />
        </SwatchGroup>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-20 text-muted-foreground text-sm">Large</span>
        <SwatchGroup aria-label="Large colors" defaultValue="l1" size="lg">
          <Swatch aria-label="Green slate" color="#46574c" value="l1" />
          <Swatch aria-label="Near black" color="#0c1310" value="l2" />
          <Swatch aria-label="Sage" color="#94a996" value="l3" />
        </SwatchGroup>
      </div>
    </div>
  ),
};
