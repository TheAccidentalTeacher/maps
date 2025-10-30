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
    
    // Reset game button - show confirmation modal
    document.getElementById('reset-btn').addEventListener('click', () => {
        showResetConfirmation();
    });
    
    // Reset confirmation handlers
    document.getElementById('confirm-reset-btn').addEventListener('click', () => {
        resetGame();
        document.getElementById('reset-modal').classList.add('hidden');
    });
    
    document.getElementById('cancel-reset-btn').addEventListener('click', () => {
        document.getElementById('reset-modal').classList.add('hidden');
    });
    
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
        placeBuilding(gridPos);
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

// Check if a grid cell is occupied
function isCellOccupied(x, y) {
    return gameState.placedBuildings.some(b => b.x === x && b.y === y);
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

// RESET GAME - Nuclear option! 💥
function resetGame() {
    // Reset ALL game state to defaults
    gameState.dollars = 100;
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
