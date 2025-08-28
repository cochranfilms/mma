'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BoltIcon, 
  ChartBarIcon, 
  GlobeAltIcon, 
  RocketLaunchIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function IndustryPowerhouseSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stats = [
    { number: '6+', label: 'Years Experience', icon: TrophyIcon },
    { number: '50M+', label: 'Audience Reached', icon: GlobeAltIcon },
    { number: '300%', label: 'Avg ROI Increase', icon: ChartBarIcon },
    { number: '24/7', label: 'Strategic Support', icon: BoltIcon }
  ];

  const trustedBrands = [
    {
      name: 'iHeartMedia',
      displayName: 'iHeartMedia',
      brandColor: 'from-red-500 to-pink-600',
      description: 'Strategic media partnerships across 850+ stations',
      impact: 'Reached 250M+ listeners nationwide'
    },
    {
      name: 'Disney',
      displayName: 'Disney',
      brandColor: 'from-blue-600 to-purple-700',
      description: 'Content strategy for magical brand experiences',
      impact: 'Enhanced digital engagement by 400%'
    },
    {
      name: 'Georgia Power',
      displayName: 'Georgia Power',
      brandColor: 'from-green-500 to-emerald-600',
      description: 'B2B communications for energy solutions',
      impact: 'Improved stakeholder relations by 200%'
    }
  ];

  const capabilities = [
    {
      title: 'Media Domination',
      description: 'We don\'t just get coverage - we create media moments that define industries',
      features: ['National TV & Radio', 'Podcast Networks', 'Digital Amplification']
    },
    {
      title: 'Digital Transformation',
      description: 'Websites that don\'t just look good - they convert visitors into customers',
      features: ['Conversion Optimization', 'User Experience Design', 'Performance Analytics']
    },
    {
      title: 'Strategic Partnerships',
      description: 'We forge connections that create exponential growth opportunities',
      features: ['B2B Network Access', 'Joint Ventures', 'Strategic Alliances']
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % capabilities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.3)_0%,transparent_50%)]"></div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
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
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 mb-6"
          >
            <RocketLaunchIcon className="w-5 h-5 mr-2 text-blue-300" />
            <span className="text-blue-200 font-medium">Industry Powerhouse</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent"
          >
            We Don't Just Promise Results
            <br />
            <span className="text-4xl md:text-5xl text-yellow-400">We Deliver Dominance</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed"
          >
            6 years of transforming B2B marketing for industry giants. When Fortune 500 companies 
            need results that matter, they choose Marketing Mousetrap Agency.
          </motion.p>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 group-hover:scale-105">
                <stat.icon className="w-8 h-8 text-blue-300 mx-auto mb-4" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trusted Brands Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center mb-4 text-white">
            Trusted by Industry Leaders
          </h3>
          <p className="text-blue-200 text-center mb-12 max-w-2xl mx-auto">
            When these powerhouse brands needed marketing that moves mountains, they chose us.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {trustedBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 group"
              >
                <div className="h-20 flex items-center justify-center mb-6">
                  <div className={`bg-gradient-to-r ${brand.brandColor} text-white font-bold text-xl px-8 py-4 rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                    {brand.displayName}
                  </div>
                </div>
                <p className="text-blue-100 mb-4 font-medium">{brand.description}</p>
                <div className="flex items-center text-green-400 font-semibold">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  {brand.impact}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Our Competitive Advantage
          </h3>
          
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center mb-8 gap-4">
              {capabilities.map((capability, index) => (
                <button
                  key={capability.title}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === index
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'
                  }`}
                >
                  {capability.title}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20"
              >
                <h4 className="text-2xl font-bold text-white mb-4">
                  {capabilities[activeTab].title}
                </h4>
                <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                  {capabilities[activeTab].description}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {capabilities[activeTab].features.map((feature, index) => (
                    <div key={feature} className="flex items-center text-blue-200">
                      <CheckCircleIcon className="w-5 h-5 mr-3 text-green-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Powerful CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl p-12 border border-yellow-400/30 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Join the Elite?
            </h3>
            <p className="text-xl text-yellow-100 mb-8 leading-relaxed">
              Stop settling for average results. Your competitors are already losing ground. 
              The question isn't whether you can afford our services—it's whether you can afford to wait.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-10 rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl inline-flex items-center text-lg"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-3" />
                Claim Your Competitive Edge
                <ArrowRightIcon className="w-5 h-5 ml-3" />
              </Link>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200 inline-flex items-center hover:shadow-lg"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                Watch Success Stories
              </button>
            </div>

            <p className="text-yellow-200 text-sm mt-6 opacity-90">
              ⚡ Limited availability - Only 3 new partnerships per quarter
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
