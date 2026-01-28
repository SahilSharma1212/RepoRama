'use client'

import { useEffect } from "react";
import VisGraph from "@/components/TreeNetwork";
import { NetworkSkeleton } from "../../../components/NetworkSkeleton";
import TopBar from "./TopBar";
import { useDataStore } from "@/app/store/dataStore";
import LeftFolderStructSideBar from "../../../components/LeftFolderStructSideBar";
import RightInfoSideBar from '../../../components/RightInfoSideBar'
import useUIStore from "@/app/store/uiStore";
import { ListTree } from "lucide-react";
import RightSideAnimatedMiniBar from "@/components/RightSideAnimatedMiniBar";

export default function Page() {
    const { treeData, loading, error, fetchTree } = useDataStore();
    const { isLeftBarHidden, toggleLeftBarVisibility, toggleRightBarVisibility, isRightBarHidden } = useUIStore();

    useEffect(() => {
        fetchTree();
    }, [fetchTree]);

    if (loading) return <NetworkSkeleton />;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex w-screen h-screen overflow-hidden">
            {/* Folder tree sidebar */}
            <LeftFolderStructSideBar />

            {/* Left sidebar toggle button */}
            {isLeftBarHidden && (
                <button
                    className="fixed top-5 left-5 md:top-5 max-md:top-auto max-md:bottom-5 z-50 bg-[#222] text-white p-2 rounded hover:bg-[#333] transition-colors"
                    onClick={toggleLeftBarVisibility}
                    title="Show Directory Tree"
                    aria-label="Show Directory Tree"
                >
                    <ListTree strokeWidth={1.5} size={20} className="text-gray-300" />
                </button>
            )}

            <div className="relative flex-1 h-full">
                <TopBar />
                {treeData && <VisGraph treeData={treeData} />}
            </div>

            <RightInfoSideBar />

            {/* Right sidebar toggle button */}
            {isRightBarHidden && (
                <button
                    className="fixed top-5 right-5 md:top-5 max-md:top-auto max-md:bottom-5 z-50 bg-[#222] text-white p-2 rounded hover:bg-[#333] transition-colors"
                    onClick={toggleRightBarVisibility}
                    title="Show Info Panel"
                    aria-label="Show Info Panel"
                >
                    <RightSideAnimatedMiniBar />
                </button>
            )}
        </div>
    );
}