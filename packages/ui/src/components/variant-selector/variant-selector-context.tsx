import { createContext, useContext } from "react";

export type VariantSelectorContextValue = {
  mode: "single" | "multiple";
  selectedValues: Set<string>;
  onValueChange: (value: string) => void;
};

export const VariantSelectorContext =
  createContext<VariantSelectorContextValue | null>(null);

export function useVariantSelector() {
  const context = useContext(VariantSelectorContext);
  if (!context) {
    throw new Error("useVariantSelector must be used within a VariantSelector");
  }
  return context;
}
