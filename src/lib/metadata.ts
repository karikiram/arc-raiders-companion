import type { Metadata } from 'next';
import type { TabId } from '@/hooks/useTabNavigation';

const SITE_URL = 'https://arc-companion.com';
const SITE_NAME = 'Arc Raiders Companion';

interface TabMetadata {
  title: string;
  description: string;
  keywords?: string[];
}

const TAB_METADATA: Record<TabId, TabMetadata> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Your Arc Raiders companion hub. Track inventory, manage loadouts, view live streams, and access tier lists all in one place.',
    keywords: ['Arc Raiders dashboard', 'game companion', 'raid planner'],
  },
  items: {
    title: 'Items Database',
    description: 'Complete database of all Arc Raiders items including weapons, materials, consumables, and equipment with detailed stats and information.',
    keywords: ['Arc Raiders items', 'weapon database', 'materials list', 'equipment guide'],
  },
  'tier-lists': {
    title: 'Weapon Tier Lists',
    description: 'PvP and PvE weapon tier lists for Arc Raiders. Find the best weapons for each situation and dominate the meta.',
    keywords: ['Arc Raiders tier list', 'best weapons', 'PvP tier list', 'PvE weapons', 'meta weapons'],
  },
  twitch: {
    title: 'Live Streams',
    description: 'Watch live Arc Raiders streams from top players and content creators. Learn strategies and stay updated with the community.',
    keywords: ['Arc Raiders streams', 'Twitch', 'live gameplay', 'top streamers'],
  },
  stash: {
    title: 'Raider Stash Tracker',
    description: 'Track your Arc Raiders inventory with smart KEEP/SELL/RECYCLE recommendations based on workshop upgrade requirements.',
    keywords: ['Arc Raiders stash', 'inventory tracker', 'stash management', 'item recommendations'],
  },
  hoarding: {
    title: 'Workshop Upgrades Guide',
    description: 'Complete guide to workshop station upgrades in Arc Raiders. Track materials needed for Gunsmith, Gear Bench, and all other stations.',
    keywords: ['workshop upgrades', 'crafting stations', 'Gunsmith upgrades', 'materials needed'],
  },
  recyclables: {
    title: 'Recycle & Sell Guide',
    description: 'Learn what items to recycle for materials vs sell for credits in Arc Raiders. Maximize your earnings and craft efficiently.',
    keywords: ['recycle guide', 'sell items', 'Arc Raiders economy', 'material farming'],
  },
  loadouts: {
    title: 'Loadout Builder',
    description: 'Create and save gear loadouts for Arc Raiders. Plan your raids with optimized weapon and equipment combinations.',
    keywords: ['loadout builder', 'gear planner', 'raid loadouts', 'equipment builds'],
  },
  settings: {
    title: 'Settings',
    description: 'Customize your Arc Raiders Companion experience with theme options and preferences.',
    keywords: ['settings', 'preferences', 'customization'],
  },
  help: {
    title: 'Help & FAQ',
    description: 'Get help using Arc Raiders Companion. Find answers to common questions and learn how to make the most of your companion app.',
    keywords: ['help', 'FAQ', 'support', 'guide'],
  },
};

/**
 * Generate metadata for a specific tab
 */
export function generateTabMetadata(tab: TabId = 'dashboard'): Metadata {
  const tabMeta = TAB_METADATA[tab] || TAB_METADATA.dashboard;
  const fullTitle = `${tabMeta.title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: tabMeta.description,
    keywords: tabMeta.keywords,
    openGraph: {
      title: fullTitle,
      description: tabMeta.description,
      url: `${SITE_URL}/?tab=${tab}`,
      siteName: SITE_NAME,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - ${tabMeta.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: tabMeta.description,
      images: ['/og-image.png'],
    },
  };
}

/**
 * Get page title for a specific tab (for document.title updates)
 */
export function getTabTitle(tab: TabId = 'dashboard'): string {
  const tabMeta = TAB_METADATA[tab] || TAB_METADATA.dashboard;
  return `${tabMeta.title} | ${SITE_NAME}`;
}
