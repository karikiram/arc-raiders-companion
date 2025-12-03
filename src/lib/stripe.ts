import 'server-only';
import Stripe from 'stripe';

// Server-side Stripe instance - only use in API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
});

// Product configuration
export const STRIPE_CONFIG = {
  productName: 'Raider Pro',
  productDescription: 'Premium subscription for Arc Raiders Companion',
  prices: {
    monthly: {
      amount: 499, // $4.99 in cents
      interval: 'month' as const,
    },
    yearly: {
      amount: 3999, // $39.99 in cents
      interval: 'year' as const,
    },
  },
};
