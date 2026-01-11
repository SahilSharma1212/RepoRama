import { create } from "zustand";
import type { GitHubTreeItem, TreeNode } from "../types";
import { fetchGitHubTree } from "../_utils/treeAndNodeUtils/fetchGithubTree";
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

interface DataStore {
    flatTree: GitHubTreeItem[] | null;
    treeData: TreeNode[] | null;
    loading: boolean;
    error: string | null;
    fetchTree: () => Promise<void>;
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
}

export const useDataStore = create<DataStore>((set, get) => ({
    treeData: null,
    flatTree: null,
    loading: false,
    error: null,
    searchVal: "",
    searchResults: [],

    fetchTree: async () => {
        set({ loading: true, error: null });
        try {
            const flatTree = await fetchGitHubTree();
            const structuredTree = structureGitHubTree(flatTree);

            set({
                flatTree,
                treeData: structuredTree,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        } finally {
            set({ loading: false });
        }
    },

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
