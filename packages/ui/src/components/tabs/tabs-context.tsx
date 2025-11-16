import { createContext, useContext } from "react";
import type { ComponentSize } from "@repo/ui/lib/size";

export type TabsContextValue = {
  variant: "default" | "underline" | "pill" | "button" | "line";
  size?: ComponentSize;
};

export const TabsContext = createContext<TabsContextValue>({
  variant: "default",
  size: "base",
});

export const useTabsContext = () => useContext(TabsContext);
