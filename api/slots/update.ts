import type { VercelRequest, VercelResponse } from '@vercel/node';

type SlotsState = { month: string; remaining: number };

const DEFAULT_STATE: SlotsState = { month: '2025-09', remaining: 5 };

async function getMeta(token: string, repo: string, path: string, branch: string) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'mma-website/root-api-update',
    },
  });
  if (!resp.ok) return null;
  return (await resp.json()) as any;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || 'cochranfilms/mma';
    const path = process.env.GITHUB_SLOTS_PATH || 'src/data/slots.json';
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!token) return res.status(400).json({ error: 'GitHub token not configured' });

    const action = (req.body as any)?.action || 'decrement';
    const setTo: number | undefined = typeof (req.body as any)?.value === 'number' ? (req.body as any).value : undefined;
    const month: string = (req.body as any)?.month || DEFAULT_STATE.month;

    let current: SlotsState = DEFAULT_STATE;
    const meta = await getMeta(token, repo, path, branch);
    let sha: string | undefined = meta?.sha;
    if (meta?.content) {
      try {
        const decoded = Buffer.from(meta.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);
        if (typeof parsed?.remaining === 'number' && typeof parsed?.month === 'string') {
          current = { month: parsed.month, remaining: parsed.remaining };
        }
      } catch {}
    }

    let remaining = current.remaining;
    if (action === 'decrement') remaining = Math.max(0, remaining - 1);
    if (action === 'set' && typeof setTo === 'number') remaining = Math.max(0, setTo);
    const next: SlotsState = { month, remaining };

    const putUrl = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;
    const contentB64 = Buffer.from(JSON.stringify(next, null, 2)).toString('base64');
    const putResp = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'mma-website/root-api-update',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `chore(slots): ${action === 'decrement' ? 'decrement' : 'set'} to ${remaining} for ${month}`,
        content: contentB64,
        sha,
        branch,
      }),
    });
    if (!putResp.ok) {
      const txt = await putResp.text();
      return res.status(500).json({ error: 'GitHub update failed', detail: txt });
    }

    return res.status(200).json(next);
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}


