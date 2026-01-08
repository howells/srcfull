"use client";

import {
  Root as AccordionPrimitive,
  Content,
  Header,
  Item,
  Trigger,
} from "@radix-ui/react-accordion";
import { cn } from "@repo/ui/utils/cn";
import { ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { useContext } from "react";
import { AccordionMenuContext } from "./accordion-menu-context";

/**
 * AccordionMenuSub Component
 *
 * Container for submenu items.
 */
export type AccordionMenuSubProps = ComponentPropsWithoutRef<typeof Item>;

export function AccordionMenuSub({
  className,
  children,
  ...props
}: AccordionMenuSubProps) {
  const { classNames } = useContext(AccordionMenuContext);
  return (
    <Item
      className={cn(classNames?.sub, className)}
      data-component="accordion-menu-sub"
      data-slot="accordion-menu-sub"
      {...props}
    >
      {children}
    </Item>
  );
}

/**
 * AccordionMenuSubTrigger Component
 *
 * Trigger element for opening/closing a submenu.
 */
export type AccordionMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof Trigger
>;

export function AccordionMenuSubTrigger({
  className,
  children,
}: AccordionMenuSubTriggerProps) {
  const { classNames } = useContext(AccordionMenuContext);
  return (
    <Header className="flex">
      <Trigger
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-start text-foreground text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground [&_svg:not([class*=size-])]:size-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          classNames?.subTrigger,
          className
        )}
        data-component="accordion-menu-sub-trigger"
        data-slot="accordion-menu-sub-trigger"
      >
        {children}
        <ChevronDown
          className={cn(
            "ms-auto size-3.5! shrink-0 text-muted-foreground transition-transform duration-200",
            "[[data-state=open]>&]:-rotate-180"
          )}
          data-component="accordion-menu-sub-indicator"
          data-slot="accordion-menu-sub-indicator"
        />
      </Trigger>
    </Header>
  );
}

/**
 * AccordionMenuSubContent Component
 *
 * Content area of a submenu that appears when expanded.
 */
export type AccordionMenuSubContentProps = (
  | (ComponentPropsWithoutRef<typeof Content> & {
      type: "single";
      collapsible: boolean;
      defaultValue?: string;
    })
  | (ComponentPropsWithoutRef<typeof Content> & {
      type: "multiple";
      collapsible?: boolean;
      defaultValue?: string | string[];
    })
) & {
  parentValue: string;
};

export function AccordionMenuSubContent({
  className,
  children,
  type,
  collapsible,
  defaultValue,
  parentValue,
  ...props
}: AccordionMenuSubContentProps) {
  const { nestedStates, setNestedStates, classNames } =
    useContext(AccordionMenuContext);

  let currentValue;
  if (type === "multiple") {
    const stateValue = nestedStates[parentValue];
    if (Array.isArray(stateValue)) {
      currentValue = stateValue;
    } else if (typeof stateValue === "string") {
      currentValue = [stateValue];
    } else if (defaultValue) {
      currentValue = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];
    } else {
      currentValue = [];
    }
  } else {
    currentValue = nestedStates[parentValue] ?? defaultValue ?? "";
  }

  return (
    <Content
      className={cn(
        "ps-5",
        "overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        classNames?.subContent,
        className
      )}
      data-component="accordion-menu-sub-content"
      data-slot="accordion-menu-sub-content"
      {...props}
    >
      {type === "multiple" ? (
        <AccordionPrimitive
          className={cn("w-full py-0.5", classNames?.subWrapper)}
          data-component="accordion-menu-sub-wrapper"
          data-slot="accordion-menu-sub-wrapper"
          onValueChange={(value: string | string[]) => {
            const newValue = Array.isArray(value) ? value : [value];
            setNestedStates((prev) => ({ ...prev, [parentValue]: newValue }));
          }}
          role="menu"
          type="multiple"
          value={currentValue as string[]}
        >
          {children}
        </AccordionPrimitive>
      ) : (
        <AccordionPrimitive
          className={cn("w-full py-0.5", classNames?.subWrapper)}
          collapsible={collapsible}
          data-component="accordion-menu-sub-wrapper"
          data-slot="accordion-menu-sub-wrapper"
          onValueChange={(value: string | string[]) =>
            setNestedStates((prev) => ({ ...prev, [parentValue]: value }))
          }
          role="menu"
          type="single"
          value={currentValue as string}
        >
          {children}
        </AccordionPrimitive>
      )}
    </Content>
  );
}
