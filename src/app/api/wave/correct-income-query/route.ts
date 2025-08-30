import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing correct Wave income account query format...');
    
    const apiKey = process.env.WAVE_API_KEY;
    const businessId = process.env.WAVE_BUSINESS_ID;
    
    if (!apiKey || !businessId) {
      return NextResponse.json({
        success: false,
        error: 'Missing Wave API key or business ID'
      });
    }

    // Use the correct query format from Wave documentation
    const query = `query ($businessId: ID!) { 
      business(id: $businessId) { 
        id 
        name
        accounts(types: [INCOME]) { 
          edges { 
            node { 
              id 
              name 
              type
            } 
          } 
        } 
      } 
    }`;

    const response = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ 
        query, 
        variables: { businessId }
      }),
      cache: 'no-store',
    });

    const result = await response.json();
    
    if (!response.ok || result.errors) {
      return NextResponse.json({
        success: false,
        error: 'Wave API error',
        details: result.errors || result,
        status: response.status
      });
    }

    const business = result.data?.business;
    const accounts = business?.accounts?.edges?.map((e: any) => e.node) || [];
    
    // Find the best income account (usually "Sales" or similar)
    const salesAccount = accounts.find((acc: any) => 
      acc.name.toLowerCase().includes('sales') || 
      acc.name.toLowerCase().includes('revenue') ||
      acc.name.toLowerCase().includes('income')
    );
    
    const recommendedAccount = salesAccount || accounts[0];

    return NextResponse.json({
      success: true,
      message: 'Successfully found income accounts!',
      business: {
        id: business?.id,
        name: business?.name
      },
      incomeAccounts: accounts,
      recommendedIncomeAccount: recommendedAccount,
      currentIncomeAccountId: process.env.WAVE_INCOME_ACCOUNT_ID,
      recommendation: recommendedAccount 
        ? `Use this income account ID: ${recommendedAccount.id} (${recommendedAccount.name})`
        : 'No income accounts found',
      instructions: recommendedAccount ? [
        `1. Update WAVE_INCOME_ACCOUNT_ID to: ${recommendedAccount.id}`,
        '2. Redeploy your application',
        '3. Test invoice creation again'
      ] : [
        '1. Create an income account in your Wave dashboard',
        '2. Run this endpoint again to get the account ID'
      ]
    });

  } catch (error: any) {
    console.error('🔍 Correct income query error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to query income accounts',
      details: error?.details || null
    });
  }
}
