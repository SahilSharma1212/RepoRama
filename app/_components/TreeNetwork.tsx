'use client'

import { useEffect, useRef } from "react";
import { Network, Data, Node, Edge, Options } from "vis-network/standalone";
import type { TreeNode } from "@/utils/structureGithubTree";
import { getFolderColor } from "@/utils/folderColors"; // folder colors
import { fileColors } from "../../utils/fileColors"; // file colors

interface VisGraphProps {
    treeData: TreeNode[];
}

export default function VisGraph({ treeData }: VisGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const nodes: Node[] = [];
        const edges: Edge[] = [];

        let idCounter = 0;



        // Recursive function to convert TreeNode to Vis nodes & edges
        const traverse = (node: TreeNode, parentId: number | null = null, depth: number = 0) => {
            const nodeId = idCounter++;

            const isFile = !node.children || node.children.length === 0;
            const color = isFile
                ? fileColors[node.name.split('.').pop() || 'default'] || { background: '#555', border: '#333' }
                : getFolderColor(node.name);

            // Node size based on depth
            const baseFontSize = 10;
            const basePadding = 7;
            const depthMultiplier = depth === 0 ? 2 : 1.4; // top-level nodes are bigger
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

                font: {
                    color: "#ffffff",
                    size: fontSize,
                },
            });

            if (parentId !== null) {
                edges.push({ from: parentId, to: nodeId });
            }

            node.children?.forEach((child) => traverse(child, nodeId, depth + 1));
        };


        treeData.forEach((node) => traverse(node));

        const data: Data = {
            nodes,
            edges,
        };

        const options: Options = {
            layout: {
                hierarchical: false,
            },
            nodes: {
                font: { size: 16, color: '#fff' },
                borderWidth: 2,
            },
            edges: {
                arrows: "to",
                smooth: {
                    enabled: true,
                    type: "dynamic",
                    roundness: 0.5,
                },
            },
            physics: {
                enabled: true,
                stabilization: false,
                barnesHut: {
                    gravitationalConstant: -2000,
                    springLength: 150,
                    springConstant: 0.01,
                },
            },
            interaction: {
                dragNodes: true,
                dragView: true,
                zoomView: true,
            },
        };

        new Network(containerRef.current, data, options);
    }, [treeData]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor: "#111", // base color
                backgroundImage:
                    "radial-gradient(#333 1px, transparent 1px)", // dot color & size
                backgroundSize: "20px 20px", // spacing between dots
                cursor:"pointer"
            }}

        />
    );
}
