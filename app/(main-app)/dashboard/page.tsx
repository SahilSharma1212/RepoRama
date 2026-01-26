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
    const [isAddRepoOpen, setIsAddRepoOpen] = useState(false)
    const [isGithubLinkOpen, setIsGithubLinkOpen] = useState(false)
    const { userId } = useAuth()


    useEffect(() => {
        if (userId) {
            fetchUser(userId)
        }
    }, [userId])
    // Add Repo drawer states
    const [repoUrl, setRepoUrl] = useState('')
    const [repoDescription, setRepoDescription] = useState('')
    const [isAddingRepo, setIsAddingRepo] = useState(false)

    // Link GitHub drawer states
    const [githubUsername, setGithubUsername] = useState('')
    const [isLinkingGithub, setIsLinkingGithub] = useState(false)

    const { user, setUser, fetchUser } = useUserStore()

    // Helper to extract GitHub username from URL
    const extractGithubUsername = (url: string) => {
        try {
            const parsed = new URL(url)
            return parsed.pathname.replace('/', '')
        } catch {
            return url.trim()
        }
    }

    // Link GitHub API
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
                setIsGithubLinkOpen(false)
            }
        } catch (err: any) {
            if (err.response?.data?.error) toast.error(err.response.data.error)
            else toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLinkingGithub(false)
        }
    }

    // Add Repo (dummy API)
    const addRepo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!repoUrl.trim()) {
            toast.error('Please enter a repository URL')
            return
        }

        setIsAddingRepo(true)
        try {
            // Replace with actual API call
            console.log('Adding repo', { userId, repoUrl, repoDescription })
            toast.success('Repository added successfully!')
            setRepoUrl('')
            setRepoDescription('')
            setIsAddRepoOpen(false)
        } catch (err) {
            toast.error('Failed to add repository. Please try again.')
        } finally {
            setIsAddingRepo(false)
        }
    }


    return (
        <div>
            {/* Toaster */}
            <Toaster
                reverseOrder={false}
                toastOptions={{
                    success: {
                        style: {
                            background: '#252525',
                            color: '#ccc',
                        },
                    },
                    error: {
                        style: {
                            background: '#252525',
                            color: '#ccc',
                        },
                    },
                }} />

            {/* NAVBAR */}
            <nav className='flex gap-4 py-4 px-4 border-b border-white/10 justify-between'>
                <h2 className='text-3xl font-bold text-gray-200'>Dashboard</h2>
                <div className='flex gap-3 h-full items-center'>
                    {
                        user ?
                            <Link href='/dashboard/profile' target='_blank'>
                                <Image
                                    src={user.github_avatar_url!}
                                    alt={user.github_login!}
                                    width={27}
                                    height={27}
                                    className='rounded-full'
                                />
                            </Link>
                            :
                            <User
                                onClick={() => setIsGithubLinkOpen(true)}
                                className='text-gray-500 w-5 h-5 cursor-pointer hover:text-gray-300'
                            />
                    }
                    <UserButton />
                </div>
            </nav>

            {/* REPOS SECTION */}
            <section className='grid grid-cols-3 flex-col max-md:grid-cols-2 max-sm:grid-cols-1 py-4 px-4 gap-5'>
                <div className='flex items-center justify-between bg-[#252525] p-6 rounded-sm gap-2 group'>
                    <div className='flex flex-col items-start justify-center gap-2'>
                        <h2 className='text-2xl font-bold text-gray-200'>GIthub Repo Name</h2>
                        <p className='text-sm text-gray-500 w-full wrap-break-word'>
                            This is Project Overview for project one here is the github repo url
                        </p>
                    </div>
                    <ArrowRight className='text-gray-500 -rotate-45  group-hover:rotate-0 transition-all duration-300' />
                </div>

                <div className='flex items-center justify-between bg-[#252525] p-6 rounded-sm gap-2 group'>
                    <div className='flex flex-col items-start justify-center gap-2'>
                        <h2 className='text-2xl font-bold text-gray-200'>GIthub Repo Name</h2>
                        <p className='text-sm text-gray-500 w-full wrap-break-word'>
                            This is Project Overview for project one here is the github repo url
                        </p>
                    </div>
                    <ArrowRight className='text-gray-500 -rotate-45  group-hover:rotate-0 transition-all duration-300' />
                </div>

                <div
                    onClick={() => setIsAddRepoOpen(true)}
                    className='flex items-center bg-[#252525] hover:bg-[#353535] transition-all cursor-pointer border border-white/10 p-6 rounded-sm gap-2 group justify-center'
                >
                    <p className='text-[#777] text-xl font-semibold'>Add a Repo</p>
                    <Plus className='text-[#777]' />
                </div>
            </section>

            {/* ADD REPO DRAWER */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isAddRepoOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsAddRepoOpen(false)}
            >
                <form
                    onSubmit={addRepo}
                    onClick={(e) => e.stopPropagation()}
                    className={`fixed bottom-0 w-full bg-[#151515] p-6 transition-transform duration-300 rounded-t-xl ${isAddRepoOpen ? 'translate-y-0' : 'translate-y-full'
                        }`}
                >
                    <h2 className='text-xl font-semibold text-gray-200 mb-4'>Add Repository</h2>

                    <input
                        placeholder='GitHub Repo URL'
                        className='w-full bg-[#252525] border border-white/10 p-2 text-gray-200 outline-none rounded-md'
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                    />
                    <textarea
                        placeholder='Add description'
                        className='w-full bg-[#252525] border border-white/10 p-2 text-gray-200 outline-none rounded-md mt-3'
                        value={repoDescription}
                        onChange={(e) => setRepoDescription(e.target.value)}
                    />

                    <button
                        type='submit'
                        disabled={isAddingRepo}
                        className='py-2 bg-white w-full mt-3 rounded-md text-black hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isAddingRepo ? <Loader2 className='animate-spin' /> : 'Connect Repository'}
                    </button>
                </form>
            </div>

            {/* LINK GITHUB DRAWER */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isGithubLinkOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsGithubLinkOpen(false)}
            >
                <form
                    onSubmit={linkGithub}
                    onClick={(e) => e.stopPropagation()}
                    className={`fixed bottom-0 w-full bg-linear-to-b from-[#1a1a1a] to-[#0f0f0f] border-t border-white/10 p-6 transition-transform duration-500 ease-out rounded-t-2xl shadow-2xl ${isGithubLinkOpen ? 'translate-y-0' : 'translate-y-full'
                        }`}
                >

                    <h2 className="text-2xl font-bold text-white mb-2">Link GitHub Account</h2>
                    <p className="text-gray-400 text-sm mb-6">Connect your GitHub profile to get started</p>

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>
                            <input
                                placeholder="GitHub Profile URL or Username"
                                className="w-full bg-[#1f1f1f] border border-white/10 pl-10 pr-4 py-3 text-gray-200 outline-none rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={githubUsername}
                                onChange={(e) => setGithubUsername(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLinkingGithub || !githubUsername}
                            className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-blue-500/25 disabled:hover:shadow-none"
                        >
                            {isLinkingGithub ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span>Linking...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span>Link GitHub Account</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}
