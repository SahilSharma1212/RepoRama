'use client';

import { File, Folder, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { useDataStore } from '@/app/store/dataStore';
import type { GitHubTreeItem, TreeNode } from '@/app/types';

export default function TopBar() {
    const { performSearch, setSearchVal, searchResults, setSelectedNode } = useDataStore();
    const searchTimeRef = useRef<number | null>(null);

    const [inputVal, setInputVal] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

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
        // Convert GitHubTreeItem → TreeNode safely
        const node: TreeNode = {
            name: item.path.split('/').pop() || item.path,
            type: item.type === 'tree' ? 'dir' : 'file',
            path: item.path,
            url: item.url,
            children: [], // child nodes will be filled when needed
        };

        setSelectedNode(node);
        setShowDropdown(false);
        setInputVal(''); // optional: clear input
    };

    return (
        <div className="absolute top-0 z-50 w-full flex flex-col items-center pt-4">
            {/* Search box */}
            <div className="relative w-100 max-w-[90%] bg-white/15 px-4 py-2 backdrop-blur-3xl rounded-md flex items-center gap-3">
                <input
                    placeholder='Type "/" to search'
                    value={inputVal}
                    className="w-full placeholder-white/50 text-white bg-transparent outline-none focus:outline-none"
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => inputVal && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // allow click
                />
                <Search className="text-white/50" />
            </div>

            {/* Dropdown results */}
            {showDropdown && searchResults.length > 0 && (
                <div className="absolute top-12.5 w-100 max-w-[90%] bg-[#222]/90 backdrop-blur-md rounded-md shadow-lg max-h-80 overflow-y-auto z-50 overflow-x-hidden custom-scrollbar">
                    {searchResults.map((item: GitHubTreeItem) => (
                        <button
                            key={item.path}
                            className="w-full text-left px-4 py-2 hover:bg-gray-500/30 text-white text-sm transition flex gap-1"
                            onClick={() => handleSelectNode(item)}
                        >
                            {item.type === 'tree' ? <Folder/> : <File/>} {item.path}
                        </button>
                    ))}
                </div>
            )}

            {/* Optional: no results */}
            {showDropdown && searchResults.length === 0 && inputVal && (
                <div className="absolute top-12.5 w-100 max-w-[90%] bg-[#222]/90 backdrop-blur-md rounded-md shadow-lg px-4 py-2 text-white/50 text-sm">
                    No results found
                </div>
            )}
        </div>
    );
}
