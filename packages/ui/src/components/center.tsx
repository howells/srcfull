import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/utils/cn";
import type * as React from "react";

export interface CenterProps extends React.ComponentProps<"div"> {
  /**
   * Use inline-flex instead of flex for inline centering
   */
  inline?: boolean;
  /**
   * Change the default rendered element for the one passed as a child,
   * merging their props and behavior
   */
  asChild?: boolean;
}

/**
 * Center centers its children both vertically and horizontally.
 *
 * @example
 * ```tsx
 * <Center>
 *   <Button>Centered Button</Button>
 * </Center>
 * ```
 *
 * @example
 * ```tsx
 * <Center inline>
 *   <Icon name="check" />
 *   <span>Inline centered content</span>
 * </Center>
 * ```
 *
 * @example
 * ```tsx
 * <Center asChild>
 *   <section>Centered section</section>
 * </Center>
 * ```
 */
export function Center({
  children,
  className,
  inline = false,
  asChild = false,
  ...props
}: CenterProps) {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      className={cn(
        "items-center justify-center",
        inline ? "inline-flex" : "flex",
        className
      )}
      data-component="center"
      {...props}
    >
      {children}
    </Component>
  );
}
