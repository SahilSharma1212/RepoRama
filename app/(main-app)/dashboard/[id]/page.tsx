'use client'
import { ArrowRight, Settings, User } from 'lucide-react'
import { useParams } from 'next/navigation'
export default function PostPage() {
    const params = useParams()

    console.log(params)

    return <div>
        <nav className='flex gap-4 py-4 px-4 border-b border-white/10 justify-between'>
            <h2 className='text-3xl font-bold text-gray-200'>
                Dashboard {params.id}
            </h2>
            <div className='flex gap-2 h-full items-center'>
                <Settings className='text-gray-500 w-5 h-5 cursor-pointer' size={40}/>
                <User className='text-gray-500 w-5 h-5 cursor-pointer'/>
            </div>
        </nav>

        <section className='grid grid-cols-3 flex-col  py-4 px-4 gap-5'>
            <div className='flex items-center justify-between bg-[#252525] p-6 rounded-sm gap-2 group'>
                <div className='flex flex-col items-start justify-center bg-[#252525] rounded-sm gap-2'>

                <h2 className='text-2xl font-bold text-gray-200'>GIthub Repo Name</h2>
                <p className='text-sm text-gray-500 w-full word-break-break-all'>
                    This is Project Overview for project one here is the github repo url
                </p>
                </div>
                <ArrowRight className='text-gray-500 -rotate-45  group-hover:rotate-0 transition-all duration-300'/>
            </div>
        </section>

    </div>
}
