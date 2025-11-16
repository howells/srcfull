"use client";

import { cn } from "@repo/ui/utils/cn";
import { focusRing } from "@repo/ui/utils/focus-ring";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import React, { createContext, useContext } from "react";

type SwatchSize = "sm" | "md" | "lg";

const sizeMap: Record<SwatchSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

type SwatchGroupContextValue = {
  size: SwatchSize;
};

const SwatchGroupContext = createContext<SwatchGroupContextValue>({ size: "md" });

type SwatchGroupProps = React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  size?: SwatchSize;
};

function SwatchGroup({ className, size = "md", ...props }: SwatchGroupProps) {
  return (
    <SwatchGroupContext.Provider value={{ size }}>
      <RadioGroupPrimitive.Root
        className={cn("flex items-center gap-3", className)}
        data-component="swatch-group"
        data-slot="swatch-group"
        {...props}
      />
    </SwatchGroupContext.Provider>
  );
}

type SwatchProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Item>,
  "children"
> & {
  /**
   * Optional background color for the swatch (e.g., "#1f2937" or "rgb(...)" or any CSS color).
   * If provided along with children, children will render on top.
   */
  color?: string;
  /**
   * Accessible label for screen readers. If omitted, ensure the swatch is
   * labelled by context or with aria-labelledby.
   */
  "aria-label"?: string;
  /**
   * Custom node rendered inside the circular swatch. Useful for images.
   * Example: pass a Next.js <Image fill /> from the app.
   */
  children?: React.ReactNode;
  /**
   * Override size for this specific swatch. Defaults to group size.
   */
  size?: SwatchSize;
};

function Swatch({ className, color, children, size: sizeOverride, ...props }: SwatchProps) {
  const { size } = useContext(SwatchGroupContext);
  const resolvedSize = sizeOverride ?? size;

  return (
    <RadioGroupPrimitive.Item
      className={cn(
        // Layout & shape
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-border overflow-hidden",
        sizeMap[resolvedSize],
        // Focus styles
        focusRing,
        // Hover/active hints
        "bg-background transition-shadow hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
        // Selection rings (double ring using before/after)
        "before:content-[''] before:absolute before:inset-[-2px] before:rounded-full before:border before:border-background before:opacity-0 data-[state=checked]:before:opacity-100",
        "after:content-[''] after:absolute after:inset-[-5px] after:rounded-full after:border after:border-muted/60 after:opacity-0 data-[state=checked]:after:opacity-100",
        className
      )}
      data-component="swatch"
      data-slot="swatch"
      {...props}
    >
      {/* Color background */}
      <span
        className="absolute inset-0 rounded-full"
        style={color ? { backgroundColor: color } : undefined}
        aria-hidden
      />

      {/* Content layer (e.g., an Image component). Parent is relative and sized. */}
      {children ? (
        <span className="absolute inset-0 rounded-full overflow-hidden" aria-hidden>
          {children}
        </span>
      ) : null}
    </RadioGroupPrimitive.Item>
  );
}

export { SwatchGroup, Swatch };
