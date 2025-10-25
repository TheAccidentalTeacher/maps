# 📋 Subject Template Guide - Creating New Detective Academy Apps
**Version:** 1.0  
**Date:** October 18, 2025  
**Purpose:** Step-by-step instructions for creating Math, Science, and ELA apps

---

## 🎯 Overview

This guide walks you through creating a new subject app (Math, Science, or ELA) by cloning the Geography Detective Academy and adapting it.

**Time estimate:** 2-4 weeks per subject (with AI assistance)

---

## 🚀 Quick Start: 7 Steps to New Subject

```
1. Fork Geography repo          (5 minutes)
2. Global search & replace      (30 minutes)
3. Swap main element            (2-5 days)
4. Adapt 7 game modes           (1-2 weeks)
5. Update visual theme          (2-3 hours)
6. Integrate subject APIs       (2-3 days)
7. Update documentation         (2-3 hours)
```

---

## STEP 1: Fork the Geography Repository

### 1.1 Create New GitHub Repository

**In GitHub:**
1. Go to your Geography repo: `github.com/TheAccidentalTeacher/maps`
2. Click "Fork" button (or create new repo and clone Geography as starting point)
3. Name it: `math-detective`, `science-detective`, or `ela-detective`
4. Description: "Math Detective Academy - Interactive math learning game"
5. Keep it Public (or Private if preferred)
6. Click "Create repository"

### 1.2 Clone to Your Local Machine

```powershell
# Navigate to your projects folder
cd C:\Users\scoso\WEBSITES

# Clone the new repository
git clone https://github.com/TheAccidentalTeacher/math-detective .

# OR if forked from Geography:
git clone https://github.com/TheAccidentalTeacher/math-detective .
```

### 1.3 Open in VS Code

```powershell
cd math-detective
code .
```

### 1.4 Create New Branch for Initial Setup

```powershell
git checkout -b initial-math-setup
```

---

## STEP 2: Global Search & Replace

This step renames all Geography-specific terms to your new subject.

### 2.1 Update Repository Metadata

**package.json:**
```json
{
  "name": "math-detective-academy",
  "version": "1.0.0",
  "description": "Interactive math learning game for middle school students",
  "repository": {
    "type": "git",
    "url": "https://github.com/TheAccidentalTeacher/math-detective"
  }
}
```

**README.md - Update first paragraph:**
```markdown
# Math Detective Academy

Math Detective Academy is an interactive web-based math learning application 
designed for middle school students. The app transforms traditional math education 
into an engaging, game-like experience where students explore mathematical concepts 
through seven different game modes.
```

### 2.2 Search & Replace in VS Code

Press `Ctrl+Shift+H` (Find and Replace in Files)

**Important:** Do these replacements in order, one at a time!

| Find | Replace | Files | Notes |
|------|---------|-------|-------|
| `Geographic Detective Academy` | `Math Detective Academy` | All files | App name |
| `Geography` | `Math` | All .md files | Subject name |
| `geography` | `math` | All files | Lowercase |
| `Location` | `Problem` | index.html | Main content type |
| `location` | `problem` | index.html | Lowercase |
| `locations` | `problems` | index.html | Plural |
| `maps` | `math-detective` | Documentation | Repo name |

**FOR SCIENCE APP:**

| Find | Replace |
|------|---------|
| `Geographic Detective Academy` | `Science Detective Academy` |
| `Location` | `Experiment` |
| `location` | `experiment` |

**FOR ELA APP:**

| Find | Replace |
|------|---------|
| `Geographic Detective Academy` | `ELA Detective Academy` |
| `Location` | `Reading` |
| `location` | `reading` |

### 2.3 Manual Updates Required

Some things can't be search & replace. Update these manually:

**index.html - Line ~10-20 (Title & Meta):**
```html
<title>Math Detective Academy - Learn Math Through Games</title>
<meta name="description" content="Interactive math learning games for middle school students. Explore algebra, geometry, and more through engaging challenges.">
```

**index.html - Line ~50-100 (Header):**
```html
<h1 id="app-title">🔢 Math Detective Academy</h1>
```

---

## STEP 3: Swap Main Interactive Element

This is the **biggest change**. Replace the map with your subject's main element.

### 3.1 Identify What to Replace

**Geography uses:**
- Leaflet.js map library
- OpenStreetMap tiles
- Click events on map
- Lat/lon coordinates
- Location markers

**You need:**
- Your subject's visualization library
- Interactive canvas/SVG/graph
- Click events on your element
- Subject-specific coordinates/data
- Content markers

### 3.2 Math App: Coordinate Plane

**Remove Geography map (index.html lines ~300-400):**
```html
<!-- DELETE THIS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
// DELETE map initialization
let geoMap = L.map('map').setView([62.1089, -145.5467], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(geoMap);
</script>
```

**Add Math coordinate plane:**
```html
<!-- ADD THIS -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<canvas id="coordinate-plane" width="800" height="600"></canvas>

<script>
// Initialize coordinate plane
const ctx = document.getElementById('coordinate-plane').getContext('2d');
let coordinatePlane;

function initializeCoordinatePlane() {
    coordinatePlane = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Points',
                data: [],
                backgroundColor: 'rgba(66, 153, 225, 0.5)'
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    min: -10,
                    max: 10,
                    grid: { color: '#e2e8f0' }
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    min: -10,
                    max: 10,
                    grid: { color: '#e2e8f0' }
                }
            },
            onClick: handlePlaneClick
        }
    });
}

function handlePlaneClick(event) {
    const points = coordinatePlane.getElementsAtEventForMode(
        event, 'nearest', { intersect: true }, true
    );
    
    if (points.length > 0) {
        const point = points[0];
        const x = coordinatePlane.data.datasets[0].data[point.index].x;
        const y = coordinatePlane.data.datasets[0].data[point.index].y;
        showProblemInfo(x, y);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeCoordinatePlane();
});
</script>
```

### 3.3 Science App: Periodic Table

**Add interactive periodic table:**
```html
<div id="periodic-table" class="periodic-table-grid">
    <!-- Generate 118 element cells -->
</div>

<style>
.periodic-table-grid {
    display: grid;
    grid-template-columns: repeat(18, 50px);
    gap: 2px;
    padding: 20px;
}

.element-cell {
    width: 50px;
    height: 60px;
    border: 1px solid #ddd;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.element-cell:hover {
    transform: scale(1.1);
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
</style>

<script>
function generatePeriodicTable() {
    const elements = [
        { symbol: 'H', number: 1, name: 'Hydrogen', x: 1, y: 1 },
        { symbol: 'He', number: 2, name: 'Helium', x: 18, y: 1 },
        // ... all 118 elements with grid positions
    ];
    
    const table = document.getElementById('periodic-table');
    elements.forEach(el => {
        const cell = document.createElement('div');
        cell.className = 'element-cell';
        cell.style.gridColumn = el.x;
        cell.style.gridRow = el.y;
        cell.innerHTML = `
            <div class="element-number">${el.number}</div>
            <div class="element-symbol">${el.symbol}</div>
        `;
        cell.onclick = () => showElementInfo(el);
        table.appendChild(cell);
    });
}
</script>
```

### 3.4 ELA App: Story Map

**Add story/plot diagram:**
```html
<svg id="story-map" width="1000" height="600" viewBox="0 0 1000 600">
    <!-- Freytag's Pyramid structure -->
    <path d="M 100 500 L 300 300 L 500 100 L 700 300 L 900 500" 
          stroke="#4299e1" stroke-width="3" fill="none"/>
    
    <!-- Interactive plot points -->
    <g id="plot-points"></g>
</svg>

<script>
const plotStructure = [
    { id: 'exposition', x: 100, y: 500, label: 'Exposition' },
    { id: 'rising-action', x: 300, y: 300, label: 'Rising Action' },
    { id: 'climax', x: 500, y: 100, label: 'Climax' },
    { id: 'falling-action', x: 700, y: 300, label: 'Falling Action' },
    { id: 'resolution', x: 900, y: 500, label: 'Resolution' }
];

function initializeStoryMap() {
    const pointsGroup = document.getElementById('plot-points');
    
    plotStructure.forEach(point => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 30);
        circle.setAttribute('fill', '#4299e1');
        circle.onclick = () => showPlotPointInfo(point);
        pointsGroup.appendChild(circle);
    });
}
</script>
```

---

## STEP 4: Adapt 7 Game Modes

Each subject needs 7 game modes. Here's how to adapt Geography's modes:

### 4.1 Mode Mapping

| Geography Mode | Math Mode | Science Mode | ELA Mode |
|----------------|-----------|--------------|----------|
| Free Explore | Free Practice | Free Experiment | Free Reading |
| Mystery Challenge | Equation Challenge | Lab Challenge | Literary Challenge |
| Scavenger Hunt | Number Hunt | Element Hunt | Vocabulary Hunt |
| Guess the Location | Guess the Function | Guess the Reaction | Guess the Author |
| Missions | Problem Sets | Research Missions | Reading Missions |
| Create Heist | Create Puzzle | Design Experiment | Create Story |
| Alaska Adventure | Algebra Adventure | Chemistry Adventure | Shakespeare Adventure |

### 4.2 Update Mode Switching Function

**Find in index.html (around line 1270):**
```javascript
function switchMode(mode) {
    // Hide all game sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected mode
    switch(mode) {
        case 'explore':
            // KEEP THIS - becomes "Free Practice" in math
            showExploreMode();
            break;
            
        case 'mystery':
            // ADAPT THIS - becomes "Equation Challenge" in math
            showMysteryMode();  // Rename to showEquationMode()
            break;
            
        case 'scavenger':
            // ADAPT THIS - becomes "Number Hunt" in math
            showScavengerMode();  // Rename to showNumberHuntMode()
            break;
            
        // etc...
    }
}
```

### 4.3 Example: Adapt Mystery Challenge → Equation Challenge

**Geography version (lines ~1400-1600):**
```javascript
function startMysteryChallenge() {
    // Pick random location
    const target = MYSTERY_LOCATIONS[Math.floor(Math.random() * MYSTERY_LOCATIONS.length)];
    
    // Show coordinates as clue
    document.getElementById('mystery-clue').textContent = 
        `Find: ${target.lat.toFixed(2)}° ${target.lat > 0 ? 'N' : 'S'}, ` +
        `${Math.abs(target.lon).toFixed(2)}° ${target.lon > 0 ? 'E' : 'W'}`;
    
    // Start timer
    let timeLeft = 60;
    gameState.mystery.timer = setInterval(() => {
        timeLeft--;
        document.getElementById('mystery-timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            endMysteryChallenge(false);
        }
    }, 1000);
    
    // Wait for map click
    geoMap.on('click', checkMysteryAnswer);
}

function checkMysteryAnswer(e) {
    const distance = calculateDistance(
        target.lat, target.lon,
        e.latlng.lat, e.latlng.lng
    );
    
    if (distance < 100) { // Within 100km
        endMysteryChallenge(true);
    } else {
        showHint(distance);
    }
}
```

**Math version (adapted):**
```javascript
function startEquationChallenge() {
    // Generate random equation
    const equation = generateRandomEquation();
    gameState.equation.target = equation.answer;
    
    // Show equation as clue
    document.getElementById('equation-clue').innerHTML = 
        `Solve: <span class="math-equation">${equation.latex}</span>`;
    
    // Render LaTeX
    renderMathInElement(document.getElementById('equation-clue'));
    
    // Start timer
    let timeLeft = 60;
    gameState.equation.timer = setInterval(() => {
        timeLeft--;
        document.getElementById('equation-timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            endEquationChallenge(false);
        }
    }, 1000);
    
    // Wait for graph click or input submission
    document.getElementById('answer-input').onchange = checkEquationAnswer;
}

function checkEquationAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer-input').value);
    const tolerance = 0.01;
    
    if (Math.abs(userAnswer - gameState.equation.target) < tolerance) {
        endEquationChallenge(true);
    } else {
        showHint(userAnswer);
    }
}

function generateRandomEquation() {
    // Generate random algebra equation
    const types = ['linear', 'quadratic', 'exponential'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    switch(type) {
        case 'linear':
            const m = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 20) - 10;
            return {
                latex: `${m}x + ${b} = 0`,
                answer: -b / m,
                type: 'linear'
            };
        // ... more types
    }
}
```

### 4.4 Game Mode Checklist (Per Mode)

For each of the 7 modes, ensure:

- [ ] Mode button in UI has correct name/icon
- [ ] Switching to mode hides other modes
- [ ] Main interactive element responds correctly
- [ ] Timer works (if timed mode)
- [ ] Scoring system awards XP
- [ ] Success/failure states trigger correctly
- [ ] Hints system works
- [ ] Mode integrates with achievement system
- [ ] Mobile-responsive layout
- [ ] Gen Alpha toggle affects mode text

---

## STEP 5: Update Visual Theme

### 5.1 Choose Color Scheme

**Geography: Blue/Green**
```css
:root {
    --primary: #4299e1;
    --secondary: #48bb78;
    --accent: #ed8936;
}
```

**Math: Purple/Orange**
```css
:root {
    --primary: #9f7aea;      /* Purple for logic */
    --secondary: #f6ad55;    /* Orange for creativity */
    --accent: #fc8181;       /* Coral for emphasis */
    --background: #1a202c;   /* Dark blue-gray */
    --text: #e2e8f0;         /* Light gray */
}
```

**Science: Teal/Lime**
```css
:root {
    --primary: #319795;      /* Teal for lab */
    --secondary: #68d391;    /* Lime for nature */
    --accent: #f687b3;       /* Pink for chemistry */
}
```

**ELA: Red/Yellow**
```css
:root {
    --primary: #e53e3e;      /* Red for books */
    --secondary: #ecc94b;    /* Yellow for pencils */
    --accent: #9f7aea;       /* Purple for poetry */
}
```

### 5.2 Update Gradients

**Find all gradient backgrounds (search for `linear-gradient`):**
```css
/* Geography */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Math - Update to */
background: linear-gradient(135deg, #9f7aea 0%, #f6ad55 100%);

/* Science - Update to */
background: linear-gradient(135deg, #319795 0%, #68d391 100%);

/* ELA - Update to */
background: linear-gradient(135deg, #e53e3e 0%, #ecc94b 100%);
```

### 5.3 Update Icons & Emoji

**Search for emoji in index.html and replace:**

| Geography | Math | Science | ELA |
|-----------|------|---------|-----|
| 🌍 | 🔢 | 🔬 | 📚 |
| 🗺️ | ➗ | ⚗️ | ✍️ |
| 📍 | 📐 | 🧪 | 📖 |
| 🧭 | ∑ | 🧬 | 📝 |
| ⛰️ | π | 🌡️ | 💭 |

**Header title (line ~50-100):**
```html
<!-- Geography -->
<h1 id="app-title">🌍 Geographic Detective Academy</h1>

<!-- Math -->
<h1 id="app-title">🔢 Math Detective Academy</h1>

<!-- Science -->
<h1 id="app-title">🔬 Science Detective Academy</h1>

<!-- ELA -->
<h1 id="app-title">📚 ELA Detective Academy</h1>
```

---

## STEP 6: Integrate Subject-Specific APIs

### 6.1 Math App APIs

**Add to netlify/functions/get-math-data.js:**
```javascript
// Option 1: Wolfram Alpha API (PAID - ~$5/month)
const WOLFRAM_API_KEY = process.env.WOLFRAM_API_KEY;

exports.handler = async (event) => {
    const { equation, type } = JSON.parse(event.body);
    
    try {
        const response = await fetch(
            `https://api.wolframalpha.com/v2/query?` +
            `input=${encodeURIComponent(equation)}&` +
            `appid=${WOLFRAM_API_KEY}&` +
            `output=json`
        );
        
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

**Option 2: Math.js Library (FREE)**
```javascript
const math = require('mathjs');

function generateProblem(difficulty) {
    switch(difficulty) {
        case 'easy':
            return {
                problem: `${math.randomInt(1, 10)} + ${math.randomInt(1, 10)}`,
                answer: math.evaluate(problem)
            };
        case 'medium':
            // Algebra problems
            break;
        case 'hard':
            // Calculus problems
            break;
    }
}
```

### 6.2 Science App APIs

**Add to netlify/functions/get-science-data.js:**
```javascript
// PubChem API (FREE)
exports.handler = async (event) => {
    const { element } = JSON.parse(event.body);
    
    try {
        const response = await fetch(
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${element}/JSON`
        );
        
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({
                name: data.PC_Compounds[0].props.find(p => p.urn.label === 'IUPAC Name').value.sval,
                formula: data.PC_Compounds[0].props.find(p => p.urn.label === 'Molecular Formula').value.sval,
                weight: data.PC_Compounds[0].props.find(p => p.urn.label === 'Molecular Weight').value.fval
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

### 6.3 ELA App APIs

**Add to netlify/functions/get-ela-data.js:**
```javascript
// Google Books API (FREE with limits)
const GOOGLE_BOOKS_KEY = process.env.GOOGLE_BOOKS_API_KEY;

exports.handler = async (event) => {
    const { query } = JSON.parse(event.body);
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?` +
            `q=${encodeURIComponent(query)}&` +
            `key=${GOOGLE_BOOKS_KEY}`
        );
        
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({
                books: data.items.map(item => ({
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown',
                    description: item.volumeInfo.description,
                    cover: item.volumeInfo.imageLinks?.thumbnail,
                    publishedDate: item.volumeInfo.publishedDate
                }))
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
```

### 6.4 Update .env File

```.env
# Math App
WOLFRAM_API_KEY=your_key_here
# or use Math.js (no key needed)

# Science App
# PubChem is free, no key needed
# NASA API (optional)
NASA_API_KEY=your_key_here

# ELA App
GOOGLE_BOOKS_API_KEY=your_key_here

# All apps (keep these from Geography)
OPENAI_API_KEY=your_key_here
CLAUDE_API_KEY=your_key_here
UNSPLASH_ACCESS_KEY=your_key_here
```

---

## STEP 7: Update Documentation

### 7.1 Files to Update

- [ ] README.md - Complete rewrite for subject
- [ ] 00_START_HERE_FIRST.md - Update quick navigation
- [ ] USER_INSTRUCTIONS.md - Explain new game modes
- [ ] EXECUTIVE_SUMMARY.md - Project overview
- [ ] ACHIEVEMENTS_IMPLEMENTATION.md - List new achievements
- [ ] [SUBJECT]_GAME_MODES.md - NEW FILE explaining each mode

### 7.2 README.md Template

```markdown
# [Subject] Detective Academy

[Subject] Detective Academy is an interactive web-based [subject] learning 
application designed for middle school students. The app transforms traditional 
[subject] education into an engaging, game-like experience.

## Game Modes

1. **Free [Activity]** - Explore [subject concepts] at your own pace
2. **[Subject] Challenge** - Solve [problems/puzzles] within time limits
3. **[Content] Hunt** - Find 10 [items] that match specific criteria
4. **Guess the [Item]** - Identify [concepts] from [visual clues]
5. **[Subject] Missions** - Complete structured learning objectives
6. **Create [Challenge Type]** - Design custom challenges for classmates
7. **[Topic] Adventure** - Deep-dive into one [subject area]

## Features

- ✅ 7 interactive game modes
- ✅ Achievement system with 45 unlockable achievements
- ✅ Nuclear Safety System (classroom-appropriate content)
- ✅ AI-powered [explanations/hints/facts]
- ✅ Gen Alpha cultural engagement features
- ✅ Mobile-responsive design
- ✅ No login required (localStorage persistence)

## Technology Stack

- HTML5, CSS3, Vanilla JavaScript
- [Main visualization library]
- Claude 3.5 Sonnet & GPT-4o-mini for AI features
- Netlify Functions for serverless APIs
- [Subject-specific APIs]

## Cost

~$3-18/month for API usage with 30+ students

## Getting Started

See [USER_INSTRUCTIONS.md](./USER_INSTRUCTIONS.md) for game instructions.
```

### 7.3 Create [SUBJECT]_GAME_MODES.md

```markdown
# [Subject] Detective Academy - Game Modes Guide

## Mode 1: Free [Activity]

**Description:** Click anywhere on [main element] to explore [subject content]

**How it works:**
1. Click on [element] (coordinate, element, word, etc.)
2. See [information panel] appear
3. Learn about [concept]
4. Earn XP for exploration

**Educational value:** Students learn [skill] through discovery

---

## Mode 2: [Subject] Challenge

**Description:** Solve [problems] within a 60-second time limit

**How it works:**
1. Click "[Challenge]" mode
2. See [problem/clue] appear
3. [Solve/find/identify] the answer
4. Click/submit before time runs out

**Difficulty levels:**
- Easy: [description]
- Medium: [description]
- Hard: [description]

**Educational value:** Students practice [skill] under time pressure

---

(Continue for all 7 modes...)
```

---

## ✅ Testing Checklist

Before considering your new subject app "done", test everything:

### Core Systems Testing

- [ ] **UI Framework**
  - [ ] Sidebar opens/closes smoothly
  - [ ] Cards collapse/expand
  - [ ] Modals appear centered
  - [ ] Mobile responsive (test on phone)

- [ ] **Achievement System**
  - [ ] Unlock achievement manually in console
  - [ ] Check localStorage saves
  - [ ] Refresh page - progress persists
  - [ ] Celebration animation appears
  - [ ] XP counter increments

- [ ] **Nuclear Safety System**
  - [ ] Enter inappropriate keyword in AI prompt
  - [ ] Content is rejected
  - [ ] Check console for safety logs
  - [ ] Verify G-rated content only

- [ ] **AI Integration**
  - [ ] AI facts generate without errors
  - [ ] Fallback works if primary AI fails
  - [ ] Loading animation appears
  - [ ] Content is educational and accurate

- [ ] **Gen Alpha Features**
  - [ ] Loading screen shows dancing 67
  - [ ] Style toggle changes text
  - [ ] Slang dictionary works
  - [ ] Celebrations have confetti

### Subject-Specific Testing

- [ ] **Main Interactive Element**
  - [ ] Loads without errors
  - [ ] Click events work
  - [ ] Coordinates/data display correctly
  - [ ] Zoom/pan works (if applicable)

- [ ] **All 7 Game Modes**
  - [ ] Each mode button switches correctly
  - [ ] Timers count down properly
  - [ ] Scoring awards XP
  - [ ] Success/failure states work
  - [ ] Hints appear when needed

- [ ] **Subject APIs**
  - [ ] All API calls succeed
  - [ ] Fallback content works
  - [ ] Error messages are friendly
  - [ ] Data displays correctly

### Documentation Testing

- [ ] All links work (no 404s)
- [ ] Screenshots show actual subject content
- [ ] Code examples are accurate
- [ ] Instructions are clear

### Performance Testing

- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari
- [ ] Works on mobile devices
- [ ] localStorage doesn't exceed quota

---

## 🚀 Deployment

### Local Testing

```powershell
# Run local dev server
node local-dev-server.js

# Test at http://localhost:8888
```

### Deploy to Netlify

1. **Push to GitHub:**
```powershell
git add -A
git commit -m "Initial Math Detective Academy setup"
git push origin main
```

2. **Connect to Netlify:**
   - Go to app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub → Select your math-detective repo
   - Build settings: (leave blank for static HTML)
   - Publish directory: `/`
   - Click "Deploy site"

3. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add all keys from .env file
   - Click "Save"

4. **Trigger Redeploy:**
   - Deploys → Trigger deploy → Deploy site

5. **Set Custom Domain:**
   - Domain settings → Add custom domain
   - math.detective-academy.com
   - Follow DNS instructions

---

## 📝 Version Control Strategy

### Branch Naming

```
main                    - Production-ready code
develop                 - Integration branch
feature/game-mode-1     - Individual features
fix/achievement-bug     - Bug fixes
docs/update-readme      - Documentation updates
```

### Commit Messages

```
feat: Add Equation Challenge game mode
fix: Resolve achievement unlock bug
docs: Update USER_INSTRUCTIONS.md with new modes
style: Update color scheme to purple/orange
refactor: Extract equation generator to separate function
test: Add tests for scoring system
```

### Merging to Main

Only merge to `main` when:
- All tests pass
- Documentation updated
- Tested on mobile
- No console errors
- Peer reviewed (or AI reviewed)

---

## 🎯 Success Criteria

Your new subject app is ready when:

✅ All 7 game modes work without errors  
✅ Achievement system awards XP correctly  
✅ Nuclear Safety System filters content  
✅ AI integration generates appropriate content  
✅ Visual theme is consistent and appealing  
✅ Documentation is complete and accurate  
✅ Deploys successfully to Netlify  
✅ Works on Chrome, Firefox, Safari  
✅ Mobile-responsive on phones/tablets  
✅ Tested with actual students (5-10 minimum)  
✅ Student feedback is positive  
✅ Educational value validated by teacher  

---

## 🆘 Common Issues & Solutions

### Issue: Map/Graph/Diagram Won't Load

**Solution:** Check browser console for errors. Most common:
- Library not loaded (check CDN link)
- Element ID mismatch (check HTML vs JavaScript)
- CSS z-index conflict (sidebar covering element)

### Issue: Achievements Won't Unlock

**Solution:** Check localStorage in DevTools:
1. F12 → Application tab → Local Storage
2. Look for `playerAchievements` key
3. Check if stats are incrementing
4. Verify requirement values match

### Issue: AI Content Inappropriate

**Solution:** Safety system needs tuning:
1. Add keywords to INAPPROPRIATE_KEYWORDS array
2. Update AI_SAFETY_PROMPT with stricter rules
3. Test with edge cases
4. Consider adding Vision AI validation

### Issue: Netlify Functions Failing

**Solution:** Check environment variables:
1. Netlify dashboard → Site settings → Environment variables
2. Verify all API keys present
3. Check function logs in Netlify dashboard
4. Test functions locally first

---

## 📚 Additional Resources

- **Chart.js Documentation:** https://www.chartjs.org/docs/
- **Math.js Documentation:** https://mathjs.org/docs/
- **PubChem API:** https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
- **Google Books API:** https://developers.google.com/books/docs/v1/using
- **Netlify Functions:** https://docs.netlify.com/functions/overview/

---

**Next:** See `AI_HANDOFF_PROMPTS.md` for ready-to-paste prompts to give to Claude/GPT for building your new subject app!
