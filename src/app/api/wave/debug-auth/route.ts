import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Debugging Wave authentication...');
    
    // Check all possible Wave environment variables
    const envVars: Record<string, string | undefined> = {
      WAVE_API_KEY: process.env.WAVE_API_KEY,
      WAVE_API_KEY_PRIMARY: process.env.WAVE_API_KEY_PRIMARY,
      WAVE_BUSINESS_ID: process.env.WAVE_BUSINESS_ID,
      WAVE_BUSINESS_ID_PRIMARY: process.env.WAVE_BUSINESS_ID_PRIMARY,
      WAVE_INCOME_ACCOUNT_ID: process.env.WAVE_INCOME_ACCOUNT_ID,
      WAVE_CLIENT_ID: process.env.WAVE_CLIENT_ID,
      WAVE_CLIENT_SECRET: process.env.WAVE_CLIENT_SECRET,
      WAVE_API_BASE: process.env.WAVE_API_BASE,
    };

    // Test different API endpoints
    const endpoints = [
      'https://gql.waveapps.com/graphql/public',
      'https://api.waveapps.com/graphql/public',
      'https://gql.waveapps.com/graphql',
      'https://api.waveapps.com/graphql'
    ];

    const apiKey = envVars.WAVE_API_KEY || envVars.WAVE_API_KEY_PRIMARY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'No Wave API key found',
        envVars: Object.keys(envVars).reduce((acc, key) => {
          acc[key] = envVars[key] ? `${envVars[key].slice(0, 8)}...` : 'Not set';
          return acc;
        }, {} as Record<string, string>)
      });
    }

    // Simple whoami query that should work
    const query = `query { user { id defaultEmail } }`;

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ query }),
          cache: 'no-store',
        });

        const result = await response.json();
        
        results.push({
          endpoint,
          status: response.status,
          success: response.ok && !result.errors,
          data: result.data || null,
          errors: result.errors || null
        });

      } catch (error: any) {
        results.push({
          endpoint,
          success: false,
          error: error?.message || 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      apiKeyPreview: `${apiKey.slice(0, 8)}...`,
      businessIdPreview: envVars.WAVE_BUSINESS_ID ? `${envVars.WAVE_BUSINESS_ID.slice(0, 20)}...` : 'Not set',
      envVars: Object.keys(envVars).reduce((acc, key) => {
        acc[key] = envVars[key] ? `${envVars[key].slice(0, 8)}...` : 'Not set';
        return acc;
      }, {} as Record<string, string>),
      endpointTests: results,
      recommendations: [
        'Check if any endpoint returned success: true',
        'If all failed, verify your API key in Wave dashboard',
        'Check if Wave requires OAuth2 (client ID/secret)',
        'Ensure API key has proper permissions'
      ]
    });

  } catch (error: any) {
    console.error('🔍 Debug auth error:', error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to debug authentication',
      details: error?.details || null
    });
  }
}
