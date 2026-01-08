import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";

interface DescriptionListProps extends React.ComponentProps<"dl"> {
  showSeparators?: boolean;
}

function DescriptionList({
  className,
  showSeparators = false,
  ...props
}: DescriptionListProps) {
  return (
    <dl
      className={cn(
        "grid gap-3 text-sm",
        showSeparators &&
          "[&>*:not(:last-child)]:border-border [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:pb-3",
        className
      )}
      data-component="description-list"
      data-slot="description-list"
      {...props}
    />
  );
}

function DescriptionItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("grid grid-cols-[2fr_3fr] gap-4", className)}
      data-component="description-item"
      data-slot="description-item"
      {...props}
    />
  );
}

function DescriptionTerm({ className, ...props }: React.ComponentProps<"dt">) {
  return (
    <dt
      className={cn("text-muted-foreground", className)}
      data-component="description-term"
      data-slot="description-term"
      {...props}
    />
  );
}

function DescriptionDetails({
  className,
  ...props
}: React.ComponentProps<"dd">) {
  return (
    <dd
      className={cn("text-right", className)}
      data-component="description-details"
      data-slot="description-details"
      {...props}
    />
  );
}

export {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
};
