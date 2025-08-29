import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import BookingForm from '@/components/BookingForm';
import dynamic from 'next/dynamic';
const HubSpotForm = dynamic(() => import('@/components/HubSpotForm'), { ssr: false });
import Image from 'next/image';

export const metadata: Metadata = generatePageMetadata('contact');

export default function ContactPage() {
  const hasHubspot = !!process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID;
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0">
          <Image
            src="/media-assets/images/media-connections-section-1.jpg"
            alt="Professional business networking and connections"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="relative container-custom text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-400/30 bg-orange-500/10 text-orange-200 text-sm font-semibold tracking-wide mb-6">
            ELITE CONTACT CHANNEL
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Let's Connect And Build Your Growth Engine
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Senior, confidential execution across media, web, and creative. Tell us where you want to win—we'll design the campaign that gets you there.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="#contact-form" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 text-white font-medium shadow-[0_10px_30px_rgba(234,88,12,0.35)] hover:from-orange-400 hover:to-rose-500 transition-all">Start the Conversation</a>
            <a href="#booking" className="px-5 py-2.5 rounded-full border border-white/20 text-slate-100 hover:bg-white/10 transition-colors">Schedule A Call</a>
          </div>
        </div>
      </section>

      {/* Info & Quick Actions */}
      <section className="relative py-20 md:py-24 bg-slate-950">
        <div className="container-custom space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Work With MMA</h2>
            <p className="text-slate-300">Tell us your goal. We'll map the playbook and run the mission.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="tel:+14047077298" className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4">
                <div className="text-sm text-slate-300">Direct Line</div>
                <div className="text-white font-semibold group-hover:text-orange-200">(404) 707 - 7298</div>
              </a>
              <a href="mailto:sales@marketingmousetrapagency.com" className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-4">
                <div className="text-sm text-slate-300">Email</div>
                <div className="text-white font-semibold group-hover:text-orange-200">sales@marketingmousetrapagency.com</div>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <h3 className="text-white font-semibold mb-3">Fast Actions</h3>
            <div className="flex flex-wrap gap-3">
              <a href={hasHubspot ? '#contact-form' : '#booking'} className="px-4 py-2 rounded-full bg-white/10 text-slate-100 hover:bg-white/20 transition">Live Chat Support</a>
              <a href="#booking" className="px-4 py-2 rounded-full bg-white/10 text-slate-100 hover:bg-white/20 transition">Calendar Booking</a>
              <a href={hasHubspot ? '#contact-form' : '#booking'} className="px-4 py-2 rounded-full bg-white/10 text-slate-100 hover:bg-white/20 transition">Video Consultation</a>
              <a href="/tools" className="px-4 py-2 rounded-full bg-white/10 text-slate-100 hover:bg-white/20 transition">Instant Quote Calculator</a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-fuchsia-600/20 backdrop-blur p-6">
            <div className="text-slate-300">Confidential production for agencies • ROI guaranteed or we work for free</div>
          </div>
        </div>
      </section>

      {/* HubSpot Form - full width (render only if configured) */}
      {hasHubspot && (
        <section id="contact-form" className="py-20 md:py-24 bg-slate-950">
          <div className="container-custom">
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
              <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-fuchsia-700 text-white p-6">
                <h3 className="text-2xl font-bold">Start the Conversation</h3>
                <p className="text-blue-100">Share your goals. We'll reply with next steps within one business day.</p>
              </div>
              <div className="p-6 md:p-8">
                <HubSpotForm formId={process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID as string} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Form - full width */}
      <section id="booking" className="py-20 md:py-24 bg-slate-950">
        <div className="container-custom">
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-fuchsia-700 text-white p-6">
              <h3 className="text-2xl font-bold">Book a Call</h3>
              <p className="text-rose-100">Prefer to jump straight to scheduling? Choose a time that works for you.</p>
            </div>
            <div className="p-6 md:p-8">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-20 md:py-24 bg-slate-950">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-rose-600 text-white">☎</div>
              <h3 className="text-white text-xl font-semibold mb-1">Call Us</h3>
              <p className="text-slate-300 mb-2">Speak directly with our team</p>
              <a href="tel:+14047077298" className="text-orange-200 font-medium hover:text-white transition-colors">(404) 707 - 7298</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-rose-600 text-white">✉</div>
              <h3 className="text-white text-xl font-semibold mb-1">Email Us</h3>
              <p className="text-slate-300 mb-2">Send us a detailed message</p>
              <a href="mailto:sales@marketingmousetrapagency.com" className="text-orange-200 font-medium hover:text-white transition-colors">sales@marketingmousetrapagency.com</a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-rose-600 text-white">📍</div>
              <h3 className="text-white text-xl font-semibold mb-1">Visit Us</h3>
              <p className="text-slate-300 mb-2">Schedule an in‑person meeting</p>
              <p className="text-orange-200 font-medium">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24 bg-slate-950">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-200 text-sm font-semibold tracking-wide mb-6">
              OPERATIONS PLAYBOOK
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-300 max-w-3xl mx-auto">Quick answers about how we work and what to expect.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-white font-semibold text-lg mb-2">How quickly can we get started?</h3>
              <p className="text-slate-300">We typically begin within 1–2 weeks of our initial consultation, depending on scope and current capacity.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-white font-semibold text-lg mb-2">What's included in the free consultation?</h3>
              <p className="text-slate-300">A focused 30‑minute session to align on goals, challenges, and the fastest path to ROI with clear next steps.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-white font-semibold text-lg mb-2">Do you work with companies outside the US?</h3>
              <p className="text-slate-300">Yes. We deliver globally with remote-first workflows and local partners as needed.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-white font-semibold text-lg mb-2">How do you measure success?</h3>
              <p className="text-slate-300">We set KPIs up front—media impact, web performance, pipeline growth—and report progress tied to outcomes.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
