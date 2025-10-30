# 🎯 MATH CITY BUILDER - QUICK REFERENCE CARD

**Print this or keep it visible when working on the project!**

---

## 📂 THE ACTUAL WORKING GAME

```
Location: math-city-builder/
Status: 60% COMPLETE ✅
Last Modified: October 26, 2025, 9:37 PM
```

---

## 🚀 QUICK START

### Start Server:
```powershell
cd C:\Users\scoso\WEBSITES\Mrsomersmaps
python -m http.server 8000
```

### Open Game:
```
http://localhost:8000/math-city-builder/index.html
```

---

## ✅ WHAT WORKS (60%)

- ✅ Game engine (412 lines)
- ✅ 2D Canvas rendering system
- ✅ Building system (5 tiers)
- ✅ Math quiz system (10 types)
- ✅ Economy & progression
- ✅ Save/load (localStorage)
- ✅ Zoom/pan controls

---

## ⚠️ WHAT'S BROKEN (40%)

- ❌ Sprite assets (need PNG files or emoji)
- ⚠️ Quiz modal (needs testing)
- ⚠️ Building placement (needs testing)
- ❌ Supabase integration (uses localStorage only)

---

## 🎯 TO FINISH (8-12 hours)

1. **Fix sprites** (2-4 hrs) - Use emoji placeholders
2. **Test features** (2 hrs) - Quiz modal, placement
3. **Add Supabase** (4 hrs) - Cloud save
4. **Polish** (2 hrs) - Animations, sounds

---

## 📚 DOCUMENTATION TO READ

✅ **00_START_HERE_MATH_CITY_BUILDER.md** - Start here!  
✅ **MATH_CITY_BUILDER_ACTUAL_STATUS.md** - Full details  
❌ **GDEVELOP_PROGRESS_TRACKER.md** - IGNORE! (wrong)  

---

## 🔑 KEY FILES

**Game Code:**
- `math-city-builder/js/game.js` (412 lines - main engine)
- `math-city-builder/js/canvas.js` (238 lines - rendering)
- `math-city-builder/js/buildings.js` (building catalog)
- `math-city-builder/js/quiz.js` (quiz system)
- `math-city-builder/js/mathTypes.js` (10 problem types)
- `math-city-builder/js/grid.js` (grid/coordinate system)

**Old/Deprecated:**
- `math-city-builder.html` - OLD Three.js version (ignore)

---

## ⚡ QUICK FIXES

### Sprite Issue (Fastest Fix):
```javascript
// In canvas.js, replace sprite loading with:
const emojis = {1:'🏠', 2:'🏢', 3:'🏭', 4:'🌆', 5:'🗼'};
ctx.font = '64px Arial';
ctx.fillText(emojis[building.tier], x, y);
```

### Test Building Placement:
1. Open game in browser
2. Click building in sidebar
3. Click canvas area
4. Check console for errors

### Check Quiz Modal:
1. Click "Earn Dollars" button
2. Modal should appear
3. Check console if it doesn't

---

## 🚨 COMMON MISTAKES

❌ **DON'T** open `math-city-builder.html` (old file!)  
❌ **DON'T** read GDEVELOP_PROGRESS_TRACKER.md (we never used GDevelop!)  
❌ **DON'T** start over (60% is already done!)  
✅ **DO** open `math-city-builder/index.html` (the working version!)  
✅ **DO** test what exists before adding new features  
✅ **DO** update docs immediately after changes  

---

## 💾 SUPABASE INFO

**Project URL:**
```
https://fuppbkhfqutzcromomkc.supabase.co
```

**Table:** `city_progress`

**Auth Code Location:**
Old `math-city-builder.html` has working Supabase integration (lines 400-450)

---

## 📊 COMPLETION CHECKLIST

Current: 60% ✅

Remaining Tasks:
- [ ] Sprites working (emoji or PNG)
- [ ] Quiz modal tested and working
- [ ] Building placement tested
- [ ] Money deducts on purchase
- [ ] City value updates correctly
- [ ] Demolish mode works
- [ ] Supabase integration added
- [ ] Save/load tested
- [ ] All 5 tiers unlock properly
- [ ] Milestone bonuses trigger

---

## 🎮 GAME FEATURES

**Starting Money:** $100  
**Goal:** Build $1,000,000 city  
**Progression:** 5 tiers unlock by city value  
**Earn Money:** Solve math problems  
**10 Math Types:** Elementary → High School  
**Milestones:** $1K, $10K, $100K, $1M (with bonuses!)  

---

## 📞 HELP!

**If confused:** Read 00_START_HERE_MATH_CITY_BUILDER.md  
**If broken:** Check browser console (F12)  
**If lost:** Check file timestamps (see Quick Start section)  
**If docs wrong:** Trust the code timestamps over old docs  

---

**Last Updated:** October 27, 2025, 8:20 AM  
**Next Update:** After fixing sprites or completing major features
