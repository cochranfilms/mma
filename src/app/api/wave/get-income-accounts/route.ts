import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Finding your Wave income accounts...');
    
    const apiKey = process.env.WAVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Wave API key found'
      });
    }

    // Use the correct Marketing Mousetrap Agency business ID
    const marketingMousetrapBusinessId = 'QnVzaW5lc3M6Y2M4YjZiNjUtMzg0Yy00YmNhLWI3ZjAtNzMzMzMzZWYwMDE0';
    
    // Query to get income accounts for the business
    const query = `
      query GetIncomeAccounts($businessId: ID!, $page: Int!) {
        business(id: $businessId) {
          id
          name
          accounts(types: [INCOME], page: $page, pageSize: 50) {
            edges {
              node {
                id
                name
                type
                subtype
                normalBalanceType
                isArchived
                description
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
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
      body: JSON.stringify({ 
        query, 
        variables: { 
          businessId: marketingMousetrapBusinessId, 
          page: 1 
        }
      }),
      cache: 'no-store',
    });

    const result = await response.json();
    
    if (!response.ok || result.errors) {
      return NextResponse.json({
        success: false,
        error: 'Wave API error',
        details: result.errors || result,
        businessId: marketingMousetrapBusinessId
      });
    }

    const business = result.data?.business;
    const accounts = business?.accounts?.edges?.map((edge: any) => edge.node) || [];
    
    // Find the best income account (usually "Sales" or similar)
    const salesAccount = accounts.find((acc: any) => 
      acc.name.toLowerCase().includes('sales') || 
      acc.name.toLowerCase().includes('revenue') ||
      acc.name.toLowerCase().includes('income')
    );
    
    const recommendedAccount = salesAccount || accounts[0];

    return NextResponse.json({
      success: true,
      message: 'Found your income accounts!',
      business: {
        id: business?.id,
        name: business?.name
      },
      incomeAccounts: accounts,
      recommendedAccount: recommendedAccount,
      currentIncomeAccountId: process.env.WAVE_INCOME_ACCOUNT_ID,
      recommendation: recommendedAccount 
        ? `Use this income account ID: ${recommendedAccount.id} (${recommendedAccount.name})`
        : 'No income accounts found',
      instructions: [
        '1. Copy the recommended income account ID from above',
        '2. Update WAVE_INCOME_ACCOUNT_ID in your Vercel environment variables',
        '3. Also update WAVE_BUSINESS_ID to: ' + marketingMousetrapBusinessId,
        '4. Redeploy your application',
        '5. Test invoice creation again'
      ],
      allAccountDetails: accounts.map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        type: acc.type,
        subtype: acc.subtype,
        isArchived: acc.isArchived,
        description: acc.description
      }))
    });

  } catch (error: any) {
    console.error('🔍 Income account lookup error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to lookup income accounts',
      details: error?.details || null
    });
  }
}
