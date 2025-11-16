import { cn } from "@materia/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const headingVariants = cva("font-semibold", {
  variants: {
    size: {
      "2xl": "text-5xl",
      xl: "text-4xl",
      lg: "text-3xl",
      base: "text-2xl",
      sm: "text-xl",
      xs: "text-lg",
    },
  },
  defaultVariants: {
    size: "2xl",
  },
});

type HeadingLevel = "1" | "2" | "3" | "4" | "5" | "6";

// Map heading levels to default sizes
const LEVEL_SIZE_MAP: Record<HeadingLevel, VariantProps<typeof headingVariants>["size"]> = {
  "1": "2xl",
  "2": "xl",
  "3": "lg",
  "4": "base",
  "5": "sm",
  "6": "xs",
};

type HeadingProps = Omit<React.ComponentProps<"h1">, "size"> &
  VariantProps<typeof headingVariants> & {
    level?: HeadingLevel;
  };

function Heading({
  level = "1",
  size,
  className,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  // Default size to match level if not specified
  const effectiveSize = size ?? LEVEL_SIZE_MAP[level];

  return (
    <Tag
      className={cn(headingVariants({ size: effectiveSize }), className)}
      data-component="heading"
      data-level={level}
      {...props}
    />
  );
}

export { Heading, headingVariants };
