import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import VehicleTypes from '@/components/VehicleTypes'
import PricingPlans from '@/components/PricingPlans'
import Testimonial from '@/components/Testimonial'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Vehicle Types */}
      <VehicleTypes />

      {/* Pricing Plans */}
      <PricingPlans />

      {/* Testimonial */}
      <Testimonial />

      {/* Footer */}
      <Footer />
    </div>
  )
}
