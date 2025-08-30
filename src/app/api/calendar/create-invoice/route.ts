import { NextRequest, NextResponse } from 'next/server';
import { createWaveInvoice } from '@/lib/wave';
import { upsertContact, createNoteForContact } from '@/lib/hubspot';

export const runtime = 'nodejs';

// Calendar service pricing in cents
const CALENDAR_SERVICE_PRICING = {
  'discovery': 0, // Free
  'strategy': 100, // $1 (for testing)
  'consultation': 25000, // $250
  'follow-up': 10000, // $100
} as const;

const CALENDAR_SERVICE_NAMES = {
  'discovery': 'Free Discovery Call',
  'strategy': 'Strategy Session',
  'consultation': 'Full Consultation',
  'follow-up': 'Follow-up Meeting',
} as const;

export async function POST(req: NextRequest) {
  try {
    console.log('📅 Calendar invoice request received');
    const body = await req.json();
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    const { 
      customerName, 
      customerEmail, 
      serviceId, 
      selectedDate, 
      selectedTime, 
      memo 
    } = body || {};
    
    if (!customerName || !customerEmail || !serviceId) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ 
        success: false, 
        error: 'customerName, customerEmail, and serviceId are required' 
      }, { status: 400 });
    }

    // Check if service exists and get pricing
    const unitPriceCents = CALENDAR_SERVICE_PRICING[serviceId as keyof typeof CALENDAR_SERVICE_PRICING];
    const serviceName = CALENDAR_SERVICE_NAMES[serviceId as keyof typeof CALENDAR_SERVICE_NAMES];
    
    if (unitPriceCents === undefined || !serviceName) {
      console.error('❌ Invalid service ID:', serviceId);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid service ID' 
      }, { status: 400 });
    }

    // Free services don't need invoices
    if (unitPriceCents === 0) {
      console.log('✅ Free service, no invoice needed');
      return NextResponse.json({
        success: true,
        invoiceId: null,
        paymentUrl: null,
        mode: 'free',
        message: 'No payment required for free services'
      });
    }

    console.log('💰 Creating invoice for:', { serviceName, unitPriceCents });

    // Create Wave invoice
    const result = await createWaveInvoice({
      account: 'primary',
      payload: {
        customer: { 
          email: customerEmail, 
          name: customerName 
        },
        currency: 'USD',
        items: [{
          name: serviceName,
          description: `Calendar booking: ${serviceName}${selectedDate && selectedTime ? ` on ${selectedDate} at ${selectedTime}` : ''}`,
          quantity: 1,
          unitPrice: unitPriceCents / 100
        }],
        memo: memo || `Calendar booking: ${serviceName}${selectedDate && selectedTime ? `\nScheduled: ${selectedDate} at ${selectedTime}` : ''}`,
        metadata: {
          source: 'mma-calendar-booking',
          serviceId,
          selectedDate,
          selectedTime
        }
      }
    });

    console.log('📊 Wave result:', result);

    if (!result.success) {
      console.error('❌ Wave invoice failed:', result.error);
      console.error('❌ Wave error details:', result.errorDetails);
      
      // Return fallback response
      return NextResponse.json({
        success: true,
        invoiceId: 'FALLBACK-' + Date.now(),
        paymentUrl: '',
        mode: 'fallback',
        error: result.error,
        errorDetails: result.errorDetails,
        totalAmount: unitPriceCents / 100,
        currency: 'USD'
      });
    }

    console.log('✅ Wave invoice created successfully');

    // Fire-and-forget: HubSpot contact upsert + creation note
    (async () => {
      try {
        const contactId = await upsertContact({
          email: customerEmail,
          firstname: customerName.split(' ')[0] || undefined,
          lastname: customerName.split(' ').slice(1).join(' ') || undefined,
          jobtitle: 'Calendar Booking',
        });
        
        const noteBody = [
          `Calendar booking invoice created in Wave`,
          `Service: ${serviceName}`,
          `Invoice ID: ${result.invoiceId}`,
          `Total: $${(unitPriceCents / 100).toFixed(2)} USD`,
          result.checkoutUrl ? `Pay link: ${result.checkoutUrl}` : '',
          selectedDate ? `Date: ${selectedDate}` : '',
          selectedTime ? `Time: ${selectedTime}` : '',
        ].filter(Boolean).join('\n');
        
        await createNoteForContact({ 
          contactId, 
          title: 'Calendar Booking Invoice Created', 
          body: noteBody 
        });
      } catch (err) {
        console.error('HubSpot note on calendar invoice creation failed:', err);
      }
    })();

    // Return response
    return NextResponse.json({
      success: true,
      invoiceId: result.invoiceId,
      paymentUrl: result.checkoutUrl,
      mode: result.mode,
      totalAmount: unitPriceCents / 100,
      currency: 'USD'
    });

  } catch (error: any) {
    console.error('❌ Calendar invoice error:', error);
    console.error('❌ Error stack:', error?.stack);
    
    // Return fallback instead of 500 error
    return NextResponse.json({ 
      success: true,
      invoiceId: 'ERROR-FALLBACK-' + Date.now(),
      paymentUrl: '',
      mode: 'fallback',
      error: error?.message || 'Server error',
      totalAmount: 0,
      currency: 'USD'
    });
  }
}
