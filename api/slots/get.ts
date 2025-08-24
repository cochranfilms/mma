import type { VercelRequest, VercelResponse } from '@vercel/node';

type SlotsState = { month: string; remaining: number };

const DEFAULT_STATE: SlotsState = { month: '2025-09', remaining: 5 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || 'cochranfilms/mma';
    const path = process.env.GITHUB_SLOTS_PATH || 'src/data/slots.json';
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!token) return res.status(200).json(DEFAULT_STATE);
    const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'mma-website/root-api-get',
      },
    });
    if (!resp.ok) return res.status(200).json(DEFAULT_STATE);
    const json: any = await resp.json();
    if (!json?.content) return res.status(200).json(DEFAULT_STATE);
    const decoded = Buffer.from(json.content, 'base64').toString('utf-8');
    const parsed = JSON.parse(decoded);
    if (typeof parsed?.remaining === 'number' && typeof parsed?.month === 'string') {
      return res.status(200).json({ month: parsed.month, remaining: parsed.remaining });
    }
    return res.status(200).json(DEFAULT_STATE);
  } catch (_err) {
    return res.status(200).json(DEFAULT_STATE);
  }
}


