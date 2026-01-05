'use client'

import { searchTreeData } from "@/utils/searchTreeData";
import { structureGitHubTree } from "@/utils/structureGithubTree";
import { useEffect, useState } from "react";
import type { TreeNode } from "@/utils/structureGithubTree";
import VisGraph from "@/app/_components/TreeNetwork";
import NetworkSkeleton from "../_components/NetworkSkeleton";

export default function Page() {
    const [treeData, setTreeData] = useState<TreeNode[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndBuildTree = async () => {
            try {
                setLoading(true);
                const flatTree = await searchTreeData(); // fetch flattened GitHub tree
                const structuredTree = structureGitHubTree(flatTree); // build nested tree
                setTreeData(structuredTree); // store in state
            } catch (error) {
                console.error("Error fetching/building tree:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndBuildTree();
    }, []);

    if (loading) return <NetworkSkeleton/>;

    return (
        <div>
            <VisGraph treeData={treeData!} />
        </div>
    );
}
