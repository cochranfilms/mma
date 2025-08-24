import { NextRequest, NextResponse } from 'next/server';
import { buildInvoiceDraft, toWavePayload } from '@/lib/invoice';
import { createWaveInvoiceStub } from '@/lib/wave';

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
    } = body || {};

    if (!customerName || !customerEmail || !serviceId || !primaryWaveEmail || !secondaryWaveEmail) {
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
      primaryWaveEmail,
      secondaryWaveEmail,
    });

    const payload = toWavePayload(draft);

    // For now, create the customer-facing invoice in the primary account
    const created = await createWaveInvoiceStub({ account: 'primary', payload });

    if (!created.success) {
      return NextResponse.json({ success: false, error: created.error || 'Failed to create invoice' }, { status: 500 });
    }

    // Respond with checkout URL and echo split metadata for client UI
    return NextResponse.json({
      success: true,
      invoiceId: created.invoiceId,
      checkoutUrl: created.checkoutUrl,
      split: draft.split,
      totalCents: draft.totalCents,
      currency: draft.currency,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
