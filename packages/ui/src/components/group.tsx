import { cn } from "@materia/ui/utils/cn";
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

export interface GroupProps extends React.ComponentProps<"div"> {
  position?: Justify;
  align?: Align;
  gap?: ComponentSize | number | string;
  wrap?: boolean;
}

export function Group({
  className,
  position = "flex-start",
  align = "center",
  gap = "base",
  wrap = false,
  style,
  ...props
}: GroupProps) {
  return (
    <div
      className={cn(className)}
      data-component="group"
      data-slot="group"
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: position,
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: toGap(gap),
        ...style,
      }}
      {...props}
    />
  );
}
