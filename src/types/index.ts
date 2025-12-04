// Item rarity levels matching Arc Raiders
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Item categories matching Arc Raiders actual categories
export type ItemCategory =
  | 'weapon'
  | 'modification'
  | 'quick_use'
  | 'throwable'
  | 'blueprint'
  | 'basic_material'
  | 'topside_material'
  | 'refined_material'
  | 'advanced_material'
  | 'recyclable'
  | 'trinket'
  | 'key'
  | 'ammunition'
  | 'augment'
  | 'gadget'
  | 'nature'
  | 'consumable'
  | 'quest_item';

// Recommendation action for stash analyzer
export type RecommendAction = 'keep' | 'sell' | 'recycle' | 'use';

// Base item interface
export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity | null;
  description: string;
  weight: number | null;
  baseValue: number;
  recycleValue?: RecycleValue;
  stackable: boolean;
  maxStack: number;
  imageUrl: string;
}

// Recycle output
export interface RecycleValue {
  materials: { itemId: string; amount: number }[];
}

// Quest requirement
export interface QuestRequirement {
  itemId: string;
  amount: number;
}

// Quest interface
export interface Quest {
  id: string;
  name: string;
  description: string;
  giver: string;
  requirements: QuestRequirement[];
  rewards: { itemId: string; amount: number }[];
  experienceReward: number;
  isCompleted?: boolean;
}

// Hideout upgrade requirement
export interface HideoutUpgrade {
  id: string;
  name: string;
  station: string;
  level: number;
  requirements: QuestRequirement[];
  unlocks: string[];
}

// User's stash item (with quantity)
export interface StashItem {
  itemId: string;
  quantity: number;
  addedAt: Date;
}

// User profile
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  stash: StashItem[];
  activeQuests: string[];
  completedQuests: string[];
  hideoutLevels: Record<string, number>;
  scrappyLevel?: number;
  loadouts?: Loadout[];
}

// Stash analysis result
export interface StashAnalysis {
  itemId: string;
  item: Item;
  quantity: number;
  recommendation: RecommendAction;
  reason: string;
  priority: number; // 1-5, higher = more important
  neededFor: {
    type: 'quest' | 'hideout' | 'craft';
    name: string;
    amountNeeded: number;
  }[];
}

// Loadout slot types
export type LoadoutSlotType =
  | 'augment'
  | 'shield'
  | 'primary'
  | 'secondary'
  | 'quickUse1'
  | 'quickUse2'
  | 'quickUse3'
  | 'quickUse4'
  | 'ammo1'
  | 'ammo2';

// Loadout slot configuration
export interface LoadoutSlot {
  id: LoadoutSlotType;
  label: string;
  itemId: string | null;
  allowedCategories: ItemCategory[];
}

// Loadout preset
export interface Loadout {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  isDefault: boolean; // true for the 4 default loadouts
  slots: Record<LoadoutSlotType, string | null>; // slot -> itemId
  createdAt: Date;
  updatedAt: Date;
}

// Legacy type for backwards compatibility
export interface LoadoutPreset {
  id: string;
  name: string;
  description: string;
  items: { itemId: string; slot: string }[];
  createdAt: Date;
  updatedAt: Date;
}

// Community contribution
export interface ItemContribution {
  id: string;
  userId: string;
  itemData: Partial<Item>;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// Re-export subscription types
export * from './subscription';
