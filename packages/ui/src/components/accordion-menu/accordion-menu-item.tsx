"use client";

import { Header, Item, Trigger } from "@radix-ui/react-accordion";
import { cn } from "@repo/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, MouseEventHandler } from "react";
import { useContext } from "react";
import { AccordionMenuContext } from "./accordion-menu-context";

const itemVariants = cva(
  "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-start text-foreground text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground disabled:bg-transparent disabled:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&>a]:w-full [&>a]:items-center [&>a]:gap-2 [&_a]:flex [&_svg:not([class*=size-])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:opacity-60",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "text-destructive hover:bg-destructive/5 hover:text-destructive focus:bg-destructive/5 focus:text-destructive data-[active=true]:bg-destructive/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * AccordionMenuItem Component
 *
 * Individual menu item with support for variants.
 */
export type AccordionMenuItemProps = ComponentPropsWithoutRef<typeof Item> &
  VariantProps<typeof itemVariants> & {
    onClick?: MouseEventHandler<HTMLElement>;
  };

export function AccordionMenuItem({
  className,
  children,
  variant,
  asChild,
  onClick,
  ...props
}: AccordionMenuItemProps) {
  const { classNames, selectedValue, matchPath, onItemClick } =
    useContext(AccordionMenuContext);

  return (
    <Item className="flex" {...props}>
      <Header className="flex w-full">
        <Trigger
          asChild={asChild}
          className={cn(itemVariants({ variant }), classNames?.item, className)}
          data-component="accordion-menu-item"
          data-selected={
            matchPath(props.value as string) || selectedValue === props.value
              ? "true"
              : undefined
          }
          data-slot="accordion-menu-item"
          onClick={(e) => {
            if (onItemClick) {
              onItemClick(props.value, e);
            }

            if (onClick) {
              onClick(e);
            }
            e.preventDefault();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const target = e.currentTarget as HTMLElement;
              const firstChild = target.firstElementChild as HTMLElement | null;
              if (firstChild) {
                firstChild.click();
              }
            }
          }}
        >
          {children}
        </Trigger>
      </Header>
    </Item>
  );
}
