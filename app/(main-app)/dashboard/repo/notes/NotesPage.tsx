'use client'
import { ChevronDown, Notebook, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Page() {
    const searchParams = useSearchParams()
    const repoOwner = searchParams.get('repoOwner')
    const repoName = searchParams.get('repoName')
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState("content")
    return (
        <div className='text-white'>
            <nav className='px-4 py-4 border-b border-white/10 flex items-end justify-start gap-3'>
                <Notebook />
                <p className="text-3xl font-semibold max-sm:text-xl">Notes</p>
                <p className="bg-white/10 text-white/50 px-2 py-1 rounded text-normal max-sm:text-xs overflow-hidden">Owner: {repoOwner}</p>
                <p className="bg-white/10 text-white/50 px-2 py-1 rounded text-normal max-sm:text-xs overflow-hidden">Repo: {repoName}</p>
            </nav>
            {/* Search bar */}
            <section className="p-4 flex items-center justify-start gap-4">
                <div className="flex items-center rounded border border-white/20 max-w-96">
                    <input type="text" placeholder="Search notes" className="w-full h-full px-2 focus:border-none focus:outline-none border-white/10 rounded" />
                    <button className="bg-white/10 text-white/50 px-2 py-1 text-normal max-sm:text-xs hover:bg-white/15"><Search /></button>
                </div>

                <p className="text-white/50 text-sm max-sm:text-xs">Category:</p>

                <div className="relative">
                    {/* Select button */}
                    <button
                        onClick={() => setIsOpen(prev => !prev)}
                        className="bg-neutral-900 border border-white/10 px-3 py-1 rounded text-white/70 flex items-center gap-2 "
                    >
                        {selected}
                        <ChevronDown strokeWidth={1} />
                    </button>

                    {/* Options */}
                    {isOpen && (
                        <div className="absolute mt-1 rounded border border-white/10 bg-neutral-900 overflow-hidden z-10">

                            <div
                                onClick={() => {
                                    setSelected("content")
                                    setIsOpen(false)
                                }}
                                className="
                        px-3 py-1 
                        text-white/70 
                        hover:bg-white/10 
                        cursor-pointer
                        transition
                        border-b border-white/5
                    "
                            >
                                content
                            </div>
                            <div
                                onClick={() => {
                                    setSelected("filename")
                                    setIsOpen(false)
                                }}
                                className="
                        px-3 py-1 
                        text-white/70 
                        hover:bg-white/10 
                        cursor-pointer
                        transition
                        border-b border-white/5
                    "
                            >
                                filename
                            </div>
                        </div>
                    )}
                </div>


            </section>

        </div>
    )
}
