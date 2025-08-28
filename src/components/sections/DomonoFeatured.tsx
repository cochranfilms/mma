'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { RocketLaunchIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type Video = { title: string; url: string };

const videos: Video[] = [
  { title: 'Domono SmartCase w/ Detachable Camera', url: 'https://www.youtube.com/embed/j_qqHWpyTLk' },
  { title: 'Kickstarter Launch Campaign', url: 'https://www.youtube.com/embed/g-sLiNBSxe4' },
  { title: 'CES 2024 Recap', url: 'https://www.youtube.com/embed/XJDc5pbZJwk' },
];

export default function DomonoFeatured() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-[#e0ab10]/10 rounded-full border border-[#e0ab10]/30 mb-6"
          >
            <RocketLaunchIcon className="w-6 h-6 mr-3 text-[#010043]" />
            <span className="text-[#010043] font-bold tracking-wide">STRATEGIC PARTNER</span>
          </motion.div>

          <div className="mx-auto mb-6 flex items-center justify-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-white/10 ring-2 ring-[#010043]/40 overflow-hidden">
              <Image
                src="/2023_Composition.avif"
                alt="Domono Logo"
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
              className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 via-[#010043] to-[#e0ab10] bg-clip-text text-transparent"
            >
              Domono SmartCase Partnership
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-slate-600"
          >
            Marketing Mousetrap Agency partners with Domono Inc. to build the world’s first wearable AI smart camera.
            Domono is the first Black‑owned video camera company — and we’re proud to help bring this visionary product to market.
          </motion.p>
        </div>

        {/* Two Column Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl p-6 border border-slate-200 bg-white shadow-lg h-full flex flex-col"
          >
            <h3 className="text-2xl font-semibold mb-4 text-[#010043]">Case Study: Domono SmartCase Launch</h3>
            <p className="text-slate-700 mb-4">
              The Domono SmartCase is a state‑of‑the‑art phone case featuring a detachable 4K camera and a 180° hinge for
              truly unique shots. With robust live streaming and seamless smartphone synchronization, it redefines what an
              action camera can be.
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-[#010043] mr-2 mt-0.5" />Detachable 4K camera with wearable flexibility</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-[#010043] mr-2 mt-0.5" />180° hinge for creative angles and POV shots</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-[#010043] mr-2 mt-0.5" />Live streaming and instant smartphone sync</li>
              <li className="flex items-start"><CheckCircleIcon className="w-5 h-5 text-[#010043] mr-2 mt-0.5" />Ecosystem built for creators and everyday capture</li>
            </ul>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mt-8 md:mt-auto">
              <video src="/CES_QuickCap_4K.m4v" controls playsInline className="absolute inset-0 h-full w-full" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="rounded-2xl p-6 border border-slate-200 bg-white shadow-lg h-full flex flex-col"
          >
            <h3 className="text-2xl font-semibold mb-4 text-[#010043]">Our Approach</h3>
            <ul className="space-y-3 text-slate-700">
              <li><span className="font-semibold text-slate-900">Go‑to‑market Strategy:</span> Positioning, roadmap, and launch orchestration.</li>
              <li><span className="font-semibold text-slate-900">Product Narrative & Launch Film:</span> Story that converts curiosity into demand.</li>
              <li><span className="font-semibold text-slate-900">Crowdfunding Readiness:</span> Campaign assets for Kickstarter and beyond.</li>
              <li><span className="font-semibold text-slate-900">Community & Investor Updates:</span> Consistent cadence across channels.</li>
              <li><span className="font-semibold text-slate-900">Event Content (CES):</span> Capture, edit, and distribute momentum in real time.</li>
            </ul>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mt-6 md:mt-auto">
              <Image src="/DSC00731.jpg" alt="Domono Team" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </motion.div>
        </div>

        {/* Video Grid */}
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
                <span className="text-xs uppercase tracking-wide text-[#010043]">Domono Inc.</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#010043] via-[#e0ab10] to-[#010043]" />
    </section>
  );
}


