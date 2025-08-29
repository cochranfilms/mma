import { NextRequest, NextResponse } from 'next/server';
import { getWaveConfig } from '@/lib/wave';

async function testBusinessId(apiKey: string, businessId: string) {
  try {
    const res = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `query TestBusiness($businessId: ID!) {
          business(id: $businessId) {
            id
            name
            isActive
          }
        }`,
        variables: { businessId }
      }),
      cache: 'no-store',
    });
    
    const json = await res.json();
    
    if (json.errors) {
      return { success: false, error: json.errors[0]?.message, details: json.errors };
    }
    
    if (json.data?.business) {
      return { success: true, business: json.data.business };
    }
    
    return { success: false, error: 'No business found' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function GET(_req: NextRequest) {
  try {
    const cfg = getWaveConfig();
    const apiKey = cfg.apiKey;
    
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'WAVE_API_KEY is not set' }, { status: 400 });
    }

    // From your URL: https://my.waveapps.com/cc8b6b65-384c-4bca-b7f0-733333ef0014/businesses/edit/22088572/
    const numericId = '22088572';
    
    const testCases = [
      { name: 'Numeric ID', id: numericId },
      { name: 'Base64 Business prefix', id: `QnVzaW5lc3M6${btoa(numericId)}` },
      { name: 'Simple Base64', id: btoa(numericId) },
      { name: 'Business: prefix', id: `Business:${numericId}` },
      { name: 'UUID from URL', id: 'cc8b6b65-384c-4bca-b7f0-733333ef0014' },
      { name: 'Base64 UUID', id: btoa('cc8b6b65-384c-4bca-b7f0-733333ef0014') },
    ];

    const results = [];
    
    for (const testCase of testCases) {
      console.log(`Testing business ID: ${testCase.name} = ${testCase.id}`);
      const result = await testBusinessId(apiKey, testCase.id);
      results.push({
        format: testCase.name,
        businessId: testCase.id,
        ...result
      });
      
      if (result.success) {
        console.log(`✅ Found working business ID: ${testCase.id}`);
        break; // Stop on first success
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tested various business ID formats',
      results,
      recommendation: results.find(r => r.success)?.businessId || 'None found - check Wave dashboard'
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}
