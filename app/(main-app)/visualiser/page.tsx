'use client'

import { useEffect } from "react";
import VisGraph from "@/app/_components/TreeNetwork";
import { NetworkSkeleton } from "../../_components/NetworkSkeleton";
import TopBar from "./TopBar";
import { useDataStore } from "@/app/store/dataStore";
import LeftFolderStructSideBar from "./LeftFolderStructSideBar";
import RightInfoSideBar from "./RightInfoSideBar";
export default function Page() {
    const { treeData, loading, error, fetchTree } = useDataStore();
    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    if (loading) return <NetworkSkeleton />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex w-screen h-screen">
            {/* Code structure to be displayed */}
            {/* Folder tree sidebar */}

            <LeftFolderStructSideBar />
            <div className="relative flex-1 h-full">
                {/* flex-1 fills remaining width */}
                <TopBar />
                {treeData && <VisGraph treeData={treeData} />}
            </div>
            <RightInfoSideBar />
        </div>
    );
}
