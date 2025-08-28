import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Hero from '@/components/sections/Hero';
import WebsiteDominationAnalyzer from '@/components/WebsiteDominationAnalyzer';
import HowItWorks from '@/components/sections/HowItWorks';
import ServicesOverview from '@/components/sections/ServicesOverview';
import IndustryPowerhouseSection from '@/components/sections/TestimonialsCarousel';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = generatePageMetadata('home');

export default function HomePage() {
  return (
    <>
      <Hero />
      <WebsiteDominationAnalyzer />
      <IndustryPowerhouseSection />
      <HowItWorks />
      <ServicesOverview />
      <CTASection />
    </>
  );
}
