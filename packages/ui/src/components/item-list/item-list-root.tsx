import { cn } from "@repo/ui/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

/**
 * ItemList variants control the overall list style:
 * - divided: Minimal list with dividers, no card backgrounds
 * - separated: Individual elevated items with gaps between them (card-like)
 * - grouped: Items connected together in one card (no gaps, rounded corners on first/last only)
 */
const itemListVariants = cva("group/item-list flex flex-col", {
  variants: {
    variant: {
      divided: "divide-y divide-border",
      separated: "gap-3",
      grouped: "overflow-hidden rounded-xl border border-border bg-card",
    },
  },
  defaultVariants: {
    variant: "divided",
  },
});

export interface ItemListProps
  extends Omit<React.ComponentProps<"ul">, "ref">,
    VariantProps<typeof itemListVariants> {
  ordered?: boolean;
  ref?: React.Ref<HTMLUListElement> | React.Ref<HTMLOListElement>;
}

/**
 * ItemList is a semantic container for repeated items.
 * Use it instead of Card when you need to display multiple similar items.
 *
 * @example
 * ```tsx
 * <ItemList variant="divided">
 *   <Item>...</Item>
 *   <Item>...</Item>
 * </ItemList>
 * ```
 */
export function ItemList({
  className,
  variant = "divided",
  ordered = false,
  ref,
  ...props
}: ItemListProps) {
  const Comp = ordered ? "ol" : "ul";
  return (
    <Comp
      ref={ref as React.Ref<HTMLUListElement> & React.Ref<HTMLOListElement>}
      className={cn(itemListVariants({ variant, className }))}
      data-component="item-list"
      data-variant={variant}
      role="list"
      {...props}
    />
  );
}
