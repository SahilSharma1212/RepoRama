'use client'
import { Loader2, User, Star, GitCommit, Code, Calendar, GitPullRequest, Flame, TrendingUp, Clock } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface GitWrappedData {
    avatar_url: string
    name: string | null
    login: string
    bio: string | null
    public_repos: number
    totalCommits: number
    totalStars: number
    topLanguages: string[]
    pullRequestsMerged: number
    longestStreak: number
    longestStreakPeriod?: string
    busiestDays: { date: string; count: number }[]
    monthlyStats: Record<string, number>
    dayOfWeekStats: Record<string, number>
    totalContributions: number
    activeDays: number
    contributionCalendar: { date: string; count: number }[]
}

export default function Page() {
    const [username, setUsername] = useState("")
    const [data, setData] = useState<GitWrappedData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchWrappedData = async () => {
        if (!username.trim()) {
            toast.error("Please enter a GitHub username")
            return
        }

        setIsLoading(true)
        toast.loading("Unwrapping your Git Wrapped...")

        try {
            const response = await fetch('/api/git-wrap', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username.trim() }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to fetch data')
            }

            const wrappedData = await response.json()
            setData(wrappedData)

            toast.dismiss()
            toast.success("Your Git Wrapped is ready!")
        } catch (error: any) {
            toast.dismiss()
            toast.error(error.message || "Something went wrong")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6">
            <div className="w-full max-w-7xl mx-auto">
                <div className="border border-gray-700 rounded-2xl p-8 bg-neutral-900/40 backdrop-blur-md mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Gitty Wrapped
                    </h1>
                    <p className="text-neutral-400 text-center mb-10 text-lg">Your coding journey — unwrapped.</p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="GitHub username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchWrappedData()}
                            className="flex-1 rounded-xl bg-neutral-800 border border-neutral-700 px-5 py-4 text-lg placeholder-neutral-500 focus:outline-none focus:border-emerald-600 transition"
                        />
                        <button
                            onClick={fetchWrappedData}
                            disabled={isLoading}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 font-medium transition flex items-center justify-center gap-2 disabled:opacity-60 min-w-[160px]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Unwrap'}
                        </button>
                    </div>
                </div>

                {data && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Profile Card */}
                        <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 text-center border border-neutral-700 shadow-xl">
                            <img
                                src={data.avatar_url}
                                alt={data.login}
                                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-emerald-500 shadow-2xl"
                            />
                            <h2 className="text-4xl font-bold mb-2">{data.name || data.login}</h2>
                            <p className="text-2xl text-neutral-400 mb-4">@{data.login}</p>
                            {data.bio && <p className="text-lg text-neutral-300 max-w-3xl mx-auto">{data.bio}</p>}
                        </div>

                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={<GitCommit size={28} />} title="Total Commits" value={data.totalCommits.toLocaleString()} />
                            <StatCard icon={<Star size={28} />} title="Stars Earned" value={data.totalStars.toLocaleString()} />
                            <StatCard icon={<GitPullRequest size={28} />} title="PRs Merged" value={data.pullRequestsMerged.toLocaleString()} />
                            <StatCard icon={<User size={28} />} title="Public Repos" value={data.public_repos.toString()} />
                        </div>

                        {/* Contribution Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={<Flame size={28} />}
                                title="Total Contributions"
                                value={data.totalContributions.toLocaleString()}
                            />
                            <StatCard
                                icon={<Calendar size={28} />}
                                title="Active Days"
                                value={data.activeDays.toLocaleString()}
                            />
                            <StatCard
                                icon={<TrendingUp size={28} />}
                                title="Avg per Active Day"
                                value={(data.totalContributions / (data.activeDays || 1)).toFixed(1)}
                            />
                        </div>

                        {/* Streak and Languages */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatCard
                                icon={<Calendar size={28} />}
                                title="Longest Streak"
                                value={data.longestStreak ? `${data.longestStreak} days` : "0 days"}
                                subtitle={data.longestStreakPeriod}
                            />
                            <StatCard
                                icon={<Code size={28} />}
                                title="Top Languages"
                                value={data.topLanguages.join(" • ")}
                            />
                        </div>

                        {/* Busiest Days List */}
                        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Flame className="text-orange-400" size={28} />
                                <h3 className="text-2xl font-bold">Top 10 Busiest Days</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.busiestDays.map((day, idx) => (
                                    <div
                                        key={day.date}
                                        className="bg-neutral-800/50 rounded-xl p-4 flex items-center justify-between border border-neutral-700 hover:border-emerald-700/50 transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl font-bold text-emerald-400">#{idx + 1}</div>
                                            <div>
                                                <div className="font-medium text-lg">{formatDate(day.date)}</div>
                                                <div className="text-sm text-neutral-400">{day.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold text-emerald-400">{day.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Day of Week Stats */}
                        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="text-blue-400" size={28} />
                                <h3 className="text-2xl font-bold">Contributions by Day of Week</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                {Object.entries(data.dayOfWeekStats).map(([day, count]) => (
                                    <div
                                        key={day}
                                        className="bg-neutral-800/50 rounded-xl p-4 text-center border border-neutral-700"
                                    >
                                        <div className="text-sm text-neutral-400 mb-2">{day.substring(0, 3)}</div>
                                        <div className="text-2xl font-bold text-emerald-400">{count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contribution Heatmap */}
                        <ContributionHeatmap data={data.contributionCalendar} />

                        {/* Monthly Stats */}
                        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="text-purple-400" size={28} />
                                <h3 className="text-2xl font-bold">Monthly Breakdown</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Object.entries(data.monthlyStats)
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 12)
                                    .map(([month, count]) => (
                                        <div
                                            key={month}
                                            className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700"
                                        >
                                            <div className="text-sm text-neutral-400 mb-1">{formatMonth(month)}</div>
                                            <div className="text-2xl font-bold text-emerald-400">{count}</div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({
    icon,
    title,
    value,
    subtitle,
    className = "",
}: {
    icon: React.ReactNode
    title: string
    value: string
    subtitle?: string
    className?: string
}) {
    return (
        <div className={`bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center transition hover:border-emerald-700/50 ${className}`}>
            <div className="text-emerald-400 mb-4">{icon}</div>
            <h3 className="text-lg font-medium text-neutral-300 mb-1">{title}</h3>
            <p className="text-3xl md:text-4xl font-bold mb-1">{value}</p>
            {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
        </div>
    )
}

function ContributionHeatmap({ data }: { data: { date: string; count: number }[] }) {
    // Get last 365 days
    const last365Days = data.slice(-365)

    // Get max count for color scaling
    const maxCount = Math.max(...last365Days.map(d => d.count), 1)

    // Group by week
    const weeks: { date: string; count: number }[][] = []
    let currentWeek: { date: string; count: number }[] = []

    last365Days.forEach((day, idx) => {
        currentWeek.push(day)
        if (currentWeek.length === 7 || idx === last365Days.length - 1) {
            weeks.push([...currentWeek])
            currentWeek = []
        }
    })

    const getColor = (count: number) => {
        if (count === 0) return 'bg-neutral-800'
        const intensity = Math.min(count / maxCount, 1)
        if (intensity < 0.25) return 'bg-emerald-900'
        if (intensity < 0.5) return 'bg-emerald-700'
        if (intensity < 0.75) return 'bg-emerald-500'
        return 'bg-emerald-400'
    }

    return (
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-emerald-400" size={28} />
                <h3 className="text-2xl font-bold">Contribution Heatmap (Last 365 Days)</h3>
            </div>
            <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                    {weeks.map((week, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-1">
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    className={`w-3 h-3 rounded-sm ${getColor(day.count)} transition hover:ring-2 hover:ring-emerald-400`}
                                    title={`${day.date}: ${day.count} contributions`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-neutral-400">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-neutral-800"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-900"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-700"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                <span>More</span>
            </div>
        </div>
    )
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}