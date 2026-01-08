import { cn } from "@repo/ui/utils/cn";
import type { WithTestId } from "@repo/ui/utils/test-id";
import type * as React from "react";

interface CardProps extends WithTestId<React.ComponentProps<"div">> {
  border?: "none" | "solid" | "dashed";
  variant?: "card" | "muted";
}

/**
 * Card container with optional border and token-based background.
 * - border: "none", "solid" (default), or "dashed"
 * - variant: "card" (bg-card) or "muted" (bg-muted), defaults to "card".
 */
function Card({
  className,
  border = "solid",
  variant = "card",
  testId,
  ...props
}: CardProps) {
  const toneClasses = variant === "muted" ? "bg-card-muted" : "bg-card";
  const borderClasses =
    border === "none"
      ? "border-transparent"
      : border === "dashed"
        ? "border-dashed border-muted-foreground/25"
        : "border-border";
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border pt-6 text-card-foreground has-[data-slot=card-footer]:pb-0 [&:not(:has([data-slot=card-footer]))]:pb-6",
        borderClasses,
        toneClasses,
        className
      )}
      data-component="card"
      data-slot="card"
      data-testid={testId}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:pb-2 [.border-b]:pb-6",
        className
      )}
      data-component="card-header"
      data-slot="card-header"
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-sm leading-none", className)}
      data-component="card-title"
      data-slot="card-title"
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-component="card-description"
      data-slot="card-description"
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-component="card-action"
      data-slot="card-action"
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6", className)}
      data-component="card-content"
      data-slot="card-content"
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 rounded-b-xl bg-muted/30 px-6 py-4",
        className
      )}
      data-component="card-footer"
      data-slot="card-footer"
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
