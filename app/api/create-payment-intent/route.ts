import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Constructed per request, not at module scope.
 *
 * The Stripe SDK throws the moment it is instantiated without a key, and
 * module-scope code runs during `next build` page-data collection — so
 * building a checkout of this repo without secrets set (a fresh clone, or the
 * first deploy before env vars are added) would fail the whole build rather
 * than just disabling payments.
 */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  // Pinned deliberately; the literal must match the version the installed
  // SDK's types were generated against or the build fails on the type.
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      { error: 'Payments are not configured on this deployment.' },
      { status: 503 },
    );
  }

  try {
    const { amount, description, email, name, connectedAccountId } = await req.json();

    // The client is not trusted to set the price. Bound the amount here so a
    // tampered request cannot create a $0.01 — or $10,000 — payment intent.
    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < 50 || amount > 100_000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      description: typeof description === 'string' ? description.slice(0, 350) : undefined,
      receipt_email: typeof email === 'string' && email.includes('@') ? email : undefined,
      metadata: { customer_name: typeof name === 'string' ? name.slice(0, 120) : '' },
    };

    // If a connected account is provided, charge on their behalf and collect
    // the platform fee (0.25% + $0.25 per transaction).
    if (typeof connectedAccountId === 'string' && connectedAccountId.startsWith('acct_')) {
      paymentIntentParams.on_behalf_of = connectedAccountId;
      // Platform fee: 0.25% of amount + $0.25 = (amount * 0.0025) + 25 cents
      paymentIntentParams.application_fee_amount = Math.round(amount * 0.0025) + 25;
    }

    const intent = await stripe.paymentIntents.create(paymentIntentParams);

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (error) {
    // Never echo the provider's error to the client — it can leak account
    // detail. Log it server-side and return something generic.
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
