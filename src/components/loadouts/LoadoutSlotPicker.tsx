'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  Search,
  Package,
  Check,
  ChevronDown,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ITEMS, SLOT_CONFIG } from '@/data';
import type { Item, ItemCategory, LoadoutSlotType, Rarity } from '@/types';

interface LoadoutSlotPickerProps {
  isOpen: boolean;
  onClose: () => void;
  slotId: LoadoutSlotType;
  currentItemId: string | null;
  onSelectItem: (itemId: string | null) => void;
}

const RARITY_ORDER: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'bg-zinc-700',
  uncommon: 'bg-green-900/50 border-green-500/30',
  rare: 'bg-blue-900/50 border-blue-500/30',
  epic: 'bg-purple-900/50 border-purple-500/30',
  legendary: 'bg-amber-900/50 border-amber-500/30',
};

// Regex to match item tier suffixes (I, II, III, IV, V, etc.)
const TIER_SUFFIX_REGEX = /\s+(I{1,3}|IV|V|VI{0,3}|IX|X)$/;

// Helper to get base item name (without tier suffix)
function getBaseItemName(name: string): string {
  return name.replace(TIER_SUFFIX_REGEX, '').trim();
}

// Helper to check if an item is a variant (has tier suffix)
function isItemVariant(name: string): boolean {
  return TIER_SUFFIX_REGEX.test(name);
}

export function LoadoutSlotPicker({
  isOpen,
  onClose,
  slotId,
  currentItemId,
  onSelectItem,
}: LoadoutSlotPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [showRarityDropdown, setShowRarityDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const slotConfig = SLOT_CONFIG[slotId];

  // Get items that match the slot's allowed categories, deduplicating variants
  const availableItems = useMemo(() => {
    const allItems = Object.values(ITEMS) as Item[];
    const categoryItems = allItems.filter((item) =>
      slotConfig.allowedCategories.includes(item.category)
    );

    // Deduplicate items with tier variants (I, II, III, IV)
    // Keep only one version per base name, preferring higher tiers
    const seenBaseNames = new Map<string, Item>();

    for (const item of categoryItems) {
      const baseName = getBaseItemName(item.name);
      const existing = seenBaseNames.get(baseName);

      if (!existing) {
        seenBaseNames.set(baseName, item);
      } else if (isItemVariant(item.name) && isItemVariant(existing.name)) {
        // Both are variants - keep the one with higher tier (later in roman numerals)
        // Simple heuristic: higher tier items usually have higher base value
        if (item.baseValue > existing.baseValue) {
          seenBaseNames.set(baseName, item);
        }
      }
    }

    return Array.from(seenBaseNames.values());
  }, [slotConfig.allowedCategories]);

  // Filter items based on search and rarity
  const filteredItems = useMemo(() => {
    let filtered = availableItems;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) => {
          const baseName = getBaseItemName(item.name).toLowerCase();
          return baseName.includes(query) ||
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);
        }
      );
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter((item) => item.rarity === selectedRarity);
    }

    // Sort by rarity (legendary first), then by base name
    return filtered.sort((a, b) => {
      const rarityA = a.rarity ? RARITY_ORDER.indexOf(a.rarity) : -1;
      const rarityB = b.rarity ? RARITY_ORDER.indexOf(b.rarity) : -1;
      if (rarityB !== rarityA) return rarityB - rarityA;
      return getBaseItemName(a.name).localeCompare(getBaseItemName(b.name));
    });
  }, [availableItems, searchQuery, selectedRarity]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSelectedRarity('all');
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRarityDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">
              Select {slotConfig.label}
            </h2>
            <p className="text-sm text-zinc-500">{slotConfig.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-3 border-b border-zinc-800 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Rarity Filter */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowRarityDropdown(!showRarityDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:border-zinc-600 transition-colors min-w-[140px]"
            >
              <span className="flex-1 text-left capitalize">
                {selectedRarity === 'all' ? 'All Rarities' : selectedRarity}
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            </button>
            {showRarityDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-10">
                <button
                  onClick={() => {
                    setSelectedRarity('all');
                    setShowRarityDropdown(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors',
                    selectedRarity === 'all' ? 'text-amber-400' : 'text-white'
                  )}
                >
                  All Rarities
                </button>
                {RARITY_ORDER.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => {
                      setSelectedRarity(rarity);
                      setShowRarityDropdown(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors capitalize',
                      selectedRarity === rarity ? 'text-amber-400' : 'text-white'
                    )}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Selection */}
          {currentItemId && (
            <button
              onClick={() => {
                onSelectItem(null);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Slot
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="px-6 py-2 text-sm text-zinc-500 border-b border-zinc-800">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
        </div>

        {/* Item Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No items match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filteredItems.map((item) => {
                const isSelected = item.id === currentItemId;
                const displayName = getBaseItemName(item.name);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item.id);
                      onClose();
                    }}
                    className={cn(
                      'relative p-2 rounded-lg border transition-all text-left group',
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
                        : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
                    )}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center z-10">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}

                    {/* Item Image - smaller */}
                    <div
                      className={cn(
                        'w-full aspect-square rounded mb-1.5 flex items-center justify-center overflow-hidden',
                        item.rarity ? RARITY_COLORS[item.rarity] : 'bg-zinc-700'
                      )}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={displayName}
                          className="w-1/2 h-1/2 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Package className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>

                    {/* Item Info - show base name */}
                    <h4 className="text-xs font-medium text-white truncate">
                      {displayName}
                    </h4>
                    <div className="flex items-center justify-between mt-0.5">
                      <span
                        className={cn(
                          'text-[10px] capitalize px-1 py-0.5 rounded',
                          {
                            'text-zinc-400 bg-zinc-700/50': item.rarity === 'common',
                            'text-green-400 bg-green-500/10': item.rarity === 'uncommon',
                            'text-blue-400 bg-blue-500/10': item.rarity === 'rare',
                            'text-purple-400 bg-purple-500/10': item.rarity === 'epic',
                            'text-amber-400 bg-amber-500/10': item.rarity === 'legendary',
                          }
                        )}
                      >
                        {item.rarity || 'standard'}
                      </span>
                    </div>

                    {/* Description on hover */}
                    <div className="absolute inset-0 bg-zinc-900/95 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col justify-end z-20">
                      <h5 className="text-xs font-medium text-white mb-1">{displayName}</h5>
                      <p className="text-[10px] text-zinc-400 line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
