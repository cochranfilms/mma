import { kvGetSlots } from '../../../../lib/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SlotsState = { month: string; remaining: number };

const DEFAULT_STATE: SlotsState = { month: '2025-09', remaining: 5 };

async function fetchFromGitHub(): Promise<SlotsState | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'cochranfilms/mma';
  const path = process.env.GITHUB_SLOTS_PATH || 'src/data/slots.json';
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (!token) return null;
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'mma-website/slots-get',
    },
    cache: 'no-store',
  });
  if (!resp.ok) return null;
  const json = (await resp.json()) as any;
  if (!json?.content) return null;
  const decoded = Buffer.from(json.content, 'base64').toString('utf-8');
  try {
    const parsed = JSON.parse(decoded);
    if (typeof parsed?.remaining === 'number' && typeof parsed?.month === 'string') {
      return { month: parsed.month, remaining: parsed.remaining };
    }
  } catch {}
  return null;
}

export async function GET() {
  try {
    // Prefer KV if configured and has a value
    const kv = await kvGetSlots();
    const gh = kv ?? (await fetchFromGitHub());
    return NextResponse.json(gh ?? DEFAULT_STATE, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (err) {
    return NextResponse.json(DEFAULT_STATE, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}


