export interface FileNode {
  type: 'file';
  name: string;
}

export interface FolderNode {
  type: 'folder';
  name: string;
  children: Array<FileNode | FolderNode>;
}

export type FileExplorerNode = FileNode | FolderNode;
