import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";
import type { ComponentSize } from "../lib/size";

type Justify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type Align = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";

const ALIGN_CLASS: Record<Align, string> = {
  stretch: "items-stretch",
  "flex-start": "items-start",
  "flex-end": "items-end",
  center: "items-center",
  baseline: "items-baseline",
};

const JUSTIFY_CLASS: Record<Justify, string> = {
  "flex-start": "justify-start",
  "flex-end": "justify-end",
  center: "justify-center",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

// Gap is spelled out strictly via the shared ComponentSize scale.
const GAP_CLASS_BY_SIZE: Record<ComponentSize, string> = {
  "2xs": "gap-1", // 4px
  xs: "gap-2", // 8px
  sm: "gap-3", // 12px
  base: "gap-4", // 16px
  lg: "gap-5", // 20px
  xl: "gap-6", // 24px
  "2xl": "gap-8", // 32px
};

const GAP_X_CLASS_BY_SIZE: Record<ComponentSize, string> = {
  "2xs": "gap-x-1", // 4px
  xs: "gap-x-2", // 8px
  sm: "gap-x-3", // 12px
  base: "gap-x-4", // 16px
  lg: "gap-x-5", // 20px
  xl: "gap-x-6", // 24px
  "2xl": "gap-x-8", // 32px
};

const GAP_Y_CLASS_BY_SIZE: Record<ComponentSize, string> = {
  "2xs": "gap-y-1", // 4px
  xs: "gap-y-2", // 8px
  sm: "gap-y-3", // 12px
  base: "gap-y-4", // 16px
  lg: "gap-y-5", // 20px
  xl: "gap-y-6", // 24px
  "2xl": "gap-y-8", // 32px
};

// Common grid column counts that have Tailwind classes
const GRID_COLS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
  13: "grid-cols-13",
};

// Column span classes for GridCol
const COL_SPAN_CLASS: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  13: "col-span-13",
};

// Column start classes for GridCol offsets
const COL_START_CLASS: Record<number, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
  13: "col-start-13",
  14: "col-start-14",
};

export interface GridProps extends React.ComponentProps<"div"> {
  /** Total columns in the layout. Defaults to 12. */
  columns?: number;
  /** Gap between items (applies to both rows and columns). Defaults to base (16px). */
  gap?: ComponentSize;
  /** Horizontal gap between items (overrides gap on the inline axis). */
  xGap?: ComponentSize;
  /** Vertical gap between items (overrides gap on the block axis). */
  yGap?: ComponentSize;
  /** When true, columns grow equally to fill available space. */
  grow?: boolean;
  /** Align items on the block axis. */
  align?: Align;
  /** Justify items on the inline axis. */
  justify?: Justify;
}

function getGridClasses({
  columns = 12,
  gap = "base",
  xGap,
  yGap,
  grow = false,
  align = "stretch",
  justify = "flex-start",
}: Pick<
  GridProps,
  "columns" | "gap" | "xGap" | "yGap" | "grow" | "align" | "justify"
>): string[] {
  const gridClasses: string[] = ["grid"];

  // Handle columns
  if (grow) {
    gridClasses.push("grid-cols-[repeat(auto-fit,minmax(0,1fr))]");
  } else {
    const colsClass = GRID_COLS_CLASS[columns];
    gridClasses.push(
      colsClass ?? `grid-cols-[repeat(${columns},minmax(0,1fr))]`
    );
  }

  // Handle gaps
  if (xGap || yGap) {
    const xGapSize = xGap ?? gap;
    const yGapSize = yGap ?? gap;
    gridClasses.push(GAP_X_CLASS_BY_SIZE[xGapSize]);
    gridClasses.push(GAP_Y_CLASS_BY_SIZE[yGapSize]);
  } else {
    gridClasses.push(GAP_CLASS_BY_SIZE[gap]);
  }

  // Add alignment classes
  gridClasses.push(ALIGN_CLASS[align], JUSTIFY_CLASS[justify]);

  return gridClasses;
}

export function Grid({
  className,
  children,
  columns = 12,
  gap = "base",
  xGap,
  yGap,
  grow = false,
  align = "stretch",
  justify = "flex-start",
  ...props
}: GridProps) {
  const gridClasses = getGridClasses({
    columns,
    gap,
    xGap,
    yGap,
    grow,
    align,
    justify,
  });

  return (
    <div
      className={cn(gridClasses, className)}
      data-component="grid"
      data-slot="grid"
      {...props}
    >
      {children}
    </div>
  );
}

export interface GridColProps extends React.ComponentProps<"div"> {
  /** Number of columns this item spans (1..columns). */
  span?: number | "auto" | "content";
  /** Number of columns to offset from the start. */
  offset?: number;
  /** CSS order value. */
  order?: number;
}

export function GridCol({
  className,
  span = 1,
  offset = 0,
  order,
  style,
  ...props
}: GridColProps) {
  const gridClasses: string[] = [];

  // Handle span
  if (typeof span === "number") {
    const spanClass = COL_SPAN_CLASS[span];
    gridClasses.push(spanClass ?? `col-span-[${span}]`);
  } else if (span === "auto") {
    gridClasses.push("col-auto");
  } else if (span === "content") {
    gridClasses.push("col-span-full", "w-max");
  }

  // Handle offset
  if (offset > 0) {
    const startPosition = offset + 1;
    const startClass = COL_START_CLASS[startPosition];
    gridClasses.push(startClass ?? `col-start-[${startPosition}]`);
  }

  // Handle order
  if (order !== undefined) {
    gridClasses.push(`order-[${order}]`);
  }

  return (
    <div
      className={cn(gridClasses, className)}
      data-component="grid-col"
      data-slot="grid-col"
      style={style}
      {...props}
    />
  );
}
