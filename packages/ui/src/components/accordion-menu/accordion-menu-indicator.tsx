"use client";

import { cn } from "@repo/ui/utils/cn";
import { useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { AccordionMenuContext } from "./accordion-menu-context";

export type AccordionMenuIndicatorProps = ComponentPropsWithoutRef<"span">;

export function AccordionMenuIndicator({
  className,
  ...props
}: AccordionMenuIndicatorProps) {
  const { classNames } = useContext(AccordionMenuContext);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ms-auto flex items-center font-medium",
        classNames?.indicator,
        className
      )}
      data-component="accordion-menu-indicator"
      data-slot="accordion-menu-indicator"
      {...props}
    />
  );
}
