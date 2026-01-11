import { create } from "zustand";
import type { GitHubTreeItem, TreeNode } from "../types";
import { fetchGitHubTree } from "../_utils/fetchGithubTree";
import { structureGitHubTree } from "../_utils/structureGithubTree";

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
}));
