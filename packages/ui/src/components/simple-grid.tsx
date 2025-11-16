import { cn } from "@materia/ui/utils/cn";
import type * as React from "react";
import type { ComponentSize } from "../lib/size";

const GAP_PX: Record<ComponentSize, number> = {
  "2xs": 4,
  xs: 8,
  sm: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
};

function toGap(value?: ComponentSize | number | string): string | undefined {
  if (value === undefined) return;
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string") {
    if (value in GAP_PX) return `${GAP_PX[value as ComponentSize]}px`;
    return value;
  }
  return;
}

export interface SimpleGridProps extends React.ComponentProps<"div"> {
  /** Number of equal columns */
  cols?: number;
  /** Gap between items */
  spacing?: ComponentSize | number | string;
}

export function SimpleGrid({
  className,
  cols = 3,
  spacing = "base",
  style,
  ...props
}: SimpleGridProps) {
  return (
    <div
      className={cn(className)}
      data-component="simple-grid"
      data-slot="simple-grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: toGap(spacing),
        ...style,
      }}
      {...props}
    />
  );
}
