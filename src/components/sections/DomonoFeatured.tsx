'use client';

import Image from 'next/image';

type Video = { title: string; url: string };

const videos: Video[] = [
  { title: 'Domono SmartCase w/ Detachable Camera', url: 'https://www.youtube.com/embed/j_qqHWpyTLk' },
  { title: 'Kickstarter Launch Campaign', url: 'https://www.youtube.com/embed/g-sLiNBSxe4' },
  { title: 'CES 2024 Recap', url: 'https://www.youtube.com/embed/XJDc5pbZJwk' },
];

export default function DomonoFeatured() {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          <div className="mx-auto mb-6 flex items-center justify-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-slate-100 ring-2 ring-[#010043]/20 overflow-hidden">
              <Image
                src="/2023_Composition.avif"
                alt="Domono Logo"
                fill
                className="object-contain p-2"
                sizes="64px"
                priority
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Domono SmartCase Partnership</h2>
          </div>
          <p className="text-lg md:text-xl text-slate-600">
            Marketing Mousetrap Agency partners with Domono Inc. to build the world’s first
            wearable AI smart camera. Domono is the first Black‑owned video camera company — and we’re proud to help bring
            this visionary product to market.
          </p>
        </div>

        {/* Two Column Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-[#010043]">Domono SmartCase</h3>
            <p className="text-slate-700 mb-4">
              The Domono SmartCase is a state‑of‑the‑art phone case featuring a detachable 4K camera and
              a 180° hinge for truly unique shots. It embraces a sleek, flexible design with robust live streaming and
              seamless smartphone synchronization — redefining what an action camera can be.
            </p>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              <video src="/CES_QuickCap_4K.m4v" controls playsInline className="absolute inset-0 h-full w-full" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-[#010043]">Team & Mission</h3>
            <p className="text-slate-700 mb-4">
              As the first Black‑owned camera company, Domono’s mission is to empower creators everywhere
              with wearable, AI‑driven imaging. Our role spans creative direction, launch strategy, and content
              production to showcase the product and the people behind it.
            </p>
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image src="/DSC00731.jpg" alt="Domono Team" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((v) => (
            <div key={v.title} className="group rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg">
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
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <p className="font-medium text-slate-900">{v.title}</p>
                <span className="text-xs uppercase tracking-wide text-slate-500">Domono Inc.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#010043] via-[#e0ab10] to-[#010043]" />
    </section>
  );
}


