export interface TreeNode<T = unknown> {
  id: string;
  name: string;
  children?: TreeNode<T>[];
  data?: T;
}

export interface TreeItemData<T = unknown> {
  id: string;
  name: string;
  childrenIds?: string[];
  data?: T;
}

export interface TreeDataStructure<T = unknown> {
  [key: string]: TreeItemData<T>;
}
