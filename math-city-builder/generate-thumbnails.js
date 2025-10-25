/**
 * PRE-RENDER THUMBNAILS FOR ALL BUILDINGS
 * Uses Puppeteer + Babylon.js to render each model to a PNG image
 * Run: node generate-thumbnails.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load structures.json
const structuresPath = path.join(__dirname, 'structures.json');
const structures = JSON.parse(fs.readFileSync(structuresPath, 'utf8'));

// Create thumbnails directory
const thumbnailsDir = path.join(__dirname, 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
}

// HTML template for rendering
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <script src="babylon.max.js"></script>
    <script src="babylonjs.loaders.min.js"></script>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        canvas { width: 450px; height: 450px; }
    </style>
</head>
<body>
    <canvas id="renderCanvas" width="450" height="450"></canvas>
    <script>
        async function renderModel(modelPath) {
            const canvas = document.getElementById('renderCanvas');
            const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true });
            const scene = new BABYLON.Scene(engine);
            
            // Dark blue background (same as carousel)
            scene.clearColor = new BABYLON.Color4(0.1, 0.12, 0.18, 1);
            
            // Camera
            const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3, 8, BABYLON.Vector3.Zero(), scene);
            
            // Lights
            const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0.5), scene);
            light1.intensity = 1.5;
            const light2 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(-1, 0.5, -0.5), scene);
            light2.intensity = 1.0;
            
            return new Promise((resolve, reject) => {
                BABYLON.SceneLoader.ImportMesh('', '', modelPath, scene, (meshes) => {
                    if (meshes.length === 0) {
                        reject('No meshes loaded');
                        return;
                    }
                    
                    // Filter visible meshes
                    const visibleMeshes = meshes.filter(m => m.getTotalVertices && m.getTotalVertices() > 0);
                    
                    if (visibleMeshes.length === 0) {
                        reject('No visible meshes');
                        return;
                    }
                    
                    // Create parent
                    const parent = new BABYLON.TransformNode('parent', scene);
                    visibleMeshes.forEach(mesh => mesh.parent = parent);
                    
                    // Calculate bounds
                    let min = new BABYLON.Vector3(Infinity, Infinity, Infinity);
                    let max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);
                    
                    visibleMeshes.forEach(mesh => {
                        mesh.computeWorldMatrix(true);
                        const bounds = mesh.getBoundingInfo().boundingBox;
                        min = BABYLON.Vector3.Minimize(min, bounds.minimumWorld);
                        max = BABYLON.Vector3.Maximize(max, bounds.maximumWorld);
                    });
                    
                    const size = max.subtract(min);
                    const maxDim = Math.max(size.x, size.y, size.z);
                    
                    // Scale and center
                    const targetSize = 2.0;
                    const scale = targetSize / maxDim;
                    const center = min.add(max).scale(0.5);
                    parent.scaling = new BABYLON.Vector3(scale, scale, scale);
                    parent.position = center.scale(-scale);
                    
                    // Rotate slightly for better view
                    parent.rotation.y = Math.PI / 4;
                    
                    // Render a few frames to let everything load
                    let frameCount = 0;
                    engine.runRenderLoop(() => {
                        scene.render();
                        frameCount++;
                        if (frameCount === 5) {
                            engine.stopRenderLoop();
                            // Get canvas data
                            resolve(canvas.toDataURL('image/png'));
                        }
                    });
                }, null, (scene, message) => {
                    reject(message);
                });
            });
        }
        
        window.renderModel = renderModel;
    </script>
</body>
</html>
`;

async function generateThumbnails() {
    console.log('🚀 Starting HIGH-RES thumbnail generation (450x450)...');
    console.log(`📦 Found ${structures.length} buildings to process`);
    
    // Launch browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 450, height: 450 });
    
    // Save HTML template to temp file
    const tempHtmlPath = path.join(__dirname, 'temp-render.html');
    fs.writeFileSync(tempHtmlPath, htmlTemplate);
    
    // Navigate to the temp HTML via HTTP server (must be running on port 3000)
    await page.goto(`http://localhost:3000/math-city-builder/temp-render.html`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < structures.length; i++) {
        const building = structures[i];
        const modelPath = building.modelPath;
        
        // Convert relative path to absolute for file:// protocol
        try {
            console.log(`[${i + 1}/${structures.length}] Rendering: ${building.name}...`);
            
            // Call the renderModel function with the original model path (relative to server root)
            const dataUrl = await page.evaluate(async (modelPath) => {
                return await window.renderModel(modelPath);
            }, modelPath);
            
            // Save PNG
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
            const filename = `${building.category}_${building.name.replace(/\s+/g, '-').toLowerCase()}.png`;
            const outputPath = path.join(thumbnailsDir, filename);
            
            fs.writeFileSync(outputPath, base64Data, 'base64');
            console.log(`  ✅ Saved: ${filename}`);
            successCount++;
            
            // Update structures.json with thumbnail path
            structures[i].thumbnailPath = `thumbnails/${filename}`;
            
        } catch (error) {
            console.error(`  ❌ Failed: ${building.name}`, error.message);
            failCount++;
        }
    }
    
    // Save updated structures.json
    fs.writeFileSync(structuresPath, JSON.stringify(structures, null, 2));
    console.log('\n📝 Updated structures.json with thumbnail paths');
    
    // Cleanup
    await browser.close();
    fs.unlinkSync(tempHtmlPath);
    
    console.log('\n✅ COMPLETE!');
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
    console.log(`   Thumbnails saved to: ${thumbnailsDir}`);
}

// Run it
generateThumbnails().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
