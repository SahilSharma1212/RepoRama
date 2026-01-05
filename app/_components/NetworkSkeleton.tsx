'use client'

import { useEffect, useRef } from "react";
import './NetworkSkeleton.css';

export default function NetworkSkeleton() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nodes = Array.from(containerRef.current?.querySelectorAll('.node') || []);
        const edges = Array.from(containerRef.current?.querySelectorAll('.edge') || []);

        // Animate edges
        edges.forEach((edge, i) => {
            const delay = Math.random() * 2;
            edge.animate([
                { opacity: 0.2 },
                { opacity: 0.8 },
                { opacity: 0.2 },
            ], {
                duration: 2000 + Math.random() * 1000,
                iterations: Infinity,
                delay: delay * 1000,
            });
        });

        // Animate nodes (pulsing)
        nodes.forEach((node, i) => {
            const delay = Math.random() * 2;
            node.animate([
                { transform: 'scale(1)', opacity: 0.6 },
                { transform: 'scale(1.3)', opacity: 1 },
                { transform: 'scale(1)', opacity: 0.6 },
            ], {
                duration: 1500 + Math.random() * 1000,
                iterations: Infinity,
                delay: delay * 1000,
            });
        });
    }, []);

    return (
        <div ref={containerRef} className="network-skeleton">
            {/* edges */}
            <div className="edge" style={{ top: '20%', left: '10%', width: '60%', transform: 'rotate(20deg)' }} />
            <div className="edge" style={{ top: '50%', left: '30%', width: '50%', transform: 'rotate(-10deg)' }} />
            <div className="edge" style={{ top: '70%', left: '20%', width: '40%', transform: 'rotate(30deg)' }} />

            {/* nodes */}
            <div className="node" style={{ top: '20%', left: '10%' }} />
            <div className="node" style={{ top: '50%', left: '30%' }} />
            <div className="node" style={{ top: '70%', left: '20%' }} />
            <div className="node" style={{ top: '40%', left: '70%' }} />
            <div className="node" style={{ top: '60%', left: '50%' }} />
        </div>
    );
}
