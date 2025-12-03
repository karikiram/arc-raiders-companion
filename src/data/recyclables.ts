// Recyclables & Sellables Guide Data
// Source: ARC Raiders game data, MetaForge, GameSpot
import type { Rarity } from '@/types';

export type ItemAction = 'recycle' | 'sell' | 'either' | 'keep';

export interface RecyclableItem {
  itemId: string;
  itemName: string;
  rarity: Rarity;
  sellPrice: number;
  recycleYield?: {
    material: string;
    quantity: number;
  }[];
  recycleValue?: number;
  recommendation: ItemAction;
  reason?: string;
  warning?: string;
}

export interface TrinketItem {
  itemId: string;
  itemName: string;
  rarity: Rarity;
  sellPrice: number;
  recommendation: 'sell' | 'keep';
  reason?: string;
  warning?: string;
}

// Recyclable items - items that can be broken down for materials
export const RECYCLABLE_ITEMS: RecyclableItem[] = [
  // High-Value Recyclables
  {
    itemId: 'geiger_counter',
    itemName: 'Geiger Counter',
    rarity: 'epic',
    sellPrice: 3500,
    recycleYield: [
      { material: 'Sensors', quantity: 4 },
      { material: 'Electrical Components', quantity: 2 },
      { material: 'Plastic Parts', quantity: 3 },
    ],
    recycleValue: 1960,
    recommendation: 'either',
    reason: 'High sell value, but good sensor source if needed',
  },
  {
    itemId: 'ion_sputter',
    itemName: 'Ion Sputter',
    rarity: 'epic',
    sellPrice: 6000,
    recycleYield: [
      { material: 'Advanced Electrical Components', quantity: 2 },
      { material: 'Sensors', quantity: 3 },
      { material: 'Wires', quantity: 4 },
    ],
    recycleValue: 4660,
    recommendation: 'sell',
    reason: 'Sell price is higher - one of the best sellables',
  },
  {
    itemId: 'spectrum_analyzer',
    itemName: 'Spectrum Analyzer',
    rarity: 'epic',
    sellPrice: 3500,
    recycleYield: [
      { material: 'Exodus Modules', quantity: 1 },
      { material: 'Sensors', quantity: 3 },
      { material: 'Electrical Components', quantity: 2 },
    ],
    recycleValue: 2120,
    recommendation: 'either',
    reason: 'Recycle if you need Exodus Modules, otherwise sell',
  },
  {
    itemId: 'industrial_battery',
    itemName: 'Industrial Battery',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Battery', quantity: 4 },
      { material: 'Chemicals', quantity: 2 },
    ],
    recycleValue: 680,
    recommendation: 'keep',
    reason: 'Required for Gear Bench Level 3 upgrade',
    warning: 'DO NOT recycle - needed for Workshop upgrades!',
  },
  {
    itemId: 'fried_motherboard',
    itemName: 'Fried Motherboard',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Electrical Components', quantity: 3 },
      { material: 'Wires', quantity: 4 },
    ],
    recycleValue: 770,
    recommendation: 'keep',
    reason: 'Required for Utility Station Level 3 upgrade',
    warning: 'DO NOT recycle - needed for Workshop upgrades!',
  },
  {
    itemId: 'water_filter',
    itemName: 'Water Filter',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 4 },
      { material: 'Chemicals', quantity: 2 },
    ],
    recycleValue: 440,
    recommendation: 'sell',
    reason: 'Sell price is over 2x the recycled value',
  },
  {
    itemId: 'water_pump',
    itemName: 'Water Pump',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 5 },
      { material: 'Rubber Parts', quantity: 3 },
    ],
    recycleValue: 820,
    recommendation: 'sell',
    reason: 'Sell price is higher than recycled value',
  },
  {
    itemId: 'power_bank',
    itemName: 'Power Bank',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Battery', quantity: 4 },
      { material: 'Wires', quantity: 2 },
    ],
    recycleValue: 640,
    recommendation: 'sell',
    reason: 'Good sell price - sell unless you desperately need batteries',
  },
  {
    itemId: 'alarm_clock',
    itemName: 'Alarm Clock',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 2 },
      { material: 'Wires', quantity: 1 },
      { material: 'Battery', quantity: 1 },
    ],
    recycleValue: 420,
    recommendation: 'sell',
    reason: 'Sell price is much higher than recycle value',
  },
  {
    itemId: 'broken_flashlight',
    itemName: 'Broken Flashlight',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Electrical Components', quantity: 1 },
      { material: 'Battery', quantity: 1 },
      { material: 'Plastic Parts', quantity: 1 },
    ],
    recycleValue: 330,
    recommendation: 'sell',
    reason: 'Sell price is 3x the recycle value',
  },
  {
    itemId: 'toaster',
    itemName: 'Toaster',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 2 },
      { material: 'Wires', quantity: 2 },
      { material: 'Steel Spring', quantity: 1 },
    ],
    recycleValue: 540,
    recommendation: 'keep',
    reason: 'Required for Refiner Level 2 upgrade',
    warning: 'DO NOT recycle - needed for Workshop upgrades!',
  },

  // Mid-Value Recyclables
  {
    itemId: 'camera_lens',
    itemName: 'Camera Lens',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Sensors', quantity: 2 },
      { material: 'Plastic Parts', quantity: 1 },
    ],
    recycleValue: 620,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need sensors',
  },
  {
    itemId: 'portable_tv',
    itemName: 'Portable TV',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Electrical Components', quantity: 2 },
      { material: 'Wires', quantity: 2 },
      { material: 'Plastic Parts', quantity: 2 },
      { material: 'Sensors', quantity: 1 },
    ],
    recycleValue: 900,
    recommendation: 'recycle',
    reason: 'Recycle value is higher than sell price',
  },
  {
    itemId: 'projector',
    itemName: 'Projector',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Electrical Components', quantity: 2 },
      { material: 'Sensors', quantity: 2 },
      { material: 'Wires', quantity: 2 },
      { material: 'Plastic Parts', quantity: 1 },
    ],
    recycleValue: 1020,
    recommendation: 'recycle',
    reason: 'High sensor yield - recycle value beats sell price',
  },
  {
    itemId: 'rusted_gear',
    itemName: 'Rusted Gear',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 4 },
      { material: 'Steel Spring', quantity: 1 },
    ],
    recycleValue: 620,
    recommendation: 'keep',
    reason: 'Required for Gunsmith Level 3 upgrade',
    warning: 'DO NOT recycle - needed for Workshop upgrades!',
  },
  {
    itemId: 'candle_holder',
    itemName: 'Candle Holder',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 2 },
    ],
    recycleValue: 220,
    recommendation: 'sell',
    reason: 'Sell price is nearly 3x the recycle value',
  },
  {
    itemId: 'headphones',
    itemName: 'Headphones',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Wires', quantity: 2 },
      { material: 'Plastic Parts', quantity: 2 },
      { material: 'Metal Parts', quantity: 1 },
    ],
    recycleValue: 390,
    recommendation: 'sell',
    reason: 'Sell price is better',
  },
  {
    itemId: 'bicycle_pump',
    itemName: 'Bicycle Pump',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 2 },
      { material: 'Metal Parts', quantity: 2 },
    ],
    recycleValue: 400,
    recommendation: 'sell',
    reason: 'Sell price is 5x recycle value',
  },
  {
    itemId: 'diving_goggles',
    itemName: 'Diving Goggles',
    rarity: 'rare',
    sellPrice: 640,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 2 },
      { material: 'Plastic Parts', quantity: 1 },
    ],
    recycleValue: 240,
    recommendation: 'sell',
    reason: 'Sell for credits - recycle value is low',
  },
  {
    itemId: 'frying_pan',
    itemName: 'Frying Pan',
    rarity: 'rare',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 3 },
    ],
    recycleValue: 330,
    recommendation: 'sell',
    reason: 'Sell price is nearly 2x recycle value',
  },

  // Uncommon Recyclables
  {
    itemId: 'deflated_football',
    itemName: 'Deflated Football',
    rarity: 'uncommon',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Fabric', quantity: 9 },
      { material: 'Rubber Parts', quantity: 9 },
    ],
    recycleValue: 900,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need rubber/fabric',
  },
  {
    itemId: 'garlic_press',
    itemName: 'Garlic Press',
    rarity: 'uncommon',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 12 },
    ],
    recycleValue: 900,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need metal parts',
  },
  {
    itemId: 'remote_control',
    itemName: 'Remote Control',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 7 },
      { material: 'Sensors', quantity: 1 },
    ],
    recycleValue: 920,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need sensors',
  },

  // Damaged ARC Parts - Always recycle for ARC Alloy
  {
    itemId: 'damaged_arc_powercell',
    itemName: 'Damaged ARC Powercell',
    rarity: 'common',
    sellPrice: 293,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 1 },
    ],
    recycleValue: 200,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable for crafting',
  },
  {
    itemId: 'damaged_arc_motion_core',
    itemName: 'Damaged ARC Motion Core',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 2 },
    ],
    recycleValue: 400,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable - always recycle',
  },
  {
    itemId: 'burned_arc_circuitry',
    itemName: 'Burned ARC Circuitry',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 2 },
    ],
    recycleValue: 400,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable - always recycle',
  },
  {
    itemId: 'damaged_hornet_driver',
    itemName: 'Damaged Hornet Driver',
    rarity: 'common',
    sellPrice: 640,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 2 },
    ],
    recycleValue: 400,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable - always recycle',
  },
  {
    itemId: 'damaged_tick_pod',
    itemName: 'Damaged Tick Pod',
    rarity: 'common',
    sellPrice: 270,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 1 },
    ],
    recycleValue: 200,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable - always recycle',
  },
  {
    itemId: 'damaged_wasp_driver',
    itemName: 'Damaged Wasp Driver',
    rarity: 'common',
    sellPrice: 270,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 1 },
    ],
    recycleValue: 200,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable - always recycle',
  },
  {
    itemId: 'damaged_fireball_burner',
    itemName: 'Damaged Fireball Burner',
    rarity: 'common',
    sellPrice: 270,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 1 },
    ],
    recycleValue: 200,
    recommendation: 'recycle',
    reason: 'ARC Alloy is valuable - always recycle',
  },
  {
    itemId: 'damaged_rocketeer_driver',
    itemName: 'Damaged Rocketeer Driver',
    rarity: 'common',
    sellPrice: 2000,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 3 },
    ],
    recycleValue: 600,
    recommendation: 'sell',
    reason: 'Sell price is much higher than recycle value',
  },
  {
    itemId: 'pop_trigger',
    itemName: 'Pop Trigger',
    rarity: 'common',
    sellPrice: 640,
    recycleYield: [
      { material: 'Crude Explosives', quantity: 1 },
      { material: 'ARC Alloy', quantity: 1 },
    ],
    recycleValue: 470,
    recommendation: 'recycle',
    reason: 'Crude Explosives are useful for crafting',
  },

  // ARC Driver Parts - from enemy drops
  {
    itemId: 'hornet_driver',
    itemName: 'Hornet Driver',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 2 },
      { material: 'Electrical Components', quantity: 2 },
    ],
    recycleValue: 1680,
    recommendation: 'sell',
    reason: 'Sell price is higher than recycle value',
  },
  {
    itemId: 'wasp_driver',
    itemName: 'Wasp Driver',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 1 },
      { material: 'Electrical Components', quantity: 1 },
    ],
    recycleValue: 840,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'snitch_scanner',
    itemName: 'Snitch Scanner',
    rarity: 'uncommon',
    sellPrice: 2000,
    recycleYield: [
      { material: 'ARC Alloy', quantity: 4 },
      { material: 'Electrical Components', quantity: 2 },
    ],
    recycleValue: 2080,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need ARC Alloy',
  },
  {
    itemId: 'spotter_relay',
    itemName: 'Spotter Relay',
    rarity: 'uncommon',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Electrical Components', quantity: 2 },
      { material: 'ARC Alloy', quantity: 1 },
    ],
    recycleValue: 1480,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'shredder_gyro',
    itemName: 'Shredder Gyro',
    rarity: 'uncommon',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Mechanical Components', quantity: 3 },
      { material: 'ARC Alloy', quantity: 3 },
    ],
    recycleValue: 2520,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'tick_pod',
    itemName: 'Tick Pod',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Chemicals', quantity: 1 },
      { material: 'Metal Parts', quantity: 1 },
    ],
    recycleValue: 125,
    recommendation: 'sell',
    reason: 'Sell price is much higher',
  },

  // Epic ARC Parts - from special enemies
  {
    itemId: 'bastion_cell',
    itemName: 'Bastion Cell',
    rarity: 'epic',
    sellPrice: 5000,
    recycleYield: [
      { material: 'ARC Motion Core', quantity: 2 },
      { material: 'Advanced Mechanical Components', quantity: 2 },
    ],
    recycleValue: 5500,
    recommendation: 'keep',
    reason: 'Required for Gear Bench Level 3 (need 6!)',
    warning: 'DO NOT recycle - needed for Workshop upgrades!',
  },
  {
    itemId: 'leaper_pulse_unit',
    itemName: 'Leaper Pulse Unit',
    rarity: 'epic',
    sellPrice: 5000,
    recycleYield: [
      { material: 'Advanced Mechanical Components', quantity: 2 },
      { material: 'ARC Alloy', quantity: 3 },
    ],
    recycleValue: 4100,
    recommendation: 'sell',
    reason: 'Sell price is higher - good credits',
  },
  {
    itemId: 'rocketeer_driver',
    itemName: 'Rocketeer Driver',
    rarity: 'epic',
    sellPrice: 5000,
    recycleYield: [
      { material: 'Advanced Electrical Components', quantity: 2 },
      { material: 'ARC Alloy', quantity: 3 },
    ],
    recycleValue: 4100,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'magnetron',
    itemName: 'Magnetron',
    rarity: 'epic',
    sellPrice: 6000,
    recycleYield: [
      { material: 'Magnetic Accelerator', quantity: 1 },
      { material: 'Steel Spring', quantity: 1 },
    ],
    recycleValue: 3300,
    recommendation: 'sell',
    reason: 'Sell price is much higher - valuable drop',
  },

  // Legendary Reactors - from Queen/Matriarch
  {
    itemId: 'queen_reactor',
    itemName: 'Queen Reactor',
    rarity: 'legendary',
    sellPrice: 13000,
    recycleYield: [
      { material: 'Power Rod', quantity: 1 },
      { material: 'Magnetic Accelerator', quantity: 1 },
    ],
    recycleValue: 6000,
    recommendation: 'either',
    reason: 'High sell value, but materials used for Jupiter/Equalizer',
  },
  {
    itemId: 'matriarch_reactor',
    itemName: 'Matriarch Reactor',
    rarity: 'legendary',
    sellPrice: 13000,
    recycleYield: [
      { material: 'Power Rod', quantity: 1 },
      { material: 'Magnetic Accelerator', quantity: 1 },
    ],
    recycleValue: 6000,
    recommendation: 'either',
    reason: 'High sell value, but materials used for high-tier weapons',
  },

  // ARC Materials - Pure materials that recycle into basics
  {
    itemId: 'arc_coolant',
    itemName: 'ARC Coolant',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Chemicals', quantity: 16 },
    ],
    recycleValue: 800,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need chemicals',
  },
  {
    itemId: 'arc_flex_rubber',
    itemName: 'ARC Flex Rubber',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 16 },
    ],
    recycleValue: 800,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need rubber',
  },
  {
    itemId: 'arc_performance_steel',
    itemName: 'ARC Performance Steel',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 12 },
    ],
    recycleValue: 900,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need metal parts',
  },
  {
    itemId: 'arc_synthetic_resin',
    itemName: 'ARC Synthetic Resin',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 16 },
    ],
    recycleValue: 960,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need plastic',
  },
  {
    itemId: 'arc_thermo_lining',
    itemName: 'ARC Thermo Lining',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Fabric', quantity: 16 },
    ],
    recycleValue: 800,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need fabric',
  },

  // Degraded ARC Materials
  {
    itemId: 'degraded_arc_rubber',
    itemName: 'Degraded ARC Rubber',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 11 },
    ],
    recycleValue: 550,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need rubber',
  },
  {
    itemId: 'dried_out_arc_resin',
    itemName: 'Dried-Out ARC Resin',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 9 },
    ],
    recycleValue: 540,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need plastic',
  },
  {
    itemId: 'impure_arc_coolant',
    itemName: 'Impure ARC Coolant',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Chemicals', quantity: 13 },
    ],
    recycleValue: 650,
    recommendation: 'either',
    reason: 'Recycle value slightly higher',
  },
  {
    itemId: 'rusty_arc_steel',
    itemName: 'Rusty ARC Steel',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 8 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need metal',
  },
  {
    itemId: 'tattered_arc_lining',
    itemName: 'Tattered ARC Lining',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Fabric', quantity: 12 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need fabric',
  },

  // Lab & Tech Equipment
  {
    itemId: 'laboratory_reagents',
    itemName: 'Laboratory Reagents',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Chemicals', quantity: 2 },
      { material: 'Crude Explosives', quantity: 2 },
    ],
    recycleValue: 640,
    recommendation: 'sell',
    reason: 'Sell price is 3x recycle value',
  },
  {
    itemId: 'microscope',
    itemName: 'Microscope',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Advanced Mechanical Components', quantity: 1 },
      { material: 'Magnet', quantity: 3 },
    ],
    recycleValue: 2650,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'mini_centrifuge',
    itemName: 'Mini Centrifuge',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Advanced Mechanical Components', quantity: 1 },
      { material: 'Canister', quantity: 2 },
    ],
    recycleValue: 2350,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'sample_cleaner',
    itemName: 'Sample Cleaner',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Electrical Components', quantity: 2 },
      { material: 'Assorted Seeds', quantity: 14 },
    ],
    recycleValue: 1980,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'spectrometer',
    itemName: 'Spectrometer',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Advanced Electrical Components', quantity: 1 },
      { material: 'Sensors', quantity: 1 },
    ],
    recycleValue: 2250,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'rotary_encoder',
    itemName: 'Rotary Encoder',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Electrical Components', quantity: 2 },
      { material: 'Processor', quantity: 2 },
    ],
    recycleValue: 2280,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },

  // Communication Equipment
  {
    itemId: 'broken_handheld_radio',
    itemName: 'Broken Handheld Radio',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Sensors', quantity: 3 },
      { material: 'Wires', quantity: 3 },
    ],
    recycleValue: 2100,
    recommendation: 'either',
    reason: 'Recycle value slightly higher - good for sensors',
  },
  {
    itemId: 'radio',
    itemName: 'Radio',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Speaker Component', quantity: 1 },
      { material: 'Sensors', quantity: 1 },
    ],
    recycleValue: 1000,
    recommendation: 'either',
    reason: 'Same value - recycle if you need sensors',
  },
  {
    itemId: 'radio_relay',
    itemName: 'Radio Relay',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Speaker Component', quantity: 2 },
      { material: 'Sensors', quantity: 2 },
    ],
    recycleValue: 2000,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'signal_amplifier',
    itemName: 'Signal Amplifier',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Electrical Components', quantity: 2 },
      { material: 'Voltage Converter', quantity: 2 },
    ],
    recycleValue: 2280,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'telemetry_transceiver',
    itemName: 'Telemetry Transceiver',
    rarity: 'rare',
    sellPrice: 3000,
    recycleYield: [
      { material: 'Advanced Electrical Components', quantity: 1 },
      { material: 'Processor', quantity: 1 },
    ],
    recycleValue: 2250,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'broken_guidance_system',
    itemName: 'Broken Guidance System',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Processor', quantity: 4 },
    ],
    recycleValue: 2000,
    recommendation: 'either',
    reason: 'Same value - recycle if you need processors',
  },

  // Industrial Equipment
  {
    itemId: 'industrial_charger',
    itemName: 'Industrial Charger',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 5 },
      { material: 'Voltage Converter', quantity: 1 },
    ],
    recycleValue: 875,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'industrial_magnet',
    itemName: 'Industrial Magnet',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Magnet', quantity: 2 },
      { material: 'Metal Parts', quantity: 4 },
    ],
    recycleValue: 900,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'motor',
    itemName: 'Motor',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Oil', quantity: 2 },
      { material: 'Mechanical Components', quantity: 2 },
    ],
    recycleValue: 1480,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'turbo_pump',
    itemName: 'Turbo Pump',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Mechanical Components', quantity: 1 },
      { material: 'Oil', quantity: 3 },
    ],
    recycleValue: 1040,
    recommendation: 'sell',
    reason: 'Sell price is much higher',
  },
  {
    itemId: 'cooling_fan',
    itemName: 'Cooling Fan',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 14 },
      { material: 'Battery', quantity: 4 },
    ],
    recycleValue: 1840,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'cooling_coil',
    itemName: 'Cooling Coil',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Chemicals', quantity: 6 },
      { material: 'Steel Spring', quantity: 2 },
    ],
    recycleValue: 700,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'coolant',
    itemName: 'Coolant',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Chemicals', quantity: 5 },
      { material: 'Oil', quantity: 2 },
    ],
    recycleValue: 650,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'damaged_heat_sink',
    itemName: 'Damaged Heat Sink',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 6 },
      { material: 'Wires', quantity: 2 },
    ],
    recycleValue: 850,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'humidifier',
    itemName: 'Humidifier',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Canister', quantity: 2 },
      { material: 'Wires', quantity: 2 },
    ],
    recycleValue: 1000,
    recommendation: 'either',
    reason: 'Same value - your choice',
  },
  {
    itemId: 'voltage_converter',
    itemName: 'Voltage Converter',
    rarity: 'rare',
    sellPrice: 500,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 1 },
      { material: 'Wires', quantity: 1 },
    ],
    recycleValue: 250,
    recommendation: 'keep',
    reason: 'Used to craft Heavy Shield and Showstopper',
    warning: 'Keep for crafting weapons/gear!',
  },
  {
    itemId: 'speaker_component',
    itemName: 'Speaker Component',
    rarity: 'rare',
    sellPrice: 500,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 2 },
      { material: 'Rubber Parts', quantity: 2 },
    ],
    recycleValue: 220,
    recommendation: 'keep',
    reason: 'Used to craft Photoelectric Cloak and Lure Grenade',
    warning: 'Keep for crafting gear!',
  },
  {
    itemId: 'power_cable',
    itemName: 'Power Cable',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Wires', quantity: 4 },
    ],
    recycleValue: 800,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },

  // Weapons & Security
  {
    itemId: 'broken_taser',
    itemName: 'Broken Taser',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Battery', quantity: 2 },
      { material: 'Wires', quantity: 2 },
    ],
    recycleValue: 900,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'ruined_riot_shield',
    itemName: 'Ruined Riot Shield',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 10 },
      { material: 'Rubber Parts', quantity: 6 },
    ],
    recycleValue: 900,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need materials',
  },
  {
    itemId: 'unusable_weapon',
    itemName: 'Unusable Weapon',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 4 },
      { material: 'Simple Gun Parts', quantity: 5 },
    ],
    recycleValue: 1300,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'rocket_thruster',
    itemName: 'Rocket Thruster',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Synthesized Fuel', quantity: 2 },
      { material: 'Metal Parts', quantity: 6 },
    ],
    recycleValue: 1850,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },

  // Medical & Safety
  {
    itemId: 'cracked_bioscanner',
    itemName: 'Cracked Bioscanner',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 3 },
      { material: 'Battery', quantity: 5 },
    ],
    recycleValue: 1400,
    recommendation: 'recycle',
    reason: 'Recycle value is higher - good battery source',
  },
  {
    itemId: 'rusted_shut_medical_kit',
    itemName: 'Rusted Shut Medical Kit',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Syringe', quantity: 2 },
      { material: 'Antiseptic', quantity: 1 },
    ],
    recycleValue: 2000,
    recommendation: 'either',
    reason: 'Same value - recycle if you need medical supplies',
  },
  {
    itemId: 'expired_respirator',
    itemName: 'Expired Respirator',
    rarity: 'rare',
    sellPrice: 640,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 8 },
      { material: 'Fabric', quantity: 4 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - your choice',
  },
  {
    itemId: 'polluted_air_filter',
    itemName: 'Polluted Air Filter',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Fabric', quantity: 6 },
      { material: 'Oil', quantity: 2 },
    ],
    recycleValue: 700,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'ripped_safety_vest',
    itemName: 'Ripped Safety Vest',
    rarity: 'uncommon',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Magnet', quantity: 1 },
      { material: 'Durable Cloth', quantity: 1 },
    ],
    recycleValue: 940,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },

  // Clothing & Fabric
  {
    itemId: 'tattered_clothes',
    itemName: 'Tattered Clothes',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Fabric', quantity: 11 },
    ],
    recycleValue: 550,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need fabric',
  },
  {
    itemId: 'torn_blanket',
    itemName: 'Torn Blanket',
    rarity: 'rare',
    sellPrice: 640,
    recycleYield: [
      { material: 'Fabric', quantity: 12 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need fabric',
  },
  {
    itemId: 'ruined_parachute',
    itemName: 'Ruined Parachute',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Fabric', quantity: 10 },
    ],
    recycleValue: 500,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'ruined_tactical_vest',
    itemName: 'Ruined Tactical Vest',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Fabric', quantity: 5 },
      { material: 'Magnet', quantity: 1 },
    ],
    recycleValue: 550,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'spring_cushion',
    itemName: 'Spring Cushion',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Durable Cloth', quantity: 2 },
      { material: 'Steel Spring', quantity: 2 },
    ],
    recycleValue: 1680,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'rubber_pad',
    itemName: 'Rubber Pad',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 18 },
    ],
    recycleValue: 900,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need rubber',
  },

  // Metal & Hardware
  {
    itemId: 'rusted_tools',
    itemName: 'Rusted Tools',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Metal Parts', quantity: 8 },
      { material: 'Steel Spring', quantity: 1 },
    ],
    recycleValue: 900,
    recommendation: 'keep',
    reason: 'Required for Gunsmith II upgrade (need 3)',
    warning: 'DO NOT recycle - needed for Workshop upgrades!',
  },
  {
    itemId: 'rusted_bolts',
    itemName: 'Rusted Bolts',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 8 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need metal',
  },
  {
    itemId: 'metal_brackets',
    itemName: 'Metal Brackets',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 8 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need metal',
  },
  {
    itemId: 'ruined_handcuffs',
    itemName: 'Ruined Handcuffs',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 8 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - recycle if you need metal',
  },
  {
    itemId: 'ruined_baton',
    itemName: 'Ruined Baton',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Metal Parts', quantity: 6 },
      { material: 'Rubber Parts', quantity: 3 },
    ],
    recycleValue: 600,
    recommendation: 'either',
    reason: 'Similar value - your choice',
  },
  {
    itemId: 'number_plate',
    itemName: 'Number Plate',
    rarity: 'uncommon',
    sellPrice: 270,
    recycleYield: [
      { material: 'Metal Parts', quantity: 3 },
    ],
    recycleValue: 225,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'crumpled_plastic_bottle',
    itemName: 'Crumpled Plastic Bottle',
    rarity: 'uncommon',
    sellPrice: 270,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 3 },
    ],
    recycleValue: 180,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
  {
    itemId: 'household_cleaner',
    itemName: 'Household Cleaner',
    rarity: 'uncommon',
    sellPrice: 640,
    recycleYield: [
      { material: 'Chemicals', quantity: 13 },
    ],
    recycleValue: 650,
    recommendation: 'either',
    reason: 'Recycle value slightly higher',
  },
  {
    itemId: 'ruined_accordion',
    itemName: 'Ruined Accordion',
    rarity: 'rare',
    sellPrice: 2000,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 18 },
      { material: 'Steel Spring', quantity: 3 },
    ],
    recycleValue: 1800,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'ruined_augment',
    itemName: 'Ruined Augment',
    rarity: 'common',
    sellPrice: 270,
    recycleYield: [
      { material: 'Plastic Parts', quantity: 2 },
      { material: 'Rubber Parts', quantity: 2 },
    ],
    recycleValue: 220,
    recommendation: 'sell',
    reason: 'Sell price is slightly higher',
  },
  {
    itemId: 'thermostat',
    itemName: 'Thermostat',
    rarity: 'rare',
    sellPrice: 1000,
    recycleYield: [
      { material: 'Rubber Parts', quantity: 6 },
      { material: 'Sensors', quantity: 2 },
    ],
    recycleValue: 1300,
    recommendation: 'recycle',
    reason: 'Recycle value is higher - good sensor source',
  },

  // Advanced Electrical Components (craftable material)
  {
    itemId: 'advanced_electrical_components',
    itemName: 'Advanced Electrical Components',
    rarity: 'rare',
    sellPrice: 1750,
    recycleYield: [
      { material: 'Electrical Components', quantity: 1 },
      { material: 'Wires', quantity: 1 },
    ],
    recycleValue: 840,
    recommendation: 'sell',
    reason: 'Sell price is much higher - valuable crafting material',
  },
  {
    itemId: 'advanced_mechanical_components',
    itemName: 'Advanced Mechanical Components',
    rarity: 'rare',
    sellPrice: 1750,
    recycleYield: [
      { material: 'Mechanical Components', quantity: 1 },
      { material: 'Wires', quantity: 1 },
    ],
    recycleValue: 840,
    recommendation: 'sell',
    reason: 'Sell price is much higher - valuable crafting material',
  },
  {
    itemId: 'advanced_arc_powercell',
    itemName: 'Advanced ARC Powercell',
    rarity: 'rare',
    sellPrice: 640,
    recycleYield: [
      { material: 'ARC Powercell', quantity: 2 },
    ],
    recycleValue: 540,
    recommendation: 'sell',
    reason: 'Sell price is higher',
  },
];

// Trinket items - safe to sell for credits
export const TRINKET_ITEMS: TrinketItem[] = [
  // Epic Trinkets (Highest Value)
  {
    itemId: 'lances_mixtape_5th_edition',
    itemName: "Lance's Mixtape (5th Edition)",
    rarity: 'epic',
    sellPrice: 10000,
    recommendation: 'sell',
    reason: 'Highest value trinket in the game!',
  },
  {
    itemId: 'breathtaking_snow_globe',
    itemName: 'Breathtaking Snow Globe',
    rarity: 'epic',
    sellPrice: 7000,
    recommendation: 'sell',
    reason: 'Second highest value trinket',
  },

  // Rare Trinkets
  {
    itemId: 'red_coral_jewelry',
    itemName: 'Red Coral Jewelry',
    rarity: 'rare',
    sellPrice: 5000,
    recommendation: 'sell',
    reason: 'High value rare trinket',
  },
  {
    itemId: 'playing_cards',
    itemName: 'Playing Cards',
    rarity: 'rare',
    sellPrice: 5000,
    recommendation: 'sell',
    reason: 'High value rare trinket',
  },
  {
    itemId: 'music_box',
    itemName: 'Music Box',
    rarity: 'rare',
    sellPrice: 5000,
    recommendation: 'sell',
    reason: 'High value rare trinket',
  },
  {
    itemId: 'fine_wristwatch',
    itemName: 'Fine Wristwatch',
    rarity: 'rare',
    sellPrice: 3000,
    recommendation: 'sell',
    reason: 'Good value rare trinket',
  },
  {
    itemId: 'silver_teaspoon_set',
    itemName: 'Silver Teaspoon Set',
    rarity: 'rare',
    sellPrice: 3000,
    recommendation: 'sell',
    reason: 'Good value rare trinket',
  },
  {
    itemId: 'statuette',
    itemName: 'Statuette',
    rarity: 'rare',
    sellPrice: 3000,
    recommendation: 'sell',
    reason: 'Good value rare trinket',
  },
  {
    itemId: 'vase',
    itemName: 'Vase',
    rarity: 'rare',
    sellPrice: 3000,
    recommendation: 'sell',
    reason: 'Good value rare trinket',
  },
  {
    itemId: 'music_album',
    itemName: 'Music Album',
    rarity: 'rare',
    sellPrice: 3000,
    recommendation: 'sell',
    reason: 'Good value rare trinket',
  },
  {
    itemId: 'film_reel',
    itemName: 'Film Reel',
    rarity: 'rare',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Decent value rare trinket',
  },
  {
    itemId: 'rosary',
    itemName: 'Rosary',
    rarity: 'rare',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Decent value rare trinket',
  },

  // Uncommon Trinkets
  {
    itemId: 'pottery',
    itemName: 'Pottery',
    rarity: 'uncommon',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Good value uncommon trinket',
  },
  {
    itemId: 'very_comfortable_pillow',
    itemName: 'Very Comfortable Pillow',
    rarity: 'uncommon',
    sellPrice: 2000,
    recommendation: 'keep',
    reason: 'Required for Scrappy Level 5 upgrade (need 3!)',
    warning: 'DO NOT SELL - needed for Scrappy upgrades!',
  },
  {
    itemId: 'poster_of_natural_wonder',
    itemName: 'Poster of Natural Wonder',
    rarity: 'uncommon',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Good value uncommon trinket',
  },
  {
    itemId: 'light_bulb',
    itemName: 'Light Bulb',
    rarity: 'uncommon',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Good value uncommon trinket',
  },
  {
    itemId: 'air_freshener',
    itemName: 'Air Freshener',
    rarity: 'uncommon',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Good value uncommon trinket',
  },
  {
    itemId: 'dart_board',
    itemName: 'Dart Board',
    rarity: 'uncommon',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'Good value uncommon trinket',
  },
  {
    itemId: 'painted_box',
    itemName: 'Painted Box',
    rarity: 'common',
    sellPrice: 2000,
    recommendation: 'sell',
    reason: 'High value common trinket',
  },
  {
    itemId: 'cat_bed',
    itemName: 'Cat Bed',
    rarity: 'uncommon',
    sellPrice: 1000,
    recommendation: 'keep',
    reason: 'Required for Scrappy Level 4 upgrade',
    warning: 'DO NOT SELL - needed for Scrappy upgrades!',
  },

  // Common Trinkets
  {
    itemId: 'rubber_duck',
    itemName: 'Rubber Duck',
    rarity: 'common',
    sellPrice: 1000,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'bloated_tuna_can',
    itemName: 'Bloated Tuna Can',
    rarity: 'common',
    sellPrice: 1000,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'torn_book',
    itemName: 'Torn Book',
    rarity: 'common',
    sellPrice: 1000,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'coffee_pot',
    itemName: 'Coffee Pot',
    rarity: 'common',
    sellPrice: 1000,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'expired_pasta',
    itemName: 'Expired Pasta',
    rarity: 'common',
    sellPrice: 1000,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'empty_wine_bottle',
    itemName: 'Empty Wine Bottle',
    rarity: 'common',
    sellPrice: 1000,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'faded_photograph',
    itemName: 'Faded Photograph',
    rarity: 'common',
    sellPrice: 640,
    recommendation: 'sell',
    reason: 'Vendor trash - sell it',
  },
  {
    itemId: 'dog_collar',
    itemName: 'Dog Collar',
    rarity: 'common',
    sellPrice: 640,
    recommendation: 'keep',
    reason: 'Required for Scrappy Level 2 upgrade',
    warning: 'DO NOT SELL - needed for Scrappy upgrades!',
  },
];

// Tips for the recyclables guide
export const RECYCLABLES_TIPS = [
  {
    title: 'Recycle at Hideout',
    description: 'Always recycle at your Hideout for 100% material yield. Salvaging during raids gives reduced returns.',
    priority: 'critical',
  },
  {
    title: 'Damaged ARC Parts',
    description: 'Damaged ARC Powercell recycles into materials worth 3x+ its sell price. Always recycle these!',
    priority: 'high',
  },
  {
    title: 'Trinkets Have Diamond Icons',
    description: 'Items with a diamond symbol are trinkets - they exist only to be sold for credits.',
    priority: 'medium',
  },
  {
    title: 'Watch for Workshop Items',
    description: 'Toaster, Industrial Battery, Fried Motherboard, and Rusted Gear are needed for Workshop upgrades.',
    priority: 'critical',
  },
  {
    title: 'Scrappy Trinkets',
    description: 'Dog Collar, Cat Bed, and Very Comfortable Pillow look like junk but are needed for Scrappy!',
    priority: 'critical',
  },
  {
    title: 'Track Resources Feature',
    description: 'Use the in-game Track Resources button to see which items are needed for upgrades before recycling.',
    priority: 'medium',
  },
];

// Material name to rarity mapping for coloring recycle yields
// Based on items.ts material definitions
export const MATERIAL_RARITIES: Record<string, Rarity> = {
  // Common materials
  'Metal Parts': 'common',
  'Plastic Parts': 'common',
  'Rubber Parts': 'common',
  'Chemicals': 'common',
  'Fabric': 'common',
  'ARC Powercell': 'common',
  'Oil': 'common',
  'Simple Gun Parts': 'common',
  'Assorted Seeds': 'common',

  // Uncommon materials
  'ARC Alloy': 'uncommon',
  'Electrical Components': 'uncommon',
  'Battery': 'uncommon',
  'Wires': 'uncommon',
  'Duct Tape': 'uncommon',
  'Canister': 'uncommon',
  'Mechanical Components': 'uncommon',
  'Durable Cloth': 'uncommon',
  'Crude Explosives': 'uncommon',
  'Steel Spring': 'uncommon',
  'Magnet': 'uncommon',
  'Processor': 'uncommon',
  'Speaker Component': 'uncommon',
  'Voltage Converter': 'uncommon',

  // Rare materials
  'Sensors': 'rare',
  'Advanced Electrical Components': 'rare',
  'Advanced Mechanical Components': 'rare',
  'ARC Circuitry': 'rare',
  'ARC Motion Core': 'rare',
  'Advanced ARC Powercell': 'rare',
  'Explosive Compound': 'rare',
  'Antiseptic': 'rare',
  'Synthesized Fuel': 'rare',
  'Syringe': 'rare',
  'Mod Components': 'rare',
  'Moss': 'rare',
  'Laboratory Reagents': 'rare',

  // Epic materials
  'Complex Gun Parts': 'epic',
  'Exodus Modules': 'epic',
  'Magnetic Accelerator': 'epic',
  'Power Rod': 'epic',
};

// Helper function to get material rarity
export function getMaterialRarity(materialName: string): Rarity {
  return MATERIAL_RARITIES[materialName] || 'common';
}

// Helper function to get all items sorted by recommendation
export function getItemsByRecommendation(action: ItemAction) {
  return RECYCLABLE_ITEMS.filter(item => item.recommendation === action);
}

// Helper function to calculate total potential value
export function calculatePotentialValue(items: RecyclableItem[]): { sellTotal: number; recycleTotal: number } {
  return items.reduce((acc, item) => ({
    sellTotal: acc.sellTotal + item.sellPrice,
    recycleTotal: acc.recycleTotal + (item.recycleValue || item.sellPrice),
  }), { sellTotal: 0, recycleTotal: 0 });
}
