'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Search, X, ChevronDown, Filter } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ITEMS } from '@/data';
import type { Item, StashItem, Rarity, ItemCategory } from '@/types';

interface ItemAdderProps {
  onAddItem: (itemId: string, quantity: number) => void;
  existingItems?: StashItem[];
}

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

// Rarity config
const RARITY_CONFIG: Record<Rarity, { label: string; bgClass: string; textClass: string }> = {
  common: { label: 'Common', bgClass: 'bg-zinc-700', textClass: 'text-zinc-400' },
  uncommon: { label: 'Uncommon', bgClass: 'bg-green-900/50', textClass: 'text-green-400' },
  rare: { label: 'Rare', bgClass: 'bg-blue-900/50', textClass: 'text-blue-400' },
  epic: { label: 'Epic', bgClass: 'bg-purple-900/50', textClass: 'text-purple-400' },
  legendary: { label: 'Legendary', bgClass: 'bg-amber-900/50', textClass: 'text-amber-400' },
};

const ALL_RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function ItemAdder({ onAddItem, existingItems = [] }: ItemAdderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const allItems = useMemo(() => Object.values(ITEMS), []);

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    const cats = new Set<ItemCategory>();
    allItems.forEach(item => cats.add(item.category));
    return Array.from(cats).sort();
  }, [allItems]);

  // Filter items based on search, category, and rarity
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Category filter
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      items = items.filter(item => item.rarity === selectedRarity);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Sort by name
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [allItems, searchQuery, selectedCategory, selectedRarity]);

  // Count active filters
  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedRarity !== 'all' ? 1 : 0);

  const handleAdd = () => {
    if (selectedItem && quantity > 0) {
      onAddItem(selectedItem.id, quantity);
      setSelectedItem(null);
      setQuantity(1);
      setSearchQuery('');
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedRarity('all');
    setSearchQuery('');
  };

  if (!isOpen) {
    return (
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Items to Stash
      </Button>
    );
  }

  return (
    <Card className="relative">
      <button
        onClick={() => {
          setIsOpen(false);
          setSelectedItem(null);
          setSearchQuery('');
        }}
        className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <CardHeader>
        <CardTitle>Add Item to Stash</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedItem && (
          <>
            {/* Search and Filter Toggle */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                {activeFilterCount > 0 && (
                  <span className="bg-amber-500 text-black text-xs px-1.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 p-3 bg-zinc-800/50 rounded-lg">
                {/* Category Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs text-zinc-500 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ItemCategory | 'all')}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Categories</option>
                    {availableCategories.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>

                {/* Rarity Filter */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-xs text-zinc-500 mb-1">Rarity</label>
                  <select
                    value={selectedRarity}
                    onChange={(e) => setSelectedRarity(e.target.value as Rarity | 'all')}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Rarities</option>
                    {ALL_RARITIES.map(rarity => (
                      <option key={rarity} value={rarity}>{RARITY_CONFIG[rarity].label}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="self-end px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-xs text-zinc-500">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
            </div>

            {/* Item List - Scrollable */}
            <div ref={listRef} className="max-h-80 overflow-y-auto space-y-1 pr-1">
              {filteredItems.map((item) => {
                const existing = existingItems.find((e) => e.itemId === item.id);
                const rarityConfig = item.rarity ? RARITY_CONFIG[item.rarity] : null;

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-left group"
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0',
                        rarityConfig?.bgClass || 'bg-zinc-700'
                      )}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <span className={rarityConfig?.textClass || 'text-zinc-400'}>
                          {item.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">{CATEGORY_LABELS[item.category]}</span>
                        {item.rarity && (
                          <span className={cn('text-xs', rarityConfig?.textClass)}>
                            {rarityConfig?.label}
                          </span>
                        )}
                      </div>
                    </div>
                    {existing && (
                      <span className="text-xs text-zinc-500 flex-shrink-0">
                        ×{existing.quantity}
                      </span>
                    )}
                  </button>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  No items match your filters
                </div>
              )}
            </div>
          </>
        )}

        {/* Selected Item View */}
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden',
                  selectedItem.rarity ? RARITY_CONFIG[selectedItem.rarity].bgClass : 'bg-zinc-700'
                )}
              >
                {selectedItem.imageUrl ? (
                  <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {selectedItem.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{selectedItem.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="rarity" rarity={selectedItem.rarity}>
                    {selectedItem.rarity}
                  </Badge>
                  <span className="text-xs text-zinc-500">
                    {CATEGORY_LABELS[selectedItem.category]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-400">Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center py-1 bg-zinc-800 border border-zinc-700 rounded text-white"
                  min={1}
                  max={selectedItem.maxStack}
                />
                <button
                  onClick={() => setQuantity(Math.min(selectedItem.maxStack, quantity + 1))}
                  className="w-8 h-8 rounded bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-zinc-500">
                Max: {selectedItem.maxStack}
              </span>
            </div>

            {/* Quick quantity buttons */}
            <div className="flex gap-2">
              {[1, 5, 10, 25, 50].filter(n => n <= selectedItem.maxStack).map(n => (
                <button
                  key={n}
                  onClick={() => setQuantity(n)}
                  className={cn(
                    'px-3 py-1 rounded text-sm transition-colors',
                    quantity === n
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setQuantity(selectedItem.maxStack)}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  quantity === selectedItem.maxStack
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                )}
              >
                Max
              </button>
            </div>

            {/* Add Button */}
            <Button variant="primary" onClick={handleAdd} className="w-full">
              Add to Stash
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
