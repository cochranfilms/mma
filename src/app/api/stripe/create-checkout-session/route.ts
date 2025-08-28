import { NextRequest, NextResponse } from 'next/server';
import { servicePricingMap } from '@/lib/invoice';
import { createStripeCheckoutSession } from '@/lib/stripe-connect';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, quantity = 1, customerEmail, customerName, items, customerCompany } = body || {};

    if (!customerEmail || !customerName) {
      return NextResponse.json({ success: false, error: 'customerEmail and customerName are required' }, { status: 400 });
    }

    let amountCents = 0;
    let description = '';
    if (Array.isArray(items) && items.length > 0) {
      // Use arbitrary items (from configurator)
      amountCents = items.reduce((sum: number, it: any) => sum + Math.round(Number(it.unitPriceCents || 0)) * Math.max(1, Number(it.quantity) || 1), 0);
      description = items[0]?.name || 'Service Purchase';
    } else {
      // Use predefined service pricing map
      if (!serviceId) {
        return NextResponse.json({ success: false, error: 'serviceId or items are required' }, { status: 400 });
      }
      const pricing = servicePricingMap[serviceId];
      if (!pricing) {
        return NextResponse.json({ success: false, error: 'Invalid serviceId' }, { status: 400 });
      }
      amountCents = pricing.unitPriceCents * Math.max(1, Number(quantity) || 1);
      description = pricing.name;
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${origin}/services/checkout?status=success&serviceId=${encodeURIComponent(serviceId)}`;
    const cancelUrl = `${origin}/services/checkout?status=cancelled&serviceId=${encodeURIComponent(serviceId)}`;

    const session = await createStripeCheckoutSession({
      amountCents,
      currency: 'usd',
      customerEmail,
      customerName,
      description,
      metadata: { serviceId, quantity: String(quantity), customerCompany: customerCompany || '', hasCustomItems: Array.isArray(items) && items.length > 0 ? 'true' : 'false' },
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ success: true, checkoutUrl: session.url });
  } catch (error) {
    console.error('Stripe create session error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
