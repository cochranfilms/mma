import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createDeal, createNoteForContact } from '@/lib/hubspot';
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
        await createNoteForContact({
          contactId,
          title: 'Payment received',
          body: `Invoice ${invoiceId} marked as PAID for ${amount} ${currency}.`,
        });
      } catch (err) {
        console.error('HubSpot sync failed for Wave webhook:', err);
      }
    }

    // 2) Handle paid calendar bookings
    if (isPaid) {
      try {
        const memoText: string = String(memo || '');
        // Check if this is a calendar booking invoice
        if (memoText.includes('Calendar booking:')) {
          // Extract service type from memo
          const serviceMatch = memoText.match(/Calendar booking: (Free Discovery Call|Strategy Session|Full Consultation|Follow-up Meeting)/i);
          const serviceName = serviceMatch?.[1] || '';
          
          // Map service names to IDs
          const serviceMap: Record<string, string> = {
            'Free Discovery Call': 'discovery',
            'Strategy Session': 'strategy', 
            'Full Consultation': 'consultation',
            'Follow-up Meeting': 'follow-up'
          };
          
          const serviceId = serviceMap[serviceName] || 'strategy';
          
          // Extract date/time if available
          const dateTimeMatch = memoText.match(/on (\d{4}-\d{2}-\d{2}) at (\d{2}:\d{2})/);
          
          if (customerEmail) {
            // Create HubSpot note about payment completion
            try {
              const contactId = await upsertContact({
                email: String(customerEmail),
                firstname: String(customerName || '').split(' ')[0] || undefined,
                lastname: String(customerName || '').split(' ').slice(1).join(' ') || undefined,
                jobtitle: 'Calendar Booking - Paid',
              });
              
              await createNoteForContact({
                contactId,
                title: 'Calendar Booking Payment Completed',
                body: [
                  `Payment received for ${serviceName}`,
                  `Invoice ID: ${invoiceId}`,
                  `Amount: ${amount} ${currency}`,
                  dateTimeMatch ? `Scheduled: ${dateTimeMatch[1]} at ${dateTimeMatch[2]}` : '',
                  'Customer can now proceed with booking confirmation.'
                ].filter(Boolean).join('\n')
              });
            } catch (err) {
              console.error('HubSpot calendar booking note failed:', err);
            }
            
            console.log('Calendar booking payment completed:', { 
              invoiceId, 
              serviceName, 
              serviceId, 
              customerEmail,
              amount,
              currency 
            });
          }
        }
      } catch (err) {
        console.error('Calendar booking payment processing failed:', err);
      }
    }

    console.log('Wave webhook received:', { invoiceId, status, amount, currency, customerEmail, memo });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}
