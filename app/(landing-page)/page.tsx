import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'

export default function page() {
  return (
    <div className='bg-[#0a0a0a] bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[40px_40px]'>
      <Navbar />
      <HeroSection />
    </div>
  )
};