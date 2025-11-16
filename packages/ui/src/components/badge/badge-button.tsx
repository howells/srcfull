import { cn } from "@repo/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import type * as React from "react";
import { badgeButtonVariants } from "./badge-variants";

export interface BadgeButtonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeButtonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
}

export function BadgeButton({
  className,
  variant,
  asChild = false,
  icon = <X />,
  ...props
}: BadgeButtonProps) {
  const Comp = asChild ? SlotPrimitive.Slot : "span";
  return (
    <Comp
      className={cn(badgeButtonVariants({ variant, className }))}
      data-slot="badge-button"
      role="button"
      {...props}
    >
      {icon}
    </Comp>
  );
}
