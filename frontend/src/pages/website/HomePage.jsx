import WebsiteNavbar from '@/components/layout/WebsiteNavbar'
import WebsiteFooter from '@/components/layout/WebsiteFooter'
import HeroSection from '@/components/sections/HeroSection'
import ProblemSection from '@/components/sections/ProblemSection'
import {
  TechnologySection,
  ArchitectureSection,
  DashboardPreviewSection,
  PerformanceSection,
  ComparisonSection,
  BusinessSection,
  ResearchSection,
  ContactSection,
} from '@/components/sections/WebsiteSections'

export default function HomePage() {
  return (
    <div className="bg-bg min-h-screen">
      <WebsiteNavbar />
      <HeroSection />
      <ProblemSection />
      <TechnologySection />
      <ArchitectureSection />
      <DashboardPreviewSection />
      <PerformanceSection />
      <ComparisonSection />
      <BusinessSection />
      <ResearchSection />
      <ContactSection />
      <WebsiteFooter />
    </div>
  )
}
