'use client'
import { Loader2, User, Star, GitCommit, Code, Calendar, GitPullRequest, Flame, TrendingUp, Clock, ChevronLeft, ChevronRight, Volume2, VolumeX, Instagram, Download } from 'lucide-react'
import { toPng } from 'html-to-image'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
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

interface Story {
    id: string
    intro: string
    component: (data: GitWrappedData) => React.ReactNode
}

export default function Page() {
    const [username, setUsername] = useState("")
    const [data, setData] = useState<GitWrappedData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
    const [showStories, setShowStories] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        // Create and setup audio element
        audioRef.current = new Audio('/wrap_bg_audio.mp3')
        audioRef.current.loop = true
        audioRef.current.volume = 0.3

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (showStories && audioRef.current && !isMuted) {
            audioRef.current.play().catch(e => console.log('Audio play failed:', e))
        } else if (audioRef.current) {
            audioRef.current.pause()
        }
    }, [showStories, isMuted])

    const toggleMute = () => {
        setIsMuted(!isMuted)
        if (audioRef.current) {
            audioRef.current.muted = !isMuted
        }
    }

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
            setShowStories(true)
            setCurrentStoryIndex(0)

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

    const stories: Story[] = data ? [
        {
            id: 'welcome',
            intro: "Let's unwrap your coding journey...",
            component: (d) => <WelcomeStory data={d} />
        },
        {
            id: 'commits',
            intro: "Every line of code tells a story...",
            component: (d) => <CommitsStory data={d} />
        },
        {
            id: 'stars',
            intro: "There are billions of stars in the galaxy...",
            component: (d) => <StarsStory data={d} />
        },
        {
            id: 'prs',
            intro: "Collaboration makes us stronger...",
            component: (d) => <PRsStory data={d} />
        },
        {
            id: 'contributions',
            intro: "Consistency is the key to greatness...",
            component: (d) => <ContributionsStory data={d} />
        },
        {
            id: 'streak',
            intro: "The fire within you never stopped burning...",
            component: (d) => <StreakStory data={d} />
        },
        {
            id: 'languages',
            intro: "You speak many languages...",
            component: (d) => <LanguagesStory data={d} />
        },
        {
            id: 'busiest',
            intro: "Some days you were unstoppable...",
            component: (d) => <BusiestDayStory data={d} />
        },
        {
            id: 'finale',
            intro: "CHEERS TO ANOTHER YEAR OF CODE!",
            component: (d) => <FinaleStory data={d} />
        }
    ] : []

    const nextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1)
        }
    }

    const prevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1)
        }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
        if (!showStories) return
        if (e.key === 'ArrowRight') nextStory()
        if (e.key === 'ArrowLeft') prevStory()
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [currentStoryIndex, showStories])

    if (showStories && data) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
                {/* Phone Screen Container */}
                <div
                    className="relative w-full max-w-md bg-black rounded-3xl shadow-2xl overflow-hidden border border-[#333]"
                    style={{ height: 'min(calc(100vh - 2rem), 844px)' }}
                >

                    {/* Progress Bars */}
                    <div className="absolute top-4 left-0 right-0 flex gap-1 px-4 z-40">
                        {stories.map((_, idx) => (
                            <div key={idx} className="flex-1 h-0.5 bg-neutral-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-white transition-all duration-300 ${idx < currentStoryIndex ? 'w-full' :
                                        idx === currentStoryIndex ? 'w-full animate-progress' : 'w-0'
                                        }`}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {/* Mute Button */}
                    <button
                        onClick={toggleMute}
                        className="absolute top-4 right-4 z-50 bg-black/50 rounded-lg p-2 backdrop-blur-sm hover:bg-black/70 transition border border-neutral-700"
                    >
                        {isMuted ? <VolumeX size={18} className="text-white" /> : <Volume2 size={18} className="text-white" />}
                    </button>

                    {/* Story Content */}
                    <div className="relative w-full h-full bg-[#1a1a1a]">
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
                            {/* Intro Text */}
                            <div className="absolute top-16 left-0 right-0 px-8 text-center">
                                <p className="text-sm font-mono tracking-wider uppercase opacity-60 animate-fade-in">
                                    {stories[currentStoryIndex].intro}
                                </p>
                            </div>

                            {/* Story Component */}
                            <div className="w-full flex items-center justify-center animate-scale-in mt-12">
                                {stories[currentStoryIndex].component(data)}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevStory}
                        disabled={currentStoryIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 backdrop-blur-sm rounded-lg p-2 disabled:opacity-20 hover:bg-black/50 transition border border-neutral-700"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <button
                        onClick={nextStory}
                        disabled={currentStoryIndex === stories.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 backdrop-blur-sm rounded-none p-2 disabled:opacity-20 hover:bg-black/50 transition border border-neutral-700"
                    >
                        <ChevronRight size={20} className="text-white" />
                    </button>

                    {/* Tap Areas for Mobile */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-1/3 z-30 cursor-pointer"
                        onClick={prevStory}
                    ></div>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-1/3 z-30 cursor-pointer"
                        onClick={nextStory}
                    ></div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#111] text-neutral-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl px-6">
                <div className="border border-[#333] rounded-lg p-8 bg-[#1a1a1a]">
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-center mb-2 text-white">
                        GIT WRAPPED
                    </h1>
                    <p className="text-neutral-500 text-center mb-8 text-sm tracking-wider uppercase font-mono">
                        Your coding journey — unwrapped
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchWrappedData()}
                            className="flex-1 rounded-lg bg-[#111] border border-[#333] px-5 py-3 text-sm placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition font-mono"
                        />
                        <button
                            onClick={fetchWrappedData}
                            disabled={isLoading}
                            className="rounded-lg bg-white hover:bg-neutral-200 text-black px-8 py-3 font-mono text-sm uppercase tracking-wider transition flex items-center justify-center gap-2 disabled:opacity-40 min-w-[140px]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Unwrap'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Story Components
function WelcomeStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-6">
            <img
                src={data.avatar_url}
                alt={data.login}
                className="w-32 h-32 rounded-lg mx-auto border border-neutral-700 shadow-2xl animate-scale-in grayscale"
            />
            <div>
                <h2 className="text-3xl font-light tracking-tight mb-2">{data.name || data.login}</h2>
                <p className="text-lg opacity-60 font-mono">@{data.login}</p>
            </div>
        </div>
    )
}

function CommitsStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-8">
            <GitCommit size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-sm font-mono uppercase tracking-wider mb-4 opacity-60">You made</p>
                <p className="text-7xl font-light tracking-tighter animate-count-up">{data.totalCommits.toLocaleString()}</p>
                <p className="text-lg mt-4 font-mono uppercase tracking-wider opacity-60">commits</p>
            </div>
        </div>
    )
}

function StarsStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-8">
            <Star size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-sm font-mono uppercase tracking-wider mb-4 opacity-60">Stars collected</p>
                <p className="text-7xl font-light tracking-tighter animate-count-up">{data.totalStars.toLocaleString()}</p>
                <p className="text-lg mt-4 font-mono uppercase tracking-wider opacity-60">★</p>
            </div>
        </div>
    )
}

function PRsStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-8">
            <GitPullRequest size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-sm font-mono uppercase tracking-wider mb-4 opacity-60">You merged</p>
                <p className="text-7xl font-light tracking-tighter animate-count-up">{data.pullRequestsMerged.toLocaleString()}</p>
                <p className="text-lg mt-4 font-mono uppercase tracking-wider opacity-60">pull requests</p>
            </div>
        </div>
    )
}

function ContributionsStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-6">
            <Flame size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-7xl font-light tracking-tighter animate-count-up">{data.totalContributions.toLocaleString()}</p>
                <p className="text-lg mt-2 font-mono uppercase tracking-wider opacity-60">contributions</p>
                <p className="text-sm mt-6 opacity-50 font-mono">across {data.activeDays} active days</p>
            </div>
        </div>
    )
}

function StreakStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-8">
            <Flame size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-sm font-mono uppercase tracking-wider mb-4 opacity-60">Longest streak</p>
                <p className="text-7xl font-light tracking-tighter animate-count-up">{data.longestStreak}</p>
                <p className="text-lg mt-4 font-mono uppercase tracking-wider opacity-60">days</p>
                {data.longestStreakPeriod && (
                    <p className="text-xs mt-6 opacity-50 font-mono">{data.longestStreakPeriod}</p>
                )}
            </div>
        </div>
    )
}

function LanguagesStory({ data }: { data: GitWrappedData }) {
    return (
        <div className="text-center space-y-8">
            <Code size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-sm font-mono uppercase tracking-wider mb-6 opacity-60">Top languages</p>
                <div className="space-y-2">
                    {data.topLanguages.slice(0, 5).map((lang, idx) => (
                        <div
                            key={lang}
                            className="text-2xl font-mono tracking-wide animate-slide-in"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            {lang}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function BusiestDayStory({ data }: { data: GitWrappedData }) {
    const busiestDay = data.busiestDays[0]
    return (
        <div className="text-center space-y-8">
            <Calendar size={60} className="mx-auto opacity-80" strokeWidth={1} />
            <div>
                <p className="text-sm font-mono uppercase tracking-wider mb-4 opacity-60">Busiest day</p>
                <p className="text-xl font-mono mb-2 opacity-80">{formatDate(busiestDay.date)}</p>
                <p className="text-7xl font-light tracking-tighter animate-count-up mt-6">{busiestDay.count}</p>
                <p className="text-lg mt-4 font-mono uppercase tracking-wider opacity-60">contributions</p>
            </div>
        </div>
    )
}

function FinaleStory({ data }: { data: GitWrappedData }) {
    const storyRef = useRef<HTMLDivElement>(null)

    const generateImage = async (): Promise<Blob | null> => {
        if (!storyRef.current) return null

        const button = document.getElementById('download-btn')
        const shareBtn = document.getElementById('share-btn')

        // Hide buttons temporarily
        if (button) button.style.opacity = '0'
        if (shareBtn) shareBtn.style.opacity = '0'

        try {
            const dataUrl = await toPng(storyRef.current, {
                cacheBust: true,
                backgroundColor: '#1a1a1a',
                pixelRatio: 2
            })

            // Convert data URL to blob
            const response = await fetch(dataUrl)
            const blob = await response.blob()

            return blob
        } catch (err) {
            console.error('Image generation failed:', err)
            return null
        } finally {
            if (button) button.style.opacity = '1'
            if (shareBtn) shareBtn.style.opacity = '1'
        }
    }

    const handleDownload = async () => {
        if (!storyRef.current) return

        try {
            const dataUrl = await toPng(storyRef.current, {
                cacheBust: true,
                backgroundColor: '#1a1a1a',
                pixelRatio: 2
            })

            const link = document.createElement('a')
            link.download = `git-wrapped-${data.login}.png`
            link.href = dataUrl
            link.click()

            toast.success("Saved to your device!")
        } catch (err) {
            console.error('Download failed:', err)
            toast.error("Failed to download")
        }
    }

    const handleShare = async () => {
        try {
            const blob = await generateImage()
            if (!blob) {
                toast.error("Failed to generate image")
                return
            }

            // Check if Web Share API is supported
            if (navigator.share && navigator.canShare) {
                const file = new File([blob], `git-wrapped-${data.login}.png`, { type: 'image/png' })

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'My Git Wrapped',
                        text: `Check out my Git Wrapped! 🚀 #GitWrapped`
                    })
                    toast.success("Shared successfully!")
                } else {
                    // Fallback: download the image
                    fallbackDownload(blob)
                }
            } else {
                // Fallback for desktop/unsupported browsers
                fallbackDownload(blob)
            }
        } catch (err: any) {
            // User cancelled or error occurred
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err)
                const blob = await generateImage()
                if (blob) fallbackDownload(blob)
            }
        }
    }

    const fallbackDownload = (blob: Blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `git-wrapped-${data.login}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
        toast.success("Image saved! Share it on Instagram from your photos.")
    }

    return (
        <div ref={storyRef} className="text-center px-4 bg-[#1a1a1a] rounded-lg w-full max-w-sm mx-auto py-4">
            <div className='flex flex-col gap-2'>
                <div className="flex flex-col gap-4 justify-between items-center mb-3">
                    {/* Use standard img for html2canvas compatibility */}
                    <img
                        src={data.avatar_url}
                        alt="Avatar"
                        crossOrigin="anonymous"
                        className="w-[50px] h-[50px] rounded-full object-cover"
                    />

                    <div className='flex flex-col gap-1'>
                        <p className='font-mono'>{data.login}</p>
                        <p className="text-xs font-mono uppercase opacity-60">Here's to another year of amazing code!</p>
                    </div>
                </div>

                <div className="text-xs font-mono opacity-70 grid grid-cols-2 gap-3">
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg" style={{ animationDelay: '0.6s' }}>{data.totalCommits.toLocaleString()} commits</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg" style={{ animationDelay: '0.75s' }}>{data.totalStars.toLocaleString()} stars</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg" style={{ animationDelay: '0.9s' }}>{data.totalContributions.toLocaleString()} contributions</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg" style={{ animationDelay: '1.05s' }}>{data.activeDays} days</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg col-span-2 text-center" style={{ animationDelay: '1.2s' }}>Busiest: {formatDate(data.busiestDays[0].date)}</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg col-span-2 text-center" style={{ animationDelay: '1.35s' }}>Top Language: {data.topLanguages[0]}</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg" style={{ animationDelay: '1.5s' }}>Highest Streak: {data.longestStreak}d</div>
                    <div className="animate-slide-in-stagger border border-white/20 p-3 rounded-lg" style={{ animationDelay: '1.65s' }}>Merged PRs: {data.pullRequestsMerged}</div>
                </div>

                <div className='flex items-center justify-center gap-3 mt-4'>
                    <div
                        id="download-btn"
                        onClick={handleDownload}
                        className='flex items-center justify-center gap-2 border border-white/20 px-4 py-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer z-50'
                    >
                        <Download size={16} className='opacity-80' />
                        <p className='text-xs font-mono uppercase tracking-wider opacity-80'>Download</p>
                    </div>

                    <div
                        id="share-btn"
                        onClick={handleShare}
                        className='flex items-center justify-center gap-2 border border-white/20 px-4 py-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer z-50'
                    >
                        <Instagram size={16} className='opacity-80' />
                        <p className='text-xs font-mono uppercase tracking-wider opacity-80'>Share</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}