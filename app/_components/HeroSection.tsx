'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
export default function HeroSection() {
    return (
        <div className="relative min-h-screen border-x border-gray-800 overflow-hidden">

            {/* subtle background grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />



            {/* hero visualization mock */}
            <section className="relative z-10 mt-16 flex justify-center flex-col items-center mb-10 ">


                <div className='w-[80%] h-140 bg-gray relative overflow-hidden border border-white/10 rounded-md'>

                    {/* Minimal animated heading */}
                    <motion.h2
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 z-50 text-xl font-medium tracking-tight text-white/90"
                    >
                        <header className="relative z-10 pt-10 text-center">
                            <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
                                Visualize Complexity.
                                <br />
                                Master Your Codebase.
                            </h1>

                            <p className="mt-6 text-lg md:text-md text-gray-400 w-full mx-auto">
                                Explore repositories through interactive graphs, hierarchy trees,
                                schema relationships, and backend API flows — all in one visual layer.
                            </p>
                        </header>
                    </motion.h2>


                    <motion.div
                        initial={{ y: 120, opacity: 0.3 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className='absolute -bottom-25 left-[55%] rotate-5 -translate-x-1/2'
                    >
                        <div className="relative h-100 w-200 rounded-lg overflow-hidden shadow-lg shadow-black/40">
                            <Image fill src="/visualiserDemo.png" alt="hi" />
                        </div>
                    </motion.div>

                    <div className='absolute w-full h-20 bg-linear-to-b from-[#11111100] to-[#111] bottom-0 z-40' />

                </div>






            </section>

            {/* bottom labels */}
            <div className="bottom-6 left-6 text-sm text-gray-500 text-center">
                Graphs • Schemas • API Routes • Architecture
            </div>

        </div>
    )
}
