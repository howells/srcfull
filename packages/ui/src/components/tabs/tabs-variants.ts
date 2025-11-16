import { cva } from "class-variance-authority";

export const tabsListVariants = cva("inline-flex w-fit items-center justify-center", {
  variants: {
    variant: {
      default: "rounded-lg bg-muted/40 p-[3px] text-muted-foreground",
      underline: "gap-4 border-b",
      pill: "rounded-full bg-muted/40 p-[3px] text-muted-foreground",
      button: "gap-2",
      line: "gap-2 border-b border-border",
    },
    size: {
      "2xs": "h-6",
      xs: "h-7",
      sm: "h-8",
      base: "h-9",
      lg: "h-10",
      xl: "h-11",
      "2xl": "h-12",
    },
  },
  compoundVariants: [
    { variant: "underline", size: "2xs", className: "h-auto" },
    { variant: "underline", size: "xs", className: "h-auto" },
    { variant: "underline", size: "sm", className: "h-auto" },
    { variant: "underline", size: "base", className: "h-auto" },
    { variant: "underline", size: "lg", className: "h-auto" },
    { variant: "underline", size: "xl", className: "h-auto" },
    { variant: "underline", size: "2xl", className: "h-auto" },
    { variant: "line", size: "2xs", className: "h-auto" },
    { variant: "line", size: "xs", className: "h-auto" },
    { variant: "line", size: "sm", className: "h-auto" },
    { variant: "line", size: "base", className: "h-auto" },
    { variant: "line", size: "lg", className: "h-auto" },
    { variant: "line", size: "xl", className: "h-auto" },
    { variant: "line", size: "2xl", className: "h-auto" },
    { variant: "button", size: "2xs", className: "h-auto" },
    { variant: "button", size: "xs", className: "h-auto" },
    { variant: "button", size: "sm", className: "h-auto" },
    { variant: "button", size: "base", className: "h-auto" },
    { variant: "button", size: "lg", className: "h-auto" },
    { variant: "button", size: "xl", className: "h-auto" },
    { variant: "button", size: "2xl", className: "h-auto" },
  ],
  defaultVariants: {
    variant: "default",
    size: "base",
  },
});

export const tabsTriggerVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-[color,box-shadow,border-color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "flex-1 rounded-md border border-transparent text-muted-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:bg-card data-[state=active]:text-foreground h-[calc(100%-1px)]",
        underline:
          "border-b-2 border-transparent text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:border-primary data-[state=active]:text-foreground",
        pill: "rounded-full border border-transparent text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground h-[calc(100%-1px)]",
        button:
          "rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        line: "border-b-2 border-transparent text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:border-primary data-[state=active]:text-foreground",
      },
      size: {
        "2xs": "px-1.5 py-0.5 text-xs",
        xs: "px-2 py-1 text-xs",
        sm: "px-2.5 py-1.5 text-sm",
        base: "px-3 py-2 text-sm",
        lg: "px-4 py-2.5 text-base",
        xl: "px-5 py-3 text-base",
        "2xl": "px-6 py-3.5 text-lg",
      },
    },
    compoundVariants: [
      { variant: "underline", size: "2xs", className: "pb-1.5 pt-0.5" },
      { variant: "underline", size: "xs", className: "pb-2 pt-1" },
      { variant: "underline", size: "sm", className: "pb-2.5 pt-1.5" },
      { variant: "underline", size: "base", className: "pb-3 pt-2" },
      { variant: "underline", size: "lg", className: "pb-3.5 pt-2.5" },
      { variant: "underline", size: "xl", className: "pb-4 pt-3" },
      { variant: "underline", size: "2xl", className: "pb-4.5 pt-3.5" },
      { variant: "line", size: "2xs", className: "pb-1.5 pt-0.5" },
      { variant: "line", size: "xs", className: "pb-2 pt-1" },
      { variant: "line", size: "sm", className: "pb-2.5 pt-1.5" },
      { variant: "line", size: "base", className: "pb-3 pt-2" },
      { variant: "line", size: "lg", className: "pb-3.5 pt-2.5" },
      { variant: "line", size: "xl", className: "pb-4 pt-3" },
      { variant: "line", size: "2xl", className: "pb-4.5 pt-3.5" },
    ],
    defaultVariants: {
      variant: "default",
      size: "base",
    },
  }
);
