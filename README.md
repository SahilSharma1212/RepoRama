# Types Used

## GitHubTreeItem
Represents a single item (file or folder) returned by the GitHub API.  
Includes information like the path, type (`blob` for file, `tree` for folder), SHA, URL, and size (for files).

## GitHubTreeResponse
Represents the full response from GitHub when fetching a repository tree.  
Contains the SHA of the tree, the API URL, an array of `GitHubTreeItem`s, and a flag indicating if the tree was truncated.

## TreeNode
Represents a node in the nested tree structure used in the app after converting the flat GitHub tree.  
Includes the name, type (`file` or `dir`), path, URL, and an array of child `TreeNode`s.

---

# Zustand Store

## useDataStore
`useDataStore` is a state management store for handling GitHub repository trees.  
It provides both **flat** and **nested tree representations** of the repository and manages loading and error states.

### Store State

- `flatTree: GitHubTreeItem[] | null`  
  Flat array of GitHub files and directories.  
  Useful for searching, filtering, or analytics.

- `treeData: TreeNode[] | null`  
  Nested tree structure used for UI rendering in components like graphs or file explorers.

- `loading: boolean`  
  Indicates whether the GitHub tree is currently being fetched.

- `error: string | null`  
  Stores any error message encountered during the fetch.

### Store Functions / Actions

- `fetchTree: () => Promise<void>`  
  - Fetches the repository tree from GitHub using `fetchGitHubTree()`.  
  - Converts the flat tree into a nested tree using `structureGitHubTree()`.  
  - Updates `flatTree` and `treeData` in the store.  
  - Manages `loading` and `error` states automatically.

---

### Utility Functions Used

- `fetchGitHubTree()`  
  - Fetches the GitHub repository tree via the GitHub API.  
  - Returns a flat array of `GitHubTreeItem[]`.

- `structureGitHubTree(flatTree: GitHubTreeItem[]): TreeNode[]`  
  - Converts a flat GitHub tree array into a nested `TreeNode[]` suitable for UI rendering.  
  - Preserves folder/file hierarchy.
