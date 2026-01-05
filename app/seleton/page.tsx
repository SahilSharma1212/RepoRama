import React from 'react'

export default function NetworkSkeleton() {
    return (
        <div className='bg-[#0a0a0a] min-h-screen w-full grid grid-cols-12 grid-rows-12 p-8 gap-0 border border-white/5'>

            {/* Top Row: Input Sources */}
            <div className='col-start-2 col-span-2 row-start-2 border-t border-l border-white/20 rounded-tl-lg bg-white/5 animate-pulse flex items-center justify-center'>
                <div className='w-1/2 h-1 bg-white/10 rounded'></div>
            </div>
            <div className='col-start-4 col-span-3 row-start-2 border-t border-white/10'></div>
            <div className='col-start-7 col-span-2 row-start-1 border-x border-white/20 bg-white/5 animate-pulse'></div>

            {/* Vertical Main Trunk */}
            <div className='col-start-4 row-start-3 row-span-6 border-l border-white/20 relative'>
                {/* Connection Knobs */}
                <div className='absolute -left-0.75 top-1/4 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_8px_#444]'></div>
                <div className='absolute -left-0.75 top-3/4 w-1.5 h-1.5 bg-gray-500 rounded-full shadow-[0_0_8px_#444]'></div>
            </div>

            {/* Central Processing Node */}
            <div className='col-start-5 col-span-4 row-start-5 row-span-3 border border-white/20 bg-white/2 rounded-lg relative overflow-hidden'>
                <div className='absolute inset-0 bg-linear-to-br from-white/5 to-transparent'></div>
                <div className='h-full w-full p-4 flex flex-col gap-2 relative'>
                    <div className='h-2 w-full bg-white/10 rounded animate-pulse'>
                    </div>
                    <div className='h-2 w-2/3 bg-white/10 rounded animate-pulse'></div>

                    <div className='absolute top-1/2 left-1/2 -translate-1/2 text-2xl font-semibold text-gray-500 animate-pulse'>
                    Processing request</div>
                </div>
            </div>

            {/* Outgoing Paths (Right Side) */}
            <div className='col-start-9 col-span-2 row-start-6 border-t border-white/20'></div>
            <div className='col-start-11 row-start-6 row-span-4 border-l border-white/20 border-b rounded-bl-xl'></div>

            {/* Bottom Data Clusters */}
            <div className='col-start-2 col-span-2 row-start-10 row-span-2 border border-dashed border-white/20 rounded-md flex items-end p-2'>
                <div className='w-full h-1/2 bg-white/5 rounded animate-pulse'></div>
            </div>

            <div className='col-start-5 col-span-2 row-start-10 border-t border-white/20 relative'>
                <div className='absolute -top-0.75 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full'></div>
            </div>

            <div className='col-start-8 col-span-3 row-start-11 row-span-1 bg-white/5 border border-white/10 rounded animate-pulse'></div>

            {/* Accent Scanning Line (Visual Effect) */}
            <div className='col-span-full row-start-8 h-px bg-linear-to-r from-transparent via-gray-500/20 to-transparent w-full animate-[scan_4s_linear_infinite]'></div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100px); opacity: 0; }
                }
            `}</style>
        </div>
    )
}