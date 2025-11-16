"use client";

import type { WithTestId } from "@repo/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";

function Select({
  testId,
  ...props
}: WithTestId<React.ComponentProps<typeof SelectPrimitive.Root>>) {
  return (
    <SelectPrimitive.Root
      data-component="select"
      data-slot="select"
      data-testid={testId}
      {...props}
    />
  );
}

export { Select };
