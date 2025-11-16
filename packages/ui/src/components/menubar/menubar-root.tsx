"use client";

import { cn } from "@materia/ui/utils/cn";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarRoot({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border border-border bg-background p-1 shadow-sm",
        className
      )}
      data-component="menubar"
      data-slot="menubar"
      {...props}
    />
  );
}

export { MenubarRoot as Menubar };
