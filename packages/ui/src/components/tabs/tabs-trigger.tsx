"use client";

import { cn } from "@materia/ui/utils/cn";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { VariantProps } from "class-variance-authority";
import { useTabsContext } from "./tabs-context";
import { tabsTriggerVariants } from "./tabs-variants";

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  const { variant, size } = useTabsContext();
  return (
    <TabsPrimitive.Trigger
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      data-component="tabs-trigger"
      data-slot="tabs-trigger"
      {...props}
    />
  );
}
