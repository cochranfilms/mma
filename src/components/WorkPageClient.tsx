'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { caseStudies } from '@/content/case-studies';
import CevenSkinFeatured from '@/components/sections/CevenSkinFeatured';
import DomonoFeatured from '@/components/sections/DomonoFeatured';
import {
  RocketLaunchIcon,
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { ArrowRight, Award, Users, TrendingUp } from 'lucide-react';

export default function WorkPageClient() {
  const featuredCaseStudies = caseStudies.filter(study => study.featured);
  const allCaseStudies = caseStudies;

  const showcaseStats = [
    { number: `${allCaseStudies.length}+`, label: 'Projects Delivered', icon: TrophyIcon },
    { number: '25+', label: 'Industries Served', icon: ChartBarIcon },
    { number: '4.9/5', label: 'Client Satisfaction', icon: UserGroupIcon },
    { number: 'x10', label: 'Avg. ROI Potential', icon: SparklesIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,69,0,0.25)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,140,0,0.25)_0%,transparent_50%)]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-6 py-3 bg-orange-500/20 rounded-full border border-orange-400/30 mb-8"
          >
            <FireIcon className="w-6 h-6 mr-3 text-orange-300" />
            <span className="text-orange-200 font-bold text-lg">PROVEN MARKET CONQUESTS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent"
          >
            OUR WORK
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed"
          >
            Real results from real clients. Explore how we transform businesses with creative firepower and precision strategy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="#featured"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-10 rounded-xl hover:from-orange-400 hover:to-red-500 transition-all duration-200 transform hover:scale-105 inline-flex items-center text-lg"
            >
              <RocketLaunchIcon className="w-6 h-6 mr-3" />
              VIEW FEATURED WORK
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="#stats"
              className="bg-transparent border-3 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-bold py-4 px-10 rounded-xl transition-all duration-200 inline-flex items-center text-lg"
            >
              <ChartBarIcon className="w-6 h-6 mr-3" />
              VIEW STATS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {showcaseStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl p-8 border border-orange-400/30">
                  <stat.icon className="w-10 h-10 text-orange-300 mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.number}</div>
                  <div className="text-orange-200 font-semibold text-sm uppercase tracking-wide">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MMA Featured Showcases */}
      <section id="featured" className="py-16 bg-gradient-to-br from-black via-gray-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <CevenSkinFeatured />
          <DomonoFeatured />
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              FEATURED SUCCESS STORIES
            </h2>
            <p className="text-lg text-orange-100 max-w-3xl mx-auto">
              Our most impactful work that demonstrates the transformative power of strategic marketing.
            </p>
          </div>

          <div className="space-y-12">
            {featuredCaseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-3xl border border-red-400/20 overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-orange-500/10 to-red-600/10 p-10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{study.client}</h3>
                      <p className="text-sm text-orange-200">{study.industry}</p>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{study.title}</h3>
                    <p className="text-lg text-orange-100 mb-6">{study.subtitle}</p>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Challenge</h4>
                        <p className="text-orange-100/90 text-sm">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Strategy</h4>
                        <p className="text-orange-100/90 text-sm">{study.strategy}</p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="font-semibold text-white mb-3">Key Results</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {study.results.metrics.slice(0, 4).map((metric: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                            <span className="text-sm text-orange-100/90">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {study.services.slice(0, 2).map((service: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-orange-100/20 text-orange-300 text-xs rounded-full border border-orange-400/30">
                            {service}
                          </span>
                        ))}
                      </div>
                      <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-6 rounded-lg font-medium hover:from-orange-400 hover:to-red-500 transition-colors flex items-center">
                        Read Full Case Study
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mb-4">
              WHAT OUR CLIENTS SAY
            </h2>
            <p className="text-lg text-yellow-100/90 max-w-3xl mx-auto">
              Don't just take our word for it—hear from the businesses we've helped transform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCaseStudies.map(study => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-yellow-900/10 to-orange-900/10 rounded-2xl p-6 border border-yellow-400/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-yellow-100/20 rounded-full flex items-center justify-center mr-3 border border-yellow-400/30">
                    <Users className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{study.testimonial.author}</h4>
                    <p className="text-sm text-yellow-100/80">{study.testimonial.title}, {study.testimonial.company}</p>
                  </div>
                </div>
                <blockquote className="text-yellow-50/90 italic mb-4">
                  "{study.testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-sm text-yellow-100/80">{study.industry} Success Story</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,69,0,0.35)_0%,transparent_55%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,140,0,0.35)_0%,transparent_55%)]"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-8 py-4 bg-red-500/20 rounded-full border border-red-400/30 mb-10"
          >
            <FireIcon className="w-8 h-8 mr-4 text-red-300" />
            <span className="text-red-200 font-bold text-2xl">READY TO JOIN OUR SUCCESS STORIES?</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xl text-orange-100 max-w-3xl mx-auto mb-10"
          >
            Let's create your own case study. Schedule a consultation to discuss how we can transform your business.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/contact" className="bg-white text-red-700 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-colors">
              Start Your Project
            </Link>
            <Link href="/services" className="border-2 border-white text-white font-bold py-4 px-10 rounded-xl hover:bg-white hover:text-red-700 transition-colors">
              View Our Services
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


