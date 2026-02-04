'use client'

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useDataStore } from "@/app/store/dataStore";
import useUIStore from "@/app/store/uiStore";
import { ListTree } from "lucide-react";
import Link from "next/link";

// Dynamic Imports for Code Splitting
const VisGraph = dynamic(() => import("@/components/TreeNetwork"), {
    ssr: false,
});
const TopBar = dynamic(() => import("../../../visualiser/TopBar"), { ssr: false });
const LeftFolderStructSideBar = dynamic(() => import("@/components/LeftFolderStructSideBar"), { ssr: false });
const RightInfoSideBar = dynamic(() => import('@/components/RightInfoSideBar'), { ssr: false });
const RightSideAnimatedMiniBar = dynamic(() => import("@/components/RightSideAnimatedMiniBar"), { ssr: false });

export default function VisualiserPage() {
    const searchParams = useSearchParams();
    const repoOwner = searchParams.get('repoOwner');
    const repoName = searchParams.get('repoName');

    const { treeData, loading, error, fetchTree, fetchBranches, setRepoInfo, fetchRepoDetails } = useDataStore();
    const { isLeftBarHidden, toggleLeftBarVisibility, toggleRightBarVisibility, isRightBarHidden } = useUIStore();

    useEffect(() => {
        const init = async () => {
            if (repoOwner && repoName) {
                setRepoInfo({ owner: repoOwner, name: repoName });
                // Fetch details first to get the default branch
                await fetchRepoDetails(repoOwner, repoName);
                // Now fetch tree - it will use the default branch we just fetched
                fetchTree(repoOwner, repoName);
                fetchBranches(repoOwner, repoName);
            }
        };
        init();
    }, [repoOwner, repoName, fetchTree, fetchBranches, setRepoInfo, fetchRepoDetails]);

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

    if (error) return <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" />

        {/* Subtle dotted grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[24px_24px]" />

        {/* Content */}
        <div className="h-screen max-md:hidden w-1/5 bg-[#222]">

        </div>
        <div className="h-screen max-md:w-full w-3/5 flex items-center justify-center">
            <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-10 py-8 text-center shadow-2xl max-sm:scale-75">
                <span className="text-xs tracking-widest uppercase text-white/40">
                    Something went wrong
                </span>

                <h1 className="mt-2 text-4xl font-semibold text-white">
                    Error: {error}
                </h1>

                <button className="mt-5 bg-white/10 border border-white/20 px-4 py-2 rounded text-sm text-white/50 hover:bg-white/20 hover:text-white transition-all duration-200">
                    <Link href={'/dashboard'}>
                        Return to dashboard
                    </Link>
                </button>
            </div></div>
        <div className="h-screen max-md:hidden w-1/5 bg-[#222]"></div>

    </div>;

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
