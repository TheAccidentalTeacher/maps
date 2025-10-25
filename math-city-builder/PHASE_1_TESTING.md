# 🚀 Phase 1 Testing Instructions

## ✅ What's Been Created

```
math-city-builder/
├── index.html              ✅ Full-screen 3D city builder UI
├── city-builder.css        ✅ Gen Alpha purple/orange theme
├── city-builder.js         ✅ Babylon.js scene with 50×50 grid
├── math-engine.js          ✅ Math problem generator (ready for Phase 3)
├── shared-state.js         ✅ localStorage bridge to main app
├── building-menu.js        ✅ Placeholder (Phase 2)
├── structures.json         ✅ 5 test buildings (393 in Phase 2)
└── README.md               ✅ Developer quick reference
```

---

## 🎮 How to Run (3 Options)

### Option 1: Python HTTP Server (Recommended)
```powershell
cd C:\Users\scoso\WEBSITES\Mr-Somers-Math\math-city-builder
python -m http.server 8080
```
Then open: **http://localhost:8080**

### Option 2: VS Code Live Server
1. Right-click `math-city-builder/index.html`
2. Select "Open with Live Server"
3. Browser opens automatically

### Option 3: Direct File Open (May have CORS issues)
```powershell
start index.html
```
(Use Option 1 or 2 if Babylon.js doesn't load)

---

## 🧪 Phase 1 Testing Checklist

### Visual Checks
- [ ] **Loading screen** appears with purple spinner
- [ ] Loading screen fades out after 2 seconds
- [ ] **50×50 green grid** visible with gray lines
- [ ] Top HUD shows: "💰 $1,000" and "City Value: $0 / $1,000,000"
- [ ] Bottom bar shows 5 action buttons
- [ ] Camera starts at 45° northeast angle

### Camera Controls (Touchpad-Optimized)
- [ ] **Left-click drag**: Camera orbits slowly (touchpad-friendly speed)
- [ ] **Scroll wheel**: Zoom in/out (slow, controlled)
- [ ] **Right-click drag**: Pan (slide view)
- [ ] Camera **CANNOT flip upside-down** (southern hemisphere locked)
- [ ] Can zoom out to see entire grid (strategic view)
- [ ] Can zoom in close to individual tiles

### Building Placement (Click-to-Place)
- [ ] **Click any green tile** → Colored box building appears
- [ ] Building snaps to grid perfectly
- [ ] Cash deducts: $1,000 → $900 (each building costs $100)
- [ ] City value increases: $0 → $100
- [ ] Progress bar fills slightly
- [ ] Cannot place building on occupied tile (console warning)
- [ ] Cannot place if cash < $100 (alert appears)

### 67 Glitch (5% Chance)
- [ ] Randomly, green "67" flashes on screen for 0.5 seconds
- [ ] Happens ~1 in 20 building placements
- [ ] Console logs "👾 67 glitch triggered!"

### Gen Alpha Mode Toggle
- [ ] Click "Gen Alpha Mode: OFF" button
- [ ] Button changes to "Gen Alpha Mode: ON"
- [ ] Console logs slang message when 67 triggers

### Auto-Save
- [ ] Place 5+ buildings
- [ ] Reload page (F5)
- [ ] Buildings, cash, and city value persist
- [ ] Console logs "📂 City loaded!"

---

## 🎯 Expected Behavior

When you first load:
```
Console output:
✅ Math Engine loaded
✅ Shared State Bridge loaded
✅ Building Menu (Phase 2 placeholder) loaded
🏗️ Math Millionaire City Builder - Phase 1
🆕 New game started
✅ Created 50×50 grid
✅ Babylon.js scene initialized
✅ City Builder (Phase 1) loaded
📝 Instructions:
   - Click anywhere on the green grid to place a test building ($100 each)
   - Use mouse to orbit camera (slow speed for touchpads)
   - Scroll to zoom in/out
   - Phase 2 will add building menu with 393 real models
   - Phase 3 will add math problem system to earn cash
✅ Loading complete
```

When you click a tile:
```
✅ Placed building at (12, 8) - Cash: $900
💾 City saved!
```

When cash runs out (after 10 buildings):
```
⚠️ Not enough cash! Need $100
[Alert popup]: "Not enough cash! Earn more by solving math problems.
(Phase 3 will add math problem system)"
```

---

## 🐛 Troubleshooting

### "Black screen / Babylon.js doesn't load"
**Fix:** Use Python/Node.js server (not direct file open)
```powershell
python -m http.server 8080
```

### "Console errors about CORS"
**Fix:** Must run from local server (http://localhost), not file:// protocol

### "Camera is too fast"
**Fix:** Already set to 50% speed. If still too fast, edit `city-builder.js`:
```javascript
camera.angularSensibilityX = 8000;  // Make even slower (higher = slower)
camera.angularSensibilityY = 8000;
```

### "Can't see grid"
**Fix:** Zoom out (scroll wheel). Camera starts at radius 50, can zoom to 200.

### "No buildings appear when clicking"
**Fix:** Check console (F12) for errors. Ensure Babylon.js CDN loaded.

---

## 📊 Phase 1 Success Metrics

**Phase 1 is complete when:**
- ✅ Can click grid and place 20+ buildings
- ✅ Camera orbits smoothly without upside-down glitches
- ✅ Cash/city value updates correctly
- ✅ Auto-save works (reload persists state)
- ✅ 67 glitch appears ~5% of the time
- ✅ 60fps performance with 50+ buildings

---

## 🚀 Next Steps (Phase 2)

Once Phase 1 works perfectly:

1. **Generate thumbnails** for 393 GLB models
2. **Build building menu** with categories and search
3. **Load real 3D models** from kenney-city-builder assets
4. **Implement Q/E rotation** during placement
5. **Add delete mode** with 50% refund

**Estimated time:** 1-2 weeks

---

## 💡 Tips for Testing

**Quick test loop:**
1. Click 5-10 tiles to place buildings
2. Orbit camera to view from different angles
3. Zoom in/out to test camera limits
4. Reload page to verify save/load
5. Keep clicking until cash = 0 to test alert

**Performance test:**
1. Click 100+ tiles (will take time at $100 each)
2. Check FPS (F12 console, type: `gameState.engine.getFps()`)
3. Should maintain 60fps even with 100+ boxes

**Edge cases:**
- Click same tile twice (should warn "occupied")
- Click outside grid bounds (should fail gracefully)
- Zoom very close / very far
- Rotate camera 360° multiple times

---

## 📝 Phase 1 Completion Report

When you finish testing, report:

**What works:**
- [List working features]

**Issues found:**
- [List any bugs or slowdowns]

**Performance:**
- FPS with 50 buildings: ___
- FPS with 100 buildings: ___

**Student feedback:**
- [Test with 1-2 students if possible]

Then we move to **Phase 2: Building Menu + Real 3D Models!** 🎉

---

**Created:** October 22, 2025  
**Phase:** 1 - Foundation  
**Status:** Ready for Testing  
**Test Duration:** 15-30 minutes
