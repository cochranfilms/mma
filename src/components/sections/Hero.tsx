'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen flex items-center">
        
      {/* Hero Background GIF */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/art.gif"
          alt="Animated 3D graphic background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      {/* Dark overlay to tone down background */}
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
      {/* Enhanced Background Pattern (gold accent) */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(224,171,16,0.15)_1px,transparent_0)] bg-[length:24px_24px]"></div>
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

      <div className="container-custom relative z-20">
        <div className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 leading-tight uppercase">
                <div className="whitespace-nowrap bg-gradient-to-r from-[#F7D046] via-[#FFE9A3] to-[#E0AB10] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(224,171,16,0.35)]">B2B&nbsp;MEDIA&nbsp;CONNECTIONS</div>
                <div className="bg-gradient-to-r from-[#F7D046] via-[#FFE9A3] to-[#E0AB10] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(224,171,16,0.35)]">THAT COMPOUND YOUR</div>
                <span className="relative bg-gradient-to-r from-[#F7D046] via-[#FFE9A3] to-[#E0AB10] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(224,171,16,0.35)]">
                  BRAND'S REACH
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
                <SparklesIcon className="w-10 h-10 text-[#E0AB10] drop-shadow-[0_0_10px_rgba(224,171,16,0.45)]" />
              </motion.div>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2"
            >
              We upgrade your web presence, content, and partnerships—then turn it into pipeline. 
              Our strategic approach creates compounding results that accelerate your B2B growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-14 md:mb-16 px-4"
            >
              <Link href="/contact" className="group">
                <span className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base">
                  Book Free Consultation
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              
              <Link href="/work" className="group">
                <span className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base">
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
              className="space-y-6 sm:space-y-8"
            >
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-semibold px-4">
                Trusted by B2B companies across industries
              </p>
              
              {/* Trust Logos */}
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 px-4">
                {[
                  { src: '/CPI_Logo.png', alt: 'Certified Property Inspectors logo' },
                  { src: '/ProfielPicture_CCAblack.png', alt: 'Course Creator Academy logo' },
                  { src: '/CevinKIDSlogo.avif', alt: 'Cevin KIDS logo' },
                ].map((logo: { src: string; alt: string }, index: number) => (
                  <motion.div
                    key={logo.src}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="group"
                  >
                                      <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={240}
                    height={80}
                    className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                  />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>


    </section>
  );
}
