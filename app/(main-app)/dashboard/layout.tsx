'use client'
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { TvMinimalPlay, User } from "lucide-react";
import { useUserStore } from "@/app/store/userStore";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = useUserStore();
    const [isGithubLinkOpen, setIsGithubLinkOpen] = useState(false);
    const pageurl = usePathname();
    return (
        <div>
            {/* NAVBAR */}
            <nav className={pageurl.startsWith("/dashboard/repo") ? `hidden` : `flex justify-between items-center px-4 py-4 border-b border-white/10`}>
                <h2 className="text-3xl font-bold text-gray-200 max-md:text-xl">RepoRama</h2>

                <div className="flex items-center gap-3">

                    <Link href="/git-wrap" className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-sm cursor-pointer relative group">
                        <TvMinimalPlay className="text-[#bbb] w-5 h-5 cursor-pointer" />
                        <div className="hidden group-hover:block absolute top-full left-0 text-xs bg-[#222] text-white rounded-sm p-2 w-16 mt-2">
                            Git Wrap
                        </div>
                    </Link>

                    {user ? (
                        <Link href="/dashboard/profile">
                            <Image
                                src={user.avatar_url!}
                                alt="avatar"
                                width={28}
                                height={28}
                                className="rounded-full border border-white/10"
                            />
                        </Link>
                    ) : (
                        <User
                            className="w-5 h-5 text-gray-500 cursor-pointer"
                            onClick={() => setIsGithubLinkOpen(true)}
                        />
                    )}
                    <UserButton />
                </div>
            </nav>
            {children}
        </div>
    );

}
