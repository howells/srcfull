"use client";

import { cn } from "@materia/ui/utils/cn";
import type { VariantProps } from "class-variance-authority";
import { useTabsContext } from "../tabs/tabs-context";
import { tabsListVariants } from "../tabs/tabs-variants";

export function TabNavigationList({
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof tabsListVariants>) {
  const { variant } = useTabsContext();
  return (
    <div
      className={cn(tabsListVariants({ variant }), className)}
      data-component="tab-navigation-list"
      data-slot="tab-navigation-list"
      role="list"
      {...props}
    />
  );
}
