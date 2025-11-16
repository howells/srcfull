import type { Meta, StoryObj } from "@storybook/react-vite";
import "@materia/tailwind-config/shared-styles.css";
import {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
} from "./description-list";

const meta = {
  title: "Description List",
  component: DescriptionList,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays key-value pairs in an organized format.",
      },
    },
  },
  argTypes: {
    showSeparators: {
      control: "boolean",
      description: "Show separator lines between items",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive story - all controls available
export const Base: Story = {
  args: {
    showSeparators: false,
  },
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionItem>
        <DescriptionTerm>Year of Introduction</DescriptionTerm>
        <DescriptionDetails>2022</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Availability</DescriptionTerm>
        <DescriptionDetails>Typically Stocked</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Country of Origin</DescriptionTerm>
        <DescriptionDetails>Italy</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Intended Use</DescriptionTerm>
        <DescriptionDetails>Commercial project specification only</DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  ),
};

export const ProductSpecifications: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Product specification details with various data types and lengths.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Product Name</DescriptionTerm>
          <DescriptionDetails>Calacatta Oro Marble Tile</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>SKU</DescriptionTerm>
          <DescriptionDetails>CAL-ORO-12X24</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Dimensions</DescriptionTerm>
          <DescriptionDetails>12" × 24" × 3/8"</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Material</DescriptionTerm>
          <DescriptionDetails>Natural Marble</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Finish</DescriptionTerm>
          <DescriptionDetails>Polished</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Price per sq ft</DescriptionTerm>
          <DescriptionDetails>$24.99</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Lead Time</DescriptionTerm>
          <DescriptionDetails>3-5 business days</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

export const UserProfile: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "User profile information display.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Full Name</DescriptionTerm>
          <DescriptionDetails>Sarah Anderson</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Email</DescriptionTerm>
          <DescriptionDetails>sarah.anderson@example.com</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Role</DescriptionTerm>
          <DescriptionDetails>Project Manager</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Department</DescriptionTerm>
          <DescriptionDetails>Design</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Location</DescriptionTerm>
          <DescriptionDetails>San Francisco, CA</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Member Since</DescriptionTerm>
          <DescriptionDetails>January 2022</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

export const OrderDetails: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "E-commerce order information with status indicators.",
      },
    },
  },
  render: () => (
    <div className="max-w-lg">
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Order Number</DescriptionTerm>
          <DescriptionDetails>#ORD-2024-0123</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Order Date</DescriptionTerm>
          <DescriptionDetails>January 15, 2024</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>
            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Shipped
            </span>
          </DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Shipping Method</DescriptionTerm>
          <DescriptionDetails>Standard Ground</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Tracking Number</DescriptionTerm>
          <DescriptionDetails>1Z999AA10123456784</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Estimated Delivery</DescriptionTerm>
          <DescriptionDetails>January 20, 2024</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Total</DescriptionTerm>
          <DescriptionDetails className="text-base">$1,247.50</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
};

export const CompactLayout: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Compact layout with reduced gap between items.",
      },
    },
  },
  render: () => (
    <div className="max-w-md">
      <DescriptionList className="gap-2">
        <DescriptionItem>
          <DescriptionTerm>File Name</DescriptionTerm>
          <DescriptionDetails>presentation.pdf</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>File Size</DescriptionTerm>
          <DescriptionDetails>2.4 MB</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>PDF Document</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Modified</DescriptionTerm>
          <DescriptionDetails>2 hours ago</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    </div>
  ),
};
