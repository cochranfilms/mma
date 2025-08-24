// Wave client stubs for invoice creation and payment links
// Real implementation will call Wave's GraphQL API with API keys

export type CreateInvoiceResult = {
  success: boolean;
  invoiceId?: string;
  checkoutUrl?: string;
  error?: string;
};

export type WaveAccount = 'primary' | 'secondary';

export async function createWaveInvoiceStub(params: {
  account: WaveAccount;
  payload: unknown;
}): Promise<CreateInvoiceResult> {
  // TODO: Replace with real Wave GraphQL mutation when API keys are provided
  const { account } = params;
  const fakeId = `${account}-inv-${Math.random().toString(36).slice(2, 10)}`;
  const fakeCheckout = `https://example.com/pay/${fakeId}`;
  return {
    success: true,
    invoiceId: fakeId,
    checkoutUrl: fakeCheckout,
  };
}

export function getWaveConfig() {
  return {
    primaryApiKey: process.env.WAVE_API_KEY_PRIMARY || '',
    secondaryApiKey: process.env.WAVE_API_KEY_SECONDARY || '',
    businessIdPrimary: process.env.WAVE_BUSINESS_ID_PRIMARY || '',
    businessIdSecondary: process.env.WAVE_BUSINESS_ID_SECONDARY || '',
  };
}
