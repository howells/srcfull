"use client";

import { cn } from "@repo/ui/utils/cn";
import { Root as AccordionPrimitive } from "@radix-ui/react-accordion";
import { Children, isValidElement, useEffect, useMemo, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  AccordionMenuContext,
  type AccordionMenuClassNames,
} from "./accordion-menu-context";

/**
 * AccordionMenu Root Component
 *
 * A flexible accordion menu that supports multi-level navigation and integrates
 * with your router to manage active states based on the current route.
 */
export interface AccordionMenuProps {
  /** Sets the default selected accordion item by value */
  selectedValue?: string;
  /** Callback to integrate with a router, determining if a given path matches the current route */
  matchPath?: (href: string) => boolean;
  /** Customize CSS class names for different parts of the component */
  classNames?: AccordionMenuClassNames;
  /** Callback fired when an item is clicked */
  onItemClick?: (value: string, event: React.MouseEvent) => void;
  children: ReactNode;
}

export function AccordionMenu({
  className,
  matchPath = () => false,
  classNames,
  children,
  selectedValue,
  onItemClick,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive> & AccordionMenuProps) {
  const [internalSelectedValue, setInternalSelectedValue] = useState<
    string | undefined
  >(selectedValue);

  useEffect(() => {
    setInternalSelectedValue(selectedValue);
  }, [selectedValue]);

  const initialNestedStates = useMemo(() => {
    const getActiveChain = (
      nodes: ReactNode,
      chain: string[] = []
    ): string[] => {
      let result: string[] = [];
      Children.forEach(nodes, (node) => {
        if (isValidElement(node)) {
          const { value, children } = node.props as {
            value?: string;
            children?: ReactNode;
          };
          const newChain = value ? [...chain, value] : chain;
          if (value && (value === selectedValue || matchPath(value))) {
            result = newChain;
          } else if (children) {
            const childChain = getActiveChain(children, newChain);
            if (childChain.length > 0) {
              result = childChain;
            }
          }
        }
      });
      return result;
    };

    const chain = getActiveChain(children);
    const trimmedChain =
      chain.length > 1 ? chain.slice(0, chain.length - 1) : chain;
    const mapping: Record<string, string | string[]> = {};
    if (trimmedChain.length > 0) {
      if (props.type === "multiple") {
        mapping["root"] = trimmedChain;
      } else {
        mapping["root"] = trimmedChain[0];
        for (let i = 0; i < trimmedChain.length - 1; i++) {
          mapping[trimmedChain[i]] = trimmedChain[i + 1];
        }
      }
    }
    return mapping;
  }, [children, matchPath, selectedValue, props.type]);

  const [nestedStates, setNestedStates] =
    useState<Record<string, string | string[]>>(initialNestedStates);

  const multipleValue = (
    Array.isArray(nestedStates["root"])
      ? nestedStates["root"]
      : typeof nestedStates["root"] === "string"
        ? [nestedStates["root"]]
        : []
  ) as string[];

  const singleValue = (nestedStates["root"] ?? "") as string;

  return (
    <AccordionMenuContext.Provider
      value={{
        matchPath,
        selectedValue: internalSelectedValue,
        setSelectedValue: setInternalSelectedValue,
        classNames,
        onItemClick,
        nestedStates,
        setNestedStates,
      }}
    >
      {props.type === "single" ? (
        <AccordionPrimitive
          className={cn("w-full", classNames?.root, className)}
          data-component="accordion-menu"
          data-slot="accordion-menu"
          onValueChange={(value: string) =>
            setNestedStates((prev) => ({ ...prev, root: value }))
          }
          value={singleValue}
          {...props}
          role="menu"
        >
          {children}
        </AccordionPrimitive>
      ) : (
        <AccordionPrimitive
          className={cn("w-full", classNames?.root, className)}
          data-component="accordion-menu"
          data-slot="accordion-menu"
          onValueChange={(value: string | string[]) =>
            setNestedStates((prev) => ({ ...prev, root: value }))
          }
          value={multipleValue}
          {...props}
          role="menu"
        >
          {children}
        </AccordionPrimitive>
      )}
    </AccordionMenuContext.Provider>
  );
}
