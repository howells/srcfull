"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@repo/ui/utils/cn";
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
