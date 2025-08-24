import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/lib/stripe-connect';
import { createWaveInvoiceStub } from '@/lib/wave';

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
      const { amountTotal, currency, paymentIntentId } = result as any;
      await createWaveInvoiceStub({
        account: 'primary',
        payload: {
          customer: { email: 'stripe@checkout', name: 'Stripe Customer' },
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
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
