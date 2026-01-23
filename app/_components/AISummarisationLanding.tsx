import React from 'react'

export default function AISummarisationLanding() {
    return (
        <div className='w-full h-full border border-white/20 bg-black/40 pb-5 rounded-xl'>
            <div className="mt-12 w-full flex flex-col items-center">
                {/* Section Title */}
                <h2 className="text-4xl font-bold text-center text-white mb-10">
                    AI Summarisation
                </h2>

                {/* Summary Cards Container */}
                <div className="flex flex-col lg:flex-row gap-6 w-[90%] lg:w-4/5">
                    {/* Repo Summary Card */}
                    <div className="flex-1 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="text-white text-xl font-semibold flex justify-between items-center">
                            Repo Summary
                            <span className="text-gray-400 text-sm">Updated 5 min ago</span>
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            • Overview of all files and directories.<br />
                            • Highlights main components and modules.<br />
                            • Extracted key README and project metadata.
                        </p>
                        <div className="flex justify-end mt-2">
                            <button className="px-4 py-2 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-800 transition">
                                Summarise
                            </button>
                        </div>
                    </div>



                    {/* Code Block Summary Card */}
                    <div className="flex-1 border border-gray-700 rounded-xl p-6 flex flex-col gap-4">
                        <h3 className="text-white text-xl font-semibold flex justify-between items-center">
                            Code Block Summary
                            <span className="text-gray-400 text-sm">Updated just now</span>
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            • Extracts function and class usage.<br />
                            • Highlights important logic blocks.<br />
                            • Identifies TODOs and inline comments for reference.
                        </p>
                        <div className="flex justify-end mt-2">
                            <button className="px-4 py-2 border border-gray-600 text-white rounded-lg font-medium hover:bg-gray-800 transition">
                                Summarise
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
