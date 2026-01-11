import type { GitHubTreeItem, TreeNode } from "../types";

/**
 * Convert flat GitHub tree into nested TreeNode[]
 */
export function structureGitHubTree(flatTree: GitHubTreeItem[]): TreeNode[] {
    const root: TreeNode[] = [];

    flatTree.forEach((item: GitHubTreeItem) => {
        const parts: string[] = item.path.split("/");
        let currentLevel: TreeNode[] = root;

        parts.forEach((part: string, index: number) => {
            const isLast: boolean = index === parts.length - 1;

            let node: TreeNode | undefined = currentLevel.find((n) => n.name === part);
            if (!node) {
                node = {
                    name: part,
                    type: isLast ? (item.type === "tree" ? "dir" : "file") : "dir",
                    path: item.path,
                    url: item.url,
                    children: [],
                };
                currentLevel.push(node);
            }

            if (node.type === "dir") {
                currentLevel = node.children;
            }
        });
    });

    return root;
}
