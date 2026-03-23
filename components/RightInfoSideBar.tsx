'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDataStore } from '@/app/store/dataStore';
import { X, Folder, File, Wand2, Code, Plus, Ban, Info, WandSparkles, AlignLeft, Zap, Settings, Braces, Lightbulb } from 'lucide-react';
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
    const { selectedNode, setSelectedNode, repoStats } = useDataStore();
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


    const renderHighlightedText = (text: string) => {
        // Regex to match technical keywords, camelCase, PascalCase, and words with underscores
        const parts = text.split(/(\b(?:[a-z]+[A-Z][a-z\d]*|[A-Z][a-z\d]+[A-Z][a-z\d]*|[a-z\d]*_[a-z\d_]*|[A-Z]{2,}|component|function|hook|state|effect|API|endpoint|database|schema|UI|UX|CSS|HTML|Javascript|Typescript|React|Zustand|Clerk|Supabase)\b)/g);
        
        return parts.map((part, i) => {
            const isKeyword = /(\b(?:[a-z]+[A-Z][a-z\d]*|[A-Z][a-z\d]+[A-Z][a-z\d]*|[a-z\d]*_[a-z\d_]*|[A-Z]{2,}|component|function|hook|state|effect|API|endpoint|database|schema|UI|UX|CSS|HTML|Javascript|Typescript|React|Zustand|Clerk|Supabase)\b)/.test(part);
            return isKeyword ? (
                <span key={i} className="text-white font-medium bg-white/10 px-1 py-0.5 rounded-none border-b border-white/20">
                    {part}
                </span>
            ) : part;
        });
    };

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
                                            <section className="mt-5 space-y-6">
                                                {/* Description Section */}
                                                <div className="group border-l-2 border-blue-500 bg-white/5 p-4 rounded-none transition-all hover:bg-white/10">
                                                    <div className="flex items-center gap-2 mb-3 text-blue-400">
                                                        <AlignLeft size={18} />
                                                        <h2 className="text-sm font-bold uppercase tracking-wider">Description</h2>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {summary.description.map((desc, index) => (
                                                            <p key={index} className="text-sm text-gray-300 leading-relaxed">
                                                                {renderHighlightedText(desc)}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Key Features Section */}
                                                <div className="group border-l-2 border-emerald-500 bg-white/5 p-4 rounded-none transition-all hover:bg-white/10">
                                                    <div className="flex items-center gap-2 mb-3 text-emerald-400">
                                                        <Zap size={18} />
                                                        <h2 className="text-sm font-bold uppercase tracking-wider">Key Features</h2>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {summary.keyFeatures.map((feature, index) => (
                                                            <div key={index} className="flex items-start gap-2 group/item">
                                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-none bg-emerald-500/50 group-hover/item:bg-emerald-400 transition-colors" />
                                                                <p className="text-sm text-gray-300">{renderHighlightedText(feature)}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Implementation Details Section */}
                                                <div className="group border-l-2 border-amber-500 bg-white/5 p-4 rounded-none transition-all hover:bg-white/10">
                                                    <div className="flex items-center gap-2 mb-3 text-amber-400">
                                                        <Settings size={18} />
                                                        <h2 className="text-sm font-bold uppercase tracking-wider">Implementation</h2>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {summary.implementationDetails.map((detail, index) => (
                                                            <p key={index} className="text-sm text-gray-300 border-b border-white/5 pb-2 last:border-0 last:pb-0 underline-offset-4 decoration-amber-500/20">
                                                                {renderHighlightedText(detail)}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Functions Used Section */}
                                                <div className="group border-l-2 border-indigo-500 bg-white/5 p-4 rounded-none transition-all hover:bg-white/10">
                                                    <div className="flex items-center gap-2 mb-3 text-indigo-400">
                                                        <Braces size={18} />
                                                        <h2 className="text-sm font-bold uppercase tracking-wider">Important Functions</h2>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {summary.importantFunctionsUsed.map((func, index) => (
                                                            <code
                                                                key={index}
                                                                className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-none border border-indigo-500/20 font-mono"
                                                            >
                                                                {func}
                                                            </code>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Use Cases Section */}
                                                <div className="group border-l-2 border-rose-500 bg-white/5 p-4 rounded-none transition-all hover:bg-white/10">
                                                    <div className="flex items-center gap-2 mb-3 text-rose-400">
                                                        <Lightbulb size={18} />
                                                        <h2 className="text-sm font-bold uppercase tracking-wider">Use Cases</h2>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {summary.useCases.map((useCase, index) => (
                                                            <div key={index} className="flex items-center gap-3 bg-white/5 p-2 rounded-none border border-white/5">
                                                                <div className="w-1 h-1 rounded-none bg-rose-500" />
                                                                <p className="text-sm text-gray-400 italic">"{useCase}"</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'notes' && selectedNode && (
                            <Notes selectedNode={selectedNode} repoId={repoStats?.full_name || ''} />
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
                            ? 'text-white border-b-2 border-fuchsia-500 bg-fuchsia-500/5'
                            : 'text-gray-400 hover:text-gray-300'}`}
                >
                    <div className="flex justify-center items-center gap-2">
                        <Wand2 size={16} className={activeTab === 'summary' ? 'text-fuchsia-400' : ''} /> Summary
                    </div>
                </button>

            </div>
        </div>
    );
}
