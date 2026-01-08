import type { ItemInstance } from "@headless-tree/react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../button";

export type TreeItemProps = {
  item: ItemInstance;
  onItemClick?: () => void;
  renderLabel?: () => React.ReactNode;
};

export function TreeItem({ item, onItemClick, renderLabel }: TreeItemProps) {
  const itemMeta = item.getItemMeta();
  const itemData = item.getItemData();

  // Workaround: directly check the data for isFolder since itemMeta.isFolder is not being populated
  const isFolder = itemData?.isFolder ?? false;
  // Use item.isExpanded() method instead of itemMeta.isExpanded property
  const isExpanded = item.isExpanded();
  const level = itemMeta.level;

  console.log("TreeItem render:", {
    name: itemData?.name,
    isFolder,
    isExpanded,
    itemMeta,
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Clicking folder:", itemData?.name, "isExpanded:", isExpanded);
    if (isExpanded) {
      console.log("Calling collapse");
      item.collapse();
    } else {
      console.log("Calling expand");
      item.expand();
    }
  };

  return (
    <div
      {...item.getProps()}
      className={cn(
        "flex items-center gap-1 border-border/50 border-b px-2 py-1.5 text-sm transition-colors",
        itemMeta.isFocused && "bg-accent/50",
        itemMeta.isSelected && "bg-primary/10"
      )}
      onClick={onItemClick}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
    >
      {isFolder ? (
        <Button
          appearance="ghost"
          className={cn("transition-transform", isExpanded && "rotate-90")}
          icon={ChevronRight}
          mode="icon"
          onClick={handleToggle}
          size="2xs"
        />
      ) : (
        <div className="h-6 w-6" />
      )}
      <span className="flex-1 truncate">
        {renderLabel ? renderLabel() : item.getItemName()}
      </span>
    </div>
  );
}
