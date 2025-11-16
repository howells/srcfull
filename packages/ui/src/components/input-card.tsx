"use client";

import { cn } from "@repo/ui/utils/cn";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

const inputCardBaseStyles = cn(
  "relative rounded-2xl border border-border/70 bg-background",
  "ring-1 ring-transparent ring-inset transition-[color,box-shadow,border-color]",
  "hover:border-border",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

const inputCardSelectedStyles = cn(
  "data-[state=checked]:border-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-foreground/80",
  "data-[state=indeterminate]:border-foreground data-[state=indeterminate]:ring-2 data-[state=indeterminate]:ring-foreground/80",
  "data-[selected=true]:border-foreground data-[selected=true]:ring-2 data-[selected=true]:ring-foreground/80"
);

type InputCardProps = {
  asChild?: boolean;
  selected?: boolean;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<"div">;

const InputCard = forwardRef<HTMLDivElement, InputCardProps>(
  ({ asChild = false, selected, disabled, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(inputCardBaseStyles, inputCardSelectedStyles, className)}
        data-disabled={disabled ? "true" : undefined}
        data-selected={selected ? "true" : undefined}
        ref={ref}
        {...props}
        {...(disabled !== undefined ? { disabled } : {})}
      />
    );
  }
);

InputCard.displayName = "InputCard";

export { InputCard, inputCardBaseStyles, inputCardSelectedStyles };
