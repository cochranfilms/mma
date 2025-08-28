import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { services } from '@/content/services';
import { CheckCircle, ArrowRight, Megaphone, Globe, Camera, PenTool, Target, Handshake } from 'lucide-react';
import InteractiveToolsSection from '@/components/InteractiveToolsSection';
import { buildBreadcrumbSchema, buildServicesItemList, siteUrl } from '@/lib/seo';
import ServicesPageClient from '@/components/ServicesPageClient';

export const metadata: Metadata = generatePageMetadata('services');

export default function ServicesPage() {
  const allServices = services;

  return (
    <div className="min-h-screen">
      <ServicesPageClient />
      
      {/* JSON-LD: Services List + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildServicesItemList(allServices)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: 'Home', url: siteUrl },
              { name: 'Services', url: `${siteUrl}/services` },
            ])
          ),
        }}
      />
    </div>
  );
}
