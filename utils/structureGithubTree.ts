    // Type definitions
interface GitHubTreeItem {
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
    url: string;
}

export interface TreeNode {
    name: string;
    type: "file" | "dir";
    path: string;
    url: string;
    children: TreeNode[];
}


export function structureGitHubTree(flatTree: GitHubTreeItem[]): TreeNode[] {
    const root: TreeNode[] = [];

    flatTree.forEach((item) => {
        // Split the path into parts, e.g., "backend/src/db/dbConnect.js" => ["backend", "src", "db", "dbConnect.js"]
        const parts = item.path.split("/");

        let currentLevel = root;

        parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;

        // Check if this node already exists at the current level
        let node = currentLevel.find((n) => n.name === part);

        if (!node) {
            // Create new node
            node = {
            name: part,
            type: isLast ? (item.type === "tree" ? "dir" : "file") : "dir",
            path: item.path,
            url: item.url,
            children: [],
            };
            currentLevel.push(node);
        }

        // Move deeper if it's a directory
        if (node.type === "dir") {
            currentLevel = node.children;
        }
        });
    });

    return root;
}
