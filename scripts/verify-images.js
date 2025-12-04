#!/usr/bin/env node
/**
 * Verify which items have matching high-quality images
 */

const fs = require('fs');
const path = require('path');

// Get all HQ images
const hqDir = path.join(__dirname, '..', 'public', 'items-hq');
const hqImages = new Set(
  fs.readdirSync(hqDir)
    .filter(f => f.endsWith('.png'))
    .map(f => f.replace('.png', ''))
);

// Get all old images for fallback check
const oldDir = path.join(__dirname, '..', 'public', 'items');
const oldImages = new Set(
  fs.readdirSync(oldDir)
    .filter(f => f.endsWith('.webp'))
    .map(f => f.replace('48.webp', ''))
);

// Read items.ts and extract image paths
const itemsPath = path.join(__dirname, '..', 'src', 'data', 'items.ts');
const itemsContent = fs.readFileSync(itemsPath, 'utf8');

// Extract all img() calls
const imgCalls = [...itemsContent.matchAll(/img\(['"]([^'"]+)['"]\)/g)];
const itemImages = new Set(imgCalls.map(m => m[1]));

console.log('\n📊 Image Verification Report\n');
console.log(`Total items in database: ${itemImages.size}`);
console.log(`HQ images available: ${hqImages.size}`);
console.log(`Old images available: ${oldImages.size}`);

// Check which items have HQ images
const haveHQ = [];
const haveOldOnly = [];
const noImage = [];

itemImages.forEach(img => {
  if (hqImages.has(img)) {
    haveHQ.push(img);
  } else if (oldImages.has(img)) {
    haveOldOnly.push(img);
  } else {
    noImage.push(img);
  }
});

console.log(`\n✅ Items with HQ images: ${haveHQ.length}`);
console.log(`⚠️  Items with old images only: ${haveOldOnly.length}`);
console.log(`❌ Items with no images: ${noImage.length}`);

if (haveOldOnly.length > 0) {
  console.log('\n⚠️  Items needing HQ images (have old image):');
  haveOldOnly.slice(0, 20).forEach(img => console.log(`   - ${img}`));
  if (haveOldOnly.length > 20) {
    console.log(`   ... and ${haveOldOnly.length - 20} more`);
  }
}

if (noImage.length > 0) {
  console.log('\n❌ Items with NO images at all:');
  noImage.forEach(img => console.log(`   - ${img}`));
}

// Check for HQ images not used by any item
const unusedHQ = [...hqImages].filter(img => !itemImages.has(img));
if (unusedHQ.length > 0) {
  console.log(`\n🔍 HQ images not matching any item: ${unusedHQ.length}`);
  unusedHQ.slice(0, 10).forEach(img => console.log(`   - ${img}`));
  if (unusedHQ.length > 10) {
    console.log(`   ... and ${unusedHQ.length - 10} more`);
  }
}

// Save detailed report
const report = {
  stats: {
    totalItems: itemImages.size,
    hqImages: hqImages.size,
    oldImages: oldImages.size,
    haveHQ: haveHQ.length,
    haveOldOnly: haveOldOnly.length,
    noImage: noImage.length,
    unusedHQ: unusedHQ.length,
  },
  haveHQ,
  haveOldOnly,
  noImage,
  unusedHQ,
};

fs.writeFileSync(
  path.join(__dirname, '..', 'image-verification.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📄 Full report saved to image-verification.json');
