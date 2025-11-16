import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";
import type { ComponentSize } from "../lib/size";

type Align = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
type Justify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
type Direction = "row" | "col";

type StackGapSize = ComponentSize | "3xs";

const GAP_CLASS_BY_SIZE: Record<StackGapSize, string> = {
  "3xs": "gap-0.5", // 2px
  "2xs": "gap-1", // 4px
  xs: "gap-2", // 8px
  sm: "gap-3", // 12px
  base: "gap-4", // 16px
  lg: "gap-5", // 20px
  xl: "gap-6", // 24px
  "2xl": "gap-8", // 32px
};

// Gap is spelled out strictly via the shared ComponentSize scale.

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

export interface StackProps extends React.ComponentProps<"div"> {
  gap?: StackGapSize;
  align?: Align;
  justify?: Justify;
  direction?: Direction;
}

export function Stack({
  className,
  gap = "base",
  align = "stretch",
  justify = "flex-start",
  direction = "col",
  style,
  ...props
}: StackProps) {
  const gapClass = GAP_CLASS_BY_SIZE[gap] ?? GAP_CLASS_BY_SIZE.base;
  const alignClass = ALIGN_CLASS[align] ?? ALIGN_CLASS.stretch;
  const justifyClass = JUSTIFY_CLASS[justify] ?? JUSTIFY_CLASS["flex-start"];
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  return (
    <div
      className={cn(
        "flex",
        directionClass,
        alignClass,
        justifyClass,
        gapClass,
        className
      )}
      data-component="stack"
      data-slot="stack"
      style={style}
      {...props}
    />
  );
}

export function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="row" {...props} />;
}

export function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="col" {...props} />;
}
