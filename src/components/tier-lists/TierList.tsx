'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Rarity } from '@/types';
import {
  type TierListData,
  type TierListWeapon,
  type TierRank,
  TIER_COLORS,
  WEAPON_TYPE_ICONS,
} from '@/data/tier-lists';

// Rarity border colors matching the screenshot style
const RARITY_BORDERS: Record<Rarity, string> = {
  common: 'border-zinc-500',
  uncommon: 'border-green-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-amber-500',
};

const RARITY_GLOW: Record<Rarity, string> = {
  common: '',
  uncommon: 'shadow-green-500/20',
  rare: 'shadow-blue-500/30',
  epic: 'shadow-purple-500/40',
  legendary: 'shadow-amber-500/50',
};

interface WeaponCardProps {
  weapon: TierListWeapon;
  onHover?: (weapon: TierListWeapon | null) => void;
}

function WeaponCard({ weapon, onHover }: WeaponCardProps) {
  const [imageError, setImageError] = useState(false);
  const borderColor = RARITY_BORDERS[weapon.rarity];
  const glowColor = RARITY_GLOW[weapon.rarity];
  const typeIcon = WEAPON_TYPE_ICONS[weapon.weaponType];

  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all duration-200',
        'hover:scale-105 hover:z-10'
      )}
      onMouseEnter={() => onHover?.(weapon)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div
        className={cn(
          'relative w-[100px] h-[80px] sm:w-[120px] sm:h-[95px] rounded-lg overflow-hidden',
          'bg-zinc-800/80 border-2',
          borderColor,
          glowColor && `shadow-lg ${glowColor}`,
          'transition-all duration-200',
          'group-hover:brightness-110'
        )}
      >
        {/* Weapon Image */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {imageError ? (
            <Package className="w-10 h-10 text-zinc-500" />
          ) : (
            <Image
              src={`/items-hq/${weapon.imageId}.png`}
              alt={weapon.name}
              width={96}
              height={72}
              className="object-contain max-w-full max-h-full"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Weapon Type Icon (bottom-left) */}
        <div className="absolute bottom-1 left-1.5 text-[10px] text-zinc-400 font-mono">
          {typeIcon}
        </div>

        {/* Weapon Name (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-1.5 py-1">
          <p className="text-[10px] sm:text-xs font-semibold text-white truncate text-center">
            {weapon.name}
          </p>
        </div>
      </div>
    </div>
  );
}

interface TierRowProps {
  tier: TierRank;
  weapons: TierListWeapon[];
  onWeaponHover?: (weapon: TierListWeapon | null) => void;
}

function TierRow({ tier, weapons, onWeaponHover }: TierRowProps) {
  const colors = TIER_COLORS[tier];

  return (
    <div className="flex border-b border-zinc-800 last:border-b-0">
      {/* Tier Label */}
      <div
        className={cn(
          'flex-shrink-0 w-16 sm:w-20 flex items-center justify-center',
          'border-r border-zinc-800',
          colors.bg
        )}
      >
        <span className={cn('text-2xl sm:text-3xl font-black', colors.text)}>
          {tier}
        </span>
      </div>

      {/* Weapons Container */}
      <div className="flex-1 flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 min-h-[100px] sm:min-h-[120px] bg-zinc-900/50">
        {weapons.length > 0 ? (
          weapons.map((weapon) => (
            <WeaponCard
              key={weapon.id}
              weapon={weapon}
              onHover={onWeaponHover}
            />
          ))
        ) : (
          <div className="flex items-center justify-center w-full text-zinc-600 text-sm italic">
            No weapons in this tier
          </div>
        )}
      </div>
    </div>
  );
}

interface TierListProps {
  data: TierListData;
  className?: string;
}

export function TierList({ data, className }: TierListProps) {
  const [hoveredWeapon, setHoveredWeapon] = useState<TierListWeapon | null>(null);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{data.name} Tier List</h2>
          <p className="text-zinc-400 mt-1 text-sm sm:text-base">{data.description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>Last updated: {data.lastUpdated}</span>
          {data.author && (
            <>
              <span className="text-zinc-700">|</span>
              <span>By {data.author}</span>
            </>
          )}
        </div>
      </div>

      {/* Tier List Grid */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
        {data.tiers.map((row) => (
          <TierRow
            key={row.tier}
            tier={row.tier}
            weapons={row.weapons}
            onWeaponHover={setHoveredWeapon}
          />
        ))}
      </div>

      {/* Weapon Details Tooltip/Panel */}
      {hoveredWeapon && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 shadow-xl flex items-center gap-3">
            <Info className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-white font-semibold">{hoveredWeapon.name}</p>
              {hoveredWeapon.notes && (
                <p className="text-zinc-400 text-sm">{hoveredWeapon.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-400">Rarity:</span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-zinc-500"></span> Common
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-green-500"></span> Uncommon
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-blue-500"></span> Rare
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-purple-500"></span> Epic
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-amber-500"></span> Legendary
          </span>
        </div>
      </div>
    </div>
  );
}
