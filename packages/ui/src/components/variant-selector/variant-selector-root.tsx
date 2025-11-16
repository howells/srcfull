"use client";

import { cn } from "@materia/ui/utils/cn";
import { Root as RadioGroupRoot } from "@radix-ui/react-radio-group";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  VariantSelectorContext,
  type VariantSelectorContextValue,
} from "./variant-selector-context";

type VariantSelectorPropsSingle = {
  mode: "single";
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
  children?: ReactNode;
};

type VariantSelectorPropsMultiple = {
  mode: "multiple";
  value?: string[];
  onValueChange?: (value: string[]) => void;
  defaultValue?: string[];
  className?: string;
  children?: ReactNode;
};

export type VariantSelectorProps =
  | VariantSelectorPropsSingle
  | VariantSelectorPropsMultiple;

/**
 * A flexible variant selector that supports both single and multiple selection modes.
 * Renders card-style items that can display images or colors.
 */
export function VariantSelector(props: VariantSelectorProps) {
  const { mode = "single", value, onValueChange, defaultValue, className, children } = props;

  // Convert value to Set for easier management
  const selectedValues = useMemo(() => {
    if (value === undefined) {
      if (defaultValue === undefined) {
        return new Set<string>();
      }
      return new Set(
        Array.isArray(defaultValue) ? defaultValue : [defaultValue]
      );
    }
    return new Set(Array.isArray(value) ? value : [value]);
  }, [value, defaultValue]);

  const handleValueChange = (itemValue: string) => {
    if (mode === "single") {
      (onValueChange as ((value: string) => void) | undefined)?.(itemValue);
    } else {
      const newValues = new Set(selectedValues);
      if (newValues.has(itemValue)) {
        newValues.delete(itemValue);
      } else {
        newValues.add(itemValue);
      }
      (onValueChange as ((value: string[]) => void) | undefined)?.(Array.from(newValues));
    }
  };

  const contextValue: VariantSelectorContextValue = {
    mode,
    selectedValues,
    onValueChange: handleValueChange,
  };

  if (mode === "single") {
    return (
      <VariantSelectorContext.Provider value={contextValue}>
        <RadioGroupRoot
          className={cn(
            "grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4",
            className
          )}
          data-component="variant-selector"
          data-slot="variant-selector"
          onValueChange={handleValueChange}
          value={Array.from(selectedValues)[0] || ""}
        >
          {children}
        </RadioGroupRoot>
      </VariantSelectorContext.Provider>
    );
  }

  return (
    <VariantSelectorContext.Provider value={contextValue}>
      <fieldset
        className={cn(
          "grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4",
          className
        )}
        data-component="variant-selector"
        data-slot="variant-selector"
      >
        {children}
      </fieldset>
    </VariantSelectorContext.Provider>
  );
}
