'use client'
import { motion } from 'motion/react'

const stats = [
    { title: "Commits", value: "128" },
    { title: "Files Explored", value: "76" },
    { title: "Notes Written", value: "34" },
    { title: "And much more", value: "++" },
]

const topLanguages = [
    { name: "Language Stats", percentage: 40, color: "#F7DF1E" },
]

export default function GitHubWrapped() {
    const radius = 40
    const circumference = 2 * Math.PI * radius

    return (
        <div className='w-full h-full border border-white/20 custom-scrollbar overflow-auto rounded-xl bg-black/40'>
            <div className="w-[90%] m-auto mt-10 lg:h-130 ">
                {/* Section Title */}
                <h2 className=" text-3xl font-bold text-center bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent mb-8">
                    Your GitHub Wrapped
                </h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2, duration: 0.6 }}
                            className="bg-white/5 backdrop-blur-sm p-5 rounded-xl flex flex-col items-center justify-center shadow-lg"
                        >
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className="text-white/70 mt-1 text-sm text-center">{stat.title}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Top Languages */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-8">
                        {topLanguages.map((lang, idx) => {
                            const offset = circumference - (circumference * lang.percentage) / 100
                            return (
                                <div key={idx} className="flex flex-col items-center">
                                    <svg width={100} height={100}>
                                        <circle
                                            cx={50}
                                            cy={50}
                                            r={radius}
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth={8}
                                            fill="transparent"
                                        />
                                        <motion.circle
                                            cx={50}
                                            cy={50}
                                            r={radius}
                                            stroke={lang.color}
                                            strokeWidth={8}
                                            fill="transparent"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference}
                                            initial={{ strokeDashoffset: circumference }}
                                            animate={{ strokeDashoffset: offset }}
                                            transition={{ duration: 1.2, delay: idx * 0.2 }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="text-white mt-2 text-lg font-medium ">
                                        {lang.name} ({lang.percentage}%)
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>


            </div>
        </div>
    )
}
