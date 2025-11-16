import { cn } from "@materia/ui/utils/cn";
import * as React from "react";
import type { ComponentSize } from "../lib/size";

type Strategy = "block" | "grid";

const TAILWIND_MAX_WIDTH: Record<ComponentSize, string> = {
  "2xs": "max-w-xs", // 320px
  xs: "max-w-sm", // 384px
  sm: "max-w-md", // 480px
  base: "max-w-lg", // 640px
  lg: "max-w-xl", // 768px
  xl: "max-w-2xl", // 1024px
  "2xl": "max-w-4xl", // 1280px
};

const TAILWIND_PADDING_X: Record<ComponentSize, string> = {
  "2xs": "px-1",
  xs: "px-2",
  sm: "px-3",
  base: "px-4",
  lg: "px-6",
  xl: "px-8",
  "2xl": "px-12",
};

const TAILWIND_PADDING_Y: Record<ComponentSize, string> = {
  "2xs": "py-1",
  xs: "py-2",
  sm: "py-3",
  base: "py-4",
  lg: "py-6",
  xl: "py-8",
  "2xl": "py-12",
};

function getMaxWidthClass(
  size: ComponentSize | number | string | undefined,
  fluid: boolean
): string {
  if (fluid) return "w-full";
  if (!size) return TAILWIND_MAX_WIDTH.xl;
  if (typeof size === "string" && size in TAILWIND_MAX_WIDTH) {
    return TAILWIND_MAX_WIDTH[size as ComponentSize];
  }
  if (typeof size === "number") return `max-w-[${size}px]`;
  if (typeof size === "string") return `max-w-[${size}]`;
  return TAILWIND_MAX_WIDTH.xl;
}

function getPaddingClass(
  value: ComponentSize | number | string | undefined,
  axis: "x" | "y"
): string | undefined {
  if (!value) return;
  const map = axis === "x" ? TAILWIND_PADDING_X : TAILWIND_PADDING_Y;
  if (typeof value === "string" && value in map) {
    return map[value as ComponentSize];
  }
  if (typeof value === "number") {
    return axis === "x" ? `px-[${value}px]` : `py-[${value}px]`;
  }
  if (typeof value === "string") {
    return axis === "x" ? `px-[${value}]` : `py-[${value}]`;
  }
  return;
}

export interface ContainerProps extends React.ComponentProps<"div"> {
  /** Max width: number (px), CSS length or ComponentSize token. */
  size?: ComponentSize | number | string;
  /** When true, container is full width (ignores size). */
  fluid?: boolean;
  /** Layout strategy. */
  strategy?: Strategy;
  /** Horizontal padding. */
  px?: ComponentSize | number | string;
  /** Vertical padding. */
  py?: ComponentSize | number | string;
}

export function Container({
  className,
  children,
  size = "xl",
  fluid = false,
  strategy = "block",
  px,
  py,
  ...props
}: ContainerProps) {
  const maxWidthClass = getMaxWidthClass(size, fluid);
  const paddingXClass = getPaddingClass(px, "x");
  const paddingYClass = getPaddingClass(py, "y");

  if (strategy === "grid") {
    // Grid strategy: center content column; allow breakouts via data attributes
    const gridColumns = fluid
      ? "1fr"
      : `1fr minmax(0, var(--container-size, ${maxWidthClass.replace("max-w-", "")})) 1fr`;

    // Wrap children to ensure non-breakout items land in the middle column
    const wrapped = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const isBreakout = (child.props as Record<string, unknown>)?.[
        "data-breakout"
      ];
      if (isBreakout) return child; // consumer controls its own columns
      return (
        <div className={cn("col-start-2", paddingXClass, paddingYClass)}>
          {child}
        </div>
      );
    });

    return (
      <div
        className={cn("grid", className)}
        data-component="container"
        data-slot="container"
        data-strategy="grid"
        style={{
          gridTemplateColumns: gridColumns,
        }}
        {...props}
      >
        {wrapped}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto",
        maxWidthClass,
        paddingXClass,
        paddingYClass,
        className
      )}
      data-component="container"
      data-slot="container"
      data-strategy="block"
      {...props}
    >
      {children}
    </div>
  );
}
