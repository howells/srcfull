import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core";
import type { ItemInstance } from "@headless-tree/react";
import { useTree } from "@headless-tree/react";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { TreeItem } from "./tree-item";
import type { TreeNode } from "./tree-types";
import { buildTreeDataStructure } from "./tree-utils";

export type TreeRootProps<T = unknown> = {
  data: TreeNode<T>[];
  onItemClick?: (item: ItemInstance, data?: T) => void;
  renderLabel?: (item: ItemInstance, data?: T) => React.ReactNode;
  defaultExpandedIds?: string[];
  className?: string;
};

export function TreeRoot<T = unknown>({
  data,
  onItemClick,
  renderLabel,
  defaultExpandedIds = [],
  className,
}: TreeRootProps<T>) {
  const { dataStructure, rootItemId } = useMemo(
    () => buildTreeDataStructure(data),
    [data]
  );

  console.log("TreeRoot dataStructure sample:", {
    rootId: rootItemId,
    root: dataStructure[rootItemId],
    firstChild: dataStructure[dataStructure[rootItemId]?.childrenIds?.[0]],
  });

  const tree = useTree({
    rootItemId,
    getItemName: (item) => {
      const data = item.getItemData();
      console.log("getItemName:", data?.name);
      return data.name;
    },
    isItemFolder: (item) => {
      const data = item.getItemData();
      const result = Boolean(data?.isFolder);
      console.log(
        "isItemFolder:",
        data?.name,
        "isFolder:",
        data?.isFolder,
        "result:",
        result
      );
      return result;
    },
    dataLoader: {
      getItem: (itemId) => {
        const item = dataStructure[itemId];
        console.log("getItem:", itemId, "item:", item);
        return item;
      },
      getChildren: (itemId) => {
        const children = dataStructure[itemId]?.childrenIds ?? [];
        console.log("getChildren:", itemId, "children:", children);
        return children;
      },
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature, selectionFeature],
    defaultExpandedItems: defaultExpandedIds,
  });

  const items = tree.getItems();

  return (
    <div {...tree.getContainerProps()} className={cn("w-full", className)}>
      {items.map((item) => {
        const itemId = item.getId();
        const itemData = dataStructure[itemId]?.data;

        return (
          <TreeItem
            item={item}
            key={itemId}
            onItemClick={
              onItemClick ? () => onItemClick(item, itemData) : undefined
            }
            renderLabel={
              renderLabel ? () => renderLabel(item, itemData) : undefined
            }
          />
        );
      })}
    </div>
  );
}
