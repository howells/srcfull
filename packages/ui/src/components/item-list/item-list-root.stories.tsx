import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Icon } from "../icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "./item-list-item";
import { ItemList } from "./item-list-root";

const meta = {
  title: "Item List",
  component: ItemList,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ItemList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Open style**: Minimal list with dividers between items.
 * No backgrounds, clean and spacious. Perfect for simple data lists.
 */
export const OpenList: Story = {
  render: () => (
    <ItemList variant="open">
      <Item>
        <ItemMedia icon="User" variant="icon" />
        <ItemContent>
          <ItemTitle>Jane Cooper</ItemTitle>
          <ItemDescription>Regional Paradigm Technician</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia icon="User" variant="icon" />
        <ItemContent>
          <ItemTitle>Cody Fisher</ItemTitle>
          <ItemDescription>Product Directives Officer</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia icon="User" variant="icon" />
        <ItemContent>
          <ItemTitle>Esther Howard</ItemTitle>
          <ItemDescription>Brand Manager</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * **Separated style**: Individual elevated items with gaps between them.
 * Each item has shadow and card styling. Perfect for dashboards or feature lists.
 */
export const SeparatedList: Story = {
  render: () => (
    <ItemList variant="separated">
      <Item variant="default">
        <ItemMedia icon="Package" variant="icon" />
        <ItemContent>
          <ItemTitle>New order received</ItemTitle>
          <ItemDescription>
            Order #12345 has been placed and is awaiting processing.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="default">Pending</Badge>
        </ItemActions>
      </Item>
      <Item variant="default">
        <ItemMedia icon="Truck" variant="icon" />
        <ItemContent>
          <ItemTitle>Shipment dispatched</ItemTitle>
          <ItemDescription>
            Order #12344 has been shipped via FedEx and will arrive in 2-3 days.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="default">In Transit</Badge>
        </ItemActions>
      </Item>
      <Item variant="default">
        <ItemMedia icon="CheckCircle" variant="icon" />
        <ItemContent>
          <ItemTitle>Order delivered</ItemTitle>
          <ItemDescription>
            Order #12343 was successfully delivered to the customer.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant="outline">Delivered</Badge>
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * **Stacked style**: Items connected together with no gaps.
 * Rounded corners only on the first and last items. Ideal for compact settings lists or navigation menus.
 */
export const StackedList: Story = {
  render: () => (
    <ItemList variant="stacked">
      <Item>
        <ItemMedia icon="Bell" variant="icon" />
        <ItemContent>
          <ItemTitle>Notifications</ItemTitle>
          <ItemDescription>
            Receive alerts about activity on your account
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia icon="Lock" variant="icon" />
        <ItemContent>
          <ItemTitle>Privacy & Security</ItemTitle>
          <ItemDescription>
            Manage your privacy settings and security preferences
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia icon="Palette" variant="icon" />
        <ItemContent>
          <ItemTitle>Appearance</ItemTitle>
          <ItemDescription>
            Customize how the interface looks and feels
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia icon="CreditCard" variant="icon" />
        <ItemContent>
          <ItemTitle>Billing & Payments</ItemTitle>
          <ItemDescription>
            View invoices and manage payment methods
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Icon name="ChevronRight" size="sm" />
        </ItemActions>
      </Item>
    </ItemList>
  ),
};

/**
 * Compact size variant across all three list styles.
 */
export const CompactLists: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-sm">Open (Compact)</h3>
        <ItemList variant="open">
          <Item size="sm">
            <ItemMedia icon="File" iconSize="xs" variant="icon" />
            <ItemContent>
              <ItemTitle>Document.pdf</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button size="xs" variant="ghost">
                <Icon name="Download" size="xs" />
              </Button>
            </ItemActions>
          </Item>
          <Item size="sm">
            <ItemMedia icon="Image" iconSize="xs" variant="icon" />
            <ItemContent>
              <ItemTitle>Screenshot.png</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button size="xs" variant="ghost">
                <Icon name="Download" size="xs" />
              </Button>
            </ItemActions>
          </Item>
        </ItemList>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-sm">Separated (Compact)</h3>
        <ItemList variant="separated">
          <Item size="sm">
            <ItemMedia icon="Star" iconSize="xs" variant="icon" />
            <ItemContent>
              <ItemTitle>Feature request</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary">New</Badge>
            </ItemActions>
          </Item>
          <Item size="sm">
            <ItemMedia icon="Bug" iconSize="xs" variant="icon" />
            <ItemContent>
              <ItemTitle>Bug report</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Badge variant="destructive">Urgent</Badge>
            </ItemActions>
          </Item>
        </ItemList>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-sm">Stacked (Compact)</h3>
        <ItemList variant="stacked">
          <Item size="sm">
            <ItemMedia icon="Mail" iconSize="xs" variant="icon" />
            <ItemContent>
              <ItemTitle>Email notifications</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="xs" />
            </ItemActions>
          </Item>
          <Item size="sm">
            <ItemMedia icon="MessageSquare" iconSize="xs" variant="icon" />
            <ItemContent>
              <ItemTitle>SMS notifications</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="xs" />
            </ItemActions>
          </Item>
        </ItemList>
      </div>
    </div>
  ),
};

/**
 * ItemList integrated inside a Card component.
 * This shows how to compose ItemList with Card for rich layouts.
 */
export const InsideCard: Story = {
  render: () => (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <ItemList variant="open">
            <Item>
              <ItemMedia icon="User" variant="icon" />
              <ItemContent>
                <ItemTitle>Jane Cooper</ItemTitle>
                <ItemDescription>jane@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="default">Admin</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemMedia icon="User" variant="icon" />
              <ItemContent>
                <ItemTitle>Cody Fisher</ItemTitle>
                <ItemDescription>cody@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">Member</Badge>
              </ItemActions>
            </Item>
            <Item>
              <ItemMedia icon="User" variant="icon" />
              <ItemContent>
                <ItemTitle>Esther Howard</ItemTitle>
                <ItemDescription>esther@example.com</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="secondary">Member</Badge>
              </ItemActions>
            </Item>
          </ItemList>
        </CardContent>
      </Card>

      <Card bordered={false} className="p-0">
        <ItemList variant="stacked">
          <Item>
            <ItemContent>
              <ItemTitle>Notifications</ItemTitle>
              <ItemDescription>
                Configure your notification preferences
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="sm" />
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Privacy</ItemTitle>
              <ItemDescription>Manage your privacy settings</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Icon name="ChevronRight" size="sm" />
            </ItemActions>
          </Item>
        </ItemList>
      </Card>
    </div>
  ),
};

/**
 * Real-world example: Settings page with stacked list.
 */
export const SettingsExample: Story = {
  render: () => (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="mb-2 font-semibold text-lg">Account Settings</h2>
        <p className="mb-4 text-muted-foreground text-sm">
          Manage your account preferences and settings
        </p>
        <ItemList variant="stacked">
          <Item>
            <ItemContent>
              <ItemTitle>Profile Information</ItemTitle>
              <ItemDescription>
                Update your name, email, and profile photo
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Change Password</ItemTitle>
              <ItemDescription>
                Update your password to keep your account secure
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="ghost">
                Change
              </Button>
            </ItemActions>
          </Item>
          <Item>
            <ItemContent>
              <ItemTitle>Two-Factor Authentication</ItemTitle>
              <ItemDescription>
                Add an extra layer of security to your account
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="secondary">Enabled</Badge>
            </ItemActions>
          </Item>
        </ItemList>
      </div>
    </div>
  ),
};

/**
 * Demonstrates different Item variants (outline, muted) with separated lists.
 */
export const ItemVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-sm">Default Items</h3>
        <ItemList variant="separated">
          <Item variant="default">
            <ItemContent>
              <ItemTitle>Default variant</ItemTitle>
              <ItemDescription>
                Standard card background and styling
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemList>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-sm">Outline Items</h3>
        <ItemList variant="separated">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Outline variant</ItemTitle>
              <ItemDescription>
                Emphasized border for stronger separation
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemList>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-sm">Muted Items</h3>
        <ItemList variant="separated">
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Muted variant</ItemTitle>
              <ItemDescription>
                Subtle background for secondary content
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemList>
      </div>
    </div>
  ),
};

/**
 * Ordered list example using the ordered prop.
 */
export const OrderedList: Story = {
  render: () => (
    <ItemList ordered variant="open">
      <Item>
        <ItemContent>
          <ItemTitle>Create your account</ItemTitle>
          <ItemDescription>
            Sign up with your email and password
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Verify your email</ItemTitle>
          <ItemDescription>
            Check your inbox for a verification link
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Complete your profile</ItemTitle>
          <ItemDescription>Add your details and preferences</ItemDescription>
        </ItemContent>
      </Item>
    </ItemList>
  ),
};
