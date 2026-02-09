'use client'

import { useUserStore } from '@/app/store/userStore'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function LinkGithubPage() {
    const { userId } = useAuth()
    const { user, setUser, fetchUser } = useUserStore()
    const [githubUsername, setGithubUsername] = useState('')
    const [isLinkingGithub, setIsLinkingGithub] = useState(false)

    useEffect(() => {
        if (userId) fetchUser(userId)
    }, [userId, fetchUser])
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
        } catch (err) {
            if (err) {
                toast.error("An unkown error occured !")
                console.log(err)
            }
            else toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLinkingGithub(false)
        }
    }

    return (
        <div className="py-10 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-[#1a1a1a] rounded-xl p-6 border border-white/5 shadow-xl">
                {user && user.login ? (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            {user.avatar_url && (
                                <Image
                                    src={user.avatar_url}
                                    alt={user.login}
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
                                {user.login}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-400 block">ID</span>
                                {user.id}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-400 block">Type</span>
                                {user.type}
                            </div>
                            {user.html_url && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Profile</span>
                                    <a
                                        href={user.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        View Profile
                                    </a>
                                </div>
                            )}
                            {user.name && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Name</span>
                                    {user.name}
                                </div>
                            )}
                            {user.company && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Company</span>
                                    {user.company}
                                </div>
                            )}
                            {user.location && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Location</span>
                                    {user.location}
                                </div>
                            )}
                            {user.email && (
                                <div>
                                    <span className="font-semibold text-gray-400 block">Email</span>
                                    {user.email}
                                </div>
                            )}
                            {user.blog && (
                                <div className="col-span-full">
                                    <span className="font-semibold text-gray-400 block">Blog</span>
                                    <a
                                        href={user.blog}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        {user.blog}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6 text-center text-white">
                            {user.public_repos != null && (
                                <div>
                                    <div className="text-2xl font-bold">{user.public_repos}</div>
                                    <div className="text-gray-400 text-sm">Repositories</div>
                                </div>
                            )}
                            {user.followers != null && (
                                <div>
                                    <div className="text-2xl font-bold">{user.followers}</div>
                                    <div className="text-gray-400 text-sm">Followers</div>
                                </div>
                            )}
                            {user.following != null && (
                                <div>
                                    <div className="text-2xl font-bold">{user.following}</div>
                                    <div className="text-gray-400 text-sm">Following</div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="animate-pulse space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-white/10 rounded-full" />
                                <div className="h-8 w-48 bg-white/10 rounded-md" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 w-16 bg-white/5 rounded" />
                                        <div className="h-5 w-32 bg-white/10 rounded" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center space-y-2">
                                        <div className="h-8 w-12 bg-white/10 rounded" />
                                        <div className="h-4 w-20 bg-white/5 rounded" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
