# Math City Builder - Complete 2D Development Plan (Part 1)

**Project:** 2D Isometric Math City Builder  
**Target:** Elementary → High School Students (Scalable Math System)  
**Tech Stack:** HTML5 Canvas + Vanilla JavaScript + Supabase  
**Timeline:** 5-7 days for MVP  
**Cost:** $0  

**🔄 UPDATED:** Currency changed from "coins" to "dollars" ($) for scalability  
**📊 Economy Goal:** Build toward "Million Dollar City" through progressive math mastery  
**📚 Math Scope:** Elementary multiplication → Geometry proofs (fully expandable)

---

## Table of Contents

1. [Phase 0: Asset Preparation](#phase-0-asset-preparation) (1 hour)
2. [Phase 1: Core Canvas Setup](#phase-1-core-canvas-setup) (Day 1)
3. [Phase 2: Grid System](#phase-2-grid-system) (Day 1-2)
4. [Phase 3: Building Placement](#phase-3-building-placement) (Day 2)
5. [Phase 4: Math Quiz System](#phase-4-math-quiz-system) (Day 3)
6. [Phase 5: Game Economy](#phase-5-game-economy) (Day 3-4)
7. [Phase 6: Supabase Integration](#phase-6-supabase-integration) (Day 4-5)
8. [Phase 7: UI Polish](#phase-7-ui-polish) (Day 5-6)
9. [Phase 8: Testing & Deployment](#phase-8-testing--deployment) (Day 6-7)

---

# Phase 0: Asset Preparation

**Time:** 1 hour  
**Goal:** Get isometric building sprites ready to use

## Why Isometric?

**You're absolutely right to want isometric!** Here's why:

✅ **Looks 3D but is 2D** - Buildings have depth and dimension  
✅ **Proven for city builders** - SimCity, Age of Empires, Roller Coaster Tycoon  
✅ **Easy to understand** - Kids can see all sides of buildings  
✅ **Grid-based** - Simple math for placement (no complex transforms)  
✅ **Professional look** - Better than flat top-down view  

**Comparison:**

| View Type | Pros | Cons |
|-----------|------|------|
| **Top-Down** | Simple to render | Flat, boring, can't see building fronts |
| **Side View** | Like platformer | Can only see one side, not good for city |
| **Isometric** | ✅ 3D look, clear view, professional | Slightly harder math (but I'll handle it) |
| **True 3D** | Most realistic | TOO HARD (we tried this!) |

**Decision: Isometric is perfect for this project.**

## Step 0.1: Download Kenney Isometric City Assets

**Where to get them:**

1. **Option A: Kenney.nl (Free!)**
   - Go to: https://kenney.nl/assets
   - Search for "isometric city"
   - Download "City Kit (Isometric)" pack
   - It's FREE (public domain CC0 license)

2. **Option B: OpenGameArt.org**
   - Backup if Kenney doesn't have what we need
   - Also free with various licenses

**What you'll get:**
- 100+ isometric building sprites (PNG files)
- Roads, parks, decorations
- Different building types (residential, commercial, industrial)
- Transparent backgrounds
- Consistent style

## Step 0.2: Organize Assets

**Create this folder structure:**

```
assets/
  math-city-builder/
    buildings/
      residential/
        house-small.png
        house-medium.png
        house-large.png
        apartment.png
      commercial/
        shop-small.png
        shop-medium.png
        restaurant.png
        mall.png
      special/
        school.png
        library.png
        park.png
        fountain.png
    roads/
      road-straight.png
      road-corner.png
      road-intersection.png
    ui/
      dollar-icon.png
      xp-icon.png
      star-icon.png
```

## Step 0.3: Asset Requirements

**What each sprite should be:**
- **Format:** PNG with transparency
- **Size:** 128×128px or 256×256px (consistent across all buildings)
- **Style:** Isometric (45° angle view)
- **Background:** Transparent (no white/colored background)
- **Naming:** Descriptive (house-small.png, not building_01.png)

## Step 0.4: Placeholder Strategy

**If you don't have sprites yet, I'll code with placeholders:**
- Colored rectangles (blue = residential, yellow = commercial, green = special)
- You can swap in real sprites later without changing code
- Allows us to start building immediately

## Actions for You

1. **Download Kenney isometric city pack** from kenney.nl
2. **Extract to** `C:\Users\scoso\WEBSITES\Mrsomersmaps\assets\math-city-builder\`
3. **Organize** sprites into residential/commercial/special folders
4. **Tell me** when ready, and I'll start coding!

**OR** just say "use placeholders" and I'll start coding immediately.

---

# Phase 1: Core Canvas Setup

**Time:** 2-3 hours (Day 1 morning)  
**Goal:** Get a blank canvas rendering in the browser

## What We're Building

A basic HTML page with a `<canvas>` element where the entire game will render.

## Step 1.1: Create Project Structure

**I'll create these files:**

```
math-city-builder/
  index.html          # Main game page
  css/
    game.css          # Styling
  js/
    game.js           # Main game logic
    canvas.js         # Canvas rendering
    grid.js           # Grid system
    buildings.js      # Building management
    quiz.js           # Math quiz system
    supabase.js       # Database integration
  assets/
    (sprites go here)
```

## Step 1.2: HTML Structure

**index.html will contain:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Math City Builder</title>
    <link rel="stylesheet" href="css/game.css">
</head>
<body>
    <!-- Game Container -->
    <div id="game-container">
        <!-- Top UI Bar -->
        <div id="ui-bar">
            <div class="stat">
                <span class="icon">💵</span>
                <span id="dollars">$0</span>
            </div>
            <div class="stat">
                <span class="icon">⭐</span>
                <span id="xp">0</span>
            </div>
            <div class="stat">
                <span class="icon">🏆</span>
                <span id="level">1</span>
            </div>
        </div>

        <!-- Main Canvas -->
        <canvas id="game-canvas"></canvas>

        <!-- Building Menu (sidebar) -->
        <div id="building-menu">
            <h3>Buildings</h3>
            <div id="building-list">
                <!-- Buildings appear here -->
            </div>
        </div>

        <!-- Quiz Modal (hidden by default) -->
        <div id="quiz-modal" class="hidden">
            <div class="modal-content">
                <h2>Math Challenge!</h2>
                <p id="quiz-question">What is 7 × 8?</p>
                <input type="number" id="quiz-answer" placeholder="Your answer">
                <button id="quiz-submit">Submit</button>
                <p id="quiz-feedback"></p>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="js/canvas.js"></script>
    <script src="js/grid.js"></script>
    <script src="js/buildings.js"></script>
    <script src="js/quiz.js"></script>
    <script src="js/supabase.js"></script>
    <script src="js/game.js"></script>
</body>
</html>
```

## Step 1.3: Canvas Initialization

**js/canvas.js will handle:**

1. **Get canvas element** from DOM
2. **Set canvas size** (fill viewport minus UI space)
3. **Get 2D context** (for drawing)
4. **Handle resizing** (when window changes size)
5. **Clear canvas** (before each frame)

**Key functions:**
```javascript
// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
}

// Make canvas responsive
function resizeCanvas() {
    canvas.width = window.innerWidth - 250; // Minus sidebar
    canvas.height = window.innerHeight - 60; // Minus top bar
}

// Clear canvas for new frame
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
```

## Step 1.4: Game Loop

**js/game.js will have the main loop:**

```javascript
// Game loop (60 FPS)
function gameLoop() {
    clearCanvas();
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

// Update game state
function updateGame() {
    // Handle input
    // Update animations
    // Check win conditions
}

// Render everything
function renderGame() {
    renderGrid();
    renderBuildings();
    renderUI();
}
```

## Step 1.5: Basic Styling

**css/game.css will include:**

- Full-screen layout (no scrolling)
- Top UI bar (fixed position)
- Canvas in center
- Building menu on right sidebar
- Modal overlay for quizzes

## Test Milestone 1.1

**What you'll see after this phase:**
- ✅ Blank canvas filling the screen
- ✅ Top bar with dollars/XP/level (showing $0, 0, 1)
- ✅ Empty sidebar for buildings
- ✅ No errors in browser console

**How to test:**
1. Open `math-city-builder/index.html` in browser
2. Press F12 (open dev console)
3. Check for errors (should be none)
4. See blank canvas (gray or white background)

---

# Phase 2: Grid System

**Time:** 3-4 hours (Day 1 afternoon)  
**Goal:** Render an isometric grid that buildings will sit on

## Why Grids Matter

**Grid-based placement is essential because:**
- Buildings snap to grid positions (no freeform dragging)
- Easy collision detection (one building per tile)
- Simple math (grid[x][y] = building)
- Clean, organized cities

## Isometric Grid Math

**Key concept:** Isometric grids look 3D but use 2D math.

**Regular square grid:**
```
[0,0] [1,0] [2,0]
[0,1] [1,1] [2,1]
[0,2] [1,2] [2,2]
```

**Isometric grid (diamond shape):**
```
     [1,0]
  [0,1] [2,1]
     [1,2]
```

**The magic formula:**
```javascript
// Convert grid position to canvas pixel position
function gridToScreen(gridX, gridY) {
    const screenX = (gridX - gridY) * tileWidth / 2;
    const screenY = (gridX + gridY) * tileHeight / 2;
    return { x: screenX, y: screenY };
}
```

## Step 2.1: Grid Configuration

**js/grid.js will define:**

```javascript
const GRID_CONFIG = {
    rows: 20,           // Number of rows
    cols: 20,           // Number of columns
    tileWidth: 64,      // Pixels (isometric diamond width)
    tileHeight: 32,     // Pixels (isometric diamond height)
    offsetX: 400,       // Center grid on canvas
    offsetY: 100        // Top padding
};
```

## Step 2.2: Grid Data Structure

**Store grid state:**

```javascript
// 2D array to track what's on each tile
let grid = [];

// Initialize empty grid
function initGrid() {
    grid = [];
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        grid[row] = [];
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            grid[row][col] = {
                building: null,     // No building yet
                terrain: 'grass'    // Default terrain type
            };
        }
    }
}
```

## Step 2.3: Render Grid Lines

**Draw isometric grid outline:**

```javascript
function renderGrid() {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;

    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            const screen = gridToScreen(col, row);
            drawIsometricTile(screen.x, screen.y);
        }
    }
}

function drawIsometricTile(x, y) {
    const w = GRID_CONFIG.tileWidth / 2;
    const h = GRID_CONFIG.tileHeight / 2;

    ctx.beginPath();
    ctx.moveTo(x, y);          // Top
    ctx.lineTo(x + w, y + h);  // Right
    ctx.lineTo(x, y + h * 2);  // Bottom
    ctx.lineTo(x - w, y + h);  // Left
    ctx.closePath();
    ctx.stroke();
}
```

## Step 2.4: Mouse to Grid Conversion

**Detect which tile the mouse is hovering over:**

```javascript
function screenToGrid(screenX, screenY) {
    // Remove offset
    screenX -= GRID_CONFIG.offsetX;
    screenY -= GRID_CONFIG.offsetY;

    // Inverse isometric formula
    const gridX = Math.floor((screenX / (GRID_CONFIG.tileWidth / 2) + 
                              screenY / (GRID_CONFIG.tileHeight / 2)) / 2);
    const gridY = Math.floor((screenY / (GRID_CONFIG.tileHeight / 2) - 
                              screenX / (GRID_CONFIG.tileWidth / 2)) / 2);

    return { x: gridX, y: gridY };
}
```

## Step 2.5: Tile Highlighting

**Show which tile mouse is over:**

```javascript
let hoveredTile = null;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    hoveredTile = screenToGrid(mouseX, mouseY);
});

function renderHoveredTile() {
    if (!hoveredTile) return;

    const screen = gridToScreen(hoveredTile.x, hoveredTile.y);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'; // Green highlight
    drawIsometricTile(screen.x, screen.y);
    ctx.fill();
}
```

## Test Milestone 2.1

**What you'll see after this phase:**
- ✅ Isometric diamond grid (20×20 tiles)
- ✅ Gray grid lines
- ✅ Green highlight on tile under mouse cursor
- ✅ Highlight moves as you move mouse

**How to test:**
1. Open game in browser
2. Move mouse over canvas
3. See green diamond highlight following cursor
4. Verify highlight snaps to grid tiles

---

# Phase 3: Building Placement

**Time:** 4-5 hours (Day 2)  
**Goal:** Click to place buildings on the grid

## What We're Building

A system where:
1. Player clicks a building in the sidebar
2. Building "follows" mouse cursor
3. Player clicks a grid tile
4. Building is placed on that tile
5. Building can't be placed if tile is occupied

## Step 3.1: Building Data Structure

**Define building types:**

```javascript
const BUILDING_TYPES = {
    'house-small': {
        id: 'house-small',
        name: 'Small House',
        cost: 10,               // Dollars to build
        xp: 5,                  // XP earned when placed
        tier: 1,                // Unlock tier
        sprite: 'assets/math-city-builder/buildings/residential/house-small.png',
        width: 1,               // Grid tiles (1×1)
        height: 1
    },
    'house-medium': {
        id: 'house-medium',
        name: 'Medium House',
        cost: 25,
        xp: 15,
        tier: 1,
        sprite: 'assets/math-city-builder/buildings/residential/house-medium.png',
        width: 1,
        height: 1
    },
    'shop-small': {
        id: 'shop-small',
        name: 'Small Shop',
        cost: 50,
        xp: 30,
        tier: 2,
        sprite: 'assets/math-city-builder/buildings/commercial/shop-small.png',
        width: 2,               // Larger building (2×2)
        height: 2
    }
    // ... more buildings
};
```

## Step 3.2: Load Building Sprites

**Preload images:**

```javascript
let buildingSprites = {};

function loadBuildingSprites() {
    Object.values(BUILDING_TYPES).forEach(building => {
        const img = new Image();
        img.src = building.sprite;
        img.onload = () => {
            buildingSprites[building.id] = img;
        };
    });
}
```

## Step 3.3: Building Menu UI

**Populate sidebar with available buildings:**

```javascript
function renderBuildingMenu() {
    const menuDiv = document.getElementById('building-list');
    menuDiv.innerHTML = '';

    Object.values(BUILDING_TYPES).forEach(building => {
        // Only show buildings player can afford and has unlocked
        if (building.tier <= playerLevel && playerDollars >= building.cost) {
            const buildingDiv = document.createElement('div');
            buildingDiv.className = 'building-item';
            buildingDiv.innerHTML = `
                <img src="${building.sprite}" alt="${building.name}">
                <p>${building.name}</p>
                <p class="cost">💵 $${building.cost}</p>
            `;
            buildingDiv.onclick = () => selectBuilding(building.id);
            menuDiv.appendChild(buildingDiv);
        }
    });
}
```

## Step 3.4: Building Selection

**Track which building is selected:**

```javascript
let selectedBuilding = null;

function selectBuilding(buildingId) {
    selectedBuilding = BUILDING_TYPES[buildingId];
    canvas.style.cursor = 'crosshair'; // Change cursor
}
```

## Step 3.5: Placement Preview

**Show ghost building following mouse:**

```javascript
function renderBuildingPreview() {
    if (!selectedBuilding || !hoveredTile) return;

    const screen = gridToScreen(hoveredTile.x, hoveredTile.y);
    const sprite = buildingSprites[selectedBuilding.id];

    if (sprite) {
        ctx.globalAlpha = 0.5; // Semi-transparent
        ctx.drawImage(sprite, screen.x - 32, screen.y - 64, 64, 64);
        ctx.globalAlpha = 1.0;
    }
}
```

## Step 3.6: Place Building

**Handle click to place:**

```javascript
canvas.addEventListener('click', (e) => {
    if (!selectedBuilding || !hoveredTile) return;

    const gridX = hoveredTile.x;
    const gridY = hoveredTile.y;

    // Check if tile is empty
    if (grid[gridY][gridX].building !== null) {
        showMessage('Tile occupied!');
        return;
    }

    // Check if player has enough dollars
    if (playerDollars < selectedBuilding.cost) {
        showMessage('Not enough dollars!');
        return;
    }

    // Place building
    placeBuilding(gridX, gridY, selectedBuilding);
});

function placeBuilding(x, y, building) {
    // Deduct cost
    playerDollars -= building.cost;
    playerXP += building.xp;

    // Add to grid
    grid[y][x].building = {
        type: building.id,
        placed: Date.now()
    };

    // Clear selection
    selectedBuilding = null;
    canvas.style.cursor = 'default';

    // Update UI
    updateUI();
    saveGame(); // Save to Supabase
}
```

## Step 3.7: Render Placed Buildings

**Draw all buildings on grid:**

```javascript
function renderBuildings() {
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            const tile = grid[row][col];
            if (tile.building) {
                const screen = gridToScreen(col, row);
                const building = BUILDING_TYPES[tile.building.type];
                const sprite = buildingSprites[building.id];

                if (sprite) {
                    ctx.drawImage(sprite, screen.x - 32, screen.y - 64, 64, 64);
                }
            }
        }
    }
}
```

## Test Milestone 3.1

**What you'll see after this phase:**
- ✅ Building menu in sidebar (3-5 buildings)
- ✅ Click building → cursor changes to crosshair
- ✅ Ghost building follows mouse over grid
- ✅ Click grid tile → building placed
- ✅ Dollars deducted from total
- ✅ Can't place on occupied tile
- ✅ Can't place if not enough dollars

**How to test:**
1. Start with $100 (hardcoded for now)
2. Click "Small House" in sidebar
3. Move mouse over grid (see ghost building)
4. Click empty tile → building appears
5. Try clicking occupied tile → see error message
6. Try placing when dollars = $0 → see error message

---

**END OF CHUNK 1**

This is getting long. Should I continue with:
- **Chunk 2:** Phase 4-5 (Math Quiz + Game Economy)
- **Chunk 3:** Phase 6-7 (Supabase + UI Polish)
- **Chunk 4:** Phase 8 (Testing + Deployment)

Or do you want me to start coding Phase 0-3 right now?