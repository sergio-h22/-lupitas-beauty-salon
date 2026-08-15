'use client';

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
// The `/pure` entrypoint matters: importing plain `@stripe/stripe-js` injects
// the js.stripe.com script as a module side-effect, so merely importing it
// costs every booking-page visitor a third-party request even when loadStripe
// is never called. `/pure` defers injection until loadStripe actually runs.
import { loadStripe } from '@stripe/stripe-js/pure';
import type { Stripe } from '@stripe/stripe-js';

/**
 * Stripe.js is only fetched when payments are actually switched on.
 *
 * `loadStripe` injects a script from js.stripe.com the moment it is called, so
 * calling it at module scope meant every visitor to the booking page paid for
 * a third-party request — and, with no key configured, got a console error for
 * it. The promise is created lazily and memoised so it is still created only
 * once per session.
 */
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const PAYMENTS_ON = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';

export const paymentsAvailable = Boolean(PAYMENTS_ON && PUBLISHABLE_KEY);

let stripePromise: Promise<Stripe | null> | null = null;

function getStripePromise() {
  if (!paymentsAvailable) return null;
  if (!stripePromise) stripePromise = loadStripe(PUBLISHABLE_KEY!);
  return stripePromise;
}

export function StripeProvider({ children }: { children: ReactNode }) {
  const promise = getStripePromise();

  // Without payments configured the booking flow works exactly as before, and
  // no Stripe code is loaded at all.
  if (!promise) return <>{children}</>;

  return <Elements stripe={promise}>{children}</Elements>;
}
