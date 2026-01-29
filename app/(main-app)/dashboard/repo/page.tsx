'use client'

import { Suspense, useEffect, useState } from "react"
import { Star, GitFork, Eye, Calendar, Code, Users, GitBranch, AlertCircle, GitCommit, User, Github, ChevronDown, File, Folder, EyeIcon, Notebook } from "lucide-react"
import { useSearchParams } from "next/navigation"
import type { RepoData, LanguageData, Contributor, Commit, Branch, TreeItem } from "@/app/types"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import BranchNetworkGraph from "./BranchNetworkGraph"

function DashboardSkeleton() {
    return (
        <div className="min-h-screen text-white p-8 animate-pulse">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gray-700" />
                        <div className="space-y-3">
                            <div className="h-10 w-64 bg-gray-700 rounded" />
                            <div className="h-6 w-48 bg-gray-700 rounded" />
                            <div className="h-4 w-96 bg-gray-700 rounded" />
                        </div>
                    </div>
                    <div className="w-14 h-14 bg-gray-700 rounded-lg" />
                </div>

                {/* Actions Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#222] backdrop-blur rounded-xl p-4 border border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-700 rounded-lg" />
                                <div className="h-5 w-32 bg-gray-700 rounded" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-5 h-5 bg-gray-700 rounded" />
                                <div className="h-4 w-20 bg-gray-700 rounded" />
                            </div>
                            <div className="h-9 w-16 bg-gray-700 rounded" />
                        </div>
                    ))}
                </div>

                {/* Branch Content Skeleton */}
                <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-700 rounded" />
                            <div className="h-7 w-48 bg-gray-700 rounded" />
                        </div>
                        <div className="h-4 w-32 bg-gray-700 rounded" />
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3">
                                <div className="w-5 h-5 bg-gray-700 rounded shrink-0" />
                                <div className="h-4 flex-1 bg-gray-700 rounded" />
                                <div className="h-3 w-16 bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two Column Layout Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-6 bg-gray-700 rounded" />
                                <div className="h-7 w-32 bg-gray-700 rounded" />
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="h-16 bg-gray-700 rounded" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Repository Details Skeleton */}
                <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-6 h-6 bg-gray-700 rounded" />
                        <div className="h-7 w-48 bg-gray-700 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-24 bg-gray-700 rounded" />
                                <div className="h-6 w-32 bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function GitHubDashboardContent() {
    const [repoData, setRepoData] = useState<RepoData>({})
    const [languageData, setLanguageData] = useState<LanguageData>({})
    const [contributors, setContributors] = useState<Contributor[]>([])
    const [commits, setCommits] = useState<Commit[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const [selectedBranch, setSelectedBranch] = useState<string>("")
    const [branchContent, setBranchContent] = useState<TreeItem[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingBranchContent, setLoadingBranchContent] = useState(false)

    const searchParams = useSearchParams()
    const REPO_OWNER = searchParams.get("repoOwner")
    const REPO_NAME = searchParams.get("repoName")

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch repo data
                const repoRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`)
                const repoJson = await repoRes.json()
                setRepoData(repoJson)

                // Fetch language data
                const langRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/languages`)
                const langJson = await langRes.json()
                setLanguageData(langJson)

                // Fetch contributors with error handling
                const contribRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`)
                const contribJson = await contribRes.json()
                if (Array.isArray(contribJson)) {
                    setContributors(contribJson)
                } else {
                    setContributors([])
                }

                // Fetch commits with error handling
                const commitsRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=10`)
                const commitsJson = await commitsRes.json()
                if (Array.isArray(commitsJson)) {
                    setCommits(commitsJson)
                } else {
                    setCommits([])
                }

                // Fetch branches with error handling
                const branchesRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/branches`)
                const branchesJson = await branchesRes.json()
                if (Array.isArray(branchesJson)) {
                    setBranches(branchesJson)
                } else {
                    setBranches([])
                }

                // Set default branch
                if (repoJson.default_branch) {
                    setSelectedBranch(repoJson.default_branch)
                    // Fetch default branch content
                    await fetchBranchContent(repoJson.default_branch)
                }

                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                setLoading(false)
            }
        }

        // Only fetch if we have both REPO_OWNER and REPO_NAME
        if (REPO_OWNER && REPO_NAME) {
            fetchAllData()
        } else {
            setLoading(false)
        }
    }, [REPO_OWNER, REPO_NAME])

    const fetchBranchContent = async (branchName: string) => {
        setLoadingBranchContent(true)
        try {
            const response = await fetch(
                `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${branchName}?recursive=1`
            )
            const data = await response.json()

            if (data.tree && Array.isArray(data.tree)) {
                // Filter to show only root level items and first level subdirectories
                const rootItems = data.tree.filter((item: TreeItem) => {
                    const pathParts = item.path.split('/')
                    return pathParts.length <= 2
                })
                setBranchContent(rootItems)
            } else {
                setBranchContent([])
            }
        } catch (error) {
            console.error("Error fetching branch content:", error)
            setBranchContent([])
        }
        setLoadingBranchContent(false)
    }

    const handleBranchChange = async (branchName: string) => {
        setSelectedBranch(branchName)
        setIsDropdownOpen(false)
        await fetchBranchContent(branchName)
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        })
    }

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
        return `${Math.floor(diffInSeconds / 31536000)} years ago`
    }

    const formatSize = (bytes?: number) => {
        if (!bytes) return "0 KB"
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const calculateLanguagePercentages = () => {
        const total = Object.values(languageData).reduce((sum: number, val: number) => sum + val, 0)
        return Object.entries(languageData).map(([lang, bytes]: [string, number]) => ({
            name: lang,
            percentage: ((bytes / total) * 100).toFixed(1),
            bytes
        }))
    }

    const languageColors: { [key: string]: string } = {
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        HTML: "#e34c26",
        CSS: "#563d7c",
        Python: "#3572A5",
        Java: "#b07219",
        Go: "#00ADD8",
        Rust: "#dea584",
        Ruby: "#701516"
    }

    const truncateMessage = (message: string, maxLength: number = 80) => {
        if (message.length <= maxLength) return message
        return message.substring(0, maxLength) + "..."
    }

    if (loading) {
        return <DashboardSkeleton />
    }

    const languages = calculateLanguagePercentages()

    return (
        <div className="min-h-screen text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-linear-to-br from-[#1f1f1f] to-[#141414] p-6 shadow-lg">
                    <div className="flex items-center gap-4 max-md:flex-col max-md:items-start w-full justify-between">
                        <div className="flex items-center gap-2">

                            {repoData.owner?.avatar_url && (
                                <img
                                    src={repoData.owner.avatar_url}
                                    alt={repoData.owner.login}
                                    className="w-20 h-20 rounded-xl border border-white/10 shadow-md max-md:w-16 max-md:h-16"
                                />
                            )}
                            <div className="flex flex-col gap-2 mr-2 overflow-hidden">
                                <h1 className="text-2xl font-semibold tracking-tight max-md:text-2xl wrap-break-words">
                                    {repoData.name}
                                </h1>
                                <p className="text-sm text-white/50 wrap-break-words overflow-hidden">{repoData.full_name}</p>
                            </div>

                            <div className="w-0.5 self-stretch rounded-full max-md:hidden bg-white" />
                            <div className="flex flex-col ml-3 gap-2 max-md:hidden">
                                <h2 className="text-xl font-semibold tracking-tight max-md:text-xl">Description</h2>

                                {repoData.description ? (

                                    <p className="text-white/70 text-xs max-md:hidden">
                                        {repoData.description}
                                    </p>
                                ) : <p className="text-white/40 text-xs max-md:hidden">
                                    ---- No description available ----
                                </p>}
                            </div>

                        </div>
                    </div>

                    <div className="flex gap-2 max-sm:justify-between">
                        <div className="ml-3 flex flex-col gap-2 sm:flex-row">
                            <Link
                                href={repoData.html_url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 text-white/80 hover:bg-white/10 transition border border-white/20 md:p-3"
                            >
                                <Github className="w-4 h-4" />
                                <span className="text-normal font-medium">View</span>
                            </Link>

                            <Link
                                href={`${repoData.html_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/5 text-yellow-500 border border-amber-500/30 hover:bg-yellow-500/10 transition md:p-3"
                            >
                                <Star className="w-4 h-4" />
                                <span className="text-normal font-medium ">Add <span className="max-sm:hidden">Star</span>  </span>
                            </Link>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row">

                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-300/5 text-purple-300 border border-purple-300/20 hover:bg-purple-300/10 transition md:p-3 cursor-pointer">
                                        <GitBranch className="w-4 h-4" />
                                        <span className="text-normal font-medium max-sm:hidden">View</span>
                                        <span className="text-normal font-medium">Branches</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-5xl w-[90vw] h-[80vh] bg-[#1a1a1a] border-white/10 text-white p-0 overflow-hidden">
                                    <div className="p-6 h-full flex flex-col">
                                        <DialogTitle className="text-xl font-bold mb-4">Branch Structure Visualization</DialogTitle>
                                        <div className="flex-1 min-h-0">
                                            <BranchNetworkGraph
                                                repoOwner={REPO_OWNER || ""}
                                                repoName={REPO_NAME || ""}
                                                className="h-full border-none bg-black/20"
                                            />
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Link
                                href={`/dashboard/repo/notes?repoOwner=${repoData.owner?.login}&repoName=${repoData.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-300/5 text-blue-300 border border-blue-300/20 hover:bg-blue-300/10 transition md:p-3"
                            >
                                <Notebook className="w-4 h-4" />
                                <span className="text-normal font-medium">Notes</span>
                            </Link>
                        </div>
                    </div>

                </div>


                <Toaster reverseOrder={false} toastOptions={{
                    style: {
                        background: "#1e1e1e",
                        color: "#fff"
                    }
                }} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Star Repository */}
                    <Link
                        href={`/dashboard/repo/visualiser?repoOwner=${repoData.owner?.login}&repoName=${repoData.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-linear-to-br from-pink-600/20 to-pink-800/20 backdrop-blur rounded-xl p-4 border border-pink-500/30 hover:border-pink-400/50 transition-all hover:shadow-lg hover:shadow-pink-500/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition-colors">
                                <EyeIcon className="w-5 h-5 text-pink-400" />
                            </div>
                            <h3 className="font-semibold text-white">Visualizer Playground</h3>
                        </div>
                    </Link>

                    {/* Follow User */}
                    <Link
                        href={`https://github.com/${repoData.owner?.login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-[#222] backdrop-blur rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-white">Follow User</h3>
                        </div>
                    </Link>


                    {/* Branch Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full group relative bg-[#222] backdrop-blur rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all hover:shadow-lg hover:shadow-green-500/20 text-left"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                                        <GitBranch className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Branch</h3>
                                        <p className="text-xs text-gray-400 font-mono">{selectedBranch}</p>
                                    </div>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-green-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#222] border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                {!Array.isArray(branches) || branches.length === 0 ? (
                                    <div className="px-4 py-3 text-gray-400 text-sm">
                                        No branches found
                                    </div>
                                ) : (
                                    branches.map((branch) => (
                                        <button
                                            key={branch.name}
                                            onClick={() => handleBranchChange(branch.name)}
                                            className={`w-full text-left px-4 py-3 hover:bg-[#333] transition-colors border-b border-gray-700 last:border-b-0 ${selectedBranch === branch.name ? 'bg-green-500/10 text-green-400' : 'text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <GitBranch className="w-4 h-4" />
                                                <span className="font-mono text-sm">{branch.name}</span>
                                                {branch.protected && (
                                                    <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                                                        Protected
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Clone Repository */}
                    <button
                        onClick={() => {
                            const cloneUrl = `https://github.com/${repoData.full_name}.git`
                            navigator.clipboard.writeText("git clone " + cloneUrl)
                            toast.success("Copied clone command!")
                        }}
                        className="group relative bg-[#222] backdrop-blur rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all hover:shadow-lg hover:shadow-blue-500/20 text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-white">Clone Repository</h3>
                        </div>
                    </button>
                </div>



                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-gray-400">Stars</span>
                        </div>
                        <div className="text-3xl font-bold">{repoData.stargazers_count || 0}</div>
                    </div>

                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <GitFork className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-400">Forks</span>
                        </div>
                        <div className="text-3xl font-bold">{repoData.forks_count || 0}</div>
                    </div>

                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye className="w-5 h-5 text-green-500" />
                            <span className="text-gray-400">Watchers</span>
                        </div>
                        <div className="text-3xl font-bold">{repoData.watchers_count || 0}</div>
                    </div>

                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <span className="text-gray-400">Open Issues</span>
                        </div>
                        <div className="text-3xl font-bold">{repoData.open_issues_count || 0}</div>
                    </div>
                </div>

                {/* Branch Content Viewer */}
                <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <GitBranch className="w-6 h-6 text-blue-400" />
                            <h2 className="text-2xl font-semibold">{selectedBranch}:</h2>
                        </div>
                        <a
                            href={`${repoData.html_url}/tree/${selectedBranch}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors border border-blue-500 hover:bg-blue-500/10 p-2 rounded"
                        >
                            <Github />
                        </a>
                    </div>

                    {loadingBranchContent ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-400">Loading branch content...</div>
                        </div>
                    ) : (
                        <div className="space-y-1 max-h-100 overflow-y-auto custom-scrollbar">
                            {branchContent.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No files found in this branch
                                </div>
                            ) : (
                                branchContent.map((item) => (
                                    <div
                                        key={item.path}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#333] transition-colors"
                                    >
                                        {item.type === 'tree' ? (
                                            <Folder className="w-5 h-5 text-blue-400 shrink-0" />
                                        ) : (
                                            <File className="w-5 h-5 text-gray-400 shrink-0" />
                                        )}
                                        <span className="flex-1 font-mono text-sm text-gray-300">
                                            {item.path}
                                        </span>
                                        {item.size && (
                                            <span className="text-xs text-gray-500">
                                                {formatSize(item.size)}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>




                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Languages */}
                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <Code className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-semibold">Languages</h2>
                        </div>
                        <div className="space-y-4">
                            {languages.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No language data available
                                </div>
                            ) : (
                                languages.map((lang) => (
                                    <div key={lang.name}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-300">{lang.name}</span>
                                            <span className="text-gray-400">{lang.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-[#333] rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${lang.percentage}%`,
                                                    backgroundColor: languageColors[lang.name] || "#6b7280"
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Contributors */}
                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 h-6 text-pink-500" />
                            <h2 className="text-2xl font-semibold">Contributors</h2>
                        </div>
                        <div className="space-y-4">
                            {!Array.isArray(contributors) || contributors.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No contributors found
                                </div>
                            ) : (
                                contributors.map((contributor) => (
                                    <a
                                        key={contributor.login}
                                        href={contributor.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                                    >
                                        <img
                                            src={contributor.avatar_url}
                                            alt={contributor.login}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium">{contributor.login}</div>
                                            <div className="text-sm text-gray-400">
                                                {contributor.contributions} contributions
                                            </div>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Repository Details */}
                <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <GitBranch className="w-6 h-6 text-orange-500" />
                        <h2 className="text-2xl font-semibold">Repository Details</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <div className="text-gray-400 mb-1">Default Branch</div>
                            <div className="text-lg font-medium">{repoData.default_branch || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 mb-1">Total Branches</div>
                            <div className="text-lg font-medium">{branches.length}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 mb-1">Visibility</div>
                            <div className="text-lg font-medium capitalize">{repoData.visibility || "N/A"}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 mb-1">Repository Size</div>
                            <div className="text-lg font-medium">{formatSize((repoData.size || 0) * 1024)}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 mb-1">Created</div>
                            <div className="text-lg font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(repoData.created_at)}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-400 mb-1">Last Updated</div>
                            <div className="text-lg font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(repoData.updated_at)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topics */}
                {repoData.topics && repoData.topics.length > 0 && (
                    <div className="bg-[#222] backdrop-blur rounded-xl p-6 border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-4">Topics</h2>
                        <div className="flex flex-wrap gap-3">
                            {repoData.topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full text-sm border border-blue-500/30"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Commits Section */}
                <div className="bg-[#222] backdrop-blur rounded-xl p-5 border border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <GitCommit className="w-6 h-6 text-cyan-500" />
                        <h2 className="text-2xl font-semibold">Recent Commits</h2>
                    </div>
                    <div className="space-y-3 custom-scrollbar max-h-[350px] overflow-y-auto px-">
                        {!Array.isArray(commits) || commits.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No commits found
                            </div>
                        ) : (
                            commits.map((commit) => (
                                <a
                                    key={commit.sha}
                                    href={commit.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 rounded-lg bg-[#333] hover:bg-[#444] transition-colors border border-gray-600/50"
                                >
                                    <div className="flex items-start gap-4">
                                        {commit.author ? (
                                            <img
                                                src={commit.author.avatar_url}
                                                alt={commit.author.login}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-white mb-1">
                                                {truncateMessage(commit.commit.message)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <span className="flex items-center gap-1 max-md:hidden">
                                                    {commit.commit.author.name}
                                                </span>
                                                <span className="max-md:hidden">•</span>
                                                <span className="max-sm:text-xs">{formatRelativeTime(commit.commit.author.date)}</span>
                                                <span>•</span>
                                                <span className="font-mono text-xs bg-gray-600/50 px-2 py-1 rounded">
                                                    {commit.sha.substring(0, 7)}
                                                </span>
                                            </div>
                                            {commit.commit.verification.verified && (
                                                <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-400">
                                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default function GitHubDashboard() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <GitHubDashboardContent />
        </Suspense>
    )
}