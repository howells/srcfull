"use client";

import { cn } from "@materia/ui/utils/cn";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-8",
        // Icon styling
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        // Destructive variant
        variant === "destructive" && [
          "text-destructive",
          "focus:bg-destructive/10 focus:text-destructive",
          "dark:focus:bg-destructive/20",
          "[&_svg]:!text-destructive",
        ],
        className
      )}
      data-component="menubar-item"
      data-inset={inset ? "true" : undefined}
      data-slot="menubar-item"
      data-variant={variant}
      {...props}
    />
  );
}
