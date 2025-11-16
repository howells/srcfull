import { cn } from "@materia/ui/utils/cn";
import { LoaderCircleIcon, type LucideProps } from "lucide-react";
import type { ComponentSize } from "../lib/size";

const SPINNER_PX: Record<ComponentSize, number> = {
  "2xs": 12,
  xs: 16,
  sm: 18,
  base: 20,
  lg: 24,
  xl: 28,
  "2xl": 32,
};

export type SpinnerProps = LucideProps & {
  size?: ComponentSize;
};

export function Spinner({ size = "base", className, ...props }: SpinnerProps) {
  const px = SPINNER_PX[size];
  return (
    <LoaderCircleIcon
      className={cn("animate-spin", className)}
      data-component="spinner"
      size={px}
      {...props}
    />
  );
}
