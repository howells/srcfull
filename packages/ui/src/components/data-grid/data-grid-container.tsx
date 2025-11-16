import { cn } from "@repo/ui/utils/cn";
import type { ReactNode } from "react";

export interface DataGridContainerProps {
  children: ReactNode;
  className?: string;
  border?: boolean;
}

/**
 * Container wrapper for DataGrid table.
 * Provides consistent border and layout styling.
 *
 * @example
 * ```tsx
 * <DataGridContainer border>
 *   <DataGridTable />
 * </DataGridContainer>
 * ```
 */
export function DataGridContainer({
  children,
  className,
  border = true,
}: DataGridContainerProps) {
  return (
    <div
      className={cn(
        "grid w-full",
        border && "rounded-lg border border-border",
        className
      )}
      data-component="data-grid"
      data-slot="data-grid"
    >
      {children}
    </div>
  );
}
