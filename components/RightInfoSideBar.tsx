'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDataStore } from '@/app/store/dataStore';
import { X, Folder, File, Wand2, Code, Plus, Ban, Info, WandSparkles } from 'lucide-react';
import useUIStore from '../app/store/uiStore';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getLanguage } from '../app/_utils/getLanguage';
import Notes from './Notes'
import toast from 'react-hot-toast';
import { CodeSummary } from '@/app/types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function RightInfoSideBar() {

    const pathname = usePathname();
    const { selectedNode, setSelectedNode } = useDataStore();
    const { isRightBarHidden, toggleRightBarVisibility } = useUIStore();
    const [activeTab, setActiveTab] = useState<'code' | 'summary' | 'notes'>('code');

    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [summary, setSummary] = useState<CodeSummary | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const fetchContent = async (url: string) => {
        setLoading(true);
        setError(null);
        setSummary(null);
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



    const fetchSummary = async () => {



        if (selectedNode?.type !== 'file') {
            setSummaryError('Please select a file to generate summary');
            return;
        }

        setSummaryLoading(true);
        setSummaryError(null);
        try {
            const response = await axios.post('/api/repo/code/summary', {
                code: content
            });
            setSummary(response.data.summary);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch summary');
            setSummaryError('Failed to fetch summary');
        } finally {
            setSummaryLoading(false);
        }

    }


    return (
        <div className={`
    h-screen flex flex-col border-l border-white/10
    bg-[#222]/80 backdrop-blur-3xl
    transition-[width,padding] duration-300 ease-out max-md:hidden
    ${isRightBarHidden ? 'w-0 p-0 overflow-hidden' : 'max-lg:w-90 lg:w-130'}
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

                    <button className="ml-2" onClick={() => { }}>
                        <Info className="text-gray-500 hover:text-gray-300 w-4 h-4 max-md:w-5 max-md:h-5 transition" />
                    </button>

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
                    <div className="text-red-400 flex flex-col h-full items-center justify-center gap-4 p-4">
                        <p>{error}</p>
                        <button
                            onClick={() => fetchContent(selectedNode.url)}
                            className="text-blue-400 border border-blue-400 px-2 py-1 rounded hover:underline"
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
                                        width: "full",
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
                            <div>
                                {window.location.pathname === '/visualiser' ? (
                                    /* SIGN-IN MESSAGE ONLY */
                                    <section className="mt-6 flex flex-col gap-4 items-center justify-center w-full">
                                        <div className=" w-full p-6 rounded-xl border border-white/10 bg-zinc-900/40 text-center text-gray-400">
                                            <p className="text-sm">
                                                Please sign in to use AI code summarisation.
                                            </p>
                                        </div>

                                        <div className=" w-full p-6 rounded-xl border border-white/10 bg-zinc-900/40 text-center text-gray-400">
                                            <p className="text-sm">
                                                If Signed in already, use your own repos to generate summaries.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link className="bg-white text-black p-2 px-6 rounded hover:bg-white/80 transition-colors flex items-center gap-2 font-semibold" href="/sign-in">Sign In</Link>
                                            <Link className="bg-white text-black p-2 px-6 rounded hover:bg-white/80 transition-colors flex items-center gap-2 font-semibold" href="/dashboard">Dashboard</Link>
                                        </div>
                                    </section>
                                ) : (
                                    /* REAL SUMMARY UI (only when NOT /visualiser) */
                                    <>
                                        {/* Header */}
                                        <div className="text-gray-400 bg-gray-950/10 p-1 rounded-md text-sm flex items-center justify-between pl-2">
                                            <p>
                                                path : {selectedNode.path.split('/').pop() || selectedNode.name}
                                            </p>
                                            <button
                                                onClick={fetchSummary}
                                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-600/80 transition-colors flex items-center gap-2 font-semibold"
                                            >
                                                Summarise
                                                <WandSparkles size={16} strokeWidth={1.5} />
                                            </button>
                                        </div>

                                        {/* Loading Skeleton */}
                                        {summaryLoading && (
                                            <section className="mt-3 flex flex-col w-full p-3 gap-3">
                                                <div className="w-2/3 h-5 rounded-full bg-gray-500/70 animate-pulse" />
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <div className="w-full h-4 rounded-full bg-gray-500/60 animate-pulse" />
                                                    <div className="w-11/12 h-4 rounded-full bg-gray-500/50 animate-pulse" />
                                                    <div className="w-10/12 h-4 rounded-full bg-gray-500/50 animate-pulse" />
                                                </div>
                                            </section>
                                        )}

                                        {/* Summary Content */}
                                        {summary && (
                                            <section className="mt-3 flex flex-col w-full p-3 gap-3">
                                                <h2 className="font-semibold">Description</h2>

                                                <div className="bg-[#111] p-3 rounded-md">
                                                    {summary.description.map((desc, index) => (
                                                        <div className="flex items-center gap-2" key={index}>
                                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <p className="text-sm text-gray-300">{desc}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <h2 className="font-semibold">Key Features</h2>

                                                <div className="bg-[#111] p-3 rounded-md">
                                                    {summary.keyFeatures.map((feature, index) => (
                                                        <div className="flex items-center gap-2" key={index}>
                                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <p className="text-sm text-gray-300">{feature}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <h2 className="font-semibold">Implementation Details</h2>

                                                <div className="bg-[#111] p-3 rounded-md">
                                                    {summary.implementationDetails.map((detail, index) => (
                                                        <div className="flex items-center gap-2" key={index}>
                                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <p className="text-sm text-gray-300">{detail}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="bg-[#111] p-3 rounded-md">
                                                    <h2 className="font-semibold mb-2">Functions Used</h2>
                                                    {summary.importantFunctionsUsed.map((func, index) => (
                                                        <p
                                                            key={index}
                                                            className="text-xs bg-[#222] p-1 pl-3 rounded-md font-mono"
                                                        >
                                                            {func}
                                                        </p>
                                                    ))}
                                                </div>

                                                <div className="bg-[#111] p-3 rounded-md">
                                                    <h2 className="font-semibold mb-2">Use Cases</h2>
                                                    {summary.useCases.map((useCase, index) => (
                                                        <div className="flex items-center gap-2" key={index}>
                                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                            <p className="text-sm text-gray-300">{useCase}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </>
                                )}
                            </div>
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

            </div>
        </div>
    );
}
