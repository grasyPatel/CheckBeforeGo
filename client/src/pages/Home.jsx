import React from 'react'
import Hero from '../components/Hero'
import FeaturesSection from '../components/FeaturesSection'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
   <>
   <Hero />
   <FeaturesSection />
   <hr className='h-2 bg-green-300 dark:bg-gray-700 w-full mt-24 '></hr>
   <HowItWorks />
   <Testimonials />

   </>
  )
}

export default Home