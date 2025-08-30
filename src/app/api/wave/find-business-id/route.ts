import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Finding available Wave businesses...');
    
    const apiKey = process.env.WAVE_API_KEY || process.env.WAVE_API_KEY_PRIMARY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Wave API key found in environment variables',
        instructions: 'Set WAVE_API_KEY or WAVE_API_KEY_PRIMARY in your Vercel environment variables'
      });
    }

    // Query to get all businesses accessible by this API key
    const query = `
      query GetBusinesses {
        user {
          id
          businesses(page: 1, pageSize: 50) {
            edges {
              node {
                id
                name
                isClassicAccounting
                isPersonal
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    const result = await response.json();
    
    if (!response.ok || result.errors) {
      console.error('❌ Wave API error:', result);
      return NextResponse.json({
        success: false,
        error: 'Wave API error',
        details: result.errors || result,
        instructions: 'Check if your Wave API key is valid and has proper permissions'
      });
    }

    const user = result.data?.user;
    const businesses = user?.businesses?.edges?.map((edge: any) => edge.node) || [];

    console.log('✅ Found businesses:', businesses);

    return NextResponse.json({
      success: true,
      user: {
        id: user?.id,
        businesses: businesses.map((biz: any) => ({
          id: biz.id,
          name: biz.name,
          isClassicAccounting: biz.isClassicAccounting,
          isPersonal: biz.isPersonal
        }))
      },
      instructions: {
        step1: 'Copy the business ID from the business you want to use',
        step2: 'Set WAVE_BUSINESS_ID in your Vercel environment variables',
        step3: 'Redeploy your application or restart your development server',
        step4: 'Test invoice creation again'
      },
      currentConfig: {
        hasApiKey: !!apiKey,
        apiKeyPreview: apiKey ? `${apiKey.slice(0, 8)}...` : 'Not set',
        currentBusinessId: process.env.WAVE_BUSINESS_ID || 'Not set'
      }
    });

  } catch (error: any) {
    console.error('🔍 Business lookup error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to lookup businesses',
      details: error?.details || null,
      instructions: 'Check your Wave API key and network connection'
    });
  }
}