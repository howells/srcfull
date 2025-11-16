import { CollapsibleTrigger as CollapsiblePrimitiveTrigger } from "@radix-ui/react-collapsible";

export function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitiveTrigger>) {
  return (
    <CollapsiblePrimitiveTrigger
      data-component="collapsible-trigger"
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}
