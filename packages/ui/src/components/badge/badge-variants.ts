import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "[&_svg]:-ms-px inline-flex items-center justify-center whitespace-nowrap border border-transparent font-normal focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-600 text-white",
        warning: "bg-amber-600 text-white",
        info: "bg-blue-600 text-white",
        purple: "bg-purple-600 text-white",
        rose: "bg-rose-600 text-white",
        outline: "border border-border bg-transparent text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
      },
      appearance: {
        default: "",
        light: "",
        outline: "",
        ghost: "border-transparent bg-transparent",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
      },
      size: {
        "2xl": "h-10 min-w-10 gap-2 rounded-lg px-3 text-base [&_svg]:size-5",
        xl: "h-8 min-w-8 gap-2 rounded-md px-2.5 text-sm [&_svg]:size-4",
        lg: "h-7 min-w-7 gap-1.5 rounded-md px-2 text-xs [&_svg]:size-3.5",
        base: "h-6 min-w-6 gap-1.5 rounded-md px-1.5 text-xs [&_svg]:size-3.5",
        sm: "h-5 min-w-5 gap-1 rounded-sm px-1.5 text-[0.6875rem] leading-[0.75rem] [&_svg]:size-3",
        xs: "h-4 min-w-4 gap-1 rounded-sm px-1 text-[0.625rem] leading-[0.5rem] [&_svg]:size-3",
        "2xs": "h-3 min-w-3 gap-0.5 rounded-sm px-[0.1875rem] text-[0.5rem] leading-[0.5rem] [&_svg]:size-2.5",
      },
      shape: {
        default: "",
        circle: "rounded-full",
      },
    },
    compoundVariants: [
      /* Light */
      {
        variant: "primary",
        appearance: "light",
        className: "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
      },
      {
        variant: "secondary",
        appearance: "light",
        className: "bg-secondary text-secondary-foreground dark:bg-secondary/50",
      },
      {
        variant: "success",
        appearance: "light",
        className: "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300",
      },
      {
        variant: "warning",
        appearance: "light",
        className: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
      },
      {
        variant: "info",
        appearance: "light",
        className: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
      },
      {
        variant: "purple",
        appearance: "light",
        className: "bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
      },
      {
        variant: "rose",
        appearance: "light",
        className: "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
      },
      {
        variant: "destructive",
        appearance: "light",
        className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
      },
      /* Outline */
      {
        variant: "primary",
        appearance: "outline",
        className: "border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
      },
      {
        variant: "success",
        appearance: "outline",
        className: "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
      },
      {
        variant: "warning",
        appearance: "outline",
        className: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
      },
      {
        variant: "info",
        appearance: "outline",
        className: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
      },
      {
        variant: "purple",
        appearance: "outline",
        className: "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300",
      },
      {
        variant: "rose",
        appearance: "outline",
        className: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
      },
      {
        variant: "destructive",
        appearance: "outline",
        className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
      },
      /* Ghost */
      {
        variant: "primary",
        appearance: "ghost",
        className: "text-primary",
      },
      {
        variant: "secondary",
        appearance: "ghost",
        className: "text-secondary-foreground",
      },
      {
        variant: "success",
        appearance: "ghost",
        className: "text-green-600 dark:text-green-400",
      },
      {
        variant: "warning",
        appearance: "ghost",
        className: "text-amber-600 dark:text-amber-400",
      },
      {
        variant: "info",
        appearance: "ghost",
        className: "text-blue-600 dark:text-blue-400",
      },
      {
        variant: "purple",
        appearance: "ghost",
        className: "text-purple-600 dark:text-purple-400",
      },
      {
        variant: "rose",
        appearance: "ghost",
        className: "text-rose-600 dark:text-rose-400",
      },
      {
        variant: "destructive",
        appearance: "ghost",
        className: "text-destructive",
      },
    ],
    defaultVariants: {
      variant: "primary",
      appearance: "default",
      size: "base",
    },
  }
);

export const badgeButtonVariants = cva(
  "-me-0.5 inline-flex cursor-pointer items-center justify-center rounded-md p-0 leading-none opacity-60 transition-all hover:opacity-100 [&>svg]:opacity-100!",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
