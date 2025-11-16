import { cn } from "@repo/ui/utils/cn";
import type React from "react";

function Text({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("max-w-prose text-sm", className)}
      data-component="text"
      data-slot="text"
      {...props}
    />
  );
}

export { Text };
