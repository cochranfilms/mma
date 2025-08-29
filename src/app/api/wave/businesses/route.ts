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

    // Try different approaches to get businesses
    const queries = [
      // Approach 1: Simple businesses query (no pagination)
      { 
        name: 'Simple businesses',
        query: `query { businesses { edges { node { id name isActive } } } }`
      },
      // Approach 2: Businesses with first parameter
      { 
        name: 'Businesses with first',
        query: `query { businesses(first: 10) { edges { node { id name isActive } } } }`
      },
      // Approach 3: Just get pageInfo to test connection
      { 
        name: 'Businesses pageInfo only',
        query: `query { businesses { pageInfo { hasNextPage hasPreviousPage } } }`
      }
    ];

    const results = [];
    
    for (const { name, query } of queries) {
      try {
        const data = await fetchWave(apiBase, apiKey, query);
        results.push({ 
          approach: name, 
          success: true, 
          data,
          businesses: data?.businesses?.edges?.map((e: any) => e?.node) || data?.businesses || []
        });
      } catch (err: any) {
        results.push({ 
          approach: name, 
          success: false, 
          error: err?.message,
          details: err?.details 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      apiBase,
      results,
      note: "Check each approach to see which one returns your business IDs"
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown', details: err?.details }, { status: 500 });
  }
}
