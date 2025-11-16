import { cn } from "@repo/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { IconContainer, type IconContainerProps } from "./icon-container";

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
        className
      )}
      data-component="empty"
      data-slot="empty"
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      data-component="empty-header"
      data-slot="empty-header"
      {...props}
    />
  );
}

const emptyMediaVariants = cva("mb-2", {
  variants: {
    variant: {
      default: "",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface EmptyMediaProps
  extends Omit<React.ComponentProps<"div">, keyof IconContainerProps>,
    Partial<IconContainerProps>,
    VariantProps<typeof emptyMediaVariants> {}

function EmptyMedia({
  className,
  variant = "default",
  icon,
  size,
  iconSize,
  iconClassName,
  ...props
}: EmptyMediaProps) {
  // If variant is "icon" and an icon is provided, use IconContainer
  if (variant === "icon" && icon) {
    return (
      <IconContainer
        icon={icon}
        size={size}
        variant="default"
        iconSize={iconSize}
        iconClassName={iconClassName}
        className={cn(emptyMediaVariants({ variant }), className)}
        data-component="empty-icon"
        data-slot="empty-icon"
        data-variant={variant}
      />
    );
  }

  // Otherwise render as a regular div (for custom children)
  return (
    <div
      className={cn(
        "mb-2 flex shrink-0 items-center justify-center",
        emptyMediaVariants({ variant }),
        className
      )}
      data-component="empty-icon"
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-lg tracking-tight", className)}
      data-component="empty-title"
      data-slot="empty-title"
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      className={cn(
        "text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-component="empty-description"
      data-slot="empty-description"
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className
      )}
      data-component="empty-content"
      data-slot="empty-content"
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};
