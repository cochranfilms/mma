'use client';

import Image from 'next/image';

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
    <section className="py-20 bg-gradient-to-br from-[#010043] to-[#0b0770] text-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Heading & Intro */}
        <div className="text-center max-w-4xl mx-auto mb-12">
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
            <h2 className="text-4xl md:text-5xl font-bold">Featured Brand: Ceven Skin®</h2>
          </div>
          <p className="text-lg md:text-xl text-indigo-100">
            We’ve built brands from scratch — including our own. At Cochran Films, we design
            and execute complete brand ecosystems with purpose, clarity, and action.
          </p>
        </div>

        {/* Strategy Copy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-[#e0ab10]">Case Study: Kids Fresh Face Wash Commercial</h3>
            <p className="text-indigo-100 mb-4">
              At Marketing Mousetrap Agency, our Brand Building service goes beyond logos and websites —
              we craft the visual stories that define how your audience connects with your product.
              Ceven Skin® trusted us to produce a broadcast‑quality commercial for their Kids Fresh Face Toner & Wash.
              Our team directed the entire process from ideation to delivery.
            </p>
            <ul className="list-disc list-inside space-y-2 text-indigo-100">
              <li>Creative Direction & Concept Development</li>
              <li>Full Scriptwriting & Storyboarding</li>
              <li>On‑Location Casting with Real Kids</li>
              <li>Professional Cinematography & Lighting Setup</li>
              <li>Voiceover, Music Licensing & Post‑Production</li>
            </ul>
            <p className="text-indigo-100 mt-4">
              Whether you’re launching a skincare line or scaling an existing product,
              Cochran Films handles everything to make your brand look polished, purposeful, and professional.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-[#e0ab10]">Our Approach</h3>
            <ul className="space-y-3 text-indigo-100">
              <li><span className="font-semibold text-white">Full‑Funnel Strategy:</span> Awareness → Interest → Decision → Action with a measurable next step at every touchpoint.</li>
              <li><span className="font-semibold text-white">Conversion‑Focused Design:</span> Visuals tailored to turn viewers into customers.</li>
              <li><span className="font-semibold text-white">Retention Marketing Support:</span> Keep customers coming back.</li>
              <li><span className="font-semibold text-white">Omnichannel Execution:</span> Consistent message across web, email, social, and print.</li>
            </ul>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((v) => (
            <div key={v.title} className="group rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-xl">
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
              <div className="flex items-center justify-between px-4 py-3 bg-white/5">
                <p className="font-medium">{v.title}</p>
                <span className="text-xs uppercase tracking-wide text-[#e0ab10]">Ceven Skin®</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accent bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#e0ab10] via-yellow-300 to-[#e0ab10]" />
    </section>
  );
}


