import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createNoteForContact, ensureStaticList, addEmailToList } from '@/lib/hubspot';

type CaptureBody = {
  email: string;
  name?: string;
  listName?: string;
  event: string; // e.g., 'roi_calculated', 'service_quiz_completed'
  properties?: Record<string, any>;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CaptureBody;
    const { email, name, listName, event, properties } = body;

    if (!email || !event) {
      return NextResponse.json({ error: 'email and event are required' }, { status: 400 });
    }

    const firstname = name?.split(' ')?.[0];
    const lastname = name?.split(' ')?.slice(1).join(' ');

    // Upsert contact
    const contactId = await upsertContact({ email, firstname, lastname, jobtitle: 'Website Tool Lead' });

    // Optional: add to list
    if (listName) {
      try {
        const listId = await ensureStaticList(listName);
        await addEmailToList(listId, email);
      } catch (e) {
        // Non-blocking
        console.error('List add failed', e);
      }
    }

    // Create a note summarizing the event
    const title = `Tool Event: ${event}`;
    const bodyText = `Event: ${event}\nProperties: ${JSON.stringify(properties ?? {}, null, 2)}`;
    try {
      await createNoteForContact({ contactId, title, body: bodyText });
    } catch (e) {
      // Non-blocking
      console.error('Note create failed', e);
    }

    return NextResponse.json({ ok: true, contactId });
  } catch (err) {
    console.error('Capture error', err);
    return NextResponse.json({ error: 'capture_failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}


