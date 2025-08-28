'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getServiceImage } from '@/lib/media';
import Link from 'next/link';
import { services } from '@/content/services';
import { 
  ArrowRightIcon, 
  RocketLaunchIcon,
  BoltIcon,
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

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
  const [activeService, setActiveService] = useState(0);
  const featuredServices = services.filter(service => service.featured);

  const serviceStats = [
    { number: '500%', label: 'ROI Increase', icon: ChartBarIcon },
    { number: '48hr', label: 'Launch Time', icon: RocketLaunchIcon },
    { number: '100%', label: 'Success Rate', icon: TrophyIcon },
    { number: '24/7', label: 'Support', icon: BoltIcon }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % featuredServices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredServices.length]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.3)_0%,transparent_50%)]"></div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Explosive Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-orange-500/20 rounded-full border border-orange-400/30 mb-6"
          >
            <FireIcon className="w-5 h-5 mr-2 text-orange-300" />
            <span className="text-orange-200 font-medium">Elite Services Arsenal</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent"
          >
            Services That
            <br />
            <span className="text-4xl md:text-5xl text-orange-400">Obliterate Competition</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
          >
            While others play catch-up, we're already dominating the next frontier. 
            Our battle-tested services don't just deliver results—they create market legends.
          </motion.p>
        </div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {serviceStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl p-6 border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 group-hover:scale-105">
                <stat.icon className="w-8 h-8 text-orange-300 mx-auto mb-4" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-orange-200 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Service Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Choose Your Weapon
          </h3>
          
          {/* Service Navigation */}
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            {featuredServices.map((service, index) => (
              <button
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeService === index
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>

          {/* Active Service Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Service Image */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-600/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-2 border border-white/20">
                    <Image
                      src={getServiceImage(featuredServices[activeService].id, activeService, 'card')}
                      alt={`${featuredServices[activeService].title} - Elite service`}
                      width={600}
                      height={400}
                      className="w-full h-80 object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 bg-orange-500/20 rounded-full border border-orange-400/30 mb-4">
                      <StarIcon className="w-4 h-4 mr-2 text-orange-300" />
                      <span className="text-orange-200 text-sm font-medium">Elite Service</span>
                    </div>
                    <h4 className="text-3xl font-bold text-white mb-4">
                      {featuredServices[activeService].title}
                    </h4>
                    <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                      {featuredServices[activeService].subtitle}
                    </p>
                  </div>

                  {/* Key Outcomes */}
                  <div className="mb-8">
                    <h5 className="text-lg font-semibold text-white mb-4">Guaranteed Outcomes:</h5>
                    <div className="grid gap-3">
                      {featuredServices[activeService].outcomes.slice(0, 3).map((outcome, index) => (
                        <div key={index} className="flex items-center text-green-400">
                          <CheckCircleIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="text-blue-100">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-xl p-6 border border-orange-400/20">
                      <div className="flex items-baseline">
                        <span className="text-2xl text-orange-200">Starting at</span>
                        <span className="text-4xl font-bold text-white ml-2">
                          ${featuredServices[activeService].startingPrice?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-orange-200 text-sm mt-2">Investment that pays for itself</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/services#${featuredServices[activeService].id}`}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-400 hover:to-red-500 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center"
                    >
                      <RocketLaunchIcon className="w-5 h-5 mr-2" />
                      Dominate With This Service
                    </Link>
                    
                    <Link
                      href="/contact"
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center justify-center"
                    >
                      Get Custom Strategy
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Explosive Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-3xl p-12 border border-orange-400/30 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Annihilate Your Competition?
            </h3>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Stop letting competitors steal your market share. Our elite services don't just level the playing field—they tilt it permanently in your favor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/services"
                className="bg-gradient-to-r from-orange-400 to-red-500 text-black font-bold py-4 px-10 rounded-xl hover:from-orange-300 hover:to-red-400 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl inline-flex items-center text-lg"
              >
                <FireIcon className="w-6 h-6 mr-3" />
                Unleash Full Arsenal
                <ArrowRightIcon className="w-5 h-5 ml-3" />
              </Link>
              
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center hover:shadow-lg"
              >
                <BoltIcon className="w-5 h-5 mr-2" />
                Get Battle Plan
              </Link>
            </div>

            <p className="text-orange-200 text-sm mt-6 opacity-90">
              ⚡ Warning: Results may cause extreme market dominance
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
