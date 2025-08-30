import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Introspecting Wave business schema...');
    
    const apiKey = process.env.WAVE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Wave API key'
      });
    }

    // Introspect the Business type to see what fields are available
    const introspectionQuery = `
      query {
        __type(name: "Business") {
          name
          fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
            args {
              name
              type {
                name
                kind
                ofType {
                  name
                  kind
                }
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
      body: JSON.stringify({ query: introspectionQuery }),
      cache: 'no-store',
    });

    const result = await response.json();
    
    if (!response.ok || result.errors) {
      return NextResponse.json({
        success: false,
        error: 'Introspection failed',
        details: result.errors || result,
        status: response.status
      });
    }

    const businessType = result.data?.__type;
    const accountsField = businessType?.fields?.find((f: any) => f.name === 'accounts');

    return NextResponse.json({
      success: true,
      message: 'Business type introspection completed',
      businessType: businessType,
      accountsField: accountsField,
      allFields: businessType?.fields?.map((f: any) => ({
        name: f.name,
        type: f.type?.name || f.type?.kind,
        args: f.args?.map((arg: any) => ({
          name: arg.name,
          type: arg.type?.name || arg.type?.kind
        }))
      })) || [],
      recommendation: accountsField 
        ? 'Found accounts field - check the args to see correct parameter format'
        : 'No accounts field found - Wave API may have changed'
    });

  } catch (error: any) {
    console.error('🔍 Introspection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to introspect schema',
      details: error?.details || null
    });
  }
}
