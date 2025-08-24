import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SlotsState = { month: string; remaining: number };

const DEFAULT_STATE: SlotsState = { month: '2025-09', remaining: 5 };

async function getFileMeta(token: string, repo: string, path: string, branch: string) {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'mma-website/slots-update',
    },
    cache: 'no-store',
  });
  if (!resp.ok) return null;
  return (await resp.json()) as any;
}

export async function POST(request: Request) {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || 'cochranfilms/mma';
    const path = process.env.GITHUB_SLOTS_PATH || 'src/data/slots.json';
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!token) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const action: 'decrement' | 'set' = body?.action || 'decrement';
    const setTo: number | undefined = typeof body?.value === 'number' ? body.value : undefined;
    const month: string = body?.month || DEFAULT_STATE.month;

    // Read current
    let current: SlotsState = DEFAULT_STATE;
    const meta = await getFileMeta(token, repo, path, branch);
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

    // Compute new value
    let remaining = current.remaining;
    if (action === 'decrement') remaining = Math.max(0, remaining - 1);
    if (action === 'set' && typeof setTo === 'number') remaining = Math.max(0, setTo);
    const next: SlotsState = { month, remaining };

    // Write back to GitHub
    const putUrl = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}`;
    const contentB64 = Buffer.from(JSON.stringify(next, null, 2)).toString('base64');
    const putResp = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'mma-website/slots-update',
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
      return NextResponse.json({ error: 'GitHub update failed', detail: txt }, { status: 500 });
    }

    return NextResponse.json(next, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


