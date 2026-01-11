// ir.ts
export type Field = {
    name: string;
    type: string;
    required?: boolean;
    unique?: boolean;
    isArray?: boolean;
};

export type Relationship = {
    from: string;
    to: string;
    type: "REFERENCE";
    cardinality: "ONE_TO_MANY" | "MANY_TO_ONE";
    field: string;
};

export type Entity = {
    name: string;
    fields: Field[];
    relationships: Relationship[];
};

export interface NodeColor {
    background: string;
    border: string;
    icon: string; // bright, readable on dark UI
}

export interface GitHubTreeItem {
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    size?: number; // only blobs have this
    url: string;
}

export interface GitHubTreeResponse {
    sha: string;
    url: string;
    tree: GitHubTreeItem[];
    truncated: boolean;
}

// TreeNode for nested representation
export interface TreeNode {
    name: string;
    type: "file" | "dir";
    path: string;
    url: string;
    children: TreeNode[];
}