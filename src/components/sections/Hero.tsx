'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center">
        
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/media-assets/images/media-connections-hero-1.jpg"
          alt="Professional business networking and media connections"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full opacity-30 blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-30 blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container-custom relative z-10">
        <div className="py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
                B2B media connections that{' '}
                <span className="relative">
                  compound your brand's reach
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h1>
              
              {/* Sparkle Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="inline-block mt-4"
              >
                <SparklesIcon className="w-10 h-10 text-blue-500" />
              </motion.div>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              We upgrade your web presence, content, and partnerships—then turn it into pipeline. 
              Our strategic approach creates compounding results that accelerate your B2B growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Link href="/contact" className="group">
                <span className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                  Book Free Consultation
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              
              <Link href="/work" className="group">
                <span className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transform hover:-translate-y-0.5 transition-all duration-200">
                  View Our Work
                  <PlayIcon className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-200" />
                </span>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-8"
            >
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                Trusted by B2B companies across industries
              </p>
              
              {/* Trust Logos */}
              <div className="flex justify-center items-center space-x-8">
                {[
                  { src: '/CPI_Logo.png', alt: 'Certified Property Inspectors logo' },
                  { src: '/ProfielPicture_CCAblack.png', alt: 'Course Creator Academy logo' },
                  { src: '/CevinKIDSlogo.avif', alt: 'Cevin KIDS logo' },
                ].map((logo, index) => (
                  <motion.div
                    key={logo.src}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="group"
                  >
                    <div className="w-28 h-14 bg-white rounded-xl flex items-center justify-center border border-gray-200 group-hover:border-blue-300 transition-all duration-200 group-hover:shadow-lg shadow-md overflow-hidden">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={112}
                        height={56}
                        className="max-h-10 w-auto object-contain"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Element */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      />
    </section>
  );
}
