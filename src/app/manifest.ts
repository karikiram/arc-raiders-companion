import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arc Raiders Companion',
    short_name: 'ARC Companion',
    description: 'The ultimate Arc Raiders companion app. Track your stash, get smart KEEP/SELL/RECYCLE recommendations, manage workshop upgrades, and plan loadouts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    dir: 'ltr',
    categories: ['games', 'utilities', 'entertainment'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    shortcuts: [
      {
        name: 'Raider Stash',
        short_name: 'Stash',
        description: 'Manage your inventory',
        url: '/?tab=stash',
      },
      {
        name: 'Workshop Upgrades',
        short_name: 'Workshop',
        description: 'Track upgrade requirements',
        url: '/?tab=hoarding',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
