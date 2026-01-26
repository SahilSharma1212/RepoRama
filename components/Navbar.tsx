'use client'
import { User } from "lucide-react";
import {
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import Link from "next/link";
export default function Navbar() {

    return (
        <nav
            className="
                sticky top-0 z-50
                grid items-center
                grid-cols-2 md:grid-cols-3
                px-4 py-3
                md:px-6 md:py-4
                lg:px-8
                backdrop-blur-md
                bg-[#11111105]
                text-white
            "
        >
            {/* Logo */}
            <div className="hidden md:block font-bold text-3xl bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent">
                REPORAMA
            </div>

            {/* Center Links */}
            <div className="flex justify-start md:justify-center">
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
                    <Link href={`/visualiser`} className="cursor-pointer border-b border-transparent hover:border-gray-400 transition-all duration-300 max-md:hidden">
                        Demo
                    </Link>
                    <Link href={'/'} className="cursor-pointer border-b border-transparent hover:border-gray-400 transition-all duration-300">
                        Home
                    </Link>
                    <Link href={`/dashboard`} className="cursor-pointer border-b border-transparent hover:border-gray-400 transition-all duration-300">
                        Dashboard
                    </Link>
                    <Link href={''} className="cursor-pointer border-b border-transparent hover:border-gray-400 transition-all duration-300">
                        Contact
                    </Link>
                </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex justify-end">
                {/* Auth Buttons */}
                <div className="flex justify-end">
                    <SignedOut>
                        <div
                            className="
                inline-flex items-center
                rounded-full
                border border-white/30
                text-lg font-semibold
                bg-linear-to-br from-white to-gray-400
                bg-clip-text text-transparent
                overflow-hidden
            "
                        >
                            <Link href={'/sign-in'}
                                className="
                        cursor-pointer
                        px-4 py-2
                        hover:bg-[#333]
                        hover:text-white
                        transition-all duration-300
                        flex items-center gap-2
                    "
                            >
                                <span className="max-sm:hidden">Login</span>
                                <User className="text-gray-100" strokeWidth={1} />
                            </Link>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-white/30",
                                },
                            }}
                        />
                    </SignedIn>
                </div>

            </div>
        </nav>
    );
}
