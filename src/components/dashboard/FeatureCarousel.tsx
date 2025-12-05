'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Recycle,
  Hammer,
  Trophy,
  ArrowRight,
  Database,
  Tv,
  Package,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { TabId } from '@/hooks/useTabNavigation';
import type { LucideIcon } from 'lucide-react';

interface FeatureCard {
  id: TabId;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  badgeColor: string;
  bgGradient: string;
  borderColor: string;
  hoverBorderColor: string;
  hoverShadowColor: string;
  iconColor: string;
  iconBgColor: string;
}

// Priority cards shown first
const FEATURE_CARDS: FeatureCard[] = [
  // Priority cards (current 3)
  {
    id: 'tier-lists',
    title: 'Weapon Tier Lists',
    description: 'PvP & PvE weapon rankings. Know which guns dominate the meta and which to avoid.',
    icon: Trophy,
    badge: 'Hot',
    badgeColor: 'bg-rose-500/20 text-rose-400',
    bgGradient: 'from-rose-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-rose-700/30',
    hoverBorderColor: 'hover:border-rose-500/60',
    hoverShadowColor: 'hover:shadow-rose-500/10',
    iconColor: 'text-rose-400',
    iconBgColor: 'bg-rose-500/20',
  },
  {
    id: 'recyclables',
    title: 'Recycle & Sell Guide',
    description: 'Maximize your earnings. Know exactly what to recycle for materials vs sell for credits.',
    icon: Recycle,
    badge: 'Essential',
    badgeColor: 'bg-emerald-500/20 text-emerald-400',
    bgGradient: 'from-emerald-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-emerald-700/30',
    hoverBorderColor: 'hover:border-emerald-500/60',
    hoverShadowColor: 'hover:shadow-emerald-500/10',
    iconColor: 'text-emerald-400',
    iconBgColor: 'bg-emerald-500/20',
  },
  {
    id: 'hoarding',
    title: 'Workshop Upgrades',
    description: 'Track materials needed for upgrades. Never accidentally sell critical crafting items.',
    icon: Hammer,
    badge: 'Plan Ahead',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    bgGradient: 'from-amber-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-amber-700/30',
    hoverBorderColor: 'hover:border-amber-500/60',
    hoverShadowColor: 'hover:shadow-amber-500/10',
    iconColor: 'text-amber-400',
    iconBgColor: 'bg-amber-500/20',
  },
  // Additional cards
  {
    id: 'items',
    title: 'Items Database',
    description: 'Complete database of all items, weapons, and materials with detailed stats and information.',
    icon: Database,
    badge: 'Reference',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    bgGradient: 'from-blue-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-blue-700/30',
    hoverBorderColor: 'hover:border-blue-500/60',
    hoverShadowColor: 'hover:shadow-blue-500/10',
    iconColor: 'text-blue-400',
    iconBgColor: 'bg-blue-500/20',
  },
  {
    id: 'twitch',
    title: 'Live Streams',
    description: 'Watch top Arc Raiders streamers live. Learn strategies and stay connected with the community.',
    icon: Tv,
    badge: 'Live',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    bgGradient: 'from-purple-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-purple-700/30',
    hoverBorderColor: 'hover:border-purple-500/60',
    hoverShadowColor: 'hover:shadow-purple-500/10',
    iconColor: 'text-purple-400',
    iconBgColor: 'bg-purple-500/20',
  },
  {
    id: 'stash',
    title: 'Raider Stash',
    description: 'Smart inventory tracking with KEEP/SELL/RECYCLE recommendations based on your progress.',
    icon: Package,
    badge: 'Smart',
    badgeColor: 'bg-cyan-500/20 text-cyan-400',
    bgGradient: 'from-cyan-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-cyan-700/30',
    hoverBorderColor: 'hover:border-cyan-500/60',
    hoverShadowColor: 'hover:shadow-cyan-500/10',
    iconColor: 'text-cyan-400',
    iconBgColor: 'bg-cyan-500/20',
  },
  {
    id: 'loadouts',
    title: 'Loadouts',
    description: 'Create and save gear loadouts for different playstyles. Plan your raids and dominate.',
    icon: Shirt,
    badge: 'Tactical',
    badgeColor: 'bg-orange-500/20 text-orange-400',
    bgGradient: 'from-orange-900/40 via-zinc-900 to-zinc-900',
    borderColor: 'border-orange-700/30',
    hoverBorderColor: 'hover:border-orange-500/60',
    hoverShadowColor: 'hover:shadow-orange-500/10',
    iconColor: 'text-orange-400',
    iconBgColor: 'bg-orange-500/20',
  },
];

interface FeatureCarouselProps {
  onNavigate: (tab: TabId) => void;
}

export function FeatureCarousel({ onNavigate }: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-rotate every 6 seconds (common carousel timing)
  useEffect(() => {
    if (isPaused || isAnimating) return;

    const interval = setInterval(() => {
      setDirection('right');
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % FEATURE_CARDS.length);
      setTimeout(() => setIsAnimating(false), 600);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, isAnimating]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % FEATURE_CARDS.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Get visible cards based on screen size
  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % FEATURE_CARDS.length;
      cards.push(FEATURE_CARDS[index]);
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <div className="-mt-16 relative z-10">
      <div
        ref={carouselRef}
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-accent/50 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-accent/20 hidden md:flex backdrop-blur-sm"
          aria-label="Previous cards"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:text-accent transition-colors" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 hover:border-accent/50 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-accent/20 hidden md:flex backdrop-blur-sm"
          aria-label="Next cards"
          disabled={isAnimating}
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:text-accent transition-colors" />
        </button>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={`${card.id}-${currentIndex}-${idx}`}
                onClick={() => onNavigate(card.id)}
                className={`group relative p-6 bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} rounded-2xl text-left ${card.hoverBorderColor} transition-glow cursor-pointer hover:scale-[1.03] hover:shadow-2xl ${card.hoverShadowColor} fade-in-smooth ${
                  idx > 1 ? 'hidden lg:block' : idx > 0 ? 'hidden md:block' : ''
                } ${idx === 0 ? '' : idx === 1 ? 'delay-100' : 'delay-200'}`}
                style={{
                  willChange: 'transform, opacity',
                }}
              >
                {/* Glow overlay on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.bgGradient} opacity-20 blur-xl`} />
                </div>

                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
                  <Icon className={`w-20 h-20 ${card.iconColor}`} />
                </div>
                <div className="relative">
                  <div className={`w-14 h-14 ${card.iconBgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className={`w-7 h-7 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <div className={`inline-block px-2 py-0.5 ${card.badgeColor} text-xs font-bold rounded mb-3 uppercase tracking-wider group-hover:scale-105 transition-transform duration-200`}>
                    {card.badge}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-opacity-90 transition-all duration-200">{card.title}</h3>
                  <p className="text-zinc-400 mb-4 text-sm group-hover:text-zinc-300 transition-colors duration-200">{card.description}</p>
                  <span className={`inline-flex items-center gap-1 ${card.iconColor} font-semibold group-hover:gap-2 transition-all duration-300`}>
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {FEATURE_CARDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-accent'
                  : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
