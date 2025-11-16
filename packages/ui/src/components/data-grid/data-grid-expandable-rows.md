# DataGrid Expandable Rows

The DataGrid component supports expandable rows (sub-tables) using TanStack Table's built-in expansion features.

## Quick Start

### 1. Add the Expand Column

Use the `createExpanderColumn()` helper to add a toggle column:

```tsx
import { createExpanderColumn } from "@repo/ui/components/data-grid";

const columns = useMemo<ColumnDef<MyData>[]>(() => [
  createExpanderColumn<MyData>(),
  { accessorKey: 'name', header: 'Name' },
  // ... other columns
], []);
```

### 2. Define Expanded Content

Add `expandedContent` to any column's `meta` to define what shows when expanded:

```tsx
const columns = useMemo<ColumnDef<Product>[]>(() => [
  createExpanderColumn<Product>(),
  {
    accessorKey: 'name',
    header: 'Product Name',
    meta: {
      expandedContent: (row) => (
        <div className="p-4 bg-muted/50">
          <h4 className="font-semibold mb-2">Product Details</h4>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="font-medium">SKU:</dt>
            <dd>{row.sku}</dd>
            <dt className="font-medium">Description:</dt>
            <dd>{row.description}</dd>
          </dl>
        </div>
      ),
    },
  },
  // ... other columns
], []);
```

### 3. Configure Table with Expanded Row Model

```tsx
import { getExpandedRowModel } from "@tanstack/react-table";

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(), // Required for expansion
  // ... other config
});
```

## Advanced Usage

### Custom Expand Toggle

Create your own toggle component instead of using the default:

```tsx
import { DataGridExpandToggle } from "@repo/ui/components/data-grid";
import { PlusIcon, MinusIcon } from "lucide-react";

{
  id: 'expander',
  header: () => null,
  cell: ({ row }) => (
    <DataGridExpandToggle
      row={row}
      expandedIcon={MinusIcon}
      collapsedIcon={PlusIcon}
      className="text-primary"
    />
  ),
}
```

### Nested Sub-Tables

Render a complete sub-table within expanded content:

```tsx
meta: {
  expandedContent: (row) => {
    const subTable = useReactTable({
      data: row.items,
      columns: subColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataGrid table={subTable} recordCount={row.items.length}>
        <DataGridContainer border={false}>
          <DataGridTable />
        </DataGridContainer>
      </DataGrid>
    );
  },
}
```

### Conditional Expansion

Control which rows can expand using `getRowCanExpand`:

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getRowCanExpand: (row) => row.original.hasDetails, // Only expand rows with details
});
```

### Programmatic Expansion

Control expansion state programmatically:

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  state: {
    expanded, // Controlled state
  },
  onExpandedChange: setExpanded,
});

// Expand/collapse specific row
table.getRow('row-id').toggleExpanded();

// Expand all
table.toggleAllRowsExpanded(true);

// Collapse all
table.toggleAllRowsExpanded(false);
```

## Complete Example

```tsx
import {
  DataGrid,
  DataGridContainer,
  DataGridTable,
  DataGridPagination,
  createExpanderColumn,
} from "@repo/ui/components/data-grid";
import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
};

function OrdersTable() {
  const [data, setData] = useState<Order[]>([]);

  const columns = useMemo<ColumnDef<Order>[]>(() => [
    createExpanderColumn<Order>(),
    {
      accessorKey: 'orderNumber',
      header: 'Order #',
    },
    {
      accessorKey: 'customer',
      header: 'Customer',
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => `$${row.original.total.toFixed(2)}`,
      meta: {
        expandedContent: (row) => (
          <div className="p-4">
            <h4 className="font-semibold mb-3">Order Items</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {row.items.map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
    },
  ], []);

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
        <DataGridPagination />
      </DataGridContainer>
    </DataGrid>
  );
}
```

## TypeScript Support

The expanded content function is fully typed:

```tsx
type MyData = { id: string; name: string };

meta: {
  expandedContent: (row: MyData) => ReactNode,
  //                  ^^^^^^^^ Typed to your data
}
```

## Notes

- Only one column needs `expandedContent` - it will span all columns when expanded
- The expand toggle only shows for rows that `getRowCanExpand()` returns true
- Use `getExpandedRowModel()` from TanStack Table for the expansion to work
- Expanded content receives the raw row data, not the Row object





