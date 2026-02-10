'use client'

import { useEffect, useRef } from 'react'
import { Network } from 'vis-network/standalone'

export default function SampleGraph() {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const nodes = [
            { id: 1, label: 'Repo' },
            { id: 2, label: 'Docs' },
            { id: 3, label: 'Notes' },
            { id: 4, label: 'AI Summary' },
            { id: 5, label: 'Issues' },
        ]

        const edges = [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 1, to: 4 },
            { from: 1, to: 5 },
        ]

        new Network(
            containerRef.current,
            { nodes, edges },
            {
                nodes: {
                    shape: 'dot',
                    size: 18,
                    color: {
                        background: '#18181b',
                        border: '#ffffff30',
                    },
                    font: {
                        color: '#e5e7eb',
                    },
                },
                edges: {
                    color: '#ffffff30',
                    smooth: true,
                },
                physics: {
                    stabilization: false,
                },
            }
        )
    }, [])

    return (
        <div
            ref={containerRef}
            className="
        w-full h-64
        rounded-xl
        border border-white/10
        bg-black/40
        backdrop-blur-md
      bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)]
      bg-[size:18px_18px]
      "
        />
    )
}
