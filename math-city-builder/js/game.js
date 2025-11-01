// MATH CITY BUILDER - MAIN GAME ENGINE 🎮
// Let's build a fucking EMPIRE through MATH! 💪

// Game State - Everything important lives here
const gameState = {
    dollars: 500000,           // 💰 HALF A MILLION FOR TESTING! LET'S GO! 💰
    xp: 0,                     // Experience points
    level: 1,                  // Player level
    cityValue: 0,              // Total value of all buildings
    selectedBuilding: null,    // Currently selected building to place
    placedBuildings: [],       // All buildings in the city
    demolishMode: false,       // Demolish mode active?
    buildingMode: 'base',      // 🆕 Building mode: 'base', 'floors', or 'roofs'
    
    // Quiz stats
    correctAnswers: 0,
    wrongAnswers: 0,
    streak: 0,
    currentMathType: 'mult-1-12', // Default math type
    
    // Milestones reached
    milestones: {
        thousand: false,
        tenThousand: false,
        hundredThousand: false,
        million: false
    }
};

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 MATH CITY BUILDER - LOADING...');
    
    initializeCanvas();
    initializeGrid();
    loadBuildings();
    setupEventListeners();
    updateUI();
    
    console.log('✅ GAME READY! Let\'s build a MILLION DOLLAR CITY! 💰🏙️');
});

// Setup all event listeners
function setupEventListeners() {
    // Building Mode Tabs - THE NEW HOTNESS! 🔥
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.mode;
            switchBuildingMode(mode);
        });
    });
    
    // Earn Dollars button - THE MONEY MAKER!
    document.getElementById('earn-dollars-btn').addEventListener('click', () => {
        showQuizModal();
    });
    
    // Math type selector
    document.getElementById('math-type-select').addEventListener('change', (e) => {
        gameState.currentMathType = e.target.value;
        console.log(`📚 Switched to: ${e.target.value}`);
    });
    
    // Demolish mode toggle
    document.getElementById('demolish-btn').addEventListener('click', () => {
        gameState.demolishMode = !gameState.demolishMode;
        const btn = document.getElementById('demolish-btn');
        if (gameState.demolishMode) {
            btn.textContent = '🔨 Demolish Mode: ON';
            btn.style.background = 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)';
        } else {
            btn.textContent = '🔨 Demolish Mode (50% refund)';
            btn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        }
    });
    
    // Save game
    document.getElementById('save-btn').addEventListener('click', () => {
        saveGame();
    });
    
    // Reset game button - direct reset (no modal)
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('⚠️ RESET GAME?\n\nThis will DELETE your entire city, all buildings, dollars, and progress!\n\nAre you sure?')) {
                resetGame();
            }
        });
    }
    
    // Canvas controls
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        adjustZoom(1.2);
    });
    
    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        adjustZoom(0.8);
    });
    
    document.getElementById('pan-reset-btn').addEventListener('click', () => {
        resetView();
    });
    
    // Toggle building labels
    document.getElementById('toggle-labels-btn').addEventListener('click', () => {
        showBuildingLabels = !showBuildingLabels;
        const btn = document.getElementById('toggle-labels-btn');
        btn.textContent = showBuildingLabels ? '🏷️ Labels: ON' : '🏷️ Labels: OFF';
        renderCanvas();
    });
    
    // Canvas click for building placement
    const canvas = document.getElementById('game-canvas');
    canvas.addEventListener('click', (e) => {
        handleCanvasClick(e);
    });
}

// Switch between building modes (base, floors, roofs)
function switchBuildingMode(mode) {
    console.log(`🔄 Switching to ${mode} mode`);
    gameState.buildingMode = mode;
    
    // Update tab visual state
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
        if (tab.dataset.mode === mode) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Clear current selection
    gameState.selectedBuilding = null;
    
    // Hide/show appropriate building sections based on mode
    const buildingTiers = document.querySelectorAll('.building-tier');
    
    // Remove any existing floor/roof selectors
    const existingFloorSelector = document.getElementById('floor-selector');
    const existingRoofSelector = document.getElementById('roof-selector');
    if (existingFloorSelector) existingFloorSelector.remove();
    if (existingRoofSelector) existingRoofSelector.remove();
    
    if (mode === 'base') {
        // Show all normal building tiers
        buildingTiers.forEach(tier => tier.style.display = 'block');
        console.log('📦 BASE MODE: Place new buildings');
    } else if (mode === 'floors') {
        // Hide tiers, we'll show floor pieces only
        buildingTiers.forEach(tier => tier.style.display = 'none');
        console.log('📚 FLOOR MODE: Add second stories ($50 each)');
        showFloorPieces();
    } else if (mode === 'roofs') {
        // Hide tiers, show roof pieces only
        buildingTiers.forEach(tier => tier.style.display = 'none');
        console.log('🎩 ROOF MODE: Top off buildings (FREE!)');
        showRoofPieces();
    }
    
    renderCanvas();
}

// Show floor pieces for adding stories
function showFloorPieces() {
    console.log('🏗️ Building floor piece selector...');
    
    // Find the building selector container (where tiers normally go)
    const sidePanel = document.querySelector('.side-panel');
    
    // Remove any existing floor selector
    const existingSelector = document.getElementById('floor-selector');
    if (existingSelector) existingSelector.remove();
    
    // Create floor selector container
    const floorSelector = document.createElement('div');
    floorSelector.id = 'floor-selector';
    floorSelector.style.padding = '15px';
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.style.background = 'rgba(243, 156, 18, 0.1)';
    instructions.style.padding = '10px';
    instructions.style.borderRadius = '5px';
    instructions.style.marginBottom = '15px';
    instructions.innerHTML = `
        <h3 style="margin: 0 0 5px 0; color: #e67e22;">📚 Add Floor Pieces ($50 each)</h3>
        <p style="margin: 0; font-size: 13px; color: #555;">
            Click a floor piece to select it, then click on an existing building to add a floor!<br>
            <strong>${FLOOR_PIECES.all.length} stackable floor pieces</strong> - curated by YOU! 🎯
        </p>
    `;
    floorSelector.appendChild(instructions);
    
    // ALL FLOOR PIECES section
    const allSection = createFloorSection(
        '�️ Stackable Floor Pieces',
        FLOOR_PIECES.all,
        'Your hand-picked stackable floors - no brown bases!'
    );
    floorSelector.appendChild(allSection);
    
    // Insert after the mode tabs
    const modeTabs = document.querySelector('.building-mode-tabs');
    modeTabs.after(floorSelector);
    
    console.log('✅ Floor selector created with', FLOOR_PIECES.all.length, 'floor pieces!');
}

// Helper function to create a floor section
function createFloorSection(title, pieces, description) {
    const section = document.createElement('div');
    section.style.marginBottom = '20px';
    section.style.padding = '10px';
    section.style.background = 'rgba(255, 255, 255, 0.5)';
    section.style.borderRadius = '5px';
    
    // Section header
    const header = document.createElement('h4');
    header.textContent = title;
    header.style.margin = '0 0 5px 0';
    header.style.color = '#2c3e50';
    section.appendChild(header);
    
    // Description
    const desc = document.createElement('p');
    desc.textContent = description;
    desc.style.margin = '0 0 10px 0';
    desc.style.fontSize = '12px';
    desc.style.color = '#666';
    section.appendChild(desc);
    
    // Grid for floor pieces
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
    grid.style.gap = '8px';
    
    // Add each floor piece
    pieces.forEach(piece => {
        const card = document.createElement('div');
        card.className = 'floor-piece-card';
        card.dataset.floorId = piece.id;
        card.style.cursor = 'pointer';
        card.style.padding = '8px';
        card.style.background = 'white';
        card.style.border = '2px solid #ddd';
        card.style.borderRadius = '4px';
        card.style.textAlign = 'center';
        card.style.transition = 'all 0.2s';
        
        // Image
        const img = document.createElement('img');
        img.src = getSpriteImagePath(piece.id);
        img.style.width = '64px';
        img.style.height = '64px';
        img.style.imageRendering = 'pixelated';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        card.appendChild(img);
        
        // Material label
        const label = document.createElement('div');
        label.textContent = piece.material;
        label.style.fontSize = '10px';
        label.style.marginTop = '4px';
        label.style.color = '#666';
        label.style.textTransform = 'capitalize';
        card.appendChild(label);
        
        // Height indicator
        if (piece.height) {
            const heightLabel = document.createElement('div');
            heightLabel.textContent = `${piece.height}× height`;
            heightLabel.style.fontSize = '9px';
            heightLabel.style.color = '#e67e22';
            heightLabel.style.fontWeight = 'bold';
            card.appendChild(heightLabel);
        }
        
        // Click handler
        card.addEventListener('click', () => selectFloorPiece(piece));
        
        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = '#f39c12';
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        card.addEventListener('mouseleave', () => {
            if (!gameState.selectedBuilding || gameState.selectedBuilding.id !== piece.id) {
                card.style.borderColor = '#ddd';
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
            }
        });
        
        grid.appendChild(card);
    });
    
    section.appendChild(grid);
    return section;
}

// Select a floor piece to place
function selectFloorPiece(piece) {
    console.log('� Selected floor piece:', piece.id, piece.material);
    
    // Store the floor piece as selectedBuilding
    gameState.selectedBuilding = {
        id: piece.id,
        type: 'floor',
        material: piece.material,
        height: piece.height,
        cost: 50 // Floor pieces cost $50
    };
    
    // Update visual selection
    document.querySelectorAll('.floor-piece-card').forEach(card => {
        if (card.dataset.floorId === piece.id) {
            card.style.borderColor = '#27ae60';
            card.style.borderWidth = '3px';
            card.style.background = 'rgba(39, 174, 102, 0.1)';
        } else {
            card.style.borderColor = '#ddd';
            card.style.borderWidth = '2px';
            card.style.background = 'white';
        }
    });
    
    console.log('💡 Now click on a building to add this floor!');
}

// Show roof pieces for topping buildings
function showRoofPieces() {
    console.log('🎩 Building roof piece selector...');
    
    // Remove any existing roof selector
    const existingSelector = document.getElementById('roof-selector');
    if (existingSelector) existingSelector.remove();
    
    // Create roof selector container
    const roofSelector = document.createElement('div');
    roofSelector.id = 'roof-selector';
    roofSelector.style.padding = '15px';
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.style.background = 'rgba(46, 204, 113, 0.1)';
    instructions.style.padding = '10px';
    instructions.style.borderRadius = '5px';
    instructions.style.marginBottom = '15px';
    instructions.innerHTML = `
        <h3 style="margin: 0 0 5px 0; color: #27ae60;">🎩 Add Roof Pieces (FREE!)</h3>
        <p style="margin: 0; font-size: 13px; color: #555;">
            Click a roof piece to select it, then click on a building to cap it off!<br>
            <strong>${ROOF_PIECES.all.length} roof pieces</strong> - curated by YOU! 🎯
        </p>
    `;
    roofSelector.appendChild(instructions);
    
    // ALL ROOF PIECES section
    const allSection = createFloorSection(
        '🏠 Roof Pieces (Flat, Terracotta, Angled)',
        ROOF_PIECES.all,
        'Your hand-picked roofs - top off those buildings in style!'
    );
    roofSelector.appendChild(allSection);
    
    // Insert after the mode tabs
    const modeTabs = document.querySelector('.building-mode-tabs');
    modeTabs.after(roofSelector);
    
    console.log('✅ Roof selector created with', ROOF_PIECES.all.length, 'roof pieces!');
}

// Update all UI elements
function updateUI() {
    document.getElementById('dollars').textContent = gameState.dollars;
    document.getElementById('xp').textContent = gameState.xp;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('city-value').textContent = `$${gameState.cityValue.toLocaleString()}`;
}

// Add dollars (with animation!)
function addDollars(amount) {
    gameState.dollars += amount;
    
    // Animate the counter!
    const dollarsEl = document.getElementById('dollars');
    dollarsEl.style.transform = 'scale(1.3)';
    dollarsEl.style.color = '#2ecc71';
    
    setTimeout(() => {
        dollarsEl.style.transform = 'scale(1)';
        dollarsEl.style.color = '#2ecc71';
    }, 300);
    
    updateUI();
    checkMilestones();
}

// Add XP (levels up the player!)
function addXP(amount) {
    gameState.xp += amount;
    
    // Check for level up (100 XP per level)
    const newLevel = Math.floor(gameState.xp / 100) + 1;
    if (newLevel > gameState.level) {
        levelUp(newLevel);
    }
    
    updateUI();
}

// LEVEL UP! 🎉
function levelUp(newLevel) {
    gameState.level = newLevel;
    
    showAchievement(`🎉 LEVEL UP! You're now Level ${newLevel}!`, 3000);
    
    // Bonus dollars for leveling up!
    const bonus = newLevel * 50;
    addDollars(bonus);
    
    console.log(`🎊 LEVEL ${newLevel} REACHED! Bonus: $${bonus}`);
}

// Check if player hit any milestones
function checkMilestones() {
    const value = gameState.cityValue;
    
    // $1,000 Milestone - BRONZE!
    if (value >= 1000 && !gameState.milestones.thousand) {
        gameState.milestones.thousand = true;
        showMilestone(
            '🥉 THOUSAND DOLLAR TOWN!',
            'Your city is worth $1,000! Keep building!',
            '$100 Bonus!'
        );
        addDollars(100);
    }
    
    // $10,000 Milestone - SILVER!
    if (value >= 10000 && !gameState.milestones.tenThousand) {
        gameState.milestones.tenThousand = true;
        showMilestone(
            '🥈 TEN THOUSAND DOLLAR DISTRICT!',
            'Your city is worth $10,000! You\'re becoming a real city planner!',
            '$1,000 Bonus!'
        );
        addDollars(1000);
    }
    
    // $100,000 Milestone - GOLD!
    if (value >= 100000 && !gameState.milestones.hundredThousand) {
        gameState.milestones.hundredThousand = true;
        showMilestone(
            '🥇 HUNDRED THOUSAND DOLLAR CITY!',
            'Your city is worth $100,000! This is a MAJOR city!',
            '$10,000 Bonus!'
        );
        addDollars(10000);
    }
    
    // $1,000,000 Milestone - DIAMOND! THE BIG ONE!
    if (value >= 1000000 && !gameState.milestones.million) {
        gameState.milestones.million = true;
        showMilestone(
            '💎 MILLION DOLLAR METROPOLIS!',
            '🎉 CONGRATULATIONS! You built a MILLION DOLLAR CITY! 🎉',
            '$100,000 MEGA BONUS!'
        );
        addDollars(100000);
    }
}

// Show achievement popup
function showAchievement(text, duration = 3000) {
    const popup = document.getElementById('achievement-popup');
    const textEl = document.getElementById('achievement-text');
    
    textEl.textContent = text;
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, duration);
}

// Show milestone modal
function showMilestone(title, message, reward) {
    const modal = document.getElementById('milestone-modal');
    document.getElementById('milestone-title').textContent = title;
    document.getElementById('milestone-message').textContent = message;
    document.getElementById('milestone-reward').textContent = reward;
    
    modal.classList.remove('hidden');
    
    document.getElementById('close-milestone-btn').onclick = () => {
        modal.classList.add('hidden');
    };
}

// Handle canvas clicks (place or demolish buildings)
function handleCanvasClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert screen coordinates to grid coordinates
    const gridPos = screenToGrid(x, y);
    
    if (gameState.demolishMode) {
        demolishBuilding(gridPos);
    } else if (gameState.selectedBuilding) {
        // Check building mode to determine action
        if (gameState.buildingMode === 'floors') {
            addFloorToBuilding(gridPos);
        } else if (gameState.buildingMode === 'roofs') {
            addRoofToBuilding(gridPos);
        } else {
            // Normal base building placement
            placeBuilding(gridPos);
        }
    }
}

// Place a building at grid position
function placeBuilding(gridPos) {
    if (!gameState.selectedBuilding) return;
    
    const building = gameState.selectedBuilding;
    
    // Check if can afford
    if (gameState.dollars < building.cost) {
        showAchievement('❌ Not enough dollars!', 2000);
        return;
    }
    
    // Check if spot is occupied
    if (isCellOccupied(gridPos.x, gridPos.y)) {
        showAchievement('❌ That spot is already occupied!', 2000);
        return;
    }
    
    // PLACE IT!
    gameState.dollars -= building.cost;
    gameState.cityValue += building.value;
    
    gameState.placedBuildings.push({
        ...building,
        x: gridPos.x,
        y: gridPos.y
    });
    
    // Add XP for placing building
    addXP(10);
    
    showAchievement(`✅ Placed ${building.name} for $${building.cost}!`, 2000);
    
    updateUI();
    renderCanvas();
    
    console.log(`🏗️ Placed: ${building.name} at (${gridPos.x}, ${gridPos.y})`);
}

// Demolish a building (50% refund)
function demolishBuilding(gridPos) {
    const buildingIndex = gameState.placedBuildings.findIndex(
        b => b.x === gridPos.x && b.y === gridPos.y
    );
    
    if (buildingIndex === -1) {
        showAchievement('❌ No building here to demolish!', 2000);
        return;
    }
    
    const building = gameState.placedBuildings[buildingIndex];
    const refund = Math.floor(building.cost * 0.5);
    
    gameState.dollars += refund;
    gameState.cityValue -= building.value;
    gameState.placedBuildings.splice(buildingIndex, 1);
    
    showAchievement(`🔨 Demolished ${building.name}! Refund: $${refund}`, 2000);
    
    updateUI();
    renderCanvas();
    
    console.log(`💥 Demolished: ${building.name}, refunded $${refund}`);
}

// Add a floor piece to an existing building
function addFloorToBuilding(gridPos) {
    if (!gameState.selectedBuilding) return;
    
    const floorPiece = gameState.selectedBuilding;
    const FLOOR_COST = 50;
    
    // Check if can afford
    if (gameState.dollars < FLOOR_COST) {
        showAchievement('❌ Not enough dollars! Floors cost $50', 2000);
        return;
    }
    
    // Find existing building at this location
    const existingBuilding = gameState.placedBuildings.find(
        b => b.x === gridPos.x && b.y === gridPos.y && b.tier > 0
    );
    
    if (!existingBuilding) {
        showAchievement('❌ No building here! Place a floor on an existing building', 2000);
        return;
    }
    
    // Check if building already has a roof
    if (existingBuilding.hasRoof) {
        showAchievement('❌ This building has a roof! Remove it first', 2000);
        return;
    }
    
    // Add the floor!
    gameState.dollars -= FLOOR_COST;
    
    // Initialize floors array if it doesn't exist
    if (!existingBuilding.floors) {
        existingBuilding.floors = [];
    }
    
    // Add this floor piece ID (canvas.js expects just the string ID)
    existingBuilding.floors.push(floorPiece.id);
    
    // Increase building value
    const addedValue = FLOOR_COST * 1.5; // Floors add 1.5x their cost in value
    gameState.cityValue += addedValue;
    existingBuilding.value += addedValue;
    
    // Add XP
    addXP(5);
    
    showAchievement(`✅ Added floor to ${existingBuilding.name}! (-$${FLOOR_COST})`, 2000);
    
    updateUI();
    renderCanvas();
}

// Add a roof piece to an existing building
function addRoofToBuilding(gridPos) {
    if (!gameState.selectedBuilding) return;
    
    const roofPiece = gameState.selectedBuilding;
    
    // Find existing building at this location
    const existingBuilding = gameState.placedBuildings.find(
        b => b.x === gridPos.x && b.y === gridPos.y && b.tier > 0
    );
    
    if (!existingBuilding) {
        showAchievement('❌ No building here! Place a roof on an existing building', 2000);
        return;
    }
    
    // Check if building already has a roof
    if (existingBuilding.hasRoof) {
        showAchievement('❌ This building already has a roof!', 2000);
        return;
    }
    
    // Add the roof! (FREE!)
    existingBuilding.hasRoof = true;
    existingBuilding.roofId = roofPiece.id;
    existingBuilding.roofStyle = roofPiece.style;
    existingBuilding.roofColor = roofPiece.color;
    
    // Roofs add a small value bonus
    const addedValue = 25;
    gameState.cityValue += addedValue;
    existingBuilding.value += addedValue;
    
    // Add XP
    addXP(3);
    
    showAchievement(`✅ Added ${roofPiece.color} ${roofPiece.style} roof! (FREE!)`, 2000);
    
    updateUI();
    renderCanvas();
    
    console.log(`🎩 Added roof ${roofPiece.id} to building at (${gridPos.x}, ${gridPos.y})`);
}

// Check if a grid cell is occupied
// Check if a cell is occupied by a non-decoration building
function isCellOccupied(x, y) {
    // Allow decorations (tier 0) to stack on same cell
    return gameState.placedBuildings.some(b => b.x === x && b.y === y && b.tier > 0);
}

// Save game to localStorage
function saveGame(showNotification = true) {
    const saveData = {
        gameState: gameState,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('mathCityBuilder_save', JSON.stringify(saveData));
    
    if (showNotification) {
        showAchievement('💾 Game saved!', 2000);
    }
    console.log('💾 Game saved successfully!');
}

// Load game from localStorage
function loadGame() {
    const saveData = localStorage.getItem('mathCityBuilder_save');
    
    if (saveData) {
        const parsed = JSON.parse(saveData);
        Object.assign(gameState, parsed.gameState);
        
        updateUI();
        renderCanvas();
        
        console.log('📂 Game loaded!');
        showAchievement('📂 Game loaded!', 2000);
    }
}

// Show reset confirmation modal
function showResetConfirmation() {
    document.getElementById('reset-modal').classList.remove('hidden');
    console.log('⚠️ Reset confirmation shown');
}
// Initialize terrain with default grass tiles
function initializeTerrain() {
    // Fill a 40x40 area with grass (centered on 0,0)
    for (let x = -20; x < 20; x++) {
        for (let y = -20; y < 20; y++) {
            gameState.terrain.set(`${x},${y}`, { 
                type: 'grass', 
                elevation: 0 
            });
        }
    }
    console.log('🌱 Terrain initialized: 1600 grass tiles');
}

// RESET GAME - Nuclear option! 💥
function resetGame() {
    // Reset ALL game state to defaults
    gameState.dollars = 500000;  // 💰 MATCH THE INITIAL TEST AMOUNT!
    gameState.xp = 0;
    gameState.level = 1;
    gameState.cityValue = 0;
    gameState.selectedBuilding = null;
    gameState.placedBuildings = [];
    gameState.demolishMode = false;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.streak = 0;
    gameState.currentMathType = 'mult-1-12';
    gameState.milestones = {
        thousand: false,
        tenThousand: false,
        hundredThousand: false,
        million: false
    };
    
    // NEW: Reset terrain and roads
    gameState.terrain.clear();
    gameState.roads.clear();
    initializeTerrain(); // Refill with default grass
    
    // Clear localStorage
    localStorage.removeItem('mathCityBuilder_save');
    
    // Deselect all buildings
    document.querySelectorAll('.building-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Reset UI
    updateUI();
    renderCanvas();
    
    // Show confirmation
    // Show confirmation
    showAchievement('🔄 Game reset! Starting fresh with $100!', 3000);
    
    console.log('💥 GAME RESET! Fresh start!');
}

// Auto-save every 30 seconds (silently, no popup)
setInterval(() => {
    saveGame(false); // false = don't show notification
}, 30000);
// Try to load saved game on start
setTimeout(() => {
    const hasSave = localStorage.getItem('mathCityBuilder_save');
    if (hasSave) {
        if (confirm('Found a saved game! Load it?')) {
            loadGame();
        }
    }
}, 1000);

console.log('🎮 Game.js loaded! Ready to BUILD! 💪');
