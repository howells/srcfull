import { cn } from "@repo/ui/lib/utils";
import type * as React from "react";

export type BadgeDotProps = React.HTMLAttributes<HTMLSpanElement>;

export function BadgeDot({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "size-1.5 rounded-full bg-[currentColor] opacity-75",
        className
      )}
      data-slot="badge-dot"
      {...props}
    />
  );
}
