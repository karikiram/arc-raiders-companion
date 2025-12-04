# Items Database Page - UI/UX Design Specification

**Project**: Arc Raiders Companion
**Component**: Full-Page Items Database
**Status**: Design Specification
**Date**: 2025-12-04

---

## 1. Overview

The Items Database page is a comprehensive browsable catalog of all items in Arc Raiders. Users can search, filter by category and rarity, view item details, and compare items across the game. The design follows the existing Arc Raiders Companion dark aesthetic with Tailwind CSS 4, Next.js 16, and Lucide React icons.

---

## 2. Color Palette & Rarity System

### Base Colors (Dark Gaming Aesthetic)
```
Background:      bg-zinc-950 (main page background)
Surface:         bg-zinc-900 (cards, containers)
Surface Alt:     bg-zinc-800 (hover states, secondary elements)
Border:          border-zinc-800 (default), border-zinc-700 (hover)
Text Primary:    text-white (primary content)
Text Secondary:  text-zinc-400 (secondary content)
Text Tertiary:   text-zinc-500 (muted/disabled)
Accent:          amber-500 (interactive, highlights, focus)
```

### Rarity Color System
```
Common:          bg-zinc-600 text-zinc-200 (gray)
Uncommon:        bg-green-700 text-green-100 (green)
Rare:            bg-blue-700 text-blue-100 (blue)
Epic:            bg-purple-700 text-purple-100 (purple)
Legendary:       bg-amber-600 text-amber-100 (gold/amber)
```

### Rarity Background (for item image containers)
```
Common:          bg-zinc-700
Uncommon:        bg-green-900/50
Rare:            bg-blue-900/50
Epic:            bg-purple-900/50
Legendary:       bg-amber-900/50
```

---

## 3. Page Layout Architecture

### 3.1 Overall Page Structure
```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
│ • Page Title: "Items Database"                         │
│ • Stat Summary: "Total Items: [X]"                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ FILTER CONTROLS (Sticky)                               │
│ • Search Bar (full-width on mobile, flex-1 on desktop) │
│ • Category Filter Dropdown (multi-select)              │
│ • Rarity Filter Buttons (amber badges, tab-like)       │
│ • Results Counter                                       │
│ • Clear All Button (when filters active)               │
│ • Active Filters Display (chips/badges)                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ITEMS GRID                                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ Item │ │ Item │ │ Item │ │ Item │ │ Item │ │ Item │ │
│ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ Item │ │ Item │ │ Item │ │ Item │ │ Item │ │ Item │ │
│ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │ Card │ │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│                                                        │
│ [No items found message if empty]                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ITEM DETAIL MODAL (Overlay)                            │
│ • Triggered on item card click                         │
│ • Shows full item information                          │
│ • Close button (X icon, top-right)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Hero Section Specification

### 4.1 Component: PageHero
**Purpose**: Introduce the page and display aggregate data

**Structure**:
```tsx
// Tailwind Classes
Container: "w-full bg-gradient-to-b from-amber-500/5 to-transparent py-12 px-4 sm:px-6 lg:px-8"
Title: "text-4xl sm:text-5xl font-bold text-white mb-2"
Subtitle: "text-lg text-zinc-400 mb-6"
StatsContainer: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl"
StatCard: "bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3"
StatLabel: "text-xs text-zinc-500 uppercase tracking-wide"
StatValue: "text-2xl font-bold text-amber-400 mt-1"
```

**Content**:
- Title: "Items Database"
- Subtitle: "Browse all items in Arc Raiders"
- Stats displayed:
  - Total Items Count
  - Categories Available
  - Rarity Distribution
  - Last Updated (optional)

**Example HTML Structure**:
```tsx
<section className="w-full bg-gradient-to-b from-amber-500/5 to-transparent py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
      Items Database
    </h1>
    <p className="text-lg text-zinc-400 mb-8">
      Browse all items in Arc Raiders with detailed information and filtering
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3">
        <p className="text-xs text-zinc-500 uppercase tracking-wide">Total Items</p>
        <p className="text-2xl font-bold text-amber-400 mt-1">{totalItems}</p>
      </div>
      {/* More stat cards */}
    </div>
  </div>
</section>
```

---

## 5. Filter Controls Specification

### 5.1 Component: FilterSection (Sticky)
**Purpose**: Enable users to search and filter items effectively

**Tailwind Classes**:
```
Container: "sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 py-4 px-4 sm:px-6 lg:px-8"
InnerContainer: "max-w-7xl mx-auto space-y-3"
SearchRow: "flex flex-col sm:flex-row gap-3"
SearchWrapper: "relative flex-1"
SearchInput: "w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
SearchIcon: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
ClearSearchBtn: "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer transition-colors"
```

### 5.2 Filter Controls Row

**Search Bar** (see FilterBar component in codebase)
- **Icon**: Search icon (left), X clear button (right on focus/input)
- **Placeholder**: "Search items by name, category..."
- **Mobile**: Full-width (flex-1)
- **Desktop**: Full-width in row
- **Behavior**:
  - Real-time filtering as user types
  - Clear button appears when text entered
  - Focus state: amber glow effect

**Category Filter Dropdown** (use existing MultiSelectDropdown)
- **Label**: "Category"
- **Type**: Multi-select dropdown
- **Options**: All 18 categories from types/index.ts
  - weapon, modification, quick_use, throwable, blueprint
  - basic_material, topside_material, refined_material, advanced_material
  - recyclable, trinket, key, ammunition, augment
  - gadget, nature, consumable, cosmetic
- **Selected State Badge**: Shows count (e.g., "Category 3")
- **Active Color**: amber-500/10 text, amber-500/30 border
- **Inactive Color**: text-zinc-400, border-zinc-700
- **Dropdown Max Height**: max-h-64 overflow-y-auto

**Rarity Filter Buttons** (Tab-style)
- **Type**: Multi-select button group
- **Options**: 5 buttons for each rarity (common, uncommon, rare, epic, legendary)
- **Button Structure**:
  ```
  Inactive: bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700
  Active:   [rarity-specific color] font-semibold
  ```
- **Colors**:
  - Common: bg-zinc-600 text-zinc-200
  - Uncommon: bg-green-700 text-green-100
  - Rare: bg-blue-700 text-blue-100
  - Epic: bg-purple-700 text-purple-100
  - Legendary: bg-amber-600 text-amber-100
- **Layout**:
  - Flex row, wrappable on mobile
  - Gap: 0.5rem between buttons

**Active Filters Display**
- **Position**: Below main filter row when filters active
- **Structure**: Flex row, wrappable, gap-2
- **Each Chip**:
  ```
  Display: inline-flex items-center gap-1
  Classes: px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300
  Rarity chips: Use rarity-specific colors instead
  Remove button: X icon, hover:text-white
  ```

**Results Counter**
- **Position**: Right side of filter row (or above on mobile)
- **Format**: "{count} item{s} found" or "Showing X of Y items"
- **Class**: "text-sm text-zinc-500"
- **Update**: Real-time as filters change

**Clear All Button**
- **Visibility**: Only show when filters active
- **Classes**: "px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
- **Icon**: X (lucide-react)
- **Action**: Reset all filters to default state

---

## 6. Item Grid Specification

### 6.1 Grid Layout & Responsiveness
```
Mobile (sm < 640px):      2 columns
Tablet (md 768px):        4 columns
Desktop (lg 1024px):      6 columns
Large Desktop (xl 1280px): 8 columns
```

**Grid Container Classes**:
```
"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4
 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

**Gap Between Cards**:
- Mobile: gap-2 (0.5rem)
- Desktop: gap-4 (1rem)

### 6.2 Item Card Component: ItemCard

**Overall Card Structure**:
```
┌─────────────────────────────────┐
│                   ★ (favorite)  │  ← Favorite button (abs top-right)
│  ┌─────────────────────────────┐│
│  │                             ││  ← Item image container
│  │      [Item Image]           ││     (centered, responsive sizing)
│  │    (pixelated rendering)    ││
│  └─────────────────────────────┘│
│                                 │
│  Item Name (truncated)          │
│  Rarity Badge  │  Weight Badge   │  ← Detail row
│                                 │
│  🔍 View Details  →             │  ← Hover/click state
└─────────────────────────────────┘
   (Hover glow effect)
```

**Card Container**:
```
Classes: "relative group rounded-xl bg-zinc-900 border border-zinc-800
          hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20
          transition-all duration-200 cursor-pointer overflow-hidden
          p-3 sm:p-4"

Hover Effect: Border glows amber, shadow appears
Active (Selected): bg-amber-500/10 border-amber-500/30
```

**Image Container**:
```
Classes: "w-full aspect-square rounded-lg bg-gradient-to-br [rarity-color]
          flex items-center justify-center overflow-hidden mb-3
          relative"

Sizes:
- Mobile: ~80px (full card width minus padding)
- Tablet: ~120px
- Desktop: ~140px

Image CSS: "max-w-[80%] max-h-[80%] object-contain"
           "image-rendering: pixelated" (for game aesthetics)

Fallback Icon: Package icon (lucide-react) if no image
             "w-8 h-8 text-zinc-500"
```

**Item Name**:
```
Classes: "text-sm sm:text-base font-semibold text-white truncate mb-2
          leading-tight"
Behavior: Single line, ellipsis on overflow
```

**Rarity Badge**:
```
Classes: "inline-block px-2 py-1 rounded text-xs font-bold uppercase
          tracking-wide [rarity-color]"

Text: First letter or full rarity name
  - Common: C or "COM"
  - Uncommon: U or "UNC"
  - Rare: R or "RR"
  - Epic: E or "EPC"
  - Legendary: L or "LGD"
```

**Category Label** (subtle):
```
Classes: "text-xs text-zinc-500"
Position: Below rarity badge
Text: Category display name (e.g., "Weapons", "Materials")
```

**Favorite Button**:
```
Position: Absolute top-right corner
Classes: "absolute top-2 right-2 p-2 rounded-lg transition-all z-10
          opacity-0 group-hover:opacity-100"
Inactive: "bg-zinc-800/80 text-zinc-500"
Active:   "bg-amber-500/20 text-amber-400"
Icon: Star (lucide-react)
  - Inactive: outline
  - Active: filled
Size: w-5 h-5
```

**Hover State Enhancements**:
```
1. Border color shifts: border-zinc-800 → border-amber-500/50
2. Shadow appears: shadow-lg shadow-amber-500/20
3. Background subtle shift: bg-zinc-900 → bg-zinc-800/50
4. Favorite button visible
5. "View Details" overlay appears (optional)
```

**Click Behavior**:
- Opens item detail modal
- Tracks recent items (for potential history feature)

---

## 7. Item Detail Modal Specification

### 7.1 Modal Structure

**Overlay**:
```
Classes: "fixed inset-0 bg-black/60 backdrop-blur-sm z-50
          flex items-center justify-center p-4
          animate-fadeIn"
Click behavior: Close on overlay click
```

**Modal Container**:
```
Classes: "relative bg-zinc-900 border border-zinc-800 rounded-2xl
          max-w-2xl w-full max-h-[90vh] overflow-y-auto
          shadow-2xl shadow-black/50"
Content padding: "px-6 sm:px-8 py-6 sm:py-8"
```

### 7.2 Modal Content Structure

```
┌──────────────────────────────────────────────┐
│ ✕ Close Button (top-right)                   │
│                                              │
│ ┌────────────────────────────────────────┐   │
│ │                                        │   │
│ │     [Large Item Image]                 │   │  ← Image container
│ │     (centered, larger than grid)       │   │
│ │                                        │   │
│ └────────────────────────────────────────┘   │
│                                              │
│ Item Name (Large, Bold)                      │
│ Rarity Badge  │  Category Label              │
│                                              │
│ Description Text                             │
│ (Multiple lines, wrapped)                    │
│                                              │
│ ─────────────────────────────────────────    │ ← Divider
│                                              │
│ DETAILS SECTION                              │
│ Weight: ____ | Base Value: ____ | Stack: ___ │
│ Type: ____ | Stackable: Yes/No               │
│                                              │
│ ─────────────────────────────────────────    │
│                                              │
│ RECYCLE MATERIALS (if applicable)            │
│ ┌─────┐ ┌─────┐ ┌─────┐                     │
│ │Item1│ │Item2│ │Item3│                     │
│ └─────┘ └─────┘ └─────┘                     │
│                                              │
│ [Close Button]                               │
└──────────────────────────────────────────┘
```

### 7.3 Modal Components Breakdown

**Close Button** (X icon):
```
Position: Absolute top-right
Classes: "absolute top-4 right-4 p-2 rounded-lg
          text-zinc-400 hover:text-white hover:bg-zinc-800
          transition-colors cursor-pointer z-10"
Icon: X (lucide-react) w-5 h-5
```

**Image Section**:
```
Container Classes: "w-full max-w-md mx-auto mb-6 p-4 rounded-lg
                    bg-gradient-to-br [rarity-bg-color]
                    flex items-center justify-center"

Image: "max-w-full max-h-96 object-contain"
       "image-rendering: pixelated"

Fallback: Package icon (large)
```

**Item Name**:
```
Classes: "text-3xl sm:text-4xl font-bold text-white mb-2"
Single line, if too long wrap naturally
```

**Rarity & Category Row**:
```
Container: "flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800"

Rarity Badge: (same styling as grid cards, larger)
  "inline-block px-3 py-1.5 rounded-lg text-sm font-bold uppercase [rarity-color]"

Category Label:
  "inline-block px-3 py-1.5 rounded-lg text-sm font-medium
   bg-zinc-800 text-zinc-300"
```

**Description**:
```
Classes: "text-base text-zinc-300 mb-4 leading-relaxed"
Content: Full item description from database
Behavior: Wrap naturally, preserve line breaks
```

**Details Section**:
```
Container: "mb-6 pb-6 border-b border-zinc-800"

Grid Layout:
"grid grid-cols-2 sm:grid-cols-3 gap-4"

Each Detail Item:
  Label: "block text-xs text-zinc-500 uppercase tracking-wide mb-1"
  Value: "text-sm sm:text-base font-semibold text-white"

Details to display:
  - Weight: "{weight} kg" (if available)
  - Base Value: "{value} credits"
  - Max Stack: "{quantity}" (if stackable)
  - Stackable: "Yes" / "No"
  - Rarity: (redundant, skip)
```

**Recycle Materials Section** (if item has recycle value):
```
Visibility: Only show if item.recycleValue exists and has materials

Container: "mb-6"

Title: "h3 class='text-lg font-semibold text-white mb-3 flex items-center gap-2'"
Icon: Recycle icon (lucide-react) w-5 h-5

Materials Grid:
"grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"

Each Material Item:
  ┌──────────┐
  │[img] ×n  │
  │Name      │
  └──────────┘

  Classes: "flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
  Image: Small thumbnail (32x32px)
  Name: "text-xs text-zinc-300 text-center"
  Quantity: "text-sm font-bold text-white"
```

**Action Buttons** (if needed):
```
Position: Bottom of modal
Layout: "flex gap-3 mt-6 pt-6 border-t border-zinc-800"

Buttons:
- Close: "flex-1 px-4 py-3 rounded-lg bg-zinc-800 text-white
          hover:bg-zinc-700 transition-colors"
- (Optional) Copy to Clipboard / Share: Similar styling with accent color
```

### 7.4 Modal Animations

```css
/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
```

---

## 8. Empty States & Loading

### 8.1 No Items Found State
```
Container: "col-span-full flex flex-col items-center justify-center py-12 px-4"

Content:
┌─────────────────────────────┐
│  📭 Empty Box Icon          │
│                             │
│  "No items found"           │  ← Title
│  (text-lg font-semibold)    │
│                             │
│  "Try adjusting your        │  ← Subtitle
│   filters or search query"  │
│  (text-zinc-400)            │
│                             │
│  [Clear Filters Button]     │
└─────────────────────────────┘

Classes: "text-center"
Icon: "w-16 h-16 text-zinc-600 mb-4"
Title: "text-lg sm:text-xl font-semibold text-white mb-2"
Subtitle: "text-base text-zinc-400 mb-6"
Button: Standard button, variant="secondary"
```

### 8.2 Loading State
```
Container: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"

Skeleton Cards: 12-18 placeholder cards with:
  - Pulsing background: "animate-pulse bg-zinc-800"
  - Same aspect ratio as real cards
  - Shimmer effect (optional enhancement)

Classes per skeleton:
"rounded-xl bg-zinc-800 animate-pulse"
"aspect-square rounded-lg mb-3"
"h-4 bg-zinc-700 rounded mb-2 w-3/4"
"h-3 bg-zinc-700 rounded w-1/2"
```

---

## 9. Responsive Breakpoint Strategy

### 9.1 Mobile-First Approach

**Extra Small (< 640px - sm)**:
- 2-column grid
- Full-width search bar
- Stacked filter buttons
- Larger touch targets (min 44px)
- Simplified modal (full-height, top-aligned)
- Font sizes: text-base or smaller

**Small (640px - md)**:
- 2-column grid
- Filters start arranging horizontally
- Dropdowns appear

**Medium (768px - lg)**:
- 4-column grid
- Horizontal filter row
- Sidebar awareness (if applicable)
- Larger modal with better spacing

**Large (1024px - xl)**:
- 6-column grid
- Full filter bar
- Desktop-optimized modal

**Extra Large (1280px - 2xl)**:
- 8-column grid (or 6-column with wider container)
- Maximum optimization

### 9.2 Tailwind Breakpoint Classes

```
Prefix  | Min width | CSS
────────┼───────────┼──────────
(none)  | 0px       | (default)
sm:     | 640px     | @media (min-width: 640px)
md:     | 768px     | @media (min-width: 768px)
lg:     | 1024px    | @media (min-width: 1024px)
xl:     | 1280px    | @media (min-width: 1280px)
2xl:    | 1536px    | @media (min-width: 1536px)
```

---

## 10. Micro-interactions & Animations

### 10.1 Transitions

**Standard Transition Duration**: `transition-all duration-200`

**Fade**: `opacity-0 to opacity-100` (200ms)

**Scale**: `scale-95 to scale-100` (200ms, for modals)

**Slide**: Used minimally, prefer fade

### 10.2 Hover States

**Item Card Hover**:
- Border color shift: `border-zinc-800` → `border-amber-500/50`
- Shadow add: `shadow-lg shadow-amber-500/20`
- Background shift: subtle darkening
- Duration: 200ms

**Button Hover**:
- Background color shift with 150ms duration
- Text color adjustment
- Smooth color transitions

**Icon Hover** (Favorite, Close):
- Color change: 150ms
- Scale optional (1.1x on hover)

### 10.3 Active States

**Selected Filter Button**:
- Colored background (rarity color)
- Text white
- Bold font weight
- Immediate change (no delay)

**Active Category/Rarity Badge**:
- Amber highlight
- Checkmark visible in dropdown
- Transition-smooth color change

### 10.4 Loading Animations

**Skeleton Pulse**:
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

**Search Icon Spinner** (when loading):
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## 11. Component File Structure

### 11.1 Recommended File Organization

```
src/
├── components/
│   ├── items-database/
│   │   ├── ItemsDatabase.tsx          (Main page container)
│   │   ├── PageHero.tsx               (Hero section with stats)
│   │   ├── ItemsGrid.tsx              (Grid container & layout)
│   │   ├── ItemCard.tsx               (Individual item card)
│   │   ├── ItemDetailModal.tsx        (Detail modal)
│   │   ├── FilterSection.tsx          (Sticky filter controls)
│   │   └── EmptyState.tsx             (No items found state)
│   └── ui/
│       ├── FilterBar.tsx              (Existing - use as-is)
│       ├── Card.tsx                   (Existing - use for details)
│       ├── Badge.tsx                  (Existing - use for rarity)
│       └── Button.tsx                 (Existing - use for actions)
├── app/
│   └── items/
│       └── page.tsx                   (Route handler)
└── data/
    └── items.ts                       (Item data source - existing ITEMS)
```

### 11.2 Component Dependencies

```
ItemsDatabase (Page)
├── PageHero
│   └── (uses stats props)
├── FilterSection
│   ├── Search input (custom or UI)
│   ├── MultiSelectDropdown (from FilterBar)
│   └── Rarity button group
├── ItemsGrid
│   └── ItemCard (×many)
│       ├── Image
│       ├── Name
│       ├── Badge (rarity)
│       └── Favorite button
└── ItemDetailModal
    ├── Close button
    ├── Image section
    ├── Details grid
    └── Recycle materials section
```

---

## 12. Tailwind CSS Class Reference

### 12.1 Complete Class Specification by Component

**Page Container**:
```
"w-full min-h-screen bg-zinc-950"
```

**Section Container** (repeated pattern):
```
"w-full px-4 sm:px-6 lg:px-8"
"max-w-7xl mx-auto"
```

**Grid Responsive**:
```
"grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4"
```

**Text Hierarchy**:
```
Page Title:     "text-4xl sm:text-5xl font-bold text-white"
Section Title:  "text-2xl sm:text-3xl font-bold text-white"
Card Title:     "text-lg font-semibold text-white"
Body Text:      "text-base text-zinc-300"
Muted Text:     "text-sm text-zinc-500"
Label Text:     "text-xs text-zinc-500 uppercase tracking-wide"
```

**Input Fields**:
```
Base: "w-full px-4 py-2.5 rounded-lg"
Background: "bg-zinc-800"
Border: "border border-zinc-700"
Text: "text-white"
Placeholder: "placeholder-zinc-500"
Focus: "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
```

**Buttons**:
```
Primary:   "bg-amber-500 text-black hover:bg-amber-400"
Secondary: "bg-zinc-800 text-white hover:bg-zinc-700"
Ghost:     "text-zinc-400 hover:text-white hover:bg-zinc-800"
Rarity:    "[specific rarity color] font-semibold"
```

**Cards**:
```
Base: "rounded-xl bg-zinc-900 border border-zinc-800"
Hover: "hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20"
Active: "bg-amber-500/10 border-amber-500/30"
```

---

## 13. Accessibility Considerations

### 13.1 Color Contrast

- **WCAG AA Compliance**: All text meets 4.5:1 contrast ratio
- **Text on Rarity Badges**: Light text on colored backgrounds
- **Focus States**: Visible ring-2 outline, not just color change

### 13.2 Keyboard Navigation

- **Tab Order**: Logical flow (search → filters → grid items)
- **Enter Key**: Activates buttons and filters
- **Escape Key**: Closes modal
- **Arrow Keys**: Optional for grid navigation

### 13.3 Screen Reader Support

- **Alt Text**: Item images have descriptive alt text
  ```
  `${item.name} - ${item.rarity || 'Unknown'} rarity`
  ```
- **ARIA Labels**:
  - Modal: `role="dialog" aria-labelledby="modal-title" aria-modal="true"`
  - Buttons: `aria-label` for icon-only buttons
  - Filter buttons: `aria-pressed="true/false"`
- **Semantic HTML**: Use `<button>`, `<input>`, `<select>` correctly

### 13.4 Visual Indicators

- **Focus Visible**: Amber ring on all interactive elements
- **Disabled State**: opacity-50 and pointer-events-none
- **Loading State**: Skeleton screens instead of blank space

---

## 14. Performance Considerations

### 14.1 Image Optimization

- **Format**: WebP with PNG fallback
- **Lazy Loading**: Intersection Observer for images below fold
- **Size**: 64x64px for grid (mobile), 128x128px (desktop)
- **Pixelated Rendering**: `image-rendering: pixelated`

### 14.2 Filtering Performance

- **Debouncing**: Search input debounced 300ms
- **Memoization**: useMemo for filtered results
- **Virtual Scrolling** (optional): If 1000+ items
- **Pagination** (optional): 50-100 items per page

### 14.3 Bundle Size

- **Icons**: Use tree-shaking with lucide-react
- **CSS**: Tailwind purges unused classes
- **Components**: Code-split ItemDetailModal if needed

---

## 15. Implementation Checklist

### Phase 1: Foundation
- [ ] Create ItemsDatabase page layout
- [ ] Implement PageHero with statistics
- [ ] Set up responsive grid structure
- [ ] Create ItemCard component

### Phase 2: Filtering
- [ ] Implement FilterSection component
- [ ] Add search functionality with debouncing
- [ ] Implement category multi-select dropdown
- [ ] Add rarity filter buttons
- [ ] Create active filters display

### Phase 3: Details
- [ ] Create ItemDetailModal component
- [ ] Implement modal animations and transitions
- [ ] Add recycle materials section
- [ ] Test responsive modal behavior

### Phase 4: Polish
- [ ] Add loading skeletons
- [ ] Implement empty states
- [ ] Add keyboard navigation
- [ ] Optimize performance
- [ ] Test accessibility
- [ ] Cross-browser testing

### Phase 5: Enhancement (Optional)
- [ ] Add favorites persistence (localStorage)
- [ ] Implement search history
- [ ] Add view toggle (grid/list)
- [ ] Add sort options (name, rarity, value)
- [ ] Analytics tracking

---

## 16. Code Example: ItemCard Component

```tsx
'use client';

import { useState } from 'react';
import { Star, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item, Rarity } from '@/types';

interface ItemCardProps {
  item: Item;
  isFavorite?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
  onSelectItem?: (item: Item) => void;
}

const RARITY_COLORS: Record<Rarity | null, { bg: string; text: string; badge: string }> = {
  common: { bg: 'bg-zinc-700', text: 'text-zinc-400', badge: 'bg-zinc-600 text-zinc-200' },
  uncommon: { bg: 'bg-green-900/50', text: 'text-green-400', badge: 'bg-green-700 text-green-100' },
  rare: { bg: 'bg-blue-900/50', text: 'text-blue-400', badge: 'bg-blue-700 text-blue-100' },
  epic: { bg: 'bg-purple-900/50', text: 'text-purple-400', badge: 'bg-purple-700 text-purple-100' },
  legendary: { bg: 'bg-amber-900/50', text: 'text-amber-400', badge: 'bg-amber-600 text-amber-100' },
  null: { bg: 'bg-zinc-700', text: 'text-zinc-400', badge: 'bg-zinc-600 text-zinc-200' },
};

const CATEGORY_LABELS: Record<string, string> = {
  weapon: 'Weapons',
  modification: 'Modifications',
  quick_use: 'Quick Use',
  throwable: 'Throwables',
  blueprint: 'Blueprints',
  basic_material: 'Basic Materials',
  topside_material: 'Topside Materials',
  refined_material: 'Refined Materials',
  advanced_material: 'Advanced Materials',
  recyclable: 'Recyclables',
  trinket: 'Trinkets',
  key: 'Keys',
  ammunition: 'Ammunition',
  augment: 'Augments',
  gadget: 'Gadgets',
  nature: 'Nature',
  consumable: 'Consumables',
  cosmetic: 'Cosmetics',
  quest_item: 'Quest Items',
};

export function ItemCard({
  item,
  isFavorite = false,
  onFavoriteChange,
  onSelectItem,
}: ItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rarityColor = RARITY_COLORS[item.rarity];

  const rarityLabel = item.rarity
    ? item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)
    : 'Unknown';

  return (
    <div
      className={cn(
        'relative group rounded-xl bg-zinc-900 border transition-all duration-200',
        'hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer',
        isHovered ? 'border-amber-500/50' : 'border-zinc-800 hover:border-amber-500/50',
        'p-3 sm:p-4 overflow-hidden'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectItem?.(item)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteChange?.(!isFavorite);
        }}
        className={cn(
          'absolute top-2 right-2 p-2 rounded-lg transition-all z-10',
          isFavorite
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-zinc-800/80 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-amber-400'
        )}
        aria-label={isFavorite ? 'Remove favorite' : 'Add to favorites'}
      >
        <Star
          className={cn('w-5 h-5', isFavorite && 'fill-current')}
        />
      </button>

      {/* Image Container */}
      <div
        className={cn(
          'w-full aspect-square rounded-lg flex items-center justify-center',
          'overflow-hidden mb-3 relative',
          rarityColor.bg
        )}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-2"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <Package className="w-8 h-8 text-zinc-500" />
        )}
      </div>

      {/* Item Name */}
      <p className="text-sm sm:text-base font-semibold text-white truncate mb-2">
        {item.name}
      </p>

      {/* Rarity Badge & Category */}
      <div className="flex items-center gap-2">
        <span className={cn('inline-block px-2 py-1 rounded text-xs font-bold uppercase', rarityColor.badge)}>
          {rarityLabel.charAt(0)}
        </span>
        <span className="text-xs text-zinc-500 truncate">
          {CATEGORY_LABELS[item.category] || item.category}
        </span>
      </div>
    </div>
  );
}
```

---

## 17. Code Example: FilterSection Component

```tsx
'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FilterBar } from '@/components/ui/FilterBar';
import { cn } from '@/lib/utils';
import type { ItemCategory, Rarity } from '@/types';

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: ItemCategory[];
  onCategoriesChange: (categories: ItemCategory[]) => void;
  selectedRarities: Rarity[];
  onRaritiesChange: (rarities: Rarity[]) => void;
  resultCount: number;
  onClearAllFilters: () => void;
  availableCategories: ItemCategory[];
}

export function FilterSection({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoriesChange,
  selectedRarities,
  onRaritiesChange,
  resultCount,
  onClearAllFilters,
  availableCategories,
}: FilterSectionProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedRarities.length > 0;

  return (
    <section className={cn(
      'sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md',
      'border-b border-zinc-800 py-4 px-4 sm:px-6 lg:px-8'
    )}>
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main Filter Row */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          categories={availableCategories}
          selectedCategories={selectedCategories}
          onCategoryChange={onCategoriesChange}
          showRarityFilter={true}
          selectedRarities={selectedRarities}
          onRarityChange={onRaritiesChange}
        />

        {/* Results Counter */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-zinc-500">
            {resultCount} item{resultCount !== 1 ? 's' : ''} found
          </div>
          {hasActiveFilters && (
            <button
              onClick={onClearAllFilters}
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
```

---

## 18. Code Example: ItemDetailModal Component

```tsx
'use client';

import { X, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Item, Rarity } from '@/types';

interface ItemDetailModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
}

const RARITY_COLORS: Record<Rarity | null, string> = {
  common: 'bg-zinc-600 text-zinc-200',
  uncommon: 'bg-green-700 text-green-100',
  rare: 'bg-blue-700 text-blue-100',
  epic: 'bg-purple-700 text-purple-100',
  legendary: 'bg-amber-600 text-amber-100',
  null: 'bg-zinc-600 text-zinc-200',
};

export function ItemDetailModal({
  item,
  isOpen,
  onClose,
}: ItemDetailModalProps) {
  if (!isOpen || !item) return null;

  const rarityColor = RARITY_COLORS[item.rarity];
  const rarityLabel = item.rarity
    ? item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)
    : 'Unknown';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={cn(
        'relative bg-zinc-900 border border-zinc-800 rounded-2xl',
        'max-w-2xl w-full max-h-[90vh] overflow-y-auto',
        'shadow-2xl shadow-black/50 animate-fadeIn'
      )}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 sm:px-8 py-6 sm:py-8">
          {/* Image Section */}
          <div className="w-full max-w-md mx-auto mb-6 p-4 rounded-lg bg-gradient-to-br bg-zinc-800 flex items-center justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="max-w-full max-h-96 object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="w-32 h-32 bg-zinc-700 rounded flex items-center justify-center">
                <span className="text-zinc-500">No image</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {item.name}
          </h1>

          {/* Rarity & Category */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
            <span className={cn('inline-block px-3 py-1.5 rounded-lg text-sm font-bold uppercase', rarityColor)}>
              {rarityLabel}
            </span>
            <span className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-300">
              {item.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-zinc-300 mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Details Section */}
          <div className="mb-6 pb-6 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {item.weight !== null && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Weight</p>
                  <p className="text-sm sm:text-base font-semibold text-white">
                    {item.weight} kg
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Base Value</p>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {item.baseValue} cr
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Max Stack</p>
                <p className="text-sm sm:text-base font-semibold text-white">
                  {item.stackable ? item.maxStack : '1'}
                </p>
              </div>
            </div>
          </div>

          {/* Recycle Materials */}
          {item.recycleValue && item.recycleValue.materials.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Recycle className="w-5 h-5" />
                Recycle Materials
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {item.recycleValue.materials.map(material => (
                  <div
                    key={material.itemId}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                  >
                    <span className="text-xs text-zinc-300 text-center">×{material.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 pt-6 border-t border-zinc-800 w-full px-4 py-3 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 19. Future Enhancements

### 19.1 Phase 2+ Features
- **Sorting**: By name, rarity, value, weight
- **View Modes**: Grid (current), List, Compact
- **Item Comparison**: Side-by-side comparison tool
- **Export**: Share item lists, export as JSON/CSV
- **Advanced Filters**: By weight, value range, stackable status
- **Search History**: Recently viewed items
- **Item Collections**: User-created item lists
- **Collaborative Lists**: Share with other players

### 19.2 Analytics
- **Tracking**: Most viewed items, search trends
- **Suggestions**: "Players also viewed..."
- **Popular Searches**: Trending item names

---

## 20. Testing Checklist

### 20.1 Functional Testing
- [ ] Search works in real-time
- [ ] Category filter multi-select works
- [ ] Rarity filter multi-select works
- [ ] Results update correctly with each filter change
- [ ] Clear all filters resets everything
- [ ] Modal opens and closes properly
- [ ] Modal displays all item details correctly
- [ ] Recycle materials display (if applicable)

### 20.2 Responsive Testing
- [ ] Mobile (375px): 2-column grid
- [ ] Tablet (768px): 4-column grid
- [ ] Desktop (1024px): 6-column grid
- [ ] Large desktop (1280px): 8-column grid
- [ ] Touch targets min 44px
- [ ] No horizontal scroll
- [ ] Modal responsive on all sizes

### 20.3 Visual Testing
- [ ] Rarity colors accurate and consistent
- [ ] Hover states visible and smooth
- [ ] Focus states visible (amber ring)
- [ ] Animations smooth (no jank)
- [ ] Images pixelated rendering correct
- [ ] Text contrast WCAG AA compliant

### 20.4 Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Screen reader announces content
- [ ] Alt text on images
- [ ] Focus visible on all interactive elements
- [ ] Modal trapsfocus
- [ ] Escape closes modal

### 20.5 Performance Testing
- [ ] Page loads < 3 seconds
- [ ] Smooth scrolling (60fps)
- [ ] Filtering doesn't cause lag
- [ ] Images lazy-load correctly
- [ ] No memory leaks
- [ ] Lighthouse score > 90

---

## 21. Design Tokens & Constants

### 21.1 Spacing Scale
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### 21.2 Font Sizes
```
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
4xl: 2.25rem (36px)
5xl: 3rem (48px)
```

### 21.3 Border Radius
```
sm: 0.375rem (6px)
md: 0.5rem (8px)
lg: 1rem (16px)
xl: 1.5rem (24px)
2xl: 2rem (32px)
```

### 21.4 Shadow Depths
```
sm: 0 1px 2px rgba(0,0,0,0.05)
md: 0 4px 6px rgba(0,0,0,0.1)
lg: 0 10px 15px rgba(0,0,0,0.1)
xl: 0 20px 25px rgba(0,0,0,0.1)
2xl: 0 25px 50px rgba(0,0,0,0.25)
```

---

## 22. Summary

This comprehensive design specification provides developers with all necessary information to implement a professional Items Database page for the Arc Raiders Companion app. The design follows:

- **Dark gaming aesthetic** matching existing brand
- **Responsive mobile-first approach** (2 → 4 → 6 → 8 columns)
- **Accessibility-first** implementation (WCAG AA)
- **Performance optimization** with lazy loading and memoization
- **Consistent Tailwind CSS** styling with existing codebase
- **Intuitive filtering** system for easy navigation
- **Engaging micro-interactions** with smooth animations

All component examples, CSS classes, and patterns are production-ready and follow Next.js 16 + React 19 + Tailwind CSS 4 best practices.

