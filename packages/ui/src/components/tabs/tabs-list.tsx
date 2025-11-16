"use client";

import { cn } from "@materia/ui/utils/cn";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { VariantProps } from "class-variance-authority";
import { useTabsContext } from "./tabs-context";
import { tabsListVariants } from "./tabs-variants";

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const { variant, size } = useTabsContext();
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ variant, size }), className)}
      data-component="tabs-list"
      data-slot="tabs-list"
      {...props}
    />
  );
}
