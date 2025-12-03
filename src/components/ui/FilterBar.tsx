'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Rarity, ItemCategory } from '@/types';

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

// Rarity display config
const RARITY_CONFIG: Record<Rarity, { label: string; color: string }> = {
  common: { label: 'Common', color: 'bg-zinc-600 text-zinc-200' },
  uncommon: { label: 'Uncommon', color: 'bg-green-600 text-green-100' },
  rare: { label: 'Rare', color: 'bg-blue-600 text-blue-100' },
  epic: { label: 'Epic', color: 'bg-purple-600 text-purple-100' },
  legendary: { label: 'Legendary', color: 'bg-amber-600 text-amber-100' },
};

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  // Category filter
  categories?: ItemCategory[];
  selectedCategories?: ItemCategory[];
  onCategoryChange?: (categories: ItemCategory[]) => void;
  // Rarity filter
  showRarityFilter?: boolean;
  selectedRarities?: Rarity[];
  onRarityChange?: (rarities: Rarity[]) => void;
  // Custom filters slot
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search items...',
  categories,
  selectedCategories = [],
  onCategoryChange,
  showRarityFilter = false,
  selectedRarities = [],
  onRarityChange,
  children,
  className,
}: FilterBarProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedRarities.length > 0;

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoryChange?.([]);
    onRarityChange?.([]);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-2 flex-wrap">
          {/* Category Dropdown */}
          {categories && categories.length > 0 && onCategoryChange && (
            <MultiSelectDropdown
              label="Category"
              options={categories.map(cat => ({ value: cat, label: CATEGORY_LABELS[cat] }))}
              selected={selectedCategories}
              onChange={onCategoryChange}
            />
          )}

          {/* Rarity Dropdown */}
          {showRarityFilter && onRarityChange && (
            <MultiSelectDropdown
              label="Rarity"
              options={Object.entries(RARITY_CONFIG).map(([value, config]) => ({
                value: value as Rarity,
                label: config.label,
                color: config.color,
              }))}
              selected={selectedRarities}
              onChange={onRarityChange}
            />
          )}

          {/* Custom filters */}
          {children}

          {/* Clear All Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(cat => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300"
            >
              {CATEGORY_LABELS[cat]}
              <button
                onClick={() => onCategoryChange?.(selectedCategories.filter(c => c !== cat))}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedRarities.map(rarity => (
            <span
              key={rarity}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
                RARITY_CONFIG[rarity].color
              )}
            >
              {RARITY_CONFIG[rarity].label}
              <button
                onClick={() => onRarityChange?.(selectedRarities.filter(r => r !== rarity))}
                className="opacity-70 hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Multi-select dropdown component
interface DropdownOption<T> {
  value: T;
  label: string;
  color?: string;
}

interface MultiSelectDropdownProps<T extends string> {
  label: string;
  options: DropdownOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

function MultiSelectDropdown<T extends string>({
  label,
  options,
  selected,
  onChange,
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border',
          selected.length > 0
            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-700'
        )}
      >
        <Filter className="w-4 h-4" />
        {label}
        {selected.length > 0 && (
          <span className="bg-amber-500 text-black text-xs px-1.5 rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => toggleOption(option.value)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                selected.includes(option.value)
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <div className={cn(
                'w-4 h-4 rounded border flex items-center justify-center',
                selected.includes(option.value)
                  ? 'bg-amber-500 border-amber-500'
                  : 'border-zinc-600'
              )}>
                {selected.includes(option.value) && (
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {option.color ? (
                <span className={cn('px-2 py-0.5 rounded text-xs', option.color)}>
                  {option.label}
                </span>
              ) : (
                option.label
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
