import { NextRequest, NextResponse } from 'next/server';
import { getWaveConfig } from '@/lib/wave';

async function fetchWave(apiBase: string, apiKey: string, query: string, variables?: Record<string, any>) {
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors) {
    const err = new Error('Wave GraphQL error');
    (err as any).details = json;
    throw err;
  }
  return json.data;
}

export async function GET(_req: NextRequest) {
  try {
    const cfg = getWaveConfig() as any;
    const apiKey: string = cfg.apiKey;
    const apiBase: string = cfg.apiBase || 'https://gql.waveapps.com/graphql/public';
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'WAVE_API_KEY is not set' }, { status: 400 });
    }

    // Wave uses PaginationInput with page and pageSize as scalars
    const q = `query ListBusinesses($page: Int!) {
      user {
        id
        businesses(page: $page) {
          edges { node { id name isActive } }
        }
      }
    }`;
    const data = await fetchWave(apiBase, apiKey, q, { page: 1 });
    const list = (data?.user?.businesses?.edges || []).map((e: any) => ({ id: e?.node?.id, name: e?.node?.name, isActive: e?.node?.isActive }));
    return NextResponse.json({ success: true, apiBase, businesses: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown', details: err?.details }, { status: 500 });
  }
}


