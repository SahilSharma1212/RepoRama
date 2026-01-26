'use client'
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, Code, Wand2 } from "lucide-react";

const icons = [NotebookPen, Code, Wand2];

function RotatingIcon() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % icons.length);
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const Icon = icons[index];

    return (
        <div className="h-6 w-6 relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Icon strokeWidth={1.5} size={20} className="text-gray-300" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default React.memo(RotatingIcon);
