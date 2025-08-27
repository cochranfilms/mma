'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { getServiceImage } from '@/lib/media';
import Link from 'next/link';
import { services } from '@/content/services';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

// Enhanced icon mapping for services
const iconMap: Record<string, React.ComponentType<any>> = {
  megaphone: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    </div>
  ),
  globe: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V6a2 2 0 002 2h1a2 2 0 002 2 2 2 0 012 2v1a2 2 0 002 2h2.945M8 3.935V6a2 2 0 002 2h1a2 2 0 002 2 2 2 0 012 2v1a2 2 0 002 2h2.945" />
      </svg>
    </div>
  ),
  camera: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </div>
  ),
  'pen-tool': () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </div>
  ),
  handshake: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    </div>
  ),
  target: () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
  ),
};

export default function ServicesOverview() {
  const featuredServices = services.filter(service => service.featured);

  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:28px_28px]"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We offer comprehensive solutions to upgrade every aspect of your B2B media presence. 
            From strategic media relations to modern website design, we help you build connections that drive results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || iconMap.megaphone;
            
            const imageSrc = getServiceImage(service.id, index, 'card');
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 h-full shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:transform hover:-translate-y-2">
                  {/* Service Card Image */}
                  <div className="mb-6 overflow-hidden rounded-xl">
                    <Image
                      src={imageSrc}
                      alt={`${service.title} - Professional service`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Enhanced Icon */}
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.subtitle}</p>
                  
                  {/* Enhanced Key Benefits */}
                  <ul className="space-y-3 mb-8">
                    {service.outcomes.slice(0, 2).map((outcome, outcomeIndex) => (
                      <li key={outcomeIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Enhanced CTA */}
                  <Link
                    href={`/services#${service.id}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-all duration-300 group-hover:translate-x-1"
                  >
                    Learn More
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced View All Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            View All Services
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
