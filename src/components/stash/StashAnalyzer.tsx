'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  Recycle,
  ShoppingCart,
  Zap,
  Filter,
  Search,
  Trash2,
  Minus,
  Plus,
  X,
  AlertTriangle,
  Cloud,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { analyzeFullStash, getStashSummary } from '@/lib/stashAnalyzer';
import { ITEMS } from '@/data';
import { useAuth } from '@/context';
import type { StashItem, StashAnalysis, RecommendAction } from '@/types';

const SIGNIN_BANNER_DISMISSED_KEY = 'arc-raiders-stash-signin-banner-dismissed';

interface StashAnalyzerProps {
  stash: StashItem[];
  activeQuests: string[];
  completedQuests: string[];
  hideoutLevels: Record<string, number>;
  onRemoveItem: (itemId: string, quantity: number) => void;
  onClearStash: () => void;
  onSignIn?: () => void;
}

const actionIcons: Record<RecommendAction, typeof Package> = {
  keep: Package,
  sell: ShoppingCart,
  recycle: Recycle,
  use: Zap,
};

const actionLabels: Record<RecommendAction, string> = {
  keep: 'Keep',
  sell: 'Sell',
  recycle: 'Recycle',
  use: 'Quick Use',
};

export function StashAnalyzer({
  stash,
  activeQuests,
  completedQuests,
  hideoutLevels,
  onRemoveItem,
  onClearStash,
  onSignIn,
}: StashAnalyzerProps) {
  const [filter, setFilter] = useState<RecommendAction | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [signInBannerDismissed, setSignInBannerDismissed] = useState(true);

  const { user } = useAuth();

  // Load banner dismissal state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem(SIGNIN_BANNER_DISMISSED_KEY);
    setSignInBannerDismissed(dismissed === 'true');
  }, []);

  const dismissSignInBanner = () => {
    setSignInBannerDismissed(true);
    localStorage.setItem(SIGNIN_BANNER_DISMISSED_KEY, 'true');
  };

  const analyses = useMemo(() => {
    return analyzeFullStash(stash, {
      activeQuests,
      completedQuests,
      hideoutLevels,
    });
  }, [stash, activeQuests, completedQuests, hideoutLevels]);

  const summary = useMemo(() => getStashSummary(analyses), [analyses]);

  // Calculate total stash value
  const totalStashValue = useMemo(() => {
    return stash.reduce((total, stashItem) => {
      const item = ITEMS[stashItem.itemId];
      if (item) {
        return total + (item.baseValue * stashItem.quantity);
      }
      return total;
    }, 0);
  }, [stash]);

  const filteredAnalyses = useMemo(() => {
    let filtered = analyses;

    if (filter !== 'all') {
      filtered = filtered.filter((a) => a.recommendation === filter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a) =>
        a.item.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [analyses, filter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Sign-in Banner for guests */}
      {!user && !signInBannerDismissed && (
        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Cloud className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-200">
              Your stash is saved locally on this device.{' '}
              <button
                onClick={onSignIn}
                className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
              >
                Sign in
              </button>{' '}
              to sync across all your devices and never lose your data.
            </p>
          </div>
          <button
            onClick={dismissSignInBanner}
            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Package}
          label="Keep"
          value={summary.keep}
          color="emerald"
          active={filter === 'keep'}
          onClick={() => setFilter(filter === 'keep' ? 'all' : 'keep')}
        />
        <SummaryCard
          icon={ShoppingCart}
          label="Sell"
          value={summary.sell}
          subtext={`≈ ${summary.totalValue.toLocaleString()} credits`}
          color="amber"
          active={filter === 'sell'}
          onClick={() => setFilter(filter === 'sell' ? 'all' : 'sell')}
        />
        <SummaryCard
          icon={Recycle}
          label="Recycle"
          value={summary.recycle}
          color="cyan"
          active={filter === 'recycle'}
          onClick={() => setFilter(filter === 'recycle' ? 'all' : 'recycle')}
        />
        <SummaryCard
          icon={Zap}
          label="Use"
          value={summary.use}
          color="violet"
          active={filter === 'use'}
          onClick={() => setFilter(filter === 'use' ? 'all' : 'use')}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        {filter !== 'all' && (
          <Button variant="ghost" onClick={() => setFilter('all')}>
            Clear Filter
          </Button>
        )}
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700">
          <span className="text-sm text-zinc-400">Total Value:</span>
          <span className="text-lg font-bold text-amber-400">
            {totalStashValue.toLocaleString()} cr
          </span>
        </div>
        {stash.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Clear Stash</span>
          </button>
        )}
      </div>

      {/* Clear Stash Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Clear Entire Stash?</h3>
                <p className="text-sm text-zinc-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-zinc-300 mb-6">
              You are about to remove <span className="font-bold text-white">{stash.length} items</span> worth{' '}
              <span className="font-bold text-amber-400">{totalStashValue.toLocaleString()} credits</span> from your stash.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearStash();
                  setShowClearConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Stash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Raider Stash</span>
            <span className="text-sm font-normal text-zinc-400">
              {filteredAnalyses.length} items
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAnalyses.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              {stash.length === 0
                ? 'Your stash is empty. Add items to get personalized recommendations.'
                : 'No items match your search or filter.'}
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {filteredAnalyses.map((analysis) => (
                <StashItemRow
                  key={analysis.itemId}
                  analysis={analysis}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  icon: typeof Package;
  label: string;
  value: number;
  subtext?: string;
  color: 'emerald' | 'amber' | 'cyan' | 'violet';
  active?: boolean;
  onClick?: () => void;
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  active,
  onClick,
}: SummaryCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border transition-all text-left',
        active
          ? colorClasses[color]
          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          className={cn(
            'w-5 h-5',
            active ? '' : 'text-zinc-500'
          )}
        />
        <span
          className={cn(
            'text-sm font-medium',
            active ? '' : 'text-zinc-400'
          )}
        >
          {label}
        </span>
      </div>
      <p className={cn('text-2xl font-bold', active ? '' : 'text-white')}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-zinc-500 mt-1">{subtext}</p>
      )}
    </button>
  );
}

interface StashItemRowProps {
  analysis: StashAnalysis;
  onRemoveItem: (itemId: string, quantity: number) => void;
}

function StashItemRow({ analysis, onRemoveItem }: StashItemRowProps) {
  const Icon = actionIcons[analysis.recommendation];
  const [showRemoveControls, setShowRemoveControls] = useState(false);
  const [removeQuantity, setRemoveQuantity] = useState(1);

  const handleRemove = () => {
    onRemoveItem(analysis.itemId, removeQuantity);
    setShowRemoveControls(false);
    setRemoveQuantity(1);
  };

  const handleQuickRemove = () => {
    if (analysis.quantity === 1) {
      // If only 1 item, remove it directly
      onRemoveItem(analysis.itemId, 1);
    } else {
      // Show quantity selector
      setShowRemoveControls(true);
      setRemoveQuantity(1);
    }
  };

  return (
    <div className="hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center gap-4 p-4">
        {/* Item Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0',
            {
              'bg-zinc-700': analysis.item.rarity === 'common',
              'bg-green-900/50': analysis.item.rarity === 'uncommon',
              'bg-blue-900/50': analysis.item.rarity === 'rare',
              'bg-purple-900/50': analysis.item.rarity === 'epic',
              'bg-amber-900/50': analysis.item.rarity === 'legendary',
            }
          )}
        >
          {analysis.item.imageUrl ? (
            <img
              src={analysis.item.imageUrl}
              alt={analysis.item.name}
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <Package className={cn('w-6 h-6 text-zinc-400', analysis.item.imageUrl && 'hidden')} />
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white truncate">
              {analysis.item.name}
            </h4>
            <Badge variant="rarity" rarity={analysis.item.rarity}>
              {analysis.item.rarity}
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 truncate">{analysis.reason}</p>
        </div>

        {/* Quantity */}
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-semibold text-white">×{analysis.quantity}</p>
          <p className="text-xs text-zinc-500">
            {(analysis.item.baseValue * analysis.quantity).toLocaleString()} cr
          </p>
        </div>

        {/* Recommendation Badge */}
        <Badge variant="action" action={analysis.recommendation} className="gap-1 flex-shrink-0">
          <Icon className="w-3 h-3" />
          {actionLabels[analysis.recommendation]}
        </Badge>

        {/* Remove Button */}
        <button
          onClick={handleQuickRemove}
          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
          title="Remove from stash"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Remove Quantity Controls */}
      {showRemoveControls && (
        <div className="px-4 pb-4 flex items-center gap-3 border-t border-zinc-800 pt-3 ml-16">
          <span className="text-sm text-zinc-400">Remove quantity:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setRemoveQuantity(Math.max(1, removeQuantity - 1))}
              className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={removeQuantity}
              onChange={(e) => setRemoveQuantity(Math.max(1, Math.min(analysis.quantity, parseInt(e.target.value) || 1)))}
              className="w-16 text-center py-1.5 bg-zinc-700 border border-zinc-600 rounded text-white text-sm font-bold"
              min={1}
              max={analysis.quantity}
            />
            <button
              onClick={() => setRemoveQuantity(Math.min(analysis.quantity, removeQuantity + 1))}
              className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setRemoveQuantity(analysis.quantity)}
            className="px-2 py-1.5 text-xs bg-zinc-700 text-zinc-300 rounded hover:bg-zinc-600"
          >
            All ({analysis.quantity})
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setShowRemoveControls(false)}
            className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleRemove}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Remove {removeQuantity}
          </button>
        </div>
      )}
    </div>
  );
}
