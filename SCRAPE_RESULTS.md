# ARC Raiders Wiki - Complete Image Scrape Results

## Summary

Successfully scraped **675 item images** from the ARC Raiders Wiki (https://arcraiders.wiki) on **2025-12-04**.

## Methodology

1. **API Access**: Used the MediaWiki API to fetch all images from the wiki
2. **Image Filtering**: Filtered out maps, screenshots, UI elements, and non-item images
3. **Categorization**: Organized items into logical categories based on filename patterns
4. **URL Extraction**: Retrieved full high-resolution image URLs (not thumbnails)

## Data Breakdown

| Category | Count | Description |
|----------|-------|-------------|
| **Loot** | 544 | Materials, resources, consumables, quest items |
| **Mods** | 55 | Weapon modifications (grips, barrels, magazines, etc.) |
| **Weapons** | 23 | All weapon types (assault rifles, pistols, snipers, etc.) |
| **Augments** | 21 | Loadout augments and tactical vests |
| **Grenades** | 20 | Explosive items and throwables |
| **Shields** | 5 | Light, Medium, Heavy shields |
| **Traps** | 4 | Placeable traps and mines |
| **Healing** | 3 | Bandages and healing items |
| **TOTAL** | **675** | |

## Files Generated

### 1. arc_raiders_all_items.json
**Complete JSON export with all items**

Structure:
```json
{
  "metadata": {
    "source": "ARC Raiders Wiki (https://arcraiders.wiki)",
    "total_items": 675,
    "scrape_date": "2025-12-04",
    "categories": { ... }
  },
  "items": [
    {
      "name": "Item Name",
      "imageUrl": "https://arcraiders.wiki/w/images/x/xx/Filename.png",
      "category": "category_name",
      "rarity": null,
      "wikiPage": "/wiki/File:Filename.png"
    },
    ...
  ]
}
```

### 2. arc_raiders_all_items.csv
**CSV export for easy viewing in Excel/spreadsheet applications**

Columns: `name`, `imageUrl`, `category`, `rarity`, `wikiPage`

## Sample Items by Category

### Weapons (23 items)
- Anvil, Aphelion, Arpeggio, Bettina, Bobcat, Burletta, Equalizer, Ferro, Hairpin, Hullcracker, Il Toro, Jupiter, Kettle, Osprey, Rattler, Renegade, Stitcher, Tempest, Torrente, Venator, Vulcano

### Augments (21 items)
- Combat Mk. 1, Combat Mk. 2, Combat Mk. 3 (Aggressive), Combat Mk. 3 (Flanking)
- Looting Mk. 1, Looting Mk. 2, Looting Mk. 3 (Cautious), Looting Mk. 3 (Survivor)
- Tactical Mk. 1, Tactical Mk. 2, Tactical Mk. 3 (Defensive), Tactical Mk. 3 (Healing)
- Free Loadout Augment, Raider Augments Level 1-4

### Shields (5 items)
- Light Shield, Medium Shield, Heavy Shield, Ruined Riot Shield

### Weapon Modifications (55 items)
- **Compensators**: I, II, III
- **Muzzle Brakes**: I, II, III
- **Grips**: Angled (I, II, III), Vertical (I, II, III), Horizontal
- **Magazines**: Extended Light/Medium/Shotgun (I, II, III)
- **Stocks**: Stable (I, II, III), Lightweight, Padded
- **Silencers**: I, II, III, Shotgun Silencer
- **Special**: Extended Barrel, Kinetic Converter, Anvil Splitter

### Loot Items (544 items)
Includes:
- **ARC Materials**: ARC Alloy, ARC Circuitry, ARC Coolant, ARC Flex Rubber, ARC Motion Core, ARC Performance Steel, ARC Powercell, ARC Synthetic Resin, ARC Thermo Lining
- **ARC Enemies**: ARC Bastion, Bombardier, Courier, Fireball, Hornet, Leaper, Matriarch, Probe, Rocketeer, Sentinel, Shredder, Snitch, Spotter, Surveyor, The Queen, Tick, Turret, Wasp
- **Crafting Materials**: Advanced Electrical Components, Advanced Mechanical Components, Electrical Components, Mechanical Components, Wires, Circuit Boards, Batteries
- **Consumables**: Agave, Agave Juice, Adrenaline Shot, Antibiotics, Bandages
- **Ammunition**: Energy, Heavy, Light, Medium, Shotgun, Launcher
- **Codex Items**: Various lore and information items
- **Trinkets**: Various decorative and collectible items
- **Quest Items**: Mission-specific items and objectives

### Grenades (20 items)
- Blaze Grenade, Crude Explosives, Explosive Mine, Frag Grenade, Gas Grenade, Jolt Grenade, Pulse Grenade, Shrapnel Grenade, Smoke Grenade, Stun Grenade

### Healing Items (3 items)
- Bandage, Herbal Bandage, Sterilized Bandage

### Traps (4 items)
- Explosive Mine, Gas Mine, Jolt Mine, Pulse Mine

## Image URL Format

All images are high-resolution originals (not thumbnails):
- **Format**: `https://arcraiders.wiki/w/images/[hash]/[hash2]/Filename.png`
- **Example**: `https://arcraiders.wiki/w/images/a/a6/ARC_Alloy.png`

## Notes

- Some items may have missing or incomplete data (e.g., rarity information)
- Item names are derived from filenames and may differ slightly from in-game names
- The "loot" category includes a wide variety of items that didn't fit other categories
- All images are directly accessible via their URLs
- Some UI elements and category icons are included but can be filtered out if needed

## Usage

The generated JSON and CSV files can be used for:
- Building a companion app or website
- Creating item databases
- Generating loot tables
- Item lookup and reference
- Data analysis and statistics

## Limitations

- Rarity data is not consistently available from image metadata alone
- Some items may be duplicates with different variants (e.g., Level 1, Level 2)
- Quest markers and UI elements are included in the loot category
- Dynamic/procedurally generated items may not be present

## Future Improvements

To get complete item data including rarity, stats, and descriptions, you would need to:
1. Scrape individual item wiki pages
2. Parse the Cargo database directly (if access is available)
3. Use the MediaWiki Parse API to extract structured data from pages
4. Implement JavaScript rendering to capture dynamically loaded content
