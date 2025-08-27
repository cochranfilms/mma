// Pricing and invoice utility functions for WaveApps integration (stubs for now)
// These utilities shape invoice payloads and support rendering invoice UI from service data.

export type ServicePricing = {
  id: string;
  name: string;
  unitPriceCents: number; // store in minor units
  description?: string;
};

export const servicePricingMap: Record<string, ServicePricing> = {
  'media-relations': {
    id: 'media-relations',
    name: 'Media Relations & PR',
    unitPriceCents: 500000, // $5,000.00
    description: 'Earned placements that build authority',
  },
  'web-presence': {
    id: 'web-presence',
    name: 'Web Presence Upgrade',
    unitPriceCents: 750000, // $7,500.00
    description: 'Modern, conversion-focused experiences',
  },
  'content-amplification': {
    id: 'content-amplification',
    name: 'Content & Distribution',
    unitPriceCents: 600000, // $6,000.00
    description: 'Turn expertise into scalable demand',
  },
  consulting: {
    id: 'consulting',
    name: 'GTM Consulting',
    unitPriceCents: 300000, // $3,000.00
    description: 'Senior guidance without the overhead',
  },
  'b2b-marketing': {
    id: 'b2b-marketing',
    name: 'Demand Programs',
    unitPriceCents: 900000, // $9,000.00
    description: 'Full-funnel activation & measurement',
  },
};

export function formatMoneyFromCents(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export type InvoiceLineItem = {
  serviceId?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPriceCents: number;
};

export type InvoiceDraft = {
  customer: {
    name: string;
    email: string;
    company?: string;
  };
  currency: string;
  memo?: string;
  items: InvoiceLineItem[];
  totalCents: number;
  // Split metadata for 60/40 settlement across two Wave accounts
  split: {
    primaryEmail: string; // receives 60%
    secondaryEmail: string; // receives 40%
    ratio: { primary: number; secondary: number }; // 0.6 / 0.4
  };
};

export function buildInvoiceDraft(params: {
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  serviceId: string;
  quantity?: number;
  currency?: string;
  memo?: string;
  primaryWaveEmail: string;
  secondaryWaveEmail: string;
  items?: Array<{ name: string; description?: string; quantity: number; unitPriceCents: number }>;
}): InvoiceDraft {
  const {
    customerName,
    customerEmail,
    customerCompany,
    serviceId,
    quantity = 1,
    currency = 'USD',
    memo,
    primaryWaveEmail,
    secondaryWaveEmail,
  } = params;

  let lineItems: InvoiceLineItem[] = [];
  if (params.items && params.items.length > 0) {
    lineItems = params.items.map((i) => ({
      name: i.name,
      description: i.description,
      quantity: Math.max(1, Number(i.quantity) || 1),
      unitPriceCents: Math.max(0, Number(i.unitPriceCents) || 0),
    }));
  } else {
    const pricing = servicePricingMap[serviceId];
    if (!pricing) {
      throw new Error(`Unknown service id: ${serviceId}`);
    }
    lineItems = [
      {
        serviceId,
        name: pricing.name,
        description: pricing.description,
        quantity,
        unitPriceCents: pricing.unitPriceCents,
      },
    ];
  }

  const totalCents = lineItems.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);

  return {
    customer: {
      name: customerName,
      email: customerEmail,
      company: customerCompany,
    },
    currency,
    memo,
    items: lineItems,
    totalCents,
    split: {
      primaryEmail: primaryWaveEmail,
      secondaryEmail: secondaryWaveEmail,
      ratio: { primary: 0.6, secondary: 0.4 },
    },
  };
}

// Server payloads for Wave (types approximate; real schema depends on Wave API)
export type WaveCreateInvoicePayload = {
  customer: { email: string; name: string };
  currency: string;
  items: Array<{ description: string; quantity: number; unitPrice: number; productId?: string }>;
  memo?: string;
  metadata?: Record<string, unknown>;
};

export function toWavePayload(draft: InvoiceDraft): WaveCreateInvoicePayload {
  return {
    customer: { email: draft.customer.email, name: draft.customer.name },
    currency: draft.currency,
    items: draft.items.map((i) => ({
      description: i.description || i.name,
      quantity: i.quantity,
      unitPrice: i.unitPriceCents / 100,
    })),
    memo: draft.memo,
    metadata: {
      split: draft.split,
      source: 'mma-website',
    },
  };
}
