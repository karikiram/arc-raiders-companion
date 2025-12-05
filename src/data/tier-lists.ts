import type { Rarity } from '@/types';

export type TierRank = 'S+' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export type WeaponType =
  | 'pistol'
  | 'smg'
  | 'assault_rifle'
  | 'burst_rifle'
  | 'shotgun'
  | 'sniper'
  | 'lmg'
  | 'launcher'
  | 'beam_rifle'
  | 'break_action';

export interface TierListWeapon {
  id: string;
  name: string;
  weaponType: WeaponType;
  rarity: Rarity;
  imageId: string; // ID used for image lookup
  notes?: string;
}

export interface TierRow {
  tier: TierRank;
  weapons: TierListWeapon[];
}

export interface TierListData {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  author?: string;
  tiers: TierRow[];
}

// Tier colors for visual styling
export const TIER_COLORS: Record<TierRank, { bg: string; text: string; border: string }> = {
  'S+': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50' },
  'S': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50' },
  'A': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
  'B': { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/50' },
  'C': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
  'D': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
  'F': { bg: 'bg-zinc-500/20', text: 'text-zinc-400', border: 'border-zinc-500/50' },
};

// Weapon type icons/labels
export const WEAPON_TYPE_LABELS: Record<WeaponType, string> = {
  pistol: 'Pistol',
  smg: 'SMG',
  assault_rifle: 'AR',
  burst_rifle: 'Burst',
  shotgun: 'Shotgun',
  sniper: 'Sniper',
  lmg: 'LMG',
  launcher: 'Launcher',
  beam_rifle: 'Beam',
  break_action: 'Break',
};

// Weapon type icon indicators (matching the screenshot's bottom-left icons)
export const WEAPON_TYPE_ICONS: Record<WeaponType, string> = {
  pistol: '!!',
  smg: '≡',
  assault_rifle: '≡',
  burst_rifle: '≡',
  shotgun: '||||',
  sniper: '\\',
  lmg: '≡',
  launcher: '◊',
  beam_rifle: '⚡',
  break_action: '\\',
};

// =============================================================================
// PvE WEAPONS TIER LIST
// Based on effectiveness against ARCs and PvE content
// =============================================================================
export const PVE_WEAPONS_TIER_LIST: TierListData = {
  id: 'pve-weapons',
  name: 'PvE Weapons',
  description: 'Best weapons for fighting ARCs and completing PvE objectives. Rankings based on damage output, ammo efficiency, and overall effectiveness against AI enemies.',
  lastUpdated: '2025-12-04',
  author: 'Community',
  tiers: [
    {
      tier: 'S+',
      weapons: [
        {
          id: 'hullcracker',
          name: 'Hullcracker',
          weaponType: 'sniper',
          rarity: 'epic',
          imageId: 'hullcracker-level1',
          notes: 'Best anti-ARC weapon in the game. One-shots most enemies.',
        },
      ],
    },
    {
      tier: 'S',
      weapons: [
        {
          id: 'anvil',
          name: 'Anvil',
          weaponType: 'pistol',
          rarity: 'uncommon',
          imageId: 'anvil-i',
          notes: 'High damage hand cannon. Excellent for weak points.',
        },
        {
          id: 'jupiter',
          name: 'Jupiter',
          weaponType: 'sniper',
          rarity: 'legendary',
          imageId: 'jupiter-i',
          notes: 'Legendary sniper. Massive damage per shot.',
        },
      ],
    },
    {
      tier: 'A',
      weapons: [
        {
          id: 'ferro',
          name: 'Ferro',
          weaponType: 'break_action',
          rarity: 'common',
          imageId: 'ferro-i',
          notes: 'Reliable break-action rifle. Great for beginners.',
        },
        {
          id: 'renegade',
          name: 'Renegade',
          weaponType: 'assault_rifle',
          rarity: 'rare',
          imageId: 'renegade-i',
          notes: 'Solid assault rifle with good accuracy.',
        },
        {
          id: 'venator',
          name: 'Venator',
          weaponType: 'assault_rifle',
          rarity: 'rare',
          imageId: 'venator-i',
          notes: 'Versatile AR good at all ranges.',
        },
        {
          id: 'equalizer',
          name: 'Equalizer',
          weaponType: 'beam_rifle',
          rarity: 'legendary',
          imageId: 'equalizer-i',
          notes: 'Experimental beam rifle. High sustained DPS.',
        },
        {
          id: 'arpeggio',
          name: 'Arpeggio',
          weaponType: 'burst_rifle',
          rarity: 'uncommon',
          imageId: 'arpeggio-i',
          notes: '3-round burst. Good accuracy and damage.',
        },
        {
          id: 'bettina',
          name: 'Bettina',
          weaponType: 'assault_rifle',
          rarity: 'epic',
          imageId: 'bettina-i',
          notes: 'Slow but powerful AR. High damage per bullet.',
        },
        {
          id: 'tempest',
          name: 'Tempest',
          weaponType: 'assault_rifle',
          rarity: 'epic',
          imageId: 'tempest-i',
          notes: 'Fast-firing AR. Good for clearing groups.',
        },
      ],
    },
    {
      tier: 'B',
      weapons: [
        {
          id: 'torrente',
          name: 'Torrente',
          weaponType: 'smg',
          rarity: 'rare',
          imageId: 'torrente-i',
          notes: 'High fire rate SMG. Good at close range.',
        },
        {
          id: 'burletta',
          name: 'Burletta',
          weaponType: 'pistol',
          rarity: 'uncommon',
          imageId: 'burletta-i',
          notes: 'Semi-auto pistol. Fast follow-up shots.',
        },
        {
          id: 'osprey',
          name: 'Osprey',
          weaponType: 'smg',
          rarity: 'rare',
          imageId: 'osprey-i',
          notes: 'Balanced SMG. Decent at all ranges.',
        },
        {
          id: 'kettle',
          name: 'Kettle',
          weaponType: 'shotgun',
          rarity: 'common',
          imageId: 'kettle-i',
          notes: 'Pump shotgun. High burst damage.',
        },
        {
          id: 'stitcher',
          name: 'Stitcher',
          weaponType: 'smg',
          rarity: 'common',
          imageId: 'stitcher-i',
          notes: 'Basic SMG. Reliable and easy to find.',
        },
        {
          id: 'bobcat',
          name: 'Bobcat',
          weaponType: 'smg',
          rarity: 'epic',
          imageId: 'bobcat-ii',
          notes: 'Fast-firing SMG. High DPS up close.',
        },
        {
          id: 'vulcano',
          name: 'Vulcano',
          weaponType: 'shotgun',
          rarity: 'epic',
          imageId: 'vulcano-i',
          notes: 'Powerful shotgun. Devastating at close range.',
        },
      ],
    },
    {
      tier: 'C',
      weapons: [
        {
          id: 'rattler',
          name: 'Rattler',
          weaponType: 'assault_rifle',
          rarity: 'common',
          imageId: 'rattler-i',
          notes: 'Basic AR. Good for early game.',
        },
        {
          id: 'il_toro',
          name: 'Il Toro',
          weaponType: 'pistol',
          rarity: 'uncommon',
          imageId: 'il-toro-i',
          notes: 'Revolver. High damage but slow.',
        },
      ],
    },
    {
      tier: 'D',
      weapons: [
        {
          id: 'hairpin',
          name: 'Hairpin',
          weaponType: 'smg',
          rarity: 'common',
          imageId: 'hairpin-i',
          notes: 'Starter SMG. Low damage, high ammo consumption.',
        },
      ],
    },
  ],
};

// =============================================================================
// PvP WEAPONS TIER LIST
// Best weapons for player versus player combat
// =============================================================================
export const PVP_WEAPONS_TIER_LIST: TierListData = {
  id: 'pvp-weapons',
  name: 'PvP Weapons',
  description: 'Best weapons for player versus player combat. Rankings based on TTK, mobility, and effectiveness in Raider fights.',
  lastUpdated: '2025-12-04',
  author: 'Community',
  tiers: [
    {
      tier: 'S+',
      weapons: [
        {
          id: 'venator',
          name: 'Venator',
          weaponType: 'assault_rifle',
          rarity: 'rare',
          imageId: 'venator-i',
          notes: 'Best PvP weapon. Excellent accuracy and TTK.',
        },
      ],
    },
    {
      tier: 'S',
      weapons: [
        {
          id: 'anvil',
          name: 'Anvil',
          weaponType: 'pistol',
          rarity: 'uncommon',
          imageId: 'anvil-i',
          notes: 'High burst damage. Deadly in skilled hands.',
        },
        {
          id: 'renegade',
          name: 'Renegade',
          weaponType: 'assault_rifle',
          rarity: 'rare',
          imageId: 'renegade-i',
          notes: 'Reliable AR with good TTK.',
        },
        {
          id: 'vulcano',
          name: 'Vulcano',
          weaponType: 'shotgun',
          rarity: 'epic',
          imageId: 'vulcano-i',
          notes: 'Devastating at close range. One-shot potential.',
        },
        {
          id: 'bobcat',
          name: 'Bobcat',
          weaponType: 'smg',
          rarity: 'epic',
          imageId: 'bobcat-ii',
          notes: 'Fast TTK. Great for aggressive play.',
        },
        {
          id: 'il_toro',
          name: 'Il Toro',
          weaponType: 'pistol',
          rarity: 'uncommon',
          imageId: 'il-toro-i',
          notes: 'High damage revolver. Strong in PvP.',
        },
        {
          id: 'stitcher',
          name: 'Stitcher',
          weaponType: 'smg',
          rarity: 'common',
          imageId: 'stitcher-i',
          notes: 'Reliable SMG. Easy to control.',
        },
        {
          id: 'torrente',
          name: 'Torrente',
          weaponType: 'smg',
          rarity: 'rare',
          imageId: 'torrente-i',
          notes: 'High fire rate. Melts at close range.',
        },
      ],
    },
    {
      tier: 'A',
      weapons: [
        {
          id: 'tempest',
          name: 'Tempest',
          weaponType: 'assault_rifle',
          rarity: 'epic',
          imageId: 'tempest-i',
          notes: 'Good AR option. Solid all-around.',
        },
        {
          id: 'arpeggio',
          name: 'Arpeggio',
          weaponType: 'burst_rifle',
          rarity: 'uncommon',
          imageId: 'arpeggio-i',
          notes: 'Burst damage. Rewards accuracy.',
        },
        {
          id: 'burletta',
          name: 'Burletta',
          weaponType: 'pistol',
          rarity: 'uncommon',
          imageId: 'burletta-i',
          notes: 'Fast semi-auto. Good backup weapon.',
        },
        {
          id: 'bettina',
          name: 'Bettina',
          weaponType: 'assault_rifle',
          rarity: 'epic',
          imageId: 'bettina-i',
          notes: 'High damage per bullet. Slower fire rate.',
        },
        {
          id: 'kettle',
          name: 'Kettle',
          weaponType: 'shotgun',
          rarity: 'common',
          imageId: 'kettle-i',
          notes: 'Solid shotgun. Good for close quarters.',
        },
        {
          id: 'jupiter',
          name: 'Jupiter',
          weaponType: 'sniper',
          rarity: 'legendary',
          imageId: 'jupiter-i',
          notes: 'High skill ceiling. Rewards headshots.',
        },
        {
          id: 'osprey',
          name: 'Osprey',
          weaponType: 'smg',
          rarity: 'rare',
          imageId: 'osprey-i',
          notes: 'Balanced SMG. Decent at range.',
        },
      ],
    },
    {
      tier: 'B',
      weapons: [
        {
          id: 'ferro',
          name: 'Ferro',
          weaponType: 'break_action',
          rarity: 'common',
          imageId: 'ferro-i',
          notes: 'Slow but hits hard. Not ideal for PvP.',
        },
        {
          id: 'equalizer',
          name: 'Equalizer',
          weaponType: 'beam_rifle',
          rarity: 'legendary',
          imageId: 'equalizer-i',
          notes: 'Beam weapon. Hard to track moving targets.',
        },
      ],
    },
    {
      tier: 'C',
      weapons: [
        {
          id: 'rattler',
          name: 'Rattler',
          weaponType: 'assault_rifle',
          rarity: 'common',
          imageId: 'rattler-i',
          notes: 'Outclassed by other ARs in PvP.',
        },
      ],
    },
    {
      tier: 'D',
      weapons: [
        {
          id: 'hairpin',
          name: 'Hairpin',
          weaponType: 'smg',
          rarity: 'common',
          imageId: 'hairpin-i',
          notes: 'Weak damage. Avoid in PvP.',
        },
      ],
    },
  ],
};

// =============================================================================
// ATTACHMENTS TIER LIST (Placeholder)
// Will be populated with actual data later
// =============================================================================
export interface TierListAttachment {
  id: string;
  name: string;
  category: 'optic' | 'grip' | 'muzzle' | 'stock' | 'magazine' | 'special';
  rarity: Rarity;
  imageId: string;
  notes?: string;
}

export interface AttachmentTierRow {
  tier: TierRank;
  attachments: TierListAttachment[];
}

export interface AttachmentTierListData {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  author?: string;
  tiers: AttachmentTierRow[];
}

export const ATTACHMENTS_TIER_LIST: AttachmentTierListData = {
  id: 'attachments',
  name: 'Attachments',
  description: 'Best weapon attachments ranked by effectiveness. Includes optics, grips, muzzles, stocks, and special modifications.',
  lastUpdated: '2025-12-04',
  author: 'Community',
  tiers: [
    {
      tier: 'S+',
      attachments: [],
    },
    {
      tier: 'S',
      attachments: [],
    },
    {
      tier: 'A',
      attachments: [],
    },
    {
      tier: 'B',
      attachments: [],
    },
    {
      tier: 'C',
      attachments: [],
    },
    {
      tier: 'D',
      attachments: [],
    },
  ],
};

// Export all tier lists
export const TIER_LISTS = {
  pve: PVE_WEAPONS_TIER_LIST,
  pvp: PVP_WEAPONS_TIER_LIST,
  attachments: ATTACHMENTS_TIER_LIST,
};
