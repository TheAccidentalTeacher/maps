# 🎮 Math Detective Academy - Game Modes

## Overview
The app now features a **Game Mode Selector** that lets students choose their preferred learning style. All modes share the same XP, achievements, and progress tracking system.

---

## 🎯 Main Menu (Game Mode Selector)

When students open the app, they see 6 game mode cards:

### Mode Selection Features:
- **Persistent preference**: Last-used mode is saved and auto-loaded next visit
- **Back to Menu button**: Always accessible to switch modes
- **Shared progress**: All modes award the same XP and unlock the same achievements
- **Visual cards**: Each mode has icon, title, description, and difficulty rating

---

## 📝 Mode 1: Classic Practice
**Status**: ✅ FULLY FUNCTIONAL (original flash card system)

**Description**: Traditional flash cards with XP rewards. Perfect for grinding!

**Features**:
- Random multiplication problems (1-10 tables)
- Instant feedback (correct/incorrect)
- Enter key to submit answers
- Timer tracking (hidden, for achievements)
- Streak counter with 🔥 badge
- 45-achievement system
- Stats dashboard (4 collapsible cards)

**Why kids will use it**: 
- Least intimidating entry point
- Familiar flash card format
- Achievement hunting hook

---

## 🫧 Mode 2: Bubble Pop
**Status**: ✅ FULLY FUNCTIONAL (HTML5 Canvas game)

**Description**: Pop bubbles with correct answers before they escape. Satisfying!

**Gameplay**:
1. Math problem bubbles float up from bottom
2. 6 answer buttons at bottom (1 correct, 5 wrong)
3. Click correct answer to pop bubble (explosion animation!)
4. Wrong answer = bubble keeps rising
5. If bubble escapes top = lose a life (3 total)
6. Speed increases as you progress

**Features**:
- **Lives system**: ❤️❤️❤️ (game over at 0)
- **Score tracking**: +10 points per correct answer
- **Particle explosions**: Satisfying pop effect
- **Wobble animation**: Bubbles sway as they rise
- **Speed ramping**: Gets faster as you improve
- **Shared XP/achievements**: Awards same 30 XP as classic mode

**Technical**:
- Pure Canvas API (no libraries needed)
- Runs at 60 FPS (requestAnimationFrame)
- Mouse hover effects on buttons
- Gradient bubble rendering with glow

**Why kids will love it**:
- 🎯 Visual/kinesthetic learners
- 💥 Satisfying explosion feedback
- ⏱️ Time pressure (engaging without stressful timer display)
- 🎨 Colorful, arcade-style aesthetic

---

## 🦘 Mode 3: Number Line Jumper
**Status**: ⏳ COMING SOON (Stub implemented)

**Planned Features**:
- Side-scrolling platformer character
- Jump to land on correct answer
- Physics-based movement
- Power-ups (double XP, slow-mo)
- Obstacle avoidance

**Why it will work**:
- Movement = engagement
- Combines motor skills + math
- Feels like a "real" game

**Tech stack**: Phaser.io or vanilla Canvas with physics

---

## 🏗️ Mode 4: Math City Builder
**Status**: ⏳ COMING SOON (Stub implemented)

**Planned Features**:
- Solve problems to earn building pieces
- Drag-and-drop building placement
- Persistent city that grows over sessions
- Visual progress (empty lot → metropolis)
- Unlock new building types via achievements

**Why it will work**:
- Appeals to creative kids
- Low-stress, chill vibes
- Tangible visual progress
- Minecraft generation loves building

**Tech stack**: Konva.js for drag-and-drop, Canvas for rendering

---

## 🚀 Mode 5: Space Shooter
**Status**: ⏳ COMING SOON (Stub implemented)

**Planned Features**:
- Asteroids with problems fly at you
- Shoot missiles labeled with answers
- Retro pixel art style
- Sound effects (pew pew!)
- Boss battles (harder problems)

**Why it will work**:
- Retro arcade nostalgia
- Fast-paced action
- Clear win/lose states
- Boys especially love shooters

**Tech stack**: Phaser.io (arcade physics ready)

---

## 🧩 Mode 6: Math Tetris
**Status**: ⏳ COMING SOON (Stub implemented)

**Planned Features**:
- Falling blocks with numbers
- Match blocks to create products (e.g., 7 block + 8 block = 56)
- Clear rows for bonus XP
- Classic Tetris mechanics
- Speed increases per level

**Why it will work**:
- Tetris is universally addictive
- Spatial reasoning + math
- Puzzle solvers love it
- No fail state (just highscore chasing)

**Tech stack**: Vanilla Canvas (Tetris doesn't need complex physics)

---

## 🔗 Unified Systems

All 6 modes share:

### ✅ Already Implemented:
- **45-achievement system**: Same achievements unlock regardless of mode
- **XP tracking**: Total XP accumulates across all modes
- **Stats dashboard**: Sidebar shows combined stats
- **localStorage persistence**: Progress saved per mode + overall
- **Gen Alpha mode**: Slang toggle works in all modes
- **Dancing 67 loading**: Appears on initial page load
- **4.5% easter egg**: Six Seven glitch trigger system

### ⏳ To Be Added:
- **Sound effects**: Success/error sounds in all modes
- **Operation selector**: Choose ×, ÷, +, - in each mode
- **Difficulty levels**: Easy (1-5), Medium (1-10), Hard (1-12)
- **Daily challenges**: Mode-specific daily goals
- **Per-mode stats**: Track which mode you're best at

---

## 🎨 UI/UX Design

### Game Mode Selector:
- **Grid layout**: 3 columns on desktop, 1 on mobile
- **Card hover effects**: Lift + glow on hover
- **Purple/orange theme**: Consistent with overall app
- **Clear difficulty ratings**: ⭐ (easy) to ⭐⭐⭐ (hard)
- **Footer message**: "All modes share the same XP & achievements! Switch anytime."

### In-Game:
- **Back to Menu button**: Fixed top-left corner
- **Canvas/container**: 800x600px (most modes)
- **Sidebar preserved**: Stats still visible (collapsed to save space)
- **Consistent controls**: Mouse/touch for all modes

---

## 📊 Data Flow

```
User enters app
  ↓
Check localStorage for currentGameMode
  ↓
If mode saved → Auto-load preferred mode
If no mode → Show game mode selector
  ↓
User selects mode
  ↓
Save preference to localStorage
  ↓
Hide selector, show game container
  ↓
Initialize selected mode (canvas/DOM setup)
  ↓
Game loop starts
  ↓
User solves problems → Award XP/achievements
  ↓
Stats update in real-time
  ↓
User clicks "Back to Menu"
  ↓
Save state, clear loops, show selector
```

---

## 🚀 Next Steps (Priority Order)

1. **Test Bubble Pop with students** (it's ready!)
   - Get feedback on difficulty
   - Adjust spawn rate/speed
   - Polish explosion effects

2. **Build Number Line Jumper** (highest engagement potential)
   - Create character sprite
   - Implement jump physics
   - Add number line rendering

3. **Add sound effects to all modes**
   - Success: randomized "ding", "sheesh", "W!", "boom", "slay"
   - Error: buzzer sound
   - Explosion: pop sound for Bubble mode

4. **Build Space Shooter** (fast-paced kids will demand it)
   - Retro pixel aesthetic
   - Missile collision detection
   - Score combo system

5. **Build Math Tetris** (puzzle lovers)
   - Classic Tetris controls
   - Number matching logic
   - Row clearing animations

6. **Build City Builder** (chill mode for breaks)
   - Drag-and-drop buildings
   - Save city state
   - Achievement-gated buildings

7. **Add operation/difficulty selectors**
   - Works across all modes
   - Per-operation stats tracking
   - Achievement for "All Operations Master"

---

## 💡 Teacher Notes

### How to Use:
1. Let students choose their preferred mode
2. All modes teach the same multiplication facts
3. Switching modes keeps things fresh (prevents burnout)
4. Check stats dashboard to see which mode they use most

### Which Mode for Which Student?

**Classic Practice**: 
- Struggling students who need simplicity
- Test prep (straight drilling)

**Bubble Pop**:
- Visual learners
- Kids who like arcade games
- Need immediate satisfaction (explosions!)

**Number Line Jumper** (when built):
- Kinesthetic learners
- ADHD kids (movement helps focus)
- Platformer fans

**City Builder** (when built):
- Minecraft generation
- Anxious kids (low-pressure)
- Creative types

**Space Shooter** (when built):
- Competitive kids
- Boys especially
- High energy students

**Math Tetris** (when built):
- Puzzle solvers
- Strategic thinkers
- Kids who like Tetris (duh)

---

## 🎯 Success Metrics

Track in future updates:
- **Mode popularity**: Which modes get used most?
- **Mode efficacy**: Which modes lead to highest accuracy?
- **Mode retention**: Which modes keep kids playing longest?
- **Mode switching**: Do kids stick to one or bounce between?

---

## 🔧 Technical Details

### File Structure:
- **Single HTML file**: All modes in one index.html
- **No external dependencies** (except Chart.js, Math.js, KaTeX from CDN)
- **Modular functions**: Each mode has init + start functions
- **Shared state**: gameState object tracks everything

### Canvas Games (Bubble, Jumper, Space, Tetris):
- Pure Canvas API (no WebGL)
- requestAnimationFrame for smooth 60 FPS
- Event listeners for mouse/touch input
- Cleanup on mode switch (prevent memory leaks)

### Performance:
- **Bubble Pop**: ~200 draw calls/frame (very light)
- **Canvas size**: 800x600 (scales to mobile)
- **No lag** on modern devices (tested Chrome, Firefox, Safari)

---

## 🎨 Future Enhancements

### Visual Polish:
- [ ] Add background music (per mode)
- [ ] Particle systems for all modes
- [ ] Screen shake on explosions
- [ ] Confetti on achievements

### Gameplay:
- [ ] Combo system (3 in a row = 2x XP)
- [ ] Power-ups (freeze time, double points)
- [ ] Boss battles (harder problems)
- [ ] Co-op mode (two students work together)

### Meta-Game:
- [ ] Unlock cosmetics (bubble skins, city themes)
- [ ] Mode-specific achievements
- [ ] Daily mode rotation challenges
- [ ] "Mode of the Week" leaderboard

---

**Built with ❤️ for middle schoolers who need math to be FUN**
