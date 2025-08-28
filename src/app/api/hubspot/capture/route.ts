import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createNoteForContact, ensureStaticList, addEmailToList } from '@/lib/hubspot';

const HUBSPOT_API_BASE = 'https://api.hubapi.com';
function getAuthHeaders() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN as string | undefined;
  if (!token) throw new Error('HUBSPOT_PRIVATE_APP_TOKEN is not set');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  } as Record<string, string>;
}

type CaptureBody = {
  email: string;
  name?: string;
  listName?: string;
  event: string; // e.g., 'roi_calculated', 'service_quiz_completed'
  properties?: Record<string, any>;
  noteTitle?: string;
  noteBody?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CaptureBody;
    const { email, name, listName, event, properties, noteTitle, noteBody } = body;

    if (!email || !event) {
      return NextResponse.json({ error: 'email and event are required' }, { status: 400 });
    }

    const firstname = name?.split(' ')?.[0];
    const lastname = name?.split(' ')?.slice(1).join(' ');

    // Upsert contact
    const contactId = await upsertContact({ email, firstname, lastname, jobtitle: 'Website Tool Lead' });

    // If quiz properties present, update contact fields for reporting
    if (properties && event === 'service_quiz_completed') {
      try {
        const { answers, topMatches } = properties;
        // Minimal patch to contacts: use legacy properties if already created
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            properties: {
              quiz_last_completed: new Date().toISOString(),
              quiz_top_matches: Array.isArray(topMatches) ? topMatches.map((m: any) => (m.id || m)).join(',') : '',
              quiz_answers_json: JSON.stringify(answers || {}),
              quiz_goal: answers?.['business-goal'],
              quiz_industry: answers?.industry,
              quiz_budget_timeline: answers?.['budget-timeline'],
              quiz_current_challenge: answers?.['current-challenge'],
            },
          }),
        });
      } catch (e) {
        // Non-blocking
        console.error('Quiz property update failed', e);
      }
    }

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

    // Create a note summarizing the event (allow custom formatting)
    const title = noteTitle ?? `Tool Event: ${event}`;
    const bodyText = noteBody ?? `Event: ${event}\n\nProperties (JSON):\n${JSON.stringify(properties ?? {}, null, 2)}`;
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


