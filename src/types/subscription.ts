// Subscription Types for Raider Pro

export type SubscriptionTier = 'free' | 'pro';
export type SubscriptionPeriod = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  period: SubscriptionPeriod | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  period: SubscriptionPeriod;
  price: number;
  priceId: string; // Stripe Price ID
  savings?: string;
  popular?: boolean;
}

// Pricing configuration - priceIds are set from environment variables
// Run POST /api/stripe/setup to create the products and get the price IDs
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    period: 'monthly',
    price: 4.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    period: 'yearly',
    price: 39.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
    savings: 'Save 33%',
    popular: true,
  },
];

// Feature limits
export const FREE_LIMITS = {
  maxCustomLoadouts: 2,
  hasAds: true,
  hasAdvancedAnalytics: false,
  hasCustomThemes: false,
  hasEarlyAccess: false,
  hasPrioritySupport: false,
  hasProBadge: false,
};

export const PRO_LIMITS = {
  maxCustomLoadouts: Infinity,
  hasAds: false,
  hasAdvancedAnalytics: true,
  hasCustomThemes: true,
  hasEarlyAccess: true,
  hasPrioritySupport: true,
  hasProBadge: true,
};

// Theme definitions
export type ThemeId = 'default' | 'midnight' | 'blood' | 'forest' | 'pure-dark';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  isPro: boolean;
  colors: {
    accent: string;
    accentLight: string;
    accentDark: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Amber (Default)',
    description: 'Classic amber/orange theme',
    isPro: false,
    colors: {
      accent: '#f59e0b',
      accentLight: '#fcd34d',
      accentDark: '#d97706',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    description: 'Cool blue tones for night raids',
    isPro: true,
    colors: {
      accent: '#3b82f6',
      accentLight: '#60a5fa',
      accentDark: '#2563eb',
    },
  },
  {
    id: 'blood',
    name: 'Blood Red',
    description: 'Aggressive raider aesthetic',
    isPro: true,
    colors: {
      accent: '#ef4444',
      accentLight: '#f87171',
      accentDark: '#dc2626',
    },
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural camouflage vibes',
    isPro: true,
    colors: {
      accent: '#22c55e',
      accentLight: '#4ade80',
      accentDark: '#16a34a',
    },
  },
  {
    id: 'pure-dark',
    name: 'Pure Dark',
    description: 'Minimal grayscale accent',
    isPro: true,
    colors: {
      accent: '#a1a1aa',
      accentLight: '#d4d4d8',
      accentDark: '#71717a',
    },
  },
];

// Pro feature list for display
export interface ProFeature {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export const PRO_FEATURES: ProFeature[] = [
  {
    icon: 'Swords',
    title: 'Unlimited Loadouts',
    description: 'Create as many loadouts as you need',
    highlight: true,
  },
  {
    icon: 'Ban',
    title: 'No Ads',
    description: 'Enjoy an ad-free experience',
    highlight: true,
  },
  {
    icon: 'BarChart3',
    title: 'Advanced Analytics',
    description: 'Track stash value, item history, efficiency stats',
  },
  {
    icon: 'Palette',
    title: 'Custom Themes',
    description: '5 exclusive color themes to customize your experience',
  },
  {
    icon: 'Sparkles',
    title: 'Early Access',
    description: 'Be first to try new features',
  },
  {
    icon: 'HeadphonesIcon',
    title: 'Priority Support',
    description: 'Get help faster when you need it',
  },
  {
    icon: 'Crown',
    title: 'Pro Badge',
    description: 'Show off your supporter status',
  },
];
