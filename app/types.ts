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
    github_repos_url?: string;
    clerk_user_id?: string; // assuming UUID stored as string
    created_at?: string;  // DB timestamp as ISO string
    id?: number;          // internal DB ID
};



export type GithubApiProfile = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
};


export interface RepoData {
    name?: string
    full_name?: string
    description?: string
    html_url?: string
    owner?: {
        login?: string
        avatar_url?: string
    }
    created_at?: string
    updated_at?: string
    pushed_at?: string
    stargazers_count?: number
    watchers_count?: number
    forks_count?: number
    open_issues_count?: number
    language?: string
    default_branch?: string
    topics?: string[]
    visibility?: string
    size?: number
}

export interface LanguageData {
    [key: string]: number
}

export interface Contributor {
    login: string
    avatar_url: string
    contributions: number
    html_url: string
}

export interface GitUser {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    user_view_type: string
    site_admin: boolean
}

export interface CommitAuthor {
    name: string
    email: string
    date: string
}

export interface CommitTree {
    sha: string
    url: string
}

export interface CommitVerification {
    verified: boolean
    reason: string
    signature: null | string
    payload: null | string
    verified_at: null | string
}

export interface CommitDetails {
    author: CommitAuthor
    committer: CommitAuthor
    message: string
    tree: CommitTree
    url: string
    comment_count: number
    verification: CommitVerification
}

export interface CommitParent {
    sha: string
    url: string
    html_url: string
}

export interface Commit {
    sha: string
    node_id: string
    commit: CommitDetails
    url: string
    html_url: string
    comments_url: string
    author: GitUser | null
    committer: GitUser | null
    parents: CommitParent[]
}

export interface Branch {
    name: string
    commit: {
        sha: string
        url: string
    }
    protected: boolean
}

export interface TreeItem {
    path: string
    mode: string
    type: 'blob' | 'tree'
    sha: string
    size?: number
    url: string
}

export interface Tree {
    sha: string
    url: string
    tree: TreeItem[]
    truncated: boolean
}
