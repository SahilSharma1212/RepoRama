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
            {/* Code structure to be displayed */}
            {/* Folder tree sidebar */}
            <LeftFolderStructSideBar />
            {isLeftBarHidden &&
                (<div className="absolute top-5 left-5 z-50 bg-[#222] text-white p-2 rounded hover:bg-[#333]"
                    onClick={toggleLeftBarVisibility}
                    title="Show Directory Tree"
                >
                    <ListTree strokeWidth={1.5} size={20} className="text-gray-300" />
                </div>
                )
            }
            <div className="relative flex-1 h-full">
                {/* flex-1 fills remaining width */}
                <TopBar />
                {treeData && <VisGraph treeData={treeData} />}
            </div>
            <RightInfoSideBar />
            {isRightBarHidden &&
                (<div className="absolute top-5 right-5 z-50 bg-[#222] text-white p-2 rounded hover:bg-[#333]"
                    onClick={toggleRightBarVisibility}
                    title="Show Directory Tree"
                >
                    <RightSideAnimatedMiniBar />
                </div>
                )
            }
        </div>
    );
}
