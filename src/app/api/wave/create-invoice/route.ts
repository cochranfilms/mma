import { NextRequest, NextResponse } from 'next/server';
import { buildInvoiceDraft, toWavePayload } from '@/lib/invoice';
import { createWaveInvoice, getWaveConfig } from '@/lib/wave';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerCompany,
      serviceId,
      quantity = 1,
      currency = 'USD',
      memo,
      primaryWaveEmail,
      secondaryWaveEmail,
      items,
    } = body || {};

    const envPrimary = process.env.WAVE_INVOICE_PRIMARY_EMAIL || '';
    const envSecondary = process.env.WAVE_INVOICE_SECONDARY_EMAIL || '';
    const primaryEmail = primaryWaveEmail || envPrimary;
    const secondaryEmail = secondaryWaveEmail || envSecondary;

    if (!customerName || !customerEmail || !serviceId || !primaryEmail || !secondaryEmail) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const draft = buildInvoiceDraft({
      customerName,
      customerEmail,
      customerCompany,
      serviceId,
      quantity,
      currency,
      memo,
      primaryWaveEmail: primaryEmail,
      secondaryWaveEmail: secondaryEmail,
      items,
    });

    const payload = toWavePayload(draft);

    // Attempt live Wave creation; payload already contains items/amounts
    const created = await createWaveInvoice({ account: 'primary', payload: {
      customer: payload.customer,
      currency: payload.currency || 'USD',
      items: (payload.items || []).map(i => ({ name: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
      memo: payload.memo,
      metadata: payload.metadata,
    }});

    if (!created.success) {
      return NextResponse.json({ success: false, error: created.error || 'Failed to create invoice', details: created.errorDetails, mode: created.mode }, { status: 500 });
    }

    // Respond with checkout URL and echo split metadata for client UI
    return NextResponse.json({
      success: true,
      invoiceId: created.invoiceId,
      checkoutUrl: created.checkoutUrl,
      mode: created.mode,
      split: draft.split,
      totalCents: draft.totalCents,
      currency: draft.currency,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
