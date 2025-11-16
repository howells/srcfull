import type { Meta, StoryObj } from "@storybook/react";
import "@materia/tailwind-config/shared-styles.css";
import { AvatarRoot as Avatar } from "../avatar/avatar-root";
import { AvatarFallback } from "../avatar/avatar-fallback";
import { Badge } from "../badge";
import { Button } from "../button";
import { Collapsible } from "../collapsible/collapsible-root";
import { CollapsibleContent } from "../collapsible/collapsible-content";
import { CollapsibleTrigger } from "../collapsible/collapsible-trigger";
import {
  DetailsPanel,
  DetailsPanelProvider,
  useDetailsPanel,
} from "./details-panel-root";
import {
  DetailsPanelContent,
  DetailsPanelFooter,
  DetailsPanelHeader,
} from "./details-panel-layout";
import {
  DetailsPanelSection,
  DetailsPanelSectionAction,
  DetailsPanelSectionContent,
  DetailsPanelSectionLabel,
} from "./details-panel-section";
import { Separator } from "../separator";
import { Switch } from "../switch";

const meta = {
  title: "Details Panel",
  component: DetailsPanel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Responsive side panel for detailed information. Fixed panel on 2xl+ screens, Sheet overlay on smaller screens.",
      },
    },
  },
} satisfies Meta<typeof DetailsPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

function DemoContent() {
  return (
    <>
      <DetailsPanelHeader>
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">Project details</div>
        </div>
      </DetailsPanelHeader>
      <DetailsPanelContent>
        <DetailsPanelSection>
          <DetailsPanelSectionLabel>
            <div>Collaborators</div>
            <DetailsPanelSectionAction>
              <Button size="sm" variant="outline">
                Share
              </Button>
            </DetailsPanelSectionAction>
          </DetailsPanelSectionLabel>
          <DetailsPanelSectionContent>
            <div className="-space-x-2 flex items-center">
              <Avatar className="border">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar className="border">
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <Avatar className="border">
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
              <Button
                className="size-6 rounded-full text-xs"
                size="icon"
                variant="outline"
              >
                +
              </Button>
            </div>
          </DetailsPanelSectionContent>
        </DetailsPanelSection>

        <Separator />

        <DetailsPanelSection>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <button className="w-full">
                <DetailsPanelSectionLabel>
                  <div>Active requirements</div>
                </DetailsPanelSectionLabel>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <DetailsPanelSectionContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Notify stakeholders</span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Require reviews</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </DetailsPanelSectionContent>
            </CollapsibleContent>
          </Collapsible>
        </DetailsPanelSection>

        <DetailsPanelSection>
          <DetailsPanelSectionLabel>Project specs</DetailsPanelSectionLabel>
          <DetailsPanelSectionContent>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">Type A</Badge>
              <Badge variant="secondary">Internal</Badge>
              <Badge variant="secondary">v1.2.3</Badge>
            </div>
          </DetailsPanelSectionContent>
        </DetailsPanelSection>
      </DetailsPanelContent>
      <DetailsPanelFooter>
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </div>
      </DetailsPanelFooter>
    </>
  );
}

function Demo() {
  const panel = useDetailsPanel();
  const open = panel((s) => s.open);
  const toggle = panel((s) => s.toggle);

  return (
    <div className="min-h-[420px]">
      <div className="p-4">
        <Button onClick={toggle}>{open ? "Close" : "Open"} panel</Button>
      </div>
      <DetailsPanel>
        <DemoContent />
      </DetailsPanel>
      <div className="p-4 text-muted-foreground text-sm">
        Resize to 2xl to see fixed panel; smaller screens use Sheet.
      </div>
    </div>
  );
}

// Interactive story - basic example
export const Base: Story = {
  render: () => (
    <DetailsPanelProvider>
      <Demo />
    </DetailsPanelProvider>
  ),
};

// Docs-only stories showing comprehensive examples
export const WithCollapsibleSections: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: "Panel sections can be collapsible to organize complex information hierarchies.",
      },
    },
  },
  render: () => (
    <DetailsPanelProvider>
      <Demo />
    </DetailsPanelProvider>
  ),
};
