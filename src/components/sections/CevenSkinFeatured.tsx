'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FireIcon, RocketLaunchIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type Video = {
  title: string;
  url: string;
};

const videos: Video[] = [
  { title: '60s Commercial', url: 'https://www.youtube.com/embed/mWd3DjyPGR0' },
  { title: '30s Commercial', url: 'https://www.youtube.com/embed/UUw6X6_2Skk' },
  { title: '15s Commercial', url: 'https://www.youtube.com/embed/TFqKD9GWmjc' },
  { title: 'Behind The Scenes', url: 'https://www.youtube.com/embed/q2eNInNmtx4' },
];

export default function CevenSkinFeatured() {
  return (
    <section className="py-24 bg-white text-slate-900 relative overflow-hidden">

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-amber-100 rounded-full border border-amber-200 mb-6"
          >
            <FireIcon className="w-6 h-6 mr-3 text-amber-700" />
            <span className="text-amber-800 font-bold tracking-wide">FEATURED BRAND</span>
          </motion.div>

          <div className="mx-auto mb-6 flex items-center justify-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-white/10 ring-2 ring-[#e0ab10]/60 overflow-hidden">
              <Image
                src="/CevinKIDSlogo.avif"
                alt="Ceven Skin Kids Fresh Logo"
                fill
                className="object-contain p-2"
                sizes="64px"
                priority
              />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-amber-700 to-amber-500 bg-clip-text text-transparent"
            >
              Featured Brand: Ceven Skin®
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-slate-600"
          >
            We’ve built brands from scratch — including our own. At Cochran Films, we design
            and execute complete brand ecosystems with purpose, clarity, and action.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-6 border border-slate-200 bg-white shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4 text-amber-700">Case Study: Kids Fresh Face Wash Commercial</h3>
            <p className="text-slate-700 mb-4">
              At Marketing Mousetrap Agency, our Brand Building service goes beyond logos and websites —
              we craft the visual stories that define how your audience connects with your product.
              Ceven Skin® trusted us to produce a broadcast‑quality commercial for their Kids Fresh Face Toner & Wash.
              Our team directed the entire process from ideation to delivery.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />Creative Direction & Concept Development</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />Full Scriptwriting & Storyboarding</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />On‑Location Casting with Real Kids</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />Professional Cinematography & Lighting Setup</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />Voiceover, Music Licensing & Post‑Production</li>
            </ul>
            <p className="text-slate-700 mt-4">
              Whether you’re launching a skincare line or scaling an existing product,
              Cochran Films handles everything to make your brand look polished, purposeful, and professional.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="rounded-2xl p-6 border border-slate-200 bg-white shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4 text-amber-700">Our Approach</h3>
            <ul className="space-y-3 text-slate-700">
              <li><span className="font-semibold text-slate-900">Full‑Funnel Strategy:</span> Awareness → Interest → Decision → Action with a measurable next step at every touchpoint.</li>
              <li><span className="font-semibold text-slate-900">Conversion‑Focused Design:</span> Visuals tailored to turn viewers into customers.</li>
              <li><span className="font-semibold text-slate-900">Retention Marketing Support:</span> Keep customers coming back.</li>
              <li><span className="font-semibold text-slate-900">Omnichannel Execution:</span> Consistent message across web, email, social, and print.</li>
            </ul>
            <div className="mt-6">
              <a href="#featured" className="inline-flex items-center bg-gradient-to-r from-amber-500 to-amber-300 text-black font-bold py-3 px-6 rounded-xl hover:from-amber-400 hover:to-amber-200 transition-colors">
                <RocketLaunchIcon className="w-5 h-5 mr-2" />
                Explore The Work
              </a>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((v) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg"
            >
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`${v.url}?rel=0&modestbranding=1&playsinline=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
                <p className="font-medium text-slate-900">{v.title}</p>
                <span className="text-xs uppercase tracking-wide text-amber-600">Ceven Skin®</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
    </section>
  );
}


