import { NextRequest, NextResponse } from 'next/server';
import { createWaveInvoice } from '@/lib/wave';
import { upsertContact, createNoteForContact } from '@/lib/hubspot';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('📡 Create invoice request received');
    const body = await req.json();
    console.log('📋 Request body:', JSON.stringify(body, null, 2));
    
    const { contractData, invoice } = body || {};
    
    if (!contractData) {
      console.error('❌ Missing contractData');
      return NextResponse.json({ success: false, error: 'contractData is required' }, { status: 400 });
    }

    const { clientName, clientEmail, selectedPackage } = contractData;
    console.log('👤 Client info:', { clientName, clientEmail, selectedPackage });
    
    if (!clientName || !clientEmail || !selectedPackage) {
      console.error('❌ Missing required fields');
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

    console.log('💰 Invoice items:', items);
    console.log('💵 Total amount:', totalAmount);

    // Create Wave invoice with fallback
    console.log('🔄 Attempting to create Wave invoice...');
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

    console.log('📊 Wave result:', result);

    if (!result.success) {
      console.error('❌ Wave invoice failed:', result.error);
      console.error('❌ Wave error details:', result.errorDetails);
      
      // Return fallback response like reference implementation
      return NextResponse.json({
        success: true,
        invoiceId: 'FALLBACK-' + Date.now(),
        paymentUrl: '',
        mode: 'fallback',
        error: result.error,
        errorDetails: result.errorDetails,
        totalAmount: totalAmount,
        currency: 'USD'
      });
    }

    console.log('✅ Wave invoice created successfully');

    // Fire-and-forget: HubSpot contact upsert + creation note
    (async () => {
      try {
        const contactId = await upsertContact({
          email: clientEmail,
          firstname: clientName.split(' ')[0] || undefined,
          lastname: clientName.split(' ').slice(1).join(' ') || undefined,
          jobtitle: 'MMA Services Configurator',
          company: undefined,
        });
        const lineSummary = items
          .map((i: any) => `• ${i.name}${i.description ? ` — ${i.description}` : ''} x${i.quantity} @ $${Number(i.unitPrice || 0).toFixed(2)}`)
          .join('\n');
        const noteBody = [
          `Invoice created in Wave`,
          `Invoice ID: ${result.invoiceId}`,
          `Total: $${Number(totalAmount || 0).toFixed(2)} USD`,
          result.checkoutUrl ? `Pay link: ${result.checkoutUrl}` : '',
          '',
          'Items:',
          lineSummary,
        ].filter(Boolean).join('\n');
        await createNoteForContact({ contactId, title: 'MMA Invoice Created', body: noteBody });
      } catch (err) {
        console.error('HubSpot note on invoice creation failed:', err);
      }
    })();

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
    console.error('❌ Create invoice error:', error);
    console.error('❌ Error stack:', error?.stack);
    
    // Return fallback instead of 500 error
    return NextResponse.json({ 
      success: true,
      invoiceId: 'ERROR-FALLBACK-' + Date.now(),
      paymentUrl: '',
      mode: 'fallback',
      error: error?.message || 'Server error',
      totalAmount: 0,
      currency: 'USD'
    });
  }
}
