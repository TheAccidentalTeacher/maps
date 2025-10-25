# 🚀 Quick Start Guide - Math Detective Academy

**Current Status**: 3 working game modes + 2 stubs  
**Last Updated**: October 22, 2025

---

## 🎮 How to Run

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari)
2. Wait for loading screen (dancing 6️⃣7️⃣)
3. Choose a game mode from the selector
4. Start solving problems and earning XP! 🔥

---

## ✅ Working Modes

| Mode | Icon | Type | Status |
|------|------|------|--------|
| Classic Practice | 📝 | Flash Cards | ✅ Working |
| Number Line Jumper | 🦘 | Platformer | ✅ Working |
| Bubble Pop | 🫧 | Clicker | ✅ Working |
| Space Shooter | 🚀 | Arcade | 🚧 Stub |
| Math Tetris | 🧩 | Puzzle | 🚧 Stub |

---

## 🏆 Key Features

- **45 Achievements** - Unlock badges from Common → Legendary
- **XP System** - Earn points for correct answers
- **Gen Alpha Mode** - Toggle slang and easter eggs
- **Streak Tracking** - Keep the fire going! 🔥
- **Daily Goals** - 20 problems per day
- **4 Operations** - ×, +, −, ÷ with adjustable difficulty
- **localStorage** - Progress auto-saved (no login needed)

---

## 🎯 For Developers

### File Structure:
```
index.html          # Main app (5,300 lines)
docs/               # Documentation
ACTIVE_GAME_MODES.md      # Game mode status
FUTURE_MATH_CITY_BUILDER.md  # Future plans
```

### Key Functions:
- `selectGameMode(mode)` - Switch between modes
- `generateNewProblem()` - Create math problems
- `checkAnswer()` - Validate and award XP
- `unlockAchievement(ach)` - Trigger celebration

### Adding a New Mode:
1. Create init function (e.g., `initSpaceMode()`)
2. Create game function (e.g., `startSpaceShooter(canvas)`)
3. Add case to `selectGameMode()` switch
4. Add mode card to selector UI

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `ACTIVE_GAME_MODES.md` | Current game mode details |
| `FUTURE_MATH_CITY_BUILDER.md` | City Builder future plans |
| `REMOVAL_SUMMARY.md` | What was removed and why |
| `docs/00_OVERVIEW_START_HERE.md` | Full project overview |
| `MATH_CITY_BUILDER_PLAN.md` | Original city builder design |

---

## 🔥 Next Steps

1. **Test current modes** - Verify all 3 working modes function correctly
2. **Implement Space Shooter** - Use Bubble Pop as canvas template
3. **Implement Math Tetris** - Use Number Line Jumper physics
4. **Add Chart.js** - Create coordinate plane visualization
5. **Add AI Tutor** - Integrate GPT hints system

---

## 🐛 Known Issues

- Math City Builder removed (see `FUTURE_MATH_CITY_BUILDER.md`)
- Space Shooter shows "Coming Soon" stub
- Math Tetris shows "Coming Soon" stub
- Chart.js loaded but not yet used
- KaTeX loaded but not yet used

---

## 💡 Quick Tips

**For Students:**
- Press `Space` to pause Number Line Jumper or Bubble Pop
- Toggle Gen Alpha mode for slang and easter eggs
- Watch for the 6️⃣7️⃣ easter egg (4.5% chance!)
- Complete daily goal for achievement

**For Teachers:**
- All content is G-rated (safety system in place)
- No login required (uses browser storage)
- Works offline after first load
- Mobile-responsive design

**For Developers:**
- Check console for debug logs
- Use browser DevTools to inspect localStorage
- Sound effects use Web Audio API
- Canvas games run at 60fps

---

## 🎨 Color Scheme

Purple/Orange math theme:
- Primary: `#9f7aea` (Purple)
- Secondary: `#f6ad55` (Orange)
- Accent: `#fc8181` (Coral)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)

---

## 📱 Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
⚠️ IE11 not supported

---

**Happy Coding!** 🚀

*"Math is cool when you make it fun fr fr" - Gen Alpha Students*
