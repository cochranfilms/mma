'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  RocketLaunchIcon,
  ChartBarIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BoltIcon,
  ArrowRightIcon,
  UserGroupIcon as UsersIcon,
} from '@heroicons/react/24/outline';

const principles: Array<{ title: string; description: string; icon: React.ComponentType<any>; }> = [
  { title: 'Results Over Rituals', description: 'No vanity work. Every deliverable must measurably advance pipeline, revenue, or brand equity.', icon: ChartBarIcon },
  { title: 'Speed With Standards', description: 'We move fast without breaking quality. Tight feedback loops, clear owners, zero bureaucracy.', icon: BoltIcon },
  { title: 'Simple Is Strong', description: 'We remove complexity so your message travels farther and converts faster.', icon: SparklesIcon },
  { title: 'Integrity Compounds', description: 'Transparent communication and honest numbers. Trust is our most defensible moat.', icon: ShieldCheckIcon },
];

const pillars: Array<{ title: string; subtitle: string; points: string[]; icon: React.ComponentType<any>; }> = [
  { title: 'Media Advantage', subtitle: 'Authority that opens doors', points: ['Editorial placements that build brand gravity', 'Podcast and broadcast access that scales reach', 'Narratives built to convert, not just impress'], icon: GlobeAltIcon },
  { title: 'Web Advantage', subtitle: 'Design engineered for demand', points: ['Conversion-first UX with modern performance', 'Story-driven pages that sell outcomes', 'Analytics loops that improve weekly'], icon: SparklesIcon },
  { title: 'Partnership Advantage', subtitle: 'Relationships that compound distribution', points: ['B2B ecosystem mapping and warm introductions', 'Co-marketing motions that multiply impact', 'Lead sharing with transparent attribution'], icon: UsersIcon },
];

const stats: Array<{ number: string; label: string; icon: React.ComponentType<any>; }> = [
  { number: '6+', label: 'Years shipping demand engines', icon: RocketLaunchIcon },
  { number: '50M+', label: 'Cumulative audience reached', icon: GlobeAltIcon },
  { number: '300%', label: 'Avg growth in qualified pipeline', icon: ChartBarIcon },
  { number: '24/7', label: 'Strategic support availability', icon: BoltIcon },
];

export default function AboutPageClient() {
  return (
    <div className="bg-gradient-to-b from-black via-slate-950 to-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-28 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.35)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.35)_0%,transparent_50%)]"></div>
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5">
            About Marketing Mousetrap Agency
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto max-w-3xl text-lg md:text-2xl text-blue-100">
            We engineer unfair advantage for B2B brands by compounding media authority, conversion-first web experiences, and strategic partnerships into predictable pipeline.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 transition-all shadow-lg hover:shadow-xl">
              Start A Conversation
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/work" className="inline-flex items-center px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white hover:text-gray-900 transition-all">
              See Our Work
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Edge */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] bg-[length:28px_28px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="inline-flex items-center px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-500/10">
              <RocketLaunchIcon className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="text-yellow-200">Why Partners Choose MMA</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Compounding Advantage, Not One-Off Campaigns
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="text-blue-100 text-lg md:text-xl max-w-4xl mx-auto mt-4">
              Our operating system pairs story, distribution, and design to create momentum you can measure. It is built for B2B leaders who need reliable pipeline without sacrificing brand.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((p, index) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-8 border border-white/20 hover:border-white/30 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5">
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{p.title}</h3>
                <p className="text-blue-200 mb-4">{p.subtitle}</p>
                <ul className="space-y-2">
                  {p.points.map((point) => (
                    <li key={point} className="flex items-start text-blue-100">
                      <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.05 + i * 0.05 }} className="text-center bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl p-6 border border-blue-400/30">
                <s.icon className="w-7 h-7 mx-auto mb-3 text-blue-300" />
                <div className="text-3xl md:text-4xl font-bold">{s.number}</div>
                <div className="text-blue-200 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story + Mission */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Build market momentum for B2B companies by aligning story, design, and distribution into a repeatable growth engine. We don’t sell deliverables—we install systems that continue to pay dividends long after launch.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {[
                  'Outcomes-first planning and ruthless prioritization',
                  'Weekly iteration driven by measurement',
                  'Creative that converts, not just decorates',
                  'Partnerships that open new channels of demand',
                ].map((item) => (
                  <div key={item} className="flex items-start text-blue-100">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-400 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/20 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <SparklesIcon className="w-6 h-6 text-yellow-300 mr-2" />
                <h3 className="text-2xl font-semibold">Point of View</h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                The brands that win aren’t the loudest—they’re the clearest and most consistently distributed. MMA exists to make your clarity unavoidable: the right message, in the right places, reinforced by a web experience that converts attention into opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Operating Principles</h2>
            <p className="text-blue-200 max-w-3xl mx-auto">The cultural rules that keep our work sharp, honest, and fast.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }} className="bg-white/5 border border-white/20 rounded-2xl p-6">
                <p.icon className="w-7 h-7 text-blue-300 mb-3" />
                <h3 className="font-semibold text-xl mb-2">{p.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="container-custom text-center">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-6">Trusted by B2B brands</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-90">
            {[
              { src: '/CPI_Logo.png', alt: 'Certified Property Inspectors logo' },
              { src: '/ProfielPicture_CCAblack.png', alt: 'Course Creator Academy logo' },
              { src: '/CevinKIDSlogo.avif', alt: 'Cevin KIDS logo' },
            ].map((logo, index) => (
              <motion.div key={logo.src} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}>
                <Image src={logo.src} alt={logo.alt} width={220} height={70} className="h-12 w-auto object-contain" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl p-10 md:p-14 border border-yellow-400/30 text-center max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Advantage?</h3>
            <p className="text-yellow-100 text-lg mb-8">Let’s align story, design, and distribution into a system that compounds.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg">
                Book Free Consultation
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/services" className="inline-flex items-center px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white hover:text-gray-900 transition-all">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


