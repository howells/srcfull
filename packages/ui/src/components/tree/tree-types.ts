export type TreeNode<T = unknown> = {
  id: string;
  name: string;
  children?: TreeNode<T>[];
  data?: T;
};

export type TreeItemData<T = unknown> = {
  id: string;
  name: string;
  childrenIds?: string[];
  data?: T;
};

export type TreeDataStructure<T = unknown> = {
  [key: string]: TreeItemData<T>;
};
