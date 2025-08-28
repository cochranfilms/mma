'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '@/content/services';
import { CheckCircle, ArrowRight, Megaphone, Globe, Camera, PenTool, Target, Handshake } from 'lucide-react';
import { 
  RocketLaunchIcon,
  BoltIcon,
  TrophyIcon,
  FireIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import InteractiveToolsSection from '@/components/InteractiveToolsSection';
import Link from 'next/link';

const iconMap = {
  megaphone: Megaphone,
  globe: Globe,
  camera: Camera,
  'pen-tool': PenTool,
  target: Target,
  handshake: Handshake,
};

export default function ServicesPageClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeService, setActiveService] = useState(0);
  const featuredServices = services.filter(service => service.featured);
  const allServices = services;

  const categories = ['all', 'media', 'digital', 'strategy', 'content'];
  
  const filteredServices = activeCategory === 'all' 
    ? allServices 
    : allServices.filter(service => service.category === activeCategory);

  const powerStats = [
    { number: '1000%', label: 'Market Domination', icon: TrophyIcon },
    { number: '72hr', label: 'Deployment Speed', icon: RocketLaunchIcon },
    { number: '∞', label: 'Growth Potential', icon: ChartBarIcon },
    { number: '24/7', label: 'Elite Support', icon: ShieldCheckIcon }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % featuredServices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [featuredServices.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900">
      {/* Explosive Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,69,0,0.3)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,140,0,0.3)_0%,transparent_50%)]"></div>
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,69,0,0.2) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-6 py-3 bg-orange-500/20 rounded-full border border-orange-400/30 mb-8"
          >
            <FireIcon className="w-6 h-6 mr-3 text-orange-300" />
            <span className="text-orange-200 font-bold text-lg">ELITE WARFARE ARSENAL</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-orange-100 to-red-200 bg-clip-text text-transparent"
          >
            SERVICES THAT
            <br />
            <span className="text-5xl md:text-7xl text-orange-400">ANNIHILATE COMPETITION</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-orange-100 max-w-5xl mx-auto leading-relaxed mb-12"
          >
            While your competitors scramble to keep up, we're already dominating tomorrow's battlefield. 
            Our elite services don't just deliver results—they create market legends and industry titans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="#arsenal"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-5 px-12 rounded-xl hover:from-orange-400 hover:to-red-500 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl inline-flex items-center text-xl"
            >
              <RocketLaunchIcon className="w-7 h-7 mr-3" />
              UNLEASH THE ARSENAL
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
            
            <Link
              href="#domination-stats"
              className="bg-transparent border-3 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-bold py-5 px-12 rounded-xl transition-all duration-200 inline-flex items-center text-xl"
            >
              <ChartBarIcon className="w-7 h-7 mr-3" />
              VIEW DOMINATION STATS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Domination Stats */}
      <section id="domination-stats" className="py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              DOMINATION METRICS
            </h2>
            <p className="text-xl text-orange-100 max-w-4xl mx-auto">
              These aren't just numbers—they're proof of absolute market supremacy
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {powerStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-3xl p-8 border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 group-hover:scale-110">
                  <stat.icon className="w-12 h-12 text-orange-300 mx-auto mb-6" />
                  <div className="text-5xl md:text-6xl font-bold text-white mb-4">{stat.number}</div>
                  <div className="text-orange-200 font-bold text-lg">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Arsenal */}
      <section id="arsenal" className="py-20 bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-red-500/20 rounded-full border border-red-400/30 mb-8">
              <BoltIcon className="w-6 h-6 mr-3 text-red-300" />
              <span className="text-red-200 font-bold text-lg">ELITE WEAPONS CACHE</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-orange-200 bg-clip-text text-transparent">
              CHOOSE YOUR
              <br />
              <span className="text-red-400">DESTRUCTION METHOD</span>
            </h2>
            <p className="text-xl text-red-100 max-w-4xl mx-auto">
              Each service is a precision-engineered weapon designed to obliterate specific market challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {featuredServices.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-3xl p-10 border border-red-400/20 hover:border-red-300/40 transition-all duration-300 hover:scale-105 h-full">
                    {/* Service Header */}
                    <div className="flex items-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mr-6 border border-red-400/30">
                        <IconComponent className="w-8 h-8 text-red-400" />
                      </div>
                      <div>
                        <div className="inline-flex items-center px-3 py-1 bg-red-500/20 rounded-full border border-red-400/30 mb-2">
                          <StarIcon className="w-4 h-4 mr-2 text-red-300" />
                          <span className="text-red-200 text-sm font-bold">ELITE WEAPON</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{service.title}</h3>
                        <p className="text-red-200 font-semibold text-lg">{service.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-red-100 mb-8 text-lg leading-relaxed">{service.description}</p>
                    
                    {/* Pricing */}
                    <div className="mb-8">
                      <div className="bg-gradient-to-r from-red-500/10 to-orange-600/10 rounded-2xl p-6 border border-red-400/20">
                        <div className="flex items-baseline">
                          <span className="text-2xl text-red-200">Investment:</span>
                          <span className="text-5xl font-bold text-white ml-3">
                            ${service.startingPrice?.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-red-200 mt-2">ROI guaranteed or we work for free</p>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-white mb-4">GUARANTEED DESTRUCTION:</h4>
                      <div className="grid gap-3">
                        {service.deliverables.slice(0, 4).map((deliverable, idx) => (
                          <div key={idx} className="flex items-center text-green-400">
                            <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                            <span className="text-red-100 font-medium">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* CTAs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Link
                        href={`/services/${service.id}`}
                        className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-400 hover:to-orange-500 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
                      >
                        <RocketLaunchIcon className="w-5 h-5 mr-2" />
                        DEPLOY WEAPON
                      </Link>
                      <Link
                        href={`/services/${service.id}#pricing`}
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl hover:from-orange-400 hover:to-yellow-400 transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center"
                      >
                        <BoltIcon className="w-5 h-5 mr-2" />
                        ACQUIRE NOW
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Complete Arsenal Grid */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 rounded-full border border-yellow-400/30 mb-8">
              <CogIcon className="w-6 h-6 mr-3 text-yellow-300" />
              <span className="text-yellow-200 font-bold text-lg">COMPLETE WARFARE SYSTEM</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              FULL ARSENAL
              <br />
              <span className="text-white">DEPLOYMENT</span>
            </h2>
            <p className="text-xl text-yellow-100 max-w-4xl mx-auto mb-12">
              Every weapon in our arsenal, ready for immediate deployment. Choose your battlefield strategy.
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 capitalize ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black shadow-lg'
                      : 'bg-white/10 text-yellow-200 hover:bg-white/20'
                  }`}
                >
                  {category === 'all' ? 'ALL WEAPONS' : `${category.toUpperCase()} ARSENAL`}
                </button>
              ))}
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-8 border border-yellow-400/20 hover:border-yellow-300/40 transition-all duration-300 hover:scale-105 h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl flex items-center justify-center mr-4 border border-yellow-400/30">
                        <IconComponent className="w-7 h-7 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                        <span className="text-sm text-yellow-300 font-semibold uppercase tracking-wide">{service.category}</span>
                      </div>
                    </div>
                    
                    <p className="text-yellow-100 text-sm mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-6">
                      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-600/10 rounded-xl p-4 border border-yellow-400/20">
                        <div className="flex items-baseline">
                          <span className="text-yellow-200">From</span>
                          <span className="text-3xl font-bold text-white ml-2">
                            ${service.startingPrice?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/services/${service.id}`}
                          className="text-yellow-400 hover:text-yellow-300 font-bold text-sm flex items-center transition-colors"
                        >
                          INTEL
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                          href={`/services/${service.id}#pricing`}
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold py-2 px-4 rounded-lg text-sm hover:from-yellow-400 hover:to-orange-500 transition-all duration-200"
                        >
                          DEPLOY
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <InteractiveToolsSection />

      {/* Final Domination CTA */}
      <section className="py-32 bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 text-white relative overflow-hidden">
        {/* Explosive Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,69,0,0.4)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,140,0,0.4)_0%,transparent_50%)]"></div>
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-30"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'linear-gradient(45deg, transparent 30%, rgba(255,69,0,0.3) 50%, transparent 70%)',
              backgroundSize: '200% 200%',
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-8 py-4 bg-red-500/20 rounded-full border border-red-400/30 mb-12"
          >
            <FireIcon className="w-8 h-8 mr-4 text-red-300" />
            <span className="text-red-200 font-bold text-2xl">FINAL WARNING</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-yellow-100 to-orange-200 bg-clip-text text-transparent"
          >
            YOUR COMPETITORS
            <br />
            <span className="text-5xl md:text-7xl text-red-400">WON'T WAIT</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-orange-100 max-w-5xl mx-auto leading-relaxed mb-16"
          >
            Every second you hesitate, your competition gains ground. Every day you delay, 
            market share slips away. The battlefield doesn't pause for the unprepared.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12"
          >
            <Link
              href="/contact"
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold py-6 px-16 rounded-2xl hover:from-red-400 hover:to-orange-500 transition-all duration-200 transform hover:scale-110 hover:shadow-2xl inline-flex items-center text-2xl"
            >
              <RocketLaunchIcon className="w-8 h-8 mr-4" />
              INITIATE DOMINATION
              <BoltIcon className="w-8 h-8 ml-4" />
            </Link>
            
            <Link
              href="/work"
              className="bg-transparent border-4 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black font-bold py-6 px-16 rounded-2xl transition-all duration-200 transform hover:scale-110 inline-flex items-center text-2xl"
            >
              <TrophyIcon className="w-8 h-8 mr-4" />
              VIEW CONQUESTS
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-r from-red-500/10 to-orange-600/10 rounded-3xl p-8 border border-red-400/30 max-w-4xl mx-auto"
          >
            <p className="text-red-200 text-lg mb-4">
              ⚡ <strong>URGENT:</strong> Limited deployment slots available
            </p>
            <p className="text-orange-200 text-xl font-bold">
              Only 3 new battle campaigns accepted per quarter
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
