"use client";

import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";

/**
 * Base card item component shared by Radio Card and Checkbox Card.
 * Provides consistent styling and structure for selectable card patterns.
 */
function SelectCardItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-start gap-4 rounded-xl border bg-card p-5 text-card-foreground outline-none transition-[colors,box-shadow,border-color] hover:border-border hover:shadow-md focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=on]:border-primary data-[state=checked]:bg-primary/[0.02] data-[state=on]:bg-primary/[0.02]",
        className
      )}
      data-component="select-card-item"
      data-slot="select-card-item"
      {...props}
    >
      {children}
    </div>
  );
}

function SelectCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 text-left", className)}
      data-component="select-card-content"
      data-slot="select-card-content"
      {...props}
    />
  );
}

function SelectCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-sm leading-tight", className)}
      data-component="select-card-title"
      data-slot="select-card-title"
      {...props}
    />
  );
}

function SelectCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-xs leading-relaxed", className)}
      data-component="select-card-description"
      data-slot="select-card-description"
      {...props}
    />
  );
}

function SelectCardIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-data-[state=checked]:border-primary/20 group-data-[state=on]:border-primary/20 group-data-[state=checked]:bg-primary/10 group-data-[state=on]:bg-primary/10 group-data-[state=checked]:text-primary group-data-[state=on]:text-primary",
        className
      )}
      data-component="select-card-icon"
      data-slot="select-card-icon"
      {...props}
    />
  );
}

export {
  SelectCardItem,
  SelectCardContent,
  SelectCardTitle,
  SelectCardDescription,
  SelectCardIcon,
};
