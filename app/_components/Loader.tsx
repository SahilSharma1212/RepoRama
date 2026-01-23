'use client';
import { motion } from "framer-motion";

const Loader = () => {
    const size = 40;
    const distance = 75;

    const path = [
        { x: 0, y: 0 },
        { x: distance, y: 0 },
        { x: distance, y: distance },
        { x: 0, y: distance },
        { x: 0, y: 0 },
    ];

    return (
        <div className="flex items-center justify-center h-screen">
            <div style={{ position: "relative", width: distance + size, height: distance + size }}>
                {[0, 0.5, 1, 1.5].map((delay, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: path.map(p => p.x),
                            y: path.map(p => p.y),
                            rotate: [0, 90, 180, 270, 360],
                        }}
                        transition={{
                            x: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay },
                            y: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay },
                            rotate: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay },
                        }}
                        style={{
                            position: "absolute",
                            width: size,
                            height: size,
                            background: "#666",
                            borderRadius: 4,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Loader;
