import type * as React from "react";
import type { ComponentSize } from "../lib/size";

const SIZE_PX: Record<ComponentSize, number> = {
  "2xs": 4,
  xs: 8,
  sm: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
};

function toSize(value?: ComponentSize | number | string): string | undefined {
  if (value === undefined) {
    return;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  if (typeof value === "string") {
    if (value in SIZE_PX) {
      return `${SIZE_PX[value as ComponentSize]}px`;
    }
    return value;
  }
  return;
}

export interface SpaceProps extends React.ComponentProps<"div"> {
  w?: ComponentSize | number | string;
  h?: ComponentSize | number | string;
}

export function Space({ w, h, style, ...props }: SpaceProps) {
  return (
    <div
      data-component="space"
      data-slot="space"
      style={{ width: toSize(w), height: toSize(h), ...style }}
      {...props}
    />
  );
}
