# 🏗️ Math Millionaire City Builder

**Build a $1,000,000 city by solving math problems!**

---

## 🚀 Quick Start (Development)

### Option 1: Python HTTP Server
```bash
cd math-city-builder
python -m http.server 8080
```
Then open: `http://localhost:8080`

### Option 2: VS Code Live Server
1. Right-click `index.html`
2. Select "Open with Live Server"

### Option 3: Node.js HTTP Server
```bash
cd math-city-builder
npx http-server -p 8080
```

---

## 📁 Project Structure

```
math-city-builder/
├── index.html              ← Main entry point
├── city-builder.css        ← Styles (Gen Alpha purple/orange)
├── city-builder.js         ← Babylon.js game logic
├── building-menu.js        ← UI for browsing buildings
├── math-engine.js          ← Problem generator (from main app)
├── shared-state.js         ← localStorage bridge
├── structures.json         ← 393 building definitions
│
├── assets/                 ← (EXISTING - linked to ../assets/)
│   └── kenney-city-builder/
│
├── thumbnails/             ← Generated building previews
│   ├── roads/
│   ├── parks/
│   ├── suburban/
│   ├── commercial/
│   ├── industrial/
│   └── special/
│
└── dev-tools/
    ├── generate-thumbnails.js
    ├── rebalance-prices.js
    └── validate-structures.js
```

---

## 🎯 Current Phase: **Phase 1 - Foundation**

**Goal:** Get basic grid + camera + placement working

**Tasks:**
- [x] Create folder structure
- [ ] Set up Babylon.js scene
- [ ] Implement camera (slow, no upside-down)
- [ ] Create 50×50 grid
- [ ] Load 5 test buildings
- [ ] Basic click-to-place
- [ ] Cash system ($1000 starting)

**Next Step:** Open `index.html` and start implementing Babylon.js scene!

---

## 🧪 Testing

```bash
# Open in browser
start index.html  # Windows
open index.html   # Mac
```

**Expected behavior:**
- 3D scene loads with grid
- Camera orbits smoothly (slow speed)
- Can click grid to place building
- Cash deducts correctly

---

## 📚 Resources

- **Implementation Guide:** `../CITY_BUILDER_IMPLEMENTATION_GUIDE.md`
- **Main App Math Engine:** `../index.html` (line 1843)
- **Babylon.js Docs:** https://doc.babylonjs.com/
- **Kenney Assets:** `../assets/kenney-city-builder/`

---

## 🎮 Game Design Summary

- **Starting Cash:** $1,000
- **Earning Formula:** `$5 × answer value × operation multiplier`
- **Building Count:** 393 models (Roads, Parks, Residential, Commercial, Industrial, Special)
- **Goal:** Build city worth $1,000,000 (~2,000 math problems)
- **Milestones:** $10k, $50k, $100k, $250k, $500k, $750k, $1M (with bonus cash)

---

## 🐛 Troubleshooting

**Black screen?**
- Check console (F12) for errors
- Verify Babylon.js CDN loaded correctly
- Ensure camera position is valid

**Buildings won't load?**
- Check GLB file paths in structures.json
- Verify CORS headers (use local server, not file://)

**Performance issues?**
- Reduce shadow quality
- Enable instancing for repeated buildings
- Use LOD (Level of Detail) system

---

## ✅ Deployment Checklist

**Before pushing to production:**
- [ ] All 393 buildings load correctly
- [ ] 60fps with 500+ buildings
- [ ] Math problems generate correctly
- [ ] XP syncs to main app
- [ ] Milestones trigger correctly
- [ ] 67 glitch appears ~5% of time
- [ ] Gen Alpha mode works
- [ ] Auto-save works
- [ ] Cross-browser tested

---

**Created:** October 22, 2025  
**Status:** Phase 1 - Foundation (In Progress)  
**Developer:** Mr. Somers + AI Assistant  

**LET'S BUILD! 🚀**
