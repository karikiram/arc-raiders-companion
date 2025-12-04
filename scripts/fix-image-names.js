#!/usr/bin/env node
/**
 * Fix image name mismatches by creating copies/links with correct names
 */

const fs = require('fs');
const path = require('path');

const hqDir = path.join(__dirname, '..', 'public', 'items-hq');

// Manual name mappings: dbName -> hqImageName
const nameMappings = {
  // Weapon variants - all use level1 base image
  'anvil-i': 'anvil-level1',
  'anvil-ii': 'anvil-level1',
  'anvil-iii': 'anvil-level1',
  'anvil-iv': 'anvil-level1',
  'arpeggio-i': 'arpeggio-level1',
  'arpeggio-ii': 'arpeggio-level1',
  'arpeggio-iii': 'arpeggio-level1',
  'arpeggio-iv': 'arpeggio-level1',
  'bettina-i': 'bettina',
  'bettina-ii': 'bettina',
  'bettina-iii': 'bettina',
  'bettina-iv': 'bettina',
  'bobcat-ii': 'bobcat-level1',
  'bobcat-iii': 'bobcat-level1',
  'bobcat-iv': 'bobcat-level1',
  'burletta-i': 'burletta-level1',
  'burletta-ii': 'burletta-level1',
  'burletta-iiii': 'burletta-level1',
  'burletta-iv': 'burletta-level1',
  'equalizer-i': 'equalizer',
  'ferro-i': 'ferro-level1',
  'ferro-ii': 'ferro-level1',
  'ferro-iii': 'ferro-level1',
  'ferro-iv': 'ferro-level1',
  'hullcracker-i': 'hullcracker-level1',
  'hullcracker-ii': 'hullcracker-level1',
  'jupiter-i': 'jupiter',
  'jupiter-ii': 'jupiter',
  'jupiter-iii': 'jupiter',
  'jupiter-iv': 'jupiter',
  'kettle-i': 'kettle-level1',
  'kettle-ii': 'kettle-level1',
  'kettle-iii': 'kettle-level1',
  'kettle-iv': 'kettle-level1',
  'lynx-i': 'hairpin-level1',
  'lynx-ii': 'hairpin-level1',
  'lynx-iii': 'hairpin-level1',
  'lynx-iv': 'hairpin-level1',
  'ocelot-i': 'osprey-level1',
  'ocelot-ii': 'osprey-level1',
  'ocelot-iii': 'osprey-level1',
  'ocelot-iv': 'osprey-level1',
  'puma-i': 'stitcher-level1',
  'puma-ii': 'stitcher-level1',
  'puma-iii': 'stitcher-level1',
  'puma-iv': 'stitcher-level1',
  'rattler-i': 'rattler-level1',
  'rattler-ii': 'rattler-level1',
  'rattler-iii': 'rattler-level1',
  'rattler-iv': 'rattler-level1',
  'recluse-i': 'renegade-level1',
  'recluse-ii': 'renegade-level1',
  'recluse-iii': 'renegade-level1',
  'recluse-iv': 'renegade-level1',
  'viper-i': 'venator-level1',
  'viper-ii': 'venator-level1',
  'viper-iii': 'venator-level1',
  'viper-iv': 'venator-level1',
  'showstopper-i': 'showstopper',
  'showstopper-ii': 'showstopper',
  'showstopper-iii': 'showstopper',
  'showstopper-iv': 'showstopper',
  'aphelion-rifle': 'aphelion',

  // Blueprints - use weapon image
  'anvil-blueprint': 'anvil-level1',
  'aphelion-rifle-blueprint': 'aphelion',
  'bettina-blueprint': 'bettina',
  'bobcat-i-recipe': 'bobcat-level1',
  'burltetta-recipe': 'burletta-level1',

  // Augments
  'combat-mk3-aggressive-blueprint': 'combat-mk-3-aggressive',
  'combat-mk3-flanking': 'combat-mk-3-flanking',

  // Broken/ruined items
  'broken-handcuffs': 'ruined-handcuffs',
  'broken-riot-shield': 'ruined-riot-shield',

  // ARC parts
  'bastion-part': 'bastion-cell',
  'bison-driver': 'hornet-driver',
  // Typos in items.ts
  'diving-googles': 'diving-goggles',
  'danaged': null, // This is a typo, skip

  // Ammo type mappings
  'light-ammo': 'ammo-light',
  'medium-ammo': 'ammo-medium',
  'heavy-ammo': 'ammo-heavy',
  'shotgun-ammo': 'ammo-shotgun',
  'energy-ammo': 'ammo-energy',
  'launcher-ammo': 'launcher-ammo',

  // Material mappings
  'rubber-parts': 'rubber-parts',
  'steel-spring': 'steel-spring',
  'sensors': 'sensors',

  // Augments
  'combat-mk-3-defensive': 'tactical-mk-3-defensive',

  // Keys - various spellings
  'blue-gate-key': 'blue-gate-key',
  'buried-city-key': 'buried-city-key',
  'spaceport-key': 'spaceport-key',
  'stella-montis-key': 'stella-montis-key',
  'dam-battlegrounds-key': 'dam-battlegrounds-key',

  // Items with different names
  'jump-mine': 'explosive-mine',
  'ice-cream-scoop': 'ice-cream-scooper',
  'humidifier': 'humidifier',
  'spectrometer': 'spectrometer',
  'tv-set': 'portable-tv',
  'newspaper': 'poster-of-natural-wonders',
  'light-bulb': 'lightbulb',

  // ARC drops
  'rocketeer-part': 'rocketeer-driver',
  'damaged-rocketeer-part': 'damaged-rocketeer-driver',

  // Grenade variants
  'lil-smoke': 'lil-smoke-grenade',
  'snap-blast': 'snap-blast-grenade',
  'lure-trap': 'lure-grenade-trap',
  'smoke-trap': 'smoke-grenade-trap',

  // Stocks
  'stability-stock-i': 'stable-stock-i',
  'stability-stock-ii': 'stable-stock-ii',
  'stability-stock-iii': 'stable-stock-iii',

  // Misc
  'first-wave-item': 'first-wave-compass',
  'great-mullein': 'great-mullein',
  'impure-coolant': 'impure-arc-coolant',
  'spring': 'spring-cushion',
  'audio-recorder': 'recorder',
  'provisions': 'provisions',

  // Weapon parts that might have different names
  'bastion-cell': 'bastion-cell',
  'sentinel-core': 'sentinel-firing-core',
};

// Copy HQ images with new names where mappings exist
let fixed = 0;
let skipped = 0;

Object.entries(nameMappings).forEach(([dbName, hqName]) => {
  if (!hqName) {
    skipped++;
    return;
  }

  const srcPath = path.join(hqDir, `${hqName}.png`);
  const destPath = path.join(hqDir, `${dbName}.png`);

  // Check if source exists and dest doesn't already exist
  if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied: ${hqName}.png -> ${dbName}.png`);
    fixed++;
  } else if (fs.existsSync(destPath)) {
    console.log(`⏭️  Already exists: ${dbName}.png`);
    skipped++;
  } else {
    console.log(`⚠️  Source not found: ${hqName}.png`);
    skipped++;
  }
});

console.log(`\n📊 Summary: Fixed ${fixed}, Skipped ${skipped}`);

// Re-run verification
console.log('\n🔄 Re-running verification...\n');
require('./verify-images.js');
