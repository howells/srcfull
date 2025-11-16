/**
 * Shared Storybook utilities and configurations
 */

/**
 * All available component sizes in the design system
 */
export const COMPONENT_SIZES = [
  "2xs",
  "xs",
  "sm",
  "base",
  "default",
  "lg",
  "xl",
  "2xl",
] as const;

/**
 * Reusable size argType configuration for Storybook controls
 */
export const sizeArgType = {
  control: "select",
  options: COMPONENT_SIZES,
  description: "Component size following the design system scale",
};

/**
 * Common variant options for buttons, toggles, etc.
 */
export const COMMON_VARIANTS = ["default", "outline"] as const;

/**
 * Reusable variant argType configuration
 */
export const variantArgType = {
  control: "select",
  options: COMMON_VARIANTS,
  description: "Visual variant of the component",
};
