# Coordinate Finder - Implementation Guide

**Version:** 1.0  
**Target Audience:** Developers  
**Prerequisites:** Understanding of JavaScript, Leaflet.js, HTML/CSS

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Code Structure](#code-structure)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Testing Procedures](#testing-procedures)
5. [Troubleshooting](#troubleshooting)
6. [Code Examples](#code-examples)

---

## Getting Started

### Prerequisites

Before implementing the Coordinate Finder feature, ensure you have:

1. ✅ Leaflet.js map initialized and working
2. ✅ Existing game mode system in place (mysteryActive, alaskaActive, etc.)
3. ✅ Basic understanding of JavaScript Promises and timers
4. ✅ localStorage support in target browsers
5. ✅ Development environment running (e.g., `python -m http.server 8000`)

### File Structure

All code will be added to `index.html` following the existing single-file architecture:

```
index.html
├── <style> section (CSS)
│   ├── Existing styles
│   ├── Coordinate Finder panel styles
│   ├── Timer display styles
│   └── Fun Mode styles
├── <body> section (HTML)
│   ├── Existing UI elements
│   ├── Coordinate Finder button (sidebar)
│   ├── Coordinate Finder panel (floating)
│   └── Timer overlay
└── <script> section (JavaScript)
    ├── Existing game logic
    ├── Coordinate Finder state management
    ├── Progressive reveal functions
    ├── Fun Mode toggle logic
    └── Game mode integration
```

---

## Code Structure

### State Variables (Add to JavaScript section)

```javascript
// Coordinate Finder state
let coordinateFinderActive = false;
let funModeEnabled = localStorage.getItem('funMode') === 'true' || false;
let progressiveRevealStage = 0; // 0=inactive, 1=hemi, 2=cont, 3=region, 4=pin
let revealTimerInterval = null;
let currentRevealTarget = { lat: 0, lon: 0 };
let revealTimeRemaining = 0;
let revealStartTime = 0;
```

### Constants (Add near top of script section)

```javascript
// Hemisphere boundaries
const HEMISPHERES = {
  NE: { bounds: [[0, 0], [90, 180]], zoom: 2 },
  NW: { bounds: [[0, -180], [90, 0]], zoom: 2 },
  SE: { bounds: [[-90, 0], [0, 180]], zoom: 2 },
  SW: { bounds: [[-90, -180], [0, 0]], zoom: 2 }
};

// Celebration messages for Fun Mode
const FUN_MESSAGES = [
  "W! Location found!",
  "Slay! You're locked in!",
  "No cap, you cracked!",
  "Ate and left no crumbs!",
  "Huge W!",
  "Main character energy!"
];

const SIX_SEVEN_MESSAGES = [
  "Siiiix seeeevven! 🎉 Location found!",
  "6-7! 🔥 You found it!",
  "six seven energy! 📍 Pin dropped!"
];

// Stage durations (in seconds)
const STAGE_DURATION = 20;
```

---

## Step-by-Step Implementation

### Phase 1: Basic Structure

#### Step 1: Add HTML for Coordinate Finder Button

**Location:** Inside the left sidebar, after existing mode buttons

```html
<!-- Add after Alaska Adventure button -->
<div class="mode-divider"></div>
<button id="coordinate-finder-btn" class="mode-btn" onclick="toggleCoordinateFinderPanel()" style="display: none;">
  📍 Coordinate Finder
</button>
```

#### Step 2: Add HTML for Floating Panel

**Location:** After the map container, before closing `</body>`

```html
<!-- Coordinate Finder Floating Panel -->
<div id="coordinate-finder-panel" class="coord-panel" style="display: none;">
  <div class="coord-panel-header" id="coord-panel-header">
    <span>📍 Coordinate Finder</span>
    <button class="coord-close-btn" onclick="closeCoordinateFinderPanel()">×</button>
  </div>
  
  <div class="coord-panel-content">
    <div class="coord-input-group">
      <label>Latitude</label>
      <input type="number" id="coord-lat-input" 
             placeholder="e.g., 40.71" 
             min="-90" max="90" step="0.01">
      <span class="coord-hint">°N / °S</span>
    </div>
    
    <div class="coord-input-group">
      <label>Longitude</label>
      <input type="number" id="coord-lon-input" 
             placeholder="e.g., -74.01" 
             min="-180" max="180" step="0.01">
      <span class="coord-hint">°E / °W</span>
    </div>
    
    <button id="coord-find-btn" class="coord-find-btn" onclick="startCoordinateFinder()">
      🔎 Find Location!
    </button>
    
    <div class="coord-divider"></div>
    
    <div class="coord-toggle-group">
      <label>Fun Mode</label>
      <div class="toggle-switch">
        <input type="checkbox" id="fun-mode-toggle" onchange="toggleFunMode()">
        <span class="toggle-slider"></span>
      </div>
      <span id="fun-mode-label">📚 Academic</span>
    </div>
  </div>
</div>

<!-- Timer Overlay (appears during progressive reveal) -->
<div id="coord-timer-overlay" class="coord-timer-overlay" style="display: none;">
  <div class="coord-timer-content">
    <div id="coord-timer-emoji">🌍</div>
    <div id="coord-timer-text">Locating Hemisphere...</div>
    <div class="coord-timer-bar">
      <div id="coord-timer-progress" class="coord-timer-progress"></div>
    </div>
    <div id="coord-timer-countdown">20s</div>
    <div class="coord-timer-hint">Click map to skip!</div>
  </div>
</div>
```

#### Step 3: Add CSS Styles

**Location:** Inside `<style>` section

```css
/* Coordinate Finder Panel */
.coord-panel {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 300px;
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 2000;
  font-family: Arial, sans-serif;
}

.coord-panel-header {
  background: #2c3e50;
  color: white;
  padding: 12px 15px;
  border-radius: 6px 6px 0 0;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.coord-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  line-height: 24px;
}

.coord-close-btn:hover {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

.coord-panel-content {
  padding: 20px;
}

.coord-input-group {
  margin-bottom: 15px;
}

.coord-input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.coord-input-group input {
  width: 100%;
  padding: 8px;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.coord-input-group input:focus {
  outline: none;
  border-color: #3498db;
}

.coord-hint {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 3px;
}

.coord-find-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.coord-find-btn:hover {
  background: #2980b9;
}

.coord-find-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.coord-divider {
  height: 1px;
  background: #ccc;
  margin: 20px 0;
}

.coord-toggle-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.coord-toggle-group label {
  font-weight: bold;
  color: #333;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #3498db;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

#fun-mode-label {
  font-size: 14px;
  color: #666;
}

/* Timer Overlay */
.coord-timer-overlay {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 3px solid #2c3e50;
  border-radius: 12px;
  padding: 20px 30px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  z-index: 2001;
  min-width: 300px;
  text-align: center;
}

#coord-timer-emoji {
  font-size: 48px;
  margin-bottom: 10px;
}

#coord-timer-text {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
}

.coord-timer-bar {
  width: 100%;
  height: 24px;
  background: #ecf0f1;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
}

.coord-timer-progress {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  width: 100%;
  transition: width 0.1s linear;
}

#coord-timer-countdown {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 10px;
}

.coord-timer-hint {
  font-size: 12px;
  color: #7f8c8d;
  font-style: italic;
}

/* Fun Mode Styles */
body.fun-mode .coord-panel {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-color: #0ff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

body.fun-mode .coord-panel-header {
  background: linear-gradient(90deg, #ff006e, #8338ec);
}

body.fun-mode .coord-input-group input {
  background: #16213e;
  color: #0ff;
  border-color: #0ff;
}

body.fun-mode .coord-find-btn {
  background: linear-gradient(90deg, #ff006e, #8338ec);
}

body.fun-mode .coord-timer-overlay {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-color: #0ff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.7);
}

body.fun-mode #coord-timer-text {
  color: #0ff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

body.fun-mode .coord-timer-progress {
  background: linear-gradient(90deg, #ff006e, #8338ec, #0ff);
}

/* Glitch animation for "six seven" */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.glitch-text {
  animation: glitch 0.3s infinite;
  color: #ff006e;
  text-shadow: 
    2px 0 #0ff,
    -2px 0 #ff006e;
}
```

---

### Phase 2: Core JavaScript Functions

#### Function 1: Panel Management

```javascript
// Toggle Coordinate Finder panel visibility
function toggleCoordinateFinderPanel() {
  const panel = document.getElementById('coordinate-finder-panel');
  coordinateFinderActive = !coordinateFinderActive;
  
  if (coordinateFinderActive) {
    panel.style.display = 'block';
    makePanelDraggable();
  } else {
    panel.style.display = 'none';
  }
}

function closeCoordinateFinderPanel() {
  coordinateFinderActive = false;
  document.getElementById('coordinate-finder-panel').style.display = 'none';
  
  // Clean up if reveal is in progress
  if (progressiveRevealStage > 0) {
    cancelProgressiveReveal();
  }
}

// Make panel draggable
function makePanelDraggable() {
  const panel = document.getElementById('coordinate-finder-panel');
  const header = document.getElementById('coord-panel-header');
  
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);
  
  function dragStart(e) {
    initialX = e.clientX - panel.offsetLeft;
    initialY = e.clientY - panel.offsetTop;
    
    if (e.target === header || e.target.parentNode === header) {
      isDragging = true;
    }
  }
  
  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      panel.style.left = currentX + 'px';
      panel.style.top = currentY + 'px';
      panel.style.right = 'auto'; // Remove right positioning
    }
  }
  
  function dragEnd() {
    isDragging = false;
  }
}
```

#### Function 2: Coordinate Validation

```javascript
// Validate coordinate inputs
function validateCoordinates(lat, lon) {
  // Check if values are numbers
  if (isNaN(lat) || isNaN(lon)) {
    return { valid: false, error: "Please enter valid numbers" };
  }
  
  // Check latitude range
  if (lat < -90 || lat > 90) {
    return { valid: false, error: "Latitude must be between -90 and 90" };
  }
  
  // Check longitude range
  if (lon < -180 || lon > 180) {
    return { valid: false, error: "Longitude must be between -180 and 180" };
  }
  
  return { valid: true };
}

// Get hemisphere for coordinates
function getHemisphere(lat, lon) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return ns + ew;
}
```

#### Function 3: Fun Mode Toggle

```javascript
// Toggle Fun Mode
function toggleFunMode() {
  funModeEnabled = !funModeEnabled;
  localStorage.setItem('funMode', funModeEnabled);
  updateFunModeUI();
}

// Update UI based on Fun Mode state
function updateFunModeUI() {
  const body = document.body;
  const label = document.getElementById('fun-mode-label');
  const toggle = document.getElementById('fun-mode-toggle');
  
  toggle.checked = funModeEnabled;
  
  if (funModeEnabled) {
    body.classList.add('fun-mode');
    label.textContent = '🎮 Fun Mode';
  } else {
    body.classList.remove('fun-mode');
    label.textContent = '📚 Academic';
  }
}

// Initialize Fun Mode on page load
function initFunMode() {
  funModeEnabled = localStorage.getItem('funMode') === 'true' || false;
  updateFunModeUI();
}
```

#### Function 4: Celebration Messages

```javascript
// Get celebration text based on Fun Mode
function getCelebrationText() {
  if (!funModeEnabled) {
    return "Location found!";
  }
  
  // 4.5% chance for "six seven" variant
  if (Math.random() < 0.045) {
    const idx = Math.floor(Math.random() * SIX_SEVEN_MESSAGES.length);
    return SIX_SEVEN_MESSAGES[idx];
  }
  
  // Random fun message
  const idx = Math.floor(Math.random() * FUN_MESSAGES.length);
  return FUN_MESSAGES[idx];
}

// Show celebration message
function showCelebrationMessage(text) {
  // Create temporary message overlay
  const overlay = document.createElement('div');
  overlay.className = 'celebration-overlay';
  overlay.innerHTML = `
    <div class="celebration-content ${text.includes('six seven') ? 'glitch-text' : ''}">
      ${text}
    </div>
  `;
  document.body.appendChild(overlay);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    overlay.remove();
  }, 3000);
}
```

---

### Phase 3: Progressive Reveal Implementation

#### Main Controller Function

```javascript
// Start Coordinate Finder with progressive reveal
function startCoordinateFinder() {
  // Get input values
  const latInput = document.getElementById('coord-lat-input');
  const lonInput = document.getElementById('coord-lon-input');
  
  const lat = parseFloat(latInput.value);
  const lon = parseFloat(lonInput.value);
  
  // Validate coordinates
  const validation = validateCoordinates(lat, lon);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }
  
  // Store target
  currentRevealTarget = { lat, lon };
  
  // Start Stage 1: Hemisphere
  startStage1Hemisphere();
}

// Cancel progressive reveal
function cancelProgressiveReveal() {
  if (revealTimerInterval) {
    clearInterval(revealTimerInterval);
    revealTimerInterval = null;
  }
  progressiveRevealStage = 0;
  document.getElementById('coord-timer-overlay').style.display = 'none';
}
```

#### Stage 1: Hemisphere

```javascript
function startStage1Hemisphere() {
  progressiveRevealStage = 1;
  
  // Get hemisphere
  const hemi = getHemisphere(currentRevealTarget.lat, currentRevealTarget.lon);
  const hemisphereData = HEMISPHERES[hemi];
  
  // Update timer UI
  document.getElementById('coord-timer-emoji').textContent = '🌍';
  document.getElementById('coord-timer-text').textContent = 'Locating Hemisphere...';
  document.getElementById('coord-timer-overlay').style.display = 'block';
  
  // Zoom to hemisphere
  map.fitBounds(hemisphereData.bounds, { animate: true, duration: 1.5 });
  
  // Start countdown
  startStageTimer(STAGE_DURATION, startStage2Continent);
}
```

#### Stage 2: Continent

```javascript
function startStage2Continent() {
  progressiveRevealStage = 2;
  
  // Calculate continent-level bounds (roughly 3-4x closer)
  const latRange = 40;
  const lonRange = 50;
  const bounds = [
    [currentRevealTarget.lat - latRange, currentRevealTarget.lon - lonRange],
    [currentRevealTarget.lat + latRange, currentRevealTarget.lon + lonRange]
  ];
  
  // Update timer UI
  document.getElementById('coord-timer-emoji').textContent = '🗺️';
  document.getElementById('coord-timer-text').textContent = 'Zooming to Continent...';
  
  // Zoom to continent
  map.fitBounds(bounds, { animate: true, duration: 1.5 });
  
  // Start countdown
  startStageTimer(STAGE_DURATION, startStage3Region);
}
```

#### Stage 3: Region

```javascript
function startStage3Region() {
  progressiveRevealStage = 3;
  
  // Calculate region-level bounds (roughly 3-4x closer)
  const latRange = 5;
  const lonRange = 5;
  const bounds = [
    [currentRevealTarget.lat - latRange, currentRevealTarget.lon - lonRange],
    [currentRevealTarget.lat + latRange, currentRevealTarget.lon + lonRange]
  ];
  
  // Update timer UI
  document.getElementById('coord-timer-emoji').textContent = '🔍';
  document.getElementById('coord-timer-text').textContent = 'Closing In...';
  
  // Zoom to region
  map.fitBounds(bounds, { animate: true, duration: 1.5 });
  
  // Start countdown
  startStageTimer(STAGE_DURATION, dropPinAtTarget);
}
```

#### Stage 4: Pin Drop

```javascript
function dropPinAtTarget() {
  progressiveRevealStage = 4;
  
  // Hide timer overlay
  document.getElementById('coord-timer-overlay').style.display = 'none';
  
  // Final zoom to precise location
  map.setView([currentRevealTarget.lat, currentRevealTarget.lon], 13, {
    animate: true,
    duration: 1.5
  });
  
  // Drop pin
  setTimeout(() => {
    const marker = L.marker([currentRevealTarget.lat, currentRevealTarget.lon])
      .addTo(map)
      .bindPopup(`
        <b>Location Found!</b><br>
        ${formatCoord(currentRevealTarget.lat, 'lat')}<br>
        ${formatCoord(currentRevealTarget.lon, 'lon')}
      `)
      .openPopup();
    
    // Show celebration
    const celebrationText = getCelebrationText();
    showCelebrationMessage(celebrationText);
    
    // Reset state
    progressiveRevealStage = 0;
  }, 1500);
}
```

#### Timer Helper

```javascript
function startStageTimer(duration, callback) {
  revealTimeRemaining = duration;
  revealStartTime = Date.now();
  
  // Update countdown immediately
  updateTimerDisplay();
  
  // Update every 100ms
  revealTimerInterval = setInterval(() => {
    const elapsed = (Date.now() - revealStartTime) / 1000;
    revealTimeRemaining = Math.max(0, duration - elapsed);
    
    updateTimerDisplay();
    
    if (revealTimeRemaining <= 0) {
      clearInterval(revealTimerInterval);
      callback();
    }
  }, 100);
}

function updateTimerDisplay() {
  const seconds = Math.ceil(revealTimeRemaining);
  const percentage = (revealTimeRemaining / STAGE_DURATION) * 100;
  
  document.getElementById('coord-timer-countdown').textContent = seconds + 's';
  document.getElementById('coord-timer-progress').style.width = percentage + '%';
}
```

---

### Phase 4: Game Mode Integration

```javascript
// Update Coordinate Finder button visibility based on mode
function updateCoordinateFinderVisibility() {
  const button = document.getElementById('coordinate-finder-btn');
  
  if (canUseCoordinateFinder()) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
    
    // Close panel if open
    if (coordinateFinderActive) {
      closeCoordinateFinderPanel();
    }
  }
}

// Check if Coordinate Finder is allowed
function canUseCoordinateFinder() {
  return !isGameModeActive();
}

// Check if any game mode is active
function isGameModeActive() {
  return (
    mysteryActive ||
    scavengerActive ||
    guessActive ||
    missionActive ||
    heistActive ||
    alaskaActive
  );
}

// Hook into existing switchMode function
// Add this line at the end of switchMode():
updateCoordinateFinderVisibility();

// Call on page load
window.addEventListener('DOMContentLoaded', () => {
  initFunMode();
  updateCoordinateFinderVisibility();
});
```

---

### Phase 5: Skip Functionality

```javascript
// Add map click handler for skipping
map.on('click', function(e) {
  // If progressive reveal is active, skip to pin drop
  if (progressiveRevealStage > 0 && progressiveRevealStage < 4) {
    clearInterval(revealTimerInterval);
    dropPinAtTarget();
  }
  
  // ... existing click handler code ...
});
```

---

## Testing Procedures

### Test 1: Basic Functionality

```javascript
// Test coordinate validation
console.log(validateCoordinates(40.71, -74.01)); // Should be valid
console.log(validateCoordinates(91, 0));         // Should be invalid
console.log(validateCoordinates(0, 181));        // Should be invalid

// Test hemisphere detection
console.log(getHemisphere(40.71, -74.01));  // Should be 'NW'
console.log(getHemisphere(-33.87, 151.21)); // Should be 'SE'

// Test celebration text
funModeEnabled = false;
console.log(getCelebrationText()); // Should be "Location found!"

funModeEnabled = true;
console.log(getCelebrationText()); // Should be random fun message
```

### Test 2: Progressive Reveal

**Manual Test Steps:**
1. Open browser to localhost:8000
2. Click "Free Explore" mode
3. Click "📍 Coordinate Finder" button
4. Enter coordinates: Lat 40.71, Lon -74.01
5. Click "Find Location!"
6. Verify:
   - Timer appears at bottom
   - Shows "🌍 Locating Hemisphere..."
   - Map zooms to northwest hemisphere
   - Progress bar animates
   - After 20s: Shows "🗺️ Zooming to Continent..."
   - Map zooms to North America
   - After 20s: Shows "🔍 Closing In..."
   - Map zooms to New York region
   - After 20s: Pin drops on NYC
   - Celebration message appears

### Test 3: Skip Functionality

**Manual Test Steps:**
1. Start coordinate finder with any coordinates
2. During Stage 1 (hemisphere), click anywhere on map
3. Verify:
   - Timer disappears
   - Pin drops immediately at target
   - Celebration message appears

### Test 4: Game Mode Integration

**Manual Test Steps:**
1. Start in Free Explore mode
2. Verify Coordinate Finder button visible
3. Switch to Mystery Challenge
4. Verify Coordinate Finder button disappears
5. Switch back to Free Explore
6. Verify Coordinate Finder button reappears

### Test 5: Fun Mode Toggle

**Manual Test Steps:**
1. Open Coordinate Finder panel
2. Toggle Fun Mode ON
3. Verify:
   - Panel colors change to gaming aesthetic
   - Toggle shows "🎮 Fun Mode"
4. Enter coordinates and find location
5. Verify fun celebration message appears
6. Refresh page
7. Verify Fun Mode still ON (persisted)
8. Toggle OFF
9. Verify academic styling returns

---

## Troubleshooting

### Issue: Panel doesn't drag

**Solution:** Check that `makePanelDraggable()` is called when panel opens:

```javascript
if (coordinateFinderActive) {
  panel.style.display = 'block';
  makePanelDraggable(); // ← Make sure this is here
}
```

### Issue: Timer doesn't update smoothly

**Solution:** Use smaller interval (100ms instead of 1000ms):

```javascript
revealTimerInterval = setInterval(() => {
  // ... update logic ...
}, 100); // ← 100ms for smooth updates
```

### Issue: Map doesn't zoom smoothly

**Solution:** Add animation options to fitBounds:

```javascript
map.fitBounds(bounds, { 
  animate: true, 
  duration: 1.5  // ← Add duration
});
```

### Issue: Fun Mode doesn't persist

**Solution:** Check localStorage save/load:

```javascript
// Save
localStorage.setItem('funMode', funModeEnabled);

// Load (on page load)
funModeEnabled = localStorage.getItem('funMode') === 'true' || false;
```

### Issue: Coordinate Finder visible during games

**Solution:** Ensure `updateCoordinateFinderVisibility()` is called in `switchMode()`:

```javascript
function switchMode(mode) {
  // ... existing mode switch code ...
  
  updateCoordinateFinderVisibility(); // ← Add this line
}
```

---

## Code Examples

### Example 1: Complete Coordinate Finder Button Click

```javascript
function startCoordinateFinder() {
  // Get and parse inputs
  const lat = parseFloat(document.getElementById('coord-lat-input').value);
  const lon = parseFloat(document.getElementById('coord-lon-input').value);
  
  // Validate
  const validation = validateCoordinates(lat, lon);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }
  
  // Store target
  currentRevealTarget = { lat, lon };
  
  // Close panel to show map
  coordinateFinderActive = false;
  document.getElementById('coordinate-finder-panel').style.display = 'none';
  
  // Start progressive reveal
  startStage1Hemisphere();
}
```

### Example 2: Adding Custom Sound Effects

```javascript
// Create audio elements (add to HTML)
const sounds = {
  woosh: new Audio('sounds/woosh.mp3'),
  boom: new Audio('sounds/boom.mp3'),
  sheesh: new Audio('sounds/sheesh.mp3'),
  ding: new Audio('sounds/ding.mp3'),
  sixSeven: new Audio('sounds/six-seven.mp3')
};

// Play sound based on Fun Mode
function playSuccessSound() {
  if (!funModeEnabled) {
    sounds.ding.play();
    return;
  }
  
  // 4.5% chance for six seven
  if (Math.random() < 0.045) {
    sounds.sixSeven.play();
    return;
  }
  
  // Random fun sound
  const soundKeys = ['boom', 'sheesh', 'woosh', 'ding'];
  const randomSound = soundKeys[Math.floor(Math.random() * soundKeys.length)];
  sounds[randomSound].play();
}

// Add to dropPinAtTarget function
function dropPinAtTarget() {
  // ... existing code ...
  
  playSuccessSound(); // ← Add this line
  showCelebrationMessage(getCelebrationText());
}
```

### Example 3: Adding Confetti Animation (Fun Mode)

```javascript
function showCelebrationMessage(text) {
  const overlay = document.createElement('div');
  overlay.className = 'celebration-overlay';
  overlay.innerHTML = `
    <div class="celebration-content ${text.includes('six seven') ? 'glitch-text' : ''}">
      ${text}
    </div>
  `;
  
  // Add confetti if Fun Mode
  if (funModeEnabled) {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.background = ['#ff006e', '#8338ec', '#0ff'][Math.floor(Math.random() * 3)];
      overlay.appendChild(confetti);
    }
  }
  
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.remove(), 3000);
}

// Add confetti CSS
/*
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  animation: confettiFall 2s ease-out forwards;
}

@keyframes confettiFall {
  to {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}
*/
```

---

## Next Steps

After implementing all phases:

1. ✅ Test thoroughly on localhost
2. ✅ Test on target devices (Chromebooks, mobile)
3. ✅ Gather user feedback from students
4. ✅ Iterate based on feedback
5. ✅ Document any issues or improvements
6. ✅ Commit to git when satisfied
7. ✅ Deploy to GitHub Pages

---

**Implementation Status:** Ready for Phase 1  
**Last Updated:** October 2025  
**Maintained By:** Development Team
