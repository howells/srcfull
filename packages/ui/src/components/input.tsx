import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/ui/utils/cn";
import { focusInput } from "@repo/ui/utils/focus-input";
import { hasErrorInput } from "@repo/ui/utils/has-error-input";
import type { WithTestId } from "@repo/ui/utils/test-id";
import * as React from "react";
import { Copy, X } from "lucide-react";
import type { ComponentSize } from "../lib/size";

const inputVariants = cva(
  "w-full min-w-0 border border-border bg-input-bg outline-none transition-colors selection:bg-primary selection:text-primary-foreground file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      size: {
        "2xs": "h-6 px-2 py-0.5 text-xs file:h-4 file:text-xs",
        xs: "h-7 px-2.5 py-1 text-xs file:h-5 file:text-xs",
        sm: "h-8 px-2.5 py-1 text-sm file:h-6 file:text-xs",
        base: "h-9 px-3 py-1.5 text-sm file:h-7 file:text-sm",
        lg: "h-10 px-3.5 py-2 text-base file:h-8 file:text-sm",
        xl: "h-11 px-4 py-2 text-base file:h-9 file:text-base",
        "2xl": "h-12 px-5 py-2.5 text-lg file:h-10 file:text-base",
      },
      radius: {
        default: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "base",
      radius: "default",
    },
  }
);

const inputGroupVariants = cva(
  "relative flex items-center w-full border border-border bg-input-bg transition-colors",
  {
    variants: {
      size: {
        "2xs": "h-6",
        xs: "h-7",
        sm: "h-8",
        base: "h-9",
        lg: "h-10",
        xl: "h-11",
        "2xl": "h-12",
      },
      radius: {
        default: "rounded-md",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "base",
      radius: "default",
    },
  }
);

const inputInGroupVariants = cva(
  "flex-1 min-w-0 border-0 bg-transparent shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:border-0 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      size: {
        "2xs": "h-6 px-2 py-0.5 text-xs",
        xs: "h-7 px-2.5 py-1 text-xs",
        sm: "h-8 px-2.5 py-1 text-sm",
        base: "h-9 px-3 py-1.5 text-sm",
        lg: "h-10 px-3.5 py-2 text-base",
        xl: "h-11 px-4 py-2 text-base",
        "2xl": "h-12 px-5 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      size: "base",
    },
  }
);

const addonVariants = cva(
  "flex items-center justify-center whitespace-nowrap border-border bg-muted px-3 text-muted-foreground text-sm",
  {
    variants: {
      position: {
        left: "border-r rounded-l-md",
        right: "border-l rounded-r-md",
      },
      size: {
        "2xs": "h-6 px-2 text-xs",
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-2.5 text-xs",
        base: "h-9 px-3 text-sm",
        lg: "h-10 px-3.5 text-sm",
        xl: "h-11 px-4 text-base",
        "2xl": "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      position: "left",
      size: "base",
    },
  }
);

const iconWrapperVariants = cva("absolute flex items-center justify-center pointer-events-none", {
  variants: {
    position: {
      left: "left-3",
      right: "right-3",
    },
    size: {
      "2xs": "w-3 h-3",
      xs: "w-3.5 h-3.5",
      sm: "w-4 h-4",
      base: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-5 h-5",
      "2xl": "w-6 h-6",
    },
  },
  defaultVariants: {
    position: "left",
    size: "base",
  },
});

type InputProps = WithTestId<Omit<React.ComponentProps<"input">, "size">> &
  VariantProps<typeof inputVariants>;

function Input({ className, type, testId, size, radius, ...props }: InputProps) {
  return (
    <input
      className={cn(
        inputVariants({ size, radius }),
        focusInput,
        hasErrorInput,
        className
      )}
      data-component="input"
      data-slot="input"
      data-testid={testId}
      type={type}
      {...props}
    />
  );
}

// Input Group for complex layouts with addons/icons
type InputGroupProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputGroupVariants> & {
    hasError?: boolean;
  };

function InputGroup({
  className,
  size,
  radius,
  hasError,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div
      className={cn(
        inputGroupVariants({ size, radius }),
        focusInput,
        hasError && hasErrorInput,
        "focus-within:ring-1 focus-within:ring-ring/30 focus-within:border-ring/50",
        className
      )}
      data-component="input-group"
      {...props}
    >
      {children}
    </div>
  );
}

// Input within a group (no border, no shadow)
type InputInGroupProps = WithTestId<React.ComponentProps<"input">> &
  VariantProps<typeof inputInGroupVariants>;

function InputInGroup({
  className,
  size,
  testId,
  ...props
}: InputInGroupProps) {
  return (
    <input
      className={cn(inputInGroupVariants({ size }), className)}
      data-component="input-in-group"
      data-testid={testId}
      {...props}
    />
  );
}

// Addon (left or right text)
type InputAddonProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof addonVariants>;

function InputAddon({
  className,
  position,
  size,
  children,
  ...props
}: InputAddonProps) {
  return (
    <div
      className={cn(addonVariants({ position, size }), className)}
      data-component="input-addon"
      {...props}
    >
      {children}
    </div>
  );
}

// Icon wrapper (left or right icon)
type InputIconProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof iconWrapperVariants>;

function InputIcon({
  className,
  position,
  size,
  children,
  ...props
}: InputIconProps) {
  return (
    <div
      className={cn(iconWrapperVariants({ position, size }), className)}
      data-component="input-icon"
      {...props}
    >
      {children}
    </div>
  );
}

// Clear button
type InputClearProps = {
  onClear: () => void;
  size?: "sm" | "base" | "lg";
  className?: string;
};

function InputClear({ onClear, size = "base", className }: InputClearProps) {
  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  return (
    <button
      type="button"
      onClick={onClear}
      className={cn(
        "absolute right-2 flex items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-auto",
        className
      )}
      data-component="input-clear"
      aria-label="Clear input"
    >
      <X size={iconSize} />
    </button>
  );
}

// Copy button
type InputCopyProps = {
  value: string;
  size?: "sm" | "base" | "lg";
  className?: string;
  onCopy?: () => void;
};

function InputCopy({
  value,
  size = "base",
  className,
  onCopy,
}: InputCopyProps) {
  const [copied, setCopied] = React.useState(false);
  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "absolute right-2 flex items-center justify-center rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pointer-events-auto",
        className
      )}
      data-component="input-copy"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      <Copy size={iconSize} />
      {copied && (
        <span className="ml-1 text-xs text-green-600 dark:text-green-400">
          Copied!
        </span>
      )}
    </button>
  );
}

export { Input, InputGroup, InputInGroup, InputAddon, InputIcon, InputClear, InputCopy };
export type { ComponentSize as InputSize, InputProps };
