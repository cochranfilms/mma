import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Finding your Wave business ID...');
    
    const apiKey = process.env.WAVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Wave API key found'
      });
    }

    // Since we know this endpoint works, let's try to get business info
    // First, let's try a simple query to see what businesses we can access
    const query = `
      query {
        user {
          id
          defaultEmail
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
      return NextResponse.json({
        success: false,
        error: 'Wave API error',
        details: result.errors || result
      });
    }

    // Now let's try to introspect the schema to see what fields are available
    const introspectionQuery = `
      query {
        __schema {
          queryType {
            fields {
              name
              description
            }
          }
        }
      }
    `;

    const introspectionResponse = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query: introspectionQuery }),
      cache: 'no-store',
    });

    const introspectionResult = await introspectionResponse.json();

    // Try to find businesses using different approaches
    const businessQueries = [
      // Approach 1: Direct businesses query
      `query { businesses(page: 1, pageSize: 10) { edges { node { id name } } } }`,
      
      // Approach 2: Try without pagination
      `query { businesses { edges { node { id name } } } }`,
      
      // Approach 3: Try different structure
      `query { businesses { id name } }`,
    ];

    const businessResults = [];
    
    for (const [index, businessQuery] of businessQueries.entries()) {
      try {
        const businessResponse = await fetch('https://gql.waveapps.com/graphql/public', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ query: businessQuery }),
          cache: 'no-store',
        });

        const businessResult = await businessResponse.json();
        
        businessResults.push({
          approach: `Approach ${index + 1}`,
          query: businessQuery,
          success: businessResponse.ok && !businessResult.errors,
          data: businessResult.data || null,
          errors: businessResult.errors || null
        });

        // If this approach worked, extract business IDs
        if (businessResponse.ok && !businessResult.errors && businessResult.data) {
          const businesses = businessResult.data.businesses;
          if (businesses && businesses.edges) {
            const businessList = businesses.edges.map((edge: any) => edge.node);
            if (businessList.length > 0) {
              return NextResponse.json({
                success: true,
                message: 'Found your businesses!',
                user: result.data.user,
                businesses: businessList,
                currentBusinessId: process.env.WAVE_BUSINESS_ID,
                recommendation: businessList.length === 1 
                  ? `Use this business ID: ${businessList[0].id}`
                  : 'Multiple businesses found - choose the correct one',
                instructions: [
                  '1. Copy the correct business ID from the list above',
                  '2. Update WAVE_BUSINESS_ID in your Vercel environment variables',
                  '3. Redeploy your application',
                  '4. Test invoice creation again'
                ]
              });
            }
          } else if (businesses && Array.isArray(businesses)) {
            return NextResponse.json({
              success: true,
              message: 'Found your businesses!',
              user: result.data.user,
              businesses: businesses,
              currentBusinessId: process.env.WAVE_BUSINESS_ID,
              recommendation: businesses.length === 1 
                ? `Use this business ID: ${businesses[0].id}`
                : 'Multiple businesses found - choose the correct one',
              instructions: [
                '1. Copy the correct business ID from the list above',
                '2. Update WAVE_BUSINESS_ID in your Vercel environment variables',
                '3. Redeploy your application',
                '4. Test invoice creation again'
              ]
            });
          }
        }

      } catch (error: any) {
        businessResults.push({
          approach: `Approach ${index + 1}`,
          query: businessQuery,
          success: false,
          error: error?.message || 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Could not find businesses with available queries',
      user: result.data.user,
      currentBusinessId: process.env.WAVE_BUSINESS_ID,
      businessQueryResults: businessResults,
      introspection: introspectionResult.data || null,
      recommendation: 'You may need to get your business ID directly from the Wave dashboard',
      instructions: [
        '1. Log into your Wave account at https://my.waveapps.com/',
        '2. Go to Settings → Integrations → API Access',
        '3. Find your Business ID in the API settings',
        '4. Update WAVE_BUSINESS_ID in Vercel environment variables'
      ]
    });

  } catch (error: any) {
    console.error('🔍 Business lookup error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to lookup business',
      details: error?.details || null
    });
  }
}
