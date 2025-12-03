// Hoarding Guide Data - Items needed for Workshop and Scrappy upgrades
// Source: Official ARC Raiders Wiki and community research

export interface HoardingRequirement {
  itemId: string;
  itemName: string;
  quantity: number;
  purpose: string;
  category: 'workshop' | 'scrappy';
  station?: string;
  level?: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  notes?: string;
}

export interface WorkshopStation {
  id: string;
  name: string;
  description: string;
  levels: WorkshopLevel[];
}

export interface WorkshopLevel {
  level: number;
  requirements: { itemId: string; itemName: string; quantity: number }[];
  unlocks: string[];
}

// Workshop Station Upgrade Requirements
export const WORKSHOP_STATIONS: WorkshopStation[] = [
  {
    id: 'gunsmith',
    name: 'Gunsmith',
    description: 'Craft and upgrade weapons',
    levels: [
      {
        level: 1,
        requirements: [
          { itemId: 'metal_parts', itemName: 'Metal Parts', quantity: 20 },
          { itemId: 'rubber_parts', itemName: 'Rubber Parts', quantity: 30 },
        ],
        unlocks: ['Basic weapon crafting'],
      },
      {
        level: 2,
        requirements: [
          { itemId: 'rusted_tools', itemName: 'Rusted Tools', quantity: 3 },
          { itemId: 'mechanical_components', itemName: 'Mechanical Components', quantity: 5 },
          { itemId: 'wasp_driver', itemName: 'Wasp Driver', quantity: 8 },
        ],
        unlocks: ['Uncommon weapon crafting', 'Weapon repairs'],
      },
      {
        level: 3,
        requirements: [
          { itemId: 'rusted_gear', itemName: 'Rusted Gear', quantity: 3 },
          { itemId: 'advanced_mechanical_components', itemName: 'Advanced Mechanical Components', quantity: 5 },
          { itemId: 'sentinel_firing_core', itemName: 'Sentinel Firing Core', quantity: 4 },
        ],
        unlocks: ['Rare weapon crafting', 'Advanced repairs'],
      },
    ],
  },
  {
    id: 'gear_bench',
    name: 'Gear Bench',
    description: 'Craft equipment and gear',
    levels: [
      {
        level: 1,
        requirements: [
          { itemId: 'plastic_parts', itemName: 'Plastic Parts', quantity: 25 },
          { itemId: 'fabric', itemName: 'Fabric', quantity: 30 },
        ],
        unlocks: ['Basic gear crafting'],
      },
      {
        level: 2,
        requirements: [
          { itemId: 'power_cable', itemName: 'Power Cable', quantity: 3 },
          { itemId: 'electrical_components', itemName: 'Electrical Components', quantity: 5 },
          { itemId: 'hornet_driver', itemName: 'Hornet Driver', quantity: 5 },
        ],
        unlocks: ['Uncommon gear crafting'],
      },
      {
        level: 3,
        requirements: [
          { itemId: 'industrial_battery', itemName: 'Industrial Battery', quantity: 3 },
          { itemId: 'advanced_electrical_components', itemName: 'Advanced Electrical Components', quantity: 5 },
          { itemId: 'bastion_cell', itemName: 'Bastion Cell', quantity: 6 },
        ],
        unlocks: ['Rare gear crafting'],
      },
    ],
  },
  {
    id: 'medical_lab',
    name: 'Medical Lab',
    description: 'Craft medical supplies and healing items',
    levels: [
      {
        level: 1,
        requirements: [
          { itemId: 'fabric', itemName: 'Fabric', quantity: 50 },
          { itemId: 'arc_alloy', itemName: 'ARC Alloy', quantity: 6 },
        ],
        unlocks: ['Basic medical crafting'],
      },
      {
        level: 2,
        requirements: [
          { itemId: 'cracked_bioscanner', itemName: 'Cracked Bioscanner', quantity: 2 },
          { itemId: 'durable_cloth', itemName: 'Durable Cloth', quantity: 5 },
          { itemId: 'tick_pod', itemName: 'Tick Pod', quantity: 8 },
        ],
        unlocks: ['Uncommon medical crafting'],
      },
      {
        level: 3,
        requirements: [
          { itemId: 'rusted_shut_medical_kit', itemName: 'Rusted Shut Medical Kit', quantity: 3 },
          { itemId: 'antiseptic', itemName: 'Antiseptic', quantity: 8 },
          { itemId: 'surveyor_vault', itemName: 'Surveyor Vault', quantity: 5 },
        ],
        unlocks: ['Rare medical crafting'],
      },
    ],
  },
  {
    id: 'explosives_station',
    name: 'Explosives Station',
    description: 'Craft grenades and explosive devices',
    levels: [
      {
        level: 1,
        requirements: [
          { itemId: 'chemicals', itemName: 'Chemicals', quantity: 50 },
          { itemId: 'arc_alloy', itemName: 'ARC Alloy', quantity: 6 },
        ],
        unlocks: ['Basic explosives crafting'],
      },
      {
        level: 2,
        requirements: [
          { itemId: 'synthesized_fuel', itemName: 'Synthesized Fuel', quantity: 3 },
          { itemId: 'crude_explosives', itemName: 'Crude Explosives', quantity: 5 },
          { itemId: 'pop_trigger', itemName: 'Pop Trigger', quantity: 5 },
        ],
        unlocks: ['Uncommon explosives crafting'],
      },
      {
        level: 3,
        requirements: [
          { itemId: 'laboratory_reagents', itemName: 'Laboratory Reagents', quantity: 3 },
          { itemId: 'explosive_compound', itemName: 'Explosive Compound', quantity: 5 },
          { itemId: 'rocketeer_driver', itemName: 'Rocketeer Driver', quantity: 3 },
        ],
        unlocks: ['Rare explosives crafting'],
      },
    ],
  },
  {
    id: 'utility_station',
    name: 'Utility Station',
    description: 'Craft utility items and gadgets',
    levels: [
      {
        level: 1,
        requirements: [
          { itemId: 'plastic_parts', itemName: 'Plastic Parts', quantity: 50 },
          { itemId: 'arc_alloy', itemName: 'ARC Alloy', quantity: 6 },
        ],
        unlocks: ['Basic utility crafting'],
      },
      {
        level: 2,
        requirements: [
          { itemId: 'damaged_heat_sink', itemName: 'Damaged Heat Sink', quantity: 2 },
          { itemId: 'electrical_components', itemName: 'Electrical Components', quantity: 5 },
          { itemId: 'snitch_scanner', itemName: 'Snitch Scanner', quantity: 6 },
        ],
        unlocks: ['Uncommon utility crafting'],
      },
      {
        level: 3,
        requirements: [
          { itemId: 'fried_motherboard', itemName: 'Fried Motherboard', quantity: 3 },
          { itemId: 'advanced_electrical_components', itemName: 'Advanced Electrical Components', quantity: 5 },
          { itemId: 'leaper_pulse_unit', itemName: 'Leaper Pulse Unit', quantity: 4 },
        ],
        unlocks: ['Rare utility crafting'],
      },
    ],
  },
  {
    id: 'refiner',
    name: 'Refiner',
    description: 'Convert and refine materials',
    levels: [
      {
        level: 1,
        requirements: [
          { itemId: 'metal_parts', itemName: 'Metal Parts', quantity: 60 },
          { itemId: 'arc_powercell', itemName: 'ARC Powercell', quantity: 5 },
        ],
        unlocks: ['Basic material conversion'],
      },
      {
        level: 2,
        requirements: [
          { itemId: 'toaster', itemName: 'Toaster', quantity: 3 },
          { itemId: 'arc_motion_core', itemName: 'ARC Motion Core', quantity: 5 },
          { itemId: 'fireball_burner', itemName: 'Fireball Burner', quantity: 8 },
        ],
        unlocks: ['Advanced material conversion'],
      },
      {
        level: 3,
        requirements: [
          { itemId: 'motor', itemName: 'Motor', quantity: 3 },
          { itemId: 'arc_circuitry', itemName: 'ARC Circuitry', quantity: 10 },
          { itemId: 'bombardier_cell', itemName: 'Bombardier Cell', quantity: 6 },
        ],
        unlocks: ['Expert material conversion'],
      },
    ],
  },
];

// Scrappy Upgrade Requirements
export const SCRAPPY_UPGRADES: WorkshopLevel[] = [
  {
    level: 2,
    requirements: [
      { itemId: 'dog_collar', itemName: 'Dog Collar', quantity: 1 },
    ],
    unlocks: ['Faster scavenging'],
  },
  {
    level: 3,
    requirements: [
      { itemId: 'lemon', itemName: 'Lemon', quantity: 3 },
      { itemId: 'apricot', itemName: 'Apricot', quantity: 3 },
    ],
    unlocks: ['More item variety'],
  },
  {
    level: 4,
    requirements: [
      { itemId: 'prickly_pear', itemName: 'Prickly Pear', quantity: 6 },
      { itemId: 'olives', itemName: 'Olives', quantity: 6 },
      { itemId: 'cat_bed', itemName: 'Cat Bed', quantity: 1 },
    ],
    unlocks: ['Increased capacity'],
  },
  {
    level: 5,
    requirements: [
      { itemId: 'mushroom', itemName: 'Mushroom', quantity: 12 },
      { itemId: 'apricot', itemName: 'Apricot', quantity: 12 },
      { itemId: 'very_comfortable_pillow', itemName: 'Very Comfortable Pillow', quantity: 3 },
    ],
    unlocks: ['Maximum efficiency'],
  },
];

// Calculate total requirements for all upgrades
export function calculateTotalRequirements(): Map<string, { itemName: string; quantity: number; purposes: string[] }> {
  const totals = new Map<string, { itemName: string; quantity: number; purposes: string[] }>();

  // Workshop stations
  for (const station of WORKSHOP_STATIONS) {
    for (const level of station.levels) {
      for (const req of level.requirements) {
        const existing = totals.get(req.itemId);
        const purpose = `${station.name} Level ${level.level}`;
        if (existing) {
          existing.quantity += req.quantity;
          existing.purposes.push(purpose);
        } else {
          totals.set(req.itemId, {
            itemName: req.itemName,
            quantity: req.quantity,
            purposes: [purpose],
          });
        }
      }
    }
  }

  // Scrappy upgrades
  for (const level of SCRAPPY_UPGRADES) {
    for (const req of level.requirements) {
      const existing = totals.get(req.itemId);
      const purpose = `Scrappy Level ${level.level}`;
      if (existing) {
        existing.quantity += req.quantity;
        existing.purposes.push(purpose);
      } else {
        totals.set(req.itemId, {
          itemName: req.itemName,
          quantity: req.quantity,
          purposes: [purpose],
        });
      }
    }
  }

  return totals;
}

// Categorized list of items to hoard
export const HOARDING_CATEGORIES = {
  arcParts: {
    name: 'ARC Robot Parts',
    description: 'Parts dropped from destroyed ARC robots - critical for workshop upgrades',
    priority: 'critical' as const,
    items: [
      { itemId: 'wasp_driver', itemName: 'Wasp Driver', totalNeeded: 8, source: 'Wasp robots' },
      { itemId: 'hornet_driver', itemName: 'Hornet Driver', totalNeeded: 5, source: 'Hornet robots' },
      { itemId: 'tick_pod', itemName: 'Tick Pod', totalNeeded: 8, source: 'Tick robots' },
      { itemId: 'pop_trigger', itemName: 'Pop Trigger', totalNeeded: 5, source: 'Pop robots' },
      { itemId: 'fireball_burner', itemName: 'Fireball Burner', totalNeeded: 8, source: 'Fireball robots' },
      { itemId: 'snitch_scanner', itemName: 'Snitch Scanner', totalNeeded: 6, source: 'Snitch robots' },
      { itemId: 'leaper_pulse_unit', itemName: 'Leaper Pulse Unit', totalNeeded: 4, source: 'Leaper robots' },
      { itemId: 'surveyor_vault', itemName: 'Surveyor Vault', totalNeeded: 5, source: 'Surveyor robots' },
      { itemId: 'rocketeer_driver', itemName: 'Rocketeer Driver', totalNeeded: 3, source: 'Rocketeer robots' },
      { itemId: 'bastion_cell', itemName: 'Bastion Cell', totalNeeded: 6, source: 'Bastion robots' },
      { itemId: 'bombardier_cell', itemName: 'Bombardier Cell', totalNeeded: 6, source: 'Bombardier robots' },
      { itemId: 'sentinel_firing_core', itemName: 'Sentinel Firing Core', totalNeeded: 4, source: 'Sentinel robots' },
    ],
  },
  brokenItems: {
    name: 'Broken/Damaged Items',
    description: 'Seemingly useless items that are actually required for critical upgrades',
    priority: 'critical' as const,
    items: [
      { itemId: 'rusted_tools', itemName: 'Rusted Tools', totalNeeded: 3, source: 'Industrial areas, toolboxes' },
      { itemId: 'rusted_gear', itemName: 'Rusted Gear', totalNeeded: 3, source: 'Industrial areas' },
      { itemId: 'rusted_shut_medical_kit', itemName: 'Rusted Shut Medical Kit', totalNeeded: 3, source: 'Medical areas' },
      { itemId: 'damaged_heat_sink', itemName: 'Damaged Heat Sink', totalNeeded: 2, source: 'Tech areas' },
      { itemId: 'fried_motherboard', itemName: 'Fried Motherboard', totalNeeded: 3, source: 'Tech areas, offices' },
      { itemId: 'cracked_bioscanner', itemName: 'Cracked Bioscanner', totalNeeded: 2, source: 'Medical areas' },
    ],
  },
  arcMaterials: {
    name: 'ARC Materials',
    description: 'Topside materials from ARC technology',
    priority: 'high' as const,
    items: [
      { itemId: 'arc_alloy', itemName: 'ARC Alloy', totalNeeded: 18, source: 'ARC containers, robots' },
      { itemId: 'arc_powercell', itemName: 'ARC Powercell', totalNeeded: 5, source: 'ARC containers' },
      { itemId: 'arc_circuitry', itemName: 'ARC Circuitry', totalNeeded: 10, source: 'ARC containers, tech areas' },
      { itemId: 'arc_motion_core', itemName: 'ARC Motion Core', totalNeeded: 5, source: 'ARC robots' },
    ],
  },
  refinedMaterials: {
    name: 'Refined Materials',
    description: 'Processed materials needed for upgrades',
    priority: 'high' as const,
    items: [
      { itemId: 'mechanical_components', itemName: 'Mechanical Components', totalNeeded: 5, source: 'Industrial areas, recycling' },
      { itemId: 'advanced_mechanical_components', itemName: 'Advanced Mechanical Components', totalNeeded: 5, source: 'High-tier loot, recycling' },
      { itemId: 'electrical_components', itemName: 'Electrical Components', totalNeeded: 10, source: 'Tech areas, recycling' },
      { itemId: 'advanced_electrical_components', itemName: 'Advanced Electrical Components', totalNeeded: 10, source: 'High-tier tech, recycling' },
      { itemId: 'durable_cloth', itemName: 'Durable Cloth', totalNeeded: 5, source: 'Residential areas' },
      { itemId: 'crude_explosives', itemName: 'Crude Explosives', totalNeeded: 5, source: 'Military areas' },
      { itemId: 'explosive_compound', itemName: 'Explosive Compound', totalNeeded: 5, source: 'Military areas' },
      { itemId: 'synthesized_fuel', itemName: 'Synthesized Fuel', totalNeeded: 3, source: 'Industrial areas' },
      { itemId: 'laboratory_reagents', itemName: 'Laboratory Reagents', totalNeeded: 3, source: 'Lab areas' },
    ],
  },
  basicMaterials: {
    name: 'Basic Materials',
    description: 'Common materials - keep until you have enough for all Level 1 upgrades',
    priority: 'medium' as const,
    items: [
      { itemId: 'metal_parts', itemName: 'Metal Parts', totalNeeded: 80, source: 'Everywhere, recycling' },
      { itemId: 'rubber_parts', itemName: 'Rubber Parts', totalNeeded: 30, source: 'Industrial areas, vehicles' },
      { itemId: 'plastic_parts', itemName: 'Plastic Parts', totalNeeded: 75, source: 'Everywhere, recycling' },
      { itemId: 'fabric', itemName: 'Fabric', totalNeeded: 80, source: 'Residential areas, recycling' },
      { itemId: 'chemicals', itemName: 'Chemicals', totalNeeded: 50, source: 'Industrial, medical areas' },
      { itemId: 'antiseptic', itemName: 'Antiseptic', totalNeeded: 8, source: 'Medical areas' },
    ],
  },
  recyclables: {
    name: 'Special Recyclables',
    description: 'Items needed for specific upgrades - do NOT recycle these',
    priority: 'high' as const,
    items: [
      { itemId: 'toaster', itemName: 'Toaster', totalNeeded: 3, source: 'Residential areas, kitchens' },
      { itemId: 'motor', itemName: 'Motor', totalNeeded: 3, source: 'Industrial areas, garages' },
      { itemId: 'power_cable', itemName: 'Power Cable', totalNeeded: 3, source: 'Industrial, tech areas' },
      { itemId: 'industrial_battery', itemName: 'Industrial Battery', totalNeeded: 3, source: 'Industrial areas' },
    ],
  },
  scrappyFood: {
    name: 'Scrappy Food & Trinkets',
    description: 'Items needed to upgrade Scrappy - do NOT sell these trinkets',
    priority: 'high' as const,
    items: [
      { itemId: 'dog_collar', itemName: 'Dog Collar', totalNeeded: 1, source: 'Residential areas (trinket)' },
      { itemId: 'cat_bed', itemName: 'Cat Bed', totalNeeded: 1, source: 'Residential areas (trinket)' },
      { itemId: 'very_comfortable_pillow', itemName: 'Very Comfortable Pillow', totalNeeded: 3, source: 'Residential areas (trinket)' },
      { itemId: 'lemon', itemName: 'Lemon', totalNeeded: 3, source: 'Nature spawns' },
      { itemId: 'apricot', itemName: 'Apricot', totalNeeded: 15, source: 'Nature spawns' },
      { itemId: 'prickly_pear', itemName: 'Prickly Pear', totalNeeded: 6, source: 'Nature spawns' },
      { itemId: 'olives', itemName: 'Olives', totalNeeded: 6, source: 'Nature spawns' },
      { itemId: 'mushroom', itemName: 'Mushroom', totalNeeded: 12, source: 'Nature spawns, shaded areas' },
    ],
  },
};

// Pro tips for hoarding
export const HOARDING_TIPS = [
  {
    title: 'Never sell broken items',
    description: 'Items like Rusted Tools, Fried Motherboard, and Damaged Heat Sink look like junk but are required for critical workshop upgrades.',
    priority: 'critical',
  },
  {
    title: 'Protect Scrappy trinkets',
    description: 'Dog Collar, Cat Bed, and Very Comfortable Pillow are trinkets needed to upgrade Scrappy. Mark them and never sell!',
    priority: 'critical',
  },
  {
    title: 'Farm ARC robots strategically',
    description: 'Each ARC robot type drops specific parts. You need 8 Wasp Drivers alone, so farm Wasps whenever you see them.',
    priority: 'high',
  },
  {
    title: 'Check before recycling',
    description: 'Toasters, Motors, and Power Cables might seem like good recycle fodder but are needed for the Refiner and Gear Bench.',
    priority: 'high',
  },
  {
    title: 'Stash space is limited',
    description: 'Max stash is 280 slots. Prioritize keeping critical upgrade items and sell excess basic materials after hitting targets.',
    priority: 'medium',
  },
  {
    title: 'Buy Gun Parts daily',
    description: 'Celeste sells 3 of each Gun Part type daily. Buy all 9 every day - they become scarce for weapon repairs.',
    priority: 'high',
  },
];
