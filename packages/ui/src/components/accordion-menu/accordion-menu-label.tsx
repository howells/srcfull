"use client";

import { cn } from "@repo/ui/utils/cn";
import { useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { AccordionMenuContext } from "./accordion-menu-context";

export type AccordionMenuLabelProps = ComponentPropsWithoutRef<"div">;

export function AccordionMenuLabel({
  children,
  className,
  ...props
}: AccordionMenuLabelProps) {
  const { classNames } = useContext(AccordionMenuContext);

  return (
    <div
      className={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-xs",
        classNames?.label,
        className
      )}
      data-component="accordion-menu-label"
      data-slot="accordion-menu-label"
      role="presentation"
      {...props}
    >
      {children}
    </div>
  );
}
