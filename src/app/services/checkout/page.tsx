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
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        }),
      });
      const json = await res.json();
      if (!json.success || !json.checkoutUrl) {
        throw new Error(json.error || 'Failed to create invoice');
      }
      window.location.href = json.checkoutUrl;
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
