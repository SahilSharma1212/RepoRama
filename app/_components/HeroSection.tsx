'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react';

const slides = [
    {
        img: "/visualiserDemo.png",
        title: "Visualise Folder Structures",
    },
    {
        img: "/visualiserDemo3.png",
        title: "Understand Project Architecture",
    },
    {
        img: "/visualiserDemo2.png",
        title: "Navigate Code Effortlessly",
    },
];

function FadingHeading({ text }: { text: string }) {
    return (
        <motion.div
            key={text} // important so motion treats it as a new element
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-5 text-lg font-bold bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent"
        >
            {text}
        </motion.div>
    );
}

export default function HeroSection() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen border-x border-gray-800 overflow-hidden">
            <div className='text-center mt-10 text-4xl font-bold bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent'>
                HEllo
            </div>

            <div className="flex flex-wrap gap-0 w-[80%] m-auto mt-10">
                <div className='w-2/3 border border-gray-400 rounded-tl-xl'>
                    <FadingHeading text={slides[active].title} />

                    <div className='flex justify-center'>
                        <div className="relative w-190 h-110">
                            {slides.map((slide, index) => {
                                if (index !== active && index !== (active + 1) % slides.length) return null;

                                const isActive = index === active;

                                return (
                                    <motion.div
                                        key={slide.img}
                                        className="absolute top-10 inset-0"
                                        animate={{
                                            scale: isActive ? 1 : 0.95,
                                            y: isActive ? 0 : -20,
                                            opacity: isActive ? 1 : 0.6,
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <Image
                                            src={slide.img}
                                            alt={slide.title}
                                            width={760}
                                            height={440}
                                            className="object-cover"
                                            priority={isActive}
                                        />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className='w-1/3 bg-blue-50'>hi</div>
                <div className='w-1/3 bg-blue-50'>hi</div>
                <div className='w-2/3 bg-green-50'>hi</div>
            </div>
        </div>
    )
}
