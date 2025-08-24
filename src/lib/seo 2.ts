import type { Metadata } from 'next';

export const baseSEO: Metadata = {
  title: {
    default: 'MMA - Professional Media Production & Creative Services',
    template: '%s | MMA'
  },
  description: 'Professional media production and creative services. Delivering exceptional quality and innovative solutions for your projects.',
  keywords: ['media production', 'creative services', 'video production', 'photography', 'design', 'MMA'],
  authors: [{ name: 'MMA' }],
  creator: 'MMA',
  publisher: 'MMA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mma.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mma.com',
    title: 'MMA - Professional Media Production & Creative Services',
    description: 'Professional media production and creative services. Delivering exceptional quality and innovative solutions for your projects.',
    siteName: 'MMA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MMA - Professional Media Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MMA - Professional Media Production & Creative Services',
    description: 'Professional media production and creative services. Delivering exceptional quality and innovative solutions for your projects.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MMA',
  url: 'https://mma.com',
  logo: 'https://mma.com/logo.webp',
  description: 'Professional media production and creative services. Delivering exceptional quality and innovative solutions for your projects.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Media Street',
    addressLocality: 'Creative City',
    addressRegion: 'CC',
    postalCode: '12345',
    addressCountry: 'US'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'info@mma.com'
  },
  sameAs: [
    'https://linkedin.com/company/mma',
    'https://twitter.com/mma'
  ]
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MMA',
  url: 'https://mma.com',
  description: 'Professional media production and creative services website',
  publisher: {
    '@type': 'Organization',
    name: 'MMA'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://mma.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};
