'use client';

import { File, Folder, Search, GitBranch, ChevronDown, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDataStore } from '@/app/store/dataStore';
import type { GitHubTreeItem, TreeNode } from '@/app/types';
import { findTreeNodeByPath } from '@/app/_utils/treeAndNodeUtils/findNodeByTreePath';

export default function TopBar() {
    const {
        performSearch,
        setSearchVal,
        searchResults,
        setSelectedNode,
        treeData,
        branches,
        currentBranch,
        branchesLoading,
        fetchTree,
        repoInfo,
    } = useDataStore();
    const searchTimeRef = useRef<number | null>(null);

    const [inputVal, setInputVal] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [showBranchDropdown, setShowBranchDropdown] = useState<boolean>(false);

    const handleSearch = (val: string) => {
        setInputVal(val);
        setSearchVal(val);

        if (searchTimeRef.current) clearTimeout(searchTimeRef.current);

        searchTimeRef.current = window.setTimeout(() => {
            performSearch(val);
            setShowDropdown(true);
        }, 300);
    };

    const handleSelectNode = (item: GitHubTreeItem) => {
        // Try to find the actual TreeNode from treeData
        let node: TreeNode | null = null;

        if (treeData) {
            node = findTreeNodeByPath(treeData, item.path);
        }

        // Fallback: if not found, create a new TreeNode (for files, this is fine)
        if (!node) {
            node = {
                name: item.path.split('/').pop() || item.path,
                type: item.type === 'tree' ? 'dir' : 'file',
                path: item.path,
                url: item.url,
                children: [],
            };
        }

        setSelectedNode(node);
        setShowDropdown(false);
        setInputVal('');
    };

    const handleBranchChange = (branchName: string) => {
        if (repoInfo && branchName !== currentBranch) {
            fetchTree(repoInfo.owner, repoInfo.name, branchName);
        }
        setShowBranchDropdown(false);
    };

    return (
        <div className="absolute top-0 z-40 w-full flex flex-col items-center pt-4">
            <div className="flex items-center gap-3 w-full max-w-[90%] md:max-w-xl justify-center">
                {/* Branch selector */}
                <div className="relative">
                    <button
                        className="flex items-center gap-2 bg-white/15 px-3 py-2 backdrop-blur-3xl rounded-md text-white text-sm hover:bg-white/20 transition-all duration-200"
                        onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                        onBlur={() => setTimeout(() => setShowBranchDropdown(false), 200)}
                    >
                        {branchesLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <GitBranch className="w-4 h-4" />
                        )}
                        <span className="max-w-[100px] truncate">{currentBranch}</span>
                        <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Branch dropdown */}
                    {showBranchDropdown && branches.length > 0 && (
                        <div className="absolute top-full mt-1 left-0 w-48 bg-[#222]/95 backdrop-blur-md rounded-md shadow-lg max-h-60 overflow-y-auto z-50 custom-scrollbar">
                            {branches.map((branch) => (
                                <button
                                    key={branch.name}
                                    className={`w-full text-left px-3 py-2 text-sm transition flex items-center gap-2 ${branch.name === currentBranch
                                        ? 'bg-white/20 text-white'
                                        : 'text-gray-300 hover:bg-gray-500/30 hover:text-white'
                                        }`}
                                    onClick={() => handleBranchChange(branch.name)}
                                >
                                    <GitBranch className="w-3 h-3" />
                                    <span className="truncate">{branch.name}</span>
                                    {branch.protected && (
                                        <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">
                                            protected
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search box */}
                <div className="relative flex-1 max-w-55 bg-white/15 px-3 py-2 md:px-4 backdrop-blur-3xl rounded-md flex items-center gap-2 md:gap-3 transition-all duration-300 z-40">
                    <input
                        placeholder='Type "/" to search'
                        value={inputVal}
                        className="w-full placeholder-white/50 text-white bg-transparent outline-none focus:outline-none text-sm md:text-base"
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => inputVal && setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // allow click
                    />
                    <Search className="text-white/50 w-4 h-4 md:w-5 md:h-5" />
                </div>
            </div>

            {/* Dropdown results */}
            {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-14 w-full max-w-[90%] md:max-w-md bg-[#222]/90 backdrop-blur-md rounded-md shadow-lg max-h-80 overflow-y-auto z-50 overflow-x-hidden custom-scrollbar">
                    {searchResults.map((item: GitHubTreeItem) => (
                        <button
                            key={item.path}
                            className="w-full text-left px-4 py-2 hover:bg-gray-500/30 text-white text-sm transition flex gap-1"
                            onClick={() => handleSelectNode(item)}
                        >
                            {item.type === 'tree' ? <Folder /> : <File />} {item.path}
                        </button>
                    ))}
                </div>
            )}

            {/* Optional: no results */}
            {showDropdown && searchResults.length === 0 && inputVal && (
                <div className="absolute top-14 w-full max-w-[90%] md:max-w-md bg-[#222]/90 backdrop-blur-md rounded-md shadow-lg px-4 py-2 text-white/50 text-sm">
                    No results found
                </div>
            )}
        </div>
    );
}
