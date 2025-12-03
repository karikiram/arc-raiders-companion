import type { Quest } from '@/types';

export const QUESTS: Record<string, Quest> = {
  // Starter Quests
  first_steps: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Collect basic materials to get started.',
    giver: 'Magnus',
    requirements: [
      { itemId: 'scrap_metal', amount: 10 },
      { itemId: 'plastic_scraps', amount: 5 },
    ],
    rewards: [
      { itemId: 'makeshift_pistol', amount: 1 },
      { itemId: 'pistol_ammo', amount: 30 },
    ],
    experienceReward: 100,
  },
  gear_up: {
    id: 'gear_up',
    name: 'Gear Up',
    description: 'Acquire protective equipment.',
    giver: 'Magnus',
    requirements: [
      { itemId: 'fabric_roll', amount: 6 },
      { itemId: 'plastic_scraps', amount: 4 },
    ],
    rewards: [
      { itemId: 'scavenger_vest', amount: 1 },
      { itemId: 'bandage', amount: 5 },
    ],
    experienceReward: 150,
  },

  // Mid-game Quests
  tech_salvage: {
    id: 'tech_salvage',
    name: 'Tech Salvage',
    description: 'Recover electronic components from the wasteland.',
    giver: 'Doc',
    requirements: [
      { itemId: 'electronic_parts', amount: 8 },
      { itemId: 'arc_shard', amount: 2 },
    ],
    rewards: [
      { itemId: 'stim_shot', amount: 3 },
      { itemId: 'energy_cell', amount: 20 },
    ],
    experienceReward: 300,
  },
  warehouse_access: {
    id: 'warehouse_access',
    name: 'Warehouse Access',
    description: 'Find a keycard to access the old warehouse.',
    giver: 'Scrapper',
    requirements: [
      { itemId: 'warehouse_keycard', amount: 1 },
    ],
    rewards: [
      { itemId: 'scout_rifle', amount: 1 },
      { itemId: 'rifle_ammo', amount: 60 },
    ],
    experienceReward: 400,
  },
  refined_materials: {
    id: 'refined_materials',
    name: 'Refined Materials',
    description: 'Bring processed materials for advanced crafting.',
    giver: 'Doc',
    requirements: [
      { itemId: 'refined_alloy', amount: 5 },
      { itemId: 'polymer_compound', amount: 5 },
    ],
    rewards: [
      { itemId: 'tactical_rig', amount: 1 },
      { itemId: 'medkit', amount: 3 },
    ],
    experienceReward: 500,
  },

  // Advanced Quests
  arc_research: {
    id: 'arc_research',
    name: 'ARC Research',
    description: 'Collect ARC technology for research.',
    giver: 'Doc',
    requirements: [
      { itemId: 'quantum_cell', amount: 3 },
      { itemId: 'arc_shard', amount: 5 },
      { itemId: 'lab_keycard', amount: 1 },
    ],
    rewards: [
      { itemId: 'arc_disruptor', amount: 1 },
      { itemId: 'arc_serum', amount: 2 },
    ],
    experienceReward: 800,
  },
  titan_hunter: {
    id: 'titan_hunter',
    name: 'Titan Hunter',
    description: 'Prove yourself by collecting Titan parts.',
    giver: 'Commander Hayes',
    requirements: [
      { itemId: 'titan_plate', amount: 4 },
      { itemId: 'nexus_core', amount: 1 },
    ],
    rewards: [
      { itemId: 'titan_armor', amount: 1 },
      { itemId: 'arc_serum', amount: 3 },
    ],
    experienceReward: 1000,
  },

  // End-game Quests
  vault_heist: {
    id: 'vault_heist',
    name: 'Vault Heist',
    description: 'Access the high-security vault.',
    giver: 'The Broker',
    requirements: [
      { itemId: 'vault_keycard', amount: 1 },
      { itemId: 'arc_data_chip', amount: 2 },
    ],
    rewards: [
      { itemId: 'phantom_smg', amount: 1 },
      { itemId: 'void_essence', amount: 3 },
    ],
    experienceReward: 1500,
  },
  data_extraction: {
    id: 'data_extraction',
    name: 'Data Extraction',
    description: 'Collect encrypted ARC data for analysis.',
    giver: 'Doc',
    requirements: [
      { itemId: 'arc_data_chip', amount: 5 },
      { itemId: 'nexus_core', amount: 2 },
    ],
    rewards: [
      { itemId: 'void_essence', amount: 5 },
      { itemId: 'quantum_cell', amount: 5 },
    ],
    experienceReward: 2000,
  },
};

export const getQuestById = (id: string): Quest | undefined => QUESTS[id];

export const getQuestsByGiver = (giver: string): Quest[] =>
  Object.values(QUESTS).filter((quest) => quest.giver === giver);

export const getQuestsRequiringItem = (itemId: string): Quest[] =>
  Object.values(QUESTS).filter((quest) =>
    quest.requirements.some((req) => req.itemId === itemId)
  );
