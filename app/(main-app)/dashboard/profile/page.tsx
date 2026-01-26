'use client'

import { useUserStore } from '@/app/store/userStore'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export default function LinkGithubPage() {
    const { userId } = useAuth()
    const { user, setUser, fetchUser } = useUserStore()
    const [githubUsername, setGithubUsername] = useState('')
    const [isLinkingGithub, setIsLinkingGithub] = useState(false)

    useEffect(() => {
        if (userId) fetchUser(userId)
    }, [userId])
    const extractGithubUsername = (url: string) => {
        try {
            const parsed = new URL(url)
            return parsed.pathname.replace('/', '')
        } catch {
            return url.trim()
        }
    }

    const linkGithub = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!githubUsername.trim()) {
            toast.error('Please enter a GitHub username or URL')
            return
        }

        const username = extractGithubUsername(githubUsername)
        setIsLinkingGithub(true)

        try {
            const res = await axios.post('/api/user/link', { userId, githubUsername: username })
            if (res.data.error) {
                toast.error(res.data.error)
            } else {
                toast.success('GitHub linked successfully!')
                setUser(res.data.user)
                setGithubUsername('')
            }
        } catch (err: any) {
            if (err.response?.data?.error) toast.error(err.response.data.error)
            else toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLinkingGithub(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] p-4">
            <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-xl p-6 border border-white/5 shadow-xl">
                {user && user.github_login ? (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            {user.github_avatar_url && (
                                <Image
                                    src={user.github_avatar_url}
                                    alt={user.github_login}
                                    width={80}
                                    height={80}
                                    className="rounded-full border border-white/20"
                                />
                            )}
                            <h2 className="text-2xl font-bold text-white">
                                GitHub Account Linked
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                            <div>
                                <span className="font-semibold text-gray-400 block">Login</span>
                                {user.github_login}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-400 block">ID</span>
                                {user.github_id}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-400 block">Type</span>
                                {user.github_type}
                            </div>
                            {user.github_profile_url && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Profile</span>
                                    <a
                                        href={user.github_profile_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        View Profile
                                    </a>
                                </div>
                            )}
                            {user.github_name && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Name</span>
                                    {user.github_name}
                                </div>
                            )}
                            {user.github_company && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Company</span>
                                    {user.github_company}
                                </div>
                            )}
                            {user.github_location && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Location</span>
                                    {user.github_location}
                                </div>
                            )}
                            {user.github_email && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Email</span>
                                    {user.github_email}
                                </div>
                            )}
                            {user.github_blog && (
                                <div className="col-span-full">
                                    <span className="font-semibold text-gray-400 block">Blog</span>
                                    <a
                                        href={user.github_blog}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        {user.github_blog}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6 text-center text-white">
                            {user.github_public_repos != null && (
                                <div>
                                    <div className="text-2xl font-bold">{user.github_public_repos}</div>
                                    <div className="text-gray-400 text-sm">Repositories</div>
                                </div>
                            )}
                            {user.github_followers != null && (
                                <div>
                                    <div className="text-2xl font-bold">{user.github_followers}</div>
                                    <div className="text-gray-400 text-sm">Followers</div>
                                </div>
                            )}
                            {user.github_following != null && (
                                <div>
                                    <div className="text-2xl font-bold">{user.github_following}</div>
                                    <div className="text-gray-400 text-sm">Following</div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Link GitHub Account
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Connect your GitHub profile to get started
                        </p>

                        <form onSubmit={linkGithub} className="space-y-4">
                            <input
                                placeholder="GitHub Profile URL or Username"
                                className="w-full bg-[#252525] border border-white/10 p-3 text-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={githubUsername}
                                onChange={(e) => setGithubUsername(e.target.value)}
                            />

                            <button
                                type="submit"
                                disabled={isLinkingGithub || !githubUsername}
                                className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLinkingGithub ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Linking...
                                    </>
                                ) : (
                                    'Link GitHub Account'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
