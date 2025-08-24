'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
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

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <p className="text-gray-400 text-sm mb-4">
              Join companies that have transformed their B2B marketing with MMA
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="w-20 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center border border-gray-600">
                <span className="text-xs text-gray-400">Client Logo</span>
              </div>
              <div className="w-20 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center border border-gray-600">
                <span className="text-xs text-gray-400">Client Logo</span>
              </div>
              <div className="w-20 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center border border-gray-600">
                <span className="text-xs text-gray-400">Client Logo</span>
              </div>
              <div className="w-20 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center border border-gray-600">
                <span className="text-xs text-gray-400">Client Logo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
