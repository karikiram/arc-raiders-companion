import type { Item, StashItem, StashAnalysis, RecommendAction, Quest, HideoutUpgrade } from '@/types';
import { getItemById, getQuestsRequiringItem, getUpgradesRequiringItem } from '@/data';

interface AnalyzerContext {
  activeQuests: string[];
  completedQuests: string[];
  hideoutLevels: Record<string, number>;
}

interface ItemNeed {
  type: 'quest' | 'hideout' | 'craft';
  name: string;
  amountNeeded: number;
}

export function analyzeStashItem(
  stashItem: StashItem,
  context: AnalyzerContext
): StashAnalysis | null {
  const item = getItemById(stashItem.itemId);
  if (!item) return null;

  const neededFor = getItemNeeds(item, stashItem.quantity, context);
  const recommendation = determineRecommendation(item, stashItem.quantity, neededFor, context);
  const priority = calculatePriority(item, neededFor, recommendation);
  const reason = generateReason(item, recommendation, neededFor);

  return {
    itemId: item.id,
    item,
    quantity: stashItem.quantity,
    recommendation,
    reason,
    priority,
    neededFor,
  };
}

function getItemNeeds(
  item: Item,
  currentQuantity: number,
  context: AnalyzerContext
): ItemNeed[] {
  const needs: ItemNeed[] = [];

  // Check quests
  const questsNeedingItem = getQuestsRequiringItem(item.id);
  for (const quest of questsNeedingItem) {
    // Skip completed quests
    if (context.completedQuests.includes(quest.id)) continue;

    const requirement = quest.requirements.find((r) => r.itemId === item.id);
    if (requirement) {
      needs.push({
        type: 'quest',
        name: quest.name,
        amountNeeded: requirement.amount,
      });
    }
  }

  // Check hideout upgrades
  const upgradesNeedingItem = getUpgradesRequiringItem(item.id);
  for (const upgrade of upgradesNeedingItem) {
    // Skip if already at or above this level
    const currentLevel = context.hideoutLevels[upgrade.station] || 0;
    if (currentLevel >= upgrade.level) continue;

    // Skip if not the next level (can't skip levels)
    if (upgrade.level > currentLevel + 1) continue;

    const requirement = upgrade.requirements.find((r) => r.itemId === item.id);
    if (requirement) {
      needs.push({
        type: 'hideout',
        name: upgrade.name,
        amountNeeded: requirement.amount,
      });
    }
  }

  return needs;
}

// Material categories that should follow material logic
const MATERIAL_CATEGORIES = [
  'basic_material',
  'topside_material',
  'refined_material',
  'advanced_material',
];

function determineRecommendation(
  item: Item,
  quantity: number,
  neededFor: ItemNeed[],
  context: AnalyzerContext
): RecommendAction {
  // Quick use items and consumables should generally be used
  if (item.category === 'consumable' || item.category === 'quick_use') {
    return 'use';
  }

  // If needed for quests or hideout, keep it
  const totalNeeded = neededFor.reduce((sum, need) => sum + need.amountNeeded, 0);
  if (totalNeeded > 0) {
    return 'keep';
  }

  // Keys are always valuable to keep unless you have duplicates
  if (item.category === 'key') {
    return quantity > 1 ? 'sell' : 'keep';
  }

  // Trinkets (valuables) should be sold
  if (item.category === 'trinket') {
    return 'sell';
  }

  // Recyclables should be recycled
  if (item.category === 'recyclable') {
    return item.recycleValue ? 'recycle' : 'sell';
  }

  // Material categories - apply material logic
  if (MATERIAL_CATEGORIES.includes(item.category)) {
    // Basic materials with excess can be sold
    if (item.category === 'basic_material' && quantity > 100) {
      return 'sell';
    }
    // Topside/refined materials - keep more buffer
    if ((item.category === 'topside_material' || item.category === 'refined_material') && quantity > 50) {
      return 'sell';
    }
    // Advanced materials - always keep
    if (item.category === 'advanced_material') {
      return 'keep';
    }
    // Otherwise keep materials
    return 'keep';
  }

  // Weapons - check if they have recycle value
  if (item.category === 'weapon' && item.recycleValue) {
    // Check if recycle materials are needed
    const recycleNeeded = item.recycleValue.materials.some((mat) => {
      const matNeeds = getItemNeeds(
        { id: mat.itemId } as Item,
        mat.amount,
        context
      );
      return matNeeds.length > 0;
    });

    if (recycleNeeded && item.rarity === 'common') {
      return 'recycle';
    }
  }

  // Modifications, augments, gadgets - keep unless common duplicates
  if (item.category === 'modification' || item.category === 'augment' || item.category === 'gadget') {
    return 'keep';
  }

  // Ammunition - keep reasonable amounts
  if (item.category === 'ammunition') {
    return 'keep';
  }

  // Throwables - use them!
  if (item.category === 'throwable') {
    return 'use';
  }

  // Blueprints - always keep
  if (item.category === 'blueprint') {
    return 'keep';
  }

  // Nature items - use or keep
  if (item.category === 'nature') {
    return 'keep';
  }

  // Default: keep rare+, sell/recycle common
  if (item.rarity === 'common') {
    return item.recycleValue ? 'recycle' : 'sell';
  }

  return 'keep';
}

function calculatePriority(
  item: Item,
  neededFor: ItemNeed[],
  recommendation: RecommendAction
): number {
  let priority = 1;

  // Boost priority if needed for active progression
  if (neededFor.length > 0) {
    priority += 2;
  }

  // Higher rarity = higher priority
  const rarityBonus: Record<string, number> = {
    common: 0,
    uncommon: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
  };
  priority += (item.rarity && rarityBonus[item.rarity]) || 0;

  // Cap at 5
  return Math.min(priority, 5);
}

function generateReason(
  item: Item,
  recommendation: RecommendAction,
  neededFor: ItemNeed[]
): string {
  if (neededFor.length > 0) {
    const needs = neededFor.slice(0, 2).map((n) => n.name).join(', ');
    const moreCount = neededFor.length - 2;
    const moreText = moreCount > 0 ? ` +${moreCount} more` : '';
    return `Needed for: ${needs}${moreText}`;
  }

  switch (recommendation) {
    case 'sell':
      if (item.category === 'trinket') {
        return 'Valuable item with no crafting use. Sell for profit.';
      }
      return 'Excess stock. Safe to sell.';

    case 'recycle':
      return 'Better value from recycling materials.';

    case 'use':
      if (item.category === 'quick_use') {
        return 'Medical item - use it or lose it on death!';
      }
      if (item.category === 'throwable') {
        return 'Tactical item - bring it on your next raid!';
      }
      return 'Consumable - use it or lose it on death!';

    case 'keep':
      if (item.rarity === 'rare' || item.rarity === 'epic' || item.rarity === 'legendary') {
        return 'Rare item - keep for future upgrades.';
      }
      if (item.category === 'key') {
        return 'Grants access to special areas.';
      }
      if (item.category === 'blueprint') {
        return 'Learn valuable crafting recipes.';
      }
      if (item.category === 'advanced_material') {
        return 'Rare ARC technology - essential for top-tier gear.';
      }
      if (item.category === 'modification') {
        return 'Weapon mod - attach to improve your gear.';
      }
      if (item.category === 'augment') {
        return 'Character augment - provides permanent benefits.';
      }
      return 'May be needed for future content.';

    default:
      return '';
  }
}

export function analyzeFullStash(
  stash: StashItem[],
  context: AnalyzerContext
): StashAnalysis[] {
  const analyses: StashAnalysis[] = [];

  for (const stashItem of stash) {
    const analysis = analyzeStashItem(stashItem, context);
    if (analysis) {
      analyses.push(analysis);
    }
  }

  // Sort by priority (highest first), then by recommendation
  return analyses.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }
    // Group by recommendation
    const order: RecommendAction[] = ['keep', 'use', 'sell', 'recycle'];
    return order.indexOf(a.recommendation) - order.indexOf(b.recommendation);
  });
}

export function getStashSummary(analyses: StashAnalysis[]) {
  const summary = {
    keep: 0,
    sell: 0,
    recycle: 0,
    use: 0,
    totalValue: 0,
    potentialRecycleValue: 0,
  };

  for (const analysis of analyses) {
    summary[analysis.recommendation]++;

    if (analysis.recommendation === 'sell') {
      summary.totalValue += analysis.item.baseValue * analysis.quantity;
    }
  }

  return summary;
}
