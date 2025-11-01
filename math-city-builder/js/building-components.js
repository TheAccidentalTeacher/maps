// BUILDING COMPONENTS SYSTEM 🏗️
// Proper fucking categorization of 129 building sprites

// TIER LOCATIONS - Maps sprite IDs to their tier folder locations
// This is needed because the assets are spread across tier1-tier5 folders
const SPRITE_TIER_MAP = {
    // Parse number from ID and map to tier
    // For simplicity, most floor/roof pieces are in multiple tiers, so we'll check tier2-5
};

// Helper function to get the correct path for any building sprite
function getSpriteImagePath(spriteId) {
    // Extract the number from buildingTiles_XXX
    const match = spriteId.match(/buildingTiles_(\d+)/);
    if (!match) return null;
    
    const num = parseInt(match[1]);
    
    // Tier mapping based on sprite number ranges
    // This matches how the assets were actually organized
    if (num <= 25) return `../assets/math-city-builder/buildings/tier1/${spriteId}.png`;
    if (num <= 56) return `../assets/math-city-builder/buildings/tier2/${spriteId}.png`;
    if (num <= 92) return `../assets/math-city-builder/buildings/tier3/${spriteId}.png`;
    if (num <= 106) return `../assets/math-city-builder/buildings/tier4/${spriteId}.png`;
    return `../assets/math-city-builder/buildings/tier5/${spriteId}.png`;
}

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
// FLOOR PIECES (29 sprites) - USER CURATED! These are confirmed stackable! 🏗️
// ==========================================================================
const FLOOR_PIECES = {
    // All stackable floor pieces - different colors, window placements, etc.
    all: [
        { id: 'buildingTiles_000', material: 'beige', description: 'Beige with windows' },
        { id: 'buildingTiles_002', material: 'blue', description: 'Blue with windows' },
        { id: 'buildingTiles_007', material: 'beige', description: 'Beige variant' },
        { id: 'buildingTiles_008', material: 'blue', description: 'Blue variant' },
        { id: 'buildingTiles_015', material: 'beige', description: 'Beige multi-window' },
        { id: 'buildingTiles_016', material: 'red_brick', description: 'Red brick' },
        { id: 'buildingTiles_023', material: 'beige', description: 'Beige wide' },
        { id: 'buildingTiles_024', material: 'blue', description: 'Blue wide' },
        { id: 'buildingTiles_031', material: 'blue', description: 'Blue corner' },
        { id: 'buildingTiles_032', material: 'beige', description: 'Beige corner' },
        { id: 'buildingTiles_038', material: 'beige', description: 'Beige section' },
        { id: 'buildingTiles_039', material: 'beige', description: 'Beige section alt' },
        { id: 'buildingTiles_040', material: 'red_brick', description: 'Red brick section' },
        { id: 'buildingTiles_043', material: 'beige', description: 'Beige multi-section' },
        { id: 'buildingTiles_044', material: 'beige', description: 'Beige large' },
        { id: 'buildingTiles_045', material: 'red_brick', description: 'Red brick large' },
        { id: 'buildingTiles_047', material: 'beige', description: 'Beige tower section' },
        { id: 'buildingTiles_048', material: 'beige', description: 'Beige tower alt' },
        { id: 'buildingTiles_049', material: 'red_brick', description: 'Red brick tower' },
        { id: 'buildingTiles_050', material: 'beige', description: 'Beige apartment section' },
        { id: 'buildingTiles_051', material: 'beige', description: 'Beige apartment alt' },
        { id: 'buildingTiles_052', material: 'red_brick', description: 'Red brick apartment' },
        { id: 'buildingTiles_053', material: 'beige', description: 'Beige office section' },
        { id: 'buildingTiles_054', material: 'red_brick', description: 'Red brick office' },
        { id: 'buildingTiles_055', material: 'beige', description: 'Beige commercial' },
        { id: 'buildingTiles_056', material: 'beige', description: 'Beige commercial alt' },
        { id: 'buildingTiles_067', material: 'terracotta', description: 'Terracotta roof section' },
        { id: 'buildingTiles_069', material: 'red', description: 'Red angled section' },
        { id: 'buildingTiles_091', material: 'pink', description: 'Pink variant' }
    ]
};

// ==========================================================================
// ROOF PIECES (54 sprites) - USER CURATED! Top off your buildings! 🎩
// ==========================================================================
const ROOF_PIECES = {
    // All roof pieces - your hand-picked selection!
    all: [
        { id: 'buildingTiles_005', style: 'flat', color: 'beige', description: 'Beige flat roof' },
        { id: 'buildingTiles_006', style: 'flat', color: 'beige', description: 'Beige flat variant' },
        { id: 'buildingTiles_013', style: 'flat', color: 'beige', description: 'Beige flat large' },
        { id: 'buildingTiles_057', style: 'flat', color: 'beige', description: 'Beige flat section' },
        { id: 'buildingTiles_058', style: 'flat', color: 'beige', description: 'Beige flat section 2' },
        { id: 'buildingTiles_059', style: 'flat', color: 'beige', description: 'Beige flat section 3' },
        { id: 'buildingTiles_060', style: 'flat', color: 'beige', description: 'Beige flat section 4' },
        { id: 'buildingTiles_061', style: 'flat', color: 'beige', description: 'Beige flat section 5' },
        { id: 'buildingTiles_062', style: 'terracotta', color: 'orange', description: 'Orange terracotta' },
        { id: 'buildingTiles_063', style: 'flat', color: 'beige', description: 'Beige flat 6' },
        { id: 'buildingTiles_064', style: 'flat', color: 'beige', description: 'Beige flat 7' },
        { id: 'buildingTiles_065', style: 'terracotta', color: 'orange', description: 'Orange terracotta 2' },
        { id: 'buildingTiles_066', style: 'terracotta', color: 'orange', description: 'Orange terracotta 3' },
        { id: 'buildingTiles_067', style: 'flat', color: 'beige', description: 'Beige flat 8' },
        { id: 'buildingTiles_068', style: 'flat', color: 'beige', description: 'Beige flat 9' },
        { id: 'buildingTiles_069', style: 'angled', color: 'red', description: 'Red angled roof' },
        { id: 'buildingTiles_070', style: 'terracotta', color: 'orange', description: 'Orange terracotta 4' },
        { id: 'buildingTiles_071', style: 'terracotta', color: 'orange', description: 'Orange terracotta 5' },
        { id: 'buildingTiles_072', style: 'flat', color: 'beige', description: 'Beige flat 10' },
        { id: 'buildingTiles_073', style: 'flat', color: 'beige', description: 'Beige flat 11' },
        { id: 'buildingTiles_074', style: 'angled', color: 'red', description: 'Red angled 2' },
        { id: 'buildingTiles_075', style: 'angled', color: 'red', description: 'Red angled 3' },
        { id: 'buildingTiles_076', style: 'terracotta', color: 'orange', description: 'Orange terracotta 6' },
        { id: 'buildingTiles_077', style: 'terracotta', color: 'orange', description: 'Orange terracotta 7' },
        { id: 'buildingTiles_079', style: 'flat', color: 'grey', description: 'Grey flat modern' },
        { id: 'buildingTiles_080', style: 'angled', color: 'red', description: 'Red angled 4' },
        { id: 'buildingTiles_081', style: 'angled', color: 'red', description: 'Red angled 5' },
        { id: 'buildingTiles_082', style: 'terracotta', color: 'orange', description: 'Orange terracotta 8' },
        { id: 'buildingTiles_083', style: 'flat', color: 'beige', description: 'Beige flat 12' },
        { id: 'buildingTiles_084', style: 'flat', color: 'beige', description: 'Beige flat 13' },
        { id: 'buildingTiles_086', style: 'flat', color: 'grey', description: 'Grey flat 2' },
        { id: 'buildingTiles_087', style: 'flat', color: 'grey', description: 'Grey flat 3' },
        { id: 'buildingTiles_088', style: 'angled', color: 'red', description: 'Red angled 6' },
        { id: 'buildingTiles_089', style: 'angled', color: 'red', description: 'Red angled 7' },
        { id: 'buildingTiles_090', style: 'angled', color: 'red', description: 'Red angled 8' },
        { id: 'buildingTiles_091', style: 'angled', color: 'pink', description: 'Pink angled' },
        { id: 'buildingTiles_094', style: 'flat', color: 'beige', description: 'Beige flat 14' },
        { id: 'buildingTiles_095', style: 'flat', color: 'grey', description: 'Grey flat 4' },
        { id: 'buildingTiles_096', style: 'flat', color: 'grey', description: 'Grey flat 5' },
        { id: 'buildingTiles_097', style: 'angled', color: 'red', description: 'Red angled 9' },
        { id: 'buildingTiles_098', style: 'angled', color: 'red', description: 'Red angled 10' },
        { id: 'buildingTiles_103', style: 'flat', color: 'beige', description: 'Beige flat 15' },
        { id: 'buildingTiles_104', style: 'flat', color: 'beige', description: 'Beige flat 16' },
        { id: 'buildingTiles_105', style: 'flat', color: 'beige', description: 'Beige flat 17' },
        { id: 'buildingTiles_110', style: 'flat', color: 'beige', description: 'Beige flat 18' },
        { id: 'buildingTiles_111', style: 'flat', color: 'beige', description: 'Beige flat 19' },
        { id: 'buildingTiles_112', style: 'flat', color: 'beige', description: 'Beige flat 20' },
        { id: 'buildingTiles_118', style: 'flat', color: 'beige', description: 'Beige flat corner' },
        { id: 'buildingTiles_119', style: 'flat', color: 'brown', description: 'Brown flat' },
        { id: 'buildingTiles_120', style: 'flat', color: 'beige', description: 'Beige flat tower' },
        { id: 'buildingTiles_121', style: 'flat', color: 'beige', description: 'Beige flat corner 2' },
        { id: 'buildingTiles_126', style: 'flat', color: 'beige', description: 'Beige flat special' },
        { id: 'buildingTiles_127', style: 'flat', color: 'beige', description: 'Beige flat special 2' },
        { id: 'buildingTiles_128', style: 'flat', color: 'beige', description: 'Beige flat special 3' }
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
 * Check if a sprite is a floor piece
 */
function isFloorPiece(spriteId) {
    return FLOOR_PIECES.all.some(f => f.id === spriteId);
}

/**
 * Check if a sprite is a roof piece
 */
function isRoofPiece(spriteId) {
    return ROOF_PIECES.all.some(r => r.id === spriteId);
}

/**
 * Get all available materials from floor pieces
 */
function getAvailableMaterials() {
    const materials = [...new Set(FLOOR_PIECES.all.map(f => f.material))];
    return materials;
}

/**
 * Get all available roof styles
 */
function getAvailableRoofStyles() {
    const styles = [...new Set(ROOF_PIECES.all.map(r => r.style))];
    return styles;
}

/**
 * Get all available roof colors
 */
function getAvailableRoofColors() {
    const colors = [...new Set(ROOF_PIECES.all.map(r => r.color))];
    return colors;
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
