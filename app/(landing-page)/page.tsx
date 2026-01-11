import Navbar from '../_components/Navbar'
import HeroSection from '../_components/HeroSection'

export default function page() {
  return (
    <div>
      <Navbar/>
      <div className='lg:px-35 md:px-10'>
        <HeroSection/>
      </div>
    </div>
  )
}