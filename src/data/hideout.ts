import type { HideoutUpgrade } from '@/types';

export const HIDEOUT_UPGRADES: Record<string, HideoutUpgrade> = {
  // Workbench
  workbench_1: {
    id: 'workbench_1',
    name: 'Workbench Level 1',
    station: 'workbench',
    level: 1,
    requirements: [
      { itemId: 'scrap_metal', amount: 15 },
      { itemId: 'plastic_scraps', amount: 10 },
    ],
    unlocks: ['Basic weapon repairs', 'Simple mods'],
  },
  workbench_2: {
    id: 'workbench_2',
    name: 'Workbench Level 2',
    station: 'workbench',
    level: 2,
    requirements: [
      { itemId: 'refined_alloy', amount: 8 },
      { itemId: 'electronic_parts', amount: 10 },
      { itemId: 'polymer_compound', amount: 5 },
    ],
    unlocks: ['Advanced weapon mods', 'Weapon crafting'],
  },
  workbench_3: {
    id: 'workbench_3',
    name: 'Workbench Level 3',
    station: 'workbench',
    level: 3,
    requirements: [
      { itemId: 'titan_plate', amount: 4 },
      { itemId: 'quantum_cell', amount: 3 },
      { itemId: 'nexus_core', amount: 1 },
    ],
    unlocks: ['Elite weapon mods', 'ARC weapon crafting'],
  },

  // Medstation
  medstation_1: {
    id: 'medstation_1',
    name: 'Medstation Level 1',
    station: 'medstation',
    level: 1,
    requirements: [
      { itemId: 'scrap_metal', amount: 10 },
      { itemId: 'fabric_roll', amount: 8 },
    ],
    unlocks: ['Bandage crafting', 'Basic healing'],
  },
  medstation_2: {
    id: 'medstation_2',
    name: 'Medstation Level 2',
    station: 'medstation',
    level: 2,
    requirements: [
      { itemId: 'electronic_parts', amount: 6 },
      { itemId: 'polymer_compound', amount: 8 },
      { itemId: 'arc_shard', amount: 3 },
    ],
    unlocks: ['Medkit crafting', 'Stim crafting'],
  },
  medstation_3: {
    id: 'medstation_3',
    name: 'Medstation Level 3',
    station: 'medstation',
    level: 3,
    requirements: [
      { itemId: 'quantum_cell', amount: 4 },
      { itemId: 'void_essence', amount: 2 },
      { itemId: 'nexus_core', amount: 1 },
    ],
    unlocks: ['ARC Serum crafting', 'Advanced medical'],
  },

  // Stash
  stash_1: {
    id: 'stash_1',
    name: 'Stash Level 1',
    station: 'stash',
    level: 1,
    requirements: [
      { itemId: 'scrap_metal', amount: 20 },
      { itemId: 'plastic_scraps', amount: 15 },
    ],
    unlocks: ['Storage: 100 slots'],
  },
  stash_2: {
    id: 'stash_2',
    name: 'Stash Level 2',
    station: 'stash',
    level: 2,
    requirements: [
      { itemId: 'refined_alloy', amount: 10 },
      { itemId: 'polymer_compound', amount: 10 },
    ],
    unlocks: ['Storage: 200 slots'],
  },
  stash_3: {
    id: 'stash_3',
    name: 'Stash Level 3',
    station: 'stash',
    level: 3,
    requirements: [
      { itemId: 'titan_plate', amount: 6 },
      { itemId: 'nexus_core', amount: 2 },
    ],
    unlocks: ['Storage: 350 slots'],
  },

  // Generator
  generator_1: {
    id: 'generator_1',
    name: 'Generator Level 1',
    station: 'generator',
    level: 1,
    requirements: [
      { itemId: 'scrap_metal', amount: 25 },
      { itemId: 'electronic_parts', amount: 5 },
    ],
    unlocks: ['Power for basic stations'],
  },
  generator_2: {
    id: 'generator_2',
    name: 'Generator Level 2',
    station: 'generator',
    level: 2,
    requirements: [
      { itemId: 'quantum_cell', amount: 2 },
      { itemId: 'refined_alloy', amount: 12 },
      { itemId: 'electronic_parts', amount: 10 },
    ],
    unlocks: ['Power for advanced stations'],
  },
  generator_3: {
    id: 'generator_3',
    name: 'Generator Level 3',
    station: 'generator',
    level: 3,
    requirements: [
      { itemId: 'quantum_cell', amount: 5 },
      { itemId: 'nexus_core', amount: 2 },
      { itemId: 'void_essence', amount: 3 },
    ],
    unlocks: ['Unlimited power', 'Overcharge mode'],
  },

  // Intel Center
  intel_1: {
    id: 'intel_1',
    name: 'Intel Center Level 1',
    station: 'intel',
    level: 1,
    requirements: [
      { itemId: 'electronic_parts', amount: 8 },
      { itemId: 'scrap_metal', amount: 12 },
    ],
    unlocks: ['Basic map intel', 'Scav timer'],
  },
  intel_2: {
    id: 'intel_2',
    name: 'Intel Center Level 2',
    station: 'intel',
    level: 2,
    requirements: [
      { itemId: 'arc_shard', amount: 5 },
      { itemId: 'arc_data_chip', amount: 1 },
      { itemId: 'electronic_parts', amount: 15 },
    ],
    unlocks: ['ARC patrol routes', 'Loot hotspots'],
  },
  intel_3: {
    id: 'intel_3',
    name: 'Intel Center Level 3',
    station: 'intel',
    level: 3,
    requirements: [
      { itemId: 'arc_data_chip', amount: 3 },
      { itemId: 'nexus_core', amount: 2 },
      { itemId: 'void_essence', amount: 2 },
    ],
    unlocks: ['Real-time ARC tracking', 'Secret locations'],
  },
};

export const getUpgradeById = (id: string): HideoutUpgrade | undefined =>
  HIDEOUT_UPGRADES[id];

export const getUpgradesByStation = (station: string): HideoutUpgrade[] =>
  Object.values(HIDEOUT_UPGRADES)
    .filter((upgrade) => upgrade.station === station)
    .sort((a, b) => a.level - b.level);

export const getUpgradesRequiringItem = (itemId: string): HideoutUpgrade[] =>
  Object.values(HIDEOUT_UPGRADES).filter((upgrade) =>
    upgrade.requirements.some((req) => req.itemId === itemId)
  );

export const STATIONS = ['workbench', 'medstation', 'stash', 'generator', 'intel'];
