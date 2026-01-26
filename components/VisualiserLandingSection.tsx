'use client'
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
    { img: "/visualiserDemo.png", title: "Visualise Folder Structures" },
    { img: "/visualiserDemo3.png", title: "Understand Project Architecture" },
    { img: "/visualiserDemo2.png", title: "Navigate Code Effortlessly" },
];

function FadingHeading({ text }: { text: string }) {
    return (
        <motion.div
            key={text}
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

export default function VisualiserLandingSection() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="
            w-full h-full
            px-4 md:px-10
            border border-white/20
            rounded-xl
            bg-black/40
            flex flex-col relative
        ">
                <FadingHeading text={slides[active].title} />

                <div className="flex justify-center pb-5">
                    <div className="
                    relative w-full
                    max-w-190
                    aspect-video
                    mt-9
                    max-md:mt-10
                ">
                        {slides.map((slide, index) => {
                            if (index !== active && index !== (active + 1) % slides.length) return null;

                            const isActive = index === active;

                            return (
                                <motion.div
                                    key={slide.img}
                                    className="absolute inset-0 border border-gray-700 rounded-xl overflow-hidden"
                                    animate={{
                                        scale: isActive ? 1 : 0.95,
                                        y: isActive ? 0 : -20,
                                        opacity: isActive ? 1 : 0.6,
                                        zIndex: isActive ? 10 : 0,
                                    }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    <Image
                                        src={slide.img}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={isActive}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
                <p
                    className="
    hidden max-[458px]:block
    absolute bottom-35
    left-1/2 -translate-x-1/2
    z-10
    
    px-5 py-2
    rounded-xl
    text-center
    text-white/20
  "
                >
                    Try out our demo repo visualiser yourself
                </p>


                <div className='md:hidden flex absolute bottom-5 left-1/2 -translate-x-1/2 items-center visible gap-5 w-full justify-center max-sm:flex-col'>
                    <Link href="/visualiser" target='_blank' className='text-white bg-white/10 p-2 px-4 rounded-lg border-white flex items-center gap-2'>View Demo <ArrowRight strokeWidth={1} className='hover:-rotate-45 transition-all' /></Link>
                    <Link href="https://visjs.github.io/vis-network/docs/network/" target='_blank' className='text-white bg-white/10 p-2 px-4 rounded-lg border-white flex items-center gap-2 '>Vis.Js Documentation <ArrowRight strokeWidth={1} className='hover:-rotate-45 transition-all' /></Link>
                </div>
            </div>
        </>
    );
}
