// GRID SYSTEM - The foundation of our city! 📐

const GRID_SIZE = 20; // 20x20 grid
const TILE_WIDTH = 128;  // Increased to match actual building footprint
const TILE_HEIGHT = 64;  // Standard isometric 2:1 ratio

// Initialize the grid
function initializeGrid() {
    console.log(`📐 Grid initialized: ${GRID_SIZE}x${GRID_SIZE}`);
}

// Render the grid
function renderGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Draw isometric grid
    for (let x = -10; x < 10; x++) {
        for (let y = -10; y < 10; y++) {
            const screenPos = gridToScreen(x, y);
            
            // Draw diamond shape for each cell
            ctx.beginPath();
            ctx.moveTo(screenPos.x, screenPos.y);
            ctx.lineTo(screenPos.x + TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
            ctx.lineTo(screenPos.x, screenPos.y + TILE_HEIGHT);
            ctx.lineTo(screenPos.x - TILE_WIDTH / 2, screenPos.y + TILE_HEIGHT / 2);
            ctx.closePath();
            ctx.stroke();
        }
    }
}

console.log('📐 Grid system loaded! Foundation is SOLID! 🏗️');
