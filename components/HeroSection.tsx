'use client'
import { ChevronRight, Notebook, NotebookPen, Plus, TvMinimalPlay, WandSparkles } from 'lucide-react';
import SampleGraph from './SampleGraph';

export default function HeroSection() {
    return (
        <div className="relative w-full  flex items-center justify-center flex-col overflow-hidden font-mono">

            {/* Soft glow effect for background depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22222205] rounded-full blur-[120px] pointer-events-none" />

            <main className="relative z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-30">

                <div className="space-y-4 mb-12">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 text-center font-mono">Platform Overview</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                        Your one-stop solution for all
                        <span className="block mt-2 text-zinc-400 w-fit mx-auto bg-linear-to-br from-white/5 to-gray-400/5 ">GitHub Repositories</span>
                    </h1>
                </div>

                <div className='flex items-center justify-center gap-4'>
                    <button className='px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors duration-300'>Try out your first Repo -&gt;</button>
                    <button className='px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors'>Our Demo -&gt;</button>
                </div>


            </main>

            <section className='z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-10'>
                <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                    What We Actually Provide
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    <FeatureCard icon={<Notebook size={24} />} title="AI Documentation" />
                    <FeatureCard icon={<NotebookPen size={24} />} title="Notes" />
                    <FeatureCard icon={<WandSparkles size={24} />} title="AI Summaries" />
                    <FeatureCard icon={<TvMinimalPlay size={24} />} title="GitHub Wrap" />
                </div>
            </section>

            <section className='z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-10'>
                <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                    How to start
                </h1>

                {/* STEP 1 LOGIN */}
                <div className="mt-10">
                    <p className='flex items-center gap-2 font-sans font-bold text-xl'> <ChevronRight size={24} /> Step 1</p>

                    <div className='p-3 bg-zinc-900/50 rounded-md border border-white/5 mt-5'>
                        <p><span className='bg-zinc-800 px-2 py-1'>Login</span>, and visit you personal <span className='bg-zinc-800 px-2 py-1'>Dashboard</span></p>
                    </div>

                </div>

                {/* STEP 2 ADDING A REPO */}
                <div className="mt-10">
                    <p className='flex items-center gap-2 font-sans font-bold text-xl'> <ChevronRight size={24} /> Step 2</p>

                    <div className='p-3 bg-zinc-900/50 rounded-md border border-white/5 mt-5 flex flex-col items-start justify-start gap-4 pt-4'>
                        <p>
                            <span className='opacity-50 mx-2'>&gt;</span>
                            Click to the
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Add a Repo</span>
                            button
                        </p>

                        <div className='bg-white/5 flex items-center gap-2 px-10 py-5 text-white/50 rounded-md w-fit'>
                            <Plus /> Add a Repo
                        </div>

                        <p>
                            <span className='opacity-50 mx-2'>&gt;</span>
                            Add a valid
                            <span className='bg-zinc-800 px-2 py-1 mx-2'>Repo URL</span>
                        </p>

                        <div className='bg-white/5 flex-col flex items-start justify-start gap-2 px-5 py-5 text-white/50 rounded-md w-full'>
                            <div
                                className="w-full bg-[#252525] border border-white/10 p-2 rounded-md text-gray-200/50"

                            >
                                Github Repo Url
                            </div>

                            <div
                                className="w-full mt-3 bg-[#252525] border border-white/10 p-2 rounded-md text-gray-200/50 pb-20"
                            >
                                Description (optional)
                            </div>

                            <div
                                className="w-full mt-4 py-2 bg-white text-black rounded-md flex justify-center gap-2 disabled:opacity-50 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
                            >
                                Add Repository
                            </div>
                        </div>
                        <p>
                            <span className='opacity-50 mx-2'>&gt;</span>
                            This Adds your repository to your
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Dashboard</span>
                            for later
                        </p>

                        <p>
                            <span className='opacity-50 mx-2'>&gt;</span>
                            You can see you
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Repo stats</span>
                            here.
                        </p>
                    </div>
                </div>

                {/* STEP 3 STATS */}
                <div className="mt-10">
                    <p className='flex items-center gap-2 font-sans font-bold text-xl'> <ChevronRight size={24} /> Step 3</p>

                    <div className='p-3 bg-zinc-900/50 rounded-md border border-white/5 mt-5 flex flex-col items-start justify-start gap-4 pt-4'>
                        <p>
                            Visit the
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Visualiser Playground</span>
                            section.
                        </p>

                        <SampleGraph />



                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <div className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-white/20 transition-all duration-300 ease-out cursor-default">
            <div className="text-zinc-400 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <span className="text-xs font-mono tracking-wider text-zinc-500 group-hover:text-zinc-200 transition-colors duration-300 uppercase">
                {title}
            </span>
        </div>
    );
}