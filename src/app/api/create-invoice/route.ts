import { NextRequest, NextResponse } from 'next/server';
import { createWaveInvoice } from '@/lib/wave';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractData, invoice } = body || {};
    
    if (!contractData) {
      return NextResponse.json({ success: false, error: 'contractData is required' }, { status: 400 });
    }

    const { clientName, clientEmail, selectedPackage } = contractData;
    
    if (!clientName || !clientEmail || !selectedPackage) {
      return NextResponse.json({ success: false, error: 'clientName, clientEmail, and selectedPackage are required' }, { status: 400 });
    }

    let items = [];
    let totalAmount = 0;

    if (selectedPackage === 'custom' && invoice?.items) {
      // Handle custom items from configurator
      items = invoice.items.map((item: any) => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity || 1,
        unitPrice: (item.unitPriceCents || 0) / 100
      }));
      totalAmount = invoice.totalAmount || 0;
    } else {
      // Handle predefined packages
      const packagePricing = {
        core: { name: 'Core System Package', price: 5000 },
        growth: { name: 'Growth Accelerator Package', price: 7500 },
        full: { name: 'Full Ecosystem Package', price: 10000 }
      };

      const pkg = packagePricing[selectedPackage as keyof typeof packagePricing];
      if (!pkg) {
        return NextResponse.json({ success: false, error: 'Invalid package selected' }, { status: 400 });
      }

      items = [{
        name: pkg.name,
        description: `Service package for ${clientName}`,
        quantity: 1,
        unitPrice: pkg.price
      }];
      totalAmount = pkg.price;
    }

    // Create Wave invoice
    const result = await createWaveInvoice({
      account: 'primary',
      payload: {
        customer: { email: clientEmail, name: clientName },
        currency: 'USD',
        items,
        memo: `Contract ${contractData.contractId || 'SVC-' + Date.now()}`,
        metadata: {
          source: 'mma-website',
          contractId: contractData.contractId,
          selectedPackage
        }
      }
    });

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Failed to create Wave invoice',
        errorDetails: result.errorDetails,
        mode: result.mode || 'error'
      }, { status: 500 });
    }

    // Return response matching reference format
    return NextResponse.json({
      success: true,
      invoiceId: result.invoiceId,
      paymentUrl: result.checkoutUrl,
      mode: result.mode,
      totalAmount: totalAmount,
      currency: 'USD'
    });

  } catch (error: any) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Server error',
      mode: 'error'
    }, { status: 500 });
  }
}
