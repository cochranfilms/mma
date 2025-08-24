import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { baseSEO, organizationSchema, websiteSchema } from '@/lib/seo';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StickyCTA from '@/components/StickyCTA';
import LiveChat from '@/components/LiveChat';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = baseSEO;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SiteHeader />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <StickyCTA />
          <LiveChat />
        </div>
      </body>
    </html>
  );
}
