'use client'

import { ListTree, X } from 'lucide-react'
import FolderTree from '../(main-app)/visualiser/FolderStructure'
import { useDataStore } from '@/app/store/dataStore'
import useUIStore from '../store/uiStore'

export default function LeftFolderStructSideBar() {
    const { treeData } = useDataStore()
    const {isLeftBarHidden, toggleLeftBarVisibility} = useUIStore()
    return (
        <div
            style={{
                backgroundColor: '#111',
                backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
            }}
            className={`h-screen flex flex-col border-r border-white/10 max-md:hidden z-50 transition-all ${isLeftBarHidden ? "w-0 p-0 overflow-hidden" : 'w-70'} `}
        >
            {/* Tabs */}
            <nav className="flex justify-between items-center px-4 py-3 border-b border-white/10 text-base max-md:px-3 max-md:py-2 bg-[#151515]">

                <h1 className="font-semibold text-gray-300 flex items-center text-sm max-md:text-base">
                    <ListTree className="text-gray-400 w-4 h-4 max-md:w-5 max-md:h-5" />
                    <span className={'text-gray-400 ml-2'}>
                        Directory Tree
                    </span>
                </h1>

                <button 
                className='ml-2' 
                onClick={toggleLeftBarVisibility}
                >
                    <X className='text-gray-500 hover:text-gray-300 w-4 h-4 max-md:w-5 max-md:h-5 transition'/>
                </button>

            </nav>

            {/* Content */}
            <div className="bg-[#151515] p-4 w-full flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar">
                {treeData && (
                    <FolderTree treeData={treeData} />
                )}


            </div>
        </div>
    )
}
