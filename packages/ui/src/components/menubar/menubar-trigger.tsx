"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";

export function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 font-medium text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      data-component="menubar-trigger"
      data-slot="menubar-trigger"
      {...props}
    />
  );
}
