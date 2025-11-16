"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return (
    <MenubarPrimitive.Menu
      data-component="menubar-menu"
      data-slot="menubar-menu"
      {...props}
    />
  );
}
