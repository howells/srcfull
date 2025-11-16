import { cn } from "@repo/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Icon, type IconProps } from "./icon";

const iconContainerVariants = cva(
  "flex shrink-0 items-center justify-center rounded-lg",
  {
    variants: {
      size: {
        sm: "size-8",
        base: "size-10",
        lg: "size-12",
        xl: "size-16",
      },
      variant: {
        default: "bg-accent",
        neutral: "bg-accent",
        muted: "bg-muted",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/20",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
        info: "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
        destructive: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "default",
    },
  }
);

export interface IconContainerProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof iconContainerVariants> {
  /** Icon component from lucide-react or any SVG React component. */
  icon: IconProps["icon"];
  /** Size of the icon inside the container. Defaults to `sm`. */
  iconSize?: IconProps["size"];
  /** Additional className for the icon itself. */
  iconClassName?: string;
  /** Centers the container using mx-auto. */
  centered?: boolean;
}

export function IconContainer({
  icon,
  size,
  variant,
  iconSize = "sm",
  centered = false,
  className,
  iconClassName,
  ...props
}: IconContainerProps) {
  return (
    <div
      className={cn(
        iconContainerVariants({ size, variant }),
        centered && "mx-auto",
        className
      )}
      data-component="icon-container"
      {...props}
    >
      <Icon icon={icon} size={iconSize} className={iconClassName} />
    </div>
  );
}
