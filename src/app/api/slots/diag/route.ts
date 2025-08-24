import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SlotsState = { month: string; remaining: number };

function corsHeaders(methods: string) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  } as Record<string, string>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get('repo') || process.env.GITHUB_REPO || 'cochranfilms/mma';
    const path = searchParams.get('path') || process.env.GITHUB_SLOTS_PATH || 'src/data/slots.json';
    const branch = searchParams.get('branch') || process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'mma-website/slots-diagnostics',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
    const resp = await fetch(url, { headers, cache: 'no-store' });
    const bodyText = await resp.text();

    let slots: SlotsState | null = null;
    let sha: string | undefined;
    try {
      const parsed = JSON.parse(bodyText);
      sha = parsed?.sha;
      if (parsed?.content) {
        const decoded = Buffer.from(parsed.content, 'base64').toString('utf-8');
        const j = JSON.parse(decoded);
        if (typeof j?.remaining === 'number' && typeof j?.month === 'string') {
          slots = { month: j.month, remaining: j.remaining };
        }
      }
    } catch {}

    return NextResponse.json(
      {
        env: {
          hasToken: Boolean(token),
          repo,
          path,
          branch,
        },
        githubGet: {
          ok: resp.ok,
          status: resp.status,
          statusText: resp.statusText,
          sha,
        },
        slots,
        note:
          'Write is not attempted here. If ok=false, token may be missing or lacks repo contents permission; or repo/path/branch are misconfigured.',
      },
      { status: 200, headers: corsHeaders('GET,OPTIONS') }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Diagnostics failed' },
      { status: 500, headers: corsHeaders('GET,OPTIONS') }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders('GET,OPTIONS') });
}


