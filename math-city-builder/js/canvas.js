// CANVAS MANAGEMENT - Make it look SEXY! 🎨

let canvas, ctx;
let cameraX = 0, cameraY = 0;
let zoom = 1.0;

// Mouse tracking for ghost preview
let mouseGridX = 0;
let mouseGridY = 0;
let isMouseOverCanvas = false;

// Settings
let showBuildingLabels = false; // Toggle building name labels
let debugMode = false; // Toggle debug overlay with 'D' key

// Image cache for building sprites
const imageCache = {};

// Preload a building image
function loadBuildingImage(building) {
    const key = building.sprite;
    
    if (!imageCache[key]) {
        const img = new Image();
        
        // Handle different asset paths for decorations vs buildings
        if (building.tier === 0) {
            // Decorations (roads, landscape)
            if (building.category === 'roads') {
                img.src = `../assets/math-city-builder/decorations/roads/${building.sprite}`;
            } else if (building.category === 'landscape') {
                img.src = `../assets/math-city-builder/decorations/landscape/${building.sprite}`;
            }
        } else {
            // Regular buildings
            img.src = `../assets/math-city-builder/buildings/tier${building.tier}/${building.sprite}`;
        }
        
        imageCache[key] = img;
        
        // Re-render when image loads
        img.onload = () => {
            renderCanvas();
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load: ${img.src}`);
        };
    }
    
    return imageCache[key];
}

// Load a specific building sprite by tier and filename (for composite rendering)
function loadBuildingImageDirect(tier, spriteFilename) {
    const key = `tier${tier}_${spriteFilename}`;
    
    if (!imageCache[key]) {
        const img = new Image();
        img.src = `../assets/math-city-builder/buildings/tier${tier}/${spriteFilename}`;
        imageCache[key] = img;
        
        img.onload = () => {
            renderCanvas();
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load base sprite: ${img.src}`);
        };
    }
    
    return imageCache[key];
}

// Initialize the canvas
function initializeCanvas() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size to fill container
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Add mouse wheel zoom
    canvas.addEventListener('wheel', handleMouseWheel, { passive: false });
    
    // Add pan/drag functionality
    setupPanControls();
    
    // Add mouse tracking for ghost preview
    setupMouseTracking();
    
    // Initial render
    renderCanvas();
    
    console.log('🎨 Canvas initialized! Loading sprites...');
}

// Resize canvas to fill container
function resizeCanvas() {
    const container = document.getElementById('canvas-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    renderCanvas();
}

// Main render function - DRAW EVERYTHING!
function renderCanvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Apply camera transform
    ctx.translate(canvas.width / 2 + cameraX, canvas.height / 2 + cameraY);
    ctx.scale(zoom, zoom);
    
    // Render everything
    renderGrid();      // Grid lines
    renderBuildings(); // Buildings
    
    // Draw ghost preview if hovering
    renderGhostPreview();
    
    // Draw selection indicator
    renderSelection();
    
    // Restore context
    ctx.restore();
    
    // Draw debug overlay (if enabled) - AFTER restore so it's not affected by zoom/pan
    if (debugMode) {
        renderDebugOverlay();
    }
}

// Render all placed buildings
function renderBuildings() {
    // Sort buildings by depth (Y position first, then X) for proper isometric layering
    // Roads (tier 0) should always render BEHIND buildings to prevent overlap
    const sortedBuildings = [...gameState.placedBuildings].sort((a, b) => {
        // Calculate isometric depth: buildings further back (smaller Y, smaller X) drawn first
        const depthA = a.y * 2 + a.x;
        const depthB = b.y * 2 + b.x;
        
        // If same position, roads (tier 0) render first (behind buildings)
        if (depthA === depthB) {
            return a.tier - b.tier; // tier 0 (roads) before tier 1+ (buildings)
        }
        
        return depthA - depthB;
    });
    
    sortedBuildings.forEach(building => {
        const screenPos = gridToScreen(building.x, building.y);
        
        // NOTE: Composite rendering (base + roof) is prepared but disabled
        // because we don't have separate base/roof sprites yet
        // const spriteNum = building.sprite.replace('buildingTiles_', '').replace('.png', '');
        // const needsBase = BUILDING_COMPOSITES && BUILDING_COMPOSITES[spriteNum];
        
        // ============================================================
        // VERTICAL ALIGNMENT SYSTEM - CRITICAL FOR ISOMETRIC RENDERING
        // ============================================================
        // Buildings (tier 1+) need to "float" above the brown base tile
        // to appear like they're sitting ON TOP of the base platform.
        // The brown base is ~25px thick, so we lift buildings by -25px.
        //
        // Roads/decorations (tier 0) sit closer to ground but still need
        // vertical adjustment to align with the isometric grid properly.
        //
        // IMPORTANT: Negative yOffset = MOVE UP, Positive = MOVE DOWN
        // These values were calibrated pixel-by-pixel to match grid alignment.
        // ============================================================
        
        let yOffset = -25; // Buildings float 25px above base
        
        if (building.tier === 0) {
            // TIER 0: Roads, trees, decorations
            // Default: Lift by 18 pixels (was trial-and-errored from 6 -> -9 -> -14 -> -16 -> -18)
            yOffset = -18; 
            
            // Pine trees need extra lift (5 more pixels than default)
            if (building.sprite === 'coniferTall.png' || building.sprite === 'coniferShort.png') {
                yOffset = -23; // -18 - 5 = -23
            }
        }
        
        // SINGLE SPRITE RENDERING (BASE BUILDING)
        const img = loadBuildingImage(building);
        
        // Check if image is loaded
        if (img.complete && img.naturalHeight !== 0) {
            // Scale roads to fill 128x64 grid cells, buildings use natural size
            let spriteWidth = img.naturalWidth;
            let spriteHeight = img.naturalHeight;
            
            // Scale roads from 100x65 to 128x83 to fill grid cell
            if (building.tier === 0) {
                const scale = 128 / 100; // Scale to match grid width
                spriteWidth = img.naturalWidth * scale;
                spriteHeight = img.naturalHeight * scale;
            }
            
            ctx.drawImage(
                img,
                screenPos.x - spriteWidth / 2,
                screenPos.y - spriteHeight / 2 + yOffset,
                spriteWidth,
                spriteHeight
            );
            
            // ============================================================
            // RENDER STACKED FLOORS (if any)
            // ============================================================
            if (building.floors && building.floors.length > 0) {
                // Each floor adds height - stack vertically with offset
                // First floor needs to float ~48px above base (3/4 of 64px floor height)
                // Then each additional floor stacks 32px higher
                const FIRST_FLOOR_OFFSET = 48; // Initial lift above base building
                const FLOOR_HEIGHT_OFFSET = 32; // Stack spacing for additional floors
                
                building.floors.forEach((floorId, index) => {
                    const floorSpritePath = getSpriteImagePath(floorId);
                    
                    // Use image cache
                    let floorImg;
                    if (!imageCache[floorId]) {
                        floorImg = new Image();
                        floorImg.src = floorSpritePath;
                        imageCache[floorId] = floorImg;
                        floorImg.onload = () => renderCanvas();
                    } else {
                        floorImg = imageCache[floorId];
                    }
                    
                    if (floorImg.complete && floorImg.naturalHeight !== 0) {
                        // First floor lifts higher, then each subsequent floor adds normal offset
                        const floorYOffset = yOffset - FIRST_FLOOR_OFFSET - (index * FLOOR_HEIGHT_OFFSET);
                        
                        ctx.drawImage(
                            floorImg,
                            screenPos.x - floorImg.naturalWidth / 2,
                            screenPos.y - floorImg.naturalHeight / 2 + floorYOffset,
                            floorImg.naturalWidth,
                            floorImg.naturalHeight
                        );
                    }
                });
            }
            
            // ============================================================
            // RENDER ROOF (if present)
            // ============================================================
            if (building.hasRoof && building.roofId) {
                const roofSpritePath = getSpriteImagePath(building.roofId);
                
                // Use image cache
                let roofImg;
                if (!imageCache[building.roofId]) {
                    roofImg = new Image();
                    roofImg.src = roofSpritePath;
                    imageCache[building.roofId] = roofImg;
                    roofImg.onload = () => renderCanvas();
                } else {
                    roofImg = imageCache[building.roofId];
                }
                
                if (roofImg.complete && roofImg.naturalHeight !== 0) {
                    // Roof sits on top of all floors or base building
                    const floorCount = building.floors ? building.floors.length : 0;
                    const FIRST_FLOOR_OFFSET = 48;
                    const FLOOR_HEIGHT_OFFSET = 32;
                    const ROOF_ADJUSTMENT = 12; // Roofs sit 12px lower to snug onto the floor/building
                    
                    // If no floors, roof sits on base building; otherwise on top of floor stack
                    let roofYOffset;
                    if (floorCount === 0) {
                        roofYOffset = yOffset - FIRST_FLOOR_OFFSET + ROOF_ADJUSTMENT;
                    } else {
                        roofYOffset = yOffset - FIRST_FLOOR_OFFSET - (floorCount * FLOOR_HEIGHT_OFFSET) + ROOF_ADJUSTMENT;
                    }
                    
                    ctx.drawImage(
                        roofImg,
                        screenPos.x - roofImg.naturalWidth / 2,
                        screenPos.y - roofImg.naturalHeight / 2 + roofYOffset,
                        roofImg.naturalWidth,
                        roofImg.naturalHeight
                    );
                }
            }
        } else {
            // Fallback: Draw colored isometric placeholder while loading
            drawPlaceholder(screenPos, building.tier);
        }
        
        // Draw building name (only if labels enabled)
        if (showBuildingLabels) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.strokeText(building.name, screenPos.x, screenPos.y - 130);
            ctx.fillText(building.name, screenPos.x, screenPos.y - 130);
        }
    });
}

// Render ghost preview of building at mouse position
function renderGhostPreview() {
    if (!gameState.selectedBuilding || !isMouseOverCanvas || gameState.demolishMode) {
        return;
    }
    
    const building = gameState.selectedBuilding;
    const screenPos = gridToScreen(mouseGridX, mouseGridY);
    
    // Check if spot is occupied (or if it's a floor/roof, check if building exists)
    let isOccupied = isCellOccupied(mouseGridX, mouseGridY);
    
    // For floors/roofs, check if there's a building at this location
    if (building.type === 'floor' || building.type === 'roof') {
        const existingBuilding = gameState.placedBuildings.find(
            b => b.x === mouseGridX && b.y === mouseGridY && b.tier > 0
        );
        isOccupied = !existingBuilding; // Red if NO building (invalid), green if building exists
    }
    
    // Load the sprite image
    let img;
    if (building.type === 'floor' || building.type === 'roof') {
        // Floor/roof pieces use getSpriteImagePath
        const key = building.id;
        if (!imageCache[key]) {
            img = new Image();
            img.src = getSpriteImagePath(building.id);
            imageCache[key] = img;
            img.onload = () => renderCanvas();
        } else {
            img = imageCache[key];
        }
    } else {
        // Regular buildings use loadBuildingImage
        img = loadBuildingImage(building);
    }
    
    // Set ghost transparency
    ctx.globalAlpha = 0.5;
    
    if (img && img.complete && img.naturalHeight !== 0) {
        // Draw the sprite as ghost
        const spriteWidth = img.naturalWidth;
        const spriteHeight = img.naturalHeight;
        
        // Simple - just center it
        ctx.drawImage(
            img,
            screenPos.x - spriteWidth / 2,
            screenPos.y - spriteHeight / 2,
            spriteWidth,
            spriteHeight
        );
    } else {
        // Draw placeholder ghost
        drawPlaceholder(screenPos, building.tier || 1);
    }
    
    // Reset transparency
    ctx.globalAlpha = 1.0;
    
    // Draw grid highlight (green if valid, red if occupied)
    ctx.strokeStyle = isOccupied ? '#e74c3c' : '#2ecc71';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    
    // Draw isometric grid cell outline (128x64 standard isometric diamond)
    const isoWidth = 128;
    const isoHeight = 64;
    
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(screenPos.x + isoWidth / 2, screenPos.y + isoHeight / 2);
    ctx.lineTo(screenPos.x, screenPos.y + isoHeight);
    ctx.lineTo(screenPos.x - isoWidth / 2, screenPos.y + isoHeight / 2);
    ctx.closePath();
    ctx.stroke();
    
    ctx.setLineDash([]); // Reset dash
    
    // Show status message based on mode
    ctx.fillStyle = isOccupied ? '#e74c3c' : '#2ecc71';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    let statusMessage = '✓ PLACE HERE';
    if (isOccupied) {
        if (building.type === 'floor' || building.type === 'roof') {
            statusMessage = '❌ NO BUILDING HERE';
        } else {
            statusMessage = '❌ OCCUPIED';
        }
    } else {
        if (building.type === 'floor') {
            statusMessage = '✓ ADD FLOOR ($50)';
        } else if (building.type === 'roof') {
            statusMessage = '✓ ADD ROOF (FREE)';
        }
    }
    
    ctx.fillText(statusMessage, screenPos.x, screenPos.y - 140);
    
    // Show grid coordinates
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`(${mouseGridX}, ${mouseGridY})`, screenPos.x, screenPos.y - 120);
}

// Helper function to draw placeholder building
function drawPlaceholder(screenPos, tier) {
    ctx.fillStyle = getBuildingColor(tier);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    
    // Isometric rectangle placeholder (128x64 standard diamond)
    const isoWidth = 128;
    const isoHeight = 64;
    
    ctx.beginPath();
    ctx.moveTo(screenPos.x, screenPos.y);
    ctx.lineTo(screenPos.x + isoWidth / 2, screenPos.y + isoHeight / 2);
    ctx.lineTo(screenPos.x, screenPos.y + isoHeight);
    ctx.lineTo(screenPos.x - isoWidth / 2, screenPos.y + isoHeight / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Get building color by tier
function getBuildingColor(tier) {
    const colors = {
        1: '#95a5a6',  // Gray - starter
        2: '#3498db',  // Blue - growing
        3: '#2ecc71',  // Green - established
        4: '#f39c12',  // Orange - major
        5: '#e74c3c'   // Red - metropolis!
    };
    return colors[tier] || '#95a5a6';
}

// Get darker version of color
function getDarkerColor(color) {
    // Simple darkening by reducing RGB values
    const rgb = hexToRgb(color);
    return `rgb(${Math.floor(rgb.r * 0.7)}, ${Math.floor(rgb.g * 0.7)}, ${Math.floor(rgb.b * 0.7)})`;
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Render selection indicator
function renderSelection() {
    if (gameState.selectedBuilding && !gameState.demolishMode) {
        // Draw text at top of screen
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            `Click to place: ${gameState.selectedBuilding.name} ($${gameState.selectedBuilding.cost})`,
            0, -canvas.height / 2 + 40
        );
    } else if (gameState.demolishMode) {
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🔨 DEMOLISH MODE - Click building to demolish', 0, -canvas.height / 2 + 40);
    }
}

// Adjust zoom
function adjustZoom(factor) {
    zoom *= factor;
    zoom = Math.max(0.5, Math.min(zoom, 2.0)); // Clamp between 0.5 and 2.0
    renderCanvas();
    console.log(`🔍 Zoom: ${zoom.toFixed(2)}`);
}

// Reset view
function resetView() {
    cameraX = 0;
    cameraY = 0;
    zoom = 1.0;
    renderCanvas();
    console.log('🎯 View reset!');
}

// Convert screen coordinates to grid coordinates
function screenToGrid(screenX, screenY) {
    // Hardcoded tile dimensions (128x64 isometric diamonds)
    const tileW = 128;
    const tileH = 64;
    
    // Adjust for camera and zoom
    const adjustedX = (screenX - canvas.width / 2 - cameraX) / zoom;
    const adjustedY = (screenY - canvas.height / 2 - cameraY) / zoom;
    
    // Isometric screen-to-grid conversion (inverse of gridToScreen)
    const gridX = Math.round((adjustedX / (tileW/2) + adjustedY / (tileH/2)) / 2);
    const gridY = Math.round((adjustedY / (tileH/2) - adjustedX / (tileW/2)) / 2);
    
    // Debug logging disabled to reduce console spam
    // console.log(`🔍 screenToGrid v4: screen(${screenX.toFixed(0)}, ${screenY.toFixed(0)}) adjusted(${adjustedX.toFixed(0)}, ${adjustedY.toFixed(0)}) -> grid(${gridX}, ${gridY})`);
    return { x: gridX, y: gridY };
}

// Convert grid coordinates to screen coordinates (isometric projection)
function gridToScreen(gridX, gridY) {
    // Hardcoded tile dimensions (128x64 isometric diamonds)
    const tileW = 128;
    const tileH = 64;
    
    // Standard isometric projection formula
    const screenX = (gridX - gridY) * (tileW / 2);
    const screenY = (gridX + gridY) * (tileH / 2);
    
    return { x: screenX, y: screenY };
}

// ============================================
// MOUSE WHEEL ZOOM
// ============================================

function handleMouseWheel(event) {
    event.preventDefault(); // Prevent page scroll
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Determine zoom direction (deltaY is negative for zoom in, positive for zoom out)
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const oldZoom = zoom;
    
    // Apply zoom with clamping
    zoom *= zoomFactor;
    zoom = Math.max(0.3, Math.min(zoom, 3.0)); // Allow 0.3x to 3x zoom
    
    // Adjust camera to zoom towards mouse position
    const zoomChange = zoom / oldZoom;
    cameraX = mouseX - (mouseX - cameraX) * zoomChange;
    cameraY = mouseY - (mouseY - cameraY) * zoomChange;
    
    renderCanvas();
}

// ============================================
// PAN/DRAG CONTROLS
// ============================================

let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let lastCameraX = 0;
let lastCameraY = 0;

function setupPanControls() {
    // Mouse drag to pan
    canvas.addEventListener('mousedown', (e) => {
        // Right click or middle mouse button = pan
        // OR hold space bar and left click
        if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
            e.preventDefault();
            isPanning = true;
            panStartX = e.clientX;
            panStartY = e.clientY;
            lastCameraX = cameraX;
            lastCameraY = cameraY;
            canvas.style.cursor = 'grabbing';
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isPanning) {
            const dx = e.clientX - panStartX;
            const dy = e.clientY - panStartY;
            
            cameraX = lastCameraX + dx;
            cameraY = lastCameraY + dy;
            
            renderCanvas();
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        if (isPanning) {
            isPanning = false;
            canvas.style.cursor = 'default';
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        if (isPanning) {
            isPanning = false;
            canvas.style.cursor = 'default';
        }
    });
    
    // Prevent context menu on right click
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Touch support for touchpad/mobile
    let touchStartDistance = 0;
    let touchStartZoom = 1.0;
    
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            // Single touch = pan
            isPanning = true;
            panStartX = e.touches[0].clientX;
            panStartY = e.touches[0].clientY;
            lastCameraX = cameraX;
            lastCameraY = cameraY;
        } else if (e.touches.length === 2) {
            // Two finger pinch = zoom
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            touchStartZoom = zoom;
        }
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isPanning) {
            // Pan
            const dx = e.touches[0].clientX - panStartX;
            const dy = e.touches[0].clientY - panStartY;
            
            cameraX = lastCameraX + dx;
            cameraY = lastCameraY + dy;
            
            renderCanvas();
        } else if (e.touches.length === 2) {
            // Pinch zoom
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const zoomChange = distance / touchStartDistance;
            zoom = touchStartZoom * zoomChange;
            zoom = Math.max(0.3, Math.min(zoom, 3.0));
            
            renderCanvas();
        }
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => {
        isPanning = false;
    });
}

// ============================================
// MOUSE TRACKING FOR GHOST PREVIEW
// ============================================

function setupMouseTracking() {
    canvas.addEventListener('mousemove', (e) => {
        if (!isPanning) {
            // Update mouse position
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Convert to grid coordinates with snapping
            const gridPos = screenToGrid(x, y);
            mouseGridX = gridPos.x;
            mouseGridY = gridPos.y;
            
            // Update cursor based on state
            if (gameState.selectedBuilding) {
                const isOccupied = isCellOccupied(mouseGridX, mouseGridY);
                canvas.style.cursor = isOccupied ? 'not-allowed' : 'crosshair';
            } else if (gameState.demolishMode) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
            
            // Re-render to show ghost
            renderCanvas();
        }
    });
    
    canvas.addEventListener('mouseenter', () => {
        isMouseOverCanvas = true;
        renderCanvas();
    });
    
    canvas.addEventListener('mouseleave', () => {
        isMouseOverCanvas = false;
        canvas.style.cursor = 'default';
        renderCanvas();
    });
}

// ============================================
// DEBUG OVERLAY SYSTEM (Toggle with 'D' key)
// ============================================

function renderDebugOverlay() {
    ctx.save();
    
    // Semi-transparent dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(10, 10, 400, 350);
    
    // Title
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('🐛 DEBUG MODE (Press D to toggle)', 20, 30);
    
    // Divider
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(20, 35);
    ctx.lineTo(400, 35);
    ctx.stroke();
    
    // Stats
    ctx.fillStyle = '#ffffff';
    ctx.font = '13px monospace';
    let y = 55;
    const lineHeight = 20;
    
    // Canvas info
    ctx.fillText(`Canvas: ${canvas.width}x${canvas.height}`, 20, y);
    y += lineHeight;
    ctx.fillText(`Camera: (${cameraX.toFixed(0)}, ${cameraY.toFixed(0)})`, 20, y);
    y += lineHeight;
    ctx.fillText(`Zoom: ${zoom.toFixed(2)}x`, 20, y);
    y += lineHeight;
    ctx.fillText(`Mouse Grid: (${mouseGridX}, ${mouseGridY})`, 20, y);
    y += lineHeight;
    
    // Divider
    y += 5;
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(400, y);
    ctx.stroke();
    y += 15;
    
    // Sprite loading stats
    const totalSprites = Object.keys(imageCache).length;
    const loadedSprites = Object.values(imageCache).filter(img => img.complete && img.naturalHeight !== 0).length;
    ctx.fillStyle = loadedSprites === totalSprites ? '#00ff00' : '#ffaa00';
    ctx.fillText(`Sprites: ${loadedSprites}/${totalSprites} loaded`, 20, y);
    y += lineHeight;
    
    // Building count
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Buildings placed: ${gameState.placedBuildings.length}`, 20, y);
    y += lineHeight;
    
    // Selected building info
    if (gameState.selectedBuilding) {
        y += 5;
        ctx.fillStyle = '#ffff00';
        ctx.fillText('Selected Building:', 20, y);
        y += lineHeight;
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText(`  Name: ${gameState.selectedBuilding.name}`, 20, y);
        y += lineHeight;
        ctx.fillText(`  Tier: ${gameState.selectedBuilding.tier}`, 20, y);
        y += lineHeight;
        ctx.fillText(`  Sprite: ${gameState.selectedBuilding.sprite}`, 20, y);
        y += lineHeight;
        
        // Check if sprite uses composite (base + roof)
        const spriteNum = gameState.selectedBuilding.sprite.replace('buildingTiles_', '').replace('.png', '');
        if (BUILDING_COMPOSITES && BUILDING_COMPOSITES[spriteNum]) {
            ctx.fillStyle = '#00ffff';
            ctx.fillText(`  ⚡ Composite: base_${BUILDING_COMPOSITES[spriteNum]}`, 20, y);
            y += lineHeight;
        }
        
        ctx.font = '13px monospace';
    }
    
    // Hovered building info
    const hoveredBuilding = gameState.placedBuildings.find(b => b.x === mouseGridX && b.y === mouseGridY);
    if (hoveredBuilding) {
        y += 5;
        ctx.fillStyle = '#00ffff';
        ctx.fillText('Hovered Building:', 20, y);
        y += lineHeight;
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText(`  Pos: (${hoveredBuilding.x}, ${hoveredBuilding.y})`, 20, y);
        y += lineHeight;
        ctx.fillText(`  Sprite: ${hoveredBuilding.sprite}`, 20, y);
        y += lineHeight;
        
        const img = imageCache[hoveredBuilding.sprite];
        if (img) {
            const status = img.complete && img.naturalHeight !== 0 ? '✅ Loaded' : '⏳ Loading';
            ctx.fillStyle = img.complete && img.naturalHeight !== 0 ? '#00ff00' : '#ffaa00';
            ctx.fillText(`  ${status}`, 20, y);
            y += lineHeight;
            if (img.complete && img.naturalHeight !== 0) {
                ctx.fillStyle = '#ffffff';
                ctx.fillText(`  Size: ${img.naturalWidth}x${img.naturalHeight}`, 20, y);
                y += lineHeight;
            }
        }
        ctx.font = '13px monospace';
    }
    
    ctx.restore();
}

// Keyboard shortcut for debug mode
document.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
        debugMode = !debugMode;
        console.log(`🐛 Debug mode: ${debugMode ? 'ON' : 'OFF'}`);
        renderCanvas();
    }
});

console.log('🎨 Canvas system loaded! Ready to RENDER! 💎');
