'use client'
import { ChevronRight, Notebook, NotebookPen, Plus, TvMinimalPlay, WandSparkles } from 'lucide-react';
import SampleGraph from './SampleGraph';
import { memo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default memo(function HeroSection() {
    const [showSummary, setShowSummary] = useState(false);
    return (
        <div className="relative w-full flex items-center justify-center flex-col overflow-hidden font-mono pb-20">

            {/* Soft glow effect for background depth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22222205] rounded-full blur-[120px] pointer-events-none" />

            {/* MAIN HERO SECTION */}
            <motion.main
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="relative z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-30"
            >

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="space-y-4 mb-12">
                    <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 text-center font-mono">Platform Overview</p>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                        Your one-stop solution for all
                        <span className="block mt-2 text-zinc-400 w-fit mx-auto bg-linear-to-br from-white/5 to-gray-400/5 ">GitHub Repositories</span>
                    </h1>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className='flex items-center justify-center gap-4'>
                    <Link
                        href="/dashboard"
                        className='px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200 transition-colors duration-300'
                    >
                        Try out your first Repo -&gt;
                    </Link>

                    <Link
                        href="/visualiser"
                        className='px-4 py-2 rounded-md bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-colors'
                    >
                        Our Demo -&gt;
                    </Link>
                </motion.div>


            </motion.main>

            {/* WHAT WE ACTUALLY PROVIDE */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className='z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-10'
            >
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-2xl md:text-5xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                    What We Actually Provide
                </motion.h1>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    <FeatureCard icon={<Notebook size={24} />} title="AI Documentation" />
                    <FeatureCard icon={<NotebookPen size={24} />} title="Notes" />
                    <FeatureCard icon={<WandSparkles size={24} />} title="AI Summaries" />
                    <FeatureCard icon={<TvMinimalPlay size={24} />} title="GitHub Wrap" />
                </motion.div>
            </motion.section>

            {/* HOW TO START */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className='z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-10'
            >
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-2xl md:text-5xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                    How to start
                </motion.h1>

                {/* STEP 1 LOGIN */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10">
                    <p className='flex items-center gap-2 font-sans font-bold text-xl'> <ChevronRight size={24} /> Step 1: Login</p>

                    <div className='p-3 bg-zinc-900/50 rounded-md border border-white/5 mt-5'>
                        <p><span className='bg-zinc-800 px-2 py-1'>Login</span>, and visit you personal <span className='bg-zinc-800 px-2 py-1'>Dashboard</span></p>
                    </div>

                </motion.div>

                {/* STEP 2 ADDING A REPO */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10">
                    <p className='flex items-center gap-2 font-sans font-bold text-xl'> <ChevronRight size={24} /> Step 2: Adding a Repo</p>

                    <div className='p-3 bg-zinc-900/50 rounded-md border border-white/5 mt-5 flex flex-col items-start justify-start gap-4 pt-4'>
                        <p>
                            <span className='opacity-50 mx-2'>1 &gt;</span>
                            Click to the
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Add a Repo</span>
                            button
                        </p>

                        <div className='bg-white/5 flex items-center gap-2 px-10 py-5 text-white/50 rounded-md w-fit'>
                            <Plus /> Add a Repo
                        </div>

                        <p>
                            <span className='opacity-50 mx-2'>2 &gt;</span>
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
                            <span className='opacity-50 mx-2'>3 &gt;</span>
                            This Adds your repository to your
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Dashboard</span>
                            for later
                        </p>

                        <p>
                            <span className='opacity-50 mx-2'>4 &gt;</span>
                            You can see you
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Repo stats</span>
                            here.
                        </p>
                    </div>
                </motion.div>

                {/* STEP 3 STATS */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10">
                    <p className='flex items-center gap-2 font-sans font-bold text-xl'> <ChevronRight size={24} /> Step 3: Visualiser Playground </p>

                    <div className='p-3 bg-zinc-900/50 rounded-md border border-white/5 mt-5 flex flex-col items-start justify-start gap-4 pt-4'>
                        <p>
                            Visit the
                            <span className='bg-zinc-800 px-2 mx-2 py-1'>Visualiser Playground</span>
                            section.
                        </p>

                        <SampleGraph />



                    </div>
                </motion.div>
            </motion.section>

            {/* FEATURES */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className='z-10 w-[95%] max-w-5xl px-8 py-16 border border-white/10 backdrop-blur-xl bg-white/1 text-white rounded-3xl shadow-2xl mt-10'
            >
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="text-2xl md:text-5xl font-bold tracking-tight text-center max-w-3xl mx-auto leading-tight">
                    Features
                </motion.h1>

                {/* AI CODE SUMMARISATION */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10">
                    {/* Title */}
                    <p className="flex items-center gap-2 font-sans font-bold text-xl">
                        <ChevronRight size={24} />
                        AI Code Summarisation
                    </p>

                    {/* Code Block */}
                    <div className="relative w-full mt-5">
                        <div className="p-3 rounded-md bg-zinc-900 text-sm font-mono w-full overflow-x-auto">
                            <div className="min-w-max whitespace-nowrap space-y-1">
                                <div className="p-3 rounded-md bg-blue-900/10 space-y-1">

                                    <div>
                                        <span className="text-purple-400">def</span>{" "}
                                        <span className="text-blue-400">analyze_repository</span>
                                        <span className="text-white/80">(repo_url):</span>
                                    </div>

                                    <div className="pl-4">
                                        <span className="text-purple-400">if</span>{" "}
                                        <span className="text-white/80">not</span>{" "}
                                        <span className="text-blue-300">repo_url</span>
                                        <span className="text-white/80">.startswith(</span>
                                        <span className="text-amber-300">"https://github.com/"</span>
                                        <span className="text-white/80">):</span>
                                    </div>

                                    <div className="pl-8">
                                        <span className="text-purple-400">return</span>{" "}
                                        <span className="text-amber-300">"Invalid repository URL"</span>
                                    </div>

                                    <div className="mt-2 pl-4 text-white/80">
                                        <span className="text-purple-400">return</span> {"{"}
                                    </div>

                                    <div className="pl-8">
                                        <span className="text-amber-200">"docs"</span>
                                        <span className="text-white/60">:</span>{" "}
                                        <span className="text-emerald-400">True</span>
                                        <span className="text-white/60">,</span>
                                    </div>

                                    <div className="pl-8">
                                        <span className="text-amber-200">"notes"</span>
                                        <span className="text-white/60">:</span>{" "}
                                        <span className="text-emerald-400">True</span>
                                        <span className="text-white/60">,</span>
                                    </div>

                                    <div className="pl-8">
                                        <span className="text-amber-200">"ai_summary"</span>
                                        <span className="text-white/60">:</span>{" "}
                                        <span className="text-amber-300">"Backend utilities repo"</span>
                                        <span className="text-white/60">,</span>
                                    </div>

                                    <div className="pl-8">
                                        <span className="text-amber-200">"stars"</span>
                                        <span className="text-white/60">:</span>{" "}
                                        <span className="text-cyan-400">128</span>
                                    </div>

                                    <div className="pl-4 text-white/80">{"}"}</div>

                                    <div className="mt-3">
                                        <span className="text-blue-300">repo</span>{" "}
                                        <span className="text-white/60">=</span>{" "}
                                        <span className="text-amber-300">
                                            "https://github.com/user/project"
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-blue-400">print</span>
                                        <span className="text-white/80">(</span>
                                        <span className="text-blue-300">analyze_repository</span>
                                        <span className="text-white/80">(repo))</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button + Floating Summary */}
                    <div className="relative inline-block mt-4">
                        <button
                            onClick={() => setShowSummary(!showSummary)}
                            className="
            px-4 py-2
            rounded-md
            border border-white/10
            bg-white/5
            text-sm text-white/80
            hover:bg-white/10
            transition
          "
                        >
                            {showSummary ? "Hide" : "Summarise"}
                        </button>

                        {showSummary && (
                            <div
                                className="
              absolute bottom-full sm:left-full mb-3
              md:w-96 sm:w-80 w-60
              p-4
              rounded-xl
              border border-white/10
              bg-black/70
              backdrop-blur-xl
              text-sm text-white/80
              shadow-xl
              z-50
            "
                            >
                                <p className="font-medium text-white mb-2">
                                    What this code does
                                </p>
                                <p>
                                    This function validates a GitHub repository URL and returns a
                                    structured summary containing documentation availability, notes,
                                    AI-generated insights, and repository metadata such as star count.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* GITHUB WRAPPED */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10">
                    <p className="flex items-center gap-2 font-sans font-bold text-xl">
                        <ChevronRight size={24} />
                        Github Wrapped
                    </p>
                    <div className="relative w-full mt-5">
                        <div className="p-3 rounded-md bg-zinc-900 text-sm font-mono w-full overflow-x-auto flex items-center justify-start gap-4">
                            <p className="text-white/80 w-fit">Get Your Github Wrapped With Just One click</p>
                            <Link href="/git-wrap" className="text-black bg-white w-fit px-2 py-1 rounded-md cursor-pointer">Try-Out</Link>
                        </div>
                    </div>
                </motion.div>


                {/* AI DOCUMENTATION */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="mt-10">
                    <p className="flex items-center gap-2 font-sans font-bold text-xl">
                        <ChevronRight size={24} />
                        AI Documentation
                    </p>
                    <div className="relative w-full mt-5">
                        <div className="p-3 rounded-md bg-zinc-900 text-sm font-mono w-full overflow-x-auto">
                            COMMING SOON!
                        </div>
                    </div>
                </motion.div>
            </motion.section >
        </div >
    );
});

function FeatureCard({ icon, title }: { icon: React.ReactNode, title: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-white/20 transition-all duration-300 ease-out cursor-default">
            <div className="text-zinc-400 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <span className="text-xs text-center font-mono tracking-wider text-zinc-500 group-hover:text-zinc-200 transition-colors duration-300 uppercase">
                {title}
            </span>
        </motion.div>
    );
}
