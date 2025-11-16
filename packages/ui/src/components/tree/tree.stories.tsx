import type { Meta, StoryObj } from "@storybook/react";
import { TreeRoot } from "./tree-root";
import type { TreeNode } from "./tree-types";

const meta: Meta<typeof TreeRoot> = {
  title: "Components/Tree",
  component: TreeRoot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TreeRoot>;

const sampleData: TreeNode[] = [
  {
    id: "materials",
    name: "Materials",
    children: [
      {
        id: "fabric",
        name: "Fabric",
        children: [
          { id: "cotton", name: "Cotton" },
          { id: "wool", name: "Wool" },
          { id: "silk", name: "Silk" },
        ],
      },
      {
        id: "leather",
        name: "Leather",
        children: [
          { id: "full-grain", name: "Full Grain" },
          { id: "top-grain", name: "Top Grain" },
        ],
      },
    ],
  },
  {
    id: "categories",
    name: "Categories",
    children: [
      {
        id: "upholstery",
        name: "Upholstery",
        children: [
          { id: "residential", name: "Residential" },
          { id: "commercial", name: "Commercial" },
        ],
      },
      { id: "curtains", name: "Curtains" },
      { id: "wallcoverings", name: "Wallcoverings" },
    ],
  },
];

const categoryData: TreeNode[] = [
  {
    id: "level-1",
    name: "Level 1 Categories",
    children: [
      {
        id: "upholstery",
        name: "Upholstery",
        children: [
          {
            id: "residential-upholstery",
            name: "Residential Upholstery",
            children: [
              { id: "sofas", name: "Sofas" },
              { id: "chairs", name: "Chairs" },
              { id: "ottomans", name: "Ottomans" },
            ],
          },
          {
            id: "commercial-upholstery",
            name: "Commercial Upholstery",
            children: [
              { id: "office-seating", name: "Office Seating" },
              { id: "hospitality", name: "Hospitality" },
            ],
          },
        ],
      },
      {
        id: "curtains",
        name: "Curtains & Drapery",
        children: [
          { id: "sheers", name: "Sheers" },
          { id: "blackout", name: "Blackout" },
          { id: "thermal", name: "Thermal" },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const CategoryTree: Story = {
  args: {
    data: categoryData,
    defaultExpandedIds: ["level-1", "upholstery"],
  },
};

export const WithClickHandler: Story = {
  args: {
    data: sampleData,
    onItemClick: (item) => {
      alert(`Clicked: ${item.getItemName()}`);
    },
  },
};

export const CustomLabel: Story = {
  args: {
    data: sampleData,
    renderLabel: (item) => {
      const meta = item.getItemMeta();
      return (
        <span className="flex items-center gap-2">
          <span>{item.getItemName()}</span>
          {meta.isFolder && (
            <span className="text-xs text-muted-foreground">
              ({meta.childrenCount})
            </span>
          )}
        </span>
      );
    },
  },
};

export const SingleBranch: Story = {
  args: {
    data: [
      {
        id: "root",
        name: "Project",
        children: [
          {
            id: "src",
            name: "src",
            children: [
              {
                id: "components",
                name: "components",
                children: [
                  { id: "button", name: "button.tsx" },
                  { id: "input", name: "input.tsx" },
                ],
              },
              {
                id: "utils",
                name: "utils",
                children: [{ id: "helpers", name: "helpers.ts" }],
              },
            ],
          },
        ],
      },
    ],
  },
};
