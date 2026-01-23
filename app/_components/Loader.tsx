'use client'
import { motion } from "framer-motion";

const Loader = () => {
    const positions = [
        { x: 0, y: 0 },
        { x: 75, y: 0 },
        { x: 75, y: 75 },
        { x: 0, y: 75 },
        { x: 0, y: 0 }, // loop back to start
    ];

    return (
        <div className="flex items-center justify-center h-screen">
            <div style={{ position: "relative", width: 100, height: 100, margin: "auto" }}>
                {[0, 0.5, 1, 1.5].map((delay, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: positions.map((p) => p.x),
                            y: positions.map((p) => p.y),
                            rotate: [0, 90, 180, 270, 360],
                        }}
                        transition={{
                            x: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay },
                            y: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay },
                            rotate: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", delay },
                        }}
                        style={{
                            position: "absolute",
                            width: 40,
                            height: 40,
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
