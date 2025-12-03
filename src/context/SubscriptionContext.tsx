'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import type { Subscription, ThemeId } from '@/types';

const THEME_STORAGE_KEY = 'arc-companion-theme';

interface SubscriptionContextType {
  // Subscription state
  subscription: Subscription | null;
  loading: boolean;
  isPro: boolean;

  // Feature access
  canCreateLoadout: (currentCount: number) => boolean;
  maxLoadouts: number;
  hasAds: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomThemes: boolean;
  hasEarlyAccess: boolean;
  hasPrioritySupport: boolean;
  hasProBadge: boolean;

  // Theme
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;

  // Actions
  openPricingModal: () => void;
  closePricingModal: () => void;
  isPricingModalOpen: boolean;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

// Default free subscription
const DEFAULT_SUBSCRIPTION: Subscription = {
  id: 'free',
  tier: 'free',
  status: 'none',
  period: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('default');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const themes: Record<ThemeId, { accent: string; accentLight: string; accentDark: string }> = {
      default: { accent: '#f59e0b', accentLight: '#fcd34d', accentDark: '#d97706' },
      midnight: { accent: '#3b82f6', accentLight: '#60a5fa', accentDark: '#2563eb' },
      blood: { accent: '#ef4444', accentLight: '#f87171', accentDark: '#dc2626' },
      forest: { accent: '#22c55e', accentLight: '#4ade80', accentDark: '#16a34a' },
      'pure-dark': { accent: '#a1a1aa', accentLight: '#d4d4d8', accentDark: '#71717a' },
    };

    const theme = themes[currentTheme];
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-light', theme.accentLight);
    root.style.setProperty('--color-accent-dark', theme.accentDark);
  }, [currentTheme]);

  // Subscribe to user's subscription status from Firestore
  useEffect(() => {
    if (!user || !db) {
      setSubscription(DEFAULT_SUBSCRIPTION);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Listen to the user document for subscription changes
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const currentSub = userData?.currentSubscription;

          if (currentSub && currentSub.status === 'active') {
            setSubscription({
              id: currentSub.stripeSubscriptionId || 'active',
              tier: currentSub.tier || 'pro',
              status: currentSub.status,
              period: currentSub.period || null,
              currentPeriodStart: currentSub.currentPeriodStart?.toDate() || null,
              currentPeriodEnd: currentSub.currentPeriodEnd?.toDate() || null,
              cancelAtPeriodEnd: currentSub.cancelAtPeriodEnd || false,
              stripeCustomerId: userData.stripeCustomerId,
              stripeSubscriptionId: currentSub.stripeSubscriptionId,
            });
          } else {
            // No active subscription
            setSubscription(DEFAULT_SUBSCRIPTION);
          }
        } else {
          // User document doesn't exist yet
          setSubscription(DEFAULT_SUBSCRIPTION);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to subscription:', error);
        setSubscription(DEFAULT_SUBSCRIPTION);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const isPro = subscription?.tier === 'pro' && subscription?.status === 'active';

  // Feature access based on tier
  const maxLoadouts = isPro ? Infinity : 2;
  const hasAds = !isPro;
  const hasAdvancedAnalytics = isPro;
  const hasCustomThemes = isPro;
  const hasEarlyAccess = isPro;
  const hasPrioritySupport = isPro;
  const hasProBadge = isPro;

  const canCreateLoadout = useCallback(
    (currentCustomCount: number) => {
      if (isPro) return true;
      return currentCustomCount < 2;
    },
    [isPro]
  );

  const setTheme = useCallback(
    (theme: ThemeId) => {
      setCurrentTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    },
    []
  );

  const openPricingModal = useCallback(() => {
    setIsPricingModalOpen(true);
  }, []);

  const closePricingModal = useCallback(() => {
    setIsPricingModalOpen(false);
  }, []);

  const openCustomerPortal = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to get portal URL:', data.error);
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        isPro,
        canCreateLoadout,
        maxLoadouts,
        hasAds,
        hasAdvancedAnalytics,
        hasCustomThemes,
        hasEarlyAccess,
        hasPrioritySupport,
        hasProBadge,
        currentTheme,
        setTheme,
        openPricingModal,
        closePricingModal,
        isPricingModalOpen,
        openCustomerPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
