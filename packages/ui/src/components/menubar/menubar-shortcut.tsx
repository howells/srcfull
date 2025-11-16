"use client";

import { cn } from "@materia/ui/utils/cn";
import type * as React from "react";

export function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest",
        className
      )}
      data-component="menubar-shortcut"
      data-slot="menubar-shortcut"
      {...props}
    />
  );
}
