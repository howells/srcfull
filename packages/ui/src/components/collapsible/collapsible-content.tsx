"use client";

import { presets } from "@repo/ui/lib/motion";
import { cn } from "@repo/ui/utils/cn";
import { CollapsibleContent as CollapsiblePrimitiveContent } from "@radix-ui/react-collapsible";
import { motion } from "motion/react";
import { useCollapsibleContext } from "./collapsible-context";

export function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitiveContent>) {
  const { isOpen } = useCollapsibleContext();

  return (
    <CollapsiblePrimitiveContent
      asChild
      data-component="collapsible-content"
      data-slot="collapsible-content"
      forceMount
      {...props}
    >
      <motion.div
        animate={isOpen ? "open" : "closed"}
        className={cn("overflow-hidden", className)}
        initial={false}
        variants={{
          open: {
            height: "auto",
            opacity: 1,
            transition: presets.slideIn,
          },
          closed: {
            height: 0,
            opacity: 0,
            transition: presets.slideOut,
          },
        }}
      >
        {children}
      </motion.div>
    </CollapsiblePrimitiveContent>
  );
}
