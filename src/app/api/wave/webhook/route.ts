import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createDeal } from '@/lib/hubspot';
import { NextResponse as _ } from 'next/server';

// Zapier-compatible endpoint for Wave invoice events
// Supports simple PAID payloads; split mirroring removed for one-invoice flow
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
    // split removed

    if (!invoiceId || !status) {
      return NextResponse.json({ ok: false, error: 'invoiceId and status are required' }, { status: 400 });
    }

    const isPaid = String(status).toUpperCase() === 'PAID';

    // 1) CRM capture when invoice is paid
    if (isPaid && customerEmail) {
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

    // 2) Auto-book paid calendar events when memo includes booking context
    if (isPaid) {
      try {
        const memoText: string = String(memo || '');
        // Expect memo like: "Calendar booking for YYYY-MM-DD HH:MM"
        const match = memoText.match(/Calendar booking for (\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/);
        const serviceMatch = memoText.match(/\[(discovery|strategy|consultation|follow-up)\]/i);
        const svc = (serviceMatch?.[1] || '').toLowerCase();
        const serviceId = svc || 'strategy';
        if (match && customerEmail) {
          const date = match[1];
          const time = match[2];
          // Create Calendly single-use link for the service
          const calRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/calendly/schedule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serviceId, name: customerName, email: customerEmail }),
          });
          const calData = await calRes.json().catch(() => ({}));
          const schedulingUrl: string | undefined = calData?.schedulingUrl;
          console.log('Auto-book scheduling link:', schedulingUrl);
          // If needed, send an email with the scheduling link here via Postmark/EmailJS.
        }
      } catch (err) {
        console.error('Auto-booking flow failed:', err);
      }
    }

    console.log('Wave webhook received:', { invoiceId, status, amount, currency, customerEmail, memo });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}
