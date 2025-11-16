"use client";

import { cn } from "@materia/ui/utils/cn";
import type { WithTestId } from "@materia/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";

function SelectSeparator({
  className,
  testId,
  ...props
}: WithTestId<React.ComponentProps<typeof SelectPrimitive.Separator>>) {
  return (
    <SelectPrimitive.Separator
      className={cn("-mx-1 pointer-events-none my-1 h-px bg-border", className)}
      data-component="select-separator"
      data-slot="select-separator"
      data-testid={testId}
      {...props}
    />
  );
}

export { SelectSeparator };
