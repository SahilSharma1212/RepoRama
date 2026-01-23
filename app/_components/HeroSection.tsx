'use client'
import AISummarisationLanding from './AISummarisationLanding';
import GithubWrapped from './GithubWrapped';
import NotesCardLanding from './NotesCardLanding';
import VisualiserLandingSection from './VisualiserLandingSection';


export default function HeroSection() {


    return (
        <div className="relative border-x border-gray-800 overflow-hidden">
            <div className='text-center mt-10 text-4xl font-bold bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent'>
                RepoRama
            </div>

            <div className="grid w-[90%] m-auto mt-10 gap-4
                grid-cols-1
                lg:grid-cols-3">

                <div className="lg:col-span-2 min-h-[500px]">
                    <VisualiserLandingSection />
                </div>

                <div className="lg:col-span-1 min-h-[500px]">
                    <NotesCardLanding />
                </div>

                <div className="lg:col-span-1 min-h-[400px]">
                    <GithubWrapped />
                </div>

                <div className="lg:col-span-2 min-h-[400px]">
                    <AISummarisationLanding />
                </div>
            </div>
        </div>
    )
}
