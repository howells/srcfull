"use client";

import * as MenubarPrimitive from "@radix-ui/react-menubar";
import type * as React from "react";

export function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return (
    <MenubarPrimitive.Group
      data-component="menubar-group"
      data-slot="menubar-group"
      {...props}
    />
  );
}

export function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup
      data-component="menubar-radio-group"
      data-slot="menubar-radio-group"
      {...props}
    />
  );
}
