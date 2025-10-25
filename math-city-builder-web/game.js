import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Game State
const gameState = {
    cash: 100,
    buildingCount: 0,
    selectedBuildingIndex: -1,
    structures: [],
    placedBuildings: new Map(),
    currentMathChallenge: null,
    gridSize: 20
};

// Three.js Setup
let scene, camera, renderer, controls;
let grid, cursorPreview;
let raycaster, mouse;

// UI Elements
const ui = {
    cash: document.getElementById('cash'),
    buildingCount: document.getElementById('buildingCount'),
    selectedBuilding: document.getElementById('selectedBuilding'),
    buildingMenu: document.getElementById('buildingMenu'),
    mathChallenge: document.getElementById('mathChallenge'),
    mathProblem: document.getElementById('mathProblem'),
    mathAnswer: document.getElementById('mathAnswer'),
    mathFeedback: document.getElementById('mathFeedback'),
    loading: document.getElementById('loading'),
    progressBar: document.getElementById('progressBar'),
    loadingStatus: document.getElementById('loadingStatus')
};

// Initialize Three.js Scene
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 50, 150);

    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('gameCanvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(gameState.gridSize * 2, gameState.gridSize * 2);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x90EE90,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Helper
    grid = new THREE.GridHelper(gameState.gridSize * 2, gameState.gridSize * 2, 0x000000, 0x888888);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2.2;

    // Raycaster for mouse picking
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Window resize handler
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Load Structures from JSON
async function loadStructures() {
    try {
        ui.loadingStatus.textContent = 'Loading structure database...';
        ui.progressBar.style.width = '10%';

        const response = await fetch('structures.json');
        const data = await response.json();
        gameState.structures = data.structures;

        console.log(`Loaded ${gameState.structures.length} structures`);
        
        ui.progressBar.style.width = '30%';
        return data;
    } catch (error) {
        console.error('Error loading structures:', error);
        alert('Error loading structures! Check console.');
        return null;
    }
}

// Load 3D Models
const gltfLoader = new GLTFLoader();
const modelCache = new Map();

async function loadModel(modelPath) {
    if (modelCache.has(modelPath)) {
        return modelCache.get(modelPath).clone();
    }

    return new Promise((resolve, reject) => {
        gltfLoader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                modelCache.set(modelPath, model);
                resolve(model.clone());
            },
            (xhr) => {
                // Progress
            },
            (error) => {
                console.error(`Error loading model ${modelPath}:`, error);
                resolve(null);
            }
        );
    });
}

// Build Building Menu UI
function buildBuildingMenu(structuresData) {
    const categoriesDiv = document.getElementById('categories');
    const buildingsGrid = document.getElementById('buildingsGrid');

    // Category buttons
    const categories = [
        { key: 'all', name: 'All Buildings', count: structuresData.structures.length },
        { key: 'city-roads', name: 'Roads & Infrastructure', count: 0 },
        { key: 'suburban', name: 'Residential', count: 0 },
        { key: 'commercial', name: 'Commercial', count: 0 },
        { key: 'industrial', name: 'Industrial', count: 0 }
    ];

    // Count structures per category
    structuresData.structures.forEach(s => {
        const cat = categories.find(c => c.key === s.category);
        if (cat) cat.count++;
    });

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = `${cat.name} (${cat.count})`;
        btn.dataset.category = cat.key;
        btn.addEventListener('click', () => filterBuildings(cat.key));
        categoriesDiv.appendChild(btn);
    });

    // Set first button as active
    categoriesDiv.firstChild.classList.add('active');

    // Display all buildings initially
    filterBuildings('all');
}

function filterBuildings(category) {
    const buildingsGrid = document.getElementById('buildingsGrid');
    const categoryBtns = document.querySelectorAll('.category-btn');

    // Update active button
    categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    // Filter structures
    const filtered = category === 'all' 
        ? gameState.structures 
        : gameState.structures.filter(s => s.category === category);

    // Clear grid
    buildingsGrid.innerHTML = '';

    // Add building cards
    filtered.forEach((structure, index) => {
        const card = document.createElement('div');
        card.className = 'building-card';
        card.innerHTML = `
            <div class="name">${structure.name}</div>
            <div class="price">$${structure.price}</div>
        `;
        card.addEventListener('click', () => selectBuilding(structure.id));
        buildingsGrid.appendChild(card);
    });
}

function selectBuilding(structureId) {
    gameState.selectedBuildingIndex = structureId;
    const structure = gameState.structures[structureId];
    ui.selectedBuilding.textContent = structure.name;
    
    // Update visual selection
    document.querySelectorAll('.building-card').forEach((card, idx) => {
        card.classList.remove('selected');
    });
    
    // Close menu
    ui.buildingMenu.classList.remove('show');
    
    // Update cursor preview
    updateCursorPreview();
    
    console.log(`Selected: ${structure.name} ($${structure.price})`);
}
// Update Cursor Preview
async function updateCursorPreview() {
    // Remove old preview
    if (cursorPreview) {
        scene.remove(cursorPreview);
        cursorPreview = null;
    }

    if (gameState.selectedBuildingIndex === -1) return;

    const structure = gameState.structures[gameState.selectedBuildingIndex];
    const model = await loadModel(structure.model_path);
    
    if (model) {
        cursorPreview = model;
        cursorPreview.userData.isPreview = true;
        
        // Make it semi-transparent
        cursorPreview.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.7;
            }
        });
        
        scene.add(cursorPreview);
    }
}

// Math Challenge System
function startMathChallenge(gridX, gridZ) {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    const answer = num1 * num2;

    gameState.currentMathChallenge = {
        num1,
        num2,
        answer,
        gridX,
        gridZ
    };

    ui.mathProblem.textContent = `${num1}  ${num2} = ?`;
    ui.mathAnswer.value = '';
    ui.mathFeedback.textContent = '';
    ui.mathFeedback.className = 'feedback';
    ui.mathChallenge.classList.add('show');
    ui.mathAnswer.focus();

    console.log(`Math Challenge: ${num1}  ${num2} = ${answer}`);
}

function checkMathAnswer() {
    const userAnswer = parseInt(ui.mathAnswer.value);
    const challenge = gameState.currentMathChallenge;

    if (userAnswer === challenge.answer) {
        ui.mathFeedback.textContent = ' Correct! +$' + (gameState.structures[gameState.selectedBuildingIndex].price * 3);
        ui.mathFeedback.className = 'feedback correct';
        
        setTimeout(() => {
            ui.mathChallenge.classList.remove('show');
            placeBuilding(challenge.gridX, challenge.gridZ, true);
        }, 1000);
    } else {
        ui.mathFeedback.textContent = ` Wrong! The answer is ${challenge.answer}`;
        ui.mathFeedback.className = 'feedback wrong';
        
        setTimeout(() => {
            ui.mathChallenge.classList.remove('show');
            gameState.currentMathChallenge = null;
        }, 2000);
    }
}

function cancelMathChallenge() {
    ui.mathChallenge.classList.remove('show');
    gameState.currentMathChallenge = null;
}

// Place Building
async function placeBuilding(gridX, gridZ, answeredCorrectly = false) {
    if (gameState.selectedBuildingIndex === -1) return;

    const structure = gameState.structures[gameState.selectedBuildingIndex];
    const key = `${gridX},${gridZ}`;

    // Check if spot is occupied
    if (gameState.placedBuildings.has(key)) {
        console.log('Spot already occupied!');
        return;
    }

    // Check if enough cash
    if (gameState.cash < structure.price) {
        alert(`Not enough cash! You need ${structure.price}`);
        return;
    }

    // Handle payment: if answered correctly, get 3x bonus instead of paying
    if (answeredCorrectly) {
        const bonus = structure.price * 3;
        gameState.cash += bonus;
        console.log(` Correct answer! Bonus: +${bonus}`);
    } else {
        // Wrong answer or no challenge - pay normal price
        gameState.cash -= structure.price;
        console.log(` Paid ${structure.price}`);
    }

    // Load and place model
    const model = await loadModel(structure.model_path);
    if (model) {
        model.position.set(gridX, 0, gridZ);
        model.userData.gridX = gridX;
        model.userData.gridZ = gridZ;
        model.userData.structureId = structure.id;
        scene.add(model);

        gameState.placedBuildings.set(key, {
            model,
            structureId: structure.id
        });

        gameState.buildingCount++;
        updateUI();

        console.log(`Placed ${structure.name} at (${gridX}, ${gridZ})`);
    }
}

// Remove Building
function removeBuilding(gridX, gridZ) {
    const key = `${gridX},${gridZ}`;
    const building = gameState.placedBuildings.get(key);

    if (building) {
        const structure = gameState.structures[building.structureId];
        const refund = Math.floor(structure.price / 2);

        scene.remove(building.model);
        gameState.placedBuildings.delete(key);
        gameState.cash += refund;
        gameState.buildingCount--;

        updateUI();
        console.log(`Removed building, refunded $${refund}`);
    }
}

// Update UI
function updateUI() {
    ui.cash.textContent = gameState.cash;
    ui.buildingCount.textContent = gameState.buildingCount;
}

// Mouse Events
let mouseWorldPosition = new THREE.Vector3();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Raycast to ground plane
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    if (intersection) {
        const gridX = Math.round(intersection.x);
        const gridZ = Math.round(intersection.z);

        mouseWorldPosition.set(gridX, 0, gridZ);

        // Update cursor preview position
        if (cursorPreview) {
            cursorPreview.position.copy(mouseWorldPosition);
        }
    }
}

function onMouseClick(event) {
    if (event.button !== 0) return; // Only left click
    if (ui.buildingMenu.classList.contains('show')) return;
    if (ui.mathChallenge.classList.contains('show')) return;

    const gridX = Math.round(mouseWorldPosition.x);
    const gridZ = Math.round(mouseWorldPosition.z);

    // Check if within bounds
    if (Math.abs(gridX) > gameState.gridSize || Math.abs(gridZ) > gameState.gridSize) {
        return;
    }

    if (gameState.selectedBuildingIndex !== -1) {
        // Start math challenge before placing
        startMathChallenge(gridX, gridZ);
    }
}

// Keyboard Events
function onKeyDown(event) {
    switch(event.key.toLowerCase()) {
        case 'm':
            ui.buildingMenu.classList.toggle('show');
            break;
        case 'escape':
            ui.buildingMenu.classList.remove('show');
            ui.mathChallenge.classList.remove('show');
            break;
        case 'r':
            if (cursorPreview) {
                cursorPreview.rotation.y += Math.PI / 2;
            }
            break;
        case 'delete':
        case 'backspace':
            const gridX = Math.round(mouseWorldPosition.x);
            const gridZ = Math.round(mouseWorldPosition.z);
            removeBuilding(gridX, gridZ);
            break;
    }
}

// Event Listeners
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', onMouseClick);
window.addEventListener('keydown', onKeyDown);

document.getElementById('submitAnswer').addEventListener('click', checkMathAnswer);
document.getElementById('cancelMath').addEventListener('click', cancelMathChallenge);
document.getElementById('mathAnswer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkMathAnswer();
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize Game
async function init() {
    console.log(' Initializing Math City Builder...');
    
    initScene();
    
    const structuresData = await loadStructures();
    if (!structuresData) return;

    buildBuildingMenu(structuresData);

    ui.progressBar.style.width = '100%';
    ui.loadingStatus.textContent = 'Ready!';

    setTimeout(() => {
        ui.loading.style.display = 'none';
    }, 500);

    animate();
    
    console.log(' Game Ready!');
    console.log(`Total Structures: ${gameState.structures.length}`);
}

// Start the game
init();
