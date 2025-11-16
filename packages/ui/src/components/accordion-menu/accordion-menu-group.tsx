"use client";

import { cn } from "@materia/ui/utils/cn";
import { useContext } from "react";
import type { ReactNode } from "react";
import { AccordionMenuContext } from "./accordion-menu-context";

/**
 * AccordionMenuGroup Component
 *
 * Used to group menu items together.
 */
export type AccordionMenuGroupProps = {
  className?: string;
  children: ReactNode;
};

export function AccordionMenuGroup({
  className,
  children,
}: AccordionMenuGroupProps) {
  const { classNames } = useContext(AccordionMenuContext);

  return (
    <div
      className={cn(classNames?.group, className)}
      data-component="accordion-menu-group"
      data-slot="accordion-menu-group"
    >
      {children}
    </div>
  );
}
