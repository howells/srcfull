import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DataGrid,
  DataGridContainer,
  createExpanderColumn,
} from "@repo/ui/components/data-grid";
import { DataGridTable } from "@repo/ui/components/data-grid-table";
import { DataGridPagination } from "@repo/ui/components/data-grid-pagination";
import { Badge } from "@repo/ui/components/badge";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

const sampleData: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: "Alice Johnson",
    date: "2024-01-15",
    status: "delivered",
    total: 299.99,
    items: [
      { name: "Wireless Mouse", quantity: 2, price: 49.99 },
      { name: "USB-C Cable", quantity: 3, price: 15.99 },
      { name: "Laptop Stand", quantity: 1, price: 89.99 },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: "Bob Smith",
    date: "2024-01-16",
    status: "shipped",
    total: 149.99,
    items: [
      { name: "Mechanical Keyboard", quantity: 1, price: 129.99 },
      { name: "Keycap Set", quantity: 1, price: 20.0 },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: "Carol Davis",
    date: "2024-01-17",
    status: "processing",
    total: 499.99,
    items: [
      { name: "27\" Monitor", quantity: 1, price: 349.99 },
      { name: "Monitor Arm", quantity: 1, price: 89.99 },
      { name: "HDMI Cable", quantity: 2, price: 12.99 },
    ],
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customer: "David Wilson",
    date: "2024-01-18",
    status: "pending",
    total: 79.99,
    items: [{ name: "Webcam", quantity: 1, price: 79.99 }],
  },
];

function ExpandableTable() {
  const [data] = useState<Order[]>(sampleData);

  const columns: ColumnDef<Order>[] = [
    createExpanderColumn<Order>(),
    {
      accessorKey: "orderNumber",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.orderNumber}</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.customer}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusColors = {
          pending: "secondary",
          processing: "default",
          shipped: "default",
          delivered: "default",
        } as const;

        return (
          <Badge variant={statusColors[row.original.status]}>
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.total.toFixed(2)}</span>
      ),
      meta: {
        headerClassName: "text-right",
        cellClassName: "text-right",
        expandedContent: (row) => (
          <div className="space-y-4 p-4">
            <div>
              <h4 className="mb-3 font-semibold text-sm">Order Items</h4>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b text-xs">
                      <th className="px-4 py-2 text-left font-medium">Item</th>
                      <th className="px-4 py-2 text-right font-medium">Qty</th>
                      <th className="px-4 py-2 text-right font-medium">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right font-medium">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {row.items.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-right">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/30">
                    <tr className="border-t-2 font-semibold">
                      <td className="px-4 py-2" colSpan={3}>
                        Order Total
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${row.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">
                  Customer:
                </span>{" "}
                {row.customer}
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Order Date:
                </span>{" "}
                {new Date(row.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ),
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <DataGrid table={table} recordCount={data.length}>
      <DataGridContainer>
        <DataGridTable />
        <DataGridPagination sizes={[5, 10, 20]} />
      </DataGridContainer>
    </DataGrid>
  );
}

const meta = {
  title: "DataGrid/Expandable Rows",
  component: ExpandableTable,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ExpandableTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <ExpandableTable />,
};





