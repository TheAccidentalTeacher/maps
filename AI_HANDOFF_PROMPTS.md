# 🤖 AI Handoff Prompts - Detective Academy Platform
**Version:** 1.0  
**Date:** October 18, 2025  
**Purpose:** Ready-to-use prompts for building Math, Science, and ELA apps with AI assistance

---

## 📋 How to Use These Prompts

1. **Fork the Geography repository** to create your new subject repo
2. **Open VS Code** in the new repository folder
3. **Start a NEW conversation** with Claude Sonnet 3.5, GPT-4, or GPT-5 Codex
4. **Copy the entire prompt** for your subject (Math, Science, or ELA)
5. **Paste it** into the AI chat and hit enter
6. **Follow the AI's guidance** as it builds your subject app
7. **Test frequently** to catch issues early

---

## ⚠️ Important Guidelines

**Before pasting any prompt:**
- ✅ Ensure you're in the correct repository folder
- ✅ Ensure you've forked/cloned the Geography app as starting point
- ✅ Have VS Code open with the Copilot extension active
- ✅ Ensure you have API keys ready (OpenAI, Claude, etc.)

**During development:**
- ✅ Test each game mode immediately after implementation
- ✅ Check browser console for errors frequently
- ✅ Commit working code before starting new features
- ✅ Ask the AI to explain complex code if needed

---

# 🔢 PROMPT 1: Math Detective Academy

```
CONTEXT: You are an expert educational software developer tasked with creating "Math Detective Academy," an interactive math learning game for middle school students (ages 11-14). This application is part of a multi-subject educational platform called "Detective Academy" where students learn through gamified exploration.

PROJECT STATUS: I have forked the "Geographic Detective Academy" application (a map-based geography learning game) as the starting point. The Geography app is 85% complete with 9,283 lines of code in index.html, featuring:
- 7 fully functional game modes
- Achievement system with 45 unlockable achievements
- Nuclear Safety System (3-layer content filtering for classroom use)
- AI integration (Claude 3.5 Sonnet + GPT-4o-mini fallback)
- Gen Alpha cultural features (loading animations, slang toggle)
- Location Explorer Sidebar with 8 interactive cards
- Vision AI photo-fact matching
- Netlify Functions for serverless APIs
- localStorage persistence (no login required)
- Mobile-responsive design

YOUR MISSION: Transform the Geography app into Math Detective Academy by:
1. Replacing the Leaflet.js map with an interactive coordinate plane/graphing system
2. Adapting all 7 game modes from geography concepts to math concepts
3. Keeping all core systems intact (achievements, safety, AI, Gen Alpha features)
4. Integrating math-specific APIs and libraries (Chart.js, Math.js, or Wolfram Alpha)
5. Updating visual theme to purple/orange color scheme
6. Creating 45 math-specific achievements
7. Ensuring all content is grade-appropriate (middle school algebra, geometry, basic stats)

DETAILED REQUIREMENTS:

## 1. MAIN INTERACTIVE ELEMENT (Replace Map)

**Remove:**
- Leaflet.js map library
- OpenStreetMap tiles
- Click events on world map
- Latitude/longitude coordinate system
- Location markers

**Add:**
- Interactive coordinate plane using Chart.js or custom Canvas
- X/Y axis with gridlines (-10 to +10 range initially, scalable)
- Click events on coordinate plane to place points
- Equation plotting capability
- Function graphing (linear, quadratic, exponential)
- Point markers for problems/solutions
- Zoom and pan functionality
- Axis labels and number formatting

**Technical Specifications:**
- Use Chart.js library for graphing: https://cdn.jsdelivr.net/npm/chart.js
- Canvas element ID: coordinate-plane
- Support scatter plots, line graphs, and function curves
- Click handler: handlePlaneClick(event)
- Coordinate range: configurable, default -10 to +10 for both axes
- Grid spacing: 1 unit, with major gridlines every 5 units
- Axis intersection at (0,0) must be clearly marked

## 2. GAME MODES (Adapt All 7)

### Mode 1: Free Practice (was Free Explore)
**Concept:** Students click anywhere on coordinate plane to generate random math problems
**Implementation:**
- Click (x,y) → Generate problem related to those coordinates
- Examples: "What's the distance from origin to (x,y)?", "What's the slope between (0,0) and (x,y)?"
- Display problem in sidebar card
- Allow students to input answer
- Provide step-by-step solution on request
- Award XP for correct answers (10 XP)

### Mode 2: Equation Challenge (was Mystery Challenge)
**Concept:** Solve equations within 60-second time limit
**Implementation:**
- Generate random equation (linear, quadratic, exponential)
- Display equation: "Solve: 3x + 7 = 19"
- Student inputs answer or clicks graph point
- Timer counts down from 60 seconds
- Hints after 30 seconds
- Award XP: 50 XP (correct), 25 XP (with hint), 0 XP (timeout)
- Streak tracking for consecutive correct answers

### Mode 3: Number Hunt (was Scavenger Hunt)
**Concept:** Find 10 numbers/points matching specific criteria
**Implementation:**
- Challenge examples:
  * "Find all prime numbers between 1-50"
  * "Find 5 points where y = 2x + 3"
  * "Find perfect squares less than 100"
- Student clicks/inputs numbers
- Visual feedback (green checkmark, red X)
- Progress bar (0/10)
- Time tracking (bonus XP for speed)

### Mode 4: Guess the Function (was Guess the Location)
**Concept:** Identify the function from its graph
**Implementation:**
- Show function graph (hide equation)
- Multiple choice: 4 possible equations
- Student selects correct equation
- Reveal answer with explanation
- Difficulty levels: Easy (linear), Medium (quadratic), Hard (exponential/trig)
- Award XP: 75 XP correct

### Mode 5: Problem Sets (was Missions)
**Concept:** Structured learning objectives (e.g., "Complete 5 algebra problems")
**Implementation:**
- Mission categories: Algebra, Geometry, Statistics, Pre-Calculus
- Progress tracking per category
- Sequential problems (must complete in order)
- Final problem is challenge problem (bonus XP)
- Unlock badges for completing sets

### Mode 6: Create Puzzle (was Create Heist)
**Concept:** Students design custom math challenges for classmates
**Implementation:**
- Choose problem type (equation, graph, word problem)
- Set difficulty level
- Input problem and solution
- Save to localStorage
- Share code feature (optional)
- Award XP for creativity (100 XP per puzzle created)

### Mode 7: Algebra Adventure (was Alaska Adventure)
**Concept:** Deep-dive into algebra concepts with progressive difficulty
**Implementation:**
- 5 rounds of increasing difficulty
- Round 1: Simple equations (2x + 3 = 7)
- Round 2: Multi-step equations (3(x - 4) = 15)
- Round 3: Equations with fractions
- Round 4: Systems of equations
- Round 5: Quadratic equations
- Story/theme: "Unlock the treasure by solving equations"

## 3. ACHIEVEMENTS (45 Total - Adapt from Geography)

### Practice Mode (5 achievements)
- **Number Cruncher:** Solve 10 problems ✅ 50 XP
- **Coordinate Master:** Plot 25 points ✅ 100 XP
- **Graph Expert:** Plot 10 different functions ✅ 150 XP
- **Problem Solver:** Solve 50 problems ✅ 250 XP
- **Math Wizard:** Solve 100 problems ✅ 500 XP

### Equation Challenge (7 achievements)
- **Quick Thinker:** Solve in under 30 seconds ✅ 75 XP
- **Speed Demon:** Solve 5 in a row quickly ✅ 150 XP
- **No Hints Needed:** Solve without using hints ✅ 100 XP
- **Algebra Ace:** Solve 10 algebra equations ✅ 200 XP
- **Streak Master:** 10 correct in a row ✅ 300 XP
- **Equation Expert:** Solve 25 equations ✅ 400 XP
- **Lightning Calculator:** Solve 50 equations ✅ 1000 XP

### Number Hunt (6 achievements)
- **Hunter:** Complete first number hunt ✅ 50 XP
- **Speed Hunter:** Complete in under 2 minutes ✅ 100 XP
- **Eagle Eye:** Complete with 100% accuracy ✅ 150 XP
- **Pattern Detective:** Find all numbers in pattern hunt ✅ 200 XP
- **Prime Finder:** Find all primes in prime hunt ✅ 250 XP
- **Hunt Legend:** Complete 10 number hunts ✅ 500 XP

### Guess the Function (6 achievements)
- **Function Spotter:** Guess first function correctly ✅ 50 XP
- **Math Genius:** Guess 5 functions correctly ✅ 150 XP
- **Instant Identifier:** Guess in under 10 seconds ✅ 100 XP
- **Graph Master:** Guess 10 functions ✅ 250 XP
- **Perfect Round:** 5/5 correct in one session ✅ 300 XP
- **Function Expert:** Guess 25 functions ✅ 500 XP

### Problem Sets (6 achievements)
- **Learner:** Complete first problem set ✅ 75 XP
- **Dedicated Student:** Complete 5 problem sets ✅ 150 XP
- **Algebra Master:** Complete all algebra sets ✅ 250 XP
- **Geometry Guru:** Complete all geometry sets ✅ 250 XP
- **Statistics Star:** Complete all stats sets ✅ 250 XP
- **Math Scholar:** Complete all problem sets ✅ 1000 XP

### Create Puzzle (6 achievements)
- **Puzzle Creator:** Create first puzzle ✅ 50 XP
- **Creative Mind:** Create 5 puzzles ✅ 100 XP
- **Challenge Designer:** Create 10 puzzles ✅ 200 XP
- **Puzzle Master:** Create 25 puzzles ✅ 400 XP
- **Difficulty Expert:** Create puzzles at all difficulty levels ✅ 300 XP
- **Community Builder:** Have 5 classmates solve your puzzle ✅ 500 XP

### Algebra Adventure (5 achievements)
- **Adventurer:** Complete Round 1 ✅ 50 XP
- **Equation Solver:** Complete Round 3 ✅ 150 XP
- **Algebra Hero:** Complete all 5 rounds ✅ 300 XP
- **Perfect Adventure:** Complete with 100% accuracy ✅ 500 XP
- **Speed Runner:** Complete in under 10 minutes ✅ 400 XP

### Universal (4 achievements)
- **Mode Explorer:** Try all 7 game modes ✅ 100 XP
- **Jack of All Trades:** Unlock achievements in 5 modes ✅ 300 XP
- **Master of All:** Unlock achievements in all 7 modes ✅ 1000 XP
- **Daily Scholar:** Play for 7 consecutive days ✅ 500 XP

## 4. VISUAL THEME

**Color Scheme (Purple/Orange for Math):**
```css
:root {
    --primary: #9f7aea;        /* Purple for logic/reasoning */
    --secondary: #f6ad55;      /* Orange for creativity */
    --accent: #fc8181;         /* Coral for emphasis */
    --background: #1a202c;     /* Dark blue-gray */
    --text: #e2e8f0;           /* Light gray text */
    --success: #68d391;        /* Green for correct */
    --error: #fc8181;          /* Red for incorrect */
}
```

**Icons & Emoji:**
Replace all geography emoji:
- 🌍 → 🔢 (numbers)
- 🗺️ → ➗ (division/operations)
- 📍 → 📐 (geometry tools)
- 🧭 → ∑ (summation)
- ⛰️ → π (pi symbol)

**Gradients:**
Update all `linear-gradient` from blue/green to purple/orange:
```css
background: linear-gradient(135deg, #9f7aea 0%, #f6ad55 100%);
```

## 5. API INTEGRATIONS

**Option 1: Math.js (FREE - Recommended for MVP)**
```javascript
// Add to index.html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js"></script>

// Generate problems
function generateProblem(type, difficulty) {
    switch(type) {
        case 'linear':
            const a = math.randomInt(1, 10);
            const b = math.randomInt(-20, 20);
            const c = math.randomInt(-20, 20);
            return {
                equation: `${a}x + ${b} = ${c}`,
                answer: (c - b) / a,
                steps: [
                    `${a}x + ${b} = ${c}`,
                    `${a}x = ${c - b}`,
                    `x = ${(c - b) / a}`
                ]
            };
        // Add quadratic, exponential, etc.
    }
}
```

**Option 2: Wolfram Alpha API (PAID - $5-10/month)**
Only if budget allows. Provides step-by-step solutions.

**LaTeX Rendering:**
Use KaTeX for beautiful math equations:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>

<script>
function renderMath(element) {
    katex.render('f(x) = x^2', element, {
        throwOnError: false
    });
}
</script>
```

## 6. NUCLEAR SAFETY SYSTEM (Keep from Geography)

**Add math-specific keywords to filter:**
```javascript
const INAPPROPRIATE_KEYWORDS = [
    // Keep all geography keywords, ADD:
    'cheat', 'hack', 'answer key', 'test answers',
    'homework answers', 'copy', 'plagiarize'
    // Note: We want to prevent cheating prompts to AI
];
```

**AI Prompt Engineering (update for math):**
```javascript
const AI_SAFETY_PROMPT = `You are a math tutor for middle school students (ages 11-14).

CRITICAL RULES:
1. Provide HINTS, not direct answers
2. Use step-by-step explanations
3. Encourage problem-solving thinking
4. Keep language age-appropriate (6th-8th grade)
5. Never provide complete solutions immediately
6. Focus on understanding concepts, not memorization
7. Make math fun and relatable (use real-world examples)
8. Celebrate mistakes as learning opportunities

MATH CONTENT FOCUS:
- Algebra (equations, expressions, inequalities)
- Geometry (shapes, area, volume, angles)
- Statistics (mean, median, mode, graphs)
- Basic pre-calculus (functions, graphs)

TONE: Encouraging, patient, enthusiastic about math`;
```

## 7. GEN ALPHA FEATURES (Keep from Geography)

**Update slang dictionary for math:**
```javascript
const MATH_SLANG = {
    // Regular → Gen Alpha
    'correct': 'no cap correct fr fr',
    'wrong': 'that\'s sus my guy',
    'solve': 'crack this code',
    'equation': 'math rizz',
    'graph': 'the plot',
    'answer': 'the tea',
    'problem': 'the vibe check',
    'calculate': 'run the numbers',
    'hint': 'low-key help',
    'easy': 'light work',
    'hard': 'built different',
    'excellent': 'straight bussin',
    'try again': 'run it back',
    'perfect score': 'no cap perfection'
};
```

**Keep the dancing 67 loading animation** - it's already perfect!

## 8. SIDEBAR CARDS (Adapt from Location Explorer)

### Card 1: Problem Header
- Problem number/ID
- Difficulty level (Easy/Medium/Hard)
- Topic category (Algebra/Geometry/etc.)
- "Add to favorites" button

### Card 2: Problem Details
- Full problem statement
- Input area for answer
- "Submit" button
- "Show hint" button (costs XP?)

### Card 3: Solution & Steps
- Step-by-step solution (collapsible)
- Visual representation (graph if applicable)
- Related concepts

### Card 4: AI Tutor
- "Ask the AI tutor" chat interface
- Provides hints, not answers
- Limited to 3 questions per problem

### Card 5: Similar Problems
- 3-5 problems of similar type
- Click to load new problem
- Difficulty range selector

### Card 6: Progress Tracker
- Problems solved today
- Current streak
- XP earned this session
- Achievement progress bars

### Card 7: Practice Recommendations
- AI suggests what to practice next
- Based on problems solved/missed
- "Weak areas" identification

### Card 8: Challenge Mode
- Daily challenge problem
- Leaderboard (optional)
- Bonus XP for completion

## 9. IMPORTANT TECHNICAL NOTES

**Search & Replace Rules:**
When transforming Geography code, use these exact replacements:

| Find | Replace | Context |
|------|---------|---------|
| `geoMap` | `coordinatePlane` | Main element variable |
| `location` | `problem` | Content type |
| `lat`, `lon` | `x`, `y` | Coordinates |
| `distance` | `result` | Calculation output |
| `country` | `topic` | Category |
| `reverseGeocode()` | `evaluateProblem()` | Data fetch function |
| `Location Explorer` | `Problem Explorer` | Sidebar title |

**DO NOT CHANGE:**
- Achievement system structure (keep identical)
- Nuclear safety filtering (keep identical)
- Gen Alpha loading animation (keep identical)
- localStorage pattern (keep identical)
- Netlify functions structure (keep identical)
- Error handling patterns (keep identical)

## 10. TESTING REQUIREMENTS

After implementation, test these scenarios:

**Core Systems:**
- [ ] Achievement unlocks and saves to localStorage
- [ ] Nuclear safety rejects inappropriate math queries
- [ ] Gen Alpha toggle changes math terminology
- [ ] AI tutor provides hints (not answers)
- [ ] All 7 game modes switch correctly

**Math Functionality:**
- [ ] Coordinate plane renders correctly
- [ ] Click events return (x,y) coordinates
- [ ] Equations display with proper formatting (LaTeX)
- [ ] Answer validation checks with tolerance (±0.01)
- [ ] Graphs plot correctly for all function types
- [ ] Step-by-step solutions display properly

**Mobile Responsiveness:**
- [ ] Coordinate plane scales on mobile
- [ ] Touch events work (tap to place point)
- [ ] Keyboard input works for answers
- [ ] Sidebar doesn't cover coordinate plane

**Performance:**
- [ ] Page loads in under 3 seconds
- [ ] No console errors
- [ ] Chart.js doesn't lag on interactions
- [ ] localStorage doesn't exceed quota after 100 problems

## 11. SUCCESS CRITERIA

Math Detective Academy is ready for students when:

✅ All 7 game modes work flawlessly  
✅ 45 achievements unlock correctly  
✅ Coordinate plane interactive and responsive  
✅ Math content is grade-appropriate (middle school)  
✅ AI tutor provides helpful hints (not full solutions)  
✅ Visual theme is consistent (purple/orange)  
✅ Nuclear safety prevents cheating attempts  
✅ Mobile-friendly on phones/tablets  
✅ Tested with 5-10 actual middle school students  
✅ Student feedback is positive ("This is fun!")  
✅ Educational value confirmed by math teacher  

## 12. DEPLOYMENT

When ready:
1. Push to GitHub repository: `math-detective`
2. Deploy to Netlify
3. Set custom domain: `math.detective-academy.com`
4. Add environment variables (API keys)
5. Test production deployment
6. Share with students!

## YOUR FIRST STEPS:

1. **Analyze the current Geography code** in index.html
2. **Propose an implementation plan** broken into phases
3. **Ask me to confirm** before starting major changes
4. **Implement Phase 1:** Replace map with coordinate plane
5. **Test coordinate plane** before continuing
6. **Implement Phase 2:** Adapt first game mode (Free Practice)
7. **Continue incrementally** through all 7 modes

## IMPORTANT CONSTRAINTS:

- **Budget:** Prefer free APIs (Math.js) over paid (Wolfram Alpha)
- **Timeline:** Aim for 2-4 weeks to completion
- **Code style:** Match Geography app's style (single index.html file)
- **Target audience:** Middle school students (ages 11-14)
- **Educational standards:** Align with Common Core Math standards

## QUESTIONS TO ASK ME:

Before implementing, ask me:
1. "Should we use Chart.js, Canvas, or another library for the coordinate plane?"
2. "What difficulty levels should we target? (e.g., 6th, 7th, 8th grade)"
3. "Should we include advanced topics like trigonometry or stick to algebra/geometry?"
4. "Do you want word problems or just equations?"
5. "Should we integrate with any school math curriculum?"

Now, analyze the current code and propose your implementation plan!
```

---

# 🔬 PROMPT 2: Science Detective Academy

```
CONTEXT: You are an expert educational software developer tasked with creating "Science Detective Academy," an interactive science learning game for middle school students (ages 11-14). This application is part of a multi-subject educational platform where students learn through gamified exploration.

PROJECT STATUS: I have forked the "Geographic Detective Academy" application (a map-based geography learning game) as the starting point. The Geography app is 85% complete with 9,283 lines of code featuring achievements, AI integration, Nuclear Safety System, and Gen Alpha cultural features.

YOUR MISSION: Transform the Geography app into Science Detective Academy by:
1. Replacing the world map with interactive science diagrams (periodic table, solar system, cell anatomy, etc.)
2. Adapting all 7 game modes from geography to science concepts
3. Keeping core systems intact (achievements, safety, AI, Gen Alpha)
4. Integrating science APIs (PubChem, NASA, science fact databases)
5. Updating visual theme to teal/lime color scheme
6. Creating 45 science-specific achievements
7. Ensuring content covers Biology, Chemistry, Physics, Earth Science

DETAILED REQUIREMENTS:

## 1. MAIN INTERACTIVE ELEMENTS (Choose Primary)

**Option A: Periodic Table (RECOMMENDED for MVP)**
```html
<div id="periodic-table" class="periodic-table-grid">
    <!-- 118 element cells, each clickable -->
</div>

<style>
.periodic-table-grid {
    display: grid;
    grid-template-columns: repeat(18, 50px);
    grid-template-rows: repeat(10, 60px);
    gap: 2px;
}

.element-cell {
    border: 1px solid #ccc;
    cursor: pointer;
    background: linear-gradient(135deg, #319795 0%, #68d391 100%);
}

.element-cell:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
</style>

<script>
const elements = [
    { symbol: 'H', number: 1, name: 'Hydrogen', mass: 1.008, group: 'nonmetal', x: 1, y: 1 },
    { symbol: 'He', number: 2, name: 'Helium', mass: 4.003, group: 'noble-gas', x: 18, y: 1 },
    // ... all 118 elements
];

function generatePeriodicTable() {
    const table = document.getElementById('periodic-table');
    elements.forEach(el => {
        const cell = document.createElement('div');
        cell.className = `element-cell ${el.group}`;
        cell.style.gridColumn = el.x;
        cell.style.gridRow = el.y;
        cell.innerHTML = `
            <div class="atomic-number">${el.number}</div>
            <div class="symbol">${el.symbol}</div>
            <div class="mass">${el.mass}</div>
        `;
        cell.onclick = () => showElementInfo(el);
        table.appendChild(cell);
    });
}
</script>
```

**Option B: Solar System (Alternative)**
Interactive solar system with planets, moons, asteroids

**Option C: Human Body/Cell Diagram (Alternative)**
Labeled anatomy diagrams with clickable parts

**Recommendation:** Start with Periodic Table (most data available via APIs), add others later

## 2. GAME MODES (Adapt All 7)

### Mode 1: Free Experiment (was Free Explore)
- Click any element → See properties, facts, uses
- Click body part → Learn about organ systems
- Click planet → Learn about celestial body
- Award 10 XP per exploration

### Mode 2: Lab Challenge (was Mystery Challenge)
- "Find the element with atomic mass closest to 35.5" (Answer: Chlorine, 35.45)
- "Which organ pumps blood?" (Answer: Heart)
- "Which planet is closest to the sun?" (Answer: Mercury)
- 60-second time limit
- Hints after 30 seconds

### Mode 3: Element Hunt (was Scavenger Hunt)
- "Find 5 noble gases"
- "Find all halogens"
- "Find elements in Group 1"
- "Find all organs in digestive system"
- Progress tracking (0/10)

### Mode 4: Guess the Reaction (was Guess the Location)
- Show chemical equation or biological process
- Multiple choice: What's the product? What's the function?
- Examples:
  * "2H₂ + O₂ → ?" (Answer: 2H₂O)
  * "Photosynthesis requires?" (Answer: Sunlight, water, CO₂)

### Mode 5: Research Missions (was Missions)
- Complete science objectives
- "Learn about 10 elements in the Alkali Metals group"
- "Discover all planets in the solar system"
- "Study the human respiratory system"

### Mode 6: Design Experiment (was Create Heist)
- Students design hypothetical experiments
- Choose variables: independent, dependent, controlled
- Predict outcomes
- Share with classmates

### Mode 7: Chemistry Adventure (was Alaska Adventure)
- 5-round journey through chemistry concepts
- Round 1: Elements (identify 5 elements)
- Round 2: Compounds (form simple compounds)
- Round 3: Reactions (balance equations)
- Round 4: States of matter (phase changes)
- Round 5: Chemical bonding (ionic vs covalent)

## 3. ACHIEVEMENTS (45 Total)

### Free Experiment (5)
- **Curious Mind:** Explore 10 elements ✅ 50 XP
- **Element Expert:** Explore all noble gases ✅ 100 XP
- **Lab Rat:** Explore 50 elements ✅ 250 XP
- **Science Enthusiast:** Explore 100 elements ✅ 500 XP
- **Master Scientist:** Explore all 118 elements ✅ 1000 XP

### Lab Challenge (7)
- **Quick Thinker:** Complete in under 30 seconds ✅ 75 XP
- **Speed Scientist:** 5 quick completions ✅ 150 XP
- **No Hints:** Complete without hints ✅ 100 XP
- **Chemistry Ace:** 10 chemistry challenges ✅ 200 XP
- **Streak Master:** 10 correct in a row ✅ 300 XP
- **Lab Expert:** 25 challenges ✅ 400 XP
- **Research Pro:** 50 challenges ✅ 1000 XP

(Continue similar patterns for all 7 modes...)

## 4. VISUAL THEME (Teal/Lime for Science)

```css
:root {
    --primary: #319795;        /* Teal for lab/ocean */
    --secondary: #68d391;      /* Lime for nature/growth */
    --accent: #f687b3;         /* Pink for chemistry/reactions */
    --background: #1a202c;
    --text: #e2e8f0;
    --success: #68d391;
    --error: #fc8181;
}
```

**Icons & Emoji:**
- 🌍 → 🔬 (microscope)
- 🗺️ → ⚗️ (chemistry)
- 📍 → 🧪 (test tube)
- 🧭 → 🧬 (DNA)
- ⛰️ → 🌡️ (thermometer)

## 5. API INTEGRATIONS

**PubChem API (FREE):**
```javascript
async function fetchElementData(element) {
    const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${element}/JSON`
    );
    const data = await response.json();
    return {
        name: data.PC_Compounds[0].props.find(p => p.urn.label === 'IUPAC Name').value.sval,
        formula: data.PC_Compounds[0].props.find(p => p.urn.label === 'Molecular Formula').value.sval,
        mass: data.PC_Compounds[0].props.find(p => p.urn.label === 'Molecular Weight').value.fval,
        description: data.PC_Compounds[0].props.find(p => p.urn.label === 'Description').value.sval
    };
}
```

**NASA API (FREE - for space content):**
Get astronomy picture of the day, planetary data, etc.

**Static Science Data:**
- Periodic table JSON (118 elements with full properties)
- Human body systems data
- Common chemical reactions database

## 6. NUCLEAR SAFETY (Keep + Add Science Keywords)

Add science-specific inappropriate keywords:
```javascript
const INAPPROPRIATE_KEYWORDS = [
    // Geography keywords +
    'dangerous experiment', 'explosive', 'toxic',
    'radiation hazard', 'biohazard', 'poison',
    'weapon', 'bomb', 'chemical weapon'
    // Prevent students from asking about dangerous experiments
];
```

**AI Prompt:**
```javascript
const AI_SAFETY_PROMPT = `You are a science tutor for middle school students (ages 11-14).

CRITICAL RULES:
1. All experiments mentioned must be SAFE and CLASSROOM-APPROPRIATE
2. Never suggest dangerous chemicals or procedures
3. Emphasize lab safety in all responses
4. Focus on observation, not risky manipulation
5. Use age-appropriate scientific terminology
6. Encourage scientific thinking and curiosity
7. Relate science to everyday life

SCIENCE CONTENT FOCUS:
- Chemistry (elements, compounds, reactions - SAFE ONLY)
- Biology (cells, organs, ecosystems)
- Physics (motion, energy, forces - no explosives)
- Earth Science (geology, weather, astronomy)

TONE: Curious, enthusiastic, safety-conscious`;
```

## 7. GEN ALPHA SLANG (Science Edition)

```javascript
const SCIENCE_SLANG = {
    'element': 'atomic vibe',
    'experiment': 'science rizz',
    'correct': 'no cap scientific',
    'hypothesis': 'the guess',
    'conclusion': 'the tea',
    'reaction': 'chemistry vibes',
    'cell': 'tiny unit fr fr',
    'atom': 'smol particle',
    'molecule': 'atom squad',
    'laboratory': 'the lab fr',
    'periodic table': 'element grid',
    'excellent': 'straight bussin science'
};
```

## 8. SIDEBAR CARDS (Science Version)

### Card 1: Element/Concept Header
- Element name, symbol, atomic number
- OR: Body part name, system, function
- Favorite button

### Card 2: Quick Facts
- Atomic mass, electron config (for elements)
- Discovery date, discoverer
- Common uses, fun facts

### Card 3: Visual Representation
- Electron shell diagram
- Molecular structure (3D if possible)
- Related images from Unsplash

### Card 4: AI Science Tutor
- Ask questions about the element/concept
- Get explanations in simple terms
- "Why is this important?" button

### Card 5: Related Concepts
- Elements in same group
- Related body systems
- Similar compounds

### Card 6: Experiments You Can Try
- SAFE, home experiments related to concept
- Materials list
- Step-by-step instructions
- Safety warnings

### Card 7: Real-World Applications
- How is this used in technology?
- Medical applications
- Industrial uses
- Environmental impact

### Card 8: Challenge Problems
- Daily science challenge
- Relate to current concept
- Bonus XP for completion

## 9. SEARCH & REPLACE RULES

| Find | Replace |
|------|---------|
| `location` | `element` (or `concept`) |
| `country` | `category` |
| `map` | `periodic-table` (or `diagram`) |
| `coordinates` | `properties` |
| `distance` | `similarity` |
| `Location Explorer` | `Science Explorer` |

**DO NOT CHANGE:**
- Achievement system structure
- Nuclear safety filtering
- Gen Alpha features
- localStorage patterns

## 10. TESTING REQUIREMENTS

- [ ] Periodic table renders 118 elements correctly
- [ ] Click on element shows detailed info
- [ ] Achievements unlock for element exploration
- [ ] AI tutor explains science concepts simply
- [ ] All 7 game modes function
- [ ] Nuclear safety blocks dangerous queries
- [ ] Mobile-responsive periodic table
- [ ] No console errors

## 11. SUCCESS CRITERIA

✅ Periodic table interactive and educational  
✅ 45 achievements unlock correctly  
✅ Science content accurate (verified by science teacher)  
✅ Age-appropriate (middle school level)  
✅ Safety-conscious (no dangerous experiments)  
✅ Visual theme consistent (teal/lime)  
✅ Mobile-friendly  
✅ Student-tested and approved  

## YOUR FIRST STEPS:

1. Analyze Geography code
2. Propose periodic table implementation plan
3. Start with Element Hunt game mode (simplest)
4. Test with 5-10 elements before adding all 118
5. Get my feedback before continuing

Begin by proposing your implementation strategy!
```

---

# 📚 PROMPT 3: ELA Detective Academy

```
CONTEXT: You are an expert educational software developer creating "ELA Detective Academy," an interactive English Language Arts learning game for middle school students (ages 11-14). Part of a multi-subject "Detective Academy" platform.

PROJECT STATUS: Forked from "Geographic Detective Academy" (85% complete, 9,283 lines). Geography app has map-based exploration, 7 game modes, achievements, AI integration, Nuclear Safety System, Gen Alpha features.

YOUR MISSION: Transform Geography app into ELA Detective Academy by:
1. Replacing world map with interactive story/plot diagrams
2. Adapting 7 game modes from geography to literary concepts
3. Keeping core systems (achievements, safety, AI, Gen Alpha)
4. Integrating book/literature APIs (Google Books, Goodreads, Wikiquote)
5. Visual theme: red/yellow (books/pencils)
6. 45 ELA-specific achievements
7. Content: Reading comprehension, literary devices, vocabulary, writing

DETAILED REQUIREMENTS:

## 1. MAIN INTERACTIVE ELEMENT

**Option A: Story Mountain/Freytag's Pyramid (RECOMMENDED)**
```html
<svg id="story-map" width="1000" height="600" viewBox="0 0 1000 600">
    <!-- Plot structure: Exposition → Rising Action → Climax → Falling Action → Resolution -->
    <path d="M 100 500 L 300 300 L 500 100 L 700 300 L 900 500" 
          stroke="#e53e3e" stroke-width="4" fill="none"/>
    
    <!-- Interactive plot points -->
    <circle cx="100" cy="500" r="40" fill="#e53e3e" onclick="showPlotPoint('exposition')"/>
    <circle cx="300" cy="300" r="40" fill="#e53e3e" onclick="showPlotPoint('rising')"/>
    <circle cx="500" cy="100" r="60" fill="#ecc94b" onclick="showPlotPoint('climax')"/>
    <circle cx="700" cy="300" r="40" fill="#e53e3e" onclick="showPlotPoint('falling')"/>
    <circle cx="900" cy="500" r="40" fill="#e53e3e" onclick="showPlotPoint('resolution')"/>
    
    <!-- Labels -->
    <text x="100" y="550" text-anchor="middle" fill="#fff">Exposition</text>
    <text x="300" y="350" text-anchor="middle" fill="#fff">Rising Action</text>
    <text x="500" y="80" text-anchor="middle" fill="#fff">CLIMAX</text>
    <text x="700" y="350" text-anchor="middle" fill="#fff">Falling Action</text>
    <text x="900" y="550" text-anchor="middle" fill="#fff">Resolution</text>
</svg>
```

**Option B: Character Relationship Web**
Network diagram showing characters and their relationships

**Option C: Book Library Shelf**
Visual bookshelf with clickable books by genre

## 2. GAME MODES (Adapt All 7)

### Mode 1: Free Reading (was Free Explore)
- Click any book/story → See summary, themes, characters
- Click plot point → Read scene excerpt
- Award 10 XP per book explored

### Mode 2: Literary Challenge (was Mystery Challenge)
- "Find the book with this quote: 'It was the best of times...'" (Answer: A Tale of Two Cities)
- "Identify the literary device in: 'The wind whispered secrets'" (Answer: Personification)
- 60-second time limit

### Mode 3: Vocabulary Hunt (was Scavenger Hunt)
- "Find 10 words that mean 'happy'" (joyful, elated, cheerful, etc.)
- "Find 5 examples of alliteration in the text"
- "Find all metaphors in the passage"

### Mode 4: Guess the Author (was Guess the Location)
- Show writing sample
- Multiple choice: Who wrote this?
- Options: Shakespeare, Poe, Dickens, Austen
- Award XP for correct identification

### Mode 5: Reading Missions (was Missions)
- "Read 3 short stories"
- "Identify themes in 5 different books"
- "Study all Shakespeare plays"
- "Master vocabulary: 50 new words"

### Mode 6: Create Story (was Create Heist)
- Students write short stories
- Choose plot structure (follow story mountain)
- Add characters, setting, conflict
- Share with classmates
- Award XP for creativity

### Mode 7: Shakespeare Adventure (was Alaska Adventure)
- 5-round journey through Shakespeare
- Round 1: Identify famous quotes
- Round 2: Match characters to plays
- Round 3: Understand themes
- Round 4: Analyze metaphors
- Round 5: Interpret sonnets

## 3. ACHIEVEMENTS (45 Total)

### Free Reading (5)
- **Bookworm:** Read 10 book summaries ✅ 50 XP
- **Genre Explorer:** Explore 5 different genres ✅ 100 XP
- **Literary Scholar:** Read 50 summaries ✅ 250 XP
- **Avid Reader:** Read 100 summaries ✅ 500 XP
- **Library Master:** Explore all genres ✅ 1000 XP

### Literary Challenge (7)
- **Quick Reader:** Complete in 30 seconds ✅ 75 XP
- **Speed Detective:** 5 quick challenges ✅ 150 XP
- **Literary Genius:** 10 correct ✅ 200 XP
- **Quote Master:** Identify 25 quotes ✅ 300 XP
- **Perfect Streak:** 10 in a row ✅ 400 XP
- **Challenge Expert:** 50 completed ✅ 1000 XP

(Continue patterns for all modes...)

## 4. VISUAL THEME (Red/Yellow for ELA)

```css
:root {
    --primary: #e53e3e;        /* Book red */
    --secondary: #ecc94b;      /* Pencil yellow */
    --accent: #9f7aea;         /* Purple prose */
    --background: #1a202c;
    --text: #e2e8f0;
}
```

**Icons & Emoji:**
- 🌍 → 📚 (books)
- 🗺️ → ✍️ (writing)
- 📍 → 📖 (open book)
- 🧭 → 📝 (note)
- ⛰️ → 💭 (thinking)

## 5. API INTEGRATIONS

**Google Books API (FREE with limits):**
```javascript
const GOOGLE_BOOKS_KEY = process.env.GOOGLE_BOOKS_API_KEY;

async function fetchBookData(query) {
    const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${GOOGLE_BOOKS_KEY}`
    );
    const data = await response.json();
    return data.items.map(item => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors[0],
        description: item.volumeInfo.description,
        cover: item.volumeInfo.imageLinks?.thumbnail,
        publishedDate: item.volumeInfo.publishedDate
    }));
}
```

**Wikiquote API (FREE):**
Get famous quotes from literature

**Static Literary Data:**
- Shakespeare complete works
- Common literary devices dictionary
- Classic literature database (public domain)

## 6. NUCLEAR SAFETY (Keep + Add ELA Keywords)

```javascript
const INAPPROPRIATE_KEYWORDS = [
    // Geography keywords +
    'plagiarism', 'copy paste', 'essay mill',
    'cheat', 'answer key', 'spark notes answers'
    // Prevent academic dishonesty
];
```

**AI Prompt:**
```javascript
const AI_SAFETY_PROMPT = `You are an English Language Arts tutor for middle school (ages 11-14).

CRITICAL RULES:
1. Encourage ORIGINAL thinking and writing
2. Provide guidance, NOT complete essay answers
3. Help students understand themes, don't tell them directly
4. Focus on reading comprehension strategies
5. Build vocabulary in context
6. Celebrate creative expression
7. Promote critical thinking about literature

CONTENT FOCUS:
- Reading comprehension (plot, character, theme)
- Literary devices (metaphor, simile, personification)
- Vocabulary building (context clues)
- Writing skills (structure, style, grammar)

TONE: Encouraging, thought-provoking, literary enthusiast`;
```

## 7. GEN ALPHA SLANG (ELA Edition)

```javascript
const ELA_SLANG = {
    'book': 'the read',
    'author': 'the writer fr',
    'character': 'main character energy',
    'plot': 'the storyline',
    'theme': 'the vibe',
    'metaphor': 'poetic rizz',
    'vocabulary': 'word bank',
    'essay': 'the paper',
    'correct': 'no cap correct',
    'excellent': 'straight bussin writing',
    'climax': 'the peak moment',
    'conflict': 'the drama'
};
```

## 8. SIDEBAR CARDS (ELA Version)

### Card 1: Book/Story Header
- Title, author, publication year
- Genre, page count
- Add to reading list button

### Card 2: Summary & Themes
- Plot summary (spoiler-free)
- Main themes
- Target age/reading level

### Card 3: Characters & Relationships
- Main characters
- Character traits
- Relationship diagram

### Card 4: AI Reading Tutor
- "What's the theme of this book?"
- "Who is the protagonist?"
- "What does this quote mean?"

### Card 5: Literary Devices
- Metaphors used
- Symbolism
- Foreshadowing examples
- Writing techniques

### Card 6: Vocabulary Builder
- Difficult words in text
- Definitions in context
- Practice using words

### Card 7: Discussion Questions
- Thought-provoking questions
- "Why did the character...?"
- "How would you...?"

### Card 8: Creative Writing Prompt
- Related writing exercise
- "Rewrite the ending"
- "Create a new character"

## 9. SEARCH & REPLACE RULES

| Find | Replace |
|------|---------|
| `location` | `book` (or `reading`) |
| `country` | `genre` |
| `map` | `story-map` |
| `coordinates` | `page-number` |
| `distance` | `reading-level` |

## 10. TESTING REQUIREMENTS

- [ ] Story mountain renders correctly
- [ ] Click plot points shows relevant content
- [ ] Book API returns valid data
- [ ] Vocabulary hunt finds words
- [ ] AI tutor helps with comprehension (not answers)
- [ ] All 7 game modes function
- [ ] Mobile-responsive story diagram

## 11. SUCCESS CRITERIA

✅ Story diagram interactive  
✅ Literary content accurate  
✅ Promotes original thinking (no plagiarism)  
✅ Age-appropriate reading level  
✅ 45 achievements unlock  
✅ Visual theme (red/yellow) consistent  
✅ Student engagement high  

YOUR FIRST STEPS:

1. Analyze Geography code
2. Propose story mountain implementation
3. Start with Vocabulary Hunt (simplest)
4. Test with 3-5 classic books
5. Get feedback before expanding

Propose your implementation strategy!
```

---

## 📋 GENERIC TEMPLATE PROMPT (For Future Subjects)

```
CONTEXT: You are creating "[SUBJECT] Detective Academy" for middle school students.

PROJECT STATUS: Forked from Geographic Detective Academy (85% complete, 9,283 lines).

YOUR MISSION:
1. Replace map with [SUBJECT-SPECIFIC INTERACTIVE ELEMENT]
2. Adapt 7 game modes to [SUBJECT]
3. Keep core systems (achievements, safety, AI, Gen Alpha)
4. Integrate [SUBJECT] APIs
5. Visual theme: [COLOR SCHEME]
6. 45 [SUBJECT] achievements
7. Educational content: [SUBTOPICS]

[Continue with detailed requirements similar to above...]
```

---

## 🎯 Tips for Success with AI

1. **Start with analysis:** Let the AI analyze the Geography code first
2. **Ask for plan:** Get AI to propose phases before coding
3. **Test incrementally:** After each game mode, test thoroughly
4. **Request explanations:** If code is complex, ask AI to explain
5. **Provide feedback:** Tell AI what works and what doesn't
6. **Use checkpoints:** Commit working code before starting new features
7. **Reference docs:** Point AI to specific Geography code sections
8. **Be specific:** "Update lines 1200-1300" is better than "update the map code"

---

**These prompts are ready to use!** Copy the appropriate one for your subject, paste into your AI coding assistant, and start building! 🚀
