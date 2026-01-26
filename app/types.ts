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

export interface GitHubBranch {
    name: string;
    protected: boolean;
    commit: {
        sha: string;
        url: string;
    };
}

export interface BranchStats {
    name: string;
    sha: string;
    protected: boolean;
}

export type GithubProfile = {
    github_login?: string;
    github_id?: number;
    github_node_id?: string;
    github_type?: string;
    github_avatar_url?: string;
    github_profile_url?: string;
    github_name?: string;
    github_company?: string;
    github_blog?: string;
    github_location?: string;
    github_bio?: string;
    github_email?: string;
    github_twitter_username?: string;
    github_site_admin?: boolean;
    github_public_repos?: number;
    github_public_gists?: number;
    github_followers?: number;
    github_following?: number;
    github_created_at?: string; // ISO date string
    github_updated_at?: string; // ISO date string
    github_followers_url?: string;
    github_following_url?: string;
    github_repos_url?: string;
    clerk_user_id?: string; // assuming UUID stored as string
    created_at?: string;  // DB timestamp as ISO string
    id?: number;          // internal DB ID
};
