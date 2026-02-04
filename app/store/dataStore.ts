import { create } from "zustand";
import type { GitHubTreeItem, TreeNode, Branch } from "../types";
import { fetchGitHubTree } from "../_utils/treeAndNodeUtils/fetchGithubTree";
import { fetchGitHubBranches } from "../_utils/treeAndNodeUtils/fetchBranches";
import { structureGitHubTree } from "../_utils/structureGithubTree";

interface Owner {
    login: string;
    avatar_url: string;
    html_url: string;
}

interface RepoStats {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    owner: Owner;
    html_url: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    watchers_count: number;
    open_issues_count: number;
    size: number;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    default_branch: string;
}

interface RepoInfo {
    owner: string;
    name: string;
}

interface DataStore {
    flatTree: GitHubTreeItem[] | null;
    treeData: TreeNode[] | null;
    loading: boolean;
    error: string | null;
    fetchTree: (owner: string, repo: string, branch?: string) => Promise<void>;
    searchVal: string;
    searchResults: GitHubTreeItem[];
    setSearchVal: (val: string) => void;
    performSearch: (val: string) => void;
    selectedNode: TreeNode | null;
    setSelectedNode: (val: TreeNode) => void;

    hiddenNodes: Set<string>; // using node name or id
    toggleNodeVisibility: (nodeId: string) => void;

    repoStats: RepoStats | null;
    setRepoStats: (data: RepoStats) => void;

    // Branch related state
    branches: Branch[];
    currentBranch: string;
    branchesLoading: boolean;
    fetchBranches: (owner: string, repo: string) => Promise<void>;
    setCurrentBranch: (branch: string) => void;

    // Current repo info
    repoInfo: RepoInfo | null;
    setRepoInfo: (info: RepoInfo) => void;
    fetchRepoDetails: (owner: string, repo: string) => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
    treeData: null,
    flatTree: null,
    loading: false,
    error: null,
    searchVal: "",
    searchResults: [],

    // Branch state
    branches: [],
    currentBranch: "",
    branchesLoading: false,

    // Repo info
    repoInfo: null,

    fetchRepoDetails: async (owner: string, repo: string) => {
        try {
            const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            if (!res.ok) throw new Error("Failed to fetch repo details");
            const data = await res.json();
            set({ repoStats: data });

            // Set default branch if currentBranch is empty
            if (!get().currentBranch) {
                set({ currentBranch: data.default_branch });
            }
        } catch (error) {
            console.error("Error fetching repo details:", error);
        }
    },

    fetchTree: async (owner: string, repo: string, branch?: string) => {
        // Priority: Argument > Current State > Repo Default Buffer > Hard fallback
        let branchToUse = branch || get().currentBranch;

        if (!branchToUse) {
            // If we have repo stats, use that default branch
            const stats = get().repoStats;
            if (stats?.default_branch) {
                branchToUse = stats.default_branch;
            } else {
                // Fallback if we haven't fetched details yet, though we should have
                branchToUse = "main";
            }
        }

        set({ loading: true, error: null });
        try {
            const flatTree = await fetchGitHubTree(owner, repo, branchToUse);
            const structuredTree = structureGitHubTree(flatTree);

            set({
                flatTree,
                treeData: structuredTree,
                currentBranch: branchToUse,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        } finally {
            set({ loading: false });
        }
    },

    fetchBranches: async (owner: string, repo: string) => {
        set({ branchesLoading: true });
        try {
            const branches = await fetchGitHubBranches(owner, repo);
            set({ branches });
        } catch (error) {
            console.error("Error fetching branches:", error);
            set({ branches: [] });
        } finally {
            set({ branchesLoading: false });
        }
    },

    setCurrentBranch: (branch: string) => set({ currentBranch: branch }),

    setRepoInfo: (info: RepoInfo) => set({ repoInfo: info }),

    setSearchVal: (val: string) => set({ searchVal: val }),

    performSearch: (val: string) => {
        const { flatTree } = get();
        if (!flatTree) return;

        const results = flatTree.filter((item) =>
            item.path.toLowerCase().includes(val.toLowerCase())
        );

        set({ searchResults: results });
    },
    selectedNode: null,
    setSelectedNode: (val: TreeNode) => {
        if (get().selectedNode == val) {
            set({ selectedNode: null });
        } else {
            set({ selectedNode: val });
        }
    },

    hiddenNodes: new Set(),
    toggleNodeVisibility: (nodeId: string) => {
        const hiddenNodes = new Set(get().hiddenNodes);
        if (hiddenNodes.has(nodeId)) hiddenNodes.delete(nodeId);
        else hiddenNodes.add(nodeId);
        set({ hiddenNodes });
    },
    repoStats: null,
    setRepoStats: (data) => set({ repoStats: data }),
}));

