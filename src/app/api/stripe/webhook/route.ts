import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/lib/stripe-connect';
import { createWaveInvoice } from '@/lib/wave';
import { upsertContact, createDeal } from '@/lib/hubspot';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text();

    const result = await handleStripeWebhook(rawBody, signature);
    if (!('ok' in result) || result.ok !== true) {
      return NextResponse.json({ ok: false, error: (result as any).error || 'Invalid webhook' }, { status: 400 });
    }

    // After successful transfer, sync to Wave as bookkeeping (stub)
    if ('paymentIntentId' in result) {
      const { amountTotal, currency, paymentIntentId, customerEmail, customerName } = result as any;
      await createWaveInvoice({
        account: 'primary',
        payload: {
          customer: { email: customerEmail || 'stripe@checkout', name: customerName || 'Stripe Customer' },
          currency: currency || 'USD',
          items: [
            {
              description: `Stripe payment ${paymentIntentId}`,
              quantity: 1,
              unitPrice: (amountTotal || 0) / 100,
            },
          ],
          memo: 'Auto-synced from Stripe checkout',
          metadata: { source: 'mma-website', paymentIntentId },
        },
      });

      // HubSpot Deal capture (best-effort)
      try {
        const amount = Math.round(((amountTotal || 0) / 100) * 100) / 100;
        const dealName = `Website Purchase ${paymentIntentId}`;
        const email = customerEmail || 'stripe@checkout';
        const name = customerName || 'Stripe Customer';
        const contactId = await upsertContact({ email, firstname: name.split(' ')[0], lastname: name.split(' ').slice(1).join(' ') });
        await createDeal({
          dealname: dealName,
          amount,
          currency: (currency || 'USD').toUpperCase(),
          dealstage: 'closedwon',
          closeDate: new Date().toISOString(),
          contactId,
        });
      } catch (hsErr) {
        console.error('HubSpot deal sync failed:', hsErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
