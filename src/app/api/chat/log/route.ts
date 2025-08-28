import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, createNoteForContact, ensureStaticList, addEmailToList } from '@/lib/hubspot';

export async function POST(req: NextRequest) {
  try {
    const { email, transcript } = await req.json();
    if (!email || !transcript) {
      return NextResponse.json({ error: 'email and transcript required' }, { status: 400 });
    }

    const contactId = await upsertContact({ email, jobtitle: 'Live Chat' });
    const listId = await ensureStaticList('Live Chat Conversations');
    await addEmailToList(listId, email);
    await createNoteForContact({
      contactId,
      title: 'Live Chat Transcript',
      body: String(transcript).slice(0, 5000),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'unknown' }, { status: 500 });
  }
}


