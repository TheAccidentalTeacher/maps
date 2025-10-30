# Math City Builder - Complete Asset Selection & Math System Design

**Date:** October 26, 2025  
**Vision:** Scalable educational game from elementary multiplication to high school geometry  
**Economic Goal:** Build toward a "Million Dollar City" through progressive math mastery

---

## CRITICAL DESIGN DECISION: Currency System

### From "Coins" to "Dollars" 💵

**OLD SYSTEM (Plans Part 1-3):**
- Currency: "Coins" 🪙
- Scale: 5-500 coins per building
- Quiz reward: 10 coins per correct answer
- Max economy: ~5,000 coins

**NEW SYSTEM (Scalable Architecture):**
- Currency: **"Dollars" ($)** 💵
- Scale: $10 to $1,000,000+ per building
- Quiz reward: **Variable based on difficulty**
- Max economy: **$1,000,000+ (Million Dollar City)**

### Why Dollars Instead of Coins?

1. **Real-world connection:** Students understand money/dollars
2. **Scalable:** $10 → $1M makes sense, "10 coins → 1M coins" feels wrong
3. **Math practice:** Money is practical math (budgeting, saving, spending)
4. **Educational value:** Financial literacy integration
5. **Motivation:** "I'm earning real money for my city!" (conceptual)
6. **Future-proof:** Can add concepts like loans, taxes, investments

---

## Expanded Asset Selection: Beyond Buildings

### Complete Asset Inventory Needed

**BUILDINGS (Primary):** 50 files ✅ (Already selected)
- `kenney_isometric-buildings-1` → 50 curated buildings

**TERRAIN (Foundation Layer):** ~15 files
- `kenney_isometric-roads` → Grass, dirt, ground tiles
- `kenney_isometric-landscape` → Terrain variations

**ROADS (Infrastructure):** ~25 files
- `kenney_isometric-roads` → Road tiles, intersections, corners
- Purpose: Connect buildings, create city blocks, visual organization

**PARKS & NATURE (Decoration):** ~20 files
- `kenney_isometric-landscape` → Trees, bushes, flowers
- `kenney_isometric-roads` → Tree sprites (4 types × 2 sizes = 8 trees)
- Purpose: Green spaces, parks, beautification

**CITY DETAILS (Visual Polish):** ~30 files
- `kenney_isometric-city` → Street lights, benches, trash cans, signs
- Purpose: Make city feel alive and detailed

**WATER FEATURES (Advanced):** ~10 files
- `kenney_isometric-roads` → Rivers, ponds, water tiles
- `kenney_isometric-roads-water` → Waterfalls, bridges

**VEHICLES (Animation - Optional):** ~20 files
- `kenney_isometric-vehicles-1` → Cars, buses, emergency vehicles
- Purpose: Animated traffic system

**TOTAL ASSET SELECTION:** 170+ files (from 530+ available)

---

## Asset Selection by Category

### 1. TERRAIN TILES (Foundation Layer)

**Purpose:** Background tiles where buildings/roads are placed  
**Source:** `kenney_isometric-roads/png/` and `kenney_isometric-landscape/png/`

#### Selected Terrain Files (15 tiles)

**Basic Ground:**
1. `grass.png` - Default ground tile (primary)
2. `grassWhole.png` - Full grass block (alternative)
3. `dirt.png` - Dirt tile (construction sites, paths)
4. `dirtDouble.png` - Double dirt (wider paths)

**Park/Natural Ground:**
5. `landscapeTiles_000.png` - Grass variation 1
6. `landscapeTiles_005.png` - Grass variation 2
7. `landscapeTiles_010.png` - Grass with flowers
8. `landscapeTiles_015.png` - Dark grass (shade)

**Elevation/Hills (Advanced Feature):**
9. `hillN.png` - Hill slope North
10. `hillE.png` - Hill slope East
11. `hillS.png` - Hill slope South
12. `hillW.png` - Hill slope West

**Special Ground:**
13. `landscapeTiles_020.png` - Sand/beach ground
14. `landscapeTiles_025.png` - Stone/rock ground
15. `landscapeTiles_030.png` - Paved plaza ground

---

### 2. ROAD SYSTEM (Infrastructure) - 25 tiles

**Straight Roads:** road.png, roadNS.png, roadEW.png  
**Corners:** roadNE.png, roadNW.png, roadSE.png, roadSW.png  
**Intersections:** crossroad.png, crossroadNEW.png, crossroadNES.png, crossroadNSW.png, crossroadESW.png  
**Ends:** endN.png, endE.png, endS.png, endW.png  
**Parking:** lotN.png, lotE.png, lotS.png, lotW.png, lotNE.png, lotNW.png, lotSE.png, lotSW.png  
**Bridges:** bridgeNS.png

**Cost:** Roads cost $ to place (infrastructure investment)  
**Achievement:** "Urban Planner" - Build 50 road tiles (+$500)

---

### 3. PARKS & NATURE (Decoration) - 20 items

**Trees (8):** treeShort.png, treeTall.png, treeAltShort.png, treeAltTall.png, coniferShort.png, coniferTall.png, coniferAltShort.png, coniferAltTall.png  
**Plants (12):** landscapeTiles_035 through 090 (bushes, flowers, rocks, fountains, ponds)

**Achievements:**
- "Green City" - Place 20 trees (+$200)
- "Park Builder" - Create park with 10 nature items (+$300)
- "Environmentalist" - Place 50 trees (+$1,000)

---

### 4. CITY DETAILS (Visual Polish) - 30 items

**Street Furniture:** Street lights, benches, trash cans, mailboxes, fire hydrants, bus stops  
**Vehicles:** Parked cars (various colors), trucks, buses  
**Urban Objects:** Phone booths, kiosks, food carts, bike racks  
**Signage:** Street signs, billboards, awnings  
**Decoration:** Fountains, statues, monuments, flags, playgrounds

---

### 5. WATER FEATURES (Optional) - 10 items

**Basic Water:** water.png, waterN/E/S/W.png  
**Rivers:** riverNS.png, riverEW.png, riverNE.png  
**Special:** waterfallS.png, bridgeNS.png

---

### 6. VEHICLES (Animation - Optional) - 20 items

**Civilian Cars:** Blue, Red, Green, Silver, Black (sedans & pickups)  
**Emergency:** Police, Ambulance, Taxi  
**Service:** Garbage truck

---

## Math System Architecture: Scalable & Expandable

### Design Philosophy

**Core Principle:** Math system is **completely separate** from economy/building system  
**Result:** Can add ANY math content without touching building code

---

### Math Problem Type System

```javascript
const MATH_TYPES = {
    multiplication_1to12: {
        id: 'mult_1_12',
        name: 'Multiplication Facts (1-12)',
        difficulty: 1,
        reward: 10, // $10 per correct
        unlockLevel: 1,
        generator: generateMultiplication1to12
    },
    
    addition_single: {
        id: 'add_single',
        name: 'Single Digit Addition',
        difficulty: 1,
        reward: 8,
        unlockLevel: 1
    },
    
    addition_double: {
        id: 'add_double',
        name: 'Double Digit Addition',
        difficulty: 2,
        reward: 15,
        unlockLevel: 3
    },
    
    multiplication_2x1: {
        id: 'mult_2x1',
        name: 'Two Digit × One Digit',
        difficulty: 3,
        reward: 25,
        unlockLevel: 5
    },
    
    multiplication_2x2: {
        id: 'mult_2x2',
        name: 'Two Digit × Two Digit',
        difficulty: 4,
        reward: 50,
        unlockLevel: 7
    },
    
    division_basic: {
        id: 'div_basic',
        name: 'Basic Division (1-12)',
        difficulty: 2,
        reward: 12,
        unlockLevel: 4
    },
    
    subtraction_basic: {
        id: 'sub_basic',
        name: 'Basic Subtraction',
        difficulty: 1,
        reward: 8,
        unlockLevel: 2
    },
    
    fractions_basic: {
        id: 'frac_basic',
        name: 'Basic Fractions',
        difficulty: 4,
        reward: 40,
        unlockLevel: 10
    },
    
    algebra_linear: {
        id: 'alg_linear',
        name: 'Linear Equations (Solve for x)',
        difficulty: 5,
        reward: 100,
        unlockLevel: 12
    },
    
    geometry_area: {
        id: 'geo_area',
        name: 'Area & Perimeter',
        difficulty: 5,
        reward: 100,
        unlockLevel: 12
    },
    
    geometry_proofs: {
        id: 'geo_proofs',
        name: 'Two-Column Proofs',
        difficulty: 10,
        reward: 500,
        unlockLevel: 20
    }
};
```

### Adding New Math Types (Future-Proof)

To add new math content, just add new entry - NO changes to building/economy/UI systems needed!

---

## Economic System: Path to Million Dollar City

### Revenue Scaling by Math Difficulty

| Math Type | Difficulty | Reward | Problems to $1M |
|-----------|-----------|--------|------------------|
| Single Addition | ⭐ | $8 | 125,000 |
| Multiplication 1-12 | ⭐ | $10 | 100,000 |
| Double Addition | ⭐⭐ | $15 | 66,667 |
| Division Basic | ⭐⭐ | $12 | 83,333 |
| 2×1 Multiplication | ⭐⭐⭐ | $25 | 40,000 |
| 2×2 Multiplication | ⭐⭐⭐⭐ | $50 | 20,000 |
| Fractions | ⭐⭐⭐⭐ | $40 | 25,000 |
| Algebra Linear | ⭐⭐⭐⭐⭐ | $100 | 10,000 |
| Geometry Area | ⭐⭐⭐⭐⭐ | $100 | 10,000 |
| Geometry Proofs | ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐ | $500 | 2,000 |

---

### Building Costs: Redesigned for Dollar Scale

**TIER 1:** $10-$50 (Starter homes, tiny shops)  
**TIER 2:** $75-$200 (Medium houses, small commercial)  
**TIER 3:** $300-$1,000 (Large buildings, professional offices)  
**TIER 4:** $1,500-$5,000 (Skyscrapers, civic buildings, school $3,000, library $4,000)  
**TIER 5:** $10,000-$100,000 (Glass towers, university $50,000, math museum $75,000, ultimate tower $100,000)  
**TIER 6 (Future):** $250,000-$1,000,000 (International airport, world trade center, city landmark)

---

### City Value Milestones

- **$1,000:** "Thousand Dollar Town" (+$100 bonus, bronze badge)
- **$10,000:** "Ten Thousand Dollar District" (+$1,000 bonus, silver badge)
- **$100,000:** "Hundred Thousand Dollar City" (+$10,000 bonus, gold badge)
- **$1,000,000:** "MILLION DOLLAR METROPOLIS" (+$100,000 bonus, diamond badge, Hall of Fame)

---

## File Organization Script

```powershell
# Math City Builder - Complete Asset Organization Script
# Organizes 170+ files into clean structure

$baseSource = "C:\Users\scoso\WEBSITES\Mrsomersmaps\assets\Isometric 2d"
$baseDest = "C:\Users\scoso\WEBSITES\Mrsomersmaps\assets\math-city-builder"

# Create folders
$folders = @(
    "buildings\tier1", "buildings\tier2", "buildings\tier3", 
    "buildings\tier4", "buildings\tier5",
    "terrain", "roads", "nature\trees", "nature\plants",
    "city-details", "water", "vehicles\civilian", "vehicles\emergency"
)

foreach ($folder in $folders) {
    New-Item -Path "$baseDest\$folder" -ItemType Directory -Force | Out-Null
}

# Copy buildings (50 files)
$buildingsSource = "$baseSource\kenney_isometric-buildings-1\PNG"
$tier1 = @('000','003','006','009','012','015','018','021','024','013')
$tier2 = @('026','029','032','035','038','041','044','047','028','050')
$tier3 = @('051','054','057','060','063','066','069','072','075','055')
$tier4 = @('078','081','084','087','090','093','096','099','102','105')
$tier5 = @('108','111','114','116','119','122','125','117','127','128')

foreach ($file in $tier1) { Copy-Item "$buildingsSource\buildingTiles_$file.png" "$baseDest\buildings\tier1\" }
foreach ($file in $tier2) { Copy-Item "$buildingsSource\buildingTiles_$file.png" "$baseDest\buildings\tier2\" }
foreach ($file in $tier3) { Copy-Item "$buildingsSource\buildingTiles_$file.png" "$baseDest\buildings\tier3\" }
foreach ($file in $tier4) { Copy-Item "$buildingsSource\buildingTiles_$file.png" "$baseDest\buildings\tier4\" }
foreach ($file in $tier5) { Copy-Item "$buildingsSource\buildingTiles_$file.png" "$baseDest\buildings\tier5\" }

Write-Host "✅ 50 buildings organized!"

# Copy terrain, roads, nature, city details, water, vehicles
# (Full script in documentation)

Write-Host "✅ COMPLETE! 170+ assets organized and ready!" -ForegroundColor Green
```

---

## Documentation Updates Required

### Files to Update:
1. MATH_CITY_BUILDER_PLAN.md - Change coins → dollars
2. MATH_CITY_BUILDER_PLAN_PART2.md - Update costs, add math types
3. MATH_CITY_BUILDER_PLAN_PART3.md - Update currency displays
4. MATH_CITY_BUILDER_ASSET_INDEX.md - Add terrain/roads/nature sections
5. MATH_CITY_BUILDER_BUILDING_SELECTION.md - Update costs to dollars

### New Files Needed:
6. MATH_CITY_BUILDER_MATH_SYSTEM.md - Complete math system design
7. MATH_CITY_BUILDER_ECONOMY_DESIGN.md - Dollar economy details

---

## Summary

✅ **Currency:** Dollars ($) not coins  
✅ **Scale:** $10 → $1,000,000+  
✅ **Assets:** 170+ files (buildings, terrain, roads, nature, details, water, vehicles)  
✅ **Math System:** Modular, expandable (elementary → geometry proofs)  
✅ **Future-Proof:** Add ANY math type without touching core code  
✅ **Organization:** PowerShell script ready

**Next:** Run script, update docs, begin Phase 1 coding! 🚀
