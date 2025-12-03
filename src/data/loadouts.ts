import type { Loadout, LoadoutSlotType, ItemCategory } from '@/types';

// Slot configuration - defines what categories are allowed per slot
export const SLOT_CONFIG: Record<
  LoadoutSlotType,
  { label: string; allowedCategories: ItemCategory[]; description: string }
> = {
  augment: {
    label: 'Augment',
    allowedCategories: ['augment'],
    description: 'Passive abilities that enhance your raider',
  },
  shield: {
    label: 'Shield',
    allowedCategories: ['gadget'],
    description: 'Protective equipment for combat',
  },
  primary: {
    label: 'Primary Weapon',
    allowedCategories: ['weapon'],
    description: 'Your main weapon for engagements',
  },
  secondary: {
    label: 'Secondary Weapon',
    allowedCategories: ['weapon'],
    description: 'Backup weapon for different situations',
  },
  quickUse1: {
    label: 'Quick Use 1',
    allowedCategories: ['quick_use', 'throwable', 'consumable'],
    description: 'Healing, grenades, or utility items',
  },
  quickUse2: {
    label: 'Quick Use 2',
    allowedCategories: ['quick_use', 'throwable', 'consumable'],
    description: 'Healing, grenades, or utility items',
  },
  quickUse3: {
    label: 'Quick Use 3',
    allowedCategories: ['quick_use', 'throwable', 'consumable'],
    description: 'Healing, grenades, or utility items',
  },
  quickUse4: {
    label: 'Quick Use 4',
    allowedCategories: ['quick_use', 'throwable', 'consumable'],
    description: 'Healing, grenades, or utility items',
  },
  ammo1: {
    label: 'Ammo Type 1',
    allowedCategories: ['ammunition'],
    description: 'Ammunition for your primary weapon',
  },
  ammo2: {
    label: 'Ammo Type 2',
    allowedCategories: ['ammunition'],
    description: 'Ammunition for your secondary weapon',
  },
};

// Helper to create empty slots
export function createEmptySlots(): Record<LoadoutSlotType, string | null> {
  return {
    augment: null,
    shield: null,
    primary: null,
    secondary: null,
    quickUse1: null,
    quickUse2: null,
    quickUse3: null,
    quickUse4: null,
    ammo1: null,
    ammo2: null,
  };
}

// Default loadouts based on community builds
// Sources: Reddit discussions, YouTube builds, community meta
export const DEFAULT_LOADOUTS: Loadout[] = [
  {
    id: 'stealth-runner',
    name: 'Stealth Runner',
    description:
      'Low-profile loadout for sneaking past ARC and other raiders. Focus on quiet weapons and mobility tools.',
    icon: 'Ghost',
    isDefault: true,
    slots: {
      augment: 'tactical_mk_2', // Tactical for stealth benefits
      shield: 'light_shield', // Light for faster movement
      primary: 'hairpin_iii', // Quiet precision weapon
      secondary: 'bobcat_ii', // Compact SMG for emergencies
      quickUse1: 'photoelectric_cloak', // Invisibility cloak
      quickUse2: 'smoke_grenade', // Escape tool
      quickUse3: 'bandage', // Basic healing
      quickUse4: 'noisemaker', // Distraction
      ammo1: 'light_ammo',
      ammo2: 'light_ammo',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tank-build',
    name: 'Tank Build',
    description:
      'Heavy combat loadout for taking on ARC forces head-on. Maximum firepower and survivability.',
    icon: 'Shield',
    isDefault: true,
    slots: {
      augment: 'combat_mk_3_aggressive', // Combat focus for damage
      shield: 'heavy_shield', // Maximum protection
      primary: 'anvil_iv', // Heavy hitting primary
      secondary: 'torrente_iii', // Shotgun for close quarters
      quickUse1: 'vita_shot', // Strong healing
      quickUse2: 'shield_recharger', // Keep shield up
      quickUse3: 'shrapnel_grenade', // Offensive grenade
      quickUse4: 'adrenaline_shot', // Combat boost
      ammo1: 'heavy_ammo',
      ammo2: 'shotgun_ammo',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'loot-goblin',
    name: 'Loot Goblin',
    description:
      'Optimized for fast loot runs. Maximum carry capacity with utility items for extraction.',
    icon: 'Gem',
    isDefault: true,
    slots: {
      augment: 'looting_mk_2', // Extra carry capacity
      shield: 'light_shield', // Fast movement
      primary: 'arpeggio_ii', // Lightweight automatic
      secondary: 'rattler_ii', // Pistol backup
      quickUse1: 'bandage', // Quick healing
      quickUse2: 'smoke_grenade', // Escape
      quickUse3: 'snap_hook', // Mobility
      quickUse4: 'zipline', // Quick extraction routes
      ammo1: 'light_ammo',
      ammo2: 'light_ammo',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'arc-hunter',
    name: 'ARC Hunter',
    description:
      'Specialized loadout for hunting ARC machines. Balanced offense and defense with anti-ARC tools.',
    icon: 'Crosshair',
    isDefault: true,
    slots: {
      augment: 'combat_mk_2', // Combat enhancement
      shield: 'medium_shield', // Balanced protection
      primary: 'venator_iii', // Precision rifle for weak points
      secondary: 'burletta_iii', // Versatile SMG
      quickUse1: 'vita_spray', // Area healing
      quickUse2: 'seeker_grenade', // Tracking grenade
      quickUse3: 'pulse_mine', // ARC disruption
      quickUse4: 'tagging_grenade', // Mark targets
      ammo1: 'medium_ammo',
      ammo2: 'light_ammo',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Maximum free loadouts (4 default + 2 custom)
export const MAX_FREE_LOADOUTS = 6;
export const DEFAULT_LOADOUT_COUNT = 4;
export const MAX_FREE_CUSTOM_LOADOUTS = MAX_FREE_LOADOUTS - DEFAULT_LOADOUT_COUNT;

// Helper to check if user can create more loadouts
export function canCreateLoadout(
  currentLoadouts: Loadout[],
  isPro: boolean
): boolean {
  if (isPro) return true;
  const customCount = currentLoadouts.filter((l) => !l.isDefault).length;
  return customCount < MAX_FREE_CUSTOM_LOADOUTS;
}

// Helper to get remaining free slots
export function getRemainingFreeSlots(currentLoadouts: Loadout[]): number {
  const customCount = currentLoadouts.filter((l) => !l.isDefault).length;
  return Math.max(0, MAX_FREE_CUSTOM_LOADOUTS - customCount);
}
