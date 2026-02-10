import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'

export default function page() {
  return (
    <div className='bg-[#0a0a0a] bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[40px_40px]'>
      <Navbar />
      <HeroSection />


      <footer className="mt-20 border-t border-white/10 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          {/* Left */}
          <p>
            Built with{" "}
            <span className="text-white/80">React</span>,{" "}
            <span className="text-white/80">Next.js</span>,{" "}
            <span className="text-white/80">Supabase</span>,{" "}
            <span className="text-white/80">Clerk</span>,{" "}
            <span className="text-white/80">LangChain</span>,{" "}
            <span className="text-white/80">Vis.js</span> &{" "}
            <span className="text-white/80">Tailwind CSS</span>
          </p>

          {/* Right */}
          <p className="text-gray-500">
            Crafted for developers.
          </p>
        </div>
      </footer>

    </div>
  )
};