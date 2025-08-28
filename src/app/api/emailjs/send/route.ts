import { NextResponse } from 'next/server';
import { upsertContact, ensureStaticList, addEmailToList, createNoteForContact } from '@/lib/hubspot';

type EmailJsPayload = {
  service_id: string;
  template_id: string;
  user_id?: string; // public key
  accessToken?: string; // private access token (optional alternative)
  template_params: Record<string, string | number | boolean | null | undefined>;
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email,
      first_name,
      last_name,
      company,
      role,
      goals,
      phone,
      website,
      cta_url,
    } = (body || {}) as Record<string, any>;

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_hers22k';
    const TEMPLATE_ID_ADMIN = process.env.EMAILJS_TEMPLATE_ID_ADMIN || 'template_rjp7hxy';
    const TEMPLATE_ID_CLIENT = process.env.EMAILJS_TEMPLATE_ID_CLIENT || 'template_lzio9kd';
    const USER_ID = process.env.EMAILJS_PUBLIC_KEY || 'p4pF3OWvh-DXtae4c';
    const ACCESS_TOKEN = process.env.EMAILJS_PRIVATE_KEY; // optional

    if (!SERVICE_ID || (!TEMPLATE_ID_ADMIN && !TEMPLATE_ID_CLIENT) || (!USER_ID && !ACCESS_TOKEN)) {
      return NextResponse.json(
        { error: 'EmailJS env not configured' },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const baseParams = {
      email,
      first_name,
      last_name,
      company,
      role,
      goals,
      phone,
      website,
      cta_url: cta_url || 'https://www.marketingmousetrapagency.com/early-access',
    } as Record<string, string | number | boolean | null | undefined>;

    const sendOne = async (templateId: string) => {
      const payload: EmailJsPayload = {
        service_id: SERVICE_ID,
        template_id: templateId,
        template_params: baseParams,
      };
      if (USER_ID) payload.user_id = USER_ID;
      if (ACCESS_TOKEN) payload.accessToken = ACCESS_TOKEN;
      const resp = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Email send failed');
      }
    };

    if (TEMPLATE_ID_ADMIN) await sendOne(TEMPLATE_ID_ADMIN);
    if (TEMPLATE_ID_CLIENT) await sendOne(TEMPLATE_ID_CLIENT);

    // HubSpot CRM: upsert contact, add to Early Access list, attach note
    try {
      const contactId = await upsertContact({
        email,
        firstname: first_name,
        company,
        jobtitle: 'Early Access',
        website,
        phone,
      });
      const listId = await ensureStaticList('Early Access');
      await addEmailToList(listId, email);
      await createNoteForContact({
        contactId,
        title: 'Early Access Request',
        body: `Goals: ${goals || ''}`,
      });
    } catch (hsErr) {
      console.error('HubSpot early access upsert/list failed:', hsErr);
    }

    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Unexpected error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}


