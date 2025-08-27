import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generatePageMetadata, siteUrl, buildServiceSchema, buildBreadcrumbSchema } from '@/lib/seo';
import { services } from '@/content/services';
import dynamic from 'next/dynamic';

type Params = { params: { serviceId: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const svc = services.find(s => s.id === params.serviceId);
  if (!svc) return generatePageMetadata('services');

  const canonical = `/services/${svc.id}`;
  return generatePageMetadata('services', {
    title: `${svc.title} | Services` as any,
    description: svc.description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: `${svc.title} | Marketing Mousetrap Agency`,
      description: svc.description,
    },
    twitter: {
      title: `${svc.title} | Marketing Mousetrap Agency`,
      description: svc.description,
    },
  });
}

export default function ServiceDetailsPage({ params }: Params) {
  const service = services.find(s => s.id === params.serviceId);
  if (!service) return notFound();

  const learn = (service as any).learnMore as undefined | {
    whatYouGet: string[];
    howWeDeliver: { title: string; description: string }[];
    tech?: string[];
    roi?: { items: { label: string; estValue: number }[]; example?: { investment: number; estimatedReturn: number } };
  };

  const PricingConfigurator = dynamic(() => import('@/components/ServicePricingConfigurator'), { ssr: false });

  const pricing: any = (service as any).pricing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">{service.title}</h1>
          <p className="text-blue-100 text-lg md:text-xl">{service.subtitle}</p>
          <div className="mt-4 text-2xl font-semibold">Starting at ${service.startingPrice?.toLocaleString()}</div>
        </div>
      </section>

      {/* JSON-LD: Service + Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceSchema(
              {
                id: service.id,
                title: service.title,
                description: service.description,
                category: service.category,
                startingPrice: service.startingPrice,
              },
              `${siteUrl}/services/${service.id}`
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbSchema([
              { name: 'Home', url: siteUrl },
              { name: 'Services', url: `${siteUrl}/services` },
              { name: service.title, url: `${siteUrl}/services/${service.id}` },
            ])
          ),
        }}
      />

      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What you get</h2>
            <ul className="space-y-2 mb-10">
              {learn?.whatYouGet?.map((item, i) => (
                <li key={i} className="flex">
                  <span className="mt-1 mr-3 h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">How we achieve it</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {learn?.howWeDeliver?.map((step, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="font-semibold text-gray-900 mb-1">{step.title}</div>
                  <div className="text-gray-700 text-sm">{step.description}</div>
                </div>
              ))}
            </div>

            {learn?.tech && learn.tech.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tech stack</h2>
                <div className="flex flex-wrap gap-2 mb-10">
                  {learn.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm border border-blue-100">{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="text-gray-600 mb-1">Starting at</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">${service.startingPrice?.toLocaleString()}</div>
              <a href={`#pricing`} className="w-full block text-center bg-[#010043] text-white py-3 px-6 rounded-lg font-medium hover:opacity-95 transition-colors mb-3">Buy Now</a>
              <a href={`/services`} className="w-full block text-center border border-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">Back to Services</a>
            </div>
          </aside>
        </div>
      </section>

      {pricing && (
        <section className="py-6 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <PricingConfigurator serviceId={service.id} serviceTitle={service.title} pricing={pricing} />
          </div>
        </section>
      )}

      <section className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ROI breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {learn?.roi?.items?.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Value Driver</div>
                <div className="font-semibold text-gray-900">{item.label}</div>
                <div className="mt-3 text-gray-900 font-bold">${item.estValue.toLocaleString()}</div>
              </div>
            ))}
          </div>

          {learn?.roi?.example && (
            <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-md">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-600">Illustrative Investment</div>
                  <div className="text-2xl font-bold text-gray-900">${learn.roi.example.investment.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Estimated Return (12 months)</div>
                  <div className="text-2xl font-bold text-green-700">${learn.roi.example.estimatedReturn.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Projected ROI</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(((learn.roi.example.estimatedReturn - learn.roi.example.investment) / learn.roi.example.investment) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


