import { NextRequest, NextResponse } from 'next/server';
import { createWaveInvoice } from '@/lib/wave';

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Testing Wave invoice creation...');
    
    // Test with a simple invoice
    const result = await createWaveInvoice({
      account: 'primary',
      payload: {
        customer: { email: 'test@example.com', name: 'Test Customer' },
        currency: 'USD',
        items: [
          {
            name: 'Test Service',
            description: 'Test service for API validation',
            quantity: 1,
            unitPrice: 100
          }
        ],
        memo: 'Test invoice - API validation',
        metadata: {
          source: 'mma-website-test',
          test: true
        }
      }
    });

    console.log('🧪 Test result:', result);

    return NextResponse.json({
      success: true,
      testResult: result,
      message: result.success 
        ? 'Wave invoice creation is working! ✅' 
        : 'Wave invoice creation failed ❌',
      instructions: result.success 
        ? 'Your Wave integration is working correctly. You can now use the service configurator.'
        : 'Check the error details and verify your WAVE_BUSINESS_ID in Vercel environment variables.'
    });

  } catch (error: any) {
    console.error('🧪 Test error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: error?.message || 'Test failed',
      details: error?.details || null,
      message: 'Wave invoice test failed ❌',
      instructions: 'Check your Wave API credentials and business ID in Vercel environment variables.'
    });
  }
}
