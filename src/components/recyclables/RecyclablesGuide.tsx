'use client';

import { useState, useMemo } from 'react';
import {
  Recycle,
  DollarSign,
  AlertTriangle,
  Package,
  Search,
  Info,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Filter,
  X,
  ChevronDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ITEMS } from '@/data/items';
import {
  RECYCLABLE_ITEMS,
  TRINKET_ITEMS,
  RECYCLABLES_TIPS,
  getMaterialRarity,
  type ItemAction,
  type RecyclableItem,
  type TrinketItem,
} from '@/data/recyclables';
import { useProgress } from '@/context';
import type { Rarity } from '@/types';

// Extended types with dynamic recommendation
interface DynamicRecyclableItem extends RecyclableItem {
  effectiveRecommendation: ItemAction;
  isReleased: boolean;
}

interface DynamicTrinketItem extends TrinketItem {
  effectiveRecommendation: 'sell' | 'keep';
  isReleased: boolean;
}

type ViewMode = 'all' | 'recycle' | 'sell' | 'keep';

const actionColors: Record<ItemAction, string> = {
  recycle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  sell: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  either: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  keep: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const actionLabels: Record<ItemAction, string> = {
  recycle: 'Recycle',
  sell: 'Sell',
  either: 'Either',
  keep: 'Keep',
};

const actionIcons: Record<ItemAction, typeof Recycle> = {
  recycle: Recycle,
  sell: DollarSign,
  either: Sparkles,
  keep: AlertTriangle,
};

const rarityBgColors: Record<Rarity, string> = {
  common: 'bg-zinc-700',
  uncommon: 'bg-green-900/50',
  rare: 'bg-blue-900/50',
  epic: 'bg-purple-900/50',
  legendary: 'bg-amber-900/50',
};

const rarityConfig: Record<Rarity, { label: string; color: string }> = {
  common: { label: 'Common', color: 'bg-zinc-600 text-zinc-200' },
  uncommon: { label: 'Uncommon', color: 'bg-green-600 text-green-100' },
  rare: { label: 'Rare', color: 'bg-blue-600 text-blue-100' },
  epic: { label: 'Epic', color: 'bg-purple-600 text-purple-100' },
  legendary: { label: 'Legendary', color: 'bg-amber-600 text-amber-100' },
};

// Material tag colors based on rarity
const materialRarityColors: Record<Rarity, string> = {
  common: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  uncommon: 'bg-green-900/30 text-green-400 border-green-700/50',
  rare: 'bg-blue-900/30 text-blue-400 border-blue-700/50',
  epic: 'bg-purple-900/30 text-purple-400 border-purple-700/50',
  legendary: 'bg-amber-900/30 text-amber-400 border-amber-700/50',
};

const ALL_RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function RecyclablesGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [activeTab, setActiveTab] = useState<'recyclables' | 'trinkets'>('recyclables');
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { isItemStillRequired, loading, progress } = useProgress();

  // Calculate dynamic recommendations for recyclables
  // Adding progress as a dependency ensures re-computation when upgrades are marked complete
  const dynamicRecyclables = useMemo((): DynamicRecyclableItem[] => {
    return RECYCLABLE_ITEMS.map(item => {
      const stillRequired = isItemStillRequired(item.itemId);
      const wasKeep = item.recommendation === 'keep';

      let effectiveRecommendation = item.recommendation;
      if (wasKeep && !stillRequired) {
        if (item.recycleValue && item.recycleValue > item.sellPrice) {
          effectiveRecommendation = 'recycle';
        } else {
          effectiveRecommendation = 'sell';
        }
      }

      return {
        ...item,
        effectiveRecommendation,
        isReleased: wasKeep && !stillRequired,
      };
    });
  }, [isItemStillRequired, progress]);

  // Calculate dynamic recommendations for trinkets
  const dynamicTrinkets = useMemo((): DynamicTrinketItem[] => {
    return TRINKET_ITEMS.map(item => {
      const stillRequired = isItemStillRequired(item.itemId);
      const wasKeep = item.recommendation === 'keep';

      return {
        ...item,
        effectiveRecommendation: (wasKeep && !stillRequired) ? 'sell' : item.recommendation,
        isReleased: wasKeep && !stillRequired,
      };
    });
  }, [isItemStillRequired, progress]);

  // Get unique materials from recyclables for filtering
  const availableMaterials = useMemo(() => {
    const mats = new Set<string>();
    RECYCLABLE_ITEMS.forEach(item => {
      item.recycleYield?.forEach(mat => mats.add(mat.material));
    });
    return Array.from(mats).sort();
  }, []);

  // Filter recyclable items
  const filteredRecyclables = useMemo(() => {
    let items = dynamicRecyclables;

    // View mode filter - 'either' items should appear in both recycle and sell views
    if (viewMode === 'recycle') {
      items = items.filter(item =>
        item.effectiveRecommendation === 'recycle' || item.effectiveRecommendation === 'either'
      );
    } else if (viewMode === 'sell') {
      items = items.filter(item =>
        item.effectiveRecommendation === 'sell' || item.effectiveRecommendation === 'either'
      );
    } else if (viewMode === 'keep') {
      items = items.filter(item => item.effectiveRecommendation === 'keep');
    }

    // Rarity filter
    if (selectedRarities.length > 0) {
      items = items.filter(item => selectedRarities.includes(item.rarity));
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.itemName.toLowerCase().includes(query) ||
        item.recycleYield?.some(mat => mat.material.toLowerCase().includes(query))
      );
    }

    return items.sort((a, b) => b.sellPrice - a.sellPrice);
  }, [viewMode, searchQuery, dynamicRecyclables, selectedRarities]);

  // Filter trinket items
  const filteredTrinkets = useMemo(() => {
    let items = dynamicTrinkets;

    if (viewMode === 'keep') {
      items = items.filter(item => item.effectiveRecommendation === 'keep');
    } else if (viewMode === 'sell') {
      items = items.filter(item => item.effectiveRecommendation === 'sell');
    }

    // Rarity filter
    if (selectedRarities.length > 0) {
      items = items.filter(item => selectedRarities.includes(item.rarity));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.itemName.toLowerCase().includes(query)
      );
    }

    return items.sort((a, b) => b.sellPrice - a.sellPrice);
  }, [viewMode, searchQuery, dynamicTrinkets, selectedRarities]);

  // Calculate stats based on dynamic recommendations
  // 'either' items count toward both recycle and sell totals
  const stats = useMemo(() => {
    const recycleCount = dynamicRecyclables.filter(i =>
      i.effectiveRecommendation === 'recycle' || i.effectiveRecommendation === 'either'
    ).length;
    const sellCount = dynamicRecyclables.filter(i =>
      i.effectiveRecommendation === 'sell' || i.effectiveRecommendation === 'either'
    ).length + dynamicTrinkets.filter(i => i.effectiveRecommendation === 'sell').length;
    const keepCount = dynamicRecyclables.filter(i => i.effectiveRecommendation === 'keep').length +
                      dynamicTrinkets.filter(i => i.effectiveRecommendation === 'keep').length;
    const releasedCount = dynamicRecyclables.filter(i => i.isReleased).length +
                          dynamicTrinkets.filter(i => i.isReleased).length;

    return { recycleCount, sellCount, keepCount, releasedCount };
  }, [dynamicRecyclables, dynamicTrinkets]);

  const activeFilterCount = selectedRarities.length;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRarities([]);
    setViewMode('all');
  };

  const toggleRarity = (rarity: Rarity) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Recyclables & Sellables</h1>
        <p className="text-zinc-400 mt-1">
          Know what to recycle, sell, or keep for maximum value
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
            <Recycle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.recycleCount}</p>
          <p className="text-sm text-zinc-500">Best to Recycle</p>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.sellCount}</p>
          <p className="text-sm text-zinc-500">Safe to Sell</p>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.keepCount}</p>
          <p className="text-sm text-zinc-500">Must Keep</p>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.releasedCount}</p>
          <p className="text-sm text-zinc-500">Released Items</p>
        </div>
      </div>

      {/* Tips */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {RECYCLABLES_TIPS.slice(0, 4).map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <span className={`mt-0.5 ${tip.priority === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
                  {tip.priority === 'critical' ? '!' : '*'}
                </span>
                <span className="text-zinc-400">
                  <span className="font-medium text-zinc-200">{tip.title}:</span> {tip.description}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search items or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle & Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* Rarity Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
                activeFilterCount > 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-700'
              )}
            >
              <Filter className="w-4 h-4" />
              Rarity
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-black text-xs px-1.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
            </button>

            {/* View Mode Buttons */}
            {(['all', 'recycle', 'sell', 'keep'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                }`}
              >
                {mode === 'all' ? 'All' : mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}

            {/* Clear All */}
            {(activeFilterCount > 0 || searchQuery || viewMode !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Rarity Filter Dropdown */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 p-3 bg-zinc-800/50 rounded-lg">
            <span className="text-xs text-zinc-500 w-full mb-1">Filter by Rarity:</span>
            {ALL_RARITIES.map(rarity => (
              <button
                key={rarity}
                onClick={() => toggleRarity(rarity)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
                  selectedRarities.includes(rarity)
                    ? rarityConfig[rarity].color + ' border-transparent'
                    : 'text-zinc-400 hover:text-white bg-zinc-800 border-zinc-700'
                )}
              >
                {rarityConfig[rarity].label}
              </button>
            ))}
          </div>
        )}

        {/* Active Filters Display */}
        {selectedRarities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedRarities.map(rarity => (
              <span
                key={rarity}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
                  rarityConfig[rarity].color
                )}
              >
                {rarityConfig[rarity].label}
                <button
                  onClick={() => toggleRarity(rarity)}
                  className="opacity-70 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('recyclables')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'recyclables'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Recycle className="w-4 h-4 inline mr-2" />
          Recyclables ({filteredRecyclables.length})
        </button>
        <button
          onClick={() => setActiveTab('trinkets')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'trinkets'
              ? 'bg-amber-500/10 text-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Trinkets ({filteredTrinkets.length})
        </button>
      </div>

      {/* Recyclables Grid */}
      {activeTab === 'recyclables' && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecyclables.map((item) => {
            const itemData = ITEMS[item.itemId];
            const ActionIcon = actionIcons[item.effectiveRecommendation];
            const showWarning = item.warning && !item.isReleased;

            return (
              <Card key={item.itemId} className={cn(
                showWarning && 'border-red-500/30',
                item.isReleased && 'border-emerald-500/30'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Item Image */}
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0',
                      rarityBgColors[item.rarity]
                    )}>
                      {itemData?.imageUrl ? (
                        <img
                          src={itemData.imageUrl}
                          alt={item.itemName}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-white truncate">{item.itemName}</h3>
                        <div className="flex items-center gap-1">
                          {item.isReleased && (
                            <span className="text-xs px-2 py-0.5 rounded border flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" />
                              Released
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${actionColors[item.effectiveRecommendation]}`}>
                            <ActionIcon className="w-3 h-3" />
                            {actionLabels[item.effectiveRecommendation]}
                          </span>
                        </div>
                      </div>

                      {/* Rarity Badge */}
                      <span className={cn(
                        'inline-block text-xs px-1.5 py-0.5 rounded mt-1',
                        rarityConfig[item.rarity].color
                      )}>
                        {rarityConfig[item.rarity].label}
                      </span>

                      {/* Prices */}
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-zinc-400">
                          Sell: <span className="text-amber-400">{item.sellPrice} CR</span>
                        </span>
                        {item.recycleValue && (
                          <>
                            <ArrowRight className="w-3 h-3 text-zinc-600" />
                            <span className="text-zinc-400">
                              Recycle: <span className="text-emerald-400">~{item.recycleValue} CR</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Recycle Yield */}
                      {item.recycleYield && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.recycleYield.map((mat, idx) => {
                            const matRarity = getMaterialRarity(mat.material);
                            return (
                              <span
                                key={idx}
                                className={cn(
                                  'text-xs px-1.5 py-0.5 rounded border',
                                  materialRarityColors[matRarity]
                                )}
                              >
                                {mat.quantity}x {mat.material}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Reason/Warning */}
                      {item.isReleased ? (
                        <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Upgrade complete - safe to {item.effectiveRecommendation}!
                        </p>
                      ) : showWarning ? (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.warning}
                        </p>
                      ) : item.reason && (
                        <p className="mt-2 text-xs text-zinc-500">{item.reason}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredRecyclables.length === 0 && (
            <div className="col-span-full text-center py-8 text-zinc-500">
              No items match your filters
            </div>
          )}
        </div>
      )}

      {/* Trinkets Grid */}
      {activeTab === 'trinkets' && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrinkets.map((item) => {
            const itemData = ITEMS[item.itemId];
            const isKeep = item.effectiveRecommendation === 'keep';
            const showWarning = item.warning && !item.isReleased;

            return (
              <Card key={item.itemId} className={cn(
                isKeep && !item.isReleased && 'border-red-500/30',
                item.isReleased && 'border-emerald-500/30'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Item Image */}
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0',
                      rarityBgColors[item.rarity]
                    )}>
                      {itemData?.imageUrl ? (
                        <img
                          src={itemData.imageUrl}
                          alt={item.itemName}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-white truncate">{item.itemName}</h3>
                        <div className="flex items-center gap-1">
                          {item.isReleased && (
                            <span className="text-xs px-2 py-0.5 rounded border flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" />
                              Released
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${
                            isKeep ? actionColors.keep : actionColors.sell
                          }`}>
                            {isKeep ? (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                Keep
                              </>
                            ) : (
                              <>
                                <DollarSign className="w-3 h-3" />
                                Sell
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Rarity Badge */}
                      <span className={cn(
                        'inline-block text-xs px-1.5 py-0.5 rounded mt-1',
                        rarityConfig[item.rarity].color
                      )}>
                        {rarityConfig[item.rarity].label}
                      </span>

                      {/* Price */}
                      <div className="mt-1 text-sm">
                        <span className="text-zinc-400">
                          Value: <span className="text-amber-400">{item.sellPrice} CR</span>
                        </span>
                      </div>

                      {/* Reason/Warning */}
                      {item.isReleased ? (
                        <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Scrappy upgrade complete - safe to sell!
                        </p>
                      ) : showWarning ? (
                        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.warning}
                        </p>
                      ) : item.reason && (
                        <p className="mt-2 text-xs text-zinc-500">{item.reason}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {filteredTrinkets.length === 0 && (
            <div className="col-span-full text-center py-8 text-zinc-500">
              No items match your filters
            </div>
          )}
        </div>
      )}
    </div>
  );
}
