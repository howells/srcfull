"use client";

import type { WithTestId } from "@repo/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";

function SelectValue({
  testId,
  ...props
}: WithTestId<React.ComponentProps<typeof SelectPrimitive.Value>>) {
  return (
    <SelectPrimitive.Value
      data-component="select-value"
      data-slot="select-value"
      data-testid={testId}
      {...props}
    />
  );
}

export { SelectValue };
