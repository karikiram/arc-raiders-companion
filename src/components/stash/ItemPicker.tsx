'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Filter,
  Star,
  Clock,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Package,
  ArrowLeft,
  Check,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ITEMS } from '@/data';
import type { Item, StashItem, Rarity, ItemCategory } from '@/types';

// localStorage keys
const FAVORITES_KEY = 'item-picker-favorites';
const RECENT_KEY = 'item-picker-recent';
const VIEW_MODE_KEY = 'item-picker-view-mode';

interface ItemPickerProps {
  existingItems: StashItem[];
  onAddItems: (items: { itemId: string; quantity: number }[]) => void;
  onClose: () => void;
  sidebarCollapsed?: boolean;
}

interface SelectedItem {
  item: Item;
  quantity: number;
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
  cosmetic: 'Cosmetics',
  quest_item: 'Quest Items',
};

// Rarity config
const RARITY_CONFIG: Record<Rarity, { label: string; bgClass: string; textClass: string; badgeClass: string }> = {
  common: { label: 'Common', bgClass: 'bg-zinc-700', textClass: 'text-zinc-400', badgeClass: 'bg-zinc-600 text-zinc-200' },
  uncommon: { label: 'Uncommon', bgClass: 'bg-green-900/50', textClass: 'text-green-400', badgeClass: 'bg-green-600 text-green-100' },
  rare: { label: 'Rare', bgClass: 'bg-blue-900/50', textClass: 'text-blue-400', badgeClass: 'bg-blue-600 text-blue-100' },
  epic: { label: 'Epic', bgClass: 'bg-purple-900/50', textClass: 'text-purple-400', badgeClass: 'bg-purple-600 text-purple-100' },
  legendary: { label: 'Legendary', bgClass: 'bg-amber-900/50', textClass: 'text-amber-400', badgeClass: 'bg-amber-600 text-amber-100' },
};

const ALL_RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function ItemPicker({ existingItems, onAddItems, onClose, sidebarCollapsed = false }: ItemPickerProps) {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [showStash, setShowStash] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'favorites' | 'recent'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load favorites, recent, and view mode from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_KEY);
    const storedRecent = localStorage.getItem(RECENT_KEY);
    const storedViewMode = localStorage.getItem(VIEW_MODE_KEY);
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    if (storedRecent) setRecentItems(JSON.parse(storedRecent));
    if (storedViewMode === 'list' || storedViewMode === 'grid') setViewMode(storedViewMode);
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  }, []);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  // Save recent items to localStorage
  const saveRecent = useCallback((itemId: string) => {
    setRecentItems(prev => {
      const updated = [itemId, ...prev.filter(id => id !== itemId)].slice(0, 20);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const allItems = useMemo(() => Object.values(ITEMS), []);

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    const cats = new Set<ItemCategory>();
    allItems.forEach(item => cats.add(item.category));
    return Array.from(cats).sort();
  }, [allItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    let items = allItems;

    // Section filter
    if (activeSection === 'favorites') {
      items = items.filter(item => favorites.includes(item.id));
    } else if (activeSection === 'recent') {
      // Sort by recent order
      const recentSet = new Set(recentItems);
      items = items.filter(item => recentSet.has(item.id));
      items.sort((a, b) => recentItems.indexOf(a.id) - recentItems.indexOf(b.id));
    } else {
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
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [allItems, searchQuery, selectedCategory, selectedRarity, activeSection, favorites, recentItems]);

  // Toggle favorite
  const toggleFavorite = useCallback((itemId: string) => {
    saveFavorites(
      favorites.includes(itemId)
        ? favorites.filter(id => id !== itemId)
        : [...favorites, itemId]
    );
  }, [favorites, saveFavorites]);

  // Add item to selection (sets quantity directly, doesn't add to existing)
  const addToSelection = useCallback((item: Item, quantity: number = 1) => {
    setSelectedItems(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c =>
          c.item.id === item.id
            ? { ...c, quantity: Math.min(quantity, 99) }
            : c
        );
      }
      return [...prev, { item, quantity }];
    });
    saveRecent(item.id);
  }, [saveRecent]);

  // Update selection quantity
  const updateSelectionQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems(prev => prev.filter(c => c.item.id !== itemId));
    } else {
      setSelectedItems(prev =>
        prev.map(c =>
          c.item.id === itemId
            ? { ...c, quantity: Math.min(quantity, 99) }
            : c
        )
      );
    }
  }, []);

  // Remove from selection
  const removeFromSelection = useCallback((itemId: string) => {
    setSelectedItems(prev => prev.filter(c => c.item.id !== itemId));
  }, []);

  // Submit selection
  const submitSelection = useCallback(() => {
    if (selectedItems.length === 0) return;
    onAddItems(selectedItems.map(c => ({ itemId: c.item.id, quantity: c.quantity })));
    setSelectedItems([]);
    onClose();
  }, [selectedItems, onAddItems, onClose]);

  // Get selection quantity
  const getSelectionQuantity = useCallback((itemId: string) => {
    return selectedItems.find(c => c.item.id === itemId)?.quantity || 0;
  }, [selectedItems]);

  // Get existing stash quantity
  const getStashQuantity = useCallback((itemId: string) => {
    return existingItems.find(e => e.itemId === itemId)?.quantity || 0;
  }, [existingItems]);

  const totalSelectedItems = selectedItems.reduce((sum, c) => sum + c.quantity, 0);
  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedRarity !== 'all' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Add Items to Stash</h1>
            <p className="text-zinc-400 text-sm">Select items and quantities to add</p>
          </div>
        </div>
        <button
          onClick={() => setShowStash(!showStash)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            showStash
              ? 'bg-amber-500/10 text-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          )}
        >
          <Package className="w-4 h-4" />
          Current Stash ({existingItems.length})
          {showStash ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Current Stash Panel (Collapsible) */}
      {showStash && (
        <Card className="border-zinc-700">
          <CardContent className="p-4">
            <div className="max-h-48 overflow-y-auto">
              {existingItems.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">Your stash is empty</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {existingItems.map(stashItem => {
                    const item = ITEMS[stashItem.itemId];
                    if (!item) return null;
                    return (
                      <div
                        key={stashItem.itemId}
                        className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg"
                      >
                        <div className={cn(
                          'w-8 h-8 rounded flex items-center justify-center overflow-hidden flex-shrink-0',
                          item.rarity ? RARITY_CONFIG[item.rarity].bgClass : 'bg-zinc-700'
                        )}>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-6 h-6 object-contain" />
                          ) : (
                            <Package className="w-4 h-4 text-zinc-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500">×{stashItem.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveSection('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            activeSection === 'all'
              ? 'bg-amber-500/10 text-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          )}
        >
          All Items
        </button>
        <button
          onClick={() => setActiveSection('favorites')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
            activeSection === 'favorites'
              ? 'bg-amber-500/10 text-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          )}
        >
          <Star className="w-4 h-4" />
          Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveSection('recent')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
            activeSection === 'recent'
              ? 'bg-amber-500/10 text-amber-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          )}
        >
          <Clock className="w-4 h-4" />
          Recent ({recentItems.length})
        </button>
      </div>

      {/* Search and Filters */}
      {activeSection === 'all' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search items..."
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

          {showFilters && (
            <div className="flex flex-wrap gap-3 p-3 bg-zinc-800/50 rounded-lg">
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
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedRarity('all');
                  }}
                  className="self-end px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results Count and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          {activeSection === 'all' && searchQuery && ` matching "${searchQuery}"`}
        </div>
        <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-500 hover:text-white'
            )}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={cn(
              'p-1.5 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-500 hover:text-white'
            )}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Grid/List */}
      <div className={cn(
        "max-h-[calc(100vh-420px)] overflow-y-auto pb-20",
        viewMode === 'grid'
          ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2"
          : "space-y-1"
      )}>
        {filteredItems.map(item => {
          const selectionQty = getSelectionQuantity(item.id);
          const stashQty = getStashQuantity(item.id);
          const isFavorite = favorites.includes(item.id);
          const rarityConfig = item.rarity ? RARITY_CONFIG[item.rarity] : null;

          return viewMode === 'grid' ? (
            <ItemCardGrid
              key={item.id}
              item={item}
              selectionQuantity={selectionQty}
              stashQuantity={stashQty}
              isFavorite={isFavorite}
              rarityConfig={rarityConfig}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onSelect={(qty) => addToSelection(item, qty)}
              onUpdateQuantity={(qty) => updateSelectionQuantity(item.id, qty)}
            />
          ) : (
            <ItemCardList
              key={item.id}
              item={item}
              selectionQuantity={selectionQty}
              stashQuantity={stashQty}
              isFavorite={isFavorite}
              rarityConfig={rarityConfig}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onSelect={(qty) => addToSelection(item, qty)}
              onUpdateQuantity={(qty) => updateSelectionQuantity(item.id, qty)}
            />
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-500">
            {activeSection === 'favorites'
              ? 'No favorites yet. Click the star on items to add them.'
              : activeSection === 'recent'
              ? 'No recent items yet. Items you add will appear here.'
              : 'No items match your search or filters.'}
          </div>
        )}
      </div>

      {/* Floating Selection Bar */}
      {selectedItems.length > 0 && (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 p-4 z-50",
          sidebarCollapsed ? "lg:left-14" : "lg:left-56"
        )}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-1">
              {selectedItems.slice(0, 5).map(selectedItem => (
                <div
                  key={selectedItem.item.id}
                  className="flex items-center gap-2 px-2 py-1 bg-zinc-800 rounded-lg flex-shrink-0"
                >
                  <div className={cn(
                    'w-6 h-6 rounded flex items-center justify-center overflow-hidden',
                    selectedItem.item.rarity ? RARITY_CONFIG[selectedItem.item.rarity].bgClass : 'bg-zinc-700'
                  )}>
                    {selectedItem.item.imageUrl ? (
                      <img src={selectedItem.item.imageUrl} alt="" className="w-5 h-5 object-contain" />
                    ) : (
                      <Package className="w-3 h-3 text-zinc-500" />
                    )}
                  </div>
                  <span className="text-sm text-white">×{selectedItem.quantity}</span>
                  <button
                    onClick={() => removeFromSelection(selectedItem.item.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedItems.length > 5 && (
                <span className="text-sm text-zinc-500 flex-shrink-0">
                  +{selectedItems.length - 5} more
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Clear
              </button>
              <Button variant="primary" onClick={submitSelection} className="gap-2">
                <Check className="w-4 h-4" />
                Add {totalSelectedItems} Item{totalSelectedItems !== 1 ? 's' : ''} to Stash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared Item Card Props
interface ItemCardProps {
  item: Item;
  selectionQuantity: number;
  stashQuantity: number;
  isFavorite: boolean;
  rarityConfig: { label: string; bgClass: string; textClass: string; badgeClass: string } | null;
  onToggleFavorite: () => void;
  onSelect: (quantity: number) => void;
  onUpdateQuantity: (quantity: number) => void;
}

// Preset quantities for quick selection
const PRESET_QUANTITIES = [1, 5, 10, 25];

// Maximum quantity allowed in stash tracker (independent of game's maxStack)
const STASH_MAX_QUANTITY = 99;

// Compact Grid Card with inline quantity controls
function ItemCardGrid({
  item,
  selectionQuantity,
  stashQuantity,
  isFavorite,
  rarityConfig,
  onToggleFavorite,
  onSelect,
  onUpdateQuantity,
}: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Sync quantity with selection when it changes
  useEffect(() => {
    if (selectionQuantity > 0) {
      setQuantity(selectionQuantity);
    } else {
      setQuantity(1);
    }
  }, [selectionQuantity]);

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleSelect = () => {
    if (quantity > 0) {
      onSelect(quantity);
      setIsExpanded(false);
    }
  };

  const handleUpdateSelection = () => {
    onUpdateQuantity(quantity);
    if (quantity === 0) {
      setIsExpanded(false);
    }
  };

  const handleRemove = () => {
    onUpdateQuantity(0);
    setQuantity(1);
    setIsExpanded(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, STASH_MAX_QUANTITY));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative group">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={cn(
          'absolute top-1 right-1 z-10 p-1 rounded transition-all',
          isFavorite
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-zinc-800/80 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-amber-400'
        )}
      >
        <Star className={cn('w-3 h-3', isFavorite && 'fill-current')} />
      </button>

      {/* Card */}
      <div
        onClick={!isExpanded ? handleCardClick : undefined}
        className={cn(
          'w-full p-2 rounded-lg border transition-all',
          isExpanded
            ? 'bg-zinc-800 border-amber-500/50'
            : selectionQuantity > 0
            ? 'bg-amber-500/10 border-amber-500/30 cursor-pointer'
            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer'
        )}
      >
        {/* Image - fixed small size */}
        <div className={cn(
          'w-full aspect-square rounded flex items-center justify-center overflow-hidden mb-1.5',
          rarityConfig?.bgClass || 'bg-zinc-800'
        )}>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-10 h-10 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <Package className="w-5 h-5 text-zinc-500" />
          )}
        </div>

        {/* Info */}
        <p className="text-xs font-medium text-white truncate leading-tight">{item.name}</p>

        {!isExpanded && (
          <div className="flex items-center justify-between mt-0.5">
            <span className={cn(
              'text-[10px] px-1 py-0.5 rounded leading-none',
              rarityConfig?.badgeClass || 'bg-zinc-700 text-zinc-400'
            )}>
              {rarityConfig?.label?.charAt(0) || '?'}
            </span>
            {stashQuantity > 0 && (
              <span className="text-[10px] text-zinc-500">×{stashQuantity}</span>
            )}
          </div>
        )}

        {/* Inline Quantity Controls - shown when expanded */}
        {isExpanded && (
          <div className="mt-2 space-y-2">
            {/* +/- and input */}
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); decrementQuantity(); }}
                className="w-6 h-6 rounded bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Math.min(STASH_MAX_QUANTITY, parseInt(e.target.value) || 0)))}
                onClick={(e) => e.stopPropagation()}
                className="w-12 text-center py-1 bg-zinc-700 border border-zinc-600 rounded text-white text-sm font-bold"
                min={0}
                max={STASH_MAX_QUANTITY}
              />
              <button
                onClick={(e) => { e.stopPropagation(); incrementQuantity(); }}
                className="w-6 h-6 rounded bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Preset buttons */}
            <div className="flex gap-1">
              {PRESET_QUANTITIES.map(n => (
                <button
                  key={n}
                  onClick={(e) => { e.stopPropagation(); setQuantity(n); }}
                  className={cn(
                    'flex-1 py-1 rounded text-[10px] font-medium transition-colors',
                    quantity === n
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-1">
              {selectionQuantity > 0 ? (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                    className="flex-1 py-1 rounded text-[10px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleUpdateSelection(); }}
                    className="flex-1 py-1 rounded text-[10px] font-medium bg-amber-500 text-black hover:bg-amber-400"
                  >
                    Update
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    className="flex-1 py-1 rounded text-[10px] font-medium text-zinc-400 bg-zinc-700 hover:bg-zinc-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelect(); }}
                    disabled={quantity === 0}
                    className="flex-1 py-1 rounded text-[10px] font-medium bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50"
                  >
                    Select
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Selection Quantity Badge */}
        {selectionQuantity > 0 && !isExpanded && (
          <div className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {selectionQuantity}
          </div>
        )}
      </div>
    </div>
  );
}

// List Row Card with inline quantity controls
function ItemCardList({
  item,
  selectionQuantity,
  stashQuantity,
  isFavorite,
  rarityConfig,
  onToggleFavorite,
  onSelect,
  onUpdateQuantity,
}: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Sync quantity with selection when it changes
  useEffect(() => {
    if (selectionQuantity > 0) {
      setQuantity(selectionQuantity);
    } else {
      setQuantity(1);
    }
  }, [selectionQuantity]);

  const handleCardClick = () => {
    setIsExpanded(true);
  };

  const handleSelect = () => {
    if (quantity > 0) {
      onSelect(quantity);
      setIsExpanded(false);
    }
  };

  const handleUpdateSelection = () => {
    onUpdateQuantity(quantity);
    if (quantity === 0) {
      setIsExpanded(false);
    }
  };

  const handleRemove = () => {
    onUpdateQuantity(0);
    setQuantity(1);
    setIsExpanded(false);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, STASH_MAX_QUANTITY));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative group">
      <div
        onClick={!isExpanded ? handleCardClick : undefined}
        className={cn(
          'w-full rounded-lg border transition-all',
          isExpanded
            ? 'bg-zinc-800 border-amber-500/50'
            : selectionQuantity > 0
            ? 'bg-amber-500/10 border-amber-500/30 cursor-pointer'
            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer'
        )}
      >
        {/* Main row */}
        <div className="flex items-center gap-3 p-2">
          {/* Selection Quantity Badge */}
          {selectionQuantity > 0 && !isExpanded && (
            <div className="w-6 h-6 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
              {selectionQuantity}
            </div>
          )}

          {/* Image - small fixed size */}
          <div className={cn(
            'w-10 h-10 rounded flex items-center justify-center overflow-hidden flex-shrink-0',
            rarityConfig?.bgClass || 'bg-zinc-800'
          )}>
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-8 h-8 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <Package className="w-4 h-4 text-zinc-500" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.name}</p>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded',
                rarityConfig?.badgeClass || 'bg-zinc-700 text-zinc-400'
              )}>
                {rarityConfig?.label || 'Unknown'}
              </span>
              <span className="text-xs text-zinc-500">{CATEGORY_LABELS[item.category]}</span>
            </div>
          </div>

          {/* Stash quantity */}
          {stashQuantity > 0 && !isExpanded && (
            <span className="text-xs text-zinc-500 flex-shrink-0">In stash: {stashQuantity}</span>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={cn(
              'p-1.5 rounded transition-all flex-shrink-0',
              isFavorite
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-amber-400'
            )}
          >
            <Star className={cn('w-4 h-4', isFavorite && 'fill-current')} />
          </button>
        </div>

        {/* Inline Quantity Controls - shown when expanded */}
        {isExpanded && (
          <div className="px-2 pb-2 pt-1 border-t border-zinc-700">
            <div className="flex items-center gap-3">
              {/* +/- and input */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); decrementQuantity(); }}
                  className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, Math.min(STASH_MAX_QUANTITY, parseInt(e.target.value) || 0)))}
                  onClick={(e) => e.stopPropagation()}
                  className="w-16 text-center py-1.5 bg-zinc-700 border border-zinc-600 rounded text-white text-sm font-bold"
                  min={0}
                  max={STASH_MAX_QUANTITY}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); incrementQuantity(); }}
                  className="w-8 h-8 rounded bg-zinc-700 text-white hover:bg-zinc-600 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Preset buttons */}
              <div className="flex gap-1">
                {PRESET_QUANTITIES.map(n => (
                  <button
                    key={n}
                    onClick={(e) => { e.stopPropagation(); setQuantity(n); }}
                    className={cn(
                      'px-2 py-1.5 rounded text-xs font-medium transition-colors',
                      quantity === n
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Action buttons */}
              <div className="flex gap-2">
                {selectionQuantity > 0 ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                      className="px-3 py-1.5 rounded text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpdateSelection(); }}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-amber-500 text-black hover:bg-amber-400"
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                      className="px-3 py-1.5 rounded text-xs font-medium text-zinc-400 bg-zinc-700 hover:bg-zinc-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSelect(); }}
                      disabled={quantity === 0}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50"
                    >
                      Select
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
