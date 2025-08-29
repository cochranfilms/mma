import { NextRequest, NextResponse } from 'next/server';
import { getWaveConfig } from '@/lib/wave';

export async function GET(_req: NextRequest) {
  try {
    const cfg = getWaveConfig();
    const apiKey = cfg.apiKey;
    
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'WAVE_API_KEY is not set' }, { status: 400 });
    }

    // GraphQL introspection query to see what's available
    const introspectionQuery = `
      query IntrospectionQuery {
        __schema {
          queryType {
            fields {
              name
              description
              type {
                name
                kind
              }
            }
          }
        }
      }
    `;

    const res = await fetch('https://gql.waveapps.com/graphql/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query: introspectionQuery }),
      cache: 'no-store',
    });
    
    const json = await res.json();
    
    if (json.errors) {
      return NextResponse.json({ 
        success: false, 
        error: 'Schema introspection failed', 
        details: json.errors 
      });
    }

    const queryFields = json.data?.__schema?.queryType?.fields || [];
    
    return NextResponse.json({
      success: true,
      message: 'Available Wave GraphQL queries',
      availableQueries: queryFields.map((field: any) => ({
        name: field.name,
        description: field.description,
        returnType: field.type?.name || field.type?.kind
      })),
      note: 'These are the only queries Wave supports'
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}
