#!/usr/bin/env node
/**
 * Download missing images from Arc Raiders wiki and create copies for variants
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const hqDir = path.join(__dirname, '..', 'public', 'items-hq');

// Wiki image URL patterns
// Format: https://arcraiders.wiki/w/images/thumb/[id]/[Filename]/348px-[Filename].webp
// Or full: https://arcraiders.wiki/w/images/[id]/[Filename]

// Items that need to be downloaded from wiki (with their wiki image names)
const wikiDownloads = {
  // Keys - using location-based key images from wiki
  'blue-gate-cellar-key': 'Blue_Gate_Key',
  'blue-gate-communication-tower-key': 'Blue_Gate_Key',
  'buried-city-residential-master-key': 'Buried_City_Key',
  'buried-city-town-hall-key': 'Buried_City_Key',
  'buried-city-hospital-key': 'Buried_City_Key',
  'buried-city-jkv-employee-access-card': 'Buried_City_Key',
  'dam-control-center-tower-key': 'Dam_Battlegrounds_Key',
  'dam-staff-room-key': 'Dam_Battlegrounds_Key',
  'dam-surveillance-key': 'Dam_Battlegrounds_Key',
  'dam-testing-annex-key': 'Dam_Battlegrounds_Key',
  'dam-utility-key': 'Dam_Battlegrounds_Key',

  // Trinkets and misc items
  'lances-mixtape-5th-edition': "Lance's_Mixtape_(5th_Edition)",
  'playing-cards': 'Playing_Cards',
  'painted-box': 'Painted_Box',
  'poster-of-natural-wonder': 'Poster_of_Natural_Wonders',
  'vase': 'Vase',
  'torch-ginger': 'Torch_Ginger',
  'zipline': 'Zipline',
  'trailblazer-grenade': 'Trailblazer',
  'wolfpack': 'Wolfpack',
  'explosive-compound': 'Crude_Explosives',
  'shotgun-parts': 'Simple_Gun_Parts',
  'tactical-mk3-defensive': 'Tactical_Mk._3_(Defensive)',
};

// Weapon variants that should copy from base image
const weaponVariantMappings = {
  // Hairpin variants
  'hairpin-i': 'hairpin-level1',
  'hairpin-ii': 'hairpin-level1',
  'hairpin-iii': 'hairpin-level1',
  'hairpin-iv': 'hairpin-level1',

  // Il Toro
  'il-toro-i': 'il-toro-level1',

  // Osprey variants
  'osprey-i': 'osprey-level1',
  'osprey-ii': 'osprey-level1',
  'osprey-iii': 'osprey-level1',
  'osprey-iv': 'osprey-level1',

  // Renegade variants
  'renegade-i': 'renegade-level1',
  'renegade-ii': 'renegade-level1',
  'renegade-iii': 'renegade-level1',
  'renegade-iv': 'renegade-level1',

  // Stitcher variants
  'stitcher-i': 'stitcher-level1',
  'stitcher-ii': 'stitcher-level1',
  'stitcher-iii': 'stitcher-level1',
  'stitcher-iv': 'stitcher-level1',

  // Tempest variants
  'tempest-i': 'tempest-level1',
  'tempest-ii': 'tempest-level1',
  'tempest-iii': 'tempest-level1',
  'tempest-iv': 'tempest-level1',

  // Torrente variants
  'torrente-i': 'torrente-level1',
  'torrente-ii': 'torrente-level1',
  'torrente-iii': 'torrente-level1',
  'torrente-iv': 'torrente-level1',

  // Venator variants
  'venator-i': 'venator-level1',
  'venator-ii': 'venator-level1',
  'venator-iii': 'venator-level1',
  'venator-iv': 'venator-level1',

  // Vulcano variants
  'vulcano-i': 'vulcano-level1',
  'vulcano-ii': 'vulcano-level1',
  'vulcano-iii': 'vulcano-level1',
  'vulcano-iv': 'vulcano-level1',

  // Bobcat
  'bobcat-i': 'bobcat-level1',

  // Burletta
  'burletta-iii': 'burletta-level1',
};

// Blueprints that should copy from the base item
const blueprintMappings = {
  'anvil-splitter-blueprint': 'anvil-splitter',
  'angled-grip-ii-blueprint': 'angled-grip-ii',
  'angled-grip-iii-blueprint': 'angled-grip-iii',
  'barricade-kit-blueprint': 'barricade-kit',
  'blaze-grenade-blueprint': 'blaze-grenade',
  'blue-light-stick-blueprint': 'blue-light-stick',
  'bobcat-blueprint': 'bobcat-level1',
  'burletta-blueprint': 'burletta-level1',
  'combat-mk-3-flanking-blueprint': 'combat-mk3-flanking',
  'compensator-ii-blueprint': 'compensator-ii',
  'compensator-iii-blueprint': 'compensator-iii',
  'complex-gun-parts-blueprint': 'complex-gun-parts',
  'defibrillator-blueprint': 'defibrillator',
  'door-blocker-blueprint': 'door-blocker',
  'energy-ammo-blueprint': 'energy-ammo',
  'equalizer-blueprint': 'equalizer',
  'explosive-mine-blueprint': 'explosive-mine',
  'extended-barrel-blueprint': 'extended-barrel',
  'extended-light-mag-ii-blueprint': 'extended-light-mag-ii',
  'extended-light-mag-iii-blueprint': 'extended-light-mag-iii',
  'extended-medium-mag-ii-blueprint': 'extended-medium-mag-ii',
  'extended-medium-mag-iii-blueprint': 'extended-medium-mag-iii',
  'extended-shotgun-mag-ii-blueprint': 'extended-shotgun-mag-ii',
  'extended-shotgun-mag-iii-blueprint': 'extended-shotgun-mag-iii',
  'gas-mine-blueprint': 'gas-mine',
  'green-light-stick-blueprint': 'green-light-stick',
  'jolt-mine-blueprint': 'jolt-mine',
  'jupiter-blueprint': 'jupiter',
  'kinetic-converter-blueprint': 'kinetic-converter',
  'medium-gun-parts-blueprint': 'medium-gun-parts',
  'muzzle-brake-ii-blueprint': 'muzzle-brake-ii',
  'muzzle-brake-iii-blueprint': 'muzzle-brake-iii',
  'deadline-blueprint': 'deadline',
  'osprey-blueprint': 'osprey-level1',
  'padded-stock-blueprint': 'padded-stock',
  'power-rod-blueprint': 'power-rod',
  'pulse-mine-blueprint': 'pulse-mine',
  'red-light-stick-blueprint': 'red-light-stick',
  'remote-raider-flare-blueprint': 'remote-raider-flare',
  'renegade-blueprint': 'renegade-level1',
  'seeker-grenade-blueprint': 'seeker-grenade',
  'showstopper-blueprint': 'showstopper',
  'sterilized-bandage-blueprint': 'sterilized-bandage',
  'tactical-mk3-defensive-blueprint': 'tactical-mk-3-defensive',
  'tactical-mk3-healing-blueprint': 'tactical-mk-3-healing',
  'tagging-grenade-blueprint': 'tagging-grenade',
  'tempest-i-blueprint': 'tempest-level1',
  'torrente-blueprint': 'torrente-level1',
  'trailblazer-grenade-blueprint': 'trailblazer',
  'trigger-nade-blueprint': 'trigger-nade',
  'venator-blueprint': 'venator-level1',
  'vertical-grip-ii-blueprint': 'vertical-grip-ii',
  'vertical-grip-iii-blueprint': 'vertical-grip-iii',
  'vita-shot-blueprint': 'vita-shot',
  'vita-spray-blueprint': 'vita-spray',
  'vulcano-blueprint': 'vulcano-level1',
  'wolfpack-blueprint': 'wolfpack',
  'yellow-light-stick-blueprint': 'yellow-light-stick',
};

// Cosmetics - these typically don't have icons or use placeholder
const cosmeticItems = [
  'aviator-outfit',
  'bag-radio-renegade-variant',
  'banana-backpack-charm',
  'black-and-white-origin-color',
  'black-eye-face-style',
  'black-hiker-colour',
  'blue-radio-renegade-color',
  'blue-yellow-aviator-color',
  'bow-and-arrow-emote',
  'briefcase-backpack-attachment',
  'burgerboy-backpack-charm',
  'cans-backpack-attachment',
  'cheer-emote',
  'crimson-racer-aviator-colour',
  'goggles-radio-renegade-variant',
  'junior-outfit',
  'mastery-medal-backpack-charm',
  'orange-camo-origin-outfit',
  'patrol-outfit',
  'radio-renegade-outfit',
  'succulent-backpack-charm',
];

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Copy file
function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

async function main() {
  console.log('\n🔄 Processing missing images...\n');

  let downloaded = 0;
  let copied = 0;
  let failed = [];

  // 1. Copy weapon variants from base images
  console.log('📋 Creating weapon variant copies...');
  for (const [variant, base] of Object.entries(weaponVariantMappings)) {
    const srcPath = path.join(hqDir, `${base}.png`);
    const destPath = path.join(hqDir, `${variant}.png`);

    if (fs.existsSync(destPath)) {
      console.log(`   ⏭️  ${variant}.png already exists`);
      continue;
    }

    if (copyFile(srcPath, destPath)) {
      console.log(`   ✅ ${variant}.png <- ${base}.png`);
      copied++;
    } else {
      console.log(`   ❌ ${variant}.png - source not found: ${base}.png`);
      failed.push({ name: variant, reason: `Source not found: ${base}.png` });
    }
  }

  // 2. Copy blueprint images from base items
  console.log('\n📋 Creating blueprint copies...');
  for (const [blueprint, base] of Object.entries(blueprintMappings)) {
    const srcPath = path.join(hqDir, `${base}.png`);
    const destPath = path.join(hqDir, `${blueprint}.png`);

    if (fs.existsSync(destPath)) {
      console.log(`   ⏭️  ${blueprint}.png already exists`);
      continue;
    }

    if (copyFile(srcPath, destPath)) {
      console.log(`   ✅ ${blueprint}.png <- ${base}.png`);
      copied++;
    } else {
      console.log(`   ❌ ${blueprint}.png - source not found: ${base}.png`);
      failed.push({ name: blueprint, reason: `Source not found: ${base}.png` });
    }
  }

  // 3. Download wiki images
  console.log('\n🌐 Downloading from wiki...');
  for (const [localName, wikiName] of Object.entries(wikiDownloads)) {
    const destPath = path.join(hqDir, `${localName}.png`);

    if (fs.existsSync(destPath)) {
      console.log(`   ⏭️  ${localName}.png already exists`);
      continue;
    }

    // Try different URL patterns
    const encodedName = encodeURIComponent(wikiName).replace(/%20/g, '_');
    const urls = [
      `https://arcraiders.wiki/wiki/Special:FilePath/${encodedName}.png`,
      `https://arcraiders.wiki/w/images/${wikiName}.png`,
    ];

    let success = false;
    for (const url of urls) {
      try {
        await downloadImage(url, destPath);
        console.log(`   ✅ ${localName}.png`);
        downloaded++;
        success = true;
        break;
      } catch (err) {
        // Try next URL
      }
    }

    if (!success) {
      console.log(`   ❌ ${localName}.png - could not download`);
      failed.push({ name: localName, reason: 'Download failed' });
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  // 4. Note cosmetic items (usually no icons)
  console.log('\n👕 Cosmetic items (may not have wiki images):');
  cosmeticItems.forEach(item => {
    const destPath = path.join(hqDir, `${item}.png`);
    if (!fs.existsSync(destPath)) {
      console.log(`   ⚠️  ${item}.png - needs manual handling`);
      failed.push({ name: item, reason: 'Cosmetic - no wiki image' });
    }
  });

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   ✅ Files copied: ${copied}`);
  console.log(`   ✅ Files downloaded: ${downloaded}`);
  console.log(`   ❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n❌ Failed items:');
    failed.forEach(f => console.log(`   - ${f.name}: ${f.reason}`));
  }

  // Save failed list
  fs.writeFileSync(
    path.join(__dirname, '..', 'failed-images.json'),
    JSON.stringify(failed, null, 2)
  );
}

main().catch(console.error);
