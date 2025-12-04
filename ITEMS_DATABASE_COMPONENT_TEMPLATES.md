# Items Database - Component Implementation Templates

This document provides ready-to-implement component templates that follow the design specification.

---

## Table of Contents

1. [ItemsDatabase (Main Page Container)](#itemsdatabase-main-page-container)
2. [PageHero Component](#pagehero-component)
3. [FilterSection Component](#filtersection-component)
4. [ItemsGrid Component](#itemsgrid-component)
5. [ItemCard Component](#itemcard-component)
6. [ItemDetailModal Component](#itemdetailmodal-component)
7. [EmptyState Component](#emptystate-component)
8. [Utility Functions](#utility-functions)

---

## ItemsDatabase (Main Page Container)

### File: `src/components/items-database/ItemsDatabase.tsx`

```tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Package } from 'lucide-react';
import { ITEMS } from '@/data';
import type { ItemCategory, Rarity, Item } from '@/types';
import { PageHero } from './PageHero';
import { FilterSection } from './FilterSection';
import { ItemsGrid } from './ItemsGrid';
import { ItemDetailModal } from './ItemDetailModal';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';

export function ItemsDatabase() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        item.category.toLowerCase().includes(query)
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

    return items;
  }, [allItems, searchQuery, selectedCategories, selectedRarities]);

  // Handlers
  const handleSelectItem = useCallback((item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedRarities([]);
  }, []);

  // Compute stats
  const stats = {
    totalItems: allItems.length,
    categoriesCount: availableCategories.length,
    raritiesCount: ['common', 'uncommon', 'rare', 'epic', 'legendary'].length,
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedRarities.length > 0 || searchQuery.length > 0;

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <PageHero stats={stats} />

      {/* Sticky Filter Bar */}
      <FilterSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        selectedRarities={selectedRarities}
        onRaritiesChange={setSelectedRarities}
        resultCount={filteredItems.length}
        onClearAllFilters={handleClearAllFilters}
        availableCategories={availableCategories}
      />

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Items Grid or Empty State */}
          {filteredItems.length > 0 ? (
            <ItemsGrid
              items={filteredItems}
              onSelectItem={handleSelectItem}
            />
          ) : (
            <EmptyState
              hasActiveFilters={hasActiveFilters}
              onClearFilters={handleClearAllFilters}
            />
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
```

---

## PageHero Component

### File: `src/components/items-database/PageHero.tsx`

```tsx
'use client';

import { cn } from '@/lib/utils';

interface PageHeroProps {
  stats: {
    totalItems: number;
    categoriesCount: number;
    raritiesCount: number;
  };
}

export function PageHero({ stats }: PageHeroProps) {
  return (
    <section className="w-full bg-gradient-to-b from-amber-500/5 to-transparent py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto">
        {/* Title and Subtitle */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
          Items Database
        </h1>
        <p className="text-lg text-zinc-400 mb-8">
          Browse all items in Arc Raiders with detailed information and filtering
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
          {/* Total Items */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Total Items</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {stats.totalItems.toLocaleString()}
            </p>
          </div>

          {/* Categories */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Categories</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {stats.categoriesCount}
            </p>
          </div>

          {/* Rarities */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Rarities</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {stats.raritiesCount}
            </p>
          </div>

          {/* Last Updated */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Status</p>
            <p className="text-2xl font-bold text-green-400 mt-1">Live</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## FilterSection Component

### File: `src/components/items-database/FilterSection.tsx`

```tsx
'use client';

import { X } from 'lucide-react';
import { FilterBar } from '@/components/ui/FilterBar';
import { cn } from '@/lib/utils';
import type { ItemCategory, Rarity } from '@/types';

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: ItemCategory[];
  onCategoriesChange: (categories: ItemCategory[]) => void;
  selectedRarities: Rarity[];
  onRaritiesChange: (rarities: Rarity[]) => void;
  resultCount: number;
  onClearAllFilters: () => void;
  availableCategories: ItemCategory[];
}

export function FilterSection({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedRarities,
  onRaritiesChange,
  resultCount,
  onClearAllFilters,
  availableCategories,
}: FilterSectionProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedRarities.length > 0 || searchQuery.length > 0;

  return (
    <section className={cn(
      'sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md',
      'border-b border-zinc-800 py-4 px-4 sm:px-6 lg:px-8'
    )}>
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Filter Bar (Search + Dropdowns) */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          categories={availableCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoriesChange}
          showRarityFilter={true}
          selectedRarities={selectedRarities}
          onRarityChange={onRaritiesChange}
        />

        {/* Results Counter and Clear Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            {resultCount} item{resultCount !== 1 ? 's' : ''} found
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearAllFilters}
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              aria-label="Clear all filters"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## ItemsGrid Component

### File: `src/components/items-database/ItemsGrid.tsx`

```tsx
'use client';

import { ItemCard } from './ItemCard';
import type { Item } from '@/types';

interface ItemsGridProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
}

export function ItemsGrid({ items, onSelectItem }: ItemsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4 w-full">
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          onSelectItem={onSelectItem}
        />
      ))}
    </div>
  );
}
```

---

## ItemCard Component

### File: `src/components/items-database/ItemCard.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Star, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item, Rarity } from '@/types';

interface ItemCardProps {
  item: Item;
  onSelectItem: (item: Item) => void;
}

const RARITY_COLORS: Record<Rarity | null, { bg: string; badge: string }> = {
  common: { bg: 'bg-zinc-700', badge: 'bg-zinc-600 text-zinc-200' },
  uncommon: { bg: 'bg-green-900/50', badge: 'bg-green-700 text-green-100' },
  rare: { bg: 'bg-blue-900/50', badge: 'bg-blue-700 text-blue-100' },
  epic: { bg: 'bg-purple-900/50', badge: 'bg-purple-700 text-purple-100' },
  legendary: { bg: 'bg-amber-900/50', badge: 'bg-amber-600 text-amber-100' },
  null: { bg: 'bg-zinc-700', badge: 'bg-zinc-600 text-zinc-200' },
};

const CATEGORY_LABELS: Record<string, string> = {
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
  cosmetic: 'Cosmetics',
  quest_item: 'Quest Items',
};

export function ItemCard({ item, onSelectItem }: ItemCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityLabel = item.rarity
    ? item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)
    : 'Unknown';

  return (
    <div
      className={cn(
        'relative group rounded-xl bg-zinc-900 border border-zinc-800',
        'hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20',
        'transition-all duration-200 cursor-pointer overflow-hidden p-3 sm:p-4'
      )}
      onClick={() => onSelectItem(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectItem(item);
        }
      }}
      aria-label={`${item.name} - ${rarityLabel} rarity`}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className={cn(
          'absolute top-2 right-2 p-2 rounded-lg transition-all z-10',
          isFavorite
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-zinc-800/80 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-amber-400'
        )}
        aria-label={isFavorite ? 'Remove favorite' : 'Add to favorites'}
      >
        <Star className={cn('w-5 h-5', isFavorite && 'fill-current')} />
      </button>

      {/* Image Container */}
      <div
        className={cn(
          'w-full aspect-square rounded-lg flex items-center justify-center',
          'overflow-hidden mb-3 relative',
          rarityColor.bg
        )}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-2"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <Package className="w-8 h-8 text-zinc-500" />
        )}
      </div>

      {/* Item Name */}
      <p className="text-sm sm:text-base font-semibold text-white truncate mb-2 leading-tight">
        {item.name}
      </p>

      {/* Rarity Badge & Category */}
      <div className="flex items-center gap-2">
        <span className={cn('inline-block px-2 py-1 rounded text-xs font-bold uppercase', rarityColor.badge)}>
          {rarityLabel.charAt(0)}
        </span>
        <span className="text-xs text-zinc-500 truncate">
          {CATEGORY_LABELS[item.category] || item.category}
        </span>
      </div>
    </div>
  );
}
```

---

## ItemDetailModal Component

### File: `src/components/items-database/ItemDetailModal.tsx`

```tsx
'use client';

import { X, Recycle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item, Rarity } from '@/types';

interface ItemDetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const RARITY_COLORS: Record<Rarity | null, string> = {
  common: 'bg-zinc-600 text-zinc-200',
  uncommon: 'bg-green-700 text-green-100',
  rare: 'bg-blue-700 text-blue-100',
  epic: 'bg-purple-700 text-purple-100',
  legendary: 'bg-amber-600 text-amber-100',
  null: 'bg-zinc-600 text-zinc-200',
};

const RARITY_BG: Record<Rarity | null, string> = {
  common: 'bg-zinc-700',
  uncommon: 'bg-green-900/50',
  rare: 'bg-blue-900/50',
  epic: 'bg-purple-900/50',
  legendary: 'bg-amber-900/50',
  null: 'bg-zinc-700',
};

const CATEGORY_LABELS: Record<string, string> = {
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
  cosmetic: 'Cosmetics',
  quest_item: 'Quest Items',
};

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
}: ItemDetailModalProps) {
  if (!isOpen || !item) return null;

  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityBg = RARITY_BG[item.rarity];
  const rarityLabel = item.rarity
    ? item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)
    : 'Unknown';

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Container */}
      <div
        className={cn(
          'relative bg-zinc-900 border border-zinc-800 rounded-2xl',
          'max-w-2xl w-full max-h-[90vh] overflow-y-auto',
          'shadow-2xl shadow-black/50 animate-fadeIn'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4 p-2 rounded-lg',
            'text-zinc-400 hover:text-white hover:bg-zinc-800',
            'transition-colors z-10',
            'focus:outline-none focus:ring-2 focus:ring-amber-500'
          )}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          {/* Image Section */}
          <div
            className={cn(
              'w-full max-w-md mx-auto mb-6 p-4 rounded-lg',
              'flex items-center justify-center',
              rarityBg
            )}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-w-full max-h-96 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <Package className="w-32 h-32 text-zinc-500" />
            )}
          </div>

          {/* Title */}
          <h1 id="modal-title" className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {item.name}
          </h1>

          {/* Rarity & Category */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800 flex-wrap">
            <span className={cn('inline-block px-3 py-1.5 rounded-lg text-sm font-bold uppercase', rarityColor)}>
              {rarityLabel}
            </span>
            <span className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-base text-zinc-300 mb-4 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Details Section */}
          <div className="mb-6 pb-6 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-white mb-3">Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {item.weight !== null && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Weight</p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {item.weight} kg
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Base Value</p>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {item.baseValue} cr
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Max Stack</p>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {item.stackable ? item.maxStack : '1'}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Stackable</p>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {item.stackable ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Recycle Materials */}
          {item.recycleValue && item.recycleValue.materials && item.recycleValue.materials.length > 0 && (
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Recycle className="w-5 h-5" />
                Recycle Materials
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {item.recycleValue.materials.map((material, idx) => (
                  <div
                    key={`${material.itemId}-${idx}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                  >
                    <span className="text-xs text-zinc-300 text-center font-semibold">
                      ×{material.amount}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Material {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              'w-full px-4 py-3 rounded-lg',
              'bg-zinc-800 text-white hover:bg-zinc-700',
              'transition-colors font-medium',
              'focus:outline-none focus:ring-2 focus:ring-amber-500'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## EmptyState Component

### File: `src/components/items-database/EmptyState.tsx`

```tsx
'use client';

import { Package, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className={cn(
      'col-span-full flex flex-col items-center justify-center py-12 px-4'
    )}>
      <Package className="w-16 h-16 text-zinc-600 mb-4" />

      <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {hasActiveFilters ? 'No items match your filters' : 'No items found'}
      </h2>

      <p className="text-base text-zinc-400 mb-6 text-center max-w-sm">
        {hasActiveFilters
          ? 'Try adjusting your search query, category, or rarity filters.'
          : 'Try searching for an item or browse by category.'}
      </p>

      {hasActiveFilters && (
        <Button
          variant="secondary"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
```

---

## Utility Functions

### File: `src/components/items-database/utils.ts`

```ts
import type { Rarity, ItemCategory } from '@/types';

/**
 * Get rarity display label from rarity value
 */
export function getRarityLabel(rarity: Rarity | null): string {
  if (!rarity) return 'Unknown';
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

/**
 * Get rarity short abbreviation
 */
export function getRarityAbbr(rarity: Rarity | null): string {
  const abbrs: Record<Rarity | 'null', string> = {
    common: 'C',
    uncommon: 'U',
    rare: 'R',
    epic: 'E',
    legendary: 'L',
    null: '?',
  };
  return abbrs[rarity || 'null'];
}

/**
 * Get category display label
 */
export function getCategoryLabel(category: ItemCategory): string {
  const labels: Record<ItemCategory, string> = {
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
    cosmetic: 'Cosmetics',
    quest_item: 'Quest Items',
  };
  return labels[category] || category;
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get color classes for rarity
 */
export const getRarityColors = (rarity: Rarity | null) => {
  const colors: Record<Rarity | 'null', { bg: string; text: string; badge: string }> = {
    common: {
      bg: 'bg-zinc-700',
      text: 'text-zinc-400',
      badge: 'bg-zinc-600 text-zinc-200',
    },
    uncommon: {
      bg: 'bg-green-900/50',
      text: 'text-green-400',
      badge: 'bg-green-700 text-green-100',
    },
    rare: {
      bg: 'bg-blue-900/50',
      text: 'text-blue-400',
      badge: 'bg-blue-700 text-blue-100',
    },
    epic: {
      bg: 'bg-purple-900/50',
      text: 'text-purple-400',
      badge: 'bg-purple-700 text-purple-100',
    },
    legendary: {
      bg: 'bg-amber-900/50',
      text: 'text-amber-400',
      badge: 'bg-amber-600 text-amber-100',
    },
    null: {
      bg: 'bg-zinc-700',
      text: 'text-zinc-400',
      badge: 'bg-zinc-600 text-zinc-200',
    },
  };

  return colors[rarity || 'null'];
};
```

---

## Page Route Handler

### File: `src/app/items/page.tsx`

```tsx
import { Metadata } from 'next';
import { ItemsDatabase } from '@/components/items-database/ItemsDatabase';

export const metadata: Metadata = {
  title: 'Items Database',
  description: 'Browse all items in Arc Raiders with detailed information, filtering, and search.',
};

export default function ItemsPage() {
  return (
    <main className="w-full">
      <ItemsDatabase />
    </main>
  );
}
```

---

## CSS Animations (Optional - add to globals.css)

### File: `src/app/globals.css` (add these keyframes)

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-fadeOut {
  animation: fadeOut 0.15s ease-out;
}

/* Image pixelation */
img[style*="image-rendering: pixelated"] {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
```

---

## Directory Structure

```
src/
├── components/
│   ├── items-database/
│   │   ├── ItemsDatabase.tsx          ← Main component
│   │   ├── PageHero.tsx               ← Hero section
│   │   ├── FilterSection.tsx          ← Filter controls
│   │   ├── ItemsGrid.tsx              ← Grid container
│   │   ├── ItemCard.tsx               ← Individual card
│   │   ├── ItemDetailModal.tsx        ← Detail modal
│   │   ├── EmptyState.tsx             ← Empty state
│   │   └── utils.ts                   ← Utility functions
│   └── ui/
│       ├── FilterBar.tsx              (existing - use as-is)
│       ├── Card.tsx                   (existing - if needed)
│       ├── Badge.tsx                  (existing - if needed)
│       └── Button.tsx                 (existing - use)
└── app/
    └── items/
        └── page.tsx                   ← Route page
```

---

## Implementation Order

1. **Phase 1 - Foundation**
   - Create directory structure
   - Copy utility functions
   - Create PageHero component
   - Create EmptyState component

2. **Phase 2 - Layout**
   - Create ItemsGrid component
   - Create ItemCard component
   - Create FilterSection component
   - Create main ItemsDatabase container

3. **Phase 3 - Interaction**
   - Create ItemDetailModal component
   - Add modal open/close logic
   - Add keyboard navigation
   - Test responsive behavior

4. **Phase 4 - Polish**
   - Add animations
   - Test accessibility
   - Performance optimization
   - Cross-browser testing

---

## Testing Checklist

```
Functional:
- [ ] Search works real-time
- [ ] Category filter works
- [ ] Rarity filter works
- [ ] Clear filters works
- [ ] Modal opens/closes
- [ ] Modal shows all details
- [ ] Favorite button works

Responsive:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large desktop (1280px)
- [ ] No horizontal scroll

Visual:
- [ ] Colors accurate
- [ ] Hover states work
- [ ] Focus states visible
- [ ] Animations smooth

Accessibility:
- [ ] Tab navigation works
- [ ] Screen reader friendly
- [ ] Alt text on images
- [ ] Keyboard control works

Performance:
- [ ] Page loads fast
- [ ] 60fps scrolling
- [ ] Images lazy-load
- [ ] No memory leaks
```

---

## Notes

- All components use `'use client'` for client-side interactivity
- Tailwind CSS v4 classes are used throughout
- Lucide React icons are imported and used
- FilterBar component (existing) is reused for consistency
- All color values follow the design specification
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

