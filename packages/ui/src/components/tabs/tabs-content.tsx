"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@repo/ui/utils/cn";

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("flex-1 outline-none", className)}
      data-component="tabs-content"
      data-slot="tabs-content"
      {...props}
    />
  );
}
