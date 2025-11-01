// BUILDINGS DATA - ALL 50 BUILDINGS! 🏗️🏙️
// From $10 houses to $100K ULTIMATE TOWERS!

// Kenney sprite system: Base buildings + roof tiles
// Pattern from sprite sheet: Every row has 1 base building in first 3 columns, 
// then multiple roof variants. Small files (~2KB) are roofs, larger files (~5-10KB) are bases.
const BUILDING_COMPOSITES = {
    // Row 1: Base 000, roofs 001-002
    '001': '000',
    '002': '000',
    
    // Row 2: Base 003, roofs 004-008
    '004': '003',
    '005': '003',
    '006': '003',
    '007': '003',
    '008': '003',
    
    // Row 3: Base 009, roofs 010-014
    '010': '009',
    '011': '009',
    '013': '009', // Small Yellow House uses base 009
    '014': '009',
    
    // Row 4: Base 012, roofs - or it might be standalone
    
    // Row 5: Base 015, roofs 016-017
    '016': '015',
    
    // Row 6: Base 018, roofs 019-020
    '019': '018',
    '020': '018',
    
    // Row 7: Base 021, roofs 022-023
    '022': '021',
    '023': '021',
    
    // Row 8: Base 024
    
    // Tier 2 buildings
    '027': '026',
    '030': '029',
    '031': '029',
    '032': '029',
    '034': '033',
    '036': '035',
    '037': '035',
    '039': '038',
    '040': '038',
    '042': '041',
    '043': '041',
    '045': '044',
    '046': '044',
    '048': '047',
    '049': '047',
    
    // Tier 3 buildings  
    '052': '051',
    '053': '051',
    '055': '051',
    '056': '054',
    '058': '057',
    '059': '057',
    '061': '060',
    '062': '060',
    '064': '063',
    '065': '063',
    '067': '066',
    '068': '066',
    '070': '069',
    '071': '069',
    '073': '072',
    '074': '072',
    '076': '075',
    '077': '075',
};

const BUILDINGS_DATA = {
    // ========== TIER 1: STARTER BUILDINGS ($10-$50) ==========
    tier1: [
        // REMOVED: Small Blue House (buildingTiles_000.png) - wrong base size, doesn't match grid
        { id: 'house-red-sm', name: 'Small Red House', cost: 15, value: 15, tier: 1, sprite: 'buildingTiles_003.png' },        // 9.6KB ✅ COMPLETE
        { id: 'house-yellow-sm', name: 'Small Yellow House', cost: 20, value: 20, tier: 1, sprite: 'buildingTiles_001.png' },  // 9.7KB ✅ COMPLETE (was 007)
        { id: 'corner-shop', name: 'Corner Shop', cost: 25, value: 25, tier: 1, sprite: 'buildingTiles_009.png' },             // 10.1KB ✅ COMPLETE
        { id: 'house-green', name: 'Green House', cost: 30, value: 30, tier: 1, sprite: 'buildingTiles_002.png' },             // 10.2KB ✅ COMPLETE (was 012)
        { id: 'apartment-starter', name: 'Starter Apartment', cost: 35, value: 35, tier: 1, sprite: 'buildingTiles_010.png' }, // 9.6KB ✅ COMPLETE (was 015)
        { id: 'house-pink', name: 'Pink House', cost: 40, value: 40, tier: 1, sprite: 'buildingTiles_017.png' },               // 9.5KB ✅ COMPLETE (was 018)
        { id: 'house-orange', name: 'Orange House', cost: 45, value: 45, tier: 1, sprite: 'buildingTiles_021.png' },           // 9.3KB ✅ COMPLETE
        { id: 'house-white', name: 'White House', cost: 50, value: 50, tier: 1, sprite: 'buildingTiles_022.png' },             // 9.4KB ✅ COMPLETE (was 024)
        { id: 'shop-basic', name: 'Basic Shop', cost: 50, value: 50, tier: 1, sprite: 'buildingTiles_014.png' }                 // 9.0KB ✅ COMPLETE
    ],
    
    // ========== TIER 2: GROWING NEIGHBORHOOD ($75-$200) ==========
    tier2: [
        { id: 'house-2story', name: 'Two-Story House', cost: 75, value: 100, tier: 2, sprite: 'buildingTiles_026.png' },        // 8.4KB ✅ COMPLETE
        { id: 'townhouse', name: 'Townhouse', cost: 100, value: 125, tier: 2, sprite: 'buildingTiles_029.png' },                // 9.0KB ✅ COMPLETE
        { id: 'house-large', name: 'Large House', cost: 125, value: 150, tier: 2, sprite: 'buildingTiles_030.png' },            // 8.8KB ✅ COMPLETE (was 032)
        { id: 'shop-awning', name: 'Shop with Awning', cost: 150, value: 175, tier: 2, sprite: 'buildingTiles_036.png' },       // 8.8KB ✅ COMPLETE (was 035)
        { id: 'office-small', name: 'Small Office', cost: 175, value: 200, tier: 2, sprite: 'buildingTiles_042.png' },          // 8.5KB ✅ COMPLETE (was 038)
        { id: 'rowhouse', name: 'Row House', cost: 150, value: 175, tier: 2, sprite: 'buildingTiles_041.png' },                 // 8.1KB ✅ COMPLETE
        { id: 'corner-building', name: 'Corner Building', cost: 175, value: 200, tier: 2, sprite: 'buildingTiles_037.png' },    // 8.3KB ✅ COMPLETE (was 044)
        { id: 'retail-mixed', name: 'Mixed Retail', cost: 200, value: 225, tier: 2, sprite: 'buildingTiles_034.png' },          // 8.2KB ✅ COMPLETE (was 047)
        { id: 'apartment-med', name: 'Medium Apartment', cost: 150, value: 175, tier: 2, sprite: 'buildingTiles_028.png' },     // 8.3KB ✅ COMPLETE
        { id: 'duplex', name: 'Duplex', cost: 125, value: 150, tier: 2, sprite: 'buildingTiles_020.png' }                        // 8.6KB ✅ COMPLETE (was 050)
    ],
    
    // ========== TIER 3: ESTABLISHED CITY ($300-$1,000) ==========
    tier3: [
        { id: 'apartment-complex', name: 'Apartment Complex', cost: 300, value: 400, tier: 3, sprite: 'buildingTiles_030.png' },      // 8.8KB ✅ COMPLETE (was 051)
        { id: 'retail-large', name: 'Large Retail Store', cost: 400, value: 500, tier: 3, sprite: 'buildingTiles_036.png' },          // 8.8KB ✅ COMPLETE (was 054)
        { id: 'office-building', name: 'Office Building', cost: 500, value: 650, tier: 3, sprite: 'buildingTiles_042.png' },          // 8.5KB ✅ COMPLETE (was 057)
        { id: 'restaurant', name: 'Restaurant/Cafe', cost: 350, value: 450, tier: 3, sprite: 'buildingTiles_004.png' },               // 8.5KB ✅ COMPLETE (was 060)
        { id: 'hotel-small', name: 'Small Hotel', cost: 600, value: 750, tier: 3, sprite: 'buildingTiles_026.png' },                  // 8.4KB ✅ COMPLETE (was 063)
        { id: 'bank', name: 'Bank Building', cost: 700, value: 900, tier: 3, sprite: 'buildingTiles_028.png' },                       // 8.3KB ✅ COMPLETE (was 066)
        { id: 'shop-multi', name: 'Multi-Story Shop', cost: 500, value: 650, tier: 3, sprite: 'buildingTiles_018.png' },              // 8.3KB ✅ COMPLETE (was 069)
        { id: 'office-professional', name: 'Professional Office', cost: 650, value: 800, tier: 3, sprite: 'buildingTiles_037.png' },  // 8.3KB ✅ COMPLETE (was 072)
        { id: 'department-store', name: 'Department Store', cost: 800, value: 1000, tier: 3, sprite: 'buildingTiles_034.png' },       // 8.2KB ✅ COMPLETE (was 075)
        { id: 'apartment-large', name: 'Large Apartment', cost: 700, value: 900, tier: 3, sprite: 'buildingTiles_041.png' }            // 8.1KB ✅ COMPLETE (was 055)
    ],
    
    // ========== TIER 4: MAJOR CITY ($1,500-$5,000) - INCLUDES SCHOOL & LIBRARY! ==========
    tier4: [
        { id: 'skyscraper-small', name: 'Small Skyscraper', cost: 1500, value: 2000, tier: 4, sprite: 'buildingTiles_100.png' },    // 8.8KB ✅ COMPLETE (was 078)
        { id: 'mall', name: 'Shopping Mall', cost: 2000, value: 2500, tier: 4, sprite: 'buildingTiles_093.png' },                   // 8.0KB ✅ COMPLETE (was 081)
        { id: 'school', name: '🏫 SCHOOL', cost: 3000, value: 4000, tier: 4, sprite: 'buildingTiles_099.png', special: true },      // 7.9KB ✅ COMPLETE (was 084)
        { id: 'hospital', name: 'Hospital', cost: 5000, value: 6500, tier: 4, sprite: 'buildingTiles_092.png' },                    // 7.2KB ✅ COMPLETE (was 087)
        { id: 'library', name: '📚 LIBRARY', cost: 4000, value: 5000, tier: 4, sprite: 'buildingTiles_085.png', special: true },    // 7.4KB ✅ COMPLETE (was 090)
        { id: 'fire-station', name: 'Fire Station', cost: 2500, value: 3000, tier: 4, sprite: 'buildingTiles_020.png' },            // 8.6KB ✅ COMPLETE (was 093)
        { id: 'police-station', name: 'Police Station', cost: 2500, value: 3000, tier: 4, sprite: 'buildingTiles_012.png' },        // 8.6KB ✅ COMPLETE (was 096)
        { id: 'city-hall', name: 'City Hall', cost: 4500, value: 5500, tier: 4, sprite: 'buildingTiles_011.png' },                  // 7.8KB ✅ COMPLETE (was 099)
        { id: 'arena', name: 'Sports Arena', cost: 3500, value: 4500, tier: 4, sprite: 'buildingTiles_019.png' },                   // 7.8KB ✅ COMPLETE (was 102)
        { id: 'convention', name: 'Convention Center', cost: 4000, value: 5000, tier: 4, sprite: 'buildingTiles_027.png' }           // 7.8KB ✅ COMPLETE (was 105)
    ],
    
    // ========== TIER 5: METROPOLIS! ($10,000-$100,000) - THE BIG LEAGUE! ==========
    tier5: [
        { id: 'skyscraper-glass', name: 'Glass Skyscraper', cost: 10000, value: 15000, tier: 5, sprite: 'buildingTiles_108.png' },   // 8.7KB ✅ COMPLETE
        { id: 'tower-modern', name: 'Modern Tower', cost: 15000, value: 20000, tier: 5, sprite: 'buildingTiles_124.png' },           // 10.2KB ✅ COMPLETE (was 111)
        { id: 'corporate-hq', name: 'Corporate HQ', cost: 20000, value: 28000, tier: 5, sprite: 'buildingTiles_114.png' },           // 7.5KB ✅ COMPLETE
        { id: 'hotel-luxury', name: 'Luxury Hotel', cost: 25000, value: 35000, tier: 5, sprite: 'buildingTiles_116.png' },           // 9.7KB ✅ COMPLETE
        { id: 'university', name: '🎓 UNIVERSITY', cost: 50000, value: 75000, tier: 5, sprite: 'buildingTiles_123.png', special: true },  // 9.7KB ✅ COMPLETE (was 119)
        { id: 'museum', name: '🏛️ MATH MUSEUM', cost: 75000, value: 100000, tier: 5, sprite: 'buildingTiles_122.png', special: true },   // 7.6KB ✅ COMPLETE
        { id: 'stadium', name: 'Stadium Complex', cost: 40000, value: 55000, tier: 5, sprite: 'buildingTiles_125.png' },             // 9.5KB ✅ COMPLETE
        { id: 'trade-center', name: 'World Trade Center', cost: 80000, value: 110000, tier: 5, sprite: 'buildingTiles_117.png' },    // 9.7KB ✅ COMPLETE
        { id: 'ultimate-tower', name: '🏆 ULTIMATE TOWER', cost: 100000, value: 150000, tier: 5, sprite: 'buildingTiles_109.png', special: true },  // 9.5KB ✅ COMPLETE (was 127)
        { id: 'landmark', name: 'City Landmark', cost: 60000, value: 85000, tier: 5, sprite: 'buildingTiles_115.png' }                // 8.0KB ✅ COMPLETE (was 128)
    ],

    // ========== DECORATIONS: ROADS, PARKS, TREES (FREE/CHEAP!) ==========
    decorations: [
        // ===== ROADS (FREE) =====
        // Basic straight roads
        { id: 'road-straight-ns', name: '🛣️ Road N-S', cost: 0, value: 0, tier: 0, sprite: 'roadNS.png', category: 'roads' },
        { id: 'road-straight-ew', name: '🛣️ Road E-W', cost: 0, value: 0, tier: 0, sprite: 'roadEW.png', category: 'roads' },
        
        // Corner roads (turns)
        { id: 'road-corner-ne', name: '🛣️ Corner NE', cost: 0, value: 0, tier: 0, sprite: 'roadNE.png', category: 'roads' },
        { id: 'road-corner-nw', name: '🛣️ Corner NW', cost: 0, value: 0, tier: 0, sprite: 'roadNW.png', category: 'roads' },
        { id: 'road-corner-se', name: '🛣️ Corner SE', cost: 0, value: 0, tier: 0, sprite: 'roadES.png', category: 'roads' },
        { id: 'road-corner-sw', name: '🛣️ Corner SW', cost: 0, value: 0, tier: 0, sprite: 'roadSW.png', category: 'roads' },
        
        // Intersections
        { id: 'road-crossroad', name: '🛣️ 4-Way', cost: 0, value: 0, tier: 0, sprite: 'crossroad.png', category: 'roads' },
        { id: 'road-3way-new', name: '🛣️ 3-Way (no S)', cost: 0, value: 0, tier: 0, sprite: 'crossroadNEW.png', category: 'roads' },
        { id: 'road-3way-nes', name: '🛣️ 3-Way (no W)', cost: 0, value: 0, tier: 0, sprite: 'crossroadNES.png', category: 'roads' },
        { id: 'road-3way-nsw', name: '🛣️ 3-Way (no E)', cost: 0, value: 0, tier: 0, sprite: 'crossroadNSW.png', category: 'roads' },
        { id: 'road-3way-esw', name: '🛣️ 3-Way (no N)', cost: 0, value: 0, tier: 0, sprite: 'crossroadESW.png', category: 'roads' },
        
        // Dead ends
        { id: 'road-end-n', name: '🛣️ End N', cost: 0, value: 0, tier: 0, sprite: 'endN.png', category: 'roads' },
        { id: 'road-end-s', name: '🛣️ End S', cost: 0, value: 0, tier: 0, sprite: 'endS.png', category: 'roads' },
        { id: 'road-end-e', name: '🛣️ End E', cost: 0, value: 0, tier: 0, sprite: 'endE.png', category: 'roads' },
        { id: 'road-end-w', name: '🛣️ End W', cost: 0, value: 0, tier: 0, sprite: 'endW.png', category: 'roads' },
        
        // ===== TREES ($5 each) =====
        { id: 'tree-tall', name: '🌳 Tall Tree', cost: 5, value: 5, tier: 0, sprite: 'treeTall.png', category: 'landscape' },
        { id: 'tree-short', name: '🌳 Short Tree', cost: 5, value: 5, tier: 0, sprite: 'treeShort.png', category: 'landscape' },
        { id: 'conifer-tall', name: '🌲 Tall Pine', cost: 5, value: 5, tier: 0, sprite: 'coniferTall.png', category: 'landscape' },
        { id: 'conifer-short', name: '🌲 Short Pine', cost: 5, value: 5, tier: 0, sprite: 'coniferShort.png', category: 'landscape' },
        
        // ===== PARKS ($10-50) =====
        { id: 'grass-whole', name: '🟩 Grass Patch', cost: 10, value: 10, tier: 0, sprite: 'grassWhole.png', category: 'landscape' },
        { id: 'park-bench', name: '🪑 Park Bench', cost: 15, value: 15, tier: 0, sprite: 'landscapeTiles_012.png', category: 'landscape' },
        { id: 'fountain', name: '⛲ Fountain', cost: 50, value: 50, tier: 0, sprite: 'landscapeTiles_017.png', category: 'landscape' },
        
        // ===== GROUND TILES (FREE) =====
        { id: 'ground-grass', name: '🟩 Grass', cost: 0, value: 0, tier: 0, sprite: 'grass.png', category: 'landscape' },
        { id: 'ground-dirt', name: '🟫 Dirt', cost: 0, value: 0, tier: 0, sprite: 'dirt.png', category: 'landscape' }
    ]
};

// Load buildings into sidebar
function loadBuildings() {
    // Load each tier
    for (let tier = 1; tier <= 5; tier++) {
        const container = document.getElementById(`tier${tier}-buildings`);
        const buildings = BUILDINGS_DATA[`tier${tier}`];
        
        buildings.forEach(building => {
            const card = createBuildingCard(building);
            container.appendChild(card);
        });
    }
    
    // Load decorations if container exists
    const decorContainer = document.getElementById('decorations-buildings');
    if (decorContainer && BUILDINGS_DATA.decorations) {
        BUILDINGS_DATA.decorations.forEach(decoration => {
            const card = createBuildingCard(decoration);
            decorContainer.appendChild(card);
        });
    }
    
    console.log('🏗️ All 50 buildings + decorations loaded into sidebar!');
}

// Create a building card element
function createBuildingCard(building) {
    const card = document.createElement('div');
    card.className = 'building-card';
    
    // Add special class for educational buildings
    if (building.special) {
        card.style.border = '3px solid #f39c12';
        card.style.background = '#fff9e6';
    }
    
    // Building image - Handle different asset paths
    const img = document.createElement('img');
    
    // Decorations use different asset paths (roads, landscape)
    if (building.tier === 0) {
        if (building.category === 'roads') {
            img.src = `../assets/math-city-builder/decorations/roads/${building.sprite}`;
        } else if (building.category === 'landscape') {
            img.src = `../assets/math-city-builder/decorations/landscape/${building.sprite}`;
        }
    } else {
        // Regular buildings
        img.src = `../assets/math-city-builder/buildings/tier${building.tier}/${building.sprite}`;
    }
    
    img.style.width = '60px';
    img.style.height = '60px';
    img.style.margin = '0 auto 5px';
    img.style.objectFit = 'contain';
    img.style.display = 'block';
    
    // Error handler - show colored box if sprite fails to load
    img.onerror = () => {
        img.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.width = '60px';
        placeholder.style.height = '60px';
        placeholder.style.margin = '0 auto 5px';
        placeholder.style.background = getBuildingColor(building.tier);
        placeholder.style.borderRadius = '4px';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.fontSize = '30px';
        placeholder.textContent = building.special ? '⭐' : '🏢';
        card.insertBefore(placeholder, card.firstChild);
    };
    
    // Building name
    const name = document.createElement('div');
    name.className = 'building-name';
    name.textContent = building.name;
    
    // Building cost
    const cost = document.createElement('div');
    cost.className = 'building-cost';
    if (building.cost >= 1000) {
        cost.classList.add('expensive');
    }
    cost.textContent = `$${building.cost.toLocaleString()}`;
    
    // Click handler - select this building
    card.onclick = () => {
        // Remove selected class from all cards
        document.querySelectorAll('.building-card').forEach(c => {
            c.classList.remove('selected');
        });
        
        // Select this card
        card.classList.add('selected');
        gameState.selectedBuilding = building;
        gameState.demolishMode = false;
        
        // Update demolish button
        const demolishBtn = document.getElementById('demolish-btn');
        demolishBtn.textContent = '🔨 Demolish Mode (50% refund)';
        demolishBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        
        console.log(`🏗️ Selected: ${building.name} ($${building.cost})`);
    };
    
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(cost);
    
    return card;
}

console.log('🏢 Buildings system loaded! 50 buildings ready to place! 💪');
