# 🏗️ MATH CITY BUILDER - ENTERPRISE MASTER PLAN

**Project:** Math City Builder (Standalone Educational Game)  
**Date Created:** October 25, 2025  
**Status:** � IN DEVELOPMENT (Construct 3)  
**Target Launch:** TBD (~2 weeks after core mechanics complete)  
**Architecture:** Construct 3 game → HTML5 export → Supabase persistence  
**Development Platform:** Construct 3 (Annual License: $168)

---

## ⚠️ ARCHITECTURE CHANGE (October 25, 2025)

**ORIGINAL PLAN:** Build in vanilla HTML/JavaScript  
**REVISED PLAN:** Build in Construct 3 visual game engine

**Reason for Change:**
- User wants rotatable 3D camera (street view → satellite view)
- Construct 3 supports 3D rendering + Kenney GLB models natively
- Visual event system may be easier for non-coders to maintain

**Trade-offs:**
- ✅ Better 3D support, easier asset management
- ⚠️ Longer development time (manual UI work vs writing code)
- ⚠️ Requires $168/year Construct 3 license (already purchased)
- ⚠️ Must export to HTML5, then embed in website

**Current Progress:** Phase 3 complete (see CONSTRUCT3_PROGRESS_TRACKER.md)

---

## 📋 MASTER DOCUMENT INDEX

This master plan references multiple implementation documents:

### **ACTIVE DOCUMENTS (Construct 3 Implementation)**
1. **[MATH_CITY_BUILDER_MASTER_PLAN.md](MATH_CITY_BUILDER_MASTER_PLAN.md)** ← YOU ARE HERE
   - Project overview & goals
   - Success criteria
   - Architecture decisions

2. **[CONSTRUCT3_PROGRESS_TRACKER.md](CONSTRUCT3_PROGRESS_TRACKER.md)** ⭐ PRIMARY GUIDE
   - Current progress (Phases 1-3 complete)
   - Step-by-step implementation plan (16 phases)
   - Time estimates per phase
   - What's done vs what's left

3. **[CONSTRUCT3_ADVANCED_FEATURES.md](CONSTRUCT3_ADVANCED_FEATURES.md)**
   - Technical reference from research
   - 3D features, Z-elevation, vanishing point
   - Addon documentation
   - Isometric techniques

4. **[CITY_ASSETS_INVENTORY.md](CITY_ASSETS_INVENTORY.md)**
   - 200+ Kenney GLB models cataloged
   - Organized by category
   - File paths for import

### **DEPRECATED DOCUMENTS (HTML/JS Approach - Reference Only)**
These documents describe the ORIGINAL vanilla JavaScript approach.  
They are NOT being used for Construct 3 implementation but contain useful game design logic:

- **MATH_CITY_BUILDER_PHASE1_INFRASTRUCTURE.md** (Database schema still valid)
- **MATH_CITY_BUILDER_PHASE2_CORE_GAME.md** (Game mechanics apply to Construct 3)
- **MATH_CITY_BUILDER_PHASE3_QUIZ_SYSTEM.md** (Quiz logic still valid)
- **MATH_CITY_BUILDER_PHASE4_PERSISTENCE.md** (Supabase integration still valid)
- **MATH_CITY_BUILDER_PHASE5_POLISH.md** (Animation concepts still apply)
- **MATH_CITY_BUILDER_TESTING_DEPLOYMENT.md** (Testing strategy still valid)

---

## 🎯 PROJECT OVERVIEW

### What We're Building

**Math City Builder** is a standalone educational game where students:
1. Answer times tables questions (2× through 12×)
2. Earn cash for correct answers
3. Build a city with purchased buildings
4. Watch their city grow as they master multiplication
5. Compete for highest city value

### Core Features

```
✅ Times Tables Quiz (2× to 12× tables)
✅ City Building (50×50 grid)
✅ 40+ Buildings (4 tiers: $500 to $500,000)
✅ Economic System (income per correct answer)
✅ Persistent Progress (Supabase cloud save)
✅ XP Integration (contributes to main Geography app XP)
✅ Achievement System (unlock tiers, celebrate milestones)
✅ Responsive Design (1366×768 Chromebooks, tablets)
✅ Offline Capable (localStorage fallback)
✅ FERPA Compliant (student data protection)
```

---

## 📊 SUCCESS CRITERIA

### Technical Success
```
✅ Loads in < 5 seconds on Chromebook
✅ 60 FPS performance (no lag during gameplay)
✅ Saves to Supabase every 30 seconds (auto-save)
✅ Works offline (localStorage fallback)
✅ Touch controls work on tablets
✅ No critical bugs in 3-student pilot
✅ Integrates with existing student accounts
✅ XP syncs to main Geography app
```

### Educational Success
```
✅ Students complete 20+ quizzes per session
✅ Math accuracy improves over time
✅ 80%+ session completion rate
✅ Students voluntarily replay at home
✅ Teacher reports engagement increase
✅ Covers all times tables (2× to 12×)
```

### Engagement Success
```
✅ First student reaches $100K city value within 1 week
✅ First student reaches $1M within 2 weeks
✅ Students compare city values (competition)
✅ Students strategize building placement
✅ Positive feedback from pilot group
✅ Zero complaints about "boring math practice"
```

---

## 🏗️ ARCHITECTURE OVERVIEW

### Technology Stack

```
FRONTEND:
- HTML5 (standalone page: math-city-builder.html)
- CSS3 (embedded styles, responsive)
- Vanilla JavaScript (no frameworks - fast load)

RENDERING:
- Canvas API (2D city rendering)
- CSS Grid (UI layout)
- Transform + Z-index (depth effects)

DATA PERSISTENCE:
- Supabase (primary - cloud save)
- localStorage (fallback - offline)
- Auto-save every 30 seconds

AUTHENTICATION:
- Reuse existing Supabase auth
- Student accounts already created
- No new login required

ASSETS:
- Kenney City Builder Kit (200+ GLB models)
- Render to PNG sprites (2D workflow)
- Base64 embed small assets (fast load)
```

### Data Flow

```
1. STUDENT LOGS IN (index.html)
   ↓
2. CLICKS "Math City Builder" LINK
   ↓
3. LOADS math-city-builder.html
   ↓
4. CHECKS SUPABASE AUTH (reuse session)
   ↓
5. LOADS CITY DATA FROM SUPABASE
   ├─ city_progress table (buildings, cash, tier)
   └─ game_progress table (XP earned)
   ↓
6. RENDERS CITY (Canvas 2D)
   ↓
7. STUDENT PLAYS (answer quiz → earn cash → buy buildings)
   ↓
8. AUTO-SAVES EVERY 30 SECONDS
   ├─ city_progress → Supabase
   ├─ game_progress → Supabase (XP sync)
   └─ localStorage → Backup
   ↓
9. STUDENT CLOSES GAME
   ↓
10. FINAL SAVE TO SUPABASE
```

---

## 📁 FILE STRUCTURE

```
Mrsomersmaps/
├── math-city-builder.html              ← Main game page (NEW)
│
├── assets/
│   └── city-builder/                   ← Game assets (NEW)
│       ├── sprites/                    ← Building PNG sprites
│       │   ├── tier1/                  ← Starter buildings
│       │   ├── tier2/                  ← Suburban homes
│       │   ├── tier3/                  ← Commercial buildings
│       │   └── tier4/                  ← Skyscrapers
│       ├── roads/                      ← Road tiles
│       ├── ui/                         ← UI elements
│       └── data/
│           ├── buildings.json          ← Building definitions
│           └── times-tables.json       ← Quiz questions
│
├── scripts/
│   └── city-builder/                   ← Game scripts (NEW)
│       ├── game-engine.js              ← Core game loop
│       ├── city-manager.js             ← Building/grid logic
│       ├── quiz-system.js              ← Times tables quiz
│       ├── save-system.js              ← Supabase persistence
│       └── ui-manager.js               ← UI interactions
│
├── styles/
│   └── city-builder.css                ← Game styles (NEW)
│
└── index.html                          ← Add link to Math City Builder
```

---

## 🗄️ DATABASE SCHEMA

### New Table: `city_progress`

```sql
CREATE TABLE city_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- City State
  buildings JSONB DEFAULT '[]'::jsonb,           -- [{id, type, x, y, placed_at}]
  grid_size INTEGER DEFAULT 50,                   -- 50×50 grid
  
  -- Economy
  cash DECIMAL(12, 2) DEFAULT 500.00,            -- Starting cash: $500
  total_income DECIMAL(12, 2) DEFAULT 0.00,      -- Lifetime earnings
  city_value DECIMAL(12, 2) DEFAULT 0.00,        -- Sum of building costs
  
  -- Progress Tracking
  current_tier INTEGER DEFAULT 1,                 -- 1-4 (unlocked tiers)
  buildings_placed INTEGER DEFAULT 0,             -- Total buildings placed
  quizzes_completed INTEGER DEFAULT 0,            -- Total quizzes answered
  correct_answers INTEGER DEFAULT 0,              -- Total correct
  
  -- Times Tables Progress
  times_tables_mastered INTEGER[] DEFAULT '{}',   -- e.g., [2, 3, 5] = mastered
  current_table INTEGER DEFAULT 2,                -- Currently practicing
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(student_id)
);

-- Row Level Security
ALTER TABLE city_progress ENABLE ROW LEVEL SECURITY;

-- Students can only access their own city
CREATE POLICY "Students can view own city"
  ON city_progress FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update own city"
  ON city_progress FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own city"
  ON city_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Index for fast lookups
CREATE INDEX idx_city_progress_student ON city_progress(student_id);
CREATE INDEX idx_city_progress_last_played ON city_progress(last_played_at DESC);
```

### Update Existing Table: `game_progress`

```sql
-- Add Math City Builder to game modes
-- Existing structure supports this (game_mode column)
-- Just need to insert data with game_mode = 'math-city-builder'
```

---

## ⏱️ TIMELINE

### Week 1: Core Development (5 days)

**Day 1-2: Infrastructure (Phase 1)**
- Create database table
- Set up HTML page
- Establish Supabase connection
- Integrate authentication

**Day 3-4: Core Game (Phase 2)**
- Implement grid system
- Building placement mechanics
- Economic system
- Render 15 MVP buildings

**Day 5: Quiz System (Phase 3)**
- Times tables generator
- Modal UI
- Answer validation
- Rewards integration

### Week 2: Polish & Deploy (5 days)

**Day 6: Persistence (Phase 4)**
- Save/load system
- Auto-save implementation
- Offline fallback

**Day 7: Polish (Phase 5)**
- Animations
- Visual effects
- Sound effects
- Achievement system

**Day 8-9: Testing**
- Chromebook testing
- 3-student pilot
- Bug fixes

**Day 10: Launch**
- Full deployment
- Student onboarding
- Monitoring

---

## 🎨 VISUAL DESIGN

### Color Palette

```css
/* Main UI Colors */
--primary: #667eea;          /* Purple (brand color) */
--secondary: #764ba2;        /* Deep purple */
--success: #4ade80;          /* Green (correct answers) */
--warning: #fbbf24;          /* Gold (achievements) */
--danger: #ef4444;           /* Red (wrong answers) */

/* Background Colors */
--bg-dark: #0a0e27;          /* Dark navy (page background) */
--bg-panel: #0f1329;         /* Panel background */
--bg-section: #1a1f3a;       /* Section background */

/* City Colors */
--grass: #22c55e;            /* Green grass */
--road: #64748b;             /* Gray roads */
--water: #3b82f6;            /* Blue water */
```

### Layout (1366×768 Chromebook)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (60px)                                               │
│ Math City Builder | Cash: $1,500 | XP: 2,450 | [Logout]   │
├─────────────────────────────────────────────────────────────┤
│                         │                                   │
│                         │   CITY CANVAS (800×650px)        │
│   SIDEBAR (300px)       │                                   │
│   ┌──────────────────┐  │   [50×50 grid rendered here]     │
│   │ BUILD MENU       │  │                                   │
│   │ ├ Tier 1 ($500)  │  │                                   │
│   │ ├ Tier 2 ($5K)   │  │                                   │
│   │ ├ Tier 3 ($10K)  │  │                                   │
│   │ └ Tier 4 ($100K) │  │                                   │
│   └──────────────────┘  │                                   │
│   ┌──────────────────┐  │                                   │
│   │ STATS            │  │                                   │
│   │ Buildings: 23    │  │                                   │
│   │ City Value: $45K │  │                                   │
│   │ Income: $230/Q   │  │                                   │
│   └──────────────────┘  │                                   │
│   [ANSWER QUIZ BTN]     │                                   │
│                         │                                   │
└─────────────────────────┴───────────────────────────────────┘

QUIZ MODAL (centered overlay):
┌───────────────────────────────────────┐
│  What is 7 × 8?                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ 54  │ │ 56  │ │ 63  │ │ 49  │    │
│  └─────┘ └─────┘ └─────┘ └─────┘    │
│  Timer: ⏱️ 0:08                       │
└───────────────────────────────────────┘
```

---

## 🔒 SECURITY & PRIVACY

### FERPA Compliance

```
✅ No student names in Math City Builder
   → Display username only (e.g., "agent001")

✅ No sharing of city data between students
   → RLS policies enforce isolation

✅ Teacher can view aggregate stats only
   → Dashboard shows class averages, not individual cities

✅ No external API calls (except Supabase)
   → All data stays in our infrastructure

✅ Audit trail for data access
   → Supabase tracks all queries
```

### Data Protection

```
✅ Row Level Security (RLS) on all tables
✅ Encrypted connections (HTTPS only)
✅ No PII in game data (just UUIDs)
✅ Parent can request data deletion
✅ Automatic session timeout (30 min inactive)
```

---

## ⚠️ RISK ASSESSMENT

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase quota exceeded | Low | High | Monitor usage, implement caching |
| Performance on old Chromebooks | Medium | High | Optimize rendering, limit buildings to 100 |
| Asset loading too slow | Medium | Medium | Use base64 for small assets, lazy load buildings |
| Browser compatibility issues | Low | Medium | Test on Chrome, Edge, Safari |
| Data loss (save failure) | Low | High | localStorage fallback, retry logic |

### Educational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Students focus on game, not math | High | High | Require quiz to earn cash, no "free build" mode |
| Too easy (students master quickly) | Low | Low | 12 times tables = long progression |
| Too hard (students give up) | Medium | High | Start with 2× tables, gradual difficulty |
| Cheating (students share answers) | Medium | Low | Randomize question order, time limit |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Server downtime during class | Low | High | Offline localStorage fallback works |
| Bug disrupts pilot test | Medium | High | Extensive pre-pilot testing |
| Students confused by UI | Medium | Medium | Clear tutorial, in-game tooltips |
| Integration breaks Geography app | Low | High | Thorough testing, staged rollout |

---

## 📈 METRICS & KPIs

### Engagement Metrics

```javascript
// Track in Supabase analytics
{
  daily_active_users: "Students who play each day",
  avg_session_duration: "Average time per session",
  quizzes_per_session: "Average quizzes completed",
  return_rate: "% students who return next day",
  completion_rate: "% students who reach $1M city"
}
```

### Educational Metrics

```javascript
{
  accuracy_by_table: {
    "2x": 95,  // 95% accuracy on 2× tables
    "3x": 90,
    // ... up to 12×
  },
  improvement_rate: "% increase in accuracy over time",
  mastery_speed: "Days to master each times table",
  error_patterns: "Common wrong answers per table"
}
```

### Performance Metrics

```javascript
{
  page_load_time: "< 5 seconds (target)",
  render_fps: "60 FPS (target)",
  save_success_rate: "> 99.9%",
  error_rate: "< 0.1% of actions"
}
```

---

## 🚀 GO/NO-GO CRITERIA

### Before 3-Student Pilot

```
✅ All core features working (quiz, build, save)
✅ No critical bugs in testing
✅ Performance acceptable on test Chromebook
✅ Data saves successfully to Supabase
✅ 15 buildings rendering correctly
✅ Quiz generates accurate questions
✅ XP syncs to main Geography app
```

### Before Full Deployment

```
✅ 3-student pilot successful (zero blocking issues)
✅ Positive feedback from pilot students
✅ Teacher approves for full class
✅ All pilot bugs fixed
✅ Performance validated on slowest Chromebook
✅ Monitoring dashboard ready
```

---

## 📞 SUPPORT PLAN

### Student Support

```
IN-GAME HELP:
- "?" button in top-right (tooltip guide)
- Tutorial on first play (skippable)
- Error messages clear and actionable

TEACHER SUPPORT:
- Teacher can view student progress
- Reset button if city becomes "stuck"
- Export city as image (share achievements)
```

### Technical Support

```
MONITORING:
- Supabase dashboard (track errors)
- Browser console (log key events)
- Error reporting to teacher dashboard

TROUBLESHOOTING:
- Clear cache button (if city won't load)
- Reset city button (nuclear option)
- Contact form for bugs
```

---

## 🎓 LEARNING OBJECTIVES

### Math Skills

```
PRIMARY:
✅ Master times tables (2× through 12×)
✅ Mental math speed and accuracy
✅ Pattern recognition in multiplication

SECONDARY:
✅ Financial literacy (saving, spending)
✅ Strategic planning (building placement)
✅ Goal setting (reach $1M city value)
```

### Digital Skills

```
✅ Persistent online applications
✅ Data management (save/load)
✅ Goal-oriented gameplay
✅ Achievement motivation
```

---

## 📚 NEXT STEPS

### Immediate Actions (Today)

1. ✅ Read this master plan
2. ⏭️ Review Phase 1 document (Infrastructure)
3. ⏭️ Create Supabase database table
4. ⏭️ Set up file structure
5. ⏭️ Create blank math-city-builder.html

### This Week

6. ⏭️ Complete Phase 1 (Infrastructure)
7. ⏭️ Complete Phase 2 (Core Game)
8. ⏭️ Complete Phase 3 (Quiz System)
9. ⏭️ Begin Phase 4 (Persistence)

### Next Week

10. ⏭️ Complete Phase 4 (Persistence)
11. ⏭️ Complete Phase 5 (Polish)
12. ⏭️ Testing & Pilot
13. ⏭️ Full Deployment

---

## ✅ DOCUMENT STATUS

- **Master Plan:** 🟢 COMPLETE
- **Phase 1:** ⏭️ NEXT (create infrastructure doc)
- **Phase 2:** ⏭️ PENDING
- **Phase 3:** ⏭️ PENDING
- **Phase 4:** ⏭️ PENDING
- **Phase 5:** ⏭️ PENDING
- **Testing:** ⏭️ PENDING

---

**Ready to begin? → [Open Phase 1 Document](MATH_CITY_BUILDER_PHASE1_INFRASTRUCTURE.md)**

**Document Version:** 1.0  
**Last Updated:** October 25, 2025  
**Status:** 🟢 COMPLETE  
**Next Action:** Create Phase 1 Infrastructure Document
