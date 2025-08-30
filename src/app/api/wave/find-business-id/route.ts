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

    // Try the correct GraphQL connection structure for businesses
    const queries = [
      // Approach 1: Correct businesses query with edges/node structure
      { 
        name: 'Businesses with edges',
        query: `query { 
          businesses { 
            edges {
              node {
                id 
                name 
                isActive
              }
            }
          } 
        }`
      },
      // Approach 2: Businesses with pagination
      { 
        name: 'Businesses with page',
        query: `query { 
          businesses(page: 1) { 
            edges {
              node {
                id 
                name 
                isActive
              }
            }
          } 
        }`
      },
      // Approach 3: Try to get business by the ID we have (to validate it)
      { 
        name: 'Validate current business ID',
        query: `query GetBusiness($businessId: ID!) { 
          business(id: $businessId) { 
            id 
            name 
            isActive
            createdAt
            modifiedAt
          } 
        }`,
        variables: { businessId: cfg.businessId }
      },
      // Approach 4: Try different business ID formats
      { 
        name: 'Try base64 encoded business ID',
        query: `query GetBusiness($businessId: ID!) { 
          business(id: $businessId) { 
            id 
            name 
            isActive
          } 
        }`,
        variables: { businessId: Buffer.from(cfg.businessId).toString('base64') }
      }
    ];

    const results = [];
    
    for (const queryObj of queries) {
      const { name, query, variables } = queryObj;
      try {
        const data = await fetchWave(apiBase, apiKey, query, variables);
        results.push({ 
          approach: name, 
          success: true, 
          data,
          // Extract business info from different possible structures
          businesses: data?.businesses?.edges?.map((e: any) => e?.node) || (data?.business ? [data.business] : []),
          user: data?.user || null
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

    // Find the first successful result with business data
    const successfulResult = results.find(r => r.success && (r.businesses?.length > 0 || r.user?.defaultBusiness));
    
    let recommendedBusinessId = null;
    if (successfulResult) {
      if (successfulResult.businesses?.length > 0) {
        recommendedBusinessId = successfulResult.businesses[0].id;
      } else if (successfulResult.user?.defaultBusiness) {
        recommendedBusinessId = successfulResult.user.defaultBusiness.id;
      }
    }

    return NextResponse.json({ 
      success: true, 
      apiBase,
      currentBusinessId: cfg.businessId,
      recommendedBusinessId,
      results,
      note: recommendedBusinessId 
        ? `Found your business ID: ${recommendedBusinessId}. Update WAVE_BUSINESS_ID in Vercel to this value.`
        : "Could not find a valid business ID. Check the results above for errors."
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown', details: err?.details }, { status: 500 });
  }
}