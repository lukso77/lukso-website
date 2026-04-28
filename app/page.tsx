import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import BrandBand from '@/components/BrandBand'
import ScentFinder from '@/components/ScentFinder'
import OccasionSection from '@/components/OccasionSection'
import Catalog from '@/components/Catalog'
import MarqueeStrip from '@/components/MarqueeStrip'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import WelcomePopup from '@/components/WelcomePopup'

export default function Home() {
  return (
    <>
      <WelcomePopup />
      <Navbar />
      <main>
        <Hero />
        <BrandBand />
        <ScentFinder />
        <OccasionSection />
        <Catalog />
        <MarqueeStrip />
        <CtaSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
