"use client";

import { cn } from "@repo/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { useState } from "react";
import { AccordionContext } from "./accordion-context";
import { accordionRootVariants } from "./accordion-variants";

function AccordionRoot(
  props: ComponentProps<typeof AccordionPrimitive.Root> &
    VariantProps<typeof accordionRootVariants> & {
      indicator?: "arrow" | "plus";
    }
) {
  const {
    className,
    variant = "default",
    indicator = "arrow",
    children,
    value,
    onValueChange,
    ...rest
  } = props;

  // Extract type from rest for context
  const type = "type" in rest ? rest.type : undefined;

  // Track accordion value in state
  const [internalValue, setInternalValue] = useState<string | string[]>(
    type === "multiple" ? [] : ""
  );

  // Use controlled value if provided, otherwise use internal state
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Handle value changes
  const handleValueChange = (newValue: string | string[]) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue as never);
    }
  };

  return (
    <AccordionContext.Provider
      value={{
        variant: variant || "default",
        indicator,
        value: currentValue,
        type,
      }}
    >
      <AccordionPrimitive.Root
        className={cn(accordionRootVariants({ variant }), className)}
        data-slot="accordion"
        {...rest}
        onValueChange={handleValueChange}
        value={currentValue as never}
      >
        {children}
      </AccordionPrimitive.Root>
    </AccordionContext.Provider>
  );
}

export { AccordionRoot };
