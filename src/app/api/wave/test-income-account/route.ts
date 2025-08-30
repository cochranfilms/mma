import { NextRequest, NextResponse } from 'next/server';

// Copy the exact working functions from wave.ts
async function waveFetch(apiKey: string, query: string, variables?: Record<string, any>) {
  const apiBase = 'https://gql.waveapps.com/graphql/public';
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

async function ensureIncomeAccountId(apiKey: string, businessId: string): Promise<string> {
  const q = `query Accounts($businessId: ID!, $page: Int!) {
    business(id: $businessId) {
      id
      accounts(types: [INCOME], page: $page) {
        edges { node { id name type } }
      }
    }
  }`;
  const data = await waveFetch(apiKey, q, { businessId, page: 1 });
  const edges = data?.business?.accounts?.edges || [];
  const acct = edges.find((e: any) => e?.node?.name?.toLowerCase().includes('sales'))?.node || edges[0]?.node;
  if (!acct?.id) {
    throw new Error('No INCOME account found in Wave');
  }
  return acct.id as string;
}

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing income account lookup with exact working code...');
    
    const apiKey = process.env.WAVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Wave API key found'
      });
    }

    // Use the correct Marketing Mousetrap Agency business ID
    const marketingMousetrapBusinessId = 'QnVzaW5lc3M6Y2M4YjZiNjUtMzg0Yy00YmNhLWI3ZjAtNzMzMzMzZWYwMDE0';
    
    // Test with the exact same function that works in wave.ts
    const incomeAccountId = await ensureIncomeAccountId(apiKey, marketingMousetrapBusinessId);
    
    // Also get all accounts to show options
    const q = `query Accounts($businessId: ID!, $page: Int!) {
      business(id: $businessId) {
        id
        name
        accounts(types: [INCOME], page: $page) {
          edges { node { id name type } }
        }
      }
    }`;
    const data = await waveFetch(apiKey, q, { businessId: marketingMousetrapBusinessId, page: 1 });
    const edges = data?.business?.accounts?.edges || [];
    const allAccounts = edges.map((e: any) => e?.node);

    return NextResponse.json({
      success: true,
      message: 'Found your income account!',
      business: {
        id: data?.business?.id,
        name: data?.business?.name
      },
      recommendedIncomeAccountId: incomeAccountId,
      currentIncomeAccountId: process.env.WAVE_INCOME_ACCOUNT_ID,
      allIncomeAccounts: allAccounts,
      instructions: [
        `1. Update WAVE_INCOME_ACCOUNT_ID to: ${incomeAccountId}`,
        `2. Update WAVE_BUSINESS_ID to: ${marketingMousetrapBusinessId}`,
        '3. Redeploy your application',
        '4. Test invoice creation again'
      ]
    });

  } catch (error: any) {
    console.error('🔍 Income account test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to test income account',
      details: error?.details || null,
      hint: error?.details?.errors?.[0]?.extensions?.code === 'NOT_FOUND'
        ? 'Business ID not found - make sure to update WAVE_BUSINESS_ID first'
        : 'Check the error details above'
    });
  }
}
