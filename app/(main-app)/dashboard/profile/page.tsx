'use client'

import { useUserStore } from '@/app/store/userStore'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import GithubContributionCalendar from '@/components/GithubContributionCalendar'
import CommitTimeOfDayHeatmap from '@/components/CommitTimeOfDayHeatmap'
import Link from 'next/link'

type CalendarDay = {
    date: string;
    count: number;
    weekday: number;
    weekIndex: number;
};

type HourlyBucket = {
    hour: number;
    count: number;
};

type ContributionsResponse = {
    login: string;
    from: string;
    to: string;
    calendarDays: CalendarDay[];
    hourlyHistogram: HourlyBucket[];
};

export default function LinkGithubPage() {
    const { userId } = useAuth()
    const { user, setUser, fetchUser } = useUserStore()
    const [githubUsername, setGithubUsername] = useState('')
    const [isLinkingGithub, setIsLinkingGithub] = useState(false)

    const [contribData, setContribData] = useState<ContributionsResponse | null>(null)
    const [isLoadingContrib, setIsLoadingContrib] = useState(false)
    const [contribError, setContribError] = useState<string | null>(null)

    useEffect(() => {
        if (userId) fetchUser(userId)
    }, [userId, fetchUser])

    useEffect(() => {
        const fetchContributions = async () => {
            if (!user || !user.login) return
            setIsLoadingContrib(true)
            setContribError(null)
            try {
                const res = await fetch(`/api/github/contributions?login=${encodeURIComponent(user.login)}`)
                if (!res.ok) {
                    const data = await res.json().catch(() => null)
                    const message = data?.error || 'Failed to load contribution data'
                    setContribError(message)
                    return
                }
                const data = (await res.json()) as ContributionsResponse
                setContribData(data)
            } catch (err) {
                console.error(err)
                setContribError('Something went wrong while loading contributions.')
            } finally {
                setIsLoadingContrib(false)
            }
        }

        fetchContributions()
    }, [user])

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
        <div className="h-fit w-full flex flex-col items-center justify-start">
            <div className="w-full max-w-6xl p-8 border-x border-white/5 min-h-screen">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="text-sm text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <span className='bg-neutral-800 p-2'>← Back to Dashboard</span>
                    </Link>
                </div>
                {user && user.login ? (
                    <>
                        <div className="flex items-center gap-4 mb-6">
                            {user.avatar_url && (
                                <Image
                                    src={user.avatar_url}
                                    alt={user.login}
                                    width={80}
                                    height={80}
                                    className="rounded-none border border-white/20"
                                />
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    GitHub Account Linked
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Visualising your contribution activity over time.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
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

                        <div className="mt-8 space-y-6">
                            <div>
                                <div className="flex items-baseline justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white">
                                        Contributions
                                    </h3>
                                    {contribData && (
                                        <p className="text-xs text-gray-500">
                                            Last year ({new Date(contribData.from).toLocaleDateString()} -{" "}
                                            {new Date(contribData.to).toLocaleDateString()})
                                        </p>
                                    )}
                                </div>

                                {isLoadingContrib && (
                                    <div className="animate-pulse h-24 w-full rounded-none bg-white/5" />
                                )}

                                {contribError && (
                                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                        {contribError}
                                    </div>
                                )}

                                {!isLoadingContrib && !contribError && contribData && (
                                    <div className="overflow-x-auto">
                                        <GithubContributionCalendar calendarDays={contribData.calendarDays} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-baseline justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white">
                                        Commit activity by time of day
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Based on recent commit timestamps
                                    </p>
                                </div>

                                {isLoadingContrib && (
                                    <div className="animate-pulse h-16 w-full rounded-none bg-white/5" />
                                )}

                                {!isLoadingContrib && !contribError && contribData && (
                                    <CommitTimeOfDayHeatmap hourlyHistogram={contribData.hourlyHistogram} />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="animate-pulse space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-white/10 rounded-none" />
                                <div className="h-8 w-48 bg-white/10 rounded-none" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 w-16 bg-white/5 rounded-none" />
                                        <div className="h-5 w-32 bg-white/10 rounded-none" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col items-center space-y-2">
                                        <div className="h-8 w-12 bg-white/10 rounded-none" />
                                        <div className="h-4 w-20 bg-white/5 rounded-none" />
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

