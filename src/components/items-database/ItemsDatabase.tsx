'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, X, Filter, Package, Database, Layers, Sparkles, ChevronDown as LoadMore } from 'lucide-react';
import { ITEMS } from '@/data';
import { cn } from '@/lib/utils';
import type { ItemCategory, Rarity, Item } from '@/types';

// Category display names
const CATEGORY_LABELS: Record<ItemCategory, string> = {
  weapon: 'Weapons',
  modification: 'Modifications',
  quick_use: 'Quick Use',
  throwable: 'Throwables',
  blueprint: 'Blueprints',
  basic_material: 'Basic Materials',
  topside_material: 'Topside Materials',
  refined_material: 'Refined Materials',
  advanced_material: 'Advanced Materials',
  recyclable: 'Recyclables',
  trinket: 'Trinkets',
  key: 'Keys',
  ammunition: 'Ammunition',
  augment: 'Augments',
  gadget: 'Gadgets',
  nature: 'Nature',
  consumable: 'Consumables',
  quest_item: 'Quest Items',
};

// Rarity configuration
const RARITY_CONFIG: Record<Rarity, { label: string; bgClass: string; textClass: string; borderClass: string }> = {
  common: { label: 'Common', bgClass: 'bg-zinc-700', textClass: 'text-zinc-300', borderClass: 'border-zinc-600' },
  uncommon: { label: 'Uncommon', bgClass: 'bg-green-900/50', textClass: 'text-green-400', borderClass: 'border-green-600/50' },
  rare: { label: 'Rare', bgClass: 'bg-blue-900/50', textClass: 'text-blue-400', borderClass: 'border-blue-600/50' },
  epic: { label: 'Epic', bgClass: 'bg-purple-900/50', textClass: 'text-purple-400', borderClass: 'border-purple-600/50' },
  legendary: { label: 'Legendary', bgClass: 'bg-amber-900/50', textClass: 'text-amber-400', borderClass: 'border-amber-600/50' },
};

const ALL_RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const ITEMS_PER_PAGE = 56; // 7 columns x 8 rows

export function ItemsDatabase() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Get all items from data
  const allItems = useMemo(() => Object.values(ITEMS), []);

  // Get unique categories
  const availableCategories = useMemo(() => {
    const cats = new Set<ItemCategory>();
    allItems.forEach(item => cats.add(item.category));
    return Array.from(cats).sort();
  }, [allItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      items = items.filter(item => selectedCategories.includes(item.category));
    }

    // Rarity filter
    if (selectedRarities.length > 0) {
      items = items.filter(item => item.rarity && selectedRarities.includes(item.rarity));
    }

    // Sort alphabetically
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [allItems, searchQuery, selectedCategories, selectedRarities]);

  // Visible items (paginated)
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategories, selectedRarities]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
  }, [filteredItems.length]);

  // Handlers
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedRarities([]);
  }, []);

  const toggleCategory = useCallback((category: ItemCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleRarity = useCallback((rarity: Rarity) => {
    setSelectedRarities(prev =>
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  }, []);

  const activeFilterCount = selectedCategories.length + selectedRarities.length;

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-amber-500/5 to-transparent py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Items Database
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 mb-6">
            Browse all {allItems.length} items in Arc Raiders
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            <StatCard icon={Database} label="Total Items" value={allItems.length} />
            <StatCard icon={Layers} label="Categories" value={availableCategories.length} />
            <StatCard icon={Sparkles} label="Rarities" value={5} />
            <StatCard icon={Package} label="Showing" value={filteredItems.length} highlight />
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search and Filter Toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border cursor-pointer',
                showFilters || activeFilterCount > 0
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700'
              )}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                        selectedCategories.includes(category)
                          ? 'bg-amber-500 text-black'
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      )}
                    >
                      {CATEGORY_LABELS[category]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarities */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Rarity</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_RARITIES.map(rarity => {
                    const config = RARITY_CONFIG[rarity];
                    const isSelected = selectedRarities.includes(rarity);
                    return (
                      <button
                        key={rarity}
                        onClick={() => toggleRarity(rarity)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border cursor-pointer',
                          isSelected
                            ? `${config.bgClass} ${config.textClass} ${config.borderClass}`
                            : 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600'
                        )}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-zinc-400 hover:text-white cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results count */}
          <div className="text-sm text-zinc-500">
            {`Showing ${visibleItems.length} of ${filteredItems.length} items`}
          {filteredItems.length !== allItems.length && ` (filtered from ${allItems.length})`}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                {visibleItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <LoadMore className="w-5 h-5" />
                    Load More ({filteredItems.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No items found</h3>
              <p className="text-zinc-500 max-w-md">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, highlight }: { icon: typeof Database; label: string; value: number; highlight?: boolean }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn('w-4 h-4', highlight ? 'text-amber-400' : 'text-zinc-500')} />
        <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className={cn('text-xl sm:text-2xl font-bold', highlight ? 'text-amber-400' : 'text-white')}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

// Item Card Component
function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
  const rarityConfig = item.rarity ? RARITY_CONFIG[item.rarity] : null;
  const isBlueprint = item.category === 'blueprint';

  // Blueprint background style with blue + white grid pattern
  const blueprintStyle = isBlueprint ? {
    background: `
      linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px),
      linear-gradient(135deg, #1e3a5f 0%, #0f2847 50%, #1e3a5f 100%)
    `,
    backgroundSize: '12px 12px, 12px 12px, 100% 100%',
  } : undefined;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-2 rounded-lg border transition-all duration-200 cursor-pointer',
        'bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800',
        'hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5',
        'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950'
      )}
    >
      {/* Image */}
      <div
        className={cn(
          'w-full aspect-square rounded-md flex items-center justify-center overflow-hidden mb-2',
          !isBlueprint && (rarityConfig?.bgClass || 'bg-zinc-800')
        )}
        style={blueprintStyle}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-[80%] h-[80%] object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <Package className="w-8 h-8 text-zinc-600" />
        )}
      </div>

      {/* Info */}
      <h3 className="text-xs font-medium text-white truncate mb-0.5">{item.name}</h3>
      <div className="flex items-center gap-1">
        {rarityConfig && (
          <span className={cn(
            'text-[10px] px-1 py-0.5 rounded',
            rarityConfig.bgClass,
            rarityConfig.textClass
          )}>
            {rarityConfig.label.charAt(0)}
          </span>
        )}
        <span className="text-[10px] text-zinc-500 truncate">{CATEGORY_LABELS[item.category]}</span>
      </div>
    </button>
  );
}

// Item Detail Modal Component
function ItemDetailModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const rarityConfig = item.rarity ? RARITY_CONFIG[item.rarity] : null;
  const isBlueprint = item.category === 'blueprint';

  // Blueprint background style with blue + white grid pattern
  const blueprintStyle = isBlueprint ? {
    background: `
      linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px),
      linear-gradient(135deg, #1e3a5f 0%, #0f2847 50%, #1e3a5f 100%)
    `,
    backgroundSize: '16px 16px, 16px 16px, 100% 100%',
  } : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header with image */}
          <div className="flex items-start gap-5 mb-6">
            <div
              className={cn(
                'w-32 h-32 sm:w-36 sm:h-36 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0',
                !isBlueprint && (rarityConfig?.bgClass || 'bg-zinc-800')
              )}
              style={blueprintStyle}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-[90%] h-[90%] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <Package className="w-14 h-14 text-zinc-600" />
              )}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{item.name}</h2>
              <div className="flex flex-wrap gap-2">
                {rarityConfig && (
                  <span className={cn(
                    'text-sm px-2 py-1 rounded',
                    rarityConfig.bgClass,
                    rarityConfig.textClass
                  )}>
                    {rarityConfig.label}
                  </span>
                )}
                <span className="text-sm px-2 py-1 rounded bg-zinc-800 text-zinc-400">
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Description</h3>
              <p className="text-zinc-300">{item.description}</p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {item.weight !== null && (
              <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-500">Weight</p>
                <p className="text-white font-medium">{item.weight} kg</p>
              </div>
            )}
            <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
              <p className="text-xs text-zinc-500">Base Value</p>
              <p className="text-amber-400 font-medium">{item.baseValue.toLocaleString()} cr</p>
            </div>
            {item.stackable && (
              <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                <p className="text-xs text-zinc-500">Max Stack</p>
                <p className="text-white font-medium">{item.maxStack}</p>
              </div>
            )}
          </div>

          {/* Recycle Materials */}
          {item.recycleValue && item.recycleValue.materials.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Recycle Output</h3>
              <div className="flex flex-wrap gap-2">
                {item.recycleValue.materials.map((mat, idx) => {
                  const matItem = ITEMS[mat.itemId];
                  return (
                    <div key={idx} className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-2 py-1">
                      {matItem?.imageUrl && (
                        <img
                          src={matItem.imageUrl}
                          alt={matItem?.name || mat.itemId}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-sm text-zinc-300">
                        {matItem?.name || mat.itemId} x{mat.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
