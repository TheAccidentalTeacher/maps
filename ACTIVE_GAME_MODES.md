# 🎮 Math Detective Academy - Active Game Modes

**Last Updated**: October 22, 2025  
**Status**: 5 game modes (3 working, 2 stubs)  
**Removed**: Math City Builder (see `FUTURE_MATH_CITY_BUILDER.md`)

---

## ✅ WORKING GAME MODES

### 1️⃣ Classic Practice
**Status**: ✅ Fully Functional  
**Technology**: DOM-based UI with localStorage  
**Features**:
- 4 operations (×, +, −, ÷)
- 3 difficulty levels (Easy 1-5, Medium 1-10, Hard 1-12)
- Real-time XP and achievement system
- Streak tracking with visual badge
- Speed bonuses for fast answers
- Gen Alpha mode toggle
- Daily goal tracking (20 problems)
- Operation-specific stats

**Game Loop**:
1. Problem appears (e.g., "7 × 8 = ?")
2. Student inputs answer
3. Instant feedback (correct/wrong + XP)
4. Next problem button
5. Achievements unlock automatically

**Files**: Lines 1248-2150 in `index.html`

---

### 2️⃣ Number Line Jumper
**Status**: ✅ Fully Functional  
**Technology**: HTML5 Canvas with custom physics  
**Features**:
- **Epic avatar customization system** (5 animals: Kangaroo, Cat, Dog, Bear, Bunny)
- Live preview canvas with sparkle effects
- Checkpoint-based multiplication questions
- Hit blocks from below (Mario-style mechanic)
- Coins, obstacles (spikes, gaps), power-ups
- Particle effects and sound design
- Auto-scrolling world with dynamic speed
- XP integration with main achievement system
- Pause controls (P key or click button)

**Game Loop**:
1. Auto-run through scrolling world
2. Every 5 seconds: checkpoint pause
3. 4 answer blocks appear
4. Jump and hit correct block from below
5. Correct = continue + XP | Wrong = lose life
6. Collect coins and avoid obstacles between checkpoints

**Files**: Lines 2300-4550 in `index.html`

---

### 3️⃣ Bubble Pop
**Status**: ✅ Fully Functional  
**Technology**: HTML5 Canvas with dynamic gameplay  
**Features**:
- Multiplication bubbles rise from bottom
- **Adjustable speed** (10%-500%, user controls)
- **Adjustable difficulty** (3-6 answer buttons)
- Pause controls (Space key or click button)
- Multiple bubbles can match same answer (chain reactions!)
- **Six-Seven easter egg** (special sound for 6×7 = 67)
- Sound effects (pop, explosion, success, wrong, coin)
- Lives system (3 hearts)
- Score and distance tracking

**Game Loop**:
1. Bubbles spawn with multiplication problems
2. Answer buttons show potential answers
3. Click correct answer to pop matching bubbles
4. Wrong answer = lose life
5. Missed bubble escapes top = lose life
6. Speed increases over time for challenge

**Files**: Lines 4570-4950 in `index.html`

**Why it works**: Satisfying feedback (pop sounds, explosions), adjustable difficulty keeps it engaging for all skill levels, multi-bubble matches reward pattern recognition.

---

## 🚧 STUB GAME MODES (Ready for Development)

### 4️⃣ Space Shooter
**Status**: 🚧 Stub (Coming Soon message)  
**Planned Features**:
- Retro arcade shooter in space
- Asteroids with math problems
- Shoot correct answer missiles
- Power-ups (rapid fire, shield)
- Boss fights with harder problems

**Implementation Ready**:
- Canvas initialized (800×600)
- Placeholder screen shows concept
- `startSpaceShooter()` function exists
- `initSpaceMode()` wires it to mode selector

**Files**: Lines 4560-4590 in `index.html`

---

### 5️⃣ Math Tetris
**Status**: 🚧 Stub (Coming Soon message)  
**Planned Features**:
- Falling number blocks
- Match numbers to create products (e.g., 3 + 4 = 12 product)
- Clear lines with correct equations
- Speed increases over time
- Classic Tetris controls

**Implementation Ready**:
- Canvas initialized (400×600)
- Placeholder screen shows concept
- `startTetrisGame()` function exists
- `initTetrisMode()` wires it to mode selector

**Files**: Lines 4660-4710 in `index.html`

---

## ❌ REMOVED GAME MODE

### Math City Builder
**Status**: ❌ Removed from main app  
**Reason**: Godot/Three.js integration complicated environment  
**Assets Preserved**: `math-city-builder-web/` folder (standalone prototype)  
**Future Plans**: See `FUTURE_MATH_CITY_BUILDER.md` for reintegration strategy

---

## 🎯 Current Focus

**Priority Order:**
1. ✅ **Maintain existing modes** - Classic, Jumper, Bubble Pop work great
2. 🚧 **Fill Space Shooter** - Add actual gameplay (asteroids, shooting)
3. 🚧 **Fill Math Tetris** - Add actual gameplay (falling blocks, matching)
4. 🔮 **Consider City Builder v2** - Only after other modes are complete

---

## 🏆 Shared Systems (All Modes)

All game modes integrate with:
- ✅ **Global XP System** (`gameState.totalXP`)
- ✅ **Achievement System** (45 achievements defined)
- ✅ **localStorage Persistence** (progress saved automatically)
- ✅ **Gen Alpha Mode** (slang toggle, easter eggs)
- ✅ **Streak Tracking** (current + best streak)
- ✅ **Daily Goals** (20 problems per day)
- ✅ **Operation Stats** (separate tracking for ×, +, −, ÷)

---

## 📊 Game Mode Selection

Mode selector shows all 5 modes:
- Classic Practice (📝)
- Number Line Jumper (🦘)
- Bubble Pop (🫧)
- Space Shooter (🚀) - stub
- Math Tetris (🧩) - stub

**Navigation**:
- `selectGameMode(mode)` - Switches to game mode
- `backToMenu()` - Returns to selector, saves state
- Mode preference saved in `localStorage`

---

## 💡 Design Principles

### What's Working:
1. **Instant Feedback** - Every action has immediate visual/audio response
2. **Multiple Mechanics** - Different gameplay styles keep it fresh
3. **Progressive Difficulty** - Adjustable settings let students find their level
4. **Positive Reinforcement** - XP, achievements, celebrations
5. **No Penalties for Exploration** - Can switch modes anytime

### What to Keep:
- Canvas-based games are fast and responsive
- Sound effects enhance engagement (use Web Audio API)
- User-adjustable difficulty prevents frustration
- Integration with global state creates progression across modes

---

## 🔧 Technical Stack

**Libraries**:
- Chart.js (available, not yet used)
- Math.js (available, not yet used)
- KaTeX (available, not yet used)

**Currently Using**:
- Vanilla JavaScript (ES6+)
- HTML5 Canvas API
- Web Audio API (sound effects)
- localStorage API (persistence)
- CSS Grid & Flexbox (layout)

**Future Additions**:
- Chart.js for coordinate plane visualization
- Math.js for advanced problem generation
- KaTeX for beautiful equation rendering

---

## 📁 File Organization

```
index.html (5,300+ lines)
├── CSS Styles (lines 1-1000)
│   ├── Gen Alpha color system
│   ├── Game mode cards
│   ├── Achievement overlays
│   └── Responsive mobile styles
│
├── HTML Structure (lines 1000-1250)
│   ├── Loading screen (dancing 67)
│   ├── Achievement overlay
│   ├── Header with toggle
│   ├── Mode selector
│   └── Game container + sidebar
│
└── JavaScript (lines 1250-5300)
    ├── Global state management
    ├── Achievement system (45 achievements)
    ├── Gen Alpha mode & easter eggs
    ├── Problem generation engine
    ├── Classic Practice mode
    ├── Number Line Jumper mode
    ├── Bubble Pop mode
    ├── Space Shooter stub
    ├── Math Tetris stub
    └── Initialization & event handlers
```

---

## ✅ Success Metrics

**Working Features**:
- 3 fully playable game modes ✅
- 45 achievements defined ✅
- XP system with localStorage ✅
- Gen Alpha mode toggle ✅
- Mobile-responsive design ✅
- Sound effects ✅
- Pause controls ✅
- Daily goal tracking ✅

**Next Milestones**:
- Space Shooter gameplay
- Math Tetris gameplay
- Chart.js coordinate plane integration
- AI tutor implementation
- Nuclear Safety System

---

**Maintained by**: Math Detective Academy Dev Team  
**Last Code Update**: October 22, 2025  
**Total Active Lines**: ~5,300 in `index.html`
