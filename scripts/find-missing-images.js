#!/usr/bin/env node
/**
 * Find items in items.ts that don't have corresponding HQ images
 */

const fs = require('fs');
const path = require('path');

// Read items.ts and extract item IDs
const itemsPath = path.join(__dirname, '..', 'src', 'data', 'items.ts');
const itemsContent = fs.readFileSync(itemsPath, 'utf8');

// Extract all item IDs (lines like "  item_id: {")
const itemIdRegex = /^\s{2}([a-z_0-9]+):\s*\{/gm;
const itemIds = [];
let match;
while ((match = itemIdRegex.exec(itemsContent)) !== null) {
  itemIds.push(match[1]);
}

// Get all HQ images
const hqDir = path.join(__dirname, '..', 'public', 'items-hq');
const hqImages = fs.readdirSync(hqDir)
  .filter(f => f.endsWith('.png'))
  .map(f => f.replace('.png', '').toLowerCase());

// Create a set for quick lookup
const hqImageSet = new Set(hqImages);

// Convert item_id to kebab-case filename
function itemIdToFilename(itemId) {
  return itemId.replace(/_/g, '-');
}

// Find missing images
const missing = [];
const found = [];

itemIds.forEach(itemId => {
  const filename = itemIdToFilename(itemId);
  if (hqImageSet.has(filename)) {
    found.push({ itemId, filename });
  } else {
    missing.push({ itemId, filename });
  }
});

console.log('\n📊 Image Coverage Report\n');
console.log(`Total items in database: ${itemIds.length}`);
console.log(`HQ images available: ${hqImages.length}`);
console.log(`Items with HQ images: ${found.length}`);
console.log(`Items MISSING HQ images: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n❌ Missing HQ images:\n');

  // Group by category/type
  const blueprints = missing.filter(m => m.itemId.includes('blueprint'));
  const cosmetics = missing.filter(m =>
    m.itemId.includes('outfit') ||
    m.itemId.includes('color') ||
    m.itemId.includes('colour') ||
    m.itemId.includes('emote') ||
    m.itemId.includes('charm') ||
    m.itemId.includes('attachment') ||
    m.itemId.includes('variant') ||
    m.itemId.includes('style')
  );
  const keys = missing.filter(m => m.itemId.includes('key'));
  const weapons = missing.filter(m =>
    m.itemId.match(/_(i|ii|iii|iv)$/) &&
    !m.itemId.includes('blueprint')
  );
  const other = missing.filter(m =>
    !blueprints.includes(m) &&
    !cosmetics.includes(m) &&
    !keys.includes(m) &&
    !weapons.includes(m)
  );

  if (blueprints.length > 0) {
    console.log(`\n📋 Blueprints (${blueprints.length}):`);
    blueprints.forEach(m => console.log(`   - ${m.itemId} -> ${m.filename}.png`));
  }

  if (weapons.length > 0) {
    console.log(`\n🔫 Weapon Variants (${weapons.length}):`);
    weapons.forEach(m => console.log(`   - ${m.itemId} -> ${m.filename}.png`));
  }

  if (keys.length > 0) {
    console.log(`\n🔑 Keys (${keys.length}):`);
    keys.forEach(m => console.log(`   - ${m.itemId} -> ${m.filename}.png`));
  }

  if (cosmetics.length > 0) {
    console.log(`\n👕 Cosmetics (${cosmetics.length}):`);
    cosmetics.forEach(m => console.log(`   - ${m.itemId} -> ${m.filename}.png`));
  }

  if (other.length > 0) {
    console.log(`\n📦 Other Items (${other.length}):`);
    other.forEach(m => console.log(`   - ${m.itemId} -> ${m.filename}.png`));
  }
}

// Save results to JSON
const results = {
  stats: {
    totalItems: itemIds.length,
    hqImages: hqImages.length,
    itemsWithHQ: found.length,
    itemsMissing: missing.length
  },
  missing: missing,
  found: found.map(f => f.itemId)
};

fs.writeFileSync(
  path.join(__dirname, '..', 'missing-images.json'),
  JSON.stringify(results, null, 2)
);

console.log('\n📄 Results saved to missing-images.json');
