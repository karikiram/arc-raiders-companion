# Items Database Design - Complete Package

This package contains comprehensive UI/UX design specifications for the Arc Raiders Companion Items Database page. It's ready for implementation by developers.

---

## What's Included

### 1. **ITEMS_DATABASE_DESIGN_SPEC.md** (44 KB)
**The complete design specification document**

Covers:
- Color palette & rarity system (with hex values)
- Page layout architecture
- Hero section specifications
- Filter controls (search, category, rarity)
- Item grid layout & responsiveness (2→4→6→8 columns)
- Item card design (closed & hover states)
- Item detail modal (full specifications)
- Empty states & loading
- Responsive breakpoint strategy
- Micro-interactions & animations
- Component file structure
- Complete Tailwind CSS class reference
- Accessibility considerations (WCAG AA)
- Performance considerations
- Implementation checklist (5 phases)
- Ready-to-use code examples
- Future enhancement suggestions

### 2. **ITEMS_DATABASE_VISUAL_GUIDE.md** (34 KB)
**Visual reference wireframes and diagrams**

Includes:
- Full page layout wireframe
- Item card detailed design
- Filter bar layout (mobile, tablet, desktop)
- Item detail modal structure
- Rarity color swatches with Tailwind classes
- Interactive states (buttons, inputs)
- Mobile responsiveness comparison
- Empty state variations
- Typography hierarchy
- Spacing system
- Keyboard navigation path
- Focus & accessibility states
- Loading skeletons
- Hover effects before/after
- Modal sizing by breakpoint
- Grid gap reference
- Badge styling examples
- Search bar interaction states
- Filter dropdown anatomy

### 3. **ITEMS_DATABASE_COMPONENT_TEMPLATES.md** (29 KB)
**Production-ready component templates**

Provides:
- ItemsDatabase main container (full implementation)
- PageHero component with stats
- FilterSection component with FilterBar integration
- ItemsGrid responsive grid component
- ItemCard component with hover/interactive states
- ItemDetailModal with full details display
- EmptyState component variations
- Utility functions (helpers for labels, colors, etc.)
- Page route handler (`/items`)
- CSS animations for globals.css
- Directory structure blueprint
- Implementation order (4 phases)
- Testing checklist

---

## Quick Start for Developers

### Step 1: Read the Documents in Order
1. Start with **ITEMS_DATABASE_DESIGN_SPEC.md** - understand the complete design
2. Review **ITEMS_DATABASE_VISUAL_GUIDE.md** - see the visual layouts
3. Use **ITEMS_DATABASE_COMPONENT_TEMPLATES.md** - implement the components

### Step 2: Set Up File Structure
```
src/components/items-database/
├── ItemsDatabase.tsx           (main container)
├── PageHero.tsx                (hero section)
├── FilterSection.tsx           (filter controls)
├── ItemsGrid.tsx               (grid layout)
├── ItemCard.tsx                (item cards)
├── ItemDetailModal.tsx         (detail modal)
├── EmptyState.tsx              (empty state)
└── utils.ts                    (utilities)

src/app/items/
└── page.tsx                    (route)
```

### Step 3: Implement in Phases
**Phase 1 - Foundation** (2-3 hours)
- Copy components from templates
- Set up file structure
- Implement basic layout

**Phase 2 - Filtering** (2-3 hours)
- Add search functionality
- Implement category filter
- Implement rarity filter
- Add clear filters

**Phase 3 - Details** (1-2 hours)
- Create modal component
- Add modal animations
- Test responsiveness

**Phase 4 - Polish** (1-2 hours)
- Add micro-animations
- Test accessibility
- Performance optimization

---

## Design System Reference

### Colors
```
Dark Base:    zinc-950 (bg)
Surface:      zinc-900 (cards)
Surface Alt:  zinc-800 (hover)
Border:       zinc-800 → zinc-700
Text Primary: white
Text Muted:   zinc-500
Accent:       amber-500 (interactive)

Rarities:
- Common:     zinc-600/200
- Uncommon:   green-700/100
- Rare:       blue-700/100
- Epic:       purple-700/100
- Legendary:  amber-600/100
```

### Layout Grid
```
Mobile:     2 columns (gap-2)
Tablet:     4 columns (gap-3)
Desktop:    6 columns (gap-4)
Large:      8 columns (gap-4)
```

### Typography
```
Page Title:    text-4xl sm:text-5xl font-bold
Section Title: text-lg sm:text-xl font-semibold
Card Title:    text-sm sm:text-base font-semibold
Body:          text-base text-zinc-300
Muted:         text-xs text-zinc-500
```

---

## Key Features

### Search & Filtering
- Real-time search with debouncing
- Multi-select category dropdown
- Multi-select rarity buttons
- Active filter display with chips
- Clear all filters button
- Result counter

### Item Display
- Responsive grid (2→4→6→8 columns)
- Item cards with rarity-colored backgrounds
- Favorite button (star icon)
- Pixelated image rendering
- Category labels
- Hover effects with glow
- Touch-friendly sizing

### Item Details
- Full-screen modal overlay
- Large item image
- Complete information display
- Rarity and category badges
- Description text
- Weight, value, stack size
- Recycle materials section
- Close animation

### Accessibility
- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- Visible focus states
- Alt text on images
- Semantic HTML

### Performance
- Lazy loading images
- Memoized filtering
- Debounced search (300ms)
- CSS animations (no jank)
- Optimized Tailwind classes

---

## Implementation Example

Quick example of how to use the templates:

```tsx
// 1. Copy ItemsDatabase.tsx from templates
// 2. Copy component files to src/components/items-database/
// 3. Create route file src/app/items/page.tsx

import { ItemsDatabase } from '@/components/items-database/ItemsDatabase';

export default function ItemsPage() {
  return <ItemsDatabase />;
}

// 4. That's it! The component handles everything:
//    - Data fetching from ITEMS
//    - Filtering (search, category, rarity)
//    - Grid display
//    - Modal interactions
//    - Responsive layout
```

---

## Testing Checklist

### Functional Testing
- [ ] Search filters in real-time
- [ ] Category dropdown works (multi-select)
- [ ] Rarity buttons toggle correctly
- [ ] Results update on filter change
- [ ] Clear all filters resets everything
- [ ] Modal opens/closes correctly
- [ ] Modal displays all item details
- [ ] Recycle materials display correctly

### Responsive Testing
- [ ] Mobile (375px): 2-column grid
- [ ] Tablet (768px): 4-column grid
- [ ] Desktop (1024px): 6-column grid
- [ ] Large (1280px): 8-column grid
- [ ] Touch targets 44px minimum
- [ ] No horizontal scroll
- [ ] Modal responsive on all sizes

### Visual Testing
- [ ] Rarity colors accurate
- [ ] Hover states visible
- [ ] Focus states amber glow
- [ ] Animations smooth (60fps)
- [ ] Images pixelated rendering
- [ ] Text contrast WCAG AA

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Tab order logical
- [ ] Screen reader announces content
- [ ] Alt text on images
- [ ] Focus visible on all interactive elements
- [ ] Modal traps focus
- [ ] Escape closes modal

---

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

All components use standard CSS and Tailwind, no experimental features.

---

## Dependencies

**Already in project**:
- Next.js 16
- React 19
- Tailwind CSS 4
- Lucide React (icons)
- TypeScript

**Uses existing components**:
- FilterBar (from src/components/ui/FilterBar.tsx)
- Card (from src/components/ui/Card.tsx)
- Badge (from src/components/ui/Badge.tsx)
- Button (from src/components/ui/Button.tsx)
- cn utility (from @/lib/utils)

**No additional packages needed!**

---

## Customization Guide

### Change Item Columns
In **ItemsGrid.tsx**, modify the grid class:
```tsx
// Current (2→4→6→8 columns)
className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4"

// Example: To use 3→6→8 columns
className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4"
```

### Change Accent Color
All amber-500 references can be changed to your preferred accent:
```tsx
// From: amber-500, amber-400, amber-500/10, amber-500/20, etc.
// To:   your-color-500, your-color-400, etc.
```

### Change Modal Size
In **ItemDetailModal.tsx**:
```tsx
// Current
className="max-w-2xl w-full"

// Example: Larger modal
className="max-w-4xl w-full"
```

### Adjust Filter Sticky Position
In **FilterSection.tsx**:
```tsx
// Current: sticky top-0 (sticks to top)
// To stick to specific distance:
className="sticky top-16 z-40 ..." // (if header is 64px)
```

---

## Performance Tips

1. **Image Optimization**: Use WebP format with PNG fallback
2. **Lazy Loading**: Add Intersection Observer for below-fold images
3. **Virtual Scrolling**: If 1000+ items, implement virtualization
4. **Debouncing**: Search input is debounced (adjust in utils.ts)
5. **Memoization**: useMemo is used for filtering logic

---

## Future Enhancements

See **Section 19** in ITEMS_DATABASE_DESIGN_SPEC.md for:
- Sorting options
- List view mode
- Item comparison tool
- Export functionality
- Advanced filtering
- Search history
- Item collections
- Collaborative lists

---

## File Sizes

| File | Size | Lines |
|------|------|-------|
| ITEMS_DATABASE_DESIGN_SPEC.md | 44 KB | 1,300+ |
| ITEMS_DATABASE_VISUAL_GUIDE.md | 34 KB | 1,100+ |
| ITEMS_DATABASE_COMPONENT_TEMPLATES.md | 29 KB | 900+ |
| **Total** | **107 KB** | **3,300+** |

---

## Contact & Support

If you have questions about the design:
1. Check the relevant specification section
2. Review the visual guide for examples
3. Check the code examples in templates
4. Look at existing components for patterns

---

## Document Versions

- **Created**: 2025-12-04
- **Status**: Design Specification Complete
- **Project**: Arc Raiders Companion
- **Framework**: Next.js 16 + React 19 + Tailwind CSS 4

---

**Ready to implement! Choose any component template and start building.**

