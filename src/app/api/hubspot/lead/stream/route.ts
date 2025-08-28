import { NextRequest, NextResponse } from 'next/server';
import { findContactByEmail, getDealsForContact, getNotesForContact } from '@/lib/hubspot';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';
  if (!email) {
    return new NextResponse('Missing email', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      async function pushOnce() {
        try {
          if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ configured: false })}\n\n`));
            return;
          }
          const contact = await findContactByEmail(email).catch(() => null);
          if (!contact) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ configured: true, found: false })}\n\n`));
            return;
          }
          const [deals, notes] = await Promise.all([
            getDealsForContact(contact.id).catch(() => []),
            getNotesForContact(contact.id).catch(() => []),
          ]);
          const payload = { configured: true, found: true, data: { deals, notes } };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (e) {
          controller.enqueue(encoder.encode(`event: error\n` + `data: ${JSON.stringify({ message: 'stream error' })}\n\n`));
        }
      }

      await pushOnce();
      const interval = setInterval(pushOnce, 15000);
      const ka = setInterval(() => controller.enqueue(encoder.encode(`:\n\n`)), 10000);
      (controller as any)._cleanup = () => { clearInterval(interval); clearInterval(ka); };
    },
    cancel() {
      const cleanup = (this as any)._cleanup;
      if (cleanup) cleanup();
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}


