import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createNoteForContact, ensureStaticList, addEmailToList } from '@/lib/hubspot';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('📅 Calendar booking request received');
    const body = await req.json();
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    const { 
      serviceId,
      name,
      email,
      phone,
      company,
      website,
      jobtitle,
      notes,
      selectedDate,
      selectedTime,
      invoiceId
    } = body || {};
    
    if (!serviceId || !name || !email || !selectedDate || !selectedTime) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ 
        success: false, 
        error: 'serviceId, name, email, selectedDate, and selectedTime are required' 
      }, { status: 400 });
    }

    // Service name mapping
    const serviceNames = {
      'discovery': 'Free Discovery Call',
      'strategy': 'Strategy Session',
      'consultation': 'Full Consultation',
      'follow-up': 'Follow-up Meeting',
    };
    
    const serviceName = serviceNames[serviceId as keyof typeof serviceNames] || serviceId;

    console.log('📝 Creating HubSpot contact and booking record...');

    // 1) Create/update HubSpot contact with all provided information
    let contactId: string;
    try {
      const [firstname, ...lastnameParts] = name.split(' ');
      const lastname = lastnameParts.join(' ');

      contactId = await upsertContact({
        email,
        firstname,
        lastname: lastname || undefined,
        company: company || undefined,
        phone: phone || undefined,
        website: website || undefined,
        jobtitle: jobtitle || 'Calendar Booking',
      });

      console.log('✅ HubSpot contact created/updated:', contactId);
    } catch (err) {
      console.error('❌ HubSpot contact creation failed:', err);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create contact record' 
      }, { status: 500 });
    }

    // 2) Add to Calendar Bookings list
    try {
      const listId = await ensureStaticList('Calendar Bookings');
      await addEmailToList(listId, email);
      console.log('✅ Added to Calendar Bookings list');
    } catch (err) {
      console.error('❌ Failed to add to list:', err);
      // Non-blocking
    }

    // 3) Create detailed note about the booking
    try {
      const noteBody = [
        `Calendar booking confirmed for ${serviceName}`,
        `Scheduled: ${selectedDate} at ${selectedTime}`,
        invoiceId ? `Invoice ID: ${invoiceId}` : '',
        phone ? `Phone: ${phone}` : '',
        company ? `Company: ${company}` : '',
        website ? `Website: ${website}` : '',
        jobtitle ? `Job Title: ${jobtitle}` : '',
        notes ? `Notes: ${notes}` : '',
        '',
        'Status: Booking confirmed - calendar invite will be sent',
      ].filter(Boolean).join('\n');

      await createNoteForContact({
        contactId,
        title: `Calendar Booking: ${serviceName}`,
        body: noteBody
      });

      console.log('✅ HubSpot note created');
    } catch (err) {
      console.error('❌ Failed to create note:', err);
      // Non-blocking
    }

    // 4) Create Calendly scheduling link (REQUIRED - this is how the actual appointment gets booked)
    let schedulingUrl: string | undefined;
    try {
      // Use absolute URL so this works on Vercel edge/node without relying on relative path resolution
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
      const calendlyEndpoint = `${baseUrl}/api/calendly/schedule`;
      const calRes = await fetch(calendlyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          serviceId, 
          name, 
          email
        }),
      });
      
      const calData = await calRes.json();
      if (calData?.schedulingUrl) {
        schedulingUrl = calData.schedulingUrl;
        console.log('✅ Calendly link created:', schedulingUrl);
      } else {
        throw new Error('Failed to create Calendly scheduling link');
      }
    } catch (err: any) {
      // If the fetch above threw because Calendly returned a non-2xx, try to surface that body
      try {
        // Attempt one retry to read body if available
        const debugRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')}/api/calendly/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceId, name, email })
        });
        const text = await debugRes.text();
        console.error('❌ Calendly schedule error:', debugRes.status, text);
        return NextResponse.json({ 
          success: false,
          error: `Calendly schedule error: ${debugRes.status} ${text}`
        }, { status: 500 });
      } catch (inner) {
        console.error('❌ Calendly link creation failed:', err);
        return NextResponse.json({ 
          success: false,
          error: 'Failed to create scheduling link. Please ensure Calendly env vars are set.'
        }, { status: 500 });
      }
    }

    // 5) Send confirmation email (if you have email service set up)
    // This would be where you'd send a calendar invite or confirmation email

    console.log('✅ Calendar booking completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Information saved! Please complete your booking via Calendly.',
      requiresCalendlyBooking: true,
      contactId,
      schedulingUrl,
      booking: {
        serviceId,
        serviceName,
        date: selectedDate,
        time: selectedTime,
        name,
        email,
        phone,
        company,
        invoiceId
      }
    });

  } catch (error: any) {
    console.error('❌ Calendar booking error:', error);
    console.error('❌ Error stack:', error?.stack);
    
    return NextResponse.json({ 
      success: false,
      error: error?.message || 'Booking failed. Please try again.'
    }, { status: 500 });
  }
}
