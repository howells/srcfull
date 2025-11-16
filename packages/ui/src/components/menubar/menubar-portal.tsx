"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return (
    <MenubarPrimitive.Portal
      data-component="menubar-portal"
      data-slot="menubar-portal"
      {...props}
    />
  );
}
