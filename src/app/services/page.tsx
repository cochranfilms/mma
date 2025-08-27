import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import { services } from '@/content/services';
import { CheckCircle, ArrowRight, Megaphone, Globe, Camera, PenTool, Target, Handshake } from 'lucide-react';
import InteractiveToolsSection from '@/components/InteractiveToolsSection';

export const metadata: Metadata = generatePageMetadata('services');

const iconMap = {
  megaphone: Megaphone,
  globe: Globe,
  camera: Camera,
  'pen-tool': PenTool,
  target: Target,
  handshake: Handshake,
};

export default function ServicesPage() {
  const featuredServices = services.filter(service => service.featured);
  const allServices = services;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Strategic solutions that transform your business presence and drive measurable results
          </p>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most impactful solutions that deliver exceptional results for businesses like yours
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              return (
                <div key={service.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-blue-600 font-medium">{service.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-gray-900 font-semibold">Starting at </span>
                    <span className="text-2xl font-bold text-gray-900">${service.startingPrice?.toLocaleString()}</span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">What you'll get:</h4>
                    <ul className="space-y-2">
                      {service.deliverables.slice(0, 4).map((deliverable, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`/services/${service.id}`} className="w-full text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                    <a href={`/services/${service.id}#pricing`} className="w-full text-center bg-[#010043] text-white py-3 px-6 rounded-lg font-medium hover:opacity-95 transition-colors">
                      Buy Now
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Service Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions across all aspects of modern business growth and brand development
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              return (
                <div key={service.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="text-gray-900 font-semibold mb-3">Starting at ${service.startingPrice?.toLocaleString()}</div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium capitalize">{service.category}</span>
                    <div className="flex items-center gap-3">
                      <a href={`/services/${service.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                        Learn More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                      <a href={`/services/${service.id}#pricing`} className="text-sm font-semibold text-[#010043] underline">
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <InteractiveToolsSection />

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how our services can help you achieve your business goals and create lasting impact in your industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Schedule a Consultation
            </button>
            <button className="border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-blue-900 transition-colors">
              View Our Work
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
