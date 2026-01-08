"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/utils/cn";
import type { VariantProps } from "class-variance-authority";
import { useTabsContext } from "../tabs/tabs-context";
import { tabsTriggerVariants } from "../tabs/tabs-variants";

export interface TabNavigationLinkProps
  extends Omit<React.ComponentProps<"a">, "href">,
    VariantProps<typeof tabsTriggerVariants> {
  href: string;
  active?: boolean;
  asChild?: boolean;
}

export function TabNavigationLink({
  className,
  active = false,
  asChild = false,
  ...props
}: TabNavigationLinkProps) {
  const { variant } = useTabsContext();
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn(tabsTriggerVariants({ variant }), className)}
      data-component="tab-navigation-link"
      data-slot="tab-navigation-link"
      data-state={active ? "active" : "inactive"}
      role="link"
      {...props}
    />
  );
}
