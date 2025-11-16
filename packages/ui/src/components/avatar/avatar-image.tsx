"use client";

import { cn } from "@materia/ui/utils/cn";
import { Image as AvatarImagePrimitive } from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";

export type AvatarImageProps = ComponentProps<typeof AvatarImagePrimitive>;

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarImagePrimitive
      className={cn("aspect-square size-full object-cover", className)}
      data-component="avatar-image"
      data-slot="avatar-image"
      {...props}
    />
  );
}
