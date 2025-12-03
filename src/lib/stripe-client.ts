import { loadStripe, type Stripe as StripeClient } from '@stripe/stripe-js';

// Client-side Stripe promise (singleton)
let stripePromise: Promise<StripeClient | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};
