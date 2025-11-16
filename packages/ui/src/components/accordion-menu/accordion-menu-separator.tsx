"use client";

import { cn } from "@materia/ui/utils/cn";
import { useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { AccordionMenuContext } from "./accordion-menu-context";

export type AccordionMenuSeparatorProps = ComponentPropsWithoutRef<"div">;

export function AccordionMenuSeparator({
  className,
  ...props
}: AccordionMenuSeparatorProps) {
  const { classNames } = useContext(AccordionMenuContext);
  return (
    <div
      className={cn("my-1 h-px bg-border", classNames?.separator, className)}
      data-component="accordion-menu-separator"
      data-slot="accordion-menu-separator"
      role="separator"
      {...props}
    />
  );
}
