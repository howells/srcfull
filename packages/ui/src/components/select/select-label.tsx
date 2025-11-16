"use client";

import { cn } from "@materia/ui/utils/cn";
import type { WithTestId } from "@materia/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";

function SelectLabel({
  className,
  testId,
  ...props
}: WithTestId<React.ComponentProps<typeof SelectPrimitive.Label>>) {
  return (
    <SelectPrimitive.Label
      className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)}
      data-component="select-label"
      data-slot="select-label"
      data-testid={testId}
      {...props}
    />
  );
}

export { SelectLabel };
