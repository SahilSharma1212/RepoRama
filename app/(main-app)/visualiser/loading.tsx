import React from 'react'

export default function loading() {
    return (
        <div className='h-screen w-screen bg-[#111]'>





            <div
                className={`
                w-110 h-screen flex flex-col border-l border-white/10
                bg-[#222]/80 backdrop-blur-3xl
                transition-all duration-300 ease-out
                max-md:w-[90vw] max-md:h-[70vh] max-md:bottom-3 max-md:right-3
                
                    opacity-100 translate-y-0 scale-100 pointer-events-auto
            `}
            >

            </div>

        </div>
    )
}
