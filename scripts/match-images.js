#!/usr/bin/env node
/**
 * Match downloaded images with items database
 * Identify missing images and clean up non-item images
 */

const fs = require('fs');
const path = require('path');

// Load downloaded images
const hqDir = path.join(__dirname, '..', 'public', 'items-hq');
const downloadedImages = fs.readdirSync(hqDir).filter(f => f.endsWith('.png'));

// Create a map of normalized names to filenames
const imageMap = new Map();
downloadedImages.forEach(img => {
  const name = img.replace('.png', '').toLowerCase();
  imageMap.set(name, img);
});

// Patterns to EXCLUDE (definitely NOT items)
const excludePatterns = [
  // Codex/lore entries
  /codex/i,

  // Icons and UI elements
  /^icon/, /^mods-(?!component)/, /mastery/, /trialrank/,

  // Maps and locations
  /^maps?-/, /-map$/, /location/, /exact-location/,
  /underground/, /^dome-map/, /warehouse/,
  /^blue-gate(?!.*key)$/, /^buried-city(?!.*key)$/,
  /^spaceport(?!.*key)$/, /^dam(?!.*key)$/,
  /^stella-montis(?!.*key)$/, /^swamp$/,

  // Screenshots and misc
  /screenshot/, /^snímek/, /^snmek/, /^patch/, /pach-/,
  /^image$/, /placeholder/, /disambig/, /^flag/,
  /^11111/, /^22222/, /^a-first-foothold/, /^a-warm-place/,
  /^abandoned-highway/, /^possible-king/, /^pear-night/,
  /^pharmacy/, /^practice-range/, /^q-place/, /^straight-record/,
  /^echos/, /^breaking/, /^north$/, /^together$/,
  /needs-to-be-deleted/, /^arcraiders-/, /^arcraidersthemes/,

  // Cards/promotional
  /card/, /^raider-deck/, /^rd1-/, /logo/, /cover/,

  // Guides/tutorials
  /^communication-/, /^armored-transport/, /^back-on-top/, /^backontop/,

  // Loot containers (not items themselves)
  /container-drawer/, /industrial-drawer/, /^green-locker/,
  /^red-locker/, /^blue-cabinet/, /^blue-drawer/, /^blue-drawers/,
  /medical-drawer/, /mechanical-cabinet/, /electrical-cabinet/,
  /residential-/, /office-trash/, /outdoor-trash/, /server-rack/,
  /control-/, /^computer$/, /^fridge$/, /breaker-box/, /generator-fuse/,
  /power-distribution/, /solar-panel/, /dumpster/, /suitcase/,
  /metal-crate/, /painted-box/, /bus-/, /car-(?!key)/, /^truck$/,
  /^white-office-drawer/, /^wooden-drawer/, /^green-industrial/,
  /^wicker-basket/, /^vase$/, /^terminal$/, /^security-locker$/,

  // NPCs/enemies (not drops)
  /^arc-(?!alloy|circuitry|coolant|flex|motion|performance|powercell|synthetic|thermo)/,
  /husk(?!-graveyard)/, /^baron(?!-)/, /^settlers/, /^raiders(?!-)/,
  /^raider-camps/, /^raider-hatches/, /^raider-hatch$/,
  /^lance(?!-mixtape)/, /^major-aiva/, /^shani/, /^sunrise/,
  /^food-cultivation/, /^hydroponic/, /^launch-towers/, /^black-market/,
  /^apollo$/, /^trader-/, /traders-tab/,

  // Misc non-items
  /^extraction/, /supply-(?!station)/, /raider-cache/, /expedition/,
  /night-raid/, /time-reset/, /trials$/, /^weight$/,
  /prospecting/, /hidden-bunker/, /locked-gate/,
  /^icon-loot/, /^icon-cred/, /^icon-coins/, /^icon-weight/,
  /^item-pack/, /^outfit-/, /^fuel-canister$/, /^dirt-spray/,
  /^raider-token/, /^grenade-case$/, /^explosive-compound$/,
  /^field-crate/, /^field-depot$/, /^survival-items$/,
  /^electricity$/, /^zipline$/, /^unlock-/, /^tower-arc$/,
  /^truthnuke$/, /^wolfpack$/,
  /^blue-gate-snow$/, /^speranza$/,
];

// Patterns to INCLUDE (definitely items)
const includePatterns = [
  // Materials
  /^arc-alloy/, /^arc-circuitry/, /^arc-coolant/, /^arc-flex-rubber/,
  /^arc-motion-core/, /^arc-performance-steel/, /^arc-powercell/,
  /^arc-synthetic-resin/, /^arc-thermo-lining/,
  /^advanced-arc-powercell/, /^advanced-electrical/, /^advanced-mechanical/,
  /^metal-parts/, /^plastic-parts/, /^rubber-parts/, /^chemicals/, /^fabric/,
  /^electrical-components/, /^mechanical-components/, /^durable-cloth/,
  /^battery/, /^canister/, /^coolant/, /^processor/, /^sensors/, /^wires/,
  /^steel-spring/, /^oil/, /^mod-components/, /^power-rod/, /^magnet$/,
  /^synthesized-fuel/, /^speaker-component/, /^industrial-magnet/,

  // Weapons (Level 1 variants for images)
  /^anvil-(?:i|ii|iii|iv|splitter)/, /^arpeggio-/, /^bettina/,
  /^bobcat-/, /^burletta-/, /^equalizer/, /^ferro-/, /^hullcracker/,
  /^jupiter/, /^kettle-/, /^lynx-/, /^ocelot-/, /^puma-/, /^rattler-/,
  /^recluse-/, /^viper-/, /^aphelion/, /^showstopper/,
  /^hairpin-level/, /^il-toro-level/, /^osprey-level/, /^renegade-level/,
  /^stitcher-level/, /^tempest-level/, /^torrente-level/, /^venator-level/,
  /^vulcano-level/, /^trailblazer/,

  // Augments
  /^combat-mk/, /^looting-mk/, /^tactical-mk/, /^raider-augment/,
  /^free-loadout-augment/, /^ruined-augment/, /^ruined-tactical-vest/,

  // Shields
  /^light-shield/, /^medium-shield/, /^heavy-shield/,

  // Quick use / Grenades / Traps / Healing
  /^adrenaline-shot/, /^bandage/, /^herbal-bandage/, /^sterilized-bandage/,
  /^barricade-kit/, /^blaze-grenade/, /^deadline/, /^defibrillator/,
  /^door-blocker/, /^explosive-mine/, /^flame-spray/, /^gas-grenade/,
  /^gas-mine/, /^jolt-mine/, /^pulse-mine/, /^trigger-nade/,
  /^light-stick/, /^green-light-stick/, /^red-light-stick/, /^blue-light-stick/,
  /^yellow-light-stick/, /^lure-grenade/, /^noisemaker/, /^remote-raider/,
  /^seeker-grenade/, /^shrapnel-grenade/, /^smoke-grenade/, /^snap-blast/,
  /^tagging-grenade/, /^photoelectric-cloak/, /^shield-recharger/,
  /^surge-shield-recharger/, /^crude-explosives/, /^heavy-fuze/, /^light-impact/,
  /^lil-smoke/, /^vita-shot/, /^vita-spray/,

  // Consumables / Nature
  /^agave/, /^fruit-mix/, /^mushroom$/, /^prickly-pear/, /^great-mullein/,
  /^lemon/, /^apricot/, /^olives/, /^moss/, /^resin/, /^roots/,
  /^assorted-seeds/, /^fertilizer/, /^volcanic-rock/,

  // Recyclables
  /^air-freshener/, /^alarm-clock/, /^antiseptic/, /^bicycle-pump/,
  /^binoculars/, /^bloated-tuna/, /^camera-lens/, /^candle-holder/,
  /^cat-bed/, /^coffee-pot/, /^cooling-coil/, /^cooling-fan/,
  /^cracked-bioscanner/, /^crumpled-/, /^dart-board/, /^deflated-/,
  /^diving-goggles/, /^dog-collar/, /^duct-tape/, /^empty-wine/,
  /^expired-/, /^faded-photograph/, /^film-reel/, /^fine-wristwatch/,
  /^first-wave/, /^flow-controller/, /^frequency-/, /^fried-motherboard/,
  /^frying-pan/, /^garlic-press/, /^geiger-counter/, /^headphones/,
  /^heater/, /^household-cleaner/, /^humidifier/, /^ice-cream-scooper/,
  /^industrial-battery/, /^industrial-charger/, /^ion-sputter/,
  /^kinetic-converter/, /^laboratory-reagents/, /^lance-mixtape/,
  /^light-bulb/, /^lightbulb/, /^metal-brackets/, /^microscope/,
  /^mini-centrifuge/, /^mobile-generator/, /^motor/, /^music-album/,
  /^music-box/, /^number-plate/, /^oscilloscope/, /^playing-cards/,
  /^polluted-/, /^portable-tv/, /^poster-of/, /^pottery/, /^power-bank/,
  /^power-cable/, /^projector/, /^radio$/, /^radio-relay/, /^recorder/,
  /^recording-panel/, /^red-coral/, /^remote-control/, /^ripped-safety/,
  /^rocket-thruster/, /^rope/, /^rosary/, /^rotary-encoder/, /^rubber-duck/,
  /^rubber-pad/, /^sample-cleaner/, /^signal-amplifier/, /^silver-teaspoon/,
  /^snap-hook/, /^spectrometer/, /^spectrum-analyzer/, /^spring-cushion/,
  /^statuette/, /^breathtaking-snow/, /^syringe/, /^tape-recorder/,
  /^thermos/, /^toaster/, /^toilet-paper/, /^torch/, /^trowel/,
  /^vacuum-cleaner/, /^vintage-/, /^voltage-converter/, /^walkie-talkie/,
  /^wrench/, /^yoga-mat/, /^very-comfortable-pillow/, /^water-filter/,
  /^water-pump/, /^turbo-pump/, /^telemetry-transceiver/, /^trash-can$/,
  /^tattered-/, /^torn-/, /^tick-pod$/,

  // Broken/damaged items (recyclables)
  /^broken-/, /^burned-/, /^degraded-/, /^dried-out/, /^impure-/,
  /^rusted-/, /^rusty-/, /^damaged-/, /^unusable-/,

  // Keys
  /key$/, /key-location/,

  // Trinkets
  /^breathtaking/, /^red-coral/, /^silver-teaspoon/, /^fine-wristwatch/,
  /^film-reel/, /^first-wave/, /^rubber-duck/,

  // Ammo
  /^ammo-/, /^energy-clip/, /^launcher-ammo/, /ammo-box$/,

  // Weapon mods
  /^compensator/, /^silencer/, /^muzzle-brake/, /^angled-grip/,
  /^vertical-grip/, /^horizontal-grip/, /^bipod/, /^laser-sight/,
  /^extended-.*mag/, /^drum-mag/, /^quick-mag/, /^precision-stock/,
  /^stability-stock/, /^agility-stock/, /^marksman-stock/,
  /^lightweight-stock/, /^padded-stock/, /^stable-stock/,
  /^extended-barrel/, /^shotgun-choke/, /^shotgun-silencer/,
  /^magnetic-accelerator/, /^magnetron/,

  // Gun Parts
  /^complex-gun-parts/, /^heavy-gun-parts/, /^light-gun-parts/,
  /^medium-gun-parts/, /^simple-gun-parts/,

  // ARC drops
  /^bastion-cell/, /^bombardier-cell/, /^fireball-burner/, /^hornet-driver/,
  /^leaper-pulse/, /^matriarch-reactor/, /^pop-trigger/, /^queen-reactor/,
  /^rocketeer-driver/, /^sentinel-firing/, /^shredder-gyro/, /^snitch-scanner/,
  /^spotter-relay/, /^surveyor-vault/, /^tick-core/, /^turret-gyro/,
  /^wasp-stinger/, /^wasp-driver/,

  // Misc items
  /^backpack$/, /^provisions/, /^scrappy/, /^esr-analyzer/,
  /^exodus-modules/, /^medical-bag/, /^weapon-case/,
  /^mushroom-tree$/, // Nature item

  // Weapon Level 1 images
  /^anvil-level1/, /^arpeggio-level1/, /^bettina-level1/, /^bobcat-level1/,
  /^burletta-level1/, /^equalizer-level1/, /^ferro-level1/, /^jupiter-level1/,
  /^kettle-level1/, /^lynx-level1/, /^ocelot-level1/, /^puma-level1/,
  /^rattler-level1/, /^recluse-level1/, /^viper-level1/, /^hullcracker-level1/,

  // More recyclables
  /^ruined-accordion/, /^ruined-baton/, /^ruined-handcuffs/,
  /^ruined-parachute/, /^ruined-riot-shield/,

  // Supply station (item)
  /^supply-station$/,
];

// Check each downloaded image
const itemImages = [];
const nonItemImages = [];
const uncertainImages = [];

downloadedImages.forEach(img => {
  const name = img.replace('.png', '').toLowerCase();

  // Check exclusions first
  const isExcluded = excludePatterns.some(p => p.test(name));
  if (isExcluded) {
    nonItemImages.push(img);
    return;
  }

  // Check if it matches an item pattern
  const isItem = includePatterns.some(p => p.test(name));
  if (isItem) {
    itemImages.push(img);
    return;
  }

  // Uncertain - might be an item
  uncertainImages.push(img);
});

console.log('\n📊 Image Classification Results:\n');
console.log(`✅ Item images: ${itemImages.length}`);
console.log(`❌ Non-item images: ${nonItemImages.length}`);
console.log(`❓ Uncertain: ${uncertainImages.length}`);

// Show uncertain images for manual review
if (uncertainImages.length > 0) {
  console.log('\n❓ Uncertain images (need manual review):');
  uncertainImages.forEach(img => console.log(`   - ${img}`));
}

// Calculate space
const itemSize = itemImages.reduce((sum, img) => {
  try {
    const stats = fs.statSync(path.join(hqDir, img));
    return sum + stats.size;
  } catch { return sum; }
}, 0);

const nonItemSize = nonItemImages.reduce((sum, img) => {
  try {
    const stats = fs.statSync(path.join(hqDir, img));
    return sum + stats.size;
  } catch { return sum; }
}, 0);

console.log(`\n💾 Storage:`);
console.log(`   Item images: ${(itemSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Non-item images: ${(nonItemSize / 1024 / 1024).toFixed(2)} MB`);

// Save results
const results = {
  itemImages: itemImages.sort(),
  nonItemImages: nonItemImages.sort(),
  uncertainImages: uncertainImages.sort(),
  stats: {
    itemCount: itemImages.length,
    nonItemCount: nonItemImages.length,
    uncertainCount: uncertainImages.length,
    itemSizeMB: (itemSize / 1024 / 1024).toFixed(2),
    nonItemSizeMB: (nonItemSize / 1024 / 1024).toFixed(2),
  }
};

fs.writeFileSync(
  path.join(__dirname, '..', 'image-classification.json'),
  JSON.stringify(results, null, 2)
);

console.log('\n📄 Results saved to image-classification.json');

// Option to clean up non-item images
if (process.argv.includes('--clean')) {
  console.log('\n🧹 Cleaning up non-item images...');
  let deleted = 0;
  nonItemImages.forEach(img => {
    try {
      fs.unlinkSync(path.join(hqDir, img));
      deleted++;
    } catch (e) {
      console.log(`   Could not delete: ${img}`);
    }
  });
  console.log(`   Deleted ${deleted} non-item images`);
}
