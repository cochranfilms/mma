// Stripe Connect helper with dynamic import and safe fallbacks
// Allows running the app even when Stripe is not installed or keys are missing.

type MaybeStripe = any;

async function getStripe(): Promise<MaybeStripe | null> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  try {
    // Use eval(require) to avoid static bundling/resolution when stripe isn't installed
    const req: any = (Function('return require'))();
    const stripeModule = req('stripe');
    const StripeCtor = stripeModule.default || stripeModule;
    return new StripeCtor(secretKey, { apiVersion: '2024-06-20' });
  } catch (err) {
    console.warn('Stripe not available, falling back to stubs:', err);
    return null;
  }
}

export type CreateCheckoutParams = {
  amountCents: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  description: string;
  metadata?: Record<string, string | number | boolean>;
  successUrl: string;
  cancelUrl: string;
};

export async function createStripeCheckoutSession(params: CreateCheckoutParams): Promise<{ url: string; id?: string }> {
  const stripe = await getStripe();
  const {
    amountCents,
    currency,
    customerEmail,
    customerName,
    description,
    metadata,
    successUrl,
    cancelUrl,
  } = params;

  if (!stripe) {
    // Stub fallback
    const fakeId = `cs_test_${Math.random().toString(36).slice(2, 10)}`;
    return { url: `https://example.com/checkout/${fakeId}`, id: fakeId };
  }

  const transferGroup = `order_${Math.random().toString(36).slice(2, 10)}`;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: description },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      customerName,
      ...metadata,
      transferGroup,
    },
    payment_intent_data: {
      transfer_group: transferGroup,
      metadata: {
        customerName,
        ...metadata,
      },
    },
  });

  return { url: session.url as string, id: session.id };
}

export async function handleStripeWebhook(rawBody: string, signature: string | null | undefined) {
  const stripe = await getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    // No-op in stub mode
    return { ok: true, stub: true } as const;
  }

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    return { ok: false, error: `Invalid signature: ${err.message}` } as const;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const paymentIntentId = session.payment_intent;
    const amountTotal: number = session.amount_total; // in cents
    const currency: string = session.currency || 'usd';

    const primaryAccount = process.env.STRIPE_CONNECT_ACCOUNT_PRIMARY;
    const secondaryAccount = process.env.STRIPE_CONNECT_ACCOUNT_SECONDARY;

    const primaryAmount = Math.round(amountTotal * 0.6);
    const secondaryAmount = amountTotal - primaryAmount;

    if (primaryAccount) {
      await stripe.transfers.create({
        amount: primaryAmount,
        currency,
        destination: primaryAccount,
        transfer_group: paymentIntentId,
      });
    }
    if (secondaryAccount) {
      await stripe.transfers.create({
        amount: secondaryAmount,
        currency,
        destination: secondaryAccount,
        transfer_group: paymentIntentId,
      });
    }

    // Return data for optional Wave sync step handled by caller
    return { ok: true, paymentIntentId, amountTotal, currency } as const;
  }

  return { ok: true } as const;
}
