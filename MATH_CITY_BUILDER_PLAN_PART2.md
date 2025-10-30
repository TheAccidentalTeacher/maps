# Math City Builder Plan - Part 2

**Continuation of MATH_CITY_BUILDER_PLAN.md**

**🔄 UPDATED:** Currency changed from "coins" to "dollars" ($) throughout this document  
**📊 Economy:** Dollar-based system ($10 to $1,000,000 scale)  
**📚 Math Scope:** Multiple math types with variable rewards

---

# Phase 4: Math Quiz System

**Time:** 3-4 hours (Day 3 morning)  
**Goal:** Pop up math problems and reward correct answers

## What We're Building

The core educational mechanic:
1. Player needs dollars to build
2. Player must answer math problems to earn dollars
3. Correct answer = dollars + XP (amount varies by math type)
4. Wrong answer = no penalty, try again
5. Problems get harder as player levels up
6. Multiple math types available (multiplication, division, algebra, etc.)

## Quiz Trigger Logic

**When does a quiz appear?**

**Option A: Automatic Timer**
- Quiz pops up every 60 seconds
- Forces continuous practice
- Con: Interrupts gameplay flow

**Option B: On-Demand**
- "Earn Dollars" button in UI
- Player clicks when they need money
- Player selects math type (dropdown menu)
- Pro: Player controls pacing
- Con: Might skip practice

**Option C: Building-Triggered**
- Quiz appears when clicking building menu
- Must answer to unlock building
- Pro: Natural gameplay integration
- Con: Only practices when building

**Recommendation: Option B + C Hybrid**
- "Earn Dollars" button for practice anytime
- Math type selector (dropdown: Multiplication 1-12, Division, Algebra, etc.)
- Quiz required when placing expensive buildings ($50+)
- Best of both worlds

## Step 4.1: Quiz Data Structure

**js/quiz.js will manage:**

```javascript
const QUIZ_CONFIG = {
    minNumber: 1,           // Start range (1)
    maxNumber: 12,          // End range (12)
    dollarsPerCorrect: 10,  // Base reward for correct answer (varies by math type)
    xpPerCorrect: 5,        // XP for correct answer
    levelUpXP: 100          // XP needed to level up
};

// Math type definitions (rewards vary by difficulty)
const MATH_TYPES = {
    'mult-1-12': { name: 'Multiplication 1-12', reward: 10, difficulty: 1 },
    'division-basic': { name: 'Basic Division', reward: 12, difficulty: 2 },
    'algebra-linear': { name: 'Algebra (Linear Equations)', reward: 100, difficulty: 5 },
    // ... more types defined in MATH_SYSTEM.md
};

// Current quiz state
let currentQuiz = {
    question: '',           // "What is 7 × 8?"
    answer: null,           // Correct answer (56)
    mathType: 'mult-1-12'   // Current math type selected
    userAnswer: null,       // Player's input
    attempts: 0             // Number of tries
};
```

## Step 4.2: Generate Quiz Question

**Create random multiplication problem:**

```javascript
function generateQuiz(level) {
    // Adjust difficulty based on player level
    const maxNum = Math.min(QUIZ_CONFIG.maxNumber, level + 2);
    
    // Random numbers
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    
    // Store quiz
    currentQuiz = {
        question: `What is ${num1} × ${num2}?`,
        answer: num1 * num2,
        userAnswer: null,
        attempts: 0
    };
    
    return currentQuiz;
}
```

## Step 4.3: Show Quiz Modal

**Display quiz popup:**

```javascript
function showQuiz() {
    // Generate new question
    generateQuiz(playerLevel);
    
    // Update modal content
    document.getElementById('quiz-question').textContent = currentQuiz.question;
    document.getElementById('quiz-answer').value = '';
    document.getElementById('quiz-feedback').textContent = '';
    
    // Show modal
    document.getElementById('quiz-modal').classList.remove('hidden');
    
    // Focus input
    document.getElementById('quiz-answer').focus();
}
```

## Step 4.4: Check Answer

**Validate player's answer:**

```javascript
document.getElementById('quiz-submit').addEventListener('click', checkQuizAnswer);

function checkQuizAnswer() {
    const userAnswer = parseInt(document.getElementById('quiz-answer').value);
    currentQuiz.userAnswer = userAnswer;
    currentQuiz.attempts++;
    
    if (userAnswer === currentQuiz.answer) {
        // CORRECT!
        handleCorrectAnswer();
    } else {
        // WRONG
        handleIncorrectAnswer();
    }
}

function handleCorrectAnswer() {
    // Award dollars and XP (amount depends on math type)
    const reward = MATH_TYPES[currentQuiz.mathType].reward;
    playerDollars += reward;
    playerXP += QUIZ_CONFIG.xpPerCorrect;
    
    // Check level up
    checkLevelUp();
    
    // Show success feedback
    document.getElementById('quiz-feedback').textContent = `✅ Correct! +$${reward}, +5 XP`;
    document.getElementById('quiz-feedback').style.color = 'green';
    
    // Close modal after 1 second
    setTimeout(() => {
        hideQuiz();
    }, 1000);
    
    // Update UI
    updateUI();
    saveGame();
}

function handleIncorrectAnswer() {
    // Show try again message
    document.getElementById('quiz-feedback').textContent = '❌ Try again!';
    document.getElementById('quiz-feedback').style.color = 'red';
    
    // Clear input
    document.getElementById('quiz-answer').value = '';
    document.getElementById('quiz-answer').focus();
    
    // Optional: Give hint after 3 attempts
    if (currentQuiz.attempts >= 3) {
        showHint();
    }
}

function showHint() {
    const answer = currentQuiz.answer;
    const hint = `Hint: The answer is between ${answer - 5} and ${answer + 5}`;
    document.getElementById('quiz-feedback').textContent += ` ${hint}`;
}
```

## Step 4.5: Level Up System

**Track progression:**

```javascript
function checkLevelUp() {
    const xpForNextLevel = playerLevel * QUIZ_CONFIG.levelUpXP;
    
    if (playerXP >= xpForNextLevel) {
        playerLevel++;
        playerXP = 0; // Reset XP for next level
        
        // Show level up notification
        showLevelUpNotification();
        
        // Unlock new buildings
        unlockBuildings();
    }
}

function showLevelUpNotification() {
    // Create floating notification
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.textContent = `🎉 Level Up! You're now level ${playerLevel}`;
    document.body.appendChild(notification);
    
    // Fade out after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function unlockBuildings() {
    // Buildings unlock at specific levels
    const newBuildings = Object.values(BUILDING_TYPES)
        .filter(b => b.tier === playerLevel);
    
    if (newBuildings.length > 0) {
        console.log(`Unlocked ${newBuildings.length} new buildings!`);
        renderBuildingMenu(); // Refresh menu
    }
}
```

## Step 4.6: Keyboard Support

**Allow Enter key to submit:**

```javascript
document.getElementById('quiz-answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkQuizAnswer();
    }
});
```

## Test Milestone 4.1

**What you'll see after this phase:**
- ✅ "Earn Dollars" button in top UI bar
- ✅ Math type selector dropdown (Multiplication 1-12, Division, etc.)
- ✅ Click button → quiz modal appears with selected math type
- ✅ Random problem based on selected type
- ✅ Type answer, press Enter or Submit
- ✅ Correct answer → reward varies by type ($10 for mult, $100 for algebra), +5 XP, modal closes
- ✅ Wrong answer → "Try again" message, stays open
- ✅ Level up at 100 XP → notification appears
- ✅ New buildings unlock at higher levels

**How to test:**
1. Select math type from dropdown
2. Click "Earn Dollars" button
3. Answer quiz (try both correct and incorrect)
4. Verify dollars increase when correct (amount matches math type reward)
4. Answer 20 questions → should level up to Level 2
5. Check if new buildings appear in menu

---

# Phase 5: Game Economy & Progression

**Time:** 3-4 hours (Day 3 afternoon - Day 4)  
**Goal:** Balance earning, spending, and unlock progression

## Economic Design

**Key questions we need to answer:**
1. How fast should players earn dollars?
2. How much should buildings cost?
3. When should new buildings unlock?
4. What prevents players from spamming one building type?
5. How do different math types affect earning rates?

## Step 5.1: Building Tiers

**Organize buildings by difficulty:**

```javascript
const BUILDING_TIERS = {
    1: { // Starter (Level 1)
        unlockLevel: 1,
        buildings: ['house-small', 'grass-plot', 'road-straight']
    },
    2: { // Basic (Level 2)
        unlockLevel: 2,
        buildings: ['house-medium', 'shop-small', 'tree']
    },
    3: { // Intermediate (Level 3-4)
        unlockLevel: 3,
        buildings: ['house-large', 'shop-medium', 'restaurant']
    },
    4: { // Advanced (Level 5-6)
        unlockLevel: 5,
        buildings: ['apartment', 'mall', 'office', 'school', 'library']
    },
    5: { // Premium (Level 7+)
        unlockLevel: 7,
        buildings: ['skyscraper', 'stadium', 'park', 'university', 'museum']
    }
};
```

## Step 5.2: Pricing Strategy

**Building costs scale with tier (dollar-based):**

| Tier | Cost Range | XP Reward | Problems Needed (at $10/problem) |
|------|-----------|-----------|----------------------------------|
| 1 | $10-$50 | 5 XP | 1-5 problems |
| 2 | $75-$200 | 15 XP | 8-20 problems |
| 3 | $300-$1,000 | 30 XP | 30-100 problems |
| 4 | $1,500-$5,000 | 50 XP | 150-500 problems (School $3K, Library $4K) |
| 5 | $10,000-$100,000 | 100 XP | 1000-10000 problems (University $50K, Ultimate Tower $100K) |

**Note:** Higher-paying math types (Algebra $100, Geometry Proofs $500) significantly reduce problem counts needed.

**Why this works:**
- Early buildings are cheap (quick wins for kids)
- Costs increase gradually (natural progression)
- High-tier buildings feel like achievements
- Players must answer 5-10 problems per building (practice!)

## Step 5.3: XP & Leveling

**Level progression curve:**

```javascript
function getXPForLevel(level) {
    // Exponential growth: Level 2 = 100 XP, Level 3 = 200 XP, etc.
    return level * 100;
}

function getCurrentLevel(totalXP) {
    let level = 1;
    let xpSum = 0;
    
    while (xpSum + getXPForLevel(level) <= totalXP) {
        xpSum += getXPForLevel(level);
        level++;
    }
    
    return level;
}

function getXPProgress(totalXP, level) {
    // How much XP toward next level
    const xpForCurrentLevel = getXPForLevel(level);
    const xpIntoLevel = totalXP - getTotalXPForLevel(level - 1);
    
    return {
        current: xpIntoLevel,
        required: xpForCurrentLevel,
        percentage: (xpIntoLevel / xpForCurrentLevel) * 100
    };
}
```

## Step 5.4: Building Limits

**Prevent spam-building:**

```javascript
const GRID_LIMITS = {
    maxBuildings: 100,      // Total building cap
    maxPerType: 20          // Max of same building type
};

function canPlaceBuilding(buildingType) {
    // Count existing buildings
    const totalBuildings = countAllBuildings();
    const typeCount = countBuildingType(buildingType);
    
    if (totalBuildings >= GRID_LIMITS.maxBuildings) {
        showMessage('City is full! Remove buildings to add more.');
        return false;
    }
    
    if (typeCount >= GRID_LIMITS.maxPerType) {
        showMessage(`You have too many ${buildingType}s. Try building something else!`);
        return false;
    }
    
    return true;
}

function countAllBuildings() {
    let count = 0;
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            if (grid[row][col].building) count++;
        }
    }
    return count;
}

function countBuildingType(type) {
    let count = 0;
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            if (grid[row][col].building?.type === type) count++;
        }
    }
    return count;
}
```

## Step 5.5: Building Removal

**Allow demolishing buildings:**

```javascript
// Right-click to demolish
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault(); // Prevent browser menu
    
    if (!hoveredTile) return;
    
    const tile = grid[hoveredTile.y][hoveredTile.x];
    if (tile.building) {
        demolishBuilding(hoveredTile.x, hoveredTile.y);
    }
});

function demolishBuilding(x, y) {
    const tile = grid[y][x];
    const building = BUILDING_TYPES[tile.building.type];
    
    // Refund 50% of cost
    const refund = Math.floor(building.cost * 0.5);
    playerDollars += refund;
    
    // Remove building
    tile.building = null;
    
    // Show notification
    showMessage(`Demolished! Refunded $${refund}`);
    
    // Update UI
    updateUI();
    saveGame();
}
```

## Step 5.6: City Score

**Add overall progress metric:**

```javascript
function calculateCityScore() {
    let score = 0;
    
    // Points for each building
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            const tile = grid[row][col];
            if (tile.building) {
                const building = BUILDING_TYPES[tile.building.type];
                score += building.xp; // XP = building value
            }
        }
    }
    
    // Bonus for diversity
    const uniqueTypes = new Set();
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            if (grid[row][col].building) {
                uniqueTypes.add(grid[row][col].building.type);
            }
        }
    }
    score += uniqueTypes.size * 10; // +10 per unique building type
    
    return score;
}

// Display city score in UI
function updateCityScore() {
    const score = calculateCityScore();
    document.getElementById('city-score').textContent = score;
}
```

## Step 5.7: Achievements

**Add milestone rewards:**

```javascript
const ACHIEVEMENTS = {
    'first-building': {
        name: 'First Builder',
        description: 'Place your first building',
        reward: 50, // Bonus dollars
        check: () => countAllBuildings() >= 1
    },
    'ten-buildings': {
        name: 'Growing City',
        description: 'Place 10 buildings',
        reward: 100,
        check: () => countAllBuildings() >= 10
    },
    'thousand-dollar-town': {
        name: 'Thousand Dollar Town',
        description: 'City value reaches $1,000',
        reward: 100,
        check: () => calculateCityValue() >= 1000
    },
    'math-master': {
        name: 'Math Master',
        description: 'Answer 100 questions correctly',
        reward: 200,
        check: () => playerStats.questionsCorrect >= 100
    },
    'level-five': {
        name: 'City Planner',
        description: 'Reach level 5',
        reward: 300,
        check: () => playerLevel >= 5
    }
};

let unlockedAchievements = [];

function checkAchievements() {
    Object.keys(ACHIEVEMENTS).forEach(id => {
        if (unlockedAchievements.includes(id)) return; // Already unlocked
        
        const achievement = ACHIEVEMENTS[id];
        if (achievement.check()) {
            unlockAchievement(id);
        }
    });
}

function unlockAchievement(id) {
    const achievement = ACHIEVEMENTS[id];
    unlockedAchievements.push(id);
    
    // Award bonus dollars
    playerDollars += achievement.reward;
    
    // Show notification
    showAchievementNotification(achievement);
    
    saveGame();
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <h3>🏆 Achievement Unlocked!</h3>
        <p>${achievement.name}</p>
        <p class="description">${achievement.description}</p>
        <p class="reward">+$${achievement.reward}</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}
```

## Test Milestone 5.1

**What you'll see after this phase:**
- ✅ Buildings organized by tier (1-5)
- ✅ Buildings unlock as you level up
- ✅ Costs scale appropriately ($10-$100,000)
- ✅ Can't place more than 100 buildings total
- ✅ Can't place more than 20 of same type
- ✅ Right-click building → demolish (50% refund)
- ✅ City score displayed in UI
- ✅ Achievements unlock and award bonus dollars
- ✅ XP bar shows progress to next level

**How to test:**
1. Place 10 buildings → "Growing City" achievement
2. Try placing 21 houses → blocked
3. Right-click building → demolishes, get dollars back
4. Answer quizzes until Level 3 → new buildings unlock
5. Build diverse city → higher city score
6. Reach $1,000 city value → "Thousand Dollar Town" achievement

---

# Phase 6: Supabase Integration

**Time:** 4-5 hours (Day 4-5)  
**Goal:** Save player progress to cloud database

## Why Supabase?

**You already have it set up for Geography Detective!**
- ✅ Authentication system working
- ✅ Database tables exist
- ✅ Free tier (50,000 monthly active users)
- ✅ Real-time updates
- ✅ Row-level security (FERPA compliant)

**What we'll reuse:**
- `accounts` table (student login)
- Supabase client configuration
- Authentication flow

**What we'll add:**
- `math_city_progress` table (city saves)
- `math_quiz_history` table (quiz tracking)

## Step 6.1: Database Schema

**Create new tables:**

```sql
-- Player city save data
CREATE TABLE math_city_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    city_name TEXT DEFAULT 'My City',
    grid_data JSONB NOT NULL,           -- Entire grid state
    player_dollars INTEGER DEFAULT 100, -- Changed from player_coins
    player_xp INTEGER DEFAULT 0,
    player_level INTEGER DEFAULT 1,
    city_score INTEGER DEFAULT 0,
    unlocked_achievements TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id)                  -- One save per player
);

-- Quiz history for analytics
CREATE TABLE math_quiz_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    correct_answer INTEGER NOT NULL,
    user_answer INTEGER,
    is_correct BOOLEAN NOT NULL,
    attempts INTEGER DEFAULT 1,
    answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE math_city_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_quiz_history ENABLE ROW LEVEL SECURITY;

-- Students can only see/edit their own data
CREATE POLICY "Students can view own progress"
    ON math_city_progress FOR SELECT
    USING (auth.uid() = account_id);

CREATE POLICY "Students can update own progress"
    ON math_city_progress FOR UPDATE
    USING (auth.uid() = account_id);

CREATE POLICY "Students can insert own progress"
    ON math_city_progress FOR INSERT
    WITH CHECK (auth.uid() = account_id);

CREATE POLICY "Students can view own quiz history"
    ON math_quiz_history FOR SELECT
    USING (auth.uid() = account_id);

CREATE POLICY "Students can insert quiz history"
    ON math_quiz_history FOR INSERT
    WITH CHECK (auth.uid() = account_id);
```

## Step 6.2: Supabase Client Setup

**js/supabase.js (reuse from Geography Detective):**

```javascript
// Import Supabase (already in Geography Detective)
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is logged in
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// Authentication (reuse existing flow)
async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
}
```

## Step 6.3: Save Game State

**Save city to database:**

```javascript
async function saveGame() {
    const user = await getCurrentUser();
    if (!user) {
        console.log('Not logged in, saving to localStorage');
        saveToLocalStorage();
        return;
    }

    // Prepare save data
    const saveData = {
        account_id: user.id,
        grid_data: compressGridData(), // Only save non-empty tiles
        player_dollars: playerDollars,  // Changed from player_coins
        player_xp: playerXP,
        player_level: playerLevel,
        city_score: calculateCityScore(),
        unlocked_achievements: unlockedAchievements,
        updated_at: new Date().toISOString()
    };

    // Upsert (insert or update)
    const { error } = await supabase
        .from('math_city_progress')
        .upsert(saveData, { onConflict: 'account_id' });

    if (error) {
        console.error('Save failed:', error);
        showMessage('Failed to save to cloud. Saving locally...');
        saveToLocalStorage();
    } else {
        console.log('Game saved to cloud ✅');
        showSaveIndicator();
    }
}

// Compress grid data (only save buildings)
function compressGridData() {
    const buildings = [];
    for (let row = 0; row < GRID_CONFIG.rows; row++) {
        for (let col = 0; col < GRID_CONFIG.cols; col++) {
            const tile = grid[row][col];
            if (tile.building) {
                buildings.push({
                    x: col,
                    y: row,
                    type: tile.building.type,
                    placed: tile.building.placed
                });
            }
        }
    }
    return buildings;
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.textContent = '☁️ Saved';
    indicator.style.opacity = 1;
    setTimeout(() => {
        indicator.style.opacity = 0;
    }, 2000);
}
```

## Step 6.4: Load Game State

**Load city from database:**

```javascript
async function loadGame() {
    const user = await getCurrentUser();
    if (!user) {
        console.log('Not logged in, loading from localStorage');
        loadFromLocalStorage();
        return;
    }

    // Fetch save data
    const { data, error } = await supabase
        .from('math_city_progress')
        .select('*')
        .eq('account_id', user.id)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No save found, start new game
            console.log('No save found, starting new game');
            initNewGame();
        } else {
            console.error('Load failed:', error);
            loadFromLocalStorage();
        }
        return;
    }

    // Restore game state
    playerDollars = data.player_dollars;  // Changed from player_coins
    playerXP = data.player_xp;
    playerLevel = data.player_level;
    unlockedAchievements = data.unlocked_achievements || [];

    // Restore grid
    restoreGridData(data.grid_data);

    console.log('Game loaded from cloud ✅');
    updateUI();
}

function restoreGridData(buildings) {
    // Clear grid
    initGrid();

    // Place buildings
    buildings.forEach(b => {
        grid[b.y][b.x].building = {
            type: b.type,
            placed: b.placed
        };
    });
}
```

## Step 6.5: Auto-Save

**Save every 30 seconds + on actions:**

```javascript
// Auto-save every 30 seconds
setInterval(() => {
    saveGame();
}, 30000);

// Save on important actions
function placeBuilding(x, y, building) {
    // ... placement logic ...
    saveGame(); // Save immediately
}

function demolishBuilding(x, y) {
    // ... demolish logic ...
    saveGame(); // Save immediately
}

function handleCorrectAnswer() {
    // ... reward logic ...
    saveGame(); // Save immediately
}

// Save before closing
window.addEventListener('beforeunload', () => {
    saveGame();
});
```

## Step 6.6: Track Quiz History

**Log every quiz attempt:**

```javascript
async function logQuizAttempt(question, correctAnswer, userAnswer, isCorrect, attempts) {
    const user = await getCurrentUser();
    if (!user) return; // Don't log if not logged in

    const { error} = await supabase
        .from('math_quiz_history')
        .insert({
            account_id: user.id,
            question,
            correct_answer: correctAnswer,
            user_answer: userAnswer,
            is_correct: isCorrect,
            attempts
        });

    if (error) {
        console.error('Failed to log quiz:', error);
    }
}

// Call in quiz handler
function checkQuizAnswer() {
    const userAnswer = parseInt(document.getElementById('quiz-answer').value);
    const isCorrect = (userAnswer === currentQuiz.answer);
    
    logQuizAttempt(
        currentQuiz.question,
        currentQuiz.answer,
        userAnswer,
        isCorrect,
        currentQuiz.attempts
    );
    
    // ... rest of logic ...
}
```

## Step 6.7: LocalStorage Fallback

**For offline play:**

```javascript
function saveToLocalStorage() {
    const saveData = {
        grid: compressGridData(),
        dollars: playerDollars,  // Changed from coins
        xp: playerXP,
        level: playerLevel,
        achievements: unlockedAchievements,
        timestamp: Date.now()
    };
    localStorage.setItem('math-city-save', JSON.stringify(saveData));
}

function loadFromLocalStorage() {
    const saveData = localStorage.getItem('math-city-save');
    if (!saveData) {
        initNewGame();
        return;
    }

    const data = JSON.parse(saveData);
    playerDollars = data.dollars;  // Changed from coins
    playerXP = data.xp;
    playerLevel = data.level;
    unlockedAchievements = data.achievements || [];
    restoreGridData(data.grid);
}
```

## Test Milestone 6.1

**What you'll see after this phase:**
- ✅ Login with existing Geography Detective account
- ✅ Build city, see "☁️ Saved" indicator
- ✅ Close browser, reopen → city restored
- ✅ Works offline (LocalStorage fallback)
- ✅ Quiz history logs to database
- ✅ Teacher can query quiz history in Supabase dashboard

**How to test:**
1. Login with test student account
2. Build a city (5-10 buildings)
3. Close tab, reopen game → city still there
4. Disconnect internet, build → saves locally
5. Reconnect → syncs to cloud
6. Check Supabase dashboard → see quiz history

---

*Continue to Part 3 for Phases 7-8 (UI Polish + Deployment)...*
