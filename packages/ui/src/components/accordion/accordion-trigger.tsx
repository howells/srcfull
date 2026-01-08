"use client";

import { cn } from "@repo/ui/lib/utils";
import { ChevronDown, Plus } from "lucide-react";
import { motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { Icon } from "../icon";
import { useAccordionContext, useAccordionItem } from "./accordion-context";
import { accordionTriggerVariants } from "./accordion-variants";

function AccordionTrigger(
  props: ComponentProps<typeof AccordionPrimitive.Trigger>
) {
  const { className, children, ...rest } = props;
  const { variant, indicator } = useAccordionContext();
  const { isOpen } = useAccordionItem();

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          accordionTriggerVariants({ variant, indicator }),
          className
        )}
        data-slot="accordion-trigger"
        {...rest}
      >
        {children}
        {indicator === "plus" && (
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            className="shrink-0"
            initial={false}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Icon icon={Plus} size="xs" />
          </motion.div>
        )}
        {indicator === "arrow" && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="shrink-0"
            initial={false}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Icon icon={ChevronDown} size="xs" />
          </motion.div>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export { AccordionTrigger };
