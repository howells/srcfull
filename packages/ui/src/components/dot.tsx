import { cn } from "@materia/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const dotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    size: {
      "2xs": "size-1",
      xs: "size-1.5",
      sm: "size-2",
      base: "size-2.5",
      lg: "size-3",
      xl: "size-3.5",
      "2xl": "size-4",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export interface DotProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof dotVariants> {
  /**
   * Color of the dot. Can be any valid CSS color value.
   */
  color?: string;
}

/**
 * Dot component for indicating status, color, or presence.
 *
 * @example
 * ```tsx
 * <Dot color="hsl(200, 80%, 85%)" size="sm" />
 * ```
 */
export function Dot({ className, size, color, style, ...props }: DotProps) {
  return (
    <span
      className={cn(dotVariants({ size }), className)}
      style={{ backgroundColor: color, ...style }}
      data-component="dot"
      {...props}
    />
  );
}
