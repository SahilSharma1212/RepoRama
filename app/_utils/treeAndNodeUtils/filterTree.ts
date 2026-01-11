import type { TreeNode } from "../../types";

/**
 * Filter out hidden nodes from the tree recursively
 */
export function filterTree(treeData: TreeNode[], hiddenNodes: Set<string>): TreeNode[] {
    return treeData
        .filter(node => !hiddenNodes.has(node.path))
        .map(node => {
            if (node.type === 'dir' && node.children.length > 0) {
                return {
                    ...node,
                    children: filterTree(node.children, hiddenNodes)
                };
            }
            return node;
        });
}