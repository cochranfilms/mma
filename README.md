This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Wave Invoicing & Checkout (Stubbed)

This project includes a Wave-based invoicing flow to create an invoice from the Services page and redirect the client to a checkout URL. The real Wave GraphQL calls are stubbed until API keys are provided.

### How it works
- Services list now includes a Buy Now CTA linking to `/services/checkout?serviceId=...`.
- The checkout page collects customer details and calls the API route `/api/wave/create-invoice`.
- The API builds an invoice draft with 60/40 split metadata and calls a stubbed Wave client.
- On successful payment (via webhook), a secondary invoice is created for the 40% split as a bookkeeping record in the secondary account.

### Environment variables
Create a `.env.local` with:

```
WAVE_API_KEY_PRIMARY=
WAVE_API_KEY_SECONDARY=
WAVE_BUSINESS_ID_PRIMARY=
WAVE_BUSINESS_ID_SECONDARY=
NEXT_PUBLIC_WAVE_PRIMARY_EMAIL=
NEXT_PUBLIC_WAVE_SECONDARY_EMAIL=
NEXT_PUBLIC_CALENDLY_URL=
```

- `NEXT_PUBLIC_WAVE_PRIMARY_EMAIL` and `NEXT_PUBLIC_WAVE_SECONDARY_EMAIL` are only used to tag invoice split ownership until real IDs are wired.
- Replace stubs in `src/lib/wave.ts` with real Wave GraphQL calls once API keys are ready.

### Files
- `src/lib/invoice.ts` – pricing, invoice draft, and transformer utilities.
- `src/lib/wave.ts` – Wave client stubs.
- `src/app/api/wave/create-invoice/route.ts` – creates primary invoice and returns checkout URL.
- `src/app/api/wave/webhook/route.ts` – listens for payment events and mirrors secondary invoice (40%).
- `src/app/services/checkout/page.tsx` – client checkout UI.
### Wave env configuration (live)

Set these in your deployment environment (Dashboard → Environment Variables):

```
WAVE_API_BASE=https://gql.waveapps.com/graphql/public
WAVE_API_KEY_PRIMARY=...           # Primary account API key
WAVE_API_KEY_SECONDARY=...         # Secondary account API key (for split mirror invoice)
WAVE_BUSINESS_ID_PRIMARY=...       # Business ID corresponding to PRIMARY key
WAVE_BUSINESS_ID_SECONDARY=...     # Business ID corresponding to SECONDARY key
WAVE_INVOICE_PRIMARY_EMAIL=...     # default primary email (60%)
WAVE_INVOICE_SECONDARY_EMAIL=...   # default secondary email (40%)
```

If you see `NOT_FOUND` with a message like `Node '...' could not be found` from Wave, it usually means the Business ID does not match the API key’s workspace. Double‑check that the API key belongs to the same Wave business as the Business ID you set.

- `src/app/services/page.tsx` – Buy Now buttons added to Featured and All Services.

### Important notes
- Actual fund “splitting” requires either:
  - Two real invoices: customer-facing (100%) in primary; internal settlement (40%) in secondary; or
  - Using a payment processor that supports split payouts at transaction time.
- Wave alone does not split payouts natively. The above approach mirrors accounting via invoices; funds still settle to the original processor. Consult finance for compliance.

## Stripe Connect Split Payouts

This site supports true split payouts via Stripe Connect. Customers pay through Stripe Checkout; funds are split 60%/40% to two connected accounts. After payment, we sync a Wave invoice for bookkeeping and customer records.

### Environment variables
Add to `.env.local`:

```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CONNECT_ACCOUNT_PRIMARY=
STRIPE_CONNECT_ACCOUNT_SECONDARY=
NEXT_PUBLIC_SITE_URL=
```

- `STRIPE_CONNECT_ACCOUNT_PRIMARY` and `STRIPE_CONNECT_ACCOUNT_SECONDARY` are connected account IDs (e.g., `acct_...`).
- `NEXT_PUBLIC_SITE_URL` is used to build success/cancel URLs in serverless environments.

### Flow
1. Services page → Buy Now → `/services/checkout?serviceId=...`.
2. Checkout page calls `POST /api/stripe/create-checkout-session` to get a Stripe Checkout URL and redirects.
3. Stripe Checkout completes → `POST /api/stripe/webhook` receives `checkout.session.completed`.
4. Webhook creates two transfers: 60% → primary, 40% → secondary.
5. We auto-sync a Wave invoice (stub for now) for the payment.

### Files
- `src/lib/stripe-connect.ts` – helpers for Checkout Session, webhook handling, and transfers.
- `src/app/api/stripe/create-checkout-session/route.ts` – creates Checkout Session.
- `src/app/api/stripe/webhook/route.ts` – handles Stripe webhooks and initiates Wave sync.

### Notes
- When Wave API keys are added, replace stubs in `src/lib/wave.ts`, and update webhook to create real Wave invoices against the correct business.
- Copy on the checkout page clarifies clients can still pay directly from Wave invoices. Avoids confusion by always sending the Wave invoice receipt post-payment.
