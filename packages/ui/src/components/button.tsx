import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/utils/cn";
import type { WithTestId } from "@repo/ui/utils/test-id";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { Children } from "react";
import type { ComponentSize } from "../lib/size";
import { Dot } from "./dot";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap border font-medium text-sm outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // alias for primary (back-compat)
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        dashed:
          "border border-border border-dashed bg-background hover:bg-accent hover:text-accent-foreground",
      },
      appearance: {
        solid: "",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
      },
      mode: {
        default: "",
        icon: "",
        link: "h-auto p-0 text-primary underline-offset-4",
      },
      radius: {
        default: "rounded-md",
        full: "rounded-full",
      },
      underline: {
        none: "",
        solid: "hover:underline hover:decoration-solid",
        dashed: "hover:underline hover:decoration-dashed",
      },
      underlined: {
        none: "",
        solid: "underline decoration-solid",
        dashed: "underline decoration-dashed",
      },
      size: {
        "2xs": "h-6 gap-1 px-2 text-xs",
        xs: "h-7 gap-1.5 px-2.5 text-xs",
        sm: "h-8 gap-1.5 px-3 text-sm",
        base: "h-9 gap-2 px-3.5 text-sm",
        default: "h-9 gap-2 px-3.5 text-sm", // legacy alias → base
        lg: "h-10 gap-2 px-4 text-base",
        xl: "h-11 gap-2 px-5 text-base",
        "2xl": "h-12 gap-2.5 px-6 text-lg",
      },
    },
    compoundVariants: [
      // Ghost appearance nuanced by variant
      {
        appearance: "ghost",
        variant: ["primary", "default"],
        class: "text-primary hover:bg-primary/10 hover:text-primary",
      },
      {
        appearance: "ghost",
        variant: "destructive",
        class:
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      },
      // Link mode should be text-only: strip bg/border/shadow and map text color by variant
      {
        mode: "link",
        class: "border-0 bg-transparent shadow-none hover:bg-transparent",
      },
      { mode: "link", variant: ["primary", "default"], class: "text-primary" },
      { mode: "link", variant: "destructive", class: "text-destructive" },
      {
        mode: "link",
        variant: "secondary",
        class: "text-secondary-foreground",
      },
      {
        mode: "link",
        variant: ["outline", "dashed"],
        class: "text-foreground",
      },
      // Icon mode makes buttons perfectly square by size
      { mode: "icon", size: "2xs", class: "size-6 p-0" },
      { mode: "icon", size: "xs", class: "size-7 p-0" },
      { mode: "icon", size: "sm", class: "size-8 p-0" },
      { mode: "icon", size: ["base", "default"], class: "size-9 p-0" },
      { mode: "icon", size: "lg", class: "size-10 p-0" },
      { mode: "icon", size: "xl", class: "size-11 p-0" },
      { mode: "icon", size: "2xl", class: "size-12 p-0" },
      // Link mode removes intrinsic height/padding
      {
        mode: "link",
        size: ["2xs", "xs", "sm", "base", "default", "lg", "xl", "2xl"],
        class: "h-auto p-0",
      },
    ],
    defaultVariants: {
      variant: "default",
      appearance: "solid",
      mode: "default",
      radius: "default",
      underline: "none",
      underlined: "none",
      size: "base",
    },
  }
);

const SIZE_TO_COMPONENT_SIZE: Record<string, ComponentSize> = {
  "2xs": "2xs",
  xs: "xs",
  sm: "sm",
  base: "base",
  default: "base",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
};

type ButtonSize = VariantProps<typeof buttonVariants>["size"];

// Map labeled button sizes to icon sizes (icons one step smaller than button)
const LABELED_ICON_SIZE_MAP: Partial<
  Record<NonNullable<ButtonSize>, ComponentSize>
> = {
  "2xs": "2xs",
  xs: "2xs",
  sm: "xs",
  base: "sm",
  default: "sm",
  lg: "base",
  xl: "lg",
  "2xl": "xl",
};
function labeledButtonSizeToIconSize(
  buttonSize: ButtonSize | undefined
): ComponentSize {
  const key = (buttonSize ?? "base") as NonNullable<ButtonSize>;
  return LABELED_ICON_SIZE_MAP[key] ?? "sm";
}

function Button({
  className,
  variant,
  appearance,
  mode,
  radius,
  underline,
  underlined,
  size,
  asChild = false,
  loading = false,
  loadingLabel,
  icon,
  iconPlacement = "start",
  dot,
  dotPlacement = "start",
  disabled,
  children,
  testId,
  ...props
}: WithTestId<
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
      loading?: boolean;
      loadingLabel?: string;
      icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
      iconPlacement?: "start" | "end";
      dot?: string;
      dotPlacement?: "start" | "end";
    }
>) {
  const Comp = asChild ? Slot : "button";
  const hasChildren = Children.count(children) > 0;

  // Determine effective mode (explicit prop wins; else infer from icon-only)
  const effectiveMode =
    mode ?? (icon && !hasChildren && !loading ? "icon" : "default");

  const spinnerSize = SIZE_TO_COMPONENT_SIZE[size ?? "base"];
  const iconSize: ComponentSize = labeledButtonSizeToIconSize(size);
  const dotSize: ComponentSize = labeledButtonSizeToIconSize(size);

  const renderContent = () => {
    const dotElement = dot ? <Dot color={dot} size={dotSize} /> : null;
    const iconElement = icon ? <Icon icon={icon} size={iconSize} /> : null;

    if (loading) {
      return (
        <>
          <Spinner size={spinnerSize} />
          {effectiveMode === "icon" ? null : (loadingLabel ?? children)}
        </>
      );
    }

    // Icon mode - just icon (with optional dot)
    if (effectiveMode === "icon" || (icon && !hasChildren)) {
      return (
        <>
          {dotPlacement === "start" && dotElement}
          <Icon icon={icon!} size={SIZE_TO_COMPONENT_SIZE[size ?? "base"]} />
          {dotPlacement === "end" && dotElement}
        </>
      );
    }

    // Labeled button with icon and/or dot
    if (icon && hasChildren) {
      if (iconPlacement === "start") {
        return (
          <>
            {dotPlacement === "start" && dotElement}
            {iconElement}
            {children}
            {dotPlacement === "end" && dotElement}
          </>
        );
      }
      return (
        <>
          {dotPlacement === "start" && dotElement}
          {children}
          {iconElement}
          {dotPlacement === "end" && dotElement}
        </>
      );
    }

    // Just text with optional dot
    if (hasChildren) {
      return (
        <>
          {dotPlacement === "start" && dotElement}
          {children}
          {dotPlacement === "end" && dotElement}
        </>
      );
    }

    return children;
  };

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          appearance,
          mode: effectiveMode,
          radius,
          underline,
          underlined,
          size,
          className,
        })
      )}
      data-component="button"
      data-slot="button"
      data-testid={testId}
      disabled={loading || disabled}
      {...props}
    >
      {renderContent()}
    </Comp>
  );
}

export { Button, buttonVariants };
