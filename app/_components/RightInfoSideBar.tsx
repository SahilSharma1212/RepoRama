'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDataStore } from '@/app/store/dataStore';
import { X, Folder, File, Wand2, Code, Plus, Ban } from 'lucide-react';
import useUIStore from '../store/uiStore';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getLanguage } from '../_utils/getLanguage';
import '../globals.css'
import Notes from './Notes';
export default function RightInfoSideBar() {
    const { selectedNode, setSelectedNode } = useDataStore();
    const { isRightBarHidden, toggleRightBarVisibility } = useUIStore();
    const [activeTab, setActiveTab] = useState<'code' | 'summary' | 'notes'>('code');

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchContent = async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url);

            let decoded = '';
            if (response.data.content && response.data.encoding === 'base64') {
                // Decode Base64 to string
                decoded = atob(response.data.content.replace(/\n/g, '')); // remove newlines
            }

            setContent(decoded);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch content');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedNode) {
            setContent('');
            setError(null);
            return;
        }

        // ✅ If directory → do not fetch
        if (selectedNode.type === 'dir') {
            setContent('');
            setError(null);
            return;
        }

        // ✅ Only files reach here
        if (selectedNode.url) {
            fetchContent(selectedNode.url);
        }
    }, [selectedNode]);


    

    return (
        <div className={`
    h-screen flex flex-col border-l border-white/10
    bg-[#222]/80 backdrop-blur-3xl
    transition-[width,padding] duration-300 ease-out
    ${isRightBarHidden ? 'w-0 p-0 overflow-hidden' : 'w-110'}
`}>
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 text-base max-md:px-3 max-md:py-2">
                <h1 className="font-semibold text-gray-300 flex items-center text-sm max-md:text-base">
                    {selectedNode?.type === 'dir' ? (
                        <Folder className="text-gray-400 w-4 h-4 max-md:w-5 max-md:h-5" />
                    ) : (
                        <File className="text-gray-400 w-4 h-4 max-md:w-5 max-md:h-5" />
                    )}
                    <span className={selectedNode ? 'text-gray-400 ml-2' : 'text-gray-600 ml-2 truncate max-w-30 sm:max-w-50'}>
                        {selectedNode?.name || 'Select a File or Dir'}
                    </span>
                    <p className="text-gray-600 ml-2 text-xs font-normal max-md:text-sm truncate max-w-25 sm:max-w-37.5">
                        {selectedNode ? '/' + selectedNode.path : ''}
                    </p>
                </h1>
                <div>

                
                <button className="ml-2" onClick={toggleRightBarVisibility}>
                    <X className="text-gray-500 hover:text-gray-300 w-4 h-4 max-md:w-5 max-md:h-5 transition" />
                </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-4 w-full flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar max-md:p-3">
                {!selectedNode && <div className=' flex flex-col items-center text-center text-gray-600 gap-5 mt-20 p-4 border border-gray-600'>
                    <Ban />
                    No node selected</div>}

                {selectedNode && loading && (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-[#333] rounded w-3/4"></div>
                        <div className="h-4 bg-[#333] rounded w-5/6"></div>
                        <div className="h-4 bg-[#333] rounded w-2/3"></div>
                    </div>
                )}

                {selectedNode && error && (
                    <div className="text-red-500 flex flex-col gap-2">
                        <p>{error}</p>
                        <button
                            onClick={() => fetchContent(selectedNode.url)}
                            className="text-blue-400 hover:underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {selectedNode && !loading && !error && (
                    <>
                        {activeTab === 'code' && selectedNode.type === 'file' && (
                            <div className="w-full">
                                <SyntaxHighlighter
                                    language={getLanguage(selectedNode.name)}
                                    style={oneDark}
                                    showLineNumbers
                                    customStyle={{
                                        width:"full",
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#333333 #222222',
                                    }}
                                >
                                    {content}
                                </SyntaxHighlighter>
                            </div>
                        )}

                        {activeTab === 'code' && selectedNode.type === 'dir' && (
                            <div className="space-y-1">
                                {selectedNode.children.length > 0 ? (
                                    selectedNode.children.map((child) => (
                                        <button
                                            key={child.path}
                                            onClick={() => setSelectedNode(child)}
                                            className="
            w-full flex items-center gap-2 px-3 py-2 rounded
            text-left text-sm text-gray-300
            hover:bg-white/5 transition
            "
                                        >
                                            {child.type === 'dir' ? (
                                                <Folder className="w-4 h-4 text-blue-400 shrink-0" />
                                            ) : (
                                                <File className="w-4 h-4 text-gray-400 shrink-0" />
                                            )}

                                            <span className="truncate">{child.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm px-2">
                                        Empty directory
                                    </p>
                                )}
                            </div>
                        )}





                        {activeTab === 'summary' && (
                            <p className="text-gray-400 text-sm">
                                Summary will appear here.
                            </p>
                        )}

                        {activeTab === 'notes' && selectedNode && (
                            <Notes selectedNode={selectedNode}/>
                        )}

                    </>
                )}


            </div>
            {activeTab !== 'notes' && <div className='absolute bottom-10 left-0 w-full h-10 bg-linear-to-b from-[#11111100] to-[#151515] '></div>}
            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-[#111]/70 backdrop-blur-md">
                <button
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 py-3 text-sm font-medium transition
        ${activeTab === 'code'
                            ? 'text-white border-b-2 border-indigo-500'
                            : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <div className="flex justify-center items-center gap-2">
                        <Code size={16} /> Code
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 py-3 text-sm font-medium transition
        ${activeTab === 'summary'
                            ? 'text-white border-b-2 border-purple-500'
                            : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <div className="flex justify-center items-center gap-2">
                        <Wand2 size={16} /> Summary
                    </div>
                </button>

                <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-3 text-sm font-medium transition
        ${activeTab === 'notes'
                            ? 'text-white border-b-2 border-slate-500'
                            : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <div className="flex justify-center items-center gap-2">
                        <Plus size={16} /> Notes
                    </div>
                </button>
            </div>

        </div>
    );
}
