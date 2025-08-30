import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Simple income account test...');
    
    const apiKey = process.env.WAVE_API_KEY;
    const currentBusinessId = process.env.WAVE_BUSINESS_ID; // Use current one first
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Wave API key found'
      });
    }

    // Try the simplest possible query first
    const query = `query { 
      user { 
        id 
        defaultEmail 
      } 
    }`;

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
      return NextResponse.json({
        success: false,
        error: 'Basic Wave API test failed',
        details: result.errors || result
      });
    }

    // Now try to get business info
    const businessQuery = `query GetBusiness($businessId: ID!) {
      business(id: $businessId) {
        id
        name
      }
    }`;

    const businessResponse = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ 
        query: businessQuery, 
        variables: { businessId: currentBusinessId }
      }),
      cache: 'no-store',
    });

    const businessResult = await businessResponse.json();

    // Try with Marketing Mousetrap Agency ID
    const marketingMousetrapBusinessId = 'QnVzaW5lc3M6Y2M4YjZiNjUtMzg0Yy00YmNhLWI3ZjAtNzMzMzMzZWYwMDE0';
    
    const mmaBizResponse = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ 
        query: businessQuery, 
        variables: { businessId: marketingMousetrapBusinessId }
      }),
      cache: 'no-store',
    });

    const mmaBizResult = await mmaBizResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Basic API test completed',
      user: result.data.user,
      currentBusinessTest: {
        businessId: currentBusinessId,
        success: businessResponse.ok && !businessResult.errors,
        data: businessResult.data || null,
        errors: businessResult.errors || null
      },
      marketingMousetrapTest: {
        businessId: marketingMousetrapBusinessId,
        success: mmaBizResponse.ok && !mmaBizResult.errors,
        data: mmaBizResult.data || null,
        errors: mmaBizResult.errors || null
      },
      recommendation: mmaBizResponse.ok && !mmaBizResult.errors 
        ? 'Marketing Mousetrap Agency business ID works! Update your env vars.'
        : 'There may be an issue with the Marketing Mousetrap Agency business ID.'
    });

  } catch (error: any) {
    console.error('🔍 Simple test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to run simple test',
      details: error?.details || null
    });
  }
}
