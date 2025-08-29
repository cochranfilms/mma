import { Metadata } from 'next';

// Base SEO configuration
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketingmousetrap.com';
export const siteUrl = rawSiteUrl.startsWith('http://') || rawSiteUrl.startsWith('https://')
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

export const baseSEO = {
  title: {
    default: 'Marketing Mousetrap Agency | B2B Media Relations & Connections',
    template: '%s | Marketing Mousetrap Agency'
  },
  description: 'B2B media connections that compound your brand\'s reach. We upgrade your web presence, content, and partnerships—then turn it into pipeline.',
  keywords: [
    'B2B marketing',
    'media relations',
    'web presence',
    'content strategy',
    'partnership development',
    'brand strategy',
    'marketing agency',
    'B2B connections'
  ],
  authors: [{ name: 'Marketing Mousetrap Agency' }],
  creator: 'Marketing Mousetrap Agency',
  publisher: 'Marketing Mousetrap Agency',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Marketing Mousetrap Agency | B2B Media Relations & Connections',
    description: 'B2B media connections that compound your brand\'s reach. We upgrade your web presence, content, and partnerships—then turn it into pipeline.',
    siteName: 'Marketing Mousetrap Agency',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Marketing Mousetrap Agency - B2B Media Relations & Connections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketing Mousetrap Agency | B2B Media Relations & Connections',
    description: 'B2B media connections that compound your brand\'s reach. We upgrade your web presence, content, and partnerships—then turn it into pipeline.',
    images: ['/images/og-image.jpg'],
    creator: '@marketingmousetrap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover' as const,
  },
  themeColor: '#010043',
};

// Page-specific SEO configurations
export const pageSEO: Record<string, Metadata> = {
  home: {
    title: 'B2B Media Relations & Connections That Compound Your Brand\'s Reach',
    description: 'We upgrade your web presence, content, and partnerships—then turn it into pipeline. Get strategic media relations, modern websites, and B2B connections that drive results.',
    openGraph: {
      title: 'B2B Media Relations & Connections That Compound Your Brand\'s Reach',
      description: 'We upgrade your web presence, content, and partnerships—then turn it into pipeline. Get strategic media relations, modern websites, and B2B connections that drive results.',
    },
  },
  services: {
    title: 'Our Services | Strategic Marketing Solutions for B2B Growth',
    description: 'From media relations and web presence upgrades to content strategy and brand activations. Discover how our comprehensive services can transform your B2B marketing.',
    openGraph: {
      title: 'Our Services | Strategic Marketing Solutions for B2B Growth',
      description: 'From media relations and web presence upgrades to content strategy and brand activations. Discover how our comprehensive services can transform your B2B marketing.',
    },
  },
  work: {
    title: 'Case Studies | Real Results from B2B Marketing Campaigns',
    description: 'See how we\'ve helped companies increase leads by 280%, secure media coverage, and create viral brand activations. Real results from real B2B companies.',
    openGraph: {
      title: 'Case Studies | Real Results from B2B Marketing Campaigns',
      description: 'See how we\'ve helped companies increase leads by 280%, secure media coverage, and create viral brand activations. Real results from real B2B companies.',
    },
  },
  about: {
    title: 'About MMA | Your B2B Media & Connection Partner',
    description: 'Learn about our mission to help B2B companies upgrade their media presence and build meaningful connections that drive business growth.',
    openGraph: {
      title: 'About MMA | Your B2B Media & Connection Partner',
      description: 'Learn about our mission to help B2B companies upgrade their media presence and build meaningful connections that drive business growth.',
    },
  },
  contact: {
    title: 'Contact & Book Consultation | Start Your B2B Marketing Transformation',
    description: 'Ready to upgrade your media presence? Book a consultation with our team and discover how we can help transform your B2B marketing and drive real results.',
    openGraph: {
      title: 'Contact & Book Consultation | Start Your B2B Marketing Transformation',
      description: 'Ready to upgrade your media presence? Book a consultation with our team and discover how we can help transform your B2B marketing and drive real results.',
    },
  },
};

// Structured data for organization
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Marketing Mousetrap Agency',
  alternateName: 'MMA',
  url: siteUrl,
  logo: `${siteUrl}/images/logo.svg`,
  description: 'B2B media relations and connections firm that helps businesses upgrade their media presence, web presence, content, and partnerships.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-404-707-7298',
    contactType: 'customer service',
    email: 'sales@marketingmousetrapagency.com',
  },
  sameAs: [
    'https://linkedin.com/company/marketingmousetrap',
    'https://twitter.com/marketingmousetrap',
  ],
  serviceArea: {
    '@type': 'Country',
    name: 'United States',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'B2B Marketing Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Media Relations & B2B Connections',
          description: 'Strategic media outreach and relationship building',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Presence Upgrades',
          description: 'Modern website design and conversion optimization',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Content & Campaigns',
          description: 'Strategic content development and campaign management',
        },
      },
    ],
  },
};

// Structured data for website
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Marketing Mousetrap Agency',
  url: siteUrl,
  description: 'B2B media relations and connections firm',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Helper function to generate page metadata
export function generatePageMetadata(page: string, customData?: Partial<Metadata>): Metadata {
  const baseData = pageSEO[page] || {};
  
  return {
    ...baseSEO,
    ...baseData,
    ...customData,
    openGraph: {
      ...baseSEO.openGraph,
      ...baseData.openGraph,
      ...customData?.openGraph,
    },
    twitter: {
      ...baseSEO.twitter,
      ...customData?.twitter,
    },
  };
}

// Schema builders
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildServiceSchema(service: {
  id: string;
  title: string;
  description: string;
  category?: string;
  startingPrice?: number;
}, absoluteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.category || 'Marketing Service',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    url: absoluteUrl,
    offers: service.startingPrice
      ? {
          '@type': 'Offer',
          price: service.startingPrice,
          priceCurrency: 'USD',
          url: absoluteUrl,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
    provider: {
      '@type': 'Organization',
      name: 'Marketing Mousetrap Agency',
      url: siteUrl,
    },
  };
}

export function buildServicesItemList(allServices: Array<{ id: string; title: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: allServices.map((svc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/services/${svc.id}`,
      name: svc.title,
    })),
  };
}
