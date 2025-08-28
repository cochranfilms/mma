import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createDeal } from '@/lib/hubspot';
import { createWaveInvoice } from '@/lib/wave';

// Zapier-compatible endpoint for Wave invoice events
// Supports simple PAID payloads and optional split mirror invoicing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Preferred flat schema (Zapier mapping)
    const invoiceId = body.invoiceId || body.data?.invoiceId;
    const status = (body.status || body.eventType || '').toString();
    const amount = body.amount ?? body.data?.totalAmount;
    const currency = body.currency || body.data?.currency || 'USD';
    const customerEmail = body.customerEmail || body.data?.customer?.email;
    const customerName = body.customerName || body.data?.customer?.name;
    const memo = body.memo;
    const split = body.split || body.data?.metadata?.split;

    if (!invoiceId || !status) {
      return NextResponse.json({ ok: false, error: 'invoiceId and status are required' }, { status: 400 });
    }

    // 1) CRM capture when invoice is paid
    if (String(status).toUpperCase() === 'PAID' && customerEmail) {
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

    // 2) Optional: mirror 60/40 split with a secondary invoice (bookkeeping only)
    if (split && split?.ratio?.secondary) {
      const total = Number(amount) || 0;
      const secondaryRatio = Number(split.ratio.secondary) || 0.4;
      const secondaryAmount = total * secondaryRatio;
      try {
        await createWaveInvoice({
          account: 'secondary',
          payload: {
            customer: { email: customerEmail, name: customerName },
            currency: currency || 'USD',
            items: [
              {
                description: `Secondary split payment (${Math.round(secondaryRatio * 100)}%) for ${invoiceId}`,
                quantity: 1,
                unitPrice: secondaryAmount,
              },
            ],
            memo: 'Auto-generated split invoice',
            metadata: { source: 'mma-website', originInvoiceId: invoiceId, split },
          },
        });
      } catch (err) {
        console.error('Wave split mirror invoice failed:', err);
      }
    }

    console.log('Wave webhook received:', { invoiceId, status, amount, currency, customerEmail, memo, hasSplit: Boolean(split) });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}
