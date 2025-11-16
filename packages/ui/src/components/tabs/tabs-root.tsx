"use client";

import { cn } from "@materia/ui/utils/cn";
import type { ComponentSize } from "@materia/ui/lib/size";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { TabsContext } from "./tabs-context";

export function Tabs({
  className,
  variant = "default",
  size = "base",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & {
  variant?: "default" | "underline" | "pill" | "button" | "line";
  size?: ComponentSize;
}) {
  return (
    <TabsContext.Provider value={{ variant, size }}>
      <TabsPrimitive.Root
        className={cn("flex flex-col gap-2", className)}
        data-component="tabs"
        data-slot="tabs"
        {...props}
      />
    </TabsContext.Provider>
  );
}
