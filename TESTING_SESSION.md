# 🎮 GAME TESTING SESSION - Geographic Detective Academy

## 🧪 Test Each Mode (Use This Checklist)

---

## ✅ MODE 1: EXPLORE (Free Exploration) - TESTED & WORKING

**Status:** ✅ APPROVED  
**Last Tested:** October 20, 2025

### What Works:
- Click any location → Location Explorer opens
- All 7 cards load correctly
- Real photos match facts (AI-powered matching)
- Geography in Real Life card scrolls
- Weather displays correctly
- Locations save to "My Collection"

### Student Experience:
> "This is like Google Earth but WAY more fun! I love seeing the real photos and learning weird facts!"

---

## 🎯 MODE 2: MYSTERY CHALLENGE - TEST NOW

**Status:** ⏳ NEEDS TESTING  
**Code Status:** ✅ Fully implemented

### How to Test:

1. **Click "🎯 MYSTERY" button**
2. **Read the intro screen** - Does it explain the game clearly?
3. **Click "START MYSTERY GAME" button**
4. **You'll see coordinates** (e.g., "40.71° N, 74.01° W")
5. **Look at the helper guide** - Does it help?
6. **Move mouse over map** - Do coordinates update?
7. **Wait for hints:**
   - At 30 seconds → Continent hint appears
   - At 15 seconds → Specific hint appears
8. **Click on the map** where you think the location is
9. **Check feedback:**
   - ✅ If within 500km → Success! Score increases, streak continues
   - ❌ If too far → Try again
10. **Timer runs out** → Streak resets, new mystery starts

### Test Checklist:
- [ ] Intro screen explains game clearly
- [ ] Coordinates display prominently
- [ ] Timer counts down from 60 seconds
- [ ] Mouse coordinates update as you hover over map
- [ ] Continent hint appears at 30s
- [ ] Specific hint appears at 15s
- [ ] Clicking map checks your answer
- [ ] Correct answer (within 500km) gives positive feedback
- [ ] Wrong answer gives helpful feedback
- [ ] Score increases with correct answers
- [ ] Streak builds with consecutive correct answers
- [ ] New mystery loads automatically after each round
- [ ] "Skip" button works (-5 XP penalty)

### Expected Behavior:
```
1. Student sees: "Find: 40.71° N, 74.01° W"
2. Student thinks: "40° North... middle latitudes... 74° West... that's USA east coast!"
3. Student clicks near New York area
4. Game checks distance: < 500km
5. Success! +10 XP, Streak +1, New mystery loads
```

### Known Mystery Locations:
- New York City (40.71° N, 74.01° W)
- London (51.51° N, 0.13° W)
- Tokyo (35.68° N, 139.65° E)
- Paris (48.86° N, 2.35° E)
- Sydney (-33.87° S, 151.21° E)
- Cairo (30.04° N, 31.24° E)
- Rio de Janeiro (-22.91° S, 43.17° W)
- And many more!

### What to Fix (if broken):
- [ ] Timer not counting down
- [ ] Hints not appearing
- [ ] Coordinates not displaying
- [ ] Map clicks not registering
- [ ] Score not updating
- [ ] Streak not resetting on timeout

---

## 🌍 MODE 3: SCAVENGER HUNT - TEST NEXT

**Status:** ⏳ NEEDS TESTING  
**Code Status:** ⚠️ Unknown (need to verify)

### How to Test:

1. **Click "🌍 SCAVENGER" button**
2. **Read objectives** (e.g., "Find 3 deserts, 2 oceans, 1 mountain")
3. **Click locations** that match objectives
4. **Watch progress update** as you complete each objective
5. **Complete all objectives** for victory screen

### Test Checklist:
- [ ] Scavenger panel loads
- [ ] Objectives are clear and specific
- [ ] Map allows clicking
- [ ] Clicked locations are evaluated correctly
- [ ] Progress bar updates
- [ ] Completion message appears
- [ ] New hunt can be started
- [ ] XP awarded for completion

### Expected Behavior:
```
Objective: Find 3 deserts
1. Student clicks Sahara Desert → ✅ 1/3 deserts found
2. Student clicks Gobi Desert → ✅ 2/3 deserts found  
3. Student clicks Arabian Desert → ✅ 3/3 deserts found!
Next objective appears...
```

---

## 📸 MODE 4: GUESS THE LOCATION - TEST NEXT

**Status:** ⏳ NEEDS TESTING  
**Code Status:** ⚠️ Unknown (need to verify)

### How to Test:

1. **Click "📸 GUESS" button**
2. **Photo appears** of a random location
3. **Study the photo** for clues (climate, architecture, terrain)
4. **Click on map** where you think it is
5. **Get distance feedback** (e.g., "You're 500 miles away!")
6. **Keep guessing** until you get close
7. **Win** when within certain distance threshold

### Test Checklist:
- [ ] Photo quiz panel loads
- [ ] Random location photo displays
- [ ] Photo is high quality
- [ ] Map allows clicking for guesses
- [ ] Distance feedback is given
- [ ] Warmer/colder hints appear
- [ ] Correct answer reveals location name
- [ ] "Next Photo" button loads new challenge
- [ ] Score based on accuracy and attempts

### Expected Behavior:
```
Photo shows: Eiffel Tower, cloudy sky, European architecture
Student guess 1: Clicks Germany → "You're 500 miles away!"
Student guess 2: Clicks France → "You're 100 miles away! Getting warmer!"
Student guess 3: Clicks Paris → "CORRECT! It's Paris, France! +20 XP"
```

---

## 🏆 MODE 5: ALASKA MISSIONS - MOSTLY WORKING

**Status:** ✅ PARTIALLY TESTED  
**Code Status:** ✅ Recently updated

### How to Test:

1. **Click "🏆 MISSIONS" button**
2. **Map zooms to Alaska** (focused on Glennallen)
3. **Round 1 starts** - Explore Copper River Basin
4. **Complete objectives** for Round 1
5. **Progress to Round 2, 3, 4...**
6. **Complete all rounds** for achievement

### Test Checklist:
- [ ] Missions panel loads
- [ ] Map zooms to Alaska (not world view)
- [ ] Glennallen is highlighted/centered
- [ ] Round descriptions are clear
- [ ] Alaska-specific locations appear
- [ ] Copper River Basin locations work
- [ ] Progress saves between sessions
- [ ] Victory screen after final round
- [ ] Alaska achievement badges unlock

### Alaska Locations to Verify:
- Glennallen (home base)
- Valdez
- Cordova
- McCarthy
- Chitina
- Copper Center
- Denali
- Anchorage
- Fairbanks
- Juneau

---

## 🗺️ MODE 6: CREATE MODE - TEST LAST

**Status:** ⏳ NEEDS TESTING  
**Code Status:** ⚠️ Unknown (may not be fully implemented)

### How to Test:

1. **Click "🗺️ CREATE" button**
2. **Check if panel loads** with create tools
3. **Try adding custom marker** to map
4. **Try adding label/note**
5. **Try saving map**
6. **Try loading saved map**

### Test Checklist:
- [ ] Create panel loads
- [ ] Tools are available (add marker, add label, etc.)
- [ ] Map allows placing custom markers
- [ ] Labels can be added to markers
- [ ] Maps can be saved (localStorage or export)
- [ ] Saved maps can be loaded
- [ ] Maps can be shared (if implemented)
- [ ] Clear instructions for students

### If Not Working:
This mode may need to be built from scratch if not implemented.

---

## 🐛 BUG REPORTING FORMAT

When you find a bug, document it like this:

```
BUG #[NUMBER]
Game Mode: [MODE NAME]
Severity: [CRITICAL / HIGH / MEDIUM / LOW]
Description: [What's broken?]
Steps to Reproduce:
  1. [Step 1]
  2. [Step 2]
  3. [Bug occurs]
Expected Behavior: [What should happen]
Actual Behavior: [What actually happens]
Screenshot: [If applicable]
Browser: [Chrome/Firefox/Safari/etc.]
```

**Example:**
```
BUG #1
Game Mode: Mystery Challenge
Severity: HIGH
Description: Timer doesn't stop when correct answer is clicked
Steps to Reproduce:
  1. Start mystery game
  2. Click correct location within 10 seconds
  3. Timer keeps counting down to 0
Expected Behavior: Timer should stop immediately on correct answer
Actual Behavior: Timer continues counting, then resets streak
Screenshot: [attach]
Browser: Chrome 120
```

---

## 📊 TESTING PROGRESS

| Game Mode | Tested | Bugs Found | Bugs Fixed | Approved |
|-----------|--------|------------|------------|----------|
| Explore | ✅ | 0 | 0 | ✅ |
| Mystery | ⏳ | ? | ? | ⏳ |
| Scavenger | ⏳ | ? | ? | ⏳ |
| Guess | ⏳ | ? | ? | ⏳ |
| Missions | ✅ | 0 | 0 | ⏳ |
| Create | ⏳ | ? | ? | ⏳ |

---

## 🎯 START HERE

**Your Next Action:**  
1. Open your live site: https://dashing-sable-201212.netlify.app
2. Click "🎯 MYSTERY" button
3. Follow the "MODE 2: MYSTERY CHALLENGE" testing steps above
4. Report any bugs you find
5. If it works perfectly, move to Scavenger Hunt

**Let's make every game perfect!** 🎮

