import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing working income account query...');
    
    const apiKey = process.env.WAVE_API_KEY;
    const businessId = process.env.WAVE_BUSINESS_ID; // Should be Marketing Mousetrap Agency now
    
    if (!apiKey || !businessId) {
      return NextResponse.json({
        success: false,
        error: 'Missing Wave API key or business ID'
      });
    }

    // Try different query formats to find one that works
    const queries = [
      // Query 1: Simple accounts without types filter
      {
        name: 'All accounts',
        query: `query GetAccounts($businessId: ID!) {
          business(id: $businessId) {
            id
            name
            accounts(page: 1) {
              edges {
                node {
                  id
                  name
                  type
                }
              }
            }
          }
        }`
      },
      // Query 2: Try with pageSize
      {
        name: 'Accounts with pageSize',
        query: `query GetAccounts($businessId: ID!) {
          business(id: $businessId) {
            id
            name
            accounts(page: 1, pageSize: 50) {
              edges {
                node {
                  id
                  name
                  type
                }
              }
            }
          }
        }`
      },
      // Query 3: Try without pagination
      {
        name: 'Accounts without pagination',
        query: `query GetAccounts($businessId: ID!) {
          business(id: $businessId) {
            id
            name
            accounts {
              edges {
                node {
                  id
                  name
                  type
                }
              }
            }
          }
        }`
      }
    ];

    const results = [];

    for (const { name, query } of queries) {
      try {
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
        
        if (response.ok && !result.errors) {
          // Success! Extract income accounts
          const accounts = result.data?.business?.accounts?.edges?.map((e: any) => e.node) || [];
          const incomeAccounts = accounts.filter((acc: any) => acc.type === 'INCOME');
          const salesAccount = incomeAccounts.find((acc: any) => 
            acc.name.toLowerCase().includes('sales') || 
            acc.name.toLowerCase().includes('revenue') ||
            acc.name.toLowerCase().includes('income')
          );
          
          return NextResponse.json({
            success: true,
            message: `Found accounts using: ${name}`,
            business: result.data.business,
            allAccounts: accounts,
            incomeAccounts: incomeAccounts,
            recommendedIncomeAccount: salesAccount || incomeAccounts[0],
            currentIncomeAccountId: process.env.WAVE_INCOME_ACCOUNT_ID,
            instructions: salesAccount || incomeAccounts[0] ? [
              `Update WAVE_INCOME_ACCOUNT_ID to: ${(salesAccount || incomeAccounts[0]).id}`,
              'Redeploy your application',
              'Test invoice creation again'
            ] : ['No income accounts found']
          });
        }

        results.push({
          queryName: name,
          success: false,
          errors: result.errors || null,
          status: response.status
        });

      } catch (error: any) {
        results.push({
          queryName: name,
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'All query attempts failed',
      businessId: businessId,
      queryResults: results,
      recommendation: 'The Wave API schema may have changed. Check Wave documentation for current account query format.'
    });

  } catch (error: any) {
    console.error('🔍 Working income test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to test income accounts',
      details: error?.details || null
    });
  }
}
