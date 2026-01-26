import Navbar from '../../components/Navbar'
import HeroSection from '../../components/HeroSection'

export default function page() {
  return (
    <div>
      <Navbar />
      <div className='pb-10'>
        <HeroSection />
      </div>
    </div>
  )
};