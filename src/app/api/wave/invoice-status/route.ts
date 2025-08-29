import { NextRequest, NextResponse } from 'next/server';
import { getInvoiceStatus } from '@/lib/wave';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('invoiceId') || '';
    if (!invoiceId) {
      return NextResponse.json({ success: false, error: 'invoiceId is required' }, { status: 400 });
    }
    const status = await getInvoiceStatus(invoiceId);
    return NextResponse.json(status);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'unknown' }, { status: 500 });
  }
}


