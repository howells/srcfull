"use client";

import type { WithTestId } from "@repo/ui/utils/test-id";
import * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";

function SelectGroup({
  testId,
  ...props
}: WithTestId<React.ComponentProps<typeof SelectPrimitive.Group>>) {
  return (
    <SelectPrimitive.Group
      data-component="select-group"
      data-slot="select-group"
      data-testid={testId}
      {...props}
    />
  );
}

export { SelectGroup };
