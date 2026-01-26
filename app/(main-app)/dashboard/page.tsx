'use client'

import { useUserStore } from '@/app/store/userStore'
import { useAuth, UserButton } from '@clerk/nextjs'
import axios from 'axios'
import { ArrowRight, Loader2, Plus, User } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function PostPage() {
    const { userId } = useAuth()
    const { user, setUser, fetchUser, repos, fetchUserRepos } = useUserStore()

    const [isAddRepoOpen, setIsAddRepoOpen] = useState(false)
    const [isGithubLinkOpen, setIsGithubLinkOpen] = useState(false)

    const [isFetchingRepos, setIsFetchingRepos] = useState(true)

    // Add repo state
    const [repoUrl, setRepoUrl] = useState('')
    const [repoDescription, setRepoDescription] = useState('')
    const [isAddingRepo, setIsAddingRepo] = useState(false)

    // GitHub link state
    const [githubUsername, setGithubUsername] = useState('')
    const [isLinkingGithub, setIsLinkingGithub] = useState(false)

    /* ------------------ EFFECTS ------------------ */

    useEffect(() => {
        if (!userId) return
        fetchUser(userId)
    }, [userId])

    useEffect(() => {
        if (!userId) return

        const loadRepos = async () => {
            setIsFetchingRepos(true)
            await fetchUserRepos(userId)
            setIsFetchingRepos(false)
        }

        loadRepos()
    }, [userId])

    /* ------------------ HELPERS ------------------ */

    const extractGithubUsername = (input: string) => {
        try {
            const url = new URL(input)
            return url.pathname.replace('/', '')
        } catch {
            return input.trim()
        }
    }

    /* ------------------ ACTIONS ------------------ */

    const linkGithub = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!githubUsername.trim()) {
            toast.error('Enter GitHub username or URL')
            return
        }

        const username = extractGithubUsername(githubUsername)
        setIsLinkingGithub(true)

        try {
            const res = await axios.post('/api/user/link', {
                userId,
                githubUsername: username,
            })

            toast.success('GitHub linked')
            setUser(res.data.user)
            setGithubUsername('')
            setIsGithubLinkOpen(false)
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Something went wrong')
        } finally {
            setIsLinkingGithub(false)
        }
    }

    const addRepo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!userId) {
            toast.error('Unauthorized')
            return
        }

        setIsAddingRepo(true)

        try {
            await axios.post('/api/repo', {
                userId,
                url: repoUrl,
                description: repoDescription,
            })

            toast.success('Repository added')
            setRepoUrl('')
            setRepoDescription('')
            setIsAddRepoOpen(false)
            fetchUserRepos(userId)
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to add repo')
        } finally {
            setIsAddingRepo(false)
        }
    }

    /* ------------------ UI ------------------ */

    return (
        <div>
            <Toaster reverseOrder={false} />

            {/* NAVBAR */}
            <nav className="flex justify-between items-center px-4 py-4 border-b border-white/10">
                <h2 className="text-3xl font-bold text-gray-200">Dashboard</h2>

                <div className="flex items-center gap-3">
                    {user ? (
                        <Link href="/dashboard/profile">
                            <Image
                                src={user.github_avatar_url!}
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

            {/* REPOS */}
            <section className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-5 p-4">
                {isFetchingRepos
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#252525] p-6 rounded-sm animate-pulse space-y-3"
                        >
                            <div className="h-5 w-3/4 bg-[#888] rounded" />
                            <div className="h-4 w-full bg-[#888] rounded" />
                        </div>
                    ))
                    : repos.map((repo) => (
                        <div
                            key={repo.id}
                            className="flex justify-between bg-[#252525] p-6 rounded-sm border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-white/5 hover:scale-102 transition"
                        >
                            <div className="overflow-hidden">
                                <h3 className="text-lg font-semibold text-gray-200 truncate">
                                    {repo.github_repo_url.split('/').slice(-2).join('/')}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {repo.description || 'No description'}
                                </p>
                            </div>
                            <a href={repo.github_repo_url} target="_blank">
                                <ArrowRight className="text-gray-500 -rotate-45 hover:rotate-0 transition" />
                            </a>
                        </div>
                    ))}

                {/* ADD CARD */}
                <div
                    onClick={() => setIsAddRepoOpen(true)}
                    className="flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#303030] cursor-pointer border border-white/10 p-6 rounded-sm hover:border-white/10 hover:shadow-lg hover:shadow-white/5 hover:scale-102 "
                >
                    <span className="text-gray-400 text-lg font-semibold">Add Repo</span>
                    <Plus className="text-gray-400" />
                </div>
            </section>

            {/* ADD REPO DRAWER */}
            <div
                className={`fixed inset-0 bg-black/60 z-50 transition ${isAddRepoOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsAddRepoOpen(false)}
            >
                <form
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={addRepo}
                    className={`fixed bottom-0 w-full bg-[#151515] p-6 rounded-t-xl transition ${isAddRepoOpen ? 'translate-y-0' : 'translate-y-full'
                        }`}
                >
                    <h2 className="text-xl text-gray-200 mb-4">Add Repository</h2>

                    <input
                        className="w-full bg-[#252525] border border-white/10 p-2 rounded-md text-gray-200"
                        placeholder="GitHub Repo URL"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                    />

                    <textarea
                        className="w-full mt-3 bg-[#252525] border border-white/10 p-2 rounded-md text-gray-200"
                        placeholder="Description (optional)"
                        rows={3}
                        value={repoDescription}
                        onChange={(e) => setRepoDescription(e.target.value)}
                    />

                    <button
                        disabled={isAddingRepo || !repoUrl}
                        className="w-full mt-4 py-2 bg-white text-black rounded-md flex justify-center gap-2 disabled:opacity-50"
                    >
                        {isAddingRepo ? <Loader2 className="animate-spin" /> : 'Add Repository'}
                    </button>
                </form>
            </div>

            {/* LINK GITHUB DRAWER (unchanged logic) */}
            <div
                className={`fixed inset-0 bg-black/60 z-50 transition ${isGithubLinkOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsGithubLinkOpen(false)}
            >
                <form
                    onClick={(e) => e.stopPropagation()}
                    onSubmit={linkGithub}
                    className={`fixed bottom-0 w-full bg-[#121212] p-6 rounded-t-xl transition ${isGithubLinkOpen ? 'translate-y-0' : 'translate-y-full'
                        }`}
                >
                    <h2 className="text-xl text-white mb-4">Link GitHub</h2>

                    <input
                        className="w-full bg-[#252525] border border-white/10 p-3 rounded-md text-gray-200"
                        placeholder="GitHub username or URL"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                    />

                    <button
                        disabled={isLinkingGithub}
                        className="w-full mt-4 py-3 bg-white text-black rounded-md flex justify-center gap-2 disabled:opacity-50"
                    >
                        {isLinkingGithub ? <Loader2 className="animate-spin" /> : 'Link GitHub'}
                    </button>
                </form>
            </div>
        </div>
    )
}
