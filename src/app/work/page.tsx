import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import WorkPageClient from '@/components/WorkPageClient';

export const metadata: Metadata = generatePageMetadata('work');

export default function WorkPage() {
  return (
    <div className="min-h-screen">
      <WorkPageClient />
    </div>
  );
}
