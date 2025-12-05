'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ExternalLink,
  Newspaper,
  Loader2,
} from 'lucide-react';
import { TwitchStreams } from '@/components/twitch/TwitchStreams';
import { FeatureCarousel } from './FeatureCarousel';
import type { TabId } from '@/hooks/useTabNavigation';

interface DashboardProps {
  onNavigate: (tab: TabId) => void;
}

interface NewsArticle {
  title: string;
  date: string;
  url: string;
  imageUrl: string;
}

// Static news data - updated periodically
const LATEST_NEWS: NewsArticle[] = [
  {
    title: 'The Evolution of ARC Raiders EP3: Building ARC Machines',
    date: 'December 4, 2025',
    url: 'https://arcraiders.com/news/evolution-of-arc-raiders-episode-3',
    imageUrl: 'https://storage.googleapis.com/web-arc-raiders-cms-assets/article-cards/4744f8eb-766c-evolution-of-arc-raiders-episode-3-card-300x200-300x200.png',
  },
  {
    title: 'The Evolution of ARC Raiders EP2: The Life of a Raider',
    date: 'November 27, 2025',
    url: 'https://arcraiders.com/news/evolution-of-arc-raiders-episode-2',
    imageUrl: 'https://storage.googleapis.com/web-arc-raiders-cms-assets/article-cards/841e3a73-8b77-evolution-of-arc-raiders-episode-2-card-300x200-300x200.png',
  },
  {
    title: 'Patch Notes - Update 1.4.0',
    date: 'November 27, 2025',
    url: 'https://arcraiders.com/news/patch-notes-1-4-0',
    imageUrl: 'https://storage.googleapis.com/web-arc-raiders-cms-assets/article-cards/9e3c79ed-5383-patch-notes-1-4-0-card-300x200-300x200.png',
  },
  {
    title: 'A Scrappy Origin Story',
    date: 'November 26, 2025',
    url: 'https://arcraiders.com/news/the-story-of-scrappy-the-rooster',
    imageUrl: 'https://storage.googleapis.com/web-arc-raiders-cms-assets/article-cards/f420ae0c-62c2-the-story-of-scrappy-the-rooster-card-300x200-300x200.png',
  },
];

function NewsCard({ article }: { article: NewsArticle }) {
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all hover:scale-[1.02]"
      >
        <div className="relative h-32 sm:h-36 bg-zinc-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-zinc-500 mb-1">{article.date}</p>
          <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors flex-1">
            {article.title}
          </h4>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2 group-hover:text-accent transition-colors">
            <span>Read more</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-32 sm:h-36 bg-zinc-800 overflow-hidden">
        {!imageError ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-zinc-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-zinc-500 mb-1">{article.date}</p>
        <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors flex-1">
          {article.title}
        </h4>
        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2 group-hover:text-accent transition-colors">
          <span>Read more</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </a>
  );
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section with Background Image */}
      <div className="relative -mx-6 -mt-6 lg:-mx-8 lg:-mt-8 overflow-hidden scale-in">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images8.alphacoders.com/140/thumb-1920-1402588.png)',
            backgroundPosition: 'center 30%',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/80 to-zinc-950" />

        {/* Hero Content */}
        <div className="relative px-6 lg:px-8 pt-12 pb-20 md:pt-16 md:pb-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              Dominate the
              <span className="block text-accent">Frontier</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-xl">
              Your ultimate Arc Raiders companion. Master the meta, optimize your loot, and upgrade smarter.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Carousel */}
      <FeatureCarousel onNavigate={onNavigate} />

      {/* Twitch Streams Section */}
      <div className="pt-4 slide-up delay-300">
        <TwitchStreams limit={3} showHeader={true} compact={true} />
      </div>

      {/* Latest News Section */}
      <div className="pt-4 slide-up delay-400">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Latest News</h2>
              <p className="text-sm text-zinc-500">From arcraiders.com</p>
            </div>
          </div>
          <a
            href="https://arcraiders.com/news"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-accent transition-colors"
          >
            View all <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LATEST_NEWS.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </div>

      {/* Art Attribution */}
      <p className="text-center text-xs text-zinc-600 pt-4">
        Background art © Embark Studios. Arc Raiders Companion is a fan-made tool.
      </p>
    </div>
  );
}
