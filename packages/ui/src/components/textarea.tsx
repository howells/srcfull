import { cn } from "@materia/ui/utils/cn";
import { focusInput } from "@materia/ui/utils/focus-input";
import { hasErrorInput } from "@materia/ui/utils/has-error-input";
import type { WithTestId } from "@materia/ui/utils/test-id";
import type * as React from "react";

function Textarea({
  className,
  testId,
  ...props
}: WithTestId<React.ComponentProps<"textarea">>) {
  return (
    <textarea
      className={cn(
        "field-sizing-content flex min-h-16 w-full rounded-md border border-border bg-background px-3 py-2 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        focusInput,
        hasErrorInput,
        className
      )}
      data-component="textarea"
      data-slot="textarea"
      data-testid={testId}
      {...props}
    />
  );
}

export { Textarea };
