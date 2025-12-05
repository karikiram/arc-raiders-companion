'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Valid tab IDs that can be navigated to
export type TabId =
  | 'dashboard'
  | 'items'
  | 'tier-lists'
  | 'twitch'
  | 'stash'
  | 'hoarding'
  | 'recyclables'
  | 'loadouts'
  | 'settings'
  | 'help';

const VALID_TABS: TabId[] = [
  'dashboard',
  'items',
  'tier-lists',
  'twitch',
  'stash',
  'hoarding',
  'recyclables',
  'loadouts',
  'settings',
  'help',
];

const DEFAULT_TAB: TabId = 'dashboard';

/**
 * Custom hook for managing tab navigation with URL synchronization
 *
 * Features:
 * - Syncs activeTab state with URL search params
 * - Enables browser back/forward navigation
 * - Validates tab parameters
 * - Provides type-safe navigation
 *
 * @returns {object} Object containing current tab and navigation function
 */
export function useTabNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Get tab from URL, default to 'dashboard'
  const urlTab = searchParams.get('tab');
  const validatedTab = (urlTab && VALID_TABS.includes(urlTab as TabId))
    ? (urlTab as TabId)
    : DEFAULT_TAB;

  // Track when component is mounted to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync URL with validated tab on mount
  useEffect(() => {
    if (!mounted) return;

    // If URL has invalid tab, update URL
    if (urlTab && !VALID_TABS.includes(urlTab as TabId)) {
      router.replace('/?tab=dashboard', { scroll: false });
    }
  }, [mounted, urlTab, router]);

  /**
   * Navigate to a new tab
   * Updates URL and creates browser history entry
   *
   * @param tab - The tab ID to navigate to
   */
  const setTab = (tab: TabId) => {
    if (!VALID_TABS.includes(tab)) {
      console.warn(`Invalid tab: ${tab}. Defaulting to dashboard.`);
      tab = DEFAULT_TAB;
    }

    // Update URL with new tab parameter
    // Use push (not replace) to create history entry for back/forward navigation
    const newUrl = `/?tab=${tab}`;
    router.push(newUrl, { scroll: false });
  };

  return {
    activeTab: validatedTab,
    setTab,
    mounted,
  };
}
