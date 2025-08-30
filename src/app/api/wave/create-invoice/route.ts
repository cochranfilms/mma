import { NextRequest, NextResponse } from 'next/server';
import { buildInvoiceDraft, toWavePayload } from '@/lib/invoice';
import { createWaveInvoice } from '@/lib/wave';
import { upsertContact, createNoteForContact } from '@/lib/hubspot';

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
      customerDetails,
    } = body || {};

    // Deprecated split emails; keep for backward compatibility but unused in one-invoice flow
    const primaryEmail = primaryWaveEmail || '';
    const secondaryEmail = secondaryWaveEmail || '';

    if (!customerName || !customerEmail) {
      return NextResponse.json({ success: false, error: 'customerName and customerEmail are required' }, { status: 400 });
    }

    let draft;
    try {
      draft = buildInvoiceDraft({
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
    } catch (e: any) {
      const msg = String(e?.message || 'Failed to build invoice draft');
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const payload = toWavePayload(draft);

    // One-business, one-invoice
    const created = await createWaveInvoice({ account: 'primary', payload: {
      customer: payload.customer,
      currency: payload.currency || 'USD',
      items: (payload.items || []).map(i => ({ name: i.description, quantity: i.quantity, unitPrice: i.unitPrice })),
      memo: [
        payload.memo,
        customerDetails?.notes ? `Notes: ${customerDetails.notes}` : '',
        customerDetails?.startDate ? `Desired start: ${customerDetails.startDate}` : '',
      ].filter(Boolean).join('\n'),
      metadata: payload.metadata,
    }});

    if (!created.success) {
      return NextResponse.json({ success: false, error: created.error || 'Wave API error', details: created.errorDetails, mode: created.mode }, { status: 500 });
    }

    // Fire-and-forget: HubSpot contact upsert + creation note
    (async () => {
      try {
        const contactId = await upsertContact({
          email: customerEmail,
          firstname: customerName.split(' ')[0] || undefined,
          lastname: customerName.split(' ').slice(1).join(' ') || undefined,
          company: customerCompany || undefined,
          jobtitle: 'MMA Services Checkout',
          phone: customerDetails?.phone,
          website: customerDetails?.website,
        });
        const lineSummary = (payload.items || [])
          .map(i => `• ${i.description} x${i.quantity} @ $${Number(i.unitPrice || 0).toFixed(2)}`)
          .join('\n');
        const noteBody = [
          `Invoice created in Wave`,
          `Invoice ID: ${created.invoiceId}`,
          `Total: $${Number((draft.totalCents || 0) / 100).toFixed(2)} ${draft.currency}`,
          created.checkoutUrl ? `Pay link: ${created.checkoutUrl}` : '',
          customerDetails?.industry ? `Industry: ${customerDetails.industry}` : '',
          customerDetails?.companySize ? `Company size: ${customerDetails.companySize}` : '',
          customerDetails?.referralSource ? `Referral: ${customerDetails.referralSource}` : '',
          customerDetails?.startDate ? `Desired start: ${customerDetails.startDate}` : '',
          '',
          'Items:',
          lineSummary,
        ].filter(Boolean).join('\n');
        await createNoteForContact({
          contactId,
          title: 'MMA Invoice Created',
          body: noteBody,
        });
      } catch (err) {
        console.error('HubSpot note on invoice creation failed:', err);
      }
    })();

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
