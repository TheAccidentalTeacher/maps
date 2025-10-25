/* ========================================
   BUILDING MENU (Phase 2) - CAROUSEL MODE
   Q/E to browse, large 3D preview
   ======================================== */

let currentCategory = 'roads';
let currentBuildingIndex = 0; // Current building in carousel

function openBuildingMenu() {
    const modal = document.getElementById('buildingMenu');
    modal.classList.remove('hidden');
    
    currentBuildingIndex = 0;
    showBuildingCarousel();
    
    console.log('🏗️ Building menu opened - Carousel mode');
}

function closeBuildingMenu() {
    const modal = document.getElementById('buildingMenu');
    modal.classList.add('hidden');
    
    // Dispose 3D engine if exists
    if (window.carouselEngine) {
        window.carouselEngine.dispose();
        window.carouselEngine = null;
    }
    
    console.log('❌ Building menu closed');
}

function switchCategory(category) {
    currentCategory = category;
    currentBuildingIndex = 0; // Reset to first
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`tab-${category}`).classList.add('active');
    
    // Show carousel
    showBuildingCarousel();
    
    console.log(`🔄 Switched to ${category} category`);
}

// ========================================
// 🎠 CAROUSEL SYSTEM
// ========================================

function showBuildingCarousel() {
    const buildings = gameState.structures.filter(b => b.category === currentCategory);
    
    if (buildings.length === 0) return;
    
    // Wrap index
    if (currentBuildingIndex < 0) currentBuildingIndex = buildings.length - 1;
    if (currentBuildingIndex >= buildings.length) currentBuildingIndex = 0;
    
    const building = buildings[currentBuildingIndex];
    const categoryName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    
    // Replace grid with carousel UI
    const grid = document.getElementById('buildingGrid');
    grid.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 25px; padding: 30px; max-width: 800px; margin: 0 auto;">
            
            <!-- Building Info -->
            <div style="text-align: center;">
                <h2 style="margin: 0 0 10px 0; font-size: 32px; color: white; font-weight: 600;">${building.name}</h2>
                <p style="margin: 0 0 8px 0; font-size: 28px; color: #ffa500; font-weight: bold;">$${building.price.toLocaleString()}</p>
                <p style="margin: 0; font-size: 16px; color: #aaa;">${categoryName} • Building ${currentBuildingIndex + 1} of ${buildings.length}</p>
            </div>
            
            <!-- Building Thumbnail (400x400 display from 450x450 native for crisp quality) -->
            <img src="${building.thumbnailPath}" alt="${building.name}" style="width: 400px; height: 400px; display: block; border-radius: 12px; border: 3px solid #555; box-shadow: 0 6px 20px rgba(0,0,0,0.5); object-fit: cover;">
            
            <!-- Keyboard Instructions -->
            <div style="text-align: center; color: #bbb; background: rgba(0,0,0,0.2); padding: 15px 30px; border-radius: 8px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6;">
                    <kbd style="background: #555; padding: 6px 12px; border-radius: 4px; margin: 0 4px; font-weight: 600;">Q</kbd> or 
                    <kbd style="background: #555; padding: 6px 12px; border-radius: 4px; margin: 0 4px; font-weight: 600;">←</kbd> Previous
                    <span style="margin: 0 20px; color: #666;">|</span>
                    <kbd style="background: #555; padding: 6px 12px; border-radius: 4px; margin: 0 4px; font-weight: 600;">E</kbd> or 
                    <kbd style="background: #555; padding: 6px 12px; border-radius: 4px; margin: 0 4px; font-weight: 600;">→</kbd> Next
                    <span style="margin: 0 20px; color: #666;">|</span>
                    <kbd style="background: #555; padding: 6px 12px; border-radius: 4px; margin: 0 4px; font-weight: 600;">Enter</kbd> Select
                </p>
            </div>
            
            <!-- Action Buttons -->
            <div style="display: flex; gap: 20px; align-items: center; justify-content: center; width: 100%;">
                <button id="btnPrevious" style="padding: 18px 35px; font-size: 17px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: transform 0.1s;">
                    ◀ Previous
                </button>
                <button id="btnSelectPlace" style="padding: 18px 45px; font-size: 19px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(245,87,108,0.4); transition: transform 0.1s;">
                    ✓ Select & Place
                </button>
                <button id="btnNext" style="padding: 18px 35px; font-size: 17px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: transform 0.1s;">
                    Next ▶
                </button>
            </div>
            
        </div>
    `;
    
    // Add event listeners with stopPropagation
    setTimeout(() => {
        document.getElementById('btnPrevious')?.addEventListener('click', (e) => {
            e.stopPropagation();
            previousBuilding();
        });
        
        document.getElementById('btnSelectPlace')?.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            selectCurrentBuilding();
        });
        
        document.getElementById('btnNext')?.addEventListener('click', (e) => {
            e.stopPropagation();
            nextBuilding();
        });
    }, 0);
    
    console.log(`🎠 Carousel: ${building.name} (${currentBuildingIndex + 1}/${buildings.length})`);
}

function nextBuilding() {
    currentBuildingIndex++;
    showBuildingCarousel();
}

function previousBuilding() {
    currentBuildingIndex--;
    showBuildingCarousel();
}

async function selectCurrentBuilding() {
    const buildings = gameState.structures.filter(b => b.category === currentCategory);
    const building = buildings[currentBuildingIndex];
    
    if (building) {
        gameState.selectedBuildingId = building.id;
        console.log(`✅ Selected: ${building.name} ($${building.price})`);
        
        // Preload the model into the main game cache if not already loaded
        if (!gameState.modelCache[building.modelPath]) {
            console.log(`📥 Preloading selected building into game cache: ${building.name}`);
            
            // Call the loadGLBModel function from city-builder.js
            if (window.loadGLBModel) {
                try {
                    await window.loadGLBModel(building.modelPath);
                    console.log(`✅ Model cached and ready for placement: ${building.name}`);
                } catch (error) {
                    console.error(`❌ Failed to cache model: ${building.name}`, error);
                    alert(`Failed to load building model. Please try again.`);
                    return;
                }
            }
        }
        
        // Close menu and enter placement mode
        closeBuildingMenu();
        
        // Enter placement mode with ghost preview (delay to prevent click bubbling)
        setTimeout(() => {
            if (window.enterPlacementMode) {
                window.enterPlacementMode();
            }
        }, 100);
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('buildingMenu');
    const isOpen = !modal.classList.contains('hidden');
    
    if (isOpen) {
        if (e.key === 'q' || e.key === 'Q' || e.key === 'ArrowLeft') {
            e.preventDefault();
            previousBuilding();
        } else if (e.key === 'e' || e.key === 'E' || e.key === 'ArrowRight') {
            e.preventDefault();
            nextBuilding();
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            selectCurrentBuilding();
        } else if (e.key === 'Escape') {
            closeBuildingMenu();
        }
    }
});

// Legacy functions (for compatibility)
function searchBuildings(term) {
    console.log(`🔍 Search disabled in carousel mode`);
}

function closeEarnCashModal() {
    const modal = document.getElementById('earnCashModal');
    modal.classList.add('hidden');
}

function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    modal.classList.add('hidden');
}

console.log('✅ Building Menu (Phase 2) - Carousel Mode loaded');
