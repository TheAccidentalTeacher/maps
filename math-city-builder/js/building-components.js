// BUILDING COMPONENTS SYSTEM 🏗️
// Proper fucking categorization of 129 building sprites

// ==========================================================================
// COMPLETE BUILDINGS (20 sprites) - Already have roofs, just place them!
// ==========================================================================
const COMPLETE_BUILDINGS = [
    { id: 'buildingTiles_000', name: 'Small Blue House', material: 'blue', stories: 1 },
    { id: 'buildingTiles_001', name: 'Small Beige House', material: 'beige', stories: 1 },
    { id: 'buildingTiles_002', name: 'Blue Peaked Roof House', material: 'blue', stories: 1 },
    { id: 'buildingTiles_003', name: 'Beige Commercial', material: 'beige', stories: 1 },
    { id: 'buildingTiles_004', name: 'Red Brick with Chimney', material: 'red_brick', stories: 1 },
    { id: 'buildingTiles_007', name: 'Blue Pool Feature', material: 'blue', stories: 1 },
    { id: 'buildingTiles_008', name: 'Blue Curved Roof', material: 'blue', stories: 1 },
    { id: 'buildingTiles_009', name: 'Red Brick 2-Story House', material: 'red_brick', stories: 2 },
    { id: 'buildingTiles_010', name: 'Red Brick Shop with Awning', material: 'red_brick', stories: 1 },
    { id: 'buildingTiles_011', name: 'Beige Flat Roof Commercial', material: 'beige', stories: 1 },
    { id: 'buildingTiles_012', name: 'Beige Corner Building', material: 'beige', stories: 1 },
    { id: 'buildingTiles_014', name: 'Brown Multi-Window', material: 'brown', stories: 2 },
    { id: 'buildingTiles_016', name: 'Red Brick Corner', material: 'red_brick', stories: 1 },
    { id: 'buildingTiles_017', name: 'Pink Multi-Story', material: 'pink', stories: 2 },
    { id: 'buildingTiles_018', name: 'Green/Pink Multi-Color', material: 'multi', stories: 2 },
    { id: 'buildingTiles_021', name: 'Red Brick 2-Story Traditional', material: 'red_brick', stories: 2 },
    { id: 'buildingTiles_023', name: 'Blue/Beige Structure', material: 'blue', stories: 1 },
    { id: 'buildingTiles_024', name: 'Blue Pool Building', material: 'blue', stories: 1 },
    { id: 'buildingTiles_025', name: 'Red Brick Residential', material: 'red_brick', stories: 2 }
];

// ==========================================================================
// FLOOR PIECES (50 sprites) - Need roofs on top!
// ==========================================================================
const FLOOR_PIECES = {
    // SINGLE-LAYER FLOORS (8 sprites)
    single: [
        { id: 'buildingTiles_005', material: 'beige', height: 1.0 },
        { id: 'buildingTiles_006', material: 'beige', height: 1.0 },
        { id: 'buildingTiles_013', material: 'beige', height: 1.0 },
        { id: 'buildingTiles_019', material: 'beige', height: 1.0 },
        { id: 'buildingTiles_020', material: 'green', height: 1.0 },
        { id: 'buildingTiles_026', material: 'red_brick', height: 1.0 },
        { id: 'buildingTiles_027', material: 'beige', height: 1.0 },
        { id: 'buildingTiles_028', material: 'beige', height: 1.0 }
    ],
    
    // 2-LAYER STACKS (35 sprites) - Pre-assembled 2-story sections
    twoLayer: [
        { id: 'buildingTiles_029', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_030', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_031', material: 'blue', height: 2.0 },
        { id: 'buildingTiles_032', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_033', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_034', material: 'blue', height: 2.0 },
        { id: 'buildingTiles_035', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_036', material: 'blue', height: 2.0 },
        { id: 'buildingTiles_037', material: 'blue', height: 2.0 },
        { id: 'buildingTiles_038', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_039', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_040', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_041', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_042', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_043', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_044', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_045', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_046', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_047', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_048', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_049', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_050', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_051', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_052', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_053', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_054', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_055', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_056', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_107', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_108', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_111', material: 'red_brick', height: 2.0 },
        { id: 'buildingTiles_112', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_113', material: 'blue', height: 2.0 },
        { id: 'buildingTiles_114', material: 'beige', height: 2.0 },
        { id: 'buildingTiles_118', material: 'red_brick', height: 2.0 }
    ],
    
    // 3-LAYER TOWERS (3 sprites) - Holy shit, instant 3-story buildings!
    threeLayer: [
        { id: 'buildingTiles_112', material: 'multi', height: 3.0, combo: 'green/tan/brown' }, // The legendary triple stack!
        { id: 'buildingTiles_119', material: 'brown', height: 3.0 },
        { id: 'buildingTiles_120', material: 'beige', height: 3.0 }
    ],
    
    // L-SHAPED CORNERS (4 sprites) - For fancy corner buildings
    corners: [
        { id: 'buildingTiles_107', material: 'beige', height: 2.0, shape: 'L' },
        { id: 'buildingTiles_118', material: 'red_brick', height: 2.0, shape: 'L' },
        { id: 'buildingTiles_121', material: 'red_brick', height: 2.0, shape: 'L' },
        { id: 'buildingTiles_123', material: 'red_brick', height: 2.0, shape: 'L' }
    ]
};

// ==========================================================================
// ROOF PIECES (59 sprites) - Put these fuckers on top!
// ==========================================================================
const ROOF_PIECES = {
    // BEIGE FLAT ROOFS (28 sprites) - Most common
    beigeFlat: [
        'buildingTiles_057', 'buildingTiles_058', 'buildingTiles_059', 'buildingTiles_060',
        'buildingTiles_061', 'buildingTiles_063', 'buildingTiles_064', 'buildingTiles_067',
        'buildingTiles_068', 'buildingTiles_072', 'buildingTiles_073', 'buildingTiles_078',
        'buildingTiles_083', 'buildingTiles_084', 'buildingTiles_085', 'buildingTiles_093',
        'buildingTiles_094', 'buildingTiles_100', 'buildingTiles_101', 'buildingTiles_103',
        'buildingTiles_104', 'buildingTiles_105', 'buildingTiles_106', 'buildingTiles_109',
        'buildingTiles_110', 'buildingTiles_115', 'buildingTiles_116', 'buildingTiles_117'
    ],
    
    // ORANGE TERRACOTTA ROOFS (12 sprites) - Mediterranean style!
    terracotta: [
        'buildingTiles_062', 'buildingTiles_065', 'buildingTiles_066', 'buildingTiles_070',
        'buildingTiles_071', 'buildingTiles_076', 'buildingTiles_077', 'buildingTiles_082',
        'buildingTiles_099'
    ],
    
    // RED/PINK ANGLED ROOFS (11 sprites) - Traditional houses
    redAngled: [
        'buildingTiles_069', 'buildingTiles_074', 'buildingTiles_075', 'buildingTiles_080',
        'buildingTiles_081', 'buildingTiles_088', 'buildingTiles_089', 'buildingTiles_090',
        'buildingTiles_091', 'buildingTiles_097', 'buildingTiles_098', 'buildingTiles_102'
    ],
    
    // GREY FLAT ROOFS (8 sprites) - Modern/industrial
    greyFlat: [
        'buildingTiles_079', 'buildingTiles_086', 'buildingTiles_087', 'buildingTiles_095',
        'buildingTiles_096'
    ]
};

// ==========================================================================
// HELPER FUNCTIONS - Let's build some shit!
// ==========================================================================

/**
 * Get a random complete building (instant placement)
 */
function getRandomCompleteBuilding() {
    return COMPLETE_BUILDINGS[Math.floor(Math.random() * COMPLETE_BUILDINGS.length)];
}

/**
 * Build a custom building by stacking floors + roof
 * @param {number} stories - How many stories (1-5)
 * @param {string} material - 'beige', 'red_brick', 'blue', etc.
 * @param {string} roofStyle - 'flat', 'terracotta', 'angled'
 */
function buildCustomBuilding(stories, material = 'beige', roofStyle = 'flat') {
    const components = [];
    
    // Build floors based on height
    if (stories === 1) {
        // Use single floor
        const floor = FLOOR_PIECES.single.find(f => f.material === material) || FLOOR_PIECES.single[0];
        components.push(floor);
    } else if (stories === 2) {
        // Use 2-layer stack
        const floor = FLOOR_PIECES.twoLayer.find(f => f.material === material) || FLOOR_PIECES.twoLayer[0];
        components.push(floor);
    } else if (stories === 3) {
        // Try 3-layer tower first, or stack 2+1
        const tower = FLOOR_PIECES.threeLayer.find(f => f.material === material);
        if (tower) {
            components.push(tower);
        } else {
            const floor2 = FLOOR_PIECES.twoLayer.find(f => f.material === material) || FLOOR_PIECES.twoLayer[0];
            const floor1 = FLOOR_PIECES.single.find(f => f.material === material) || FLOOR_PIECES.single[0];
            components.push(floor2, floor1);
        }
    } else if (stories === 4) {
        // Stack two 2-layer pieces
        const floor = FLOOR_PIECES.twoLayer.find(f => f.material === material) || FLOOR_PIECES.twoLayer[0];
        components.push(floor, floor);
    } else if (stories >= 5) {
        // Stack 3-layer + 2-layer
        const tower = FLOOR_PIECES.threeLayer[0];
        const floor = FLOOR_PIECES.twoLayer.find(f => f.material === material) || FLOOR_PIECES.twoLayer[0];
        components.push(tower, floor);
    }
    
    // Add roof based on style
    let roofId;
    if (roofStyle === 'terracotta') {
        roofId = ROOF_PIECES.terracotta[0];
    } else if (roofStyle === 'angled') {
        roofId = ROOF_PIECES.redAngled[0];
    } else if (roofStyle === 'grey') {
        roofId = ROOF_PIECES.greyFlat[0];
    } else {
        roofId = ROOF_PIECES.beigeFlat[0];
    }
    
    components.push({ id: roofId, type: 'roof' });
    
    return components;
}

/**
 * Get all available materials
 */
function getAvailableMaterials() {
    return ['beige', 'red_brick', 'blue', 'green', 'orange', 'grey', 'brown', 'multi'];
}

/**
 * Get all available roof styles
 */
function getAvailableRoofStyles() {
    return ['flat', 'terracotta', 'angled', 'grey'];
}

/**
 * Check if a sprite is a complete building
 */
function isCompleteBuilding(spriteId) {
    return COMPLETE_BUILDINGS.some(b => b.id === spriteId);
}

/**
 * Check if a sprite is a floor piece
 */
function isFloorPiece(spriteId) {
    return FLOOR_PIECES.single.some(f => f.id === spriteId) ||
           FLOOR_PIECES.twoLayer.some(f => f.id === spriteId) ||
           FLOOR_PIECES.threeLayer.some(f => f.id === spriteId) ||
           FLOOR_PIECES.corners.some(f => f.id === spriteId);
}

/**
 * Check if a sprite is a roof piece
 */
function isRoofPiece(spriteId) {
    return ROOF_PIECES.beigeFlat.includes(spriteId) ||
           ROOF_PIECES.terracotta.includes(spriteId) ||
           ROOF_PIECES.redAngled.includes(spriteId) ||
           ROOF_PIECES.greyFlat.includes(spriteId);
}
