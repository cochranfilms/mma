'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { servicePricingMap, formatMoneyFromCents } from '@/lib/invoice';

function CheckoutContent() {
  const params = useSearchParams();
  const serviceId = params?.get('serviceId') ?? '';
  const pricing = servicePricingMap[serviceId];

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWebsite, setCustomerWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const total = useMemo(() => (pricing ? pricing.unitPriceCents * quantity : 0), [pricing, quantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/wave/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          quantity,
          customerEmail,
          customerName,
          customerCompany,
          customerDetails: {
            phone: customerPhone || undefined,
            website: customerWebsite || undefined,
            industry: industry || undefined,
            companySize: companySize || undefined,
            startDate: startDate || undefined,
            notes: notes || undefined,
            referralSource: referralSource || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!json.success || !json.checkoutUrl) {
        throw new Error(json.error || 'Failed to create invoice');
      }
      setCheckoutUrl(json.checkoutUrl);
      setShowModal(true);
      setIsSubmitting(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (!pricing) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Service not found</h1>
        <p className="text-gray-600">Please go back and select a valid service.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-600 mb-6">{pricing.name}</p>

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input className="w-full border rounded-lg px-3 py-2" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full border rounded-lg px-3 py-2" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Company (optional)</label>
            <input className="w-full border rounded-lg px-3 py-2" value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone (optional)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website (optional)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={customerWebsite} onChange={(e) => setCustomerWebsite(e.target.value)} placeholder="https://" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Industry (optional)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company Size (optional)</label>
              <select className="w-full border rounded-lg px-3 py-2" value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                <option value="">Select…</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Desired Start Date (optional)</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">How did you hear about us? (optional)</label>
              <input className="w-full border rounded-lg px-3 py-2" value={referralSource} onChange={(e) => setReferralSource(e.target.value)} placeholder="Referral, LinkedIn, Google, etc." />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Project Notes (optional)</label>
            <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input type="number" min={1} className="w-full border rounded-lg px-3 py-2" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#010043] text-white px-6 py-3 rounded-lg hover:opacity-95 disabled:opacity-50">
            {isSubmitting ? 'Redirecting…' : 'Proceed to Secure Payment'}
          </button>

          <p className="text-xs text-gray-500 mt-2">
            After payment, your official Wave invoice will be generated automatically. If you prefer, you may also pay directly from the Wave invoice we email.
          </p>
        </form>

        <aside className="bg-white rounded-xl shadow p-4 border">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="flex justify-between text-sm mb-1">
            <span>Item</span>
            <span>{pricing.name}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Unit price</span>
            <span>{formatMoneyFromCents(pricing.unitPriceCents)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Quantity</span>
            <span>{quantity}</span>
          </div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#e0ab10]">{formatMoneyFromCents(total)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">Payment is processed securely via Wave invoice.</p>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-[#e0ab10]/20">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b2a] via-[#030316] to-black" />
            <div className="absolute -top-24 -right-20 w-80 h-80 rounded-full bg-[#e0ab10]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#e0ab10]/10 blur-3xl" />

            <div className="relative">
              <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-[#010043] to-[#0b0b2a]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 border border-white/10">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#e0ab10] animate-pulse" />
                  Momentum secured
                </div>
                <h3 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-white">You just freed your business from the mousetrap</h3>
                <p className="text-base md:text-lg text-white/85 mt-2">It’s time to put an automated, AI‑powered system to work and unlock outsized ROI.</p>
              </div>

              <div className="px-8 py-8 text-white">
                <p className="text-lg leading-relaxed text-white/90">Your invoice is ready. Review and complete secure payment below.</p>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <a href={checkoutUrl || '#'} target="_blank" rel="noreferrer" className="group inline-flex items-center justify-center px-6 py-4 rounded-xl bg-[#e0ab10] text-[#010043] font-bold text-lg shadow-[0_12px_30px_rgba(224,171,16,0.45)] hover:shadow-[0_18px_40px_rgba(224,171,16,0.55)] transition-shadow">
                    <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#010043] group-hover:scale-125 transition-transform" />
                    Pay Invoice Securely
                  </a>
                  <button onClick={() => setShowModal(false)} className="px-6 py-4 rounded-xl border border-white/15 text-white/90 font-medium hover:bg-white/5 transition-colors">
                    Not now
                  </button>
                </div>
                <div className="mt-6 text-sm text-white/70">We’ve also emailed you this link for your records.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServiceCheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-6">Loading checkout…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
