"use client";

import { cn } from "@materia/ui/utils/cn";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      className={cn(
        "px-2 py-1.5 font-semibold text-foreground text-sm",
        "data-[inset]:pl-8",
        className
      )}
      data-component="menubar-label"
      data-inset={inset ? "true" : undefined}
      data-slot="menubar-label"
      {...props}
    />
  );
}
