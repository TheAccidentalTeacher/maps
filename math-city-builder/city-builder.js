/* ========================================
   MATH MILLIONAIRE CITY BUILDER
   Phase 1: Foundation (Grid + Camera + Basic Placement)
   ======================================== */

// ========================================
// GLOBAL STATE
// ========================================

const gameState = {
    cash: 1000000,               // Starting cash (testing)
    cityValue: 0,                // Total value of placed buildings
    placedBuildings: {},         // { "x,y": { buildingId, rotation, price } }
    savedBuildings: {},          // Temporary storage for buildings to restore
    
    // Stats (for Phase 4)
    totalProblems: 0,
    totalEarned: 0,
    milestonesReached: [],
    
    // Gen Alpha mode
    genAlphaMode: false,
    
    // Babylon.js objects
    scene: null,
    camera: null,
    canvas: null,
    engine: null,
    
    // Grid
    gridSize: 50,                // 50×50 grid
    tileSize: 2,                 // Each tile is 2×2 units
    
    // Placement mode
    placementMode: false,
    placementModeReady: false, // Prevents immediate placement on entering mode
    selectedBuildingId: null,
    previewMesh: null,
    previewRotation: 0,       // Current rotation in radians (0, π/2, π, 3π/2)
    ignorePointerUntilUp: false, // Ignore initial pointer events until a clean mouseup after entering mode
    placementClickArmed: false, // Becomes true only after a fresh left mousedown on ground
    
    // Model loading & caching
    structures: [],              // Array of all building definitions from structures.json
    modelCache: {},              // { modelPath: rootMesh } - cached loaded models
    modelsLoaded: false
};

// DEV toggles
const DEV_FORCE_CASH = true;            // Set to false to respect saved cash
const DEV_STARTING_CASH = 1000000;      // Testing bankroll

// ========================================
// INITIALIZATION
// ========================================

window.addEventListener('DOMContentLoaded', async () => {
    console.log('🏗️ Math Millionaire City Builder - Phase 2');
    
    // Load saved state FIRST (before anything else)
    loadGameState();
    
    // Load structures.json (all building definitions)
    const structuresLoaded = await loadStructuresData();
    if (!structuresLoaded) {
        alert('Failed to load building data! Check console.');
        return;
    }
    
    // Initialize Babylon.js (will restore buildings after scene loads)
    initBabylon();
    
    // Preload first test building model (cheapest road piece)
    if (gameState.structures.length > 0) {
        const testBuilding = gameState.structures[0];
        console.log(`📦 Preloading test building: ${testBuilding.name} ($${testBuilding.price})`);
        try {
            await loadGLBModel(testBuilding.modelPath);
            console.log('✅ Test building loaded and cached');
            gameState.modelsLoaded = true;
        } catch (error) {
            console.error('❌ Failed to load test building:', error);
            // Don't block - carousel will load models on demand
        }
    }
    
    // Set up UI event listeners (after state is loaded)
    initUI();
    
    // Update UI with loaded values (CRITICAL: must happen after loadGameState)
    updateUI();
    
    // Hide loading screen after assets load
    hideLoadingScreen();
});

// ========================================
// BABYLON.JS SCENE SETUP
// ========================================

function initBabylon() {
    // Get canvas
    const canvas = document.getElementById('renderCanvas');
    gameState.canvas = canvas;
    
    // Create engine
    const engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
    });
    gameState.engine = engine;
    
    // Create scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.53, 0.81, 0.92, 1); // Sky blue instead of gray
    gameState.scene = scene;
    
    // Simple sky gradient (no external textures needed)
    scene.clearColor = new BABYLON.Color4(0.53, 0.81, 0.92, 1); // Sky blue
    
    // Create camera (ArcRotateCamera for orbit controls)
    const camera = new BABYLON.ArcRotateCamera(
        "cityCamera",
        -Math.PI / 4,           // Alpha: -45° (northeast view)
        Math.PI / 3,            // Beta: 60° elevation
        50,                     // Radius: 50 units from center
        new BABYLON.Vector3(0, 0, 0),  // Target: Grid center
        scene
    );
    
    // CRITICAL: Slow down for touchpads (50% speed reduction)
    camera.panningSensibility = 100;      // Pan speed (default: 50, higher = slower)
    camera.wheelPrecision = 10;           // Zoom speed (FIXED: lower = faster, was 200)
    camera.angularSensibilityX = 4000;    // Horizontal rotation (default: 2000)
    camera.angularSensibilityY = 4000;    // Vertical rotation (default: 2000)
    camera.wheelDeltaPercentage = 0.01;   // Zoom sensitivity boost
    
    // Prevent "southern hemisphere" upside-down view
    camera.lowerBetaLimit = 0.1;          // Minimum: 5° above horizon
    camera.upperBetaLimit = Math.PI / 2.2; // Maximum: ~80°
    
    // Zoom limits (support massive cities)
    camera.lowerRadiusLimit = 10;         // Close-up view
    camera.upperRadiusLimit = 200;        // Strategic Civ-style view
    
    // Smooth inertia
    camera.inertia = 0.7;
    camera.panningInertia = 0.7;
    
    // Attach controls
    camera.attachControl(canvas, true);
    gameState.camera = camera;
    
    // Middle mouse button for faster rotation
    camera.inputs.attached.pointers.buttons = [0, 1, 2]; // Left, middle, right
    
    // Create lighting
    const light = new BABYLON.HemisphericLight(
        "skyLight",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.8;
    
    // Add directional light for shadows (Phase 2)
    const dirLight = new BABYLON.DirectionalLight(
        "sunLight",
        new BABYLON.Vector3(-1, -2, -1),
        scene
    );
    dirLight.intensity = 0.5;
    
    // Create ground grid
    createGrid();
    
    // Restore saved buildings (after scene is ready)
    if (gameState.savedBuildings && Object.keys(gameState.savedBuildings).length > 0) {
        console.log('🏗️ Restoring', Object.keys(gameState.savedBuildings).length, 'saved buildings...');
        Object.entries(gameState.savedBuildings).forEach(([tileKey, buildingData]) => {
            const [gridX, gridZ] = tileKey.split(',').map(Number);
            restoreBuilding(gridX, gridZ, buildingData);
        });
        updateUI(); // Update cash/value display
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        engine.resize();
    });
    
    // Render loop
    engine.runRenderLoop(() => {
        scene.render();
    });
    
    // Click handler for placement and drag-to-move - ONLY on left click
    let isDragging = false;
    let mouseDownPos = { x: 0, y: 0 };
    let draggedBuilding = null; // Track which building is being dragged
    let originalTileKey = null; // Remember where it came from
    
    scene.onPointerDown = (evt, pickInfo) => {
        mouseDownPos = { x: evt.clientX, y: evt.clientY };
        isDragging = false;
        draggedBuilding = null;
        originalTileKey = null;
        
        // In placement mode: only arm placement on a fresh left mousedown on the ground
        if (gameState.placementMode) {
            if (gameState.ignorePointerUntilUp) {
                // Ignore this down; waiting for a clean mouseup after entering mode
                return;
            }
            if (evt.button === 0) {
                const pick = pickInfo?.hit ? pickInfo : scene.pick(scene.pointerX, scene.pointerY);
                if (gameState.placementModeReady && pick.hit && pick.pickedMesh?.name === 'ground') {
                    gameState.placementClickArmed = true; // Now a subsequent mouseup can place
                    // Don't start drag logic while in placement mode
                    return;
                }
            }
            // While in placement mode and not arming, ignore drag start
            return;
        }
        
        // Check if we clicked on a building (left click only)
        if (evt.button === 0 && pickInfo.hit && pickInfo.pickedMesh) {
            // Check if this mesh belongs to a placed building
            for (const [tileKey, buildingData] of Object.entries(gameState.placedBuildings)) {
                if (buildingData.mesh && (pickInfo.pickedMesh === buildingData.mesh || pickInfo.pickedMesh.parent === buildingData.mesh)) {
                    draggedBuilding = buildingData;
                    originalTileKey = tileKey;
                    console.log(`🖱️ Started dragging building from ${tileKey}`);
                    break;
                }
            }
        }
    };
    
    scene.onPointerMove = (evt) => {
        const dist = Math.sqrt(
            Math.pow(evt.clientX - mouseDownPos.x, 2) + 
            Math.pow(evt.clientY - mouseDownPos.y, 2)
        );
        if (dist > 5) isDragging = true; // If moved >5px, it's a drag
        
        // If dragging a building, move it with the mouse
        if (draggedBuilding && isDragging) {
            const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickInfo.hit && pickInfo.pickedMesh.name === 'ground') {
                const pos = pickInfo.pickedPoint;
                // Snap to grid while dragging
                const tileSize = gameState.tileSize;
                const gridX = Math.floor(pos.x / tileSize + 0.5);
                const gridZ = Math.floor(pos.z / tileSize + 0.5);
                draggedBuilding.mesh.position.x = gridX * tileSize;
                draggedBuilding.mesh.position.z = gridZ * tileSize;
            }
        }
        
        // If in placement mode, move ghost preview with mouse
        if (gameState.placementMode && gameState.previewMesh) {
            const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickInfo.hit && pickInfo.pickedMesh.name === 'ground') {
                const pos = pickInfo.pickedPoint;
                const tileSize = gameState.tileSize;
                const gridX = Math.floor(pos.x / tileSize + 0.5);
                const gridZ = Math.floor(pos.z / tileSize + 0.5);
                gameState.previewMesh.position.x = gridX * tileSize;
                gameState.previewMesh.position.z = gridZ * tileSize;
            }
        }
    };
    
    scene.onPointerUp = (evt, pickInfo) => {
        // First clean mouseup after entering placement mode simply clears the ignore flag
        if (gameState.placementMode && gameState.ignorePointerUntilUp) {
            gameState.ignorePointerUntilUp = false;
            // Do not place on this transition mouseup
            console.log('🛑 Ignored initial mouseup after entering placement mode');
            return;
        }
        // If we were dragging a building, finalize its new position
        if (draggedBuilding && isDragging) {
            const pos = draggedBuilding.mesh.position;
            const tileSize = gameState.tileSize;
            const gridX = Math.floor(pos.x / tileSize + 0.5);
            const gridZ = Math.floor(pos.z / tileSize + 0.5);
            const newTileKey = `${gridX},${gridZ}`;
            
            // Check if new location is valid (not occupied by another building)
            if (gameState.placedBuildings[newTileKey] && newTileKey !== originalTileKey) {
                console.log(`⚠️ Cannot move - tile ${newTileKey} is occupied`);
                // Move back to original position
                const [origX, origZ] = originalTileKey.split(',').map(Number);
                draggedBuilding.mesh.position.x = origX * tileSize;
                draggedBuilding.mesh.position.z = origZ * tileSize;
                alert('That tile is already occupied!');
            } else if (newTileKey !== originalTileKey) {
                // Move successful - update gameState
                delete gameState.placedBuildings[originalTileKey];
                gameState.placedBuildings[newTileKey] = draggedBuilding;
                console.log(`✅ Moved building from ${originalTileKey} to ${newTileKey}`);
                saveGameState(); // Auto-save after move
            }
            
            draggedBuilding = null;
            originalTileKey = null;
        }
        // If in placement mode, place the building where preview is
        else if (gameState.placementMode && gameState.placementModeReady && gameState.placementClickArmed && !isDragging && evt.button === 0 && pickInfo.hit && pickInfo.pickedMesh.name === 'ground') {
            console.log('🎯 USER CLICKED - Placing building at ghost location');
            finalizePlacement();
            gameState.placementClickArmed = false; // consume the click
        }
        
        // Debug: Log when in placement mode but NOT placing
        if (gameState.placementMode && evt.button === 0) {
            console.log('🔍 Click Debug:', {
                placementMode: gameState.placementMode,
                placementModeReady: gameState.placementModeReady,
                ignorePointerUntilUp: gameState.ignorePointerUntilUp,
                placementClickArmed: gameState.placementClickArmed,
                isDragging: isDragging,
                button: evt.button,
                hit: pickInfo.hit,
                meshName: pickInfo.pickedMesh?.name
            });
        }
        // Only place NEW building if it was a CLICK (not a drag) and left button on ground (old behavior)
        else if (!gameState.placementMode && !isDragging && evt.button === 0 && pickInfo.hit && pickInfo.pickedMesh.name === 'ground') {
            const pos = pickInfo.pickedPoint;
            placeTestBuilding(pos.x, pos.z);
        }
    };
    
    // Keyboard controls
    window.addEventListener('keydown', (evt) => {
        // R key = Rotate preview 90° clockwise
        if (evt.key === 'r' || evt.key === 'R') {
            if (gameState.placementMode && gameState.previewMesh) {
                gameState.previewRotation += Math.PI / 2; // Add 90° in radians
                if (gameState.previewRotation >= Math.PI * 2) {
                    gameState.previewRotation = 0; // Reset after 360°
                }
                gameState.previewMesh.rotation.y = gameState.previewRotation;
                console.log(`🔄 Rotated preview to ${Math.round(gameState.previewRotation * 180 / Math.PI)}°`);
            }
        }
        // ESC key = Cancel placement mode
        else if (evt.key === 'Escape') {
            if (gameState.placementMode) {
                console.log('❌ Placement cancelled');
                exitPlacementMode();
            }
        }
    });
    
    console.log('✅ Babylon.js scene initialized');
}

// ========================================
// GRID CREATION
// ========================================

function createGrid() {
    const scene = gameState.scene;
    const gridSize = gameState.gridSize;
    const tileSize = gameState.tileSize;
    
    // Create ground plane
    const ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: gridSize * tileSize, height: gridSize * tileSize },
        scene
    );
    
    // Ground material (green grass)
    const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.3); // Green
    groundMat.specularColor = new BABYLON.Color3(0, 0, 0); // No shine
    ground.material = groundMat;
    
    // Create grid lines
    const gridLines = [];
    const halfSize = (gridSize * tileSize) / 2;
    
    // Vertical lines
    for (let i = 0; i <= gridSize; i++) {
        const x = (i * tileSize) - halfSize;
        gridLines.push([
            new BABYLON.Vector3(x, 0.01, -halfSize),
            new BABYLON.Vector3(x, 0.01, halfSize)
        ]);
    }
    
    // Horizontal lines
    for (let i = 0; i <= gridSize; i++) {
        const z = (i * tileSize) - halfSize;
        gridLines.push([
            new BABYLON.Vector3(-halfSize, 0.01, z),
            new BABYLON.Vector3(halfSize, 0.01, z)
        ]);
    }
    
    // Draw grid lines
    gridLines.forEach((line, index) => {
        const linesMesh = BABYLON.MeshBuilder.CreateLines(
            `gridLine_${index}`,
            { points: line },
            scene
        );
        linesMesh.color = new BABYLON.Color3(0.3, 0.3, 0.3); // Gray
        linesMesh.isPickable = false;
    });
    
    console.log(`✅ Created ${gridSize}×${gridSize} grid`);
}

// ========================================
// MODEL LOADING & CACHING (Phase 2)
// ========================================

async function loadStructuresData() {
    console.log('📦 Loading structures.json...');
    try {
        // Add cache-busting timestamp to force fresh load
        const timestamp = new Date().getTime();
        const response = await fetch(`structures.json?v=${timestamp}`);
        gameState.structures = await response.json();
        console.log(`✅ Loaded ${gameState.structures.length} building definitions`);
        return true;
    } catch (error) {
        console.error('❌ Failed to load structures.json:', error);
        return false;
    }
}

function getStructureById(buildingId) {
    return gameState.structures.find(s => s.id === buildingId);
}

async function loadGLBModel(modelPath, onProgress = null) {
    // Check cache first
    if (gameState.modelCache[modelPath]) {
        console.log(`♻️ Using cached model: ${modelPath}`);
        return gameState.modelCache[modelPath];
    }
    
    console.log(`📥 Loading GLB model: ${modelPath}`);
    
    return new Promise((resolve, reject) => {
        BABYLON.SceneLoader.ImportMesh(
            "",                     // Load all meshes
            "",                     // Root URL (use modelPath directly)
            modelPath,              // Full path to GLB
            gameState.scene,
            (meshes) => {
                if (meshes.length === 0) {
                    reject(new Error('No meshes loaded from GLB'));
                    return;
                }
                
                // Get root mesh (usually meshes[0] is the container)
                const rootMesh = meshes[0];
                
                // Create parent mesh to hold all model parts (kept disabled as a template)
                const container = new BABYLON.Mesh(`container_${modelPath}`, gameState.scene);
                meshes.forEach(mesh => {
                    // Avoid re-parenting the container to itself if importer already produced a root
                    if (mesh !== container) {
                        mesh.parent = container;
                    }
                    // Template parts should not be pickable
                    mesh.isPickable = false;
                });
                
                // Set default scale (Kenney models may need adjustment)
                container.scaling = new BABYLON.Vector3(1, 1, 1);
                
                // Keep template disabled and non-pickable; instances/clones will be enabled on demand
                container.setEnabled(false);
                container.isPickable = false;

                // Cache the loaded model
                gameState.modelCache[modelPath] = container;
                
                console.log(`✅ Loaded model: ${modelPath} (${meshes.length} meshes)`);
                resolve(container);
            },
            (evt) => {
                if (onProgress && evt.lengthComputable) {
                    const percent = (evt.loaded / evt.total) * 100;
                    onProgress(percent);
                }
            },
            (scene, message, exception) => {
                console.error(`❌ Failed to load model: ${modelPath}`, message, exception);
                reject(exception || new Error(message));
            }
        );
    });
}

function createBuildingInstance(buildingId, position, rotation = 0) {
    const structure = getStructureById(buildingId);
    if (!structure) {
        console.warn(`⚠️ Unknown building ID: ${buildingId}`);
        return null;
    }
    
    // Get cached model (should already be loaded)
    const cachedModel = gameState.modelCache[structure.modelPath];
    if (!cachedModel) {
        console.error(`❌ Model not in cache: ${structure.modelPath}`);
        return null;
    }
    
    // Clone the cached model to create a new instance
    const instance = cachedModel.clone(`instance_${position.x}_${position.z}`);
    instance.position = position;
    instance.rotation.y = rotation;
    instance.setEnabled(true);
    
    return instance;
}

// ========================================
// PLACEMENT MODE (Ghost Preview)
// ========================================

async function enterPlacementMode() {
    console.log('👻 Entering placement mode...');
    gameState.placementMode = true;
    gameState.placementModeReady = false; // Not ready until preview is created
    gameState.previewRotation = 0; // Reset rotation for new placement
    gameState.placementClickArmed = false; // Require fresh click
    gameState.ignorePointerUntilUp = true; // Ignore any pointerdown/up caused by the UI click
    
    // Get selected building structure
    const buildingId = gameState.selectedBuildingId || gameState.structures[0]?.id;
    const structure = gameState.structures.find(s => s.id === buildingId);
    
    if (!structure) {
        console.error('❌ No structure selected for placement');
        return;
    }
    
    // Ensure model is loaded
    if (!gameState.modelCache[structure.modelPath]) {
        console.log('📥 Loading model for preview:', structure.modelPath);
        await loadGLBModel(structure.modelPath);
    }
    
    // Create ghost preview (semi-transparent clone)
    const cachedModel = gameState.modelCache[structure.modelPath];
    if (cachedModel) {
        gameState.previewMesh = cachedModel.clone('ghostPreview');
        gameState.previewMesh.position = new BABYLON.Vector3(0, 0, 0);
        gameState.previewMesh.setEnabled(true);
        
        // Make it semi-transparent green
        gameState.previewMesh.getChildMeshes().forEach(mesh => {
            if (mesh.material) {
                const mat = mesh.material.clone('ghostMat');
                mat.alpha = 0.5;
                mat.emissiveColor = new BABYLON.Color3(0, 1, 0); // Green glow
                mesh.material = mat;
            }
        });
        
        console.log('✅ Ghost preview created');
        
        // Delay ready flag briefly; we still require a fresh mouseup before accepting input
        setTimeout(() => {
            gameState.placementModeReady = true;
            console.log('✅ Placement mode ready for clicks');
        }, 75); // Minimal delay; safety handled by ignorePointerUntilUp
    }
}

function exitPlacementMode() {
    console.log('🚪 Exiting placement mode');
    gameState.placementMode = false;
    gameState.placementModeReady = false;
    gameState.placementClickArmed = false;
    gameState.ignorePointerUntilUp = false;
    
    // Remove ghost preview
    if (gameState.previewMesh) {
        gameState.previewMesh.dispose();
        gameState.previewMesh = null;
    }
}

function finalizePlacement() {
    console.log('🧩 finalizePlacement:start', {
        placementMode: gameState.placementMode,
        placementModeReady: gameState.placementModeReady,
        hasPreview: !!gameState.previewMesh
    });
    if (!gameState.previewMesh) {
        console.error('❌ No preview mesh to finalize!');
        return;
    }
    
    // Get preview position (already snapped to grid)
    const pos = gameState.previewMesh.position;
    const tileSize = gameState.tileSize;
    const gridX = Math.floor(pos.x / tileSize + 0.5);
    const gridZ = Math.floor(pos.z / tileSize + 0.5);
    const tileKey = `${gridX},${gridZ}`;
    
    console.log(`🎯 Finalizing placement at grid (${gridX}, ${gridZ})`);
    
    // Check if tile is occupied
    if (gameState.placedBuildings[tileKey]) {
        console.log('⚠️ Tile already occupied at', tileKey);
        alert('This tile is already occupied!');
        return;
    }
    
    // Get selected building
    const buildingId = gameState.selectedBuildingId;
    const buildingDef = gameState.structures.find(b => b.id === buildingId);
    
    if (!buildingDef) {
        console.error('❌ Building not found:', buildingId);
        exitPlacementMode();
        return;
    }
    
    // Check cash
    if (gameState.cash < buildingDef.price) {
        console.log(`⚠️ Not enough cash! Need $${buildingDef.price}, have $${gameState.cash}`);
        alert(`Not enough cash!\n\nNeed: $${buildingDef.price}\nHave: $${gameState.cash}\n\n(Click "Earn Cash" to solve math problems)`);
        exitPlacementMode();
        return;
    }
    
    // Convert ghost preview into real building
    const realMesh = gameState.previewMesh; // capture before we clear the reference

    // Remove green glow and make opaque
    realMesh.getChildMeshes().forEach(mesh => {
        if (mesh.material) {
            mesh.material.alpha = 1.0;
            mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
        }
        // Make placed meshes pickable for drag-move
        mesh.isPickable = true;
    });
    realMesh.isPickable = true;
    
    // Save to state
    gameState.placedBuildings[tileKey] = {
        buildingId: buildingId,
        rotation: gameState.previewRotation, // Save the rotation
        price: buildingDef.price,
        mesh: realMesh
    };
    
    // Deduct cash
    gameState.cash -= buildingDef.price;
    gameState.cityValue += buildingDef.price;
    
    console.log(`✅ Placed ${buildingDef.name} at ${tileKey} for $${buildingDef.price}`);
    console.log(`💰 Cash: $${gameState.cash} | 🏙️ Value: $${gameState.cityValue}`);
    
    // Update UI
    updateUI();
    
    // Save game
    saveGameState();
    
    // Clear preview reference (but don't dispose - it's now a real building)
    gameState.previewMesh = null;
    
    // Exit placement mode
    gameState.placementMode = false;
}

// ========================================
// BUILDING PLACEMENT (Phase 1: Test Buildings)
// ========================================

function placeTestBuilding(worldX, worldZ) {
    // Snap to grid (proper rounding to nearest tile center)
    const tileSize = gameState.tileSize;
    const gridX = Math.floor(worldX / tileSize + 0.5); // Snap to nearest integer
    const gridZ = Math.floor(worldZ / tileSize + 0.5);
    
    console.log(`🎯 Clicked world: (${worldX.toFixed(1)}, ${worldZ.toFixed(1)}) → Grid: (${gridX}, ${gridZ})`);
    
    // Check if tile is occupied
    const tileKey = `${gridX},${gridZ}`;
    if (gameState.placedBuildings[tileKey]) {
        console.log('⚠️ Tile already occupied at', tileKey);
        alert('This tile is already occupied!');
        return;
    }
    
    // Use selected building from menu, or default to first building
    const buildingId = gameState.selectedBuildingId || gameState.structures[0]?.id;
    if (!buildingId) {
        console.error('❌ No building selected and no default available!');
        alert('Please select a building from the Build menu first!');
        return;
    }
    
    const buildingDef = gameState.structures.find(b => b.id === buildingId);
    if (!buildingDef) {
        console.error('❌ Building not found:', buildingId);
        return;
    }
    
    const buildingPrice = buildingDef.price;
    
    if (gameState.cash < buildingPrice) {
        console.log(`⚠️ Not enough cash! Need $${buildingPrice}, have $${gameState.cash}`);
        alert(`Not enough cash!\n\nNeed: $${buildingPrice}\nHave: $${gameState.cash}\n\n(Click "Earn Cash" to solve math problems)`);
        return;
    }
    
    // Create building instance from GLB model
    const worldPos = new BABYLON.Vector3(
        gridX * tileSize,
        0, // Place on ground (model Y=0 should be base)
        gridZ * tileSize
    );
    
    const buildingMesh = createBuildingInstance(buildingId, worldPos, 0);
    if (!buildingMesh) {
        console.error('❌ Failed to create building instance');
        return;
    }
    
    // Save to state
    gameState.placedBuildings[tileKey] = {
        buildingId: buildingId,
        rotation: 0,
        price: buildingPrice,
        mesh: buildingMesh
    };
    
    // Deduct cash
    gameState.cash -= buildingPrice;
    gameState.cityValue += buildingPrice;
    
    // Update UI
    updateUI();
    
    // Save game
    saveGameState();
    
    // Clear placement/preview state so the ghost stops following
    gameState.previewMesh = null;
    gameState.placementMode = false;
    gameState.placementModeReady = false;
    gameState.placementClickArmed = false;
    console.log('🧩 finalizePlacement:end', {
        placementMode: gameState.placementMode,
        placementModeReady: gameState.placementModeReady,
        hasPreview: !!gameState.previewMesh
    });
}

// ========================================
// RESTORE BUILDING (from saved data)
// ========================================

function restoreBuilding(gridX, gridZ, buildingData) {
    const scene = gameState.scene;
    const tileSize = gameState.tileSize;
    const tileKey = `${gridX},${gridZ}`;
    
    // Create building instance from GLB model
    const worldPos = new BABYLON.Vector3(
        gridX * tileSize,
        0, // Ground level
        gridZ * tileSize
    );
    
    const buildingId = buildingData.buildingId || 'test_box';
    const rotation = buildingData.rotation || 0;
    
    const building = createBuildingInstance(buildingId, worldPos, rotation);
    if (!building) {
        console.warn(`⚠️ Failed to restore building ${buildingId} at (${gridX}, ${gridZ})`);
        return;
    }
    
    // Save to state (but don't deduct cash again - already saved)
    gameState.placedBuildings[tileKey] = {
        buildingId: buildingId,
        rotation: rotation,
        price: buildingData.price || 100,
        mesh: building
    };
    
    console.log(`🔄 Restored building ${buildingId} at (${gridX}, ${gridZ})`);
}

// ========================================
// UI UPDATES
// ========================================

function updateUI() {
    // Update cash display
    document.getElementById('cashAmount').textContent = `$${gameState.cash.toLocaleString()}`;
    
    // Update city value
    document.getElementById('cityValue').textContent = `$${gameState.cityValue.toLocaleString()}`;
    
    // Update progress bar
    const progress = (gameState.cityValue / 1000000) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.querySelector('.progress-percent').textContent = `${progress.toFixed(1)}%`;
}

function initUI() {
    // Gen Alpha toggle
    document.getElementById('genAlphaToggle').addEventListener('click', () => {
        gameState.genAlphaMode = !gameState.genAlphaMode;
        SharedState.setGenAlphaMode(gameState.genAlphaMode);
        document.getElementById('genAlphaStatus').textContent = gameState.genAlphaMode ? 'ON' : 'OFF';
        console.log('🎮 Gen Alpha mode:', gameState.genAlphaMode ? 'ON (slang enabled)' : 'OFF (normal text)');
    });
    
    // Action buttons (Phase 2+)
    document.getElementById('buildBtn').addEventListener('click', () => {
        openBuildingMenu();
    });
    
    document.getElementById('earnCashBtn').addEventListener('click', () => {
        alert('Phase 3: Math problem system will be implemented here!');
    });
    
    document.getElementById('deleteBtn').addEventListener('click', () => {
        alert('Phase 2: Delete mode will be implemented here!');
    });
    
    document.getElementById('statsBtn').addEventListener('click', () => {
        alert('Phase 4: Stats modal will be implemented here!');
    });
    
    document.getElementById('minimapToggle').addEventListener('click', () => {
        const minimap = document.getElementById('minimap');
        minimap.classList.toggle('hidden');
    });
    
    // Reset City button - Double confirmation required
    document.getElementById('resetBtn').addEventListener('click', () => {
        // First confirmation
        const confirm1 = window.confirm(
            '⚠️ RESET CITY - FIRST WARNING ⚠️\n\n' +
            'This will DELETE your entire city!\n\n' +
            '• All buildings will be removed\n' +
            '• Cash will reset to $1,000\n' +
            '• City value will reset to $0\n' +
            '• Progress will be lost\n\n' +
            'Are you SURE you want to reset?\n\n' +
            '(You will be asked one more time)'
        );
        
        if (!confirm1) {
            console.log('🛑 Reset cancelled (first confirmation)');
            return;
        }
        
        // Second confirmation
        const confirm2 = window.confirm(
            '🚨 FINAL WARNING - CANNOT UNDO! 🚨\n\n' +
            'This is your LAST CHANCE!\n\n' +
            'Click OK to PERMANENTLY DELETE your city.\n' +
            'Click Cancel to keep your current progress.\n\n' +
            'Are you ABSOLUTELY CERTAIN?'
        );
        
        if (!confirm2) {
            console.log('🛑 Reset cancelled (second confirmation)');
            return;
        }
        
        // User confirmed twice - RESET EVERYTHING
        console.log('🔥 RESETTING CITY - User confirmed twice');
        resetCity();
    });
    
    // Load Gen Alpha preference
    gameState.genAlphaMode = SharedState.getGenAlphaMode();
    document.getElementById('genAlphaStatus').textContent = gameState.genAlphaMode ? 'ON' : 'OFF';
    
    // NOTE: updateUI() is called in main init (after loadGameState)
    // Don't call it here or it will show default $1000 instead of loaded values
}

// ========================================
// RESET CITY
// ========================================

function resetCity() {
    console.log('🔥 Resetting city to fresh start...');
    
    // Clear localStorage FIRST
    localStorage.removeItem('cityBuilderSave');
    
    console.log('✅ Save data cleared - Reloading page for fresh start...');
    
    // Reload the page to ensure complete reset
    // This will clear all meshes, rebuild the scene, and start with the configured starting cash
    window.location.reload();
}

// ========================================
// SAVE/LOAD GAME STATE
// ========================================

function saveGameState() {
    const saveData = {
        cash: gameState.cash,
        cityValue: gameState.cityValue,
        buildings: {},  // Will convert mesh objects to serializable data
        stats: {
            totalProblems: gameState.totalProblems,
            totalEarned: gameState.totalEarned,
            milestonesReached: gameState.milestonesReached
        }
    };
    
    // Convert placed buildings to serializable format
    Object.entries(gameState.placedBuildings).forEach(([key, building]) => {
        saveData.buildings[key] = {
            buildingId: building.buildingId,
            rotation: building.rotation,
            price: building.price
        };
    });
    
    SharedState.saveCityState(saveData);
}

function loadGameState() {
    const savedData = SharedState.loadCityState();
    
    if (savedData) {
        gameState.cash = savedData.cash || 1000;
        gameState.cityValue = savedData.cityValue || 0;
        gameState.totalProblems = savedData.stats?.totalProblems || 0;
        gameState.totalEarned = savedData.stats?.totalEarned || 0;
        gameState.milestonesReached = savedData.stats?.milestonesReached || [];
        
        // Store building data to restore after scene loads
        gameState.savedBuildings = savedData.buildings || {};
        
        if (DEV_FORCE_CASH) {
            gameState.cash = DEV_STARTING_CASH;
        }
        console.log('📂 Loaded save - Cash:', gameState.cash, 'Value:', gameState.cityValue);
        console.log('📂 Buildings to restore:', Object.keys(gameState.savedBuildings).length);
    } else {
        if (DEV_FORCE_CASH) {
            gameState.cash = DEV_STARTING_CASH;
        }
        console.log(`🆕 New game started - Cash: $${gameState.cash.toLocaleString()}`);
    }
}

// Auto-save every 30 seconds
setInterval(() => {
    saveGameState();
}, 30000);

// Save before closing
window.addEventListener('beforeunload', () => {
    saveGameState();
});

// ========================================
// LOADING SCREEN
// ========================================

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
    console.log('✅ Loading complete');
}

// Expose loadGLBModel globally for building-menu.js to use
window.loadGLBModel = loadGLBModel;

// ========================================
// 67 GLITCH (Phase 5 preview)
// ========================================

function trigger67Glitch() {
    const overlay = document.getElementById('glitchOverlay');
    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 500);
    
    if (gameState.genAlphaMode) {
        console.log('👾 Six seven fr fr!');
    } else {
        console.log('👾 67 glitch triggered!');
    }
}

// Expose placement mode functions globally for building menu
window.enterPlacementMode = enterPlacementMode;
window.exitPlacementMode = exitPlacementMode;

console.log('✅ City Builder (Phase 1) loaded');
console.log('');
console.log('📝 ============ INSTRUCTIONS ============');
console.log('   🖱️  LEFT-CLICK tile = Place building (in placement mode)');
console.log('   🖱️  LEFT-DRAG = Orbit camera');
console.log('   🖱️  RIGHT-DRAG = Pan view');
console.log('   🖱️  MIDDLE-CLICK = Faster rotation');
console.log('   🖱️  SCROLL = Zoom in/out');
console.log('   ⌨️  R key = Rotate building 90° (in placement mode)');
console.log('   ⌨️  ESC key = Cancel placement');
console.log(`   💰 Start with $${gameState.cash.toLocaleString()} cash`);
console.log('   🎯 Buildings snap to grid automatically');
console.log('   💾 Auto-saves every 30 seconds');
console.log('   🔄 Reload page = Buildings persist!');
console.log('========================================');
console.log('');
