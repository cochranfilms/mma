import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import ServicesOverview from '@/components/sections/ServicesOverview';
import IndustryPowerhouseSection from '@/components/sections/TestimonialsCarousel';
import CTASection from '@/components/sections/CTASection';

export const metadata: Metadata = generatePageMetadata('home');

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndustryPowerhouseSection />
      <HowItWorks />
      <ServicesOverview />
      <CTASection />
    </>
  );
}
