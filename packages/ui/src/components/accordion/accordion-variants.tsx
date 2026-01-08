"use client";

import { cva } from "class-variance-authority";

// Variants
export const accordionRootVariants = cva("", {
  variants: {
    variant: {
      default: "",
      outline: "space-y-2",
      solid: "space-y-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "border-border border-b",
      outline: "rounded-lg border border-border px-4",
      solid: "rounded-lg bg-accent/70 px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const accordionTriggerVariants = cva(
  "flex flex-1 cursor-pointer items-center justify-between gap-2.5 py-4 font-medium text-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        solid: "",
      },
      indicator: {
        arrow: "",
        plus: "",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      indicator: "arrow",
    },
  }
);

export const accordionContentVariants = cva("overflow-hidden text-sm", {
  variants: {
    variant: {
      default: "",
      outline: "",
      solid: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
