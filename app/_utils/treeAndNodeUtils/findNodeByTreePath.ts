import type { TreeNode } from "../../types";

/**
 * Recursively find a TreeNode by its path
 */
export function findTreeNodeByPath(treeData: TreeNode[], path: string): TreeNode | null {
    for (const node of treeData) {
        if (node.path === path) {
            return node;
        }
        if (node.children && node.children.length > 0) {
            const found = findTreeNodeByPath(node.children, path);
            if (found) {
                return found;
            }
        }
    }
    return null;
}