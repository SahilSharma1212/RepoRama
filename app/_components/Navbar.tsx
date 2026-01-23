import React from 'react'

export default function Navbar() {
    return (
        <nav
            className="
                sticky top-0 z-50
                grid grid-cols-3 items-center
                px-4 py-4
                backdrop-blur-md
                bg-[#11111105]
                text-white
                md:px-6
                lg:px-8
                
            "
        >
            {/* Logo */}
            <div className="font-bold text-3xl bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
                REPORAMA
            </div>

            {/* Center Links */}
            <div className="flex justify-center">
                <div
                    className="
                        flex gap-6 items-center
                        px-6 py-2
                        rounded-full
                        border border-white/20
                        bg-black/50
                        text-lg font-semibold
                        bg-linear-to-br from-white to-gray-400
                        bg-clip-text text-transparent
                    "
                >
                    <span className="cursor-pointer border-b border-transparent hover:border-b hover:border-gray-400 transition-all duration-300 ">Home</span>
                    <span className="cursor-pointer border-b border-transparent hover:border-b hover:border-gray-400 transition-all duration-300 ">About</span>
                    <span className="cursor-pointer border-b border-transparent hover:border-b hover:border-gray-400 transition-all duration-300 ">Contact</span>
                </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex justify-end">
                <div
                    className="
                        inline-flex gap-4 items-center
                        px-4 py-2
                        rounded-2xl
                        border border-white/30
                        text-lg font-semibold
                        bg-linear-to-br from-white to-gray-400
                        bg-clip-text text-transparent
                    "
                >
                    <span className="cursor-pointer border-b border-transparent hover:border-b hover:border-gray-400 transition-all duration-300 ">Login</span>
                    <span className="cursor-pointer border-b border-transparent hover:border-b hover:border-gray-400 transition-all duration-300 ">Register</span>
                </div>
            </div>
        </nav>
    )
}
