"use client";

import { cn } from "@materia/ui/utils/cn";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      data-component="menubar-separator"
      data-slot="menubar-separator"
      {...props}
    />
  );
}
