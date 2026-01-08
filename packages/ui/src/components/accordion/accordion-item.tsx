"use client";

import { cn } from "@repo/ui/lib/utils";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { useMemo } from "react";
import { AccordionItemContext, useAccordionContext } from "./accordion-context";
import { accordionItemVariants } from "./accordion-variants";

function AccordionItem(props: ComponentProps<typeof AccordionPrimitive.Item>) {
  const { className, children, value, ...rest } = props;
  const { variant, value: accordionValue, type } = useAccordionContext();

  // Determine if this item is open based on accordion type
  const isOpen = useMemo(() => {
    if (type === "multiple" && Array.isArray(accordionValue)) {
      return accordionValue.includes(value);
    }
    return accordionValue === value;
  }, [accordionValue, value, type]);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <AccordionPrimitive.Item
        className={cn(accordionItemVariants({ variant }), className)}
        data-slot="accordion-item"
        value={value}
        {...rest}
      >
        {children}
      </AccordionPrimitive.Item>
    </AccordionItemContext.Provider>
  );
}

export { AccordionItem };
