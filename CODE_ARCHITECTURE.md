# Code Architecture Reference

**Version:** 2.0  
**Last Updated:** October 20, 2025  
**File:** index.html (9,702 lines)  
**Architecture:** Single-file application with embedded HTML, CSS, and JavaScript

---

## 📋 OVERVIEW

This document maps all major code sections in `index.html` with line number references for quick navigation.

### File Structure
```
index.html (9,702 lines)
├── HTML Structure (1-3159)
│   ├── Head & Meta Tags
│   ├── CSS Styles
│   ├── UI Components
│   └── Modal Dialogs
└── JavaScript Code (3160-9702)
    ├── Core Systems
    ├── Game Modes
    ├── Features
    └── Utilities
```

---

## 🗺️ CODE MAP BY LINE NUMBER

### PART 1: HTML & CSS (Lines 1-3159)

#### HTML Head (Lines 1-50)
- Meta tags and viewport configuration
- Title and description
- Leaflet.js CSS import
- OpenStreetMap attribution

#### CSS Styles (Lines 50-3000)
Key style sections:
- **Base styles:** Body, containers, typography
- **Color palette:** Cyberpunk theme (cyan, magenta, yellow)
- **Game panels:** Mode-specific styling
- **Buttons:** Primary, secondary, loading states
- **Modals:** Achievement unlocks, photo modals
- **Sidebar:** Location Explorer 8-card system
- **Responsive:** Mobile breakpoints (768px, 480px)

#### HTML Structure (Lines 3000-3159)
- **Map container:** `<div id="map">`
- **Top navigation:** XP display, mode switchers
- **Game panels:** 6 mode panels (explore, mystery, scavenger, guess, missions, create)
- **Sidebar:** Location Explorer with 8 cards
- **Modals:** Achievement, photo viewer, dialogs
- **Toast container:** Notification system
- **Loading overlay:** State management UI

---

### PART 2: JAVASCRIPT CODE (Lines 3160-9702)

---

## 🔧 CORE SYSTEMS

### 1. Toast Notification System
**Lines:** 3162-3206  
**Purpose:** Show temporary success/error/info messages

**Functions:**
- `showToast(type, title, message, duration)` - Display toast notification

**Types:** `'success'`, `'error'`, `'warning'`, `'info'`

**Example:**
```javascript
showToast('success', '✅ Location Found!', 'You found Anchorage!', 3000);
```

---

### 2. Loading State System
**Lines:** 3207-3259  
**Purpose:** Manage loading overlays and button states

**Functions:**
- `showLoading(text, subtext)` - Show full-screen loading overlay
- `hideLoading()` - Hide loading overlay
- `setButtonLoading(button)` - Disable button and add loading animation
- `removeButtonLoading(button)` - Re-enable button

**Example:**
```javascript
showLoading('Fetching photos...', 'This may take a moment');
// ... async operation ...
hideLoading();
```

---

### 3. Location Explorer Sidebar
**Lines:** 3260-3863  
**Purpose:** Interactive 8-card sidebar for location exploration

**Global Variables:**
- `currentLocation` - Currently displayed location object
- `exploredLocations` - Array of saved locations
- `locationStyleMode` - 'gen-alpha' or 'classic'
- `coordinateFormat` - 'decimal' or 'dms'

**Key Functions:**
- `toggleLocationSidebar()` - Show/hide sidebar
- `populateLocationData(lat, lon)` - Load location data into sidebar
- `saveLocation()` - Add location to collection
- `toggleCoordinateFormat()` - Switch between decimal and DMS
- `loadExploredLocations()` - Load from localStorage
- `saveExploredLocations()` - Save to localStorage

**8 Sidebar Cards:**
1. Coordinates (with decimal/DMS toggle)
2. Overview (place name, country, continent)
3. AI Facts (3 interesting facts)
4. Photos (3 location photos)
5. Weather (current conditions)
6. Distance from Home (Glennallen, Alaska)
7. Geography in Real Life (real-world connections)
8. Save Location (collection system)

---

### 4. Achievement System
**Lines:** 5727-6900  
**Purpose:** Track player progress and unlock achievements

**Data Structure:**
```javascript
let playerAchievements = {
  unlocked: [],        // Array of achievement IDs
  stats: {
    explore: {...},    // Explore mode stats
    coordinate: {...}, // Coordinate Finder stats
    mystery: {...},    // Mystery Challenge stats
    scavenger: {...},  // Scavenger Hunt stats
    guess: {...},      // Guess Mode stats
    heist: {...},      // Create Heist stats
    alaska: {...},     // Alaska Adventure stats
    universal: {...}   // Cross-mode stats
  },
  lastUpdated: ISO timestamp
}
```

**Key Functions:**
- `loadAchievements()` - Load from localStorage (restores Sets from arrays)
- `saveAchievements()` - Save to localStorage (converts Sets to arrays)
- `checkExploreAchievements()` - Check Explore mode achievements
- `checkMysteryAchievements()` - Check Mystery Challenge achievements
- `checkScavengerAchievements()` - Check Scavenger Hunt achievements
- `checkGuessAchievements()` - Check Guess Mode achievements
- `checkAlaskaAchievements()` - Check Alaska Adventure achievements
- `checkUniversalAchievements()` - Check cross-mode achievements
- `unlockAchievement(id)` - Unlock specific achievement with modal
- `trackPlayDate()` - Track unique play dates

**Achievement Categories:**
- **Explore Mode:** 8 achievements (7-day streak, world explorer, etc.)
- **Coordinate Finder:** 7 achievements (perfect finds, speed runs)
- **Mystery Challenge:** 10 achievements (streaks, speed solves)
- **Scavenger Hunt:** 6 achievements (completions, accuracy)
- **Guess Mode:** 7 achievements (perfect rounds, accuracy)
- **Create Heist:** 5 achievements (creator badges)
- **Alaska Adventure:** 10 achievements (region-specific)
- **Universal:** 6 achievements (gaming session, dedication)

**Total:** 59 achievements

---

### 5. Game State Management
**Lines:** 4928-5050  
**Purpose:** Centralized state for all game modes

**Data Structure:**
```javascript
let gameState = {
  totalXP: 0,
  currentMode: 'explore',
  mystery: {
    score: 0,
    streak: 0,
    bestStreak: 0,
    solved: 0,
    current: null,
    timer: null,
    active: false,
    roundsPlayed: 0,
    fastestTime: 999
  },
  scavenger: {
    challenges: [],
    completed: 0,
    active: false
  },
  guess: {
    score: 0,
    correct: 0,
    total: 0,
    round: 0,
    current: null,
    active: false
  },
  missions: [...],  // 4 missions with progress tracking
  heists: [],       // User-created heists
  alaska: {
    currentRound: 0,
    roundProgress: [0,0,0,0,0],
    totalFound: 0,
    active: false,
    foundLocations: []
  }
}
```

**State Management Functions:**
- `saveState()` (line 6977) - Save to localStorage
- `loadState()` (line 6960) - Load from localStorage on page load
- `updateAllDisplays()` (line 7000) - Sync UI with state

**Important:** All game modes set to `active: false` on page load to prevent auto-start bugs.

---

### 6. LocalStorage Management
**Lines:** 6960-6977  
**Purpose:** Persist game progress across sessions

**Storage Keys:**
- `geoDetectiveState` - Main game state
- `playerAchievements` - Achievement data
- `exploredLocations` - Location collection

**Load Pattern:**
```javascript
if (localStorage.getItem('geoDetectiveState')) {
    const saved = JSON.parse(localStorage.getItem('geoDetectiveState'));
    gameState = { ...gameState, ...saved };
    
    // Safety: Deactivate all games on load
    gameState.mystery.active = false;
    gameState.scavenger.active = false;
    gameState.guess.active = false;
    gameState.alaska.active = false;
    
    // Clear timers
    if (gameState.mystery.timer) {
        gameState.mystery.timer = null;
    }
}
```

**Save Pattern:**
```javascript
window.saveState = function() {
    localStorage.setItem('geoDetectiveState', JSON.stringify(gameState));
}
```

---

### 7. Mode Switching System
**Lines:** 7012-7080  
**Purpose:** Switch between game modes with proper cleanup

**Function:**
```javascript
window.switchMode = function(mode) {
    stopAllGameTimers();      // Clear all interval timers
    cleanupGameMarkers();     // Remove map markers
    
    gameState.currentMode = mode;
    
    // Deactivate all games
    gameState.mystery.active = false;
    gameState.scavenger.active = false;
    gameState.guess.active = false;
    gameState.alaska.active = false;
    
    // Update UI
    // ... button activation, panel switching ...
    
    if (mode === 'missions') {
        renderMissions();
    }
    
    saveState();
}
```

**Critical Functions:**
- `stopAllGameTimers()` (line 7045) - Centralized timer cleanup
- `cleanupGameMarkers()` (line 7055) - Remove all map markers

**Prevents:**
- Memory leaks from abandoned timers
- Duplicate markers on map
- Race conditions between modes

---

### 8. Map Initialization
**Lines:** 7700-7808  
**Purpose:** Initialize Leaflet map with OpenStreetMap tiles

**Configuration:**
```javascript
const geoMap = L.map('map').setView([61.2176, -149.8997], 5);
// Center: Glennallen, Alaska
// Zoom: 5 (shows most of Alaska)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(geoMap);
```

**Constants:**
- `GLENNALLEN` = `{ lat: 61.2176, lon: -149.8997 }` - Home base for distance calculations

**Global Variables:**
- `geoMap` - Leaflet map instance
- `currentMarker` - Active map marker
- `revealMarker` - Coordinate Finder reveal marker

---

### 9. Map Click Handler
**Lines:** 7839-7900  
**Purpose:** Route map clicks to active game mode

**Logic Flow:**
```javascript
geoMap.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    
    // 1. Check Coordinate Finder (progressive reveal)
    if (progressiveRevealActive && currentStage < 4) {
        skipToLocation(lat, lon);
        return;
    }
    
    // 2. Calculate distance from Glennallen
    const distFromHomeKm = calculateDistance(GLENNALLEN.lat, GLENNALLEN.lon, lat, lon);
    const distFromHomeMiles = distFromHomeKm * 0.621371;
    const bearingFromHome = calculateBearing(GLENNALLEN.lat, GLENNALLEN.lon, lat, lon);
    
    // 3. Route to active game mode
    if (gameState.mystery.active) {
        checkMysteryAnswer(lat, lon);
    } else if (gameState.scavenger.active) {
        checkScavengerAnswer(lat, lon);
    } else if (gameState.alaska.active) {
        checkAlaskaLocation(lat, lon);
    } else if (gameState.currentMode === 'create') {
        setHeistLocation(lat, lon);
    } else {
        // Free Explore mode
        showLocationInfo(lat, lon);
        populateLocationData(lat, lon);
    }
});
```

---

### 10. API Integration Layer
**Lines:** 7900-8000  
**Purpose:** Fetch location data with race condition prevention

**Race Condition Prevention:**
```javascript
let currentFetchController = null;
let lastFetchTime = 0;
const FETCH_DELAY = 1000; // 1 second minimum between calls

async function showLocationInfo(lat, lon) {
    // Cancel previous fetch
    if (currentFetchController) {
        currentFetchController.abort();
    }
    
    // Rate limiting
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    if (timeSinceLastFetch < FETCH_DELAY) {
        await new Promise(resolve => setTimeout(resolve, FETCH_DELAY - timeSinceLastFetch));
    }
    
    // Create new controller
    currentFetchController = new AbortController();
    const signal = currentFetchController.signal;
    
    // Fetch with abort signal
    const response = await fetch(url, { signal });
    
    // Check if aborted
    if (signal.aborted) {
        return;
    }
    
    // Process response
}
```

**APIs Called:**
- Nominatim (reverse geocoding)
- Netlify Functions (weather, photos, facts)

---

## 🎮 GAME MODES

### 11. Mystery Challenge
**Lines:** 8076-8310  
**Purpose:** Find locations using coordinate clues

**Main Functions:**
- `startMysteryGame()` - Initialize Mystery mode
- `startMystery()` - Start new mystery round
- `checkMysteryAnswer(lat, lon)` - Validate player guess
- `formatCoord(value, isLat)` - Convert coordinates to N/S/E/W format

**Game Flow:**
1. Random location selected from `mysteryLocations` array
2. Display coordinates in N/S/E/W format
3. Start 60-second timer
4. Show hint at 30 seconds (continent)
5. Show hint at 15 seconds (description)
6. Player clicks map to guess
7. Calculate distance with Haversine formula
8. Award XP based on accuracy and streak
9. Auto-restart after 3 seconds

**Timer System:**
```javascript
gameState.mystery.timer = setInterval(() => {
    timeLeft--;
    
    if (timeLeft === 30) {
        // Show continent hint
    }
    if (timeLeft === 15) {
        // Show description hint
    }
    if (timeLeft <= 0) {
        // Time's up - reset streak
        clearInterval(gameState.mystery.timer);
        startMystery();
    }
}, 1000);
```

**Scoring:**
- Base XP: 50
- Streak bonus: +10 per streak level
- Within 500km = success
- Tracks: fastest time, best streak, total solved

---

### 12. Scavenger Hunt
**Lines:** 8310-8509  
**Purpose:** Find 17 geographic features across 6 continents

**Main Functions:**
- `startScavengerGame()` - Initialize Scavenger mode
- `renderScavengerList()` - Display challenge list
- `checkScavengerAnswer(lat, lon)` - Validate location

**Challenge Structure:**
```javascript
const scavengerChallenges = [
    {
        id: 1,
        name: "Find a desert",
        hint: "Look for sandy, arid regions",
        validLocations: [...], // Array of valid lat/lon
        tolerance: 50, // miles
        continent: "Africa"
    },
    // ... 16 more challenges
]
```

**Game Flow:**
1. Display all 17 challenges
2. Show one challenge at a time
3. Player clicks map
4. Check distance to any valid location
5. Mark as complete if within tolerance
6. Reveal next challenge
7. Award XP (30 per find, 100 completion bonus)
8. Track completion for achievements

**Progressive Reveal:**
- Only current challenge clickable
- Completed challenges grayed out
- Progress bar updates

---

### 13. Guess Location Mode
**Lines:** 8509-8671  
**Purpose:** Identify locations from photos (multiple choice)

**Main Functions:**
- `startGuessGame()` - Initialize Guess mode
- `nextGuessRound()` - Load next photo
- `checkGuess(answer)` - Validate answer
- `getContinentForCountry(country)` - Helper function

**Game Flow:**
1. Load 5 random locations
2. Show photo of location
3. Display 4 multiple choice options
4. Player selects answer
5. Award points for correct answers
6. Track accuracy stats
7. Show final score after 5 rounds
8. Offer "Play Again"

**Photo Sources:**
- Unsplash (primary)
- Pexels (fallback)
- Netlify function: `get-photos`

**Scoring:**
- +20 XP per correct answer
- Track accuracy percentage
- Mission progress: "Get 5 correct"

---

### 14. Alaska Adventure (Missions)
**Lines:** 9145-9350  
**Purpose:** 5-round journey through Alaskan geography

**Main Functions:**
- `startAlaskaGame()` - Initialize Alaska mode
- `checkAlaskaLocation(lat, lon)` - Validate guess
- `showRoundComplete()` - Transition between rounds
- `showGameComplete()` - Final completion celebration

**5 Rounds:**
1. **Coastal Cities** (10 locations)
2. **Interior Alaska** (10 locations)
3. **Northern Region** (10 locations)
4. **Western Alaska** (10 locations)
5. **Grand Tour** (10 mixed locations)

**Data Structure:**
```javascript
const alaskaRounds = [
    {
        name: "Round 1: Coastal Cities",
        description: "Find major cities along Alaska's coast",
        locations: [
            {
                name: "Juneau",
                lat: 58.3019,
                lon: -134.4197,
                clue: "Alaska's capital city"
            },
            // ... 9 more
        ]
    },
    // ... 4 more rounds
]
```

**Game Flow:**
1. Start Round 1 (Coastal Cities)
2. Display 10 location clues
3. Player clicks map to find each
4. Award 30 XP per location
5. Complete round → +100 XP bonus
6. Progress to next round
7. Complete all 5 rounds → Alaska Expert achievement

**Achievements:**
- Mountain Master, River Runner, Park Explorer, City Finder
- Alaska Expert (all rounds complete)
- Alaska Speed Runner (under 30 minutes)

---

### 15. Create Heist Mode
**Lines:** 8721-8815  
**Purpose:** Students create location challenges for classmates

**Main Functions:**
- `saveHeist()` - Save user-created heist
- `setHeistLocation(lat, lon)` - Set heist target location
- `createAnotherHeist()` - Reset form for new heist
- `closeHeistOverlay()` - Dismiss success modal

**Heist Structure:**
```javascript
{
    id: Date.now(),
    name: "The Mystery of the Lost Mine",
    location: { lat: 61.5, lon: -149.0 },
    clues: [
        "This location is north of Anchorage",
        "Look for mountains and glaciers"
    ],
    created: "10/20/2025"
}
```

**Game Flow:**
1. Enter heist name
2. Click map to set location
3. Write 1-2 clues
4. Save heist (+50 XP)
5. Heist stored in gameState.heists array
6. Classmates can attempt to solve

**Future Features:**
- Share heists between students
- Leaderboard for most-solved heists
- Difficulty ratings

---

## 🛠️ UTILITY FUNCTIONS

### 16. Helper Functions
**Location:** Various lines

**calculateDistance(lat1, lon1, lat2, lon2)**
- Haversine formula for great-circle distance
- Returns distance in kilometers
- Used by all game modes for validation

**calculateBearing(lat1, lon1, lat2, lon2)**
- Calculate compass direction (N, NE, E, SE, S, SW, W, NW)
- Returns bearing in degrees (0-360)
- Used for "Distance from Home" display

**formatCoord(value, isLat)**
- Convert decimal degrees to N/S/E/W format
- Example: 61.2176 → "61.22° N"
- Line: 7809

**addXP(amount, reason)**
- Add experience points with notification
- Updates UI and saves state
- Line: 6982

**showNotification(message)**
- Show toast notification (2-second duration)
- Line: 6992

---

### 17. Data Arrays

**mysteryLocations** (line 8310+)
- 50+ predefined locations for Mystery Challenge
- Each has: name, lat, lon, continent, hint

**scavengerChallenges** (line 8510+)
- 17 geographic feature challenges
- Distributed across 6 continents

**alaskaRounds** (line 9145+)
- 5 rounds with 10 locations each
- 50 total Alaskan locations

**guessLocations** (line 8670+)
- 30+ photo-based quiz locations
- Each has: name, photo URL, multiple choice options

---

## 📊 DATA FLOW DIAGRAM

```
User Action (click map)
    ↓
Map Click Handler (7839)
    ↓
Route to Active Game Mode
    ├→ Mystery Challenge (8076)
    ├→ Scavenger Hunt (8310)
    ├→ Guess Mode (8509)
    ├→ Alaska Missions (9145)
    ├→ Create Heist (8721)
    └→ Free Explore (7900)
        ↓
    Fetch Location Data
        ├→ Nominatim API (reverse geocode)
        ├→ Netlify Functions
        │   ├→ Weather (get-weather.js)
        │   ├→ Photos (get-photos.js)
        │   └→ Facts (get-ai-facts.js)
        └→ Populate Sidebar (3260)
            ↓
        Update Achievement Stats (5727)
            ↓
        Check for Unlocks (6200+)
            ↓
        Save State to localStorage (6977)
```

---

## 🔍 QUICK REFERENCE TABLE

| Feature | Line Range | Key Functions |
|---------|-----------|---------------|
| Toast Notifications | 3162-3206 | showToast() |
| Loading Overlays | 3207-3259 | showLoading(), hideLoading() |
| Location Sidebar | 3260-3863 | populateLocationData() |
| Achievement System | 5727-6900 | loadAchievements(), unlockAchievement() |
| Game State | 4928-5050 | saveState(), loadState() |
| Mode Switching | 7012-7080 | switchMode(), stopAllGameTimers() |
| Map Initialization | 7700-7808 | L.map(), GLENNALLEN constant |
| Map Click Handler | 7839-7900 | Route to active mode |
| API Integration | 7900-8000 | showLocationInfo(), race condition prevention |
| Mystery Challenge | 8076-8310 | startMystery(), checkMysteryAnswer() |
| Scavenger Hunt | 8310-8509 | startScavengerGame(), checkScavengerAnswer() |
| Guess Mode | 8509-8671 | nextGuessRound(), checkGuess() |
| Alaska Missions | 9145-9350 | checkAlaskaLocation(), showRoundComplete() |
| Create Heist | 8721-8815 | saveHeist(), setHeistLocation() |
| Helper Functions | Various | calculateDistance(), formatCoord() |

---

## 🐛 CRITICAL CODE PATTERNS

### Pattern 1: Timer Cleanup
**Always clear timers before starting new ones**
```javascript
if (gameState.mystery.timer) {
    clearInterval(gameState.mystery.timer);
    gameState.mystery.timer = null;
}
```

### Pattern 2: Marker Cleanup
**Always remove old markers before adding new ones**
```javascript
if (currentMarker) {
    geoMap.removeLayer(currentMarker);
}
currentMarker = L.marker([lat, lon]).addTo(geoMap);
```

### Pattern 3: Abort Controllers
**Cancel in-flight API requests**
```javascript
if (currentFetchController) {
    currentFetchController.abort();
}
currentFetchController = new AbortController();
```

### Pattern 4: State Synchronization
**Save state after every mutation**
```javascript
gameState.totalXP += 50;
updateAllDisplays();
saveState();
```

### Pattern 5: Achievement Tracking
**Update stats, save, then check unlocks**
```javascript
playerAchievements.stats.mystery.solved++;
saveAchievements();
checkMysteryAchievements();
checkUniversalAchievements();
```

---

## 📝 ADDING NEW FEATURES

### Checklist for New Code:
1. [ ] Add section header with `// ===`
2. [ ] Document line range in this file
3. [ ] Add JSDoc comments for functions
4. [ ] Update Quick Reference Table
5. [ ] Update Data Flow Diagram if needed
6. [ ] Test timer cleanup if using intervals
7. [ ] Test marker cleanup if adding to map
8. [ ] Add saveState() calls after mutations
9. [ ] Update achievement tracking if relevant
10. [ ] Test localStorage persistence

---

## 🔗 RELATED DOCUMENTATION

- [NETLIFY_FUNCTIONS_REFERENCE.md](./NETLIFY_FUNCTIONS_REFERENCE.md) - API functions
- [CODE_DOCUMENTATION_AUDIT.md](./CODE_DOCUMENTATION_AUDIT.md) - Documentation review
- [README.md](./README.md) - Project overview
- [USER_INSTRUCTIONS.md](./USER_INSTRUCTIONS.md) - How to use features

---

**Last Updated:** October 20, 2025  
**Maintained By:** TheAccidentalTeacher  
**Total Lines:** 9,702  
**Code Sections:** 17 major sections documented
