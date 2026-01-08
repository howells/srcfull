"use client";

import { Item, Root } from "@radix-ui/react-toggle-group";
import { toggleVariants } from "@repo/ui/components/toggle";
import { cn } from "@repo/ui/utils/cn";
import type { VariantProps } from "class-variance-authority";
import React, { useContext } from "react";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "sm",
  variant: "outline",
});

function ToggleGroup({
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: React.ComponentProps<typeof Root> & VariantProps<typeof toggleVariants>) {
  return (
    <Root
      className={cn(
        "group/toggle-group flex items-center gap-1 rounded-md data-[variant=outline]:gap-0",
        className
      )}
      data-size={size}
      data-slot="toggle-group"
      data-variant={variant}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Item> & VariantProps<typeof toggleVariants>) {
  const context = useContext(ToggleGroupContext);

  return (
    <Item
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "shrink-0 shadow-none focus:z-10 focus-visible:z-10 data-[variant=outline]:rounded-none data-[variant=outline]:border-s-0 data-[variant=outline]:last:rounded-e-md data-[variant=outline]:first:rounded-s-md data-[variant=outline]:first:border-s",
        className
      )}
      data-size={context.size || size}
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      {...props}
    >
      {children}
    </Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
