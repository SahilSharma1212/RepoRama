'use client'

import { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import { DataSet } from 'vis-data'
import { Commit, Branch } from '@/app/types'
import { Loader2 } from 'lucide-react'

interface BranchNetworkGraphProps {
    repoOwner: string
    repoName: string
    className?: string
}

export default function BranchNetworkGraph({ repoOwner, repoName, className }: BranchNetworkGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const networkRef = useRef<Network | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                // Fetch commits (limit to 50 for performance/graph clarity)
                const commitsRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=50`)
                if (!commitsRes.ok) throw new Error('Failed to fetch commits')
                const commits: Commit[] = await commitsRes.json()

                // Fetch branches
                const branchesRes = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/branches`)
                if (!branchesRes.ok) throw new Error('Failed to fetch branches')
                const branches: Branch[] = await branchesRes.json()

                if (containerRef.current) {
                    drawGraph(commits, branches)
                }
            } catch (err) {
                console.error("Error fetching graph data:", err)
                setError("Failed to load graph data. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        if (repoOwner && repoName) {
            fetchData()
        }

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy()
                networkRef.current = null
            }
        }
    }, [repoOwner, repoName])

    const drawGraph = (commits: Commit[], branches: Branch[]) => {
        if (!containerRef.current) return

        const nodes = new DataSet<any>()
        const edges = new DataSet<any>()

        const commitMap = new Map<string, Commit>()
        commits.forEach(c => commitMap.set(c.sha, c))

        // Create nodes for commits
        commits.forEach((commit) => {
            nodes.add({
                id: commit.sha,
                label: commit.sha.substring(0, 7),
                title: `${commit.commit.message}\nBy: ${commit.commit.author?.name}\n${new Date(commit.commit.author.date).toLocaleDateString()}`,
                shape: 'dot',
                size: 10,

                // ⛔ make node unclickable / unselectable
                selectable: false,
                chosen: false,

                color: {
                    background: '#3b82f6', // blue-500
                    border: '#2563eb', // blue-600
                    highlight: { background: '#60a5fa', border: '#2563eb' }
                },
                font: { color: '#ffffff' }
            })
        })


        // Create edges from parents to children
        commits.forEach((commit) => {
            commit.parents.forEach((parent) => {
                if (commitMap.has(parent.sha)) {
                    edges.add({
                        from: parent.sha,
                        to: commit.sha,
                        arrows: 'to',
                        color: { color: '#4b5563' } // gray-600
                    })
                }
            })
        })

        // Add Branch markers
        branches.forEach((branch) => {
            if (commitMap.has(branch.commit.sha)) {
                const branchId = `branch-${branch.name}`
                nodes.add({
                    id: branchId,
                    label: branch.name,
                    shape: 'box',
                    color: {
                        background: '#10b981', // green-500
                        border: '#059669', // green-600
                        highlight: { background: '#34d399', border: '#059669' } // green-400
                    },
                    font: { color: '#ffffff', face: 'monospace' },
                    margin: 10
                })

                edges.add({
                    from: branch.commit.sha,
                    to: branchId,
                    dashes: true,
                    color: { color: '#10b981' },
                    length: 50
                })
            }
        })

        const options = {
            layout: {
                hierarchical: {
                    direction: 'UD', // Up-Down
                    sortMethod: 'directed',
                    levelSeparation: 100,
                    nodeSpacing: 150
                }
            },
            physics: {
                hierarchicalRepulsion: {
                    nodeDistance: 150
                },
                stabilization: {
                    iterations: 100
                }
            },
            interaction: {
                hover: true,
                tooltipDelay: 200,
                zoomView: true,
                dragView: true
            },
            height: '100%',
            width: '100%'
        }

        // @ts-ignore
        const network = new Network(containerRef.current, { nodes, edges }, options)

        network.on("doubleClick", function (params) {
            if (params.nodes.length === 1) {
                const nodeId = params.nodes[0] as string
                if (nodeId.startsWith('branch-')) return

                const commit = commitMap.get(nodeId)
                if (commit) {
                    window.open(commit.html_url, '_blank')
                }
            }
        });

        networkRef.current = network
    }

    return (
        <div className={`relative w-full h-[600px] bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-300">Building Network Graph...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="text-red-400 bg-red-950/30 p-4 rounded-lg border border-red-500/20">
                        {error}
                    </div>
                </div>
            )}

            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-[radial-gradient(circle,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur p-2 rounded text-xs text-gray-400 border border-white/10 pointer-events-none ">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Commit
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-green-500"></span> Branch
                </div>
            </div>
        </div>
    )
}
