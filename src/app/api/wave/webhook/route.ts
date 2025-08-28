import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createDeal } from '@/lib/hubspot';

// Minimal Zapier-compatible webhook: POST JSON
// Expected body example from Zapier step mapping:
// {
//   "invoiceId": "INV_123",
//   "status": "PAID",
//   "amount": 15000.00,
//   "currency": "USD",
//   "customerEmail": "client@example.com",
//   "customerName": "Client Name",
//   "memo": "Wave payment",
//   "serviceId": "web-development"
// }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      invoiceId,
      status,
      amount,
      currency,
      customerEmail,
      customerName,
      memo,
      serviceId,
    } = body as Record<string, any>;

    if (!invoiceId || !status || !customerEmail) {
      return NextResponse.json({ ok: false, error: 'invoiceId, status, and customerEmail are required' }, { status: 400 });
    }

    // Upsert contact and create a closed-won deal when paid
    if (String(status).toUpperCase() === 'PAID') {
      try {
        const contactId = await upsertContact({
          email: String(customerEmail),
          firstname: String(customerName || '').split(' ')[0] || undefined,
          lastname: String(customerName || '').split(' ').slice(1).join(' ') || undefined,
          jobtitle: 'Wave Invoice Customer',
        });
        await createDeal({
          dealname: `Wave Invoice ${invoiceId}`,
          amount: typeof amount === 'number' ? amount : Number(amount || 0),
          currency: (currency || 'USD').toUpperCase(),
          dealstage: 'closedwon',
          closeDate: new Date().toISOString(),
          contactId,
        });
      } catch (err) {
        console.error('HubSpot sync failed for Wave webhook:', err);
      }
    }

    // Minimal internal log echo (extend to DB if needed)
    console.log('Wave webhook received:', { invoiceId, status, amount, currency, customerEmail, memo, serviceId });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createWaveInvoice } from '@/lib/wave';

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
      await createWaveInvoice({
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
