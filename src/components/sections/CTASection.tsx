'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CalendarDaysIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:32px_32px]"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-slate-400 to-gray-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full opacity-20 blur-3xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Ready to Transform Your B2B Marketing?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Stop struggling with mediocre results. Our strategic approach to media relations, 
            web presence, and B2B connections creates compounding growth that transforms your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            {/* What You'll Get */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-left border border-gray-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-4 text-white">What You'll Get</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Strategic media coverage that builds credibility</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Modern website that converts visitors to customers</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>B2B partnerships that expand your reach</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Measurable results and clear ROI</span>
                </li>
              </ul>
            </div>

            {/* Why Choose MMA */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-left border border-gray-700 shadow-lg">
              <h3 className="font-semibold text-lg mb-4 text-white">Why Choose MMA</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Proven 3-step process that compounds results</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Deep expertise in B2B marketing and media</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Track record of transforming companies</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Ongoing partnership and support</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-xl inline-flex items-center shadow-lg"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              Book Free Consultation
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
            
            <Link
              href="tel:+1-555-123-4567"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center hover:shadow-lg"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Call Us Now
            </Link>
          </motion.div>

          {/* Trust Indicators – Powerhouse Ribbon (matches hero) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12"
          >
            <div className="relative mx-auto max-w-6xl px-4">
              <div className="rounded-3xl p-[2px] bg-gradient-to-r from-[#F7D046] via-[#E0AB10] to-[#B97A00] shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                <div className="relative rounded-3xl bg-white/5 backdrop-blur-md">
                  <div className="absolute inset-0 pointer-events-none rounded-3xl opacity-30" style={{
                    background:
                      'radial-gradient(ellipse at top left, rgba(255,255,255,.25), transparent 40%), radial-gradient(ellipse at bottom right, rgba(224,171,16,.22), transparent 45%)',
                  }} />
                  <div className="relative py-5 sm:py-6">
                    <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-black text-center font-semibold">
                      Join companies that have transformed their B2B marketing with MMA
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center items-center gap-8 md:gap-12">
                      {[ 
                        { src: '/CPI_Logo.png', alt: 'Certified Property Inspectors logo' },
                        { src: '/ProfielPicture_CCAblack.png', alt: 'Course Creator Academy logo' },
                        { src: '/CevinKIDSlogo.avif', alt: 'Cevin KIDS logo' },
                      ].map((logo: { src: string; alt: string }, index: number) => (
                        <motion.div
                          key={logo.src}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: 0.2 + index * 0.08 }}
                          className="group"
                        >
                          <Image
                            src={logo.src}
                            alt={logo.alt}
                            width={240}
                            height={80}
                            className="h-12 md:h-14 lg:h-16 w-auto object-contain opacity-80 saturate-75 group-hover:opacity-100 group-hover:saturate-100 transition-all duration-200 drop-shadow-[0_0_16px_rgba(224,171,16,0.28)]"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
