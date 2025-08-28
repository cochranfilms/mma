import { NextRequest, NextResponse } from 'next/server';

const CALENDLY_API_BASE = 'https://api.calendly.com';

function getCalendlyHeaders() {
  const token = process.env.CALENDLY_API_TOKEN as string | undefined;
  if (!token) throw new Error('CALENDLY_API_TOKEN is not set');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as Record<string, string>;
}

function getEventTypeUrl(serviceId: string): string | null {
  const envMap: Record<string, string | undefined> = {
    discovery: process.env.CALENDLY_EVENT_DISCOVERY,
    strategy: process.env.CALENDLY_EVENT_STRATEGY,
    consultation: process.env.CALENDLY_EVENT_CONSULTATION,
    'follow-up': process.env.CALENDLY_EVENT_FOLLOW_UP,
  };
  const raw = envMap[serviceId];
  if (!raw) return null;
  // Accept UUID or full API URL
  if (raw.startsWith('http')) return raw;
  return `${CALENDLY_API_BASE}/event_types/${raw}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, name, email } = body as { serviceId: string; name?: string; email?: string };

    const owner = getEventTypeUrl(serviceId);
    if (!owner) {
      return NextResponse.json({ error: `Missing Calendly event type env for service '${serviceId}'` }, { status: 400 });
    }

    // Create a single-use scheduling link
    const res = await fetch(`${CALENDLY_API_BASE}/scheduling_links`, {
      method: 'POST',
      headers: getCalendlyHeaders(),
      body: JSON.stringify({
        max_event_count: 1,
        owner,
        owner_type: 'EventType',
        
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Calendly error: ${res.status} ${text}` }, { status: 500 });
    }
    const data = await res.json();
    let url: string = data?.resource?.booking_url || data?.resource?.scheduling_url || '';
    if (!url) {
      return NextResponse.json({ error: 'Calendly did not return a scheduling URL' }, { status: 500 });
    }

    // Prefill name/email via query params if provided
    const u = new URL(url);
    if (name) u.searchParams.set('name', name);
    if (email) u.searchParams.set('email', email);

    return NextResponse.json({ schedulingUrl: u.toString() });
  } catch (e: any) {
    console.error('Calendly schedule error', e);
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}


