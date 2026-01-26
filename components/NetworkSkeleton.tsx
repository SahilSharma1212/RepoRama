import { File, Folder, ListTree, X } from 'lucide-react'
import React from 'react'

export function NetworkSkeleton() {
    return (
        <div className='h-screen w-screen bg-[#111] flex items-center justify-between'>

            {/* 
            DIrectory tree skeleton will go here */}
            <div
                style={{
                    backgroundColor: '#151515',
                    backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                }}
                className="h-screen w-70 flex flex-col border-r border-white/10 max-md:hidden "
            >
                {/* Heading */}
                <h1 className="flex items-center bg-[#151515] border-b border-white/10 text-gray-200 py-3 pl-5 text-md font-semibold gap-2">

                    <ListTree strokeWidth={1.5} /> Directory Tree


                </h1>

                {/* Directory tree skeleton */}
                <div className="flex-1 p-4 space-y-3">

                    {
                        [1, 2, 3, 4, 5].map((num, idx) => {

                            return (
                                <div className="flex items-center gap-2" key={idx}>

                                    <div className="h-3 w-50 rounded bg-white/20 animate-pulse" />
                                </div>
                            )
                        })
                    }

                    <div className="pl-9 space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-2">

                                <div className="h-3 w-38 rounded bg-white/10 animate-pulse" />
                            </div>
                        ))}
                    </div>

                    {
                        [1, 2, 3, 4, 5].map((num, idx) => {

                            return (
                                <div className="flex items-center gap-2" key={idx}>

                                    <div className="h-3 w-50 rounded bg-white/20 animate-pulse" />
                                </div>
                            )
                        })
                    }



                </div>

            </div>
            {/* 
middle part is left alone occupying the backgrounds dots */}

            {/* 
            left side for random skeletons */}
            <div
                className={`
                w-110 h-screen flex flex-col border-l border-white/10
                bg-[#222]/80 backdrop-blur-3xl
                transition-all duration-300 ease-out
                max-md:w-[90vw] max-md:h-[70vh] max-md:bottom-3 max-md:right-3
                
                    opacity-100 translate-y-0 scale-100 pointer-events-auto
            `}
            >

                <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 text-base max-md:px-3 max-md:py-2">
                <h1 className="font-semibold text-gray-300 flex items-center text-sm max-md:text-base">
                    
                        <Folder className="text-gray-400 w-4 h-4 max-md:w-5 max-md:h-5" />
                    
                    <span className={ 'text-gray-600 ml-2 truncate max-w-30 sm:max-w-50'}>
                        Select a File or Dir
                    </span>
                    <p className="text-gray-600 ml-2 text-xs font-normal max-md:text-sm truncate max-w-25 sm:max-w-37.5">
                    </p>
                </h1>
                <button className="ml-2">
                    <X className="text-gray-500 hover:text-gray-300 w-4 h-4 max-md:w-5 max-md:h-5 transition" />
                </button>
            </div>

            </div>

        </div>
    )
}
