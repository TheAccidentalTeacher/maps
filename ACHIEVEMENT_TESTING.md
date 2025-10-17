# 🏆 Achievement System Testing Guide

## Quick Console Tests

Open the browser console (F12) at http://localhost:8000 and run these commands:

### 1. Check System Loaded
```javascript
playerAchievements
```
**Expected:** Object with `unlocked: []`, `stats: {...}`, `lastUpdated: "..."`

### 2. Check Current Stats
```javascript
console.log('Unlocked:', playerAchievements.unlocked);
console.log('Markers placed:', playerAchievements.stats.explore.markersPlaced);
console.log('Mysteries solved:', playerAchievements.stats.mystery.solved);
console.log('Modes played:', Array.from(playerAchievements.stats.universal.modesPlayed));
```

### 3. Test Manual Unlock
```javascript
unlockAchievement('explore', 'globeTrotter');
```
**Expected:** Full-screen celebration overlay with confetti! 🎉

### 4. Check localStorage Persistence
```javascript
JSON.parse(localStorage.getItem('playerAchievements'))
```
**Expected:** Same data as playerAchievements object

### 5. Test Achievement Unlock Detection
```javascript
isAchievementUnlocked('globeTrotter')
```
**Expected:** `true` (if you unlocked it above)

---

## Gameplay Testing

### Test Alaska Adventure Achievements

1. **Start the game:**
   - Click "Alaska Adventure" mode
   - Click "START ALASKA ADVENTURE"
   - **Check console:** `playerAchievements.stats.universal.modesPlayed` should include 'alaska'

2. **Find a mountain:**
   - Look for "Mount Wrangell" or "Denali" in Round 1
   - Click near the location
   - **Watch for:** "+30 XP" notification

3. **Check if tracking worked:**
   ```javascript
   console.log('Alaska found:', gameState.alaska.foundLocations);
   console.log('Total found:', gameState.alaska.totalFound);
   ```

4. **Force unlock Mountain Master:**
   ```javascript
   // Simulate finding 5 mountains
   gameState.alaska.foundLocations = ['r0_2', 'r1_0', 'r2_0', 'r3_1', 'r4_2'];
   gameState.alaska.totalFound = 5;
   checkAlaskaAchievements();
   ```
   **Expected:** "⛰️ Mountain Master" achievement unlocked!

### Test Mystery Challenge Achievements

1. **Start Mystery:**
   - Click "Mystery Challenge" mode
   - Click "START MYSTERY CHALLENGE"
   - **Check:** `playerAchievements.stats.universal.modesPlayed` should include 'mystery'

2. **Solve a mystery:**
   - Read the coordinates
   - Click near the location
   - **Watch for:** Achievement check after solve

3. **Check tracking:**
   ```javascript
   console.log('Mysteries solved:', playerAchievements.stats.mystery.solved);
   console.log('Unique locations:', playerAchievements.stats.mystery.uniqueLocationsSolved.size);
   ```

4. **Force unlock Mystery Solver:**
   ```javascript
   playerAchievements.stats.mystery.solved = 10;
   checkMysteryAchievements();
   ```
   **Expected:** "🔍 Mystery Solver" achievement unlocked!

### Test Explore Mode Achievements

1. **Place markers:**
   - Click anywhere on the map (not in a game mode)
   - Click 5-10 different locations
   - **Check:** `playerAchievements.stats.explore.markersPlaced` should increase

2. **Zoom in and out:**
   - Use mouse wheel or +/- buttons
   - Try different zoom levels
   - **Check:** `playerAchievements.stats.explore.zoomLevelsUsed.size` should grow

3. **Force unlock Marker Maniac:**
   ```javascript
   playerAchievements.stats.explore.markersPlaced = 50;
   checkExploreAchievements();
   ```
   **Expected:** "📍 Marker Maniac" achievement unlocked!

### Test Universal Achievements

1. **Play multiple modes:**
   - Start Alaska Adventure
   - Start Mystery Challenge
   - Place a marker in Explore
   - **Check:**
   ```javascript
   console.log('Modes played:', Array.from(playerAchievements.stats.universal.modesPlayed));
   ```

2. **Force unlock Game Hopper:**
   ```javascript
   playerAchievements.stats.universal.modesPlayed = new Set(['explore', 'mystery', 'alaska', 'coordinate', 'scavenger', 'guess', 'heist']);
   checkUniversalAchievements();
   ```
   **Expected:** "🎮 Game Hopper" achievement unlocked!

---

## localStorage Testing

### Test Persistence Across Reloads

1. **Before reload:**
   ```javascript
   console.log('Before:', playerAchievements.unlocked);
   ```

2. **Reload the page (F5)**

3. **After reload:**
   ```javascript
   console.log('After:', playerAchievements.unlocked);
   ```
   **Expected:** Same achievements as before!

### Clear All Progress (for testing)
```javascript
localStorage.removeItem('playerAchievements');
location.reload();
```

---

## Celebration Animation Testing

### Test All Tiers

```javascript
// Common (gray)
unlockAchievement('explore', 'zoomMaster');

// Uncommon (blue)
unlockAchievement('explore', 'layerExpert');

// Rare (purple)
unlockAchievement('mystery', 'speedDetective');

// Epic (orange)
unlockAchievement('mystery', 'streakMaster');

// Legendary (red)
unlockAchievement('alaska', 'alaskaExpert');
```

**Expected:** Each should show different colored border and confetti!

---

## Known Working Features ✅

- [x] Achievement system loads on page load
- [x] localStorage save/restore with Sets
- [x] Full-screen celebration overlays
- [x] Confetti particle effects
- [x] Tier-based XP rewards
- [x] Alaska location tracking
- [x] Mystery solve tracking
- [x] Explore marker tracking
- [x] Explore zoom tracking
- [x] Universal mode tracking
- [x] Daily play date tracking

## Known TODO 📋

- [ ] Coordinate Finder integration
- [ ] Scavenger Hunt integration
- [ ] Guess Mode integration
- [ ] Create Heist integration
- [ ] Layer usage tracking
- [ ] Continent detection
- [ ] Speed tracking (time-based achievements)
- [ ] Hint usage tracking
- [ ] Accuracy calculation

---

## Quick Debug Commands

```javascript
// View all achievements database
console.table(Object.entries(ACHIEVEMENTS.explore).map(([id, a]) => ({id, name: a.name, xp: a.xp})));

// View unlock status
playerAchievements.unlocked.forEach(id => {
  console.log('✅', id);
});

// Reset one achievement
playerAchievements.unlocked = playerAchievements.unlocked.filter(id => id !== 'globeTrotter');
saveAchievements();

// View all stats
console.log('Explore:', playerAchievements.stats.explore);
console.log('Mystery:', playerAchievements.stats.mystery);
console.log('Alaska:', playerAchievements.stats.alaska);
console.log('Universal:', playerAchievements.stats.universal);
```

---

## Expected Test Results

After a full gameplay session, you should see:
- ✅ Achievements unlocked with celebrations
- ✅ Stats incrementing correctly
- ✅ localStorage saving automatically
- ✅ Persistence across page reloads
- ✅ XP rewards adding to total
- ✅ No console errors
- ✅ Smooth animations

**Ready to test! Open http://localhost:8000 and press F12!** 🚀
