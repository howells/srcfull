import { cn } from "@repo/ui/utils/cn";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./card";
import { Icon } from "./icon";

type AttributeCardProps = {
  attributeLabel: string;
  valueLabel: string;
  valueSubLabel?: string;
  icon?: LucideIcon | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
};

function AttributeCard({
  attributeLabel,
  valueLabel,
  valueSubLabel,
  icon,
  className,
}: AttributeCardProps) {
  return (
    <Card className={cn("relative", className)} data-component="attribute-card" variant="card">
      <CardContent>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-start justify-between">
            <CardTitle className="font-normal text-sm">
              {attributeLabel}
            </CardTitle>
            {icon && (
              <Icon className="text-muted-foreground" icon={icon} size="sm" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-2xl leading-tight">{valueLabel}</div>
            {valueSubLabel && (
              <CardDescription className="text-xs">
                {valueSubLabel}
              </CardDescription>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { AttributeCard };
export type { AttributeCardProps };
