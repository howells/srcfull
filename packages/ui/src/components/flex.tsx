import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";
import { forwardRef } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl";
type Responsive<T> = T | Partial<Record<Breakpoint, T>> & { base?: T };

type Direction = "row" | "column" | "row-reverse" | "column-reverse";
type Justify =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around"
  | "space-evenly";
type Align = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
type Wrap = "wrap" | "nowrap" | "wrap-reverse";

type SpacingToken = "xs" | "sm" | "md" | "lg" | "xl";
type Spacing = SpacingToken | number | string;

export interface FlexProps extends React.ComponentProps<"div"> {
  direction?: Responsive<Direction>;
  justify?: Responsive<Justify>;
  align?: Responsive<Align>;
  wrap?: Responsive<Wrap>;
  gap?: Responsive<Spacing>;
  rowGap?: Responsive<Spacing>;
  columnGap?: Responsive<Spacing>;
  inline?: boolean;
}

const PREFIX_BY_BREAKPOINT: Record<Breakpoint, string> = {
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
};

const DIRECTION_CLASS: Record<Direction, string> = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const JUSTIFY_CLASS: Record<Justify, string> = {
  "flex-start": "justify-start",
  center: "justify-center",
  "flex-end": "justify-end",
  "space-between": "justify-between",
  "space-around": "justify-around",
  "space-evenly": "justify-evenly",
};

const ALIGN_CLASS: Record<Align, string> = {
  stretch: "items-stretch",
  "flex-start": "items-start",
  center: "items-center",
  "flex-end": "items-end",
  baseline: "items-baseline",
};

const WRAP_CLASS: Record<Wrap, string> = {
  wrap: "flex-wrap",
  nowrap: "flex-nowrap",
  "wrap-reverse": "flex-wrap-reverse",
};

// Tailwind v4 spacing mapping for convenience
const GAP_TOKEN_TO_NUM: Record<SpacingToken, string> = {
  xs: "2",
  sm: "3",
  md: "4",
  lg: "5",
  xl: "6",
};

function isResponsive<T>(v: Responsive<T> | undefined): v is Responsive<T> {
  return !!v && (typeof v === "object");
}

function pushResponsiveClass<T>(
  classes: string[],
  value: Responsive<T> | undefined,
  mapper: (v: T) => string | null,
) {
  if (!value) return;
  if (!isResponsive<T>(value)) {
    const cls = mapper(value as T);
    if (cls) classes.push(cls);
    return;
  }
  const base = (value as { base?: T }).base;
  if (base !== undefined) {
    const cls = mapper(base);
    if (cls) classes.push(cls);
  }
  (["sm", "md", "lg", "xl"] as Breakpoint[]).forEach((bp) => {
    const typed = value as Partial<Record<Breakpoint, T>>;
    if (typed[bp] !== undefined) {
      const cls = mapper(typed[bp] as T);
      if (cls) classes.push(`${PREFIX_BY_BREAKPOINT[bp]}${cls}`);
    }
  });
}

function spacingToClass(prefix: "gap" | "gap-x" | "gap-y", v: Spacing): string | null {
  if (typeof v === "number") return ""; // handled via inline style
  if (typeof v === "string") {
    const token = GAP_TOKEN_TO_NUM[v as SpacingToken];
    if (token) return `${prefix}-${token}`;
    // If user passed a raw tailwind token like "1.5" they can also pass classname via className
    return ""; // fall back to inline style
  }
  return null;
}

function mergeSpacingStyle(
  style: React.CSSProperties | undefined,
  key: "gap" | "rowGap" | "columnGap",
  value: Responsive<Spacing> | undefined,
): React.CSSProperties | undefined {
  if (!value) return style;
  // Only apply inline style for non-token numbers/strings on base (no responsive inline here)
  if (typeof value === "number" || typeof value === "string") {
    const next: React.CSSProperties = { ...(style ?? {}) };
    (next as Record<string, unknown>)[key] = value;
    return next;
  }
  const base = (value as { base?: Spacing }).base;
  if (typeof base === "number" || typeof base === "string") {
    const next: React.CSSProperties = { ...(style ?? {}) };
    (next as Record<string, unknown>)[key] = base;
    return next;
  }
  return style;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    className,
    direction = "row",
    justify = "flex-start",
    align = "stretch",
    wrap = "nowrap",
    gap,
    rowGap,
    columnGap,
    inline = false,
    style,
    ...props
  },
  ref,
) {
  const classes: string[] = [inline ? "inline-flex" : "flex"];

  pushResponsiveClass(classes, direction, (v) => DIRECTION_CLASS[v]);
  pushResponsiveClass(classes, justify, (v) => JUSTIFY_CLASS[v]);
  pushResponsiveClass(classes, align, (v) => ALIGN_CLASS[v]);
  pushResponsiveClass(classes, wrap, (v) => WRAP_CLASS[v]);
  pushResponsiveClass(classes, gap, (v) => spacingToClass("gap", v));
  pushResponsiveClass(classes, rowGap, (v) => spacingToClass("gap-y", v));
  pushResponsiveClass(classes, columnGap, (v) => spacingToClass("gap-x", v));

  const mergedStyle = mergeSpacingStyle(
    mergeSpacingStyle(mergeSpacingStyle(style, "gap", gap), "rowGap", rowGap),
    "columnGap",
    columnGap,
  );

  return (
    <div
      ref={ref}
      className={cn(classes.join(" "), className)}
      data-component="flex"
      data-slot="flex"
      style={mergedStyle}
      {...props}
    />
  );
});
