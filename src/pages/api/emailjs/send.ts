import type { NextApiRequest, NextApiResponse } from 'next';

type EmailJsPayload = {
  service_id: string;
  template_id: string;
  user_id?: string; // public key
  accessToken?: string; // private access token (optional alternative)
  template_params: Record<string, string | number | boolean | null | undefined>;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
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
    } = (req.body || {}) as Record<string, any>;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Missing email' });
    }

    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_t11yvru';
    const TEMPLATE_ID_ADMIN = process.env.EMAILJS_TEMPLATE_ID_ADMIN || 'template_rjp7hxy';
    const TEMPLATE_ID_CLIENT = process.env.EMAILJS_TEMPLATE_ID_CLIENT || 'template_lzio9kd';
    const USER_ID = process.env.EMAILJS_PUBLIC_KEY || 'p4pF3OWvh-DXtae4c';
    const ACCESS_TOKEN = process.env.EMAILJS_PRIVATE_KEY; // optional

    if (!SERVICE_ID || (!TEMPLATE_ID_ADMIN && !TEMPLATE_ID_CLIENT) || (!USER_ID && !ACCESS_TOKEN)) {
      return res.status(500).json({ error: 'EmailJS env not configured' });
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
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || 'Email send failed');
      }
    };

    if (TEMPLATE_ID_ADMIN) await sendOne(TEMPLATE_ID_ADMIN);
    if (TEMPLATE_ID_CLIENT) await sendOne(TEMPLATE_ID_CLIENT);

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}


