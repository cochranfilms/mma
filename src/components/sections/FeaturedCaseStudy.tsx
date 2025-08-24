'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { caseStudies } from '@/content/case-studies';
import { ArrowRightIcon, ChartBarIcon, UserGroupIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function FeaturedCaseStudy() {
  const featuredCaseStudy = caseStudies.find(caseStudy => caseStudy.featured);

  if (!featuredCaseStudy) return null;

  const { title, subtitle, client, results, image } = featuredCaseStudy;

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:32px_32px]"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-3xl"
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
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl"
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
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Real Results from Real Companies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-indigo-100 max-w-3xl mx-auto"
          >
            See how our strategic approach has transformed B2B companies across industries. 
            These aren't hypothetical scenarios—they're real results from real clients.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-700"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
                  Featured Case Study
                </span>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">{title}</h3>
                <p className="text-xl text-gray-300 mb-4">{subtitle}</p>
                <p className="text-sm text-indigo-200">
                  <strong>Client:</strong> {client}
                </p>
              </div>

              {/* Key Results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {results.metrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg mb-2 mx-auto shadow-lg">
                      {index === 0 && <ArrowTrendingUpIcon className="w-5 h-5" />}
                      {index === 1 && <ChartBarIcon className="w-5 h-5" />}
                      {index === 2 && <UserGroupIcon className="w-5 h-5" />}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{metric}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/work#${featuredCaseStudy.id}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Read Full Case Study
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-purple-900 transition-all duration-200"
                >
                  View All Work
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative bg-gradient-to-br from-gray-700 to-gray-800 min-h-[300px] lg:min-h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <ChartBarIcon className="w-12 h-12 text-white" />
                </div>
                <p className="text-purple-200 font-medium">Case Study Image</p>
                <p className="text-sm text-purple-300 mt-2">
                  {image ? 'Image would be displayed here' : 'Image placeholder'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-xl text-indigo-100 mb-6">
            Ready to see similar results for your company?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Start Your Transformation
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
