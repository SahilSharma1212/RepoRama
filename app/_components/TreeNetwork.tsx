'use client'

import { useEffect, useRef } from "react";
import { Network, Data, Node, Edge, Options } from "vis-network/standalone";
import type { TreeNode } from "../types";
import { getFolderColor } from "@/app/_utils/folderColors";
import { fileColors } from "../_utils/treeAndNodeUtils/fileColors";
import { useDataStore } from "@/app/store/dataStore";
import { filterTree } from "@/app/_utils/treeAndNodeUtils/filterTree";

interface VisGraphProps {
    treeData: TreeNode[];
}

export default function VisGraph({ treeData }: VisGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setSelectedNode, hiddenNodes } = useDataStore();

    useEffect(() => {
        if (!containerRef.current) return;

        // Filter out hidden nodes
        const filteredTreeData = filterTree(treeData, hiddenNodes);

        const nodes: Node[] = [];
        const edges: Edge[] = [];

        let idCounter = 0;
        const idToNodeMap: Record<number, TreeNode> = {};

        const traverse = (node: TreeNode, parentId: number | null = null, depth: number = 0) => {
            const nodeId = idCounter++;

            const isFile = !node.children || node.children.length === 0;
            const color = isFile
                ? fileColors[node.name.split('.').pop() || 'default'] || { background: '#555', border: '#333' }
                : getFolderColor(node.name);

            const baseFontSize = 10;
            const basePadding = 7;
            const depthMultiplier = depth === 0 ? 2 : 1.4;
            const fontSize = baseFontSize * depthMultiplier;
            const marginSize = basePadding * depthMultiplier;

            nodes.push({
                id: nodeId,
                label: node.name,
                shape: "box",
                margin: {
                    top: marginSize,
                    right: marginSize + 4,
                    bottom: marginSize,
                    left: marginSize + 4,
                },
                color: {
                    background: color.background,
                    border: color.border,
                    highlight: {
                        background: color.background,
                        border: color.border,
                    }
                },
                font: { color: "#fff", size: fontSize },
            });

            idToNodeMap[nodeId] = node;

            if (parentId !== null) {
                edges.push({ from: parentId, to: nodeId });
            }

            node.children?.forEach(child => traverse(child, nodeId, depth + 1));
        };

        filteredTreeData.forEach(node => traverse(node));

        const data: Data = { nodes, edges };

        const options: Options = {
            layout: { hierarchical: false },
            nodes: { font: { size: 16, color: '#fff' }, borderWidth: 2 },
            edges: {
                arrows: "to",
                smooth: { enabled: true, type: "dynamic", roundness: 0.5 },
            },
            physics: {
                enabled: true,
                stabilization: false,
                barnesHut: { gravitationalConstant: -2000, springLength: 150, springConstant: 0.01 },
            },
            interaction: { dragNodes: true, dragView: true, zoomView: true },
        };

        const network = new Network(containerRef.current, data, options);

        // ---- Node click handler ----
        network.on("click", (params) => {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const nodeData = idToNodeMap[nodeId];
                if (nodeData) {
                    setSelectedNode(nodeData);
                }
            }
        });

    }, [treeData, hiddenNodes, setSelectedNode]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#111",
                backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                cursor: "pointer"
            }}
        />
    );
}