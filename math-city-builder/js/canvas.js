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

// Check if a sprite needs a base building (it's just a roof)
function needsBaseBuilding(spriteFilename) {
    const spriteNum = spriteFilename.replace('buildingTiles_', '').replace('.png', '');
    return BUILDING_COMPOSITES && BUILDING_COMPOSITES[spriteNum];
}

// Load base building sprite for compositing
function loadBaseSprite(spriteFilename, tier) {
    const spriteNum = spriteFilename.replace('buildingTiles_', '').replace('.png', '');
    const baseNum = BUILDING_COMPOSITES[spriteNum];
    
    if (!baseNum) return null;
    
    const baseSprite = `buildingTiles_${baseNum}.png`;
    const key = `base_${baseSprite}`;
    
    if (!imageCache[key]) {
        const img = new Image();
        img.src = `${ASSET_PATH}tier${tier}/${baseSprite}`;
        imageCache[key] = img;
        
        img.onload = () => renderCanvas();
        img.onerror = () => console.error(`❌ Failed to load base: ${img.src}`);
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
    
    // Draw the grid
    renderGrid();
    
    // Draw all placed buildings
    renderBuildings();
    
    // Draw ghost preview if hovering
    renderGhostPreview();
    
    // Draw selection indicator
    renderSelection();
    
    // Restore context
    ctx.restore();
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
        
        // Load the building sprite
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
            
            // Vertical alignment: roads need to sit lower, buildings stay centered
            let yOffset = 0;
            if (building.tier === 0) {
                // Roads/decorations - move down to align with building sidewalk
                yOffset = 6;
            }
            // Buildings stay at natural center (yOffset = 0) to prevent jutting
            
            ctx.drawImage(
                img,
                screenPos.x - spriteWidth / 2,
                screenPos.y - spriteHeight / 2 + yOffset,
                spriteWidth,
                spriteHeight
            );
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
    
    // Check if spot is occupied
    const isOccupied = isCellOccupied(mouseGridX, mouseGridY);
    
    // Load the building sprite
    const img = loadBuildingImage(building);
    
    // Set ghost transparency
    ctx.globalAlpha = 0.5;
    
    if (img.complete && img.naturalHeight !== 0) {
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
        drawPlaceholder(screenPos, building.tier);
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
    
    // Show coordinates and status
    ctx.fillStyle = isOccupied ? '#e74c3c' : '#2ecc71';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
        isOccupied ? '❌ OCCUPIED' : '✓ PLACE HERE',
        screenPos.x,
        screenPos.y - 140
    );
    
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
    // Adjust for camera and zoom
    const adjustedX = (screenX - canvas.width / 2 - cameraX) / zoom;
    const adjustedY = (screenY - canvas.height / 2 - cameraY) / zoom;
    
    // Standard isometric conversion - 128x64 diamond (64x32 steps)
    const gridX = Math.floor((adjustedX / 64) + (adjustedY / 32));
    const gridY = Math.floor((adjustedY / 32) - (adjustedX / 64));
    
    return { x: gridX, y: gridY };
}

// Convert grid coordinates to screen coordinates (isometric projection)
function gridToScreen(gridX, gridY) {
    // Standard isometric: 128x64 diamond (64 x 32 steps)
    const screenX = (gridX - gridY) * 64;
    const screenY = (gridX + gridY) * 32;
    
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

console.log('🎨 Canvas system loaded! Ready to RENDER! 💎');
