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

export async function GET(_req: NextRequest) {
  try {
    // 1) Who am I
    const meRes = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: getCalendlyHeaders(),
      cache: 'no-store',
    });
    if (!meRes.ok) {
      const text = await meRes.text();
      return NextResponse.json({ error: `Calendly /users/me failed: ${meRes.status} ${text}` }, { status: 500 });
    }
    const me = await meRes.json();
    const userUri = me?.resource?.uri as string | undefined;
    if (!userUri) {
      return NextResponse.json({ error: 'Could not determine Calendly user URI' }, { status: 500 });
    }

    // 2) List event types for this user
    const etRes = await fetch(`${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}`, {
      headers: getCalendlyHeaders(),
      cache: 'no-store',
    });
    if (!etRes.ok) {
      const text = await etRes.text();
      return NextResponse.json({ error: `Calendly event_types failed: ${etRes.status} ${text}` }, { status: 500 });
    }
    const data = await etRes.json();
    const items = (data?.collection || []).map((it: any) => ({
      name: it?.name,
      slug: it?.slug,
      uri: it?.uri,              // full API URL
      id: (it?.uri || '').split('/').pop(), // UUID
      scheduling_url: it?.scheduling_url,
      active: it?.active,
      kind: it?.kind,
      duration: it?.duration,
    }));

    return NextResponse.json({ user: userUri, event_types: items });
  } catch (e: any) {
    console.error('Calendly event-types error', e);
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}


