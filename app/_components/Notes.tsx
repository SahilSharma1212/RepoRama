'use client'
import { useState } from "react"
import { TreeNode } from "../types";
interface NotesProps{
    selectedNode:TreeNode
}
export default function Notes({selectedNode}:NotesProps) {

    const [notesMap, setNotesMap] = useState<Record<string, string[]>>({});

    const [noteDraft, setNoteDraft] = useState('');


    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Previous notes */}
            <div className="flex-1 overflow-y-auto p-3 bg-[#111]/50 rounded space-y-2 custom-scrollbar">
                {(notesMap[selectedNode.path] ?? []).length > 0 ? (
                    (notesMap[selectedNode.path] ?? []).map((note: string, idx: number) => (
                        <div
                            key={idx}
                            className="p-3 bg-[#222] rounded text-gray-300 text-sm wrap-break-word"
                        >
                            {note}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No previous notes</p>
                )}
            </div>

            {/* Add new note */}
            <div className="flex flex-col gap-2">
                <textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Write a new note..."
                    className="
                                        w-full min-h-20 max-h-60 resize-none
                                        bg-[#0f0f0f] border border-white/10 rounded-md
                                        p-3 text-sm text-gray-300
                                        placeholder:text-gray-600
                                        focus:outline-none focus:border-gray-700
                                        overflow-y-auto custom-scrollbar
                                        "
                    style={{ height: 'auto' }}
                    rows={3}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                    }}
                />

                <button
                    type="button"
                    onClick={() => {
                        if (!selectedNode || !noteDraft.trim()) return;

                        setNotesMap((prev) => {
                            const prevNotes = prev[selectedNode.path] ?? [];
                            return {
                                ...prev,
                                [selectedNode.path]: [...prevNotes, noteDraft.trim()],
                            };
                        });

                        setNoteDraft('');
                    }}
                    className="self-end px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-white text-sm transition"
                >
                    Add Note
                </button>
            </div>
        </div>
    )
}
