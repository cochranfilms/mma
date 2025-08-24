import { NextRequest, NextResponse } from 'next/server';
import { createWaveInvoiceStub } from '@/lib/wave';

// This webhook will be configured in Wave (or intermediary) to notify payment status
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, data } = body || {};

    // Basic validation
    if (!eventType || !data) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Example: payment_succeeded on primary invoice
    if (eventType === 'payment_succeeded' && data?.metadata?.split) {
      const split = data.metadata.split as {
        primaryEmail: string;
        secondaryEmail: string;
        ratio: { primary: number; secondary: number };
      };
      const total = Number(data.totalAmount) || 0;
      const secondaryAmount = total * (split.ratio.secondary || 0.4);

      // Create a secondary invoice to mirror the 40% in the secondary account (bookkeeping)
      // NOTE: This does NOT move funds; it is a record to be settled in the secondary account
      await createWaveInvoiceStub({
        account: 'secondary',
        payload: {
          customer: { email: data.customer?.email, name: data.customer?.name },
          currency: data.currency || 'USD',
          items: [
            {
              description: `Secondary split payment (${Math.round((split.ratio.secondary || 0.4) * 100)}%) for ${data.invoiceId}`,
              quantity: 1,
              unitPrice: secondaryAmount,
            },
          ],
          memo: 'Auto-generated split invoice',
          metadata: { source: 'mma-website', originInvoiceId: data.invoiceId, split },
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Wave webhook error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
