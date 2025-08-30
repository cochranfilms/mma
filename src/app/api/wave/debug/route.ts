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

    // Test the current business ID by trying to create a customer
    const testCustomerQuery = `mutation CreateCustomer($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        didSucceed
        inputErrors { message }
        customer { id }
      }
    }`;

    const testCustomerVariables = {
      input: {
        businessId: cfg.businessId,
        name: "Test Customer - DELETE ME",
        email: "test@example.com",
      },
    };

    let customerTestResult = null;
    try {
      const customerData = await fetchWave(apiBase, apiKey, testCustomerQuery, testCustomerVariables);
      customerTestResult = {
        success: true,
        data: customerData,
        message: "Business ID is valid - customer creation succeeded"
      };
    } catch (err: any) {
      customerTestResult = {
        success: false,
        error: err?.message,
        details: err?.details,
        message: "Business ID might be invalid - customer creation failed"
      };
    }

    // Test income account query
    const incomeAccountQuery = `query Accounts($businessId: ID!, $page: Int!) {
      business(id: $businessId) {
        id
        accounts(types: [INCOME], page: $page) {
          edges { node { id name type } }
        }
      }
    }`;

    let incomeAccountResult = null;
    try {
      const accountData = await fetchWave(apiBase, apiKey, incomeAccountQuery, { businessId: cfg.businessId, page: 1 });
      incomeAccountResult = {
        success: true,
        data: accountData,
        accounts: accountData?.business?.accounts?.edges?.map((e: any) => e?.node) || [],
        message: "Income accounts found"
      };
    } catch (err: any) {
      incomeAccountResult = {
        success: false,
        error: err?.message,
        details: err?.details,
        message: "Could not fetch income accounts"
      };
    }

    return NextResponse.json({ 
      success: true, 
      apiBase,
      currentBusinessId: cfg.businessId,
      tests: {
        customerCreation: customerTestResult,
        incomeAccounts: incomeAccountResult
      },
      instructions: {
        findBusinessId: "Go to Wave Dashboard → Settings → API Access → Business ID should be visible in the URL or settings",
        updateVercel: "Update WAVE_BUSINESS_ID in Vercel environment variables",
        testAgain: "Call this endpoint again after updating the business ID"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown', details: err?.details }, { status: 500 });
  }
}
