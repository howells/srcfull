"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils/cn";
import type { Row } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export interface DataGridExpandToggleProps<TData> {
  row: Row<TData>;
  className?: string;
  expandedIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  collapsedIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/**
 * Toggle button for expanding/collapsing rows in a DataGrid.
 * Automatically shows/hides based on whether the row can be expanded.
 *
 * @example
 * ```tsx
 * {
 *   id: 'expander',
 *   header: () => null,
 *   cell: ({ row }) => <DataGridExpandToggle row={row} />,
 *   size: 48,
 * }
 * ```
 */
export function DataGridExpandToggle<TData>({
  row,
  className,
  expandedIcon: ExpandedIcon = ChevronDownIcon,
  collapsedIcon: CollapsedIcon = ChevronRightIcon,
}: DataGridExpandToggleProps<TData>) {
  if (!row.getCanExpand()) {
    return null;
  }

  const isExpanded = row.getIsExpanded();

  return (
    <Button
      aria-label={isExpanded ? "Collapse row" : "Expand row"}
      className={cn("transition-transform", className)}
      icon={isExpanded ? ExpandedIcon : CollapsedIcon}
      mode="icon"
      onClick={row.getToggleExpandedHandler()}
      size="sm"
      variant="ghost"
    />
  );
}

/**
 * Helper to create a standard expander column definition.
 * Place this as the first column in your columns array.
 *
 * @example
 * ```tsx
 * const columns = useMemo<ColumnDef<MyData>[]>(() => [
 *   createExpanderColumn(),
 *   { accessorKey: 'name', header: 'Name' },
 *   // ... other columns
 * ], []);
 * ```
 */
export function createExpanderColumn<TData>() {
  return {
    id: "expander",
    header: () => null,
    cell: ({ row }: { row: Row<TData> }) => <DataGridExpandToggle row={row} />,
    size: 48,
    enableSorting: false,
    enableHiding: false,
    meta: {
      headerClassName: "w-12",
      cellClassName: "w-12",
    },
  };
}
