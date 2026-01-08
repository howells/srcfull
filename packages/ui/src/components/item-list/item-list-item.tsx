import { Slot } from "@radix-ui/react-slot";
import {
  IconContainer,
  type IconContainerProps,
} from "@repo/ui/components/icon-container";
import { Separator } from "@repo/ui/components/separator";
import { cn } from "@repo/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

/**
 * Item variants adapt based on their parent ItemList:
 * - In "divided" lists: minimal styling, relies on dividers
 * - In "separated" lists: full card styling with elevation
 * - In "grouped" lists: borders between items, part of parent card
 */
const itemVariants = cva(
  "group/item flex flex-wrap items-center text-sm outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [a]:transition-colors [a]:hover:bg-accent/50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      // Divided list: minimal styling
      {
        className:
          "group-data-[variant=divided]/item-list:rounded-none group-data-[variant=divided]/item-list:border-0 group-data-[variant=divided]/item-list:bg-transparent",
      },
      // Separated list: full card styling without elevation
      {
        variant: "default",
        className:
          "group-data-[variant=separated]/item-list:rounded-xl group-data-[variant=separated]/item-list:border group-data-[variant=separated]/item-list:border-border group-data-[variant=separated]/item-list:bg-card",
      },
      {
        variant: "outline",
        className:
          "group-data-[variant=separated]/item-list:rounded-xl group-data-[variant=separated]/item-list:bg-card",
      },
      {
        variant: "muted",
        className:
          "group-data-[variant=separated]/item-list:rounded-xl group-data-[variant=separated]/item-list:border group-data-[variant=separated]/item-list:border-border group-data-[variant=separated]/item-list:bg-card",
      },
      // Grouped list: borders between, no outer border (parent provides card frame)
      {
        className:
          "group-data-[variant=grouped]/item-list:rounded-none group-data-[variant=grouped]/item-list:border-0 group-data-[variant=grouped]/item-list:border-border group-data-[variant=grouped]/item-list:border-b group-data-[variant=grouped]/item-list:bg-transparent group-data-[variant=grouped]/item-list:last:border-b-0",
      },
    ],
  }
);

export interface ItemProps
  extends React.ComponentProps<"li">,
    VariantProps<typeof itemVariants> {
  asChild?: boolean;
}

/**
 * Item represents a single entry in an ItemList.
 * It automatically adapts its styling based on the parent ItemList variant.
 */
export function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ItemProps) {
  const Comp = asChild ? Slot : "li";
  return (
    <Comp
      className={cn(itemVariants({ variant, size, className }))}
      data-component="item"
      data-size={size}
      data-slot="item"
      data-variant={variant}
      {...props}
    />
  );
}

/* --------------------------------- ItemSeparator --------------------------------- */

export function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("my-0", className)}
      data-component="item-separator"
      data-slot="item-separator"
      orientation="horizontal"
      {...props}
    />
  );
}

/* --------------------------------- ItemMedia --------------------------------- */

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start",
  {
    variants: {
      variant: {
        default: "",
        icon: "",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ItemMediaProps
  extends Omit<React.ComponentProps<"div">, keyof IconContainerProps>,
    Omit<Partial<IconContainerProps>, "variant">,
    VariantProps<typeof itemMediaVariants> {}

export function ItemMedia({
  className,
  variant = "default",
  icon,
  size,
  iconSize = "xs",
  iconClassName,
  ...props
}: ItemMediaProps) {
  // If variant is "icon" and an icon is provided, use IconContainer
  if (variant === "icon" && icon) {
    return (
      <IconContainer
        className={cn(
          "group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start",
          className
        )}
        data-component="item-media"
        data-slot="item-media"
        data-variant={variant}
        icon={icon}
        iconClassName={iconClassName}
        iconSize={iconSize}
        size="sm"
        variant="default"
      />
    );
  }

  // Otherwise render as a regular div (for image variant or custom children)
  return (
    <div
      className={cn(itemMediaVariants({ variant, className }))}
      data-component="item-media"
      data-slot="item-media"
      data-variant={variant}
      {...props}
    />
  );
}

/* --------------------------------- ItemContent --------------------------------- */

export function ItemContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      data-component="item-content"
      data-slot="item-content"
      {...props}
    />
  );
}

/* --------------------------------- ItemTitle --------------------------------- */

export function ItemTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 font-medium text-sm leading-snug",
        className
      )}
      data-component="item-title"
      data-slot="item-title"
      {...props}
    />
  );
}

/* --------------------------------- ItemDescription --------------------------------- */

export function ItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "line-clamp-2 text-balance font-normal text-muted-foreground text-sm leading-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-component="item-description"
      data-slot="item-description"
      {...props}
    />
  );
}

/* --------------------------------- ItemActions --------------------------------- */

export function ItemActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-component="item-actions"
      data-slot="item-actions"
      {...props}
    />
  );
}

/* --------------------------------- ItemHeader --------------------------------- */

export function ItemHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      data-component="item-header"
      data-slot="item-header"
      {...props}
    />
  );
}

/* --------------------------------- ItemFooter --------------------------------- */

export function ItemFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      data-component="item-footer"
      data-slot="item-footer"
      {...props}
    />
  );
}
