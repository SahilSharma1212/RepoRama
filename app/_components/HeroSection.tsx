import React from 'react'

export default function HeroSection() {
    return (
        <div className="relative min-h-screen border-x border-gray-800 overflow-hidden">

            {/* subtle background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />

            <header className="relative z-10 pt-28 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    Visualize Complexity.
                    <br />
                    Master Your Codebase.
                </h1>

                <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                    Explore repositories through interactive graphs, hierarchy trees,
                    schema relationships, and backend API flows — all in one visual layer.
                </p>
            </header>

            {/* hero visualization mock */}
            <section className="relative z-10 mt-24 flex justify-center flex-col items-center">
                <div className="relative w-[85%] max-w-6xl h-105  border border-white/10 bg-white/1 backdrop-blur-3xl ">

                    <div className='flex'>
                        <div className='w-50 h-50 border border-b-white/10 border-r-white/10 border-l-white/0 border-t-white/0'>

                        </div>
                        
                    </div>

                    <div className='flex'>
                        <div className='w-50 h-50 border border-b-white/10 border-r-white/10 border-l-white/0 border-t-white/0'>

                        </div>
                        <div className='w-50 h-50 border border-white/10 border-l-white/0'>

                        </div>
                        
                    </div>
                </div>
            </section>

            {/* bottom labels */}
            <div className="bottom-6 left-6 text-sm text-gray-500 text-center">
                Graphs • Schemas • API Routes • Architecture
            </div>

        </div>
    )
}
