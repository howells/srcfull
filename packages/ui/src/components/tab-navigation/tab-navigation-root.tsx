"use client";

import { cn } from "@materia/ui/utils/cn";
import { TabsContext } from "../tabs/tabs-context";

export interface TabNavigationProps extends React.ComponentProps<"nav"> {
  variant?: "default" | "underline";
}

export function TabNavigation({
  className,
  variant = "underline",
  children,
  ...props
}: TabNavigationProps) {
  return (
    <TabsContext.Provider value={{ variant }}>
      <nav
        className={cn("flex flex-col gap-2", className)}
        data-component="tab-navigation"
        data-slot="tab-navigation"
        {...props}
      >
        {children}
      </nav>
    </TabsContext.Provider>
  );
}
