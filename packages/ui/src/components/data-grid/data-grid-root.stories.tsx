import type { Meta, StoryObj } from "@storybook/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "../badge";
import { Button } from "../button";
import { DataGridContainer } from "./data-grid-container";
import { DataGrid } from "./data-grid-root";

const meta = {
  title: "Data Grid",
  component: DataGrid,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/* --------------------------------- Sample Data --------------------------------- */

type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive";
};

const sampleUsers: User[] = [
  {
    id: 1,
    name: "Jane Cooper",
    email: "jane@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: 2,
    name: "Cody Fisher",
    email: "cody@example.com",
    role: "user",
    status: "active",
  },
  {
    id: 3,
    name: "Esther Howard",
    email: "esther@example.com",
    role: "user",
    status: "inactive",
  },
  {
    id: 4,
    name: "Jenny Wilson",
    email: "jenny@example.com",
    role: "guest",
    status: "active",
  },
  {
    id: 5,
    name: "Kristin Watson",
    email: "kristin@example.com",
    role: "user",
    status: "active",
  },
];

const columnHelper = createColumnHelper<User>();

const basicColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => (
      <span className="text-muted-foreground text-sm">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => {
      const role = info.getValue();
      const variant =
        role === "admin"
          ? "default"
          : role === "user"
            ? "secondary"
            : "outline";
      return (
        <Badge className="capitalize" variant={variant}>
          {role}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      return (
        <Badge
          className="capitalize"
          variant={status === "active" ? "default" : "secondary"}
        >
          {status}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <Button size="xs" variant="ghost">
          Edit
        </Button>
        <Button size="xs" variant="ghost">
          Delete
        </Button>
      </div>
    ),
  }),
];

/* --------------------------------- Stories --------------------------------- */

/**
 * Basic DataGrid with user data.
 * Shows the minimal setup needed to render a table.
 */
export const Basic: Story = {
  render: () => {
    const table = useReactTable({
      data: sampleUsers,
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataGrid recordCount={sampleUsers.length} table={table}>
        <DataGridContainer>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="border-border border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-4 py-3 text-left font-medium text-sm"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className="border-border border-b last:border-b-0 hover:bg-muted/50"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-4 py-3" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/**
 * DataGrid without borders for a cleaner look.
 */
export const NoBorder: Story = {
  render: () => {
    const table = useReactTable({
      data: sampleUsers,
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataGrid recordCount={sampleUsers.length} table={table}>
        <DataGridContainer border={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="border-border border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-4 py-3 text-left font-medium text-sm"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className="border-border border-b last:border-b-0 hover:bg-muted/50"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-4 py-3" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/**
 * Compact table with dense spacing.
 */
export const Compact: Story = {
  render: () => {
    const table = useReactTable({
      data: sampleUsers,
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataGrid
        recordCount={sampleUsers.length}
        table={table}
        tableLayout={{ dense: true }}
      >
        <DataGridContainer>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="border-border border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-3 py-2 text-left font-medium text-xs"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className="border-border border-b last:border-b-0 hover:bg-muted/50"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-3 py-2 text-sm" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/**
 * Empty state when no data is available.
 */
export const EmptyState: Story = {
  render: () => {
    const table = useReactTable({
      data: [],
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataGrid emptyMessage="No users found" recordCount={0} table={table}>
        <DataGridContainer>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="border-border border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-4 py-3 text-left font-medium text-sm"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-12 text-center text-muted-foreground"
                      colSpan={basicColumns.length}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      className="border-border border-b last:border-b-0 hover:bg-muted/50"
                      key={row.id}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td className="px-4 py-3" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/**
 * Loading state with skeleton placeholders.
 */
export const Loading: Story = {
  render: () => {
    const table = useReactTable({
      data: sampleUsers,
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    return (
      <DataGrid
        isLoading={true}
        loadingMode="skeleton"
        recordCount={sampleUsers.length}
        table={table}
      >
        <DataGridContainer>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="border-border border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-4 py-3 text-left font-medium text-sm"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {[...Array(3)].map((_, i) => (
                  <tr className="border-border border-b" key={i}>
                    {basicColumns.map((_, j) => (
                      <td className="px-4 py-3" key={j}>
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/**
 * Clickable rows that respond to user interaction.
 */
export const ClickableRows: Story = {
  render: () => {
    const table = useReactTable({
      data: sampleUsers,
      columns: basicColumns,
      getCoreRowModel: getCoreRowModel(),
    });

    const handleRowClick = (user: User) => {
      alert(`Clicked on ${user.name}`);
    };

    return (
      <DataGrid
        onRowClick={handleRowClick}
        recordCount={sampleUsers.length}
        table={table}
      >
        <DataGridContainer>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr className="border-border border-b" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-4 py-3 text-left font-medium text-sm"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className="cursor-pointer border-border border-b last:border-b-0 hover:bg-muted/50"
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-4 py-3" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataGridContainer>
      </DataGrid>
    );
  },
};
