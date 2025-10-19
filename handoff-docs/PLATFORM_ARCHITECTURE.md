# 🏗️ Detective Academy Platform - Architecture Guide
**Version:** 1.0  
**Date:** October 18, 2025  
**Purpose:** Multi-subject educational platform architecture

---

## 🎯 Platform Vision

The **Detective Academy Platform** is a modular educational system where each academic subject (Geography, Math, Science, ELA) is a standalone application that shares common infrastructure, design patterns, and core systems.

### Platform Goals

1. **Consistency**: Students experience the same UI/UX across all subjects
2. **Independence**: Each subject can evolve without breaking others
3. **Reusability**: Core systems (achievements, safety, AI) are shared patterns
4. **Scalability**: Easy to add new subjects (History, Art, Music, etc.)
5. **Maintainability**: Updates to core patterns propagate to all subjects

---

## 📐 Architecture Pattern: Independent Clone Strategy

### Why This Approach?

We're using **Independent Clones** (not shared libraries or monorepos) because:

✅ **Fastest to start** - Fork the repo 3 times, start building immediately  
✅ **Zero dependencies** - Each app deploys independently to Netlify  
✅ **Full flexibility** - Experiments don't break other subjects  
✅ **Simple deployment** - Each subject has its own domain/subdomain  
✅ **Easy handoff** - Give each AI a complete, self-contained codebase  

### Repository Structure

```
Geographic Detective Academy (ORIGINAL)
├── GitHub: TheAccidentalTeacher/maps
├── URL: geography.detective-academy.com
└── Status: PRODUCTION (85% complete)

Math Detective Academy (CLONE #1)
├── GitHub: TheAccidentalTeacher/math-detective
├── URL: math.detective-academy.com
└── Status: NEW (to be built)

Science Detective Academy (CLONE #2)
├── GitHub: TheAccidentalTeacher/science-detective
├── URL: science.detective-academy.com
└── Status: NEW (to be built)

ELA Detective Academy (CLONE #3)
├── GitHub: TheAccidentalTeacher/ela-detective
├── URL: ela.detective-academy.com
└── Status: NEW (to be built)
```

---

## 🔧 Core Systems (KEEP CONSISTENT)

These systems should be **nearly identical** across all subjects. When you improve one, manually port the improvement to others.

### 1. **UI Framework**

**Files to keep consistent:**
- Sidebar structure (HTML lines ~1179-1500 in Geography app)
- Card collapsible system (CSS lines ~600-800)
- Modal system (photo modals, achievement celebrations)
- Responsive design breakpoints (CSS media queries)
- Gen Alpha style toggle functionality

**What stays the same:**
```css
/* Sidebar positioning */
.location-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    width: 400px;
    height: 100vh;
    /* etc */
}

/* Card collapsible system */
.card-header {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    /* etc */
}
```

**What changes per subject:**
- Card titles (Location Header → Problem Header → Experiment Header)
- Icon choices (🌍 → 🔢 → 🔬)
- Color scheme (blue/green → purple/orange → green/blue → red/yellow)

---

### 2. **Achievement System**

**Files to keep consistent:**
- Achievement data structure (lines ~500-1000 in Geography)
- unlockAchievement() function
- showAchievementUnlock() animation
- localStorage persistence pattern
- XP calculation system

**Core pattern to replicate:**
```javascript
const ACHIEVEMENTS = {
    explore: {
        globeTrotter: {
            id: 'globeTrotter',
            name: 'Globe Trotter',
            description: 'Click on 10 different locations',
            tier: 'common',
            xp: 50,
            requirement: { markersPlaced: 10 }
        }
        // ... more achievements
    }
};

const playerAchievements = {
    unlocked: [],
    stats: {
        explore: { markersPlaced: 0, continentsVisited: new Set() },
        // ... more stats
    },
    lastUpdated: Date.now()
};
```

**What changes per subject:**
- Achievement categories (explore → practice, mystery → challenge, etc.)
- Achievement names (Globe Trotter → Number Cruncher → Lab Rat → Bookworm)
- Stat tracking (markersPlaced → problemsSolved → experimentsCompleted)
- Total: 45 achievements per subject (same number, different content)

---

### 3. **Nuclear Safety System**

**Files to keep consistent:**
- 3-layer filtering architecture
- Keyword scanning function
- Prompt engineering templates
- Vision AI validation (if using photos)
- Safety logging system

**Pattern to replicate:**
```javascript
// Layer 1: Keyword Scanning
const INAPPROPRIATE_KEYWORDS = [
    'violence', 'weapons', 'drugs', 'alcohol',
    // ... 50+ keywords
];

function containsInappropriateContent(text) {
    const lowerText = text.toLowerCase();
    return INAPPROPRIATE_KEYWORDS.some(keyword => 
        lowerText.includes(keyword)
    );
}

// Layer 2: Prompt Engineering
const AI_SAFETY_PROMPT = `You are an AI assistant for middle school students (ages 11-14).
CRITICAL RULES:
1. All content must be G-rated and classroom-appropriate
2. No violence, weapons, drugs, alcohol, or adult themes
3. Focus on educational value
4. Use age-appropriate language
// etc...`;

// Layer 3: Vision AI Validation (for photos)
async function validatePhotoContent(photoUrl, expectedContent) {
    // Check if photo matches expected educational content
    // Reject if inappropriate or off-topic
}
```

**What changes per subject:**
- Subject-specific keywords (add math/science/ELA inappropriate terms)
- Prompt engineering context (geography → math → science → reading)
- Content validation rules (map accuracy → math correctness → science accuracy)

---

### 4. **AI Integration**

**Files to keep consistent:**
- API wrapper functions (fetchWithRetry, error handling)
- Fallback chain pattern (Claude → GPT → Perplexity)
- Rate limiting logic
- Cost tracking/logging
- Caching system (localStorage)

**Pattern to replicate:**
```javascript
async function fetchAIContent(prompt, type = 'facts') {
    const SAFETY_PREFIX = AI_SAFETY_PROMPT;
    const fullPrompt = SAFETY_PREFIX + '\n\n' + prompt;
    
    try {
        // Try Claude 3.5 Sonnet first
        const response = await fetch('/.netlify/functions/get-ai-content', {
            method: 'POST',
            body: JSON.stringify({ 
                prompt: fullPrompt, 
                model: 'claude-3-5-sonnet' 
            })
        });
        
        if (!response.ok) {
            // Fallback to GPT-4o-mini
            return await fetchGPTFallback(fullPrompt);
        }
        
        const data = await response.json();
        
        // Layer 1 safety check
        if (containsInappropriateContent(data.content)) {
            console.error('Content rejected by safety filter');
            return getFallbackContent();
        }
        
        return data.content;
        
    } catch (error) {
        console.error('AI fetch error:', error);
        return getFallbackContent();
    }
}
```

**What changes per subject:**
- Prompt templates (geography facts → math explanations → science concepts)
- Fallback content (default facts → default hints → default definitions)
- Caching keys (location+country → problem+difficulty → experiment+topic)

---

### 5. **Gen Alpha Cultural Features**

**Files to keep consistent:**
- Loading animations (dancing 67 emoji)
- Style toggle functionality (regular ↔ Gen Alpha mode)
- Slang dictionary integration
- Celebration animations
- Visual design patterns (purple gradients, emoji usage)

**Pattern to replicate:**
```javascript
// Gen Alpha Loading Screen
function showGenAlphaLoading() {
    return `
        <div class="gen-alpha-loading">
            <div class="six-seven-dance">
                <span class="six-seven-big">6️⃣7️⃣</span>
                <div class="loading-text">
                    <span class="loading-word">Generating</span>
                    <span class="loading-word">content...</span>
                </div>
                <div class="vibe-check">✨ vibe check initiated ✨</div>
            </div>
        </div>
    `;
}

// Style Toggle
function toggleGenAlphaMode() {
    const isGenAlpha = document.body.classList.toggle('gen-alpha-mode');
    localStorage.setItem('genAlphaMode', isGenAlpha);
    
    // Update text content
    if (isGenAlpha) {
        updateTextToSlang();
    } else {
        updateTextToRegular();
    }
}
```

**What changes per subject:**
- Slang vocabulary (geography terms → math terms → science terms → ELA terms)
- Emoji choices (🌍🗺️ → 🔢➗ → 🔬⚗️ → 📚✍️)
- Color schemes (blue/green → purple/orange → teal/lime → red/pink)

---

## 🎨 Subject-Specific Content (CUSTOMIZE FREELY)

These elements are **completely different** for each subject. This is where creativity happens!

### 1. **Main Interactive Element**

**Geography:** Leaflet.js map with OpenStreetMap tiles  
**Math:** Canvas-based coordinate plane, number line, or graph  
**Science:** Interactive diagrams (periodic table, solar system, cell anatomy)  
**ELA:** Story map, plot diagram, character relationship web  

**Implementation approach:**
- Geography uses Leaflet.js library (keep it)
- Math might use Chart.js or custom Canvas
- Science might use D3.js or SVG animations
- ELA might use Cytoscape.js for network diagrams

---

### 2. **Game Modes (7 per subject)**

All subjects have **7 game modes**, but the content is adapted:

#### Geography (ORIGINAL)
1. **Free Explore** - Click anywhere, see location info
2. **Mystery Challenge** - Find coordinates within time limit
3. **Scavenger Hunt** - Find 10 specific locations
4. **Guess the Location** - Identify from satellite view
5. **Missions** - Complete geography objectives
6. **Create Heist** - Design custom challenges
7. **Alaska Adventure** - Regional deep-dive

#### Math (ADAPTED)
1. **Free Practice** - Click any point on coordinate plane, see equation
2. **Equation Challenge** - Solve equations within time limit
3. **Number Hunt** - Find 10 numbers that match criteria
4. **Guess the Function** - Identify function from graph
5. **Problem Sets** - Complete algebra/geometry objectives
6. **Create Puzzle** - Design custom math challenges
7. **Algebra Adventure** - Deep-dive into one math topic

#### Science (ADAPTED)
1. **Free Experiment** - Click any element, see properties
2. **Lab Challenge** - Complete experiments within time
3. **Element Hunt** - Find 10 elements with specific traits
4. **Guess the Reaction** - Identify chemical reactions
5. **Research Missions** - Complete science objectives
6. **Design Experiment** - Create custom lab challenges
7. **Chemistry Adventure** - Deep-dive into one science topic

#### ELA (ADAPTED)
1. **Free Reading** - Click any book, see summary
2. **Literary Challenge** - Identify literary devices in time limit
3. **Vocabulary Hunt** - Find 10 words with specific meanings
4. **Guess the Author** - Identify author from writing style
5. **Reading Missions** - Complete comprehension objectives
6. **Create Story** - Design custom reading challenges
7. **Shakespeare Adventure** - Deep-dive into one author/genre

---

### 3. **Data Sources**

Each subject needs different external data:

| Subject | Data Sources | APIs Needed |
|---------|-------------|-------------|
| **Geography** | Locations, countries, weather | Nominatim, REST Countries, OpenWeatherMap, Unsplash |
| **Math** | Equations, formulas, graphs | Wolfram Alpha API, Math.js library, LaTeX rendering |
| **Science** | Elements, experiments, facts | PubChem API, NASA API, Science facts APIs |
| **ELA** | Books, authors, quotes | Google Books API, Goodreads, Wikiquote |

**Cost estimates:**
- Geography: ~$3.60/month (mostly free APIs)
- Math: ~$5-10/month (Wolfram Alpha has costs)
- Science: ~$2-5/month (mostly free APIs)
- ELA: ~$2-5/month (mostly free APIs)

---

### 4. **Visual Theming**

Each subject gets a unique color scheme and visual identity:

```css
/* Geography - Blue/Green (Earth/Ocean) */
:root {
    --primary: #4299e1;      /* Sky blue */
    --secondary: #48bb78;    /* Forest green */
    --accent: #ed8936;       /* Sunset orange */
}

/* Math - Purple/Orange (Logic/Creativity) */
:root {
    --primary: #9f7aea;      /* Purple */
    --secondary: #f6ad55;    /* Orange */
    --accent: #fc8181;       /* Coral */
}

/* Science - Teal/Lime (Lab/Nature) */
:root {
    --primary: #319795;      /* Teal */
    --secondary: #68d391;    /* Lime green */
    --accent: #f687b3;       /* Pink (chemistry) */
}

/* ELA - Red/Yellow (Books/Creativity) */
:root {
    --primary: #e53e3e;      /* Book red */
    --secondary: #ecc94b;    /* Pencil yellow */
    --accent: #9f7aea;       /* Purple prose */
}
```

---

## 📦 File Structure (Standardized)

All subject apps use the same file structure for consistency:

```
detective-academy-[subject]/
├── index.html                    (9,000+ lines - main app)
├── netlify.toml                  (deployment config)
├── package.json                  (dependencies)
├── .env                          (API keys - DO NOT COMMIT)
├── .gitignore
│
├── netlify/functions/            (Serverless functions)
│   ├── get-ai-facts.js          (AI content generation)
│   ├── get-photos.js            (Photo search)
│   ├── get-weather.js           (Weather data - Geography only)
│   └── get-[subject]-data.js    (Subject-specific data)
│
├── docs/                         (Documentation)
│   ├── 00_START_HERE_FIRST.md
│   ├── README.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── USER_INSTRUCTIONS.md
│   ├── ACHIEVEMENTS_IMPLEMENTATION.md
│   ├── NUCLEAR_SAFETY_SYSTEM.md
│   ├── GEN_ALPHA_CULTURE_RESEARCH.md
│   ├── [SUBJECT]_GAME_MODES.md
│   └── DOCUMENTATION_INDEX.md
│
└── local-dev-server.js           (Development server)
```

---

## 🔄 Cross-Subject Update Strategy

When you improve a **core system** in one subject:

### Step 1: Identify the Change Type

**Core System Change?** (UI, achievements, safety, AI, Gen Alpha)
→ Should be ported to all subjects

**Subject-Specific Change?** (game modes, data sources, content)
→ Only affects one subject

### Step 2: Port Core Changes

1. Document the change in CHANGELOG.md
2. Create a "port checklist" with file locations
3. Manually apply to other subjects (search & replace)
4. Test each subject independently
5. Commit with clear message: "Port [feature] from Geography app"

### Example Port Checklist:

```markdown
## Porting Gen Alpha Loading Animation

Files to update in each subject:
- [ ] index.html lines 1843-1979 (CSS animations)
- [ ] index.html lines 4258-4277 (JavaScript function)
- [ ] index.html line 3279 (Integration call)

Search & Replace:
- "Generating facts..." → "Generating [content]..."
- "vibe check initiated" → (keep same)
- Function name: showGenAlphaLoading() → (keep same)

Test:
- [ ] Loading animation appears during AI generation
- [ ] 67 emoji dances correctly
- [ ] Purple gradient displays
- [ ] Text bounces appropriately
```

---

## 🚀 Deployment Strategy

Each subject deploys independently to Netlify:

### Domain Structure

**Option A: Subdomains (Recommended)**
```
geography.detective-academy.com
math.detective-academy.com
science.detective-academy.com
ela.detective-academy.com
```

**Option B: Paths**
```
detective-academy.com/geography
detective-academy.com/math
detective-academy.com/science
detective-academy.com/ela
```

### Netlify Setup (Per Subject)

1. **Create Netlify site** from GitHub repo
2. **Build settings:** None (static HTML)
3. **Publish directory:** `/`
4. **Environment variables:**
   - `OPENAI_API_KEY`
   - `CLAUDE_API_KEY`
   - `UNSPLASH_ACCESS_KEY`
   - `[SUBJECT_SPECIFIC_KEYS]`
5. **Functions directory:** `netlify/functions`
6. **Deploy:** Automatic on git push

### Cost Per Subject

| Resource | Cost/Month | Notes |
|----------|-----------|-------|
| Netlify hosting | FREE | 100GB bandwidth/month |
| Netlify functions | FREE | 125k requests/month |
| OpenAI GPT-4o-mini | $1-3 | ~$0.0002 per request |
| Claude 3.5 Sonnet | $2-5 | Primary AI (if used) |
| Photo APIs | FREE | Unsplash/Pexels |
| Subject APIs | $0-10 | Varies by subject |
| **TOTAL** | **$3-18** | **Per subject per month** |

---

## 🎯 Success Criteria (Per Subject)

Before launching a new subject app, it must meet these standards:

### ✅ Core Systems Checklist

- [ ] UI Framework matches Geography app (sidebar, cards, modals)
- [ ] Achievement system: 45 achievements implemented
- [ ] Nuclear Safety System: 3-layer filtering operational
- [ ] AI Integration: Claude + GPT fallback working
- [ ] Gen Alpha features: Loading, slang toggle, celebrations
- [ ] Error handling: All APIs have fallbacks
- [ ] Mobile responsive: Tested on phone/tablet
- [ ] localStorage: Progress persists across sessions

### ✅ Subject-Specific Checklist

- [ ] Main interactive element working (map/graph/diagram)
- [ ] 7 game modes implemented and tested
- [ ] Subject-specific data sources integrated
- [ ] Color scheme applied consistently
- [ ] Icons and emoji appropriate for subject
- [ ] Content is age-appropriate (middle school)
- [ ] Educational value validated by teacher
- [ ] Fun factor tested with students

### ✅ Documentation Checklist

- [ ] README.md updated with subject info
- [ ] USER_INSTRUCTIONS.md explains all 7 game modes
- [ ] EXECUTIVE_SUMMARY.md shows current status
- [ ] All documentation references correct subject
- [ ] Screenshots show actual subject content
- [ ] API keys documented in .env.example

### ✅ Deployment Checklist

- [ ] Deploys successfully to Netlify
- [ ] All environment variables configured
- [ ] Custom domain/subdomain connected
- [ ] SSL certificate active (HTTPS)
- [ ] Functions execute without errors
- [ ] No console errors in browser
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Performance: Load time < 3 seconds

---

## 🔮 Future Evolution: Shared Component Library (Phase 2)

After all 4 subjects are built, consider extracting core systems into a shared library:

### Potential Structure

```
detective-academy-core/          (NPM package)
├── achievements.js              (Achievement system)
├── safety.js                    (Nuclear safety filtering)
├── ai-integration.js            (AI API wrappers)
├── gen-alpha.js                 (Cultural features)
├── ui-components.js             (Reusable UI elements)
└── styles/
    ├── core.css                 (Shared styles)
    └── animations.css           (Shared animations)

geography-app/
├── package.json                 ("detective-academy-core": "^1.0.0")
├── index.html
└── geography-specific.js        (Game modes, map logic)

math-app/
├── package.json                 ("detective-academy-core": "^1.0.0")
├── index.html
└── math-specific.js             (Game modes, graph logic)
```

### Benefits of Phase 2

✅ **One update, four apps** - Fix a bug in core, all subjects benefit  
✅ **Smaller codebases** - Each subject is 2000 lines instead of 9000  
✅ **Easier onboarding** - New subjects only write game logic  
✅ **Version control** - Can rollback core without affecting subjects  

### Timeline

- **Now (October 2025):** Build 4 independent apps
- **After launch (January 2026):** Extract common patterns
- **Phase 2 (March 2026):** Migrate to shared library

---

## 📝 Naming Conventions (Critical!)

To make code portable, use consistent naming across subjects:

### File Names
- `index.html` - Main application (all subjects)
- `local-dev-server.js` - Development server (all subjects)
- `get-ai-facts.js` → `get-ai-content.js` (more generic)

### Function Names
```javascript
// GOOD - Generic, reusable
showLoadingAnimation()
unlockAchievement()
validateSafeContent()
fetchAIContent()

// BAD - Subject-specific
showMapLoadingAnimation()    // Too specific to geography
unlockGeographyAchievement()  // Won't work for math
```

### CSS Classes
```css
/* GOOD - Generic */
.sidebar-card
.gen-alpha-loading
.achievement-celebration

/* BAD - Subject-specific */
.location-sidebar-card        /* Change to .content-sidebar-card */
.map-loading                  /* Change to .main-loading */
```

### Variable Names
```javascript
// GOOD - Generic
let currentContent;
let userProgress;
let activeGameMode;

// BAD - Subject-specific
let currentLocation;    // For math, this might be "currentProblem"
let mapData;           // For science, this might be "diagramData"
```

---

## 🎓 Summary: The Big Picture

### What Stays Consistent (The Platform)
1. UI Framework (sidebar, cards, modals, responsiveness)
2. Achievement System (45 achievements, same structure)
3. Nuclear Safety System (3-layer filtering)
4. AI Integration (Claude + GPT, error handling)
5. Gen Alpha Features (loading, slang, celebrations)
6. File structure and naming conventions
7. Deployment process (Netlify, same setup)

### What Changes (The Subject)
1. Main interactive element (map → graph → diagram → story map)
2. Game mode implementations (adapted to subject matter)
3. Data sources and APIs (location APIs → math APIs → science APIs)
4. Visual theming (colors, icons, emoji)
5. Educational content (facts, problems, experiments, readings)
6. Achievement names/requirements (same structure, different goals)
7. Slang vocabulary (subject-specific Gen Alpha terms)

### The Handoff Pattern
1. Fork Geography repo → New subject repo
2. Search & replace subject-specific terms
3. Swap out main interactive element (map → graph)
4. Adapt 7 game modes to new subject
5. Update visual theme (colors, icons)
6. Integrate subject-specific APIs
7. Update all documentation
8. Deploy to Netlify subdomain
9. Test with students

---

**This architecture ensures:**
✅ Consistency across subjects (same UX)  
✅ Independence for innovation (each can evolve)  
✅ Rapid development (fork and adapt)  
✅ Easy maintenance (port improvements)  
✅ Scalability (add more subjects anytime)  

**Next:** See `SUBJECT_TEMPLATE_GUIDE.md` for step-by-step instructions and `AI_HANDOFF_PROMPTS.md` for ready-to-use AI prompts!
