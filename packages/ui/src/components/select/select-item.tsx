"use client";

import { cn } from "@materia/ui/utils/cn";
import type { WithTestId } from "@materia/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check } from "lucide-react";
import type * as React from "react";
import { Icon } from "../icon";

function SelectItem({
  className,
  children,
  testId,
  ...props
}: WithTestId<React.ComponentProps<typeof SelectPrimitive.Item>>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      data-component="select-item"
      data-slot="select-item"
      data-testid={testId}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon icon={Check} size="xs" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { SelectItem };
