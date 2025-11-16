import { createContext, useContext } from "react";

export type CollapsibleContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(
  null
);

export function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible components must be used within Collapsible");
  }
  return context;
}
