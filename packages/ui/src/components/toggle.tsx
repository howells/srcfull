"use client";

import { Root } from "@radix-ui/react-toggle";
import { cn } from "@repo/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { Children } from "react";
import type { ComponentSize } from "../lib/size";
import { Icon } from "./icon";

const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-normal text-sm opacity-75 outline-none transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:opacity-100 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        "2xs": "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        xs: "h-7 gap-1.5 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        base: "h-9 gap-2 px-3.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        default:
          "h-9 gap-2 px-3.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-10 gap-2 px-4 text-base [&_svg:not([class*='size-'])]:size-4",
        xl: "h-11 gap-2 px-5 text-base [&_svg:not([class*='size-'])]:size-5",
        "2xl": "h-12 gap-2.5 px-6 text-lg [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      // Icon-only variants (when no children)
      { size: "2xs", class: "data-[icon-only]:size-6 data-[icon-only]:p-0" },
      { size: "xs", class: "data-[icon-only]:size-7 data-[icon-only]:p-0" },
      { size: "sm", class: "data-[icon-only]:size-8 data-[icon-only]:p-0" },
      {
        size: ["base", "default"],
        class: "data-[icon-only]:size-9 data-[icon-only]:p-0",
      },
      { size: "lg", class: "data-[icon-only]:size-10 data-[icon-only]:p-0" },
      { size: "xl", class: "data-[icon-only]:size-11 data-[icon-only]:p-0" },
      { size: "2xl", class: "data-[icon-only]:size-12 data-[icon-only]:p-0" },
    ],
    defaultVariants: {
      variant: "outline",
      size: "sm",
    },
  }
);

// Map toggle sizes to icon sizes (icons one step smaller for labeled toggles)
const LABELED_ICON_SIZE_MAP: Record<string, ComponentSize> = {
  "2xs": "2xs",
  xs: "2xs",
  sm: "xs",
  base: "sm",
  default: "sm",
  lg: "base",
  xl: "lg",
  "2xl": "xl",
};

function Toggle({
  className,
  variant,
  size,
  icon,
  iconPlacement = "start",
  children,
  ...props
}: React.ComponentProps<typeof Root> &
  VariantProps<typeof toggleVariants> & {
    icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconPlacement?: "start" | "end";
  }) {
  const hasChildren = Children.count(children) > 0;
  const isIconOnly = icon && !hasChildren;

  // Always use labeled icon size (one step smaller) for better visual balance
  const resolvedSize = size ?? "sm";
  const iconSize: ComponentSize = LABELED_ICON_SIZE_MAP[resolvedSize] ?? "xs";

  const renderContent = () => {
    const iconElement = icon ? <Icon icon={icon} size={iconSize} /> : null;

    // Icon-only toggle
    if (isIconOnly) {
      return iconElement;
    }

    // Labeled toggle with icon
    if (icon && hasChildren) {
      if (iconPlacement === "start") {
        return (
          <>
            {iconElement}
            {children}
          </>
        );
      }
      return (
        <>
          {children}
          {iconElement}
        </>
      );
    }

    return children;
  };

  return (
    <Root
      className={cn(toggleVariants({ variant, size, className }))}
      data-component="toggle"
      data-icon-only={isIconOnly ? "true" : undefined}
      data-slot="toggle"
      {...props}
    >
      {renderContent()}
    </Root>
  );
}

export { Toggle, toggleVariants };
