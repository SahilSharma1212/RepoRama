'use client'
import { useParams } from 'next/navigation'

export default function PostPage() {
    const params = useParams()

    console.log(params)

    return <div>
        <h1 className='text-2xl font-bold'>Dashboard for project {params.id}</h1>
        <nav className='flex flex-col gap-4'>
            <h2 className='text-xl font-bold'>Project Overview</h2>
            <p className='text-sm text-gray-500'>This is a dashboard for the project {params.id}</p>
        </nav>
        
        </div>
}
