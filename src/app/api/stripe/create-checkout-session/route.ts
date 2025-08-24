import { NextRequest, NextResponse } from 'next/server';
import { servicePricingMap } from '@/lib/invoice';
import { createStripeCheckoutSession } from '@/lib/stripe-connect';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, quantity = 1, customerEmail, customerName } = body || {};

    if (!serviceId || !customerEmail || !customerName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const pricing = servicePricingMap[serviceId];
    if (!pricing) {
      return NextResponse.json({ success: false, error: 'Invalid serviceId' }, { status: 400 });
    }

    const amountCents = pricing.unitPriceCents * Math.max(1, Number(quantity) || 1);

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${origin}/services/checkout?status=success&serviceId=${encodeURIComponent(serviceId)}`;
    const cancelUrl = `${origin}/services/checkout?status=cancelled&serviceId=${encodeURIComponent(serviceId)}`;

    const session = await createStripeCheckoutSession({
      amountCents,
      currency: 'usd',
      customerEmail,
      customerName,
      description: pricing.name,
      metadata: { serviceId, quantity: String(quantity) },
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ success: true, checkoutUrl: session.url });
  } catch (error) {
    console.error('Stripe create session error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
