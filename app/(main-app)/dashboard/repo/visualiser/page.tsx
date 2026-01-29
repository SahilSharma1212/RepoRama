'use client'

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import VisGraph from "@/components/TreeNetwork";
import { NetworkSkeleton } from "@/components/NetworkSkeleton";
import TopBar from "../../../visualiser/TopBar";
import { useDataStore } from "@/app/store/dataStore";
import LeftFolderStructSideBar from "@/components/LeftFolderStructSideBar";
import RightInfoSideBar from '@/components/RightInfoSideBar'
import useUIStore from "@/app/store/uiStore";
import { ListTree } from "lucide-react";
import RightSideAnimatedMiniBar from "@/components/RightSideAnimatedMiniBar";

export default function Page() {
    const searchParams = useSearchParams();
    const repoOwner = searchParams.get('repoOwner');
    const repoName = searchParams.get('repoName');

    const { treeData, loading, error, fetchTree, fetchBranches, setRepoInfo } = useDataStore();
    const { isLeftBarHidden, toggleLeftBarVisibility, toggleRightBarVisibility, isRightBarHidden } = useUIStore();

    useEffect(() => {
        if (repoOwner && repoName) {
            setRepoInfo({ owner: repoOwner, name: repoName });
            fetchTree(repoOwner, repoName);
            fetchBranches(repoOwner, repoName);
        }
    }, [repoOwner, repoName, fetchTree, fetchBranches, setRepoInfo]);

    if (!repoOwner || !repoName) {
        return (
            <div className="flex w-screen h-screen items-center justify-center bg-[#111] text-white">
                <div className="text-center">
                    <h1 className="text-2xl mb-2">Missing Repository Information</h1>
                    <p className="text-gray-400">Please provide repoOwner and repoName in the URL</p>
                </div>
            </div>
        );
    }

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
