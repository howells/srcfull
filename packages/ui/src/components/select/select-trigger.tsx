"use client";

import { cn } from "@repo/ui/utils/cn";
import type { WithTestId } from "@repo/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import type * as React from "react";
import { Button, buttonVariants } from "../button";
import type { VariantProps } from "class-variance-authority";
import { Icon } from "../icon";

function SelectTrigger({
  className,
  children,
  testId,
  variant = "outline",
  size = "base",
  appearance = "solid",
  ...props
}: WithTestId<
  Omit<React.ComponentProps<typeof SelectPrimitive.Trigger>, "asChild"> &
    VariantProps<typeof buttonVariants>
>) {
  return (
    <SelectPrimitive.Trigger asChild>
      <Button
        className={cn(
          "justify-between *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 data-[placeholder]:text-muted-foreground",
          className
        )}
        data-component="select-trigger"
        data-slot="select-trigger"
        data-testid={testId}
        variant={variant}
        size={size}
        appearance={appearance}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <Icon className="opacity-50" icon={ChevronDown} size="xs" />
        </SelectPrimitive.Icon>
      </Button>
    </SelectPrimitive.Trigger>
  );
}

export { SelectTrigger };
