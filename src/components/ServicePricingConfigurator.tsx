'use client';

import { useMemo, useState } from 'react';

type PackageOption = {
  id: string;
  name: string;
  description?: string;
  price: number;
  bestFor?: string;
  includes?: string[];
};

type AddOnOption = {
  id: string;
  name: string;
  description?: string;
  price: number;
  unit?: string;
};

type ServicePricing = {
  packages: PackageOption[];
  addOns: AddOnOption[];
  fullyCustomizable?: boolean;
};

export default function ServicePricingConfigurator({
  serviceId,
  serviceTitle,
  pricing,
}: {
  serviceId: string;
  serviceTitle: string;
  pricing: ServicePricing;
}) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(pricing.packages?.[0]?.id || '');
  const [addOnQuantities, setAddOnQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const selectedPackage = useMemo(
    () => pricing.packages.find((p) => p.id === selectedPackageId),
    [pricing.packages, selectedPackageId]
  );

  const addOnTotal = useMemo(() => {
    return Object.entries(addOnQuantities).reduce((sum, [id, qty]) => {
      const a = pricing.addOns.find((x) => x.id === id);
      return sum + (a ? a.price * Math.max(0, qty || 0) : 0);
    }, 0);
  }, [addOnQuantities, pricing.addOns]);

  const packagePrice = selectedPackage?.price || 0;
  const total = packagePrice + addOnTotal;

  const handleAdjustAddOn = (id: string, delta: number) => {
    setAddOnQuantities((prev) => {
      const next = { ...prev };
      const nextQty = Math.max(0, (prev[id] || 0) + delta);
      if (nextQty === 0) delete next[id];
      else next[id] = nextQty;
      return next;
    });
  };

  const handleCheckout = async () => {
    if (!customerName || !customerEmail) {
      setError('Please provide your name and email');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const items = [] as Array<{ name: string; description?: string; quantity: number; unitPriceCents: number }>; 
      if (selectedPackage) {
        items.push({
          name: `${serviceTitle} – ${selectedPackage.name}`,
          description: selectedPackage.description,
          quantity: 1,
          unitPriceCents: Math.round(selectedPackage.price * 100),
        });
      }
      for (const addOn of pricing.addOns) {
        const qty = addOnQuantities[addOn.id] || 0;
        if (qty > 0) {
          items.push({
            name: `${serviceTitle} – Add‑on: ${addOn.name}`,
            description: addOn.description,
            quantity: qty,
            unitPriceCents: Math.round(addOn.price * 100),
          });
        }
      }

      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractData: {
            clientName: customerName,
            clientEmail: customerEmail,
            selectedPackage: 'custom',
            contractId: 'SVC-' + Date.now()
          },
          invoice: {
            items,
            totalAmount: total / 100 // convert cents to dollars
          }
        }),
      });
      const contentType = res.headers.get('content-type') || '';
      let json: any = null;
      if (contentType.includes('application/json')) {
        json = await res.json();
        if (!res.ok) {
          const hint = json?.details?.hint ? ` — ${json.details.hint}` : '';
          throw new Error(json?.error ? `${json.error}${hint}` : `HTTP ${res.status}`);
        }
      } else {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      if (!json?.success) {
        const hint = json?.errorDetails?.hint ? ` — ${json.errorDetails.hint}` : '';
        throw new Error(json?.error ? `${json.error}${hint}` : 'Failed to create invoice');
      }
      
      if (json.mode === 'fallback' || !json.paymentUrl) {
        setError('Invoice created but payment link pending. We will email you the secure checkout link shortly.');
        setIsSubmitting(false);
        return;
      }
      setPaymentUrl(json.paymentUrl);
      setShowModal(true);
      setIsSubmitting(false);
      return;
    } catch (e: any) {
      setError(e?.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pricing" className="py-14">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configure Your Package</h2>
        <p className="text-gray-600 mb-6">Select a package and add-ons. Everything is fully customizable.</p>

        {/* Packages */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {pricing.packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackageId(pkg.id)}
              className={`text-left p-5 rounded-xl border-2 transition-all ${
                selectedPackageId === pkg.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{pkg.name}</div>
                  {pkg.bestFor && <div className="text-xs text-blue-700 mt-0.5">Best for: {pkg.bestFor}</div>}
                  {pkg.description && <div className="text-sm text-gray-600 mt-2">{pkg.description}</div>}
                  {pkg.includes && (
                    <ul className="mt-3 text-sm text-gray-600 list-disc pl-5">
                      {pkg.includes.slice(0,4).map((i, idx) => (
                        <li key={idx}>{i}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900">${pkg.price.toLocaleString()}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Add-ons */}
        {pricing.addOns.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Add‑Ons</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {pricing.addOns.map((a) => {
                const qty = addOnQuantities[a.id] || 0;
                return (
                  <div key={a.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{a.name}</div>
                        {a.description && <div className="text-sm text-gray-600 mt-1">{a.description}</div>}
                        <div className="text-blue-700 font-semibold mt-2">${a.price.toLocaleString()} {a.unit ? `/${a.unit}` : ''}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdjustAddOn(a.id, -1)}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{qty}</span>
                        <button
                          onClick={() => handleAdjustAddOn(a.id, 1)}
                          className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Buyer info and summary */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-2">Full Name</label>
              <input id="customerName" name="customerName" className="w-full border rounded-lg px-3 py-2" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required autoComplete="name" />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">Email</label>
              <input id="customerEmail" name="customerEmail" type="email" className="w-full border rounded-lg px-3 py-2" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div>
              <label htmlFor="customerCompany" className="block text-sm font-medium mb-2">Company (optional)</label>
              <input id="customerCompany" name="customerCompany" className="w-full border rounded-lg px-3 py-2" value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} autoComplete="organization" />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
          <aside className="bg-gray-50 rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600">Estimated Total</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">${total.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-2">Taxes calculated at checkout</div>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full mt-4 bg-[#010043] text-white px-5 py-3 rounded-lg hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Invoice…' : 'Buy Now'}
            </button>
            <div className="text-xs text-gray-500 mt-2">You will be redirected to a secure Wave invoice to complete payment.</div>
          </aside>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-[#010043]/10 overflow-hidden">
            <div className="bg-[#010043] text-white px-6 py-4">
              <h3 className="text-xl font-bold tracking-tight">You just freed your business from the mousetrap</h3>
              <p className="text-sm text-white/80 mt-1">It’s time to put an automated, AI-powered system to work and unlock outsized ROI.</p>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                Your invoice is ready. Click below to review and complete secure payment. We’ll kick off immediately after.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={paymentUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-[#e0ab10] text-[#010043] font-semibold hover:opacity-95 disabled:opacity-50"
                >
                  Pay Invoice Securely
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Not now
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                We’ll email you this link as well. Questions? Reply to the invoice email and our team will help.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


