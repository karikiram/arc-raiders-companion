'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/context';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  slot: 'dashboard' | 'sidebar';
  className?: string;
}

// Ad sizes for different slots
const AD_CONFIG = {
  dashboard: {
    width: 728,
    height: 90,
    format: 'horizontal',
  },
  sidebar: {
    width: 300,
    height: 250,
    format: 'rectangle',
  },
};

export function AdBanner({ slot, className }: AdBannerProps) {
  const { hasAds } = useSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const config = AD_CONFIG[slot];

  useEffect(() => {
    if (!hasAds) return;

    // TODO: Initialize Google AdSense
    // Example AdSense initialization (uncomment when ready):
    // try {
    //   (window.adsbygoogle = window.adsbygoogle || []).push({});
    // } catch (e) {
    //   console.error('AdSense error:', e);
    // }
  }, [hasAds]);

  if (!hasAds) return null;

  return (
    <div
      className={cn(
        'relative bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden',
        className
      )}
      style={{
        minHeight: slot === 'sidebar' ? config.height : 'auto',
      }}
    >
      {/* Placeholder until AdSense is configured */}
      <div
        ref={adRef}
        className="flex flex-col items-center justify-center p-4 text-center"
        style={{
          minHeight: config.height,
        }}
      >
        {/* Ad Label */}
        <span className="absolute top-1 left-2 text-[10px] text-zinc-600 uppercase tracking-wider">
          Advertisement
        </span>

        {/* Placeholder Content - will be replaced with AdSense */}
        <div className="text-zinc-500 text-sm">
          <p>Ad space</p>
        </div>

        {/*
          Uncomment this when AdSense is ready:
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format={config.format === 'horizontal' ? 'horizontal' : 'auto'}
            data-full-width-responsive="true"
          />
        */}
      </div>
    </div>
  );
}

// Sidebar-specific ad wrapper
export function SidebarAd() {
  const { hasAds } = useSubscription();

  if (!hasAds) return null;

  return (
    <div className="p-2 border-t border-zinc-800">
      <AdBanner slot="sidebar" />
    </div>
  );
}

// Dashboard ad wrapper
export function DashboardAd() {
  const { hasAds } = useSubscription();

  if (!hasAds) return null;

  return (
    <div className="mt-6">
      <AdBanner slot="dashboard" className="w-full" />
    </div>
  );
}
