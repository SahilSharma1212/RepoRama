'use client'
import { Edit2, Trash } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
const messages = [
    {
        user: "/components UI",
        message: "Repo structure is clear: `/components` for UI, `/pages` for routing, `/utils` for helpers.",
        time: "10:12 AM",
    },
    {
        user: "API services",
        message: "API calls are centralized in `/services/api.ts`. Consider adding error handling wrapper.",
        time: "10:15 AM",
    },
    {
        user: "UseEffect triggers",
        message: "Noticed `useEffect` is used in `Dashboard.tsx` for fetching data — maybe refactor into a custom hook for reusability.",
        time: "10:18 AM",
    },
]
export default function NotesCardLanding() {
    return (
        <div className='w-full h-full border bg-black/40 border-white/20 rounded-xl flex flex-col items-center overflow-hidden custom-scrollbar pb-3'>
            <div className='text-center mt-7 text-lg font-bold bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent wrap-break-word'>
                Add notes to keep track of what you understand
            </div>
            <div className='w-[90%] rounded-lg top-10 m-auto mt-5 flex flex-col text-white gap-4'>
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.6 }}
                            className="w-full rounded-lg bg-white/5 p-3 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-semibold">{msg.user}</span>
                                <span className="text-white/50 text-xs">{msg.time}</span>
                            </div>

                            <p className="text-white/70 text-sm mb-2">{msg.message}</p>

                            <div className="flex justify-end gap-2">
                                <Edit2 className="cursor-pointer text-blue-400" size={15} />
                                <Trash className="cursor-pointer text-red-500" size={15} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

            </div>
        </div>
    )
}
