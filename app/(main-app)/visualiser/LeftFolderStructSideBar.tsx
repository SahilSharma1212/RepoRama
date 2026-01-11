'use client'

import { ListTree } from 'lucide-react'
import FolderTree from './FolderStructure'
import { useDataStore } from '@/app/store/dataStore'

export default function LeftFolderStructSideBar() {
    const { treeData } = useDataStore()

    return (
        <div
            style={{
                backgroundColor: '#111',
                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
            }}
            className="h-screen w-70 flex flex-col border-r border-white/10 max-md:hidden"
        >
            {/* Tabs */}
            <h1 className="flex items-center bg-[#151515] border-b border-white/10 text-gray-200 py-3 pl-5 text-md font-semibold gap-2">
                
                    <ListTree strokeWidth={1.5} /> Directory Tree

                
            </h1>

            {/* Content */}
            <div className="bg-[#151515] p-4 w-full flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
                {treeData && (
                    <FolderTree treeData={treeData} />
                )}

                
            </div>
        </div>
    )
}
