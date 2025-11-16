import type { TreeDataStructure, TreeNode } from "./tree-types";

/**
 * Converts hierarchical tree nodes into the flat data structure required by headless-tree
 */
export function buildTreeDataStructure<T = unknown>(
  nodes: TreeNode<T>[],
  rootId = "root"
): { dataStructure: TreeDataStructure<T>; rootItemId: string } {
  const rootChildrenIds = nodes.map((n) => n.id);
  const dataStructure: TreeDataStructure<T> = {
    [rootId]: {
      id: rootId,
      name: "Root",
      childrenIds: rootChildrenIds,
      isFolder: rootChildrenIds.length > 0,
    },
  };

  function processNode(node: TreeNode<T>): void {
    const childrenIds = node.children?.map((c) => c.id) ?? [];
    dataStructure[node.id] = {
      id: node.id,
      name: node.name,
      childrenIds,
      isFolder: childrenIds.length > 0,
      data: node.data,
    };

    if (node.children) {
      for (const child of node.children) {
        processNode(child);
      }
    }
  }

  for (const node of nodes) {
    processNode(node);
  }

  return { dataStructure, rootItemId: rootId };
}
