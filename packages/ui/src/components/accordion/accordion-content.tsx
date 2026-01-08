"use client";

import { cn } from "@repo/ui/lib/utils";
import { motion } from "motion/react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { useAccordionContext, useAccordionItem } from "./accordion-context";
import { accordionContentVariants } from "./accordion-variants";

function AccordionContent(
  props: ComponentProps<typeof AccordionPrimitive.Content>
) {
  const { className, children, ...rest } = props;
  const { variant } = useAccordionContext();
  const { isOpen } = useAccordionItem();

  return (
    <AccordionPrimitive.Content
      asChild
      className={cn(accordionContentVariants({ variant }), className)}
      data-slot="accordion-content"
      forceMount
      {...rest}
    >
      <motion.div
        animate={isOpen ? "open" : "closed"}
        initial={false}
        transition={{
          height: { duration: 0.3, ease: "easeOut" },
          opacity: { duration: 0.2, ease: "easeOut" },
        }}
        variants={{
          open: {
            height: "auto",
            opacity: 1,
          },
          closed: {
            height: 0,
            opacity: 0,
          },
        }}
      >
        <div className="pt-0 pb-5">{children}</div>
      </motion.div>
    </AccordionPrimitive.Content>
  );
}

export { AccordionContent };
