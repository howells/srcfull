import { cn } from "@repo/ui/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-accent", className)}
      data-component="skeleton"
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
