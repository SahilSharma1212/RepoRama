import { useEffect, useState } from "react"
import { TreeNode } from "../app/types";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

interface NotesProps {
    selectedNode: TreeNode;
    repoId: string;
}

export default function Notes({ selectedNode, repoId }: NotesProps) {
    const { isSignedIn, user } = useUser();
    const [notes, setNotes] = useState<any[]>([]);
    const [noteDraft, setNoteDraft] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            if (!isSignedIn || !repoId || !selectedNode) return;
            setIsLoading(true);
            try {
                const res = await axios.get(`/api/notes?repo_id=${encodeURIComponent(repoId)}&file_path=${encodeURIComponent(selectedNode.path)}`);
                setNotes(res.data.notes || []);
            } catch (err) {
                console.error("Failed to fetch notes:", err);
                toast.error("Failed to load notes.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, [selectedNode, repoId, isSignedIn]);

    const handleAddNote = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to add notes.");
            return;
        }
        if (!noteDraft.trim()) return;

        try {
            const res = await axios.post("/api/notes", {
                repo_id: repoId,
                file_path: selectedNode.path,
                content: noteDraft.trim(),
            });
            setNotes((prev) => [...prev, res.data.note]);
            setNoteDraft('');
        } catch (err) {
            console.error("Failed to add note:", err);
            toast.error("Failed to save note.");
        }
    };

    if (!isSignedIn) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-10 px-4 text-center">
                <p className="text-gray-400 text-sm">Please sign in to view and add notes for this file.</p>
                <Link
                    href="/sign-in"
                    className="bg-white text-black px-4 py-2 rounded text-sm font-semibold hover:bg-white/80 transition"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Previous notes */}
            <div className="flex-1 overflow-y-auto p-3 bg-[#111]/50 rounded-none space-y-2 custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-10 bg-[#222] w-full" />
                        <div className="h-10 bg-[#222] w-3/4" />
                    </div>
                ) : notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className="p-3 bg-[#222] rounded-none text-gray-300 text-sm wrap-break-word border border-white/5"
                        >
                            <p>{note.content}</p>
                            <span className="text-[10px] text-gray-500 mt-1 block">
                                {new Date(note.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No notes for this file yet.</p>
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
                        bg-[#0f0f0f] border border-white/10 rounded-none
                        p-3 text-sm text-gray-300
                        placeholder:text-gray-600
                        focus:outline-none focus:border-gray-700
                        overflow-y-auto custom-scrollbar
                    "
                    rows={3}
                />

                <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={!noteDraft.trim()}
                    className="self-end px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-none text-white text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add Note
                </button>
            </div>
        </div>
    )
}
