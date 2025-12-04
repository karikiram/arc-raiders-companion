'use client';

import { useState } from 'react';
import {
  Ghost,
  Shield,
  Gem,
  Crosshair,
  Swords,
  Package,
  Copy,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Plus,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ITEMS, SLOT_CONFIG } from '@/data';
import type { Loadout, LoadoutSlotType, Item } from '@/types';

// Icon mapping for loadout icons
const LOADOUT_ICONS: Record<string, typeof Ghost> = {
  Ghost,
  Shield,
  Gem,
  Crosshair,
  Swords,
};

interface LoadoutCardProps {
  loadout: Loadout;
  isExpanded?: boolean;
  onEdit?: (loadout: Loadout) => void;
  onDuplicate?: (loadout: Loadout) => void;
  onDelete?: (loadout: Loadout) => void;
  onSlotClick?: (loadout: Loadout, slotId: LoadoutSlotType) => void;
  canDuplicate?: boolean;
}

const SLOT_ORDER: LoadoutSlotType[] = [
  'augment',
  'shield',
  'primary',
  'secondary',
  'quickUse1',
  'quickUse2',
  'quickUse3',
  'quickUse4',
  'ammo1',
  'ammo2',
];

export function LoadoutCard({
  loadout,
  isExpanded: initialExpanded = false,
  onEdit,
  onDuplicate,
  onDelete,
  onSlotClick,
  canDuplicate = true,
}: LoadoutCardProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const Icon = LOADOUT_ICONS[loadout.icon] || Swords;

  // Get items for each slot
  const slotItems: Record<LoadoutSlotType, Item | null> = {} as Record<
    LoadoutSlotType,
    Item | null
  >;
  for (const slotId of SLOT_ORDER) {
    const itemId = loadout.slots[slotId];
    slotItems[slotId] = itemId ? ITEMS[itemId] || null : null;
  }

  // Calculate total value of loadout
  const totalValue = SLOT_ORDER.reduce((sum, slotId) => {
    const item = slotItems[slotId];
    return sum + (item?.baseValue || 0);
  }, 0);

  // Count filled slots
  const filledSlots = SLOT_ORDER.filter((s) => loadout.slots[s]).length;

  return (
    <div
      className={cn(
        'bg-zinc-900 rounded-xl border transition-all duration-200',
        isExpanded ? 'border-accent/50' : 'border-zinc-800 hover:border-zinc-700'
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            loadout.isDefault
              ? 'bg-gradient-to-br from-accent/20 to-accent-dark/20'
              : 'bg-zinc-800'
          )}
        >
          <Icon
            className={cn(
              'w-6 h-6',
              loadout.isDefault ? 'text-accent' : 'text-zinc-400'
            )}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">{loadout.name}</h3>
            {loadout.isDefault && (
              <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-500 truncate">{loadout.description}</p>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm text-zinc-500">Slots</p>
            <p className="text-white font-medium">
              {filledSlots}/{SLOT_ORDER.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Value</p>
            <p className="text-accent font-medium">{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="p-2 text-zinc-500">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-zinc-800">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 py-3 border-b border-zinc-800">
            {onEdit && (
              <button
                onClick={() => onEdit(loadout)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(loadout)}
                disabled={!canDuplicate}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
                  canDuplicate
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                    : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                )}
              >
                {canDuplicate ? (
                  <Copy className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Duplicate
              </button>
            )}
            {onDelete && !loadout.isDefault && (
              <button
                onClick={() => onDelete(loadout)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>

          {/* Slot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            {SLOT_ORDER.map((slotId) => {
              const item = slotItems[slotId];
              const config = SLOT_CONFIG[slotId];

              return (
                <button
                  key={slotId}
                  onClick={() => onSlotClick?.(loadout, slotId)}
                  className={cn(
                    'p-3 rounded-lg border transition-all text-left group cursor-pointer',
                    item
                      ? 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-600'
                      : 'bg-zinc-800/30 border-zinc-800 border-dashed hover:border-zinc-600'
                  )}
                >
                  <p className="text-xs text-zinc-500 mb-2">{config.label}</p>
                  {item ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-8 h-8 rounded flex items-center justify-center overflow-hidden flex-shrink-0',
                          {
                            'bg-zinc-700': item.rarity === 'common',
                            'bg-green-900/50': item.rarity === 'uncommon',
                            'bg-blue-900/50': item.rarity === 'rare',
                            'bg-purple-900/50': item.rarity === 'epic',
                            'bg-amber-900/50': item.rarity === 'legendary',
                          }
                        )}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package className="w-4 h-4 text-zinc-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {item.baseValue.toLocaleString()} cr
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add item</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
