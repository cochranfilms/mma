import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import BookingForm from '@/components/BookingForm';

export const metadata: Metadata = generatePageMetadata('contact');

export default function ContactPage() {
  return (
    <>
      {/* Booking Form Only */}
      <section id="booking" className="py-20 md:py-24 bg-slate-950">
        <div className="container-custom">
          <BookingForm />
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
