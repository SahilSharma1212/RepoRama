import React from 'react'

export default function Navbar() {
    return (
        <nav
        className='bg-[#111] border-b border-b-gray-600 grid grid-cols-3 px-1
        py-4 sticky top-0 z-50
        text-white
        md:px-5


        lg:px-8
        
        '
        >
            <div className='bg-linear-to-br from-white  to-gray-500 bg-clip-text text-transparent font-bold text-3xl'>
                REPORAMA
            </div>

            <div className='bg-linear-to-br from-white  to-gray-500 bg-clip-text text-transparent font-bold text-3xl flex-items'>
                REPORAMA
            </div>

            <div className='bg-linear-to-br from-white  to-gray-500 bg-clip-text text-transparent font-bold text-3xl'>
                REPORAMA
            </div>
        </nav>
    )
}
