'use client'

import { User } from "lucide-react"
import {
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Link from "next/link"

export default function Navbar() {
    return (
        <nav
            className="
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[95%] max-w-6xl
        px-6 py-3
        grid grid-cols-2 md:grid-cols-3 items-center
        rounded-full
        border border-white/10
        backdrop-blur-xl
        text-white
      "
        >
            {/* Logo */}
            <div className="hidden md:block font-bold text-2xl tracking-wide">
                <span className="bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    REPORAMA
                </span>
            </div>

            {/* Center Links */}
            <div className="flex justify-start md:justify-center gap-6 text-sm font-medium">
                <Link
                    href="/"
                    className="hover:text-gray-300 hover:bg-white/10 p-1 px-3 rounded-full transition"
                >
                    Home
                </Link>
                <Link
                    href="/dashboard"
                    className="hover:text-gray-300 hover:bg-white/10 p-1 px-3 rounded-full transition"
                >
                    Dashboard
                </Link>
                <Link
                    href="/contact"
                    className="hover:text-gray-300 hover:bg-white/10 p-1 px-3 rounded-full transition"
                >
                    Contact
                </Link>
            </div>

            {/* Auth */}
            <div className="flex justify-end">
                <SignedOut>
                    <Link
                        href="/sign-in"
                        className="
              flex items-center gap-2
              px-4 py-2
              rounded-full
              border border-white/20
              hover:bg-white/10
              transition
              text-sm font-medium
            "
                    >
                        <span className="max-sm:hidden">Login</span>
                        <User size={16} />
                    </Link>
                </SignedOut>

                <SignedIn>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 border border-white/20",
                            },
                        }}
                    />
                </SignedIn>
            </div>
        </nav>
    )
}
