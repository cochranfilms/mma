// Wave client: attempts real GraphQL calls; falls back to stub if unavailable

export type CreateInvoiceResult = {
  success: boolean;
  invoiceId?: string;
  checkoutUrl?: string; // Wave "viewUrl" for the invoice
  error?: string;
  mode?: 'live' | 'stub';
  errorDetails?: any;
};

export type WaveAccount = 'primary' | 'secondary';

export function getWaveConfig() {
  return {
    apiBase: process.env.WAVE_API_BASE || 'https://gql.waveapps.com/graphql/public',
    // One-business, one-account configuration
    apiKey: process.env.WAVE_API_KEY || process.env.WAVE_API_KEY_PRIMARY || '',
    businessId: process.env.WAVE_BUSINESS_ID || process.env.WAVE_BUSINESS_ID_PRIMARY || '',
  };
}

async function waveFetch(apiKey: string, query: string, variables?: Record<string, any>) {
  const { apiBase } = getWaveConfig();
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
    // Avoid caching issues on Vercel builds
    cache: 'no-store',
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors) {
    const err = new Error('Wave GraphQL error');
    (err as any).details = json;
    throw err;
  }
  return json.data;
}

async function ensureIncomeAccountId(apiKey: string, businessId: string): Promise<string> {
  const q = `query Accounts($businessId: ID!, $page: Int!, $pageSize: Int!) {
    business(id: $businessId) {
      id
      accounts(types: [INCOME], page: { page: $page, pageSize: $pageSize }) {
        edges { node { id name type } }
      }
    }
  }`;
  const data = await waveFetch(apiKey, q, { businessId, page: 1, pageSize: 25 });
  const edges = data?.business?.accounts?.edges || [];
  const acct = edges.find((e: any) => e?.node?.name?.toLowerCase().includes('sales'))?.node || edges[0]?.node;
  if (!acct?.id) {
    throw new Error('No INCOME account found in Wave');
  }
  return acct.id as string;
}

async function createCustomer(apiKey: string, businessId: string, name: string, email: string): Promise<string> {
  const m = `mutation CreateCustomer($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      didSucceed
      inputErrors { message }
      customer { id }
    }
  }`;
  const data = await waveFetch(apiKey, m, {
    input: {
      businessId,
      name,
      email,
    },
  });
  if (!data?.customerCreate?.didSucceed) {
    throw new Error(data?.customerCreate?.inputErrors?.[0]?.message || 'Failed to create customer');
  }
  return data.customerCreate.customer.id as string;
}

async function createProduct(apiKey: string, businessId: string, name: string, unitPrice: number, incomeAccountId: string): Promise<string> {
  const m = `mutation CreateProduct($input: ProductCreateInput!) {
    productCreate(input: $input) {
      didSucceed
      inputErrors { message }
      product { id }
    }
  }`;
  const data = await waveFetch(apiKey, m, {
    input: {
      businessId,
      name,
      unitPrice,
      incomeAccountId,
    },
  });
  if (!data?.productCreate?.didSucceed) {
    throw new Error(data?.productCreate?.inputErrors?.[0]?.message || 'Failed to create product');
  }
  return data.productCreate.product.id as string;
}

async function createInvoice(apiKey: string, businessId: string, customerId: string, items: Array<{ name: string; quantity: number; unitPrice: number }>, memo?: string): Promise<{ id: string; viewUrl?: string }> {
  const m = `mutation CreateInvoice($input: InvoiceCreateInput!) {
    invoiceCreate(input: $input) {
      didSucceed
      inputErrors { message }
      invoice { id viewUrl }
    }
  }`;

  // For each item, create a product on the fly and use its ID
  const incomeAccountId = await ensureIncomeAccountId(apiKey, businessId);
  const productIds: string[] = [];
  for (const it of items) {
    const pid = await createProduct(apiKey, businessId, it.name, it.unitPrice, incomeAccountId);
    productIds.push(pid);
  }

  const invoiceItems = items.map((it, idx) => ({ productId: productIds[idx], quantity: it.quantity, unitPrice: it.unitPrice }));

  const data = await waveFetch(apiKey, m, {
    input: {
      businessId,
      invoice: {
        customerId,
        items: invoiceItems,
        memo,
      },
    },
  });

  if (!data?.invoiceCreate?.didSucceed) {
    throw new Error(data?.invoiceCreate?.inputErrors?.[0]?.message || 'Failed to create invoice');
  }

  const inv = data.invoiceCreate.invoice;
  return { id: inv.id as string, viewUrl: inv.viewUrl as string };
}

export async function createWaveInvoice(params: {
  account: WaveAccount;
  payload: {
    customer: { email: string; name: string };
    currency?: string;
    items: Array<{ description?: string; quantity: number; unitPrice: number; name?: string }>;
    memo?: string;
    metadata?: Record<string, any>;
  };
  overrideBusinessId?: string;
}): Promise<CreateInvoiceResult> {
  const cfg = getWaveConfig();
  const apiKey = cfg.apiKey;
  const businessId = params.overrideBusinessId || cfg.businessId;

  // If no API key or business ID, fall back to stub
  if (!apiKey || !businessId) {
    const fakeId = `inv-${Math.random().toString(36).slice(2, 10)}`;
    return { success: true, invoiceId: fakeId, checkoutUrl: `https://example.com/pay/${fakeId}`, mode: 'stub' };
  }

  try {
    const customerId = await createCustomer(apiKey, businessId, params.payload.customer.name, params.payload.customer.email);
    const items = params.payload.items?.map((i) => ({ name: i.name || i.description || 'Service', quantity: Math.max(1, Number(i.quantity) || 1), unitPrice: Number(i.unitPrice) || 0 })) || [];
    if (items.length === 0) {
      throw new Error('No invoice items provided');
    }
    const inv = await createInvoice(apiKey, businessId, customerId, items, params.payload.memo);
    return { success: true, invoiceId: inv.id, checkoutUrl: inv.viewUrl, mode: 'live' };
  } catch (error: any) {
    const hint = error?.details?.errors?.[0]?.extensions?.code === 'NOT_FOUND'
      ? `Invalid or unauthorized businessId (${(businessId || '').slice(0, 6)}…); verify Wave business ID matches the API key.`
      : undefined;
    return { success: false, error: error?.message || 'Wave API error', errorDetails: { ...error?.details, hint }, mode: 'live' };
  }
}

export async function getInvoiceStatus(invoiceId: string): Promise<{ success: boolean; status?: string; viewUrl?: string; error?: string; mode?: 'live' | 'stub' }> {
  const cfg = getWaveConfig();
  const apiKey = cfg.apiKey;
  const businessId = cfg.businessId;
  if (!apiKey || !businessId) {
    return { success: true, status: 'STUB_UNPAID', viewUrl: `https://example.com/pay/${invoiceId}`, mode: 'stub' };
  }
  try {
    const q = `query InvoiceStatus($businessId: ID!, $invoiceId: ID!) {
      business(id: $businessId) {
        id
        invoice(id: $invoiceId) { id status viewUrl }
      }
    }`;
    const data = await waveFetch(apiKey, q, { businessId, invoiceId });
    const inv = data?.business?.invoice;
    if (!inv?.id) {
      throw new Error('Invoice not found');
    }
    return { success: true, status: inv.status, viewUrl: inv.viewUrl, mode: 'live' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Wave API error', mode: 'live' };
  }
}
