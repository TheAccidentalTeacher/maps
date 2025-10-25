# 🗺️ MASTER DOCUMENTATION INDEX
**Geographic Detective Academy - Complete Code Documentation**
*Last Updated: October 24, 2025*

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Quick Start Guides](#quick-start-guides)
3. [Core Application](#core-application)
4. [Ocean Explorer Game](#ocean-explorer-game)
5. [Database & Backend](#database--backend)
6. [API & Functions](#api--functions)
7. [Authentication & Security](#authentication--security)
8. [Deployment & DevOps](#deployment--devops)
9. [Code Architecture](#code-architecture)
10. [Testing & Debugging](#testing--debugging)

---

## 🎯 PROJECT OVERVIEW

**What is this?** An interactive geography learning platform for middle school students with gamification, real-time collaboration, and immersive experiences.

**Core Features:**
- 🗺️ Interactive world map exploration
- 🎮 Multiple game modes (Mystery, Scavenger Hunt, Guess Game)
- 🌊 Ocean Explorer - Deep-sea discovery game
- 🏆 Achievement system with XP and badges
- 👥 Multi-user support (students & teachers)
- ☁️ Cloud-synchronized progress
- 📸 AI-powered photo integration
- 🔒 FERPA-compliant student data protection

**Tech Stack:**
- **Frontend:** Vanilla JavaScript, HTML5, CSS3, Leaflet.js (maps)
- **Backend:** Netlify Functions (serverless)
- **Database:** Supabase (PostgreSQL + Auth)
- **APIs:** Claude AI, OpenAI, Unsplash, Pexels
- **Hosting:** Netlify

---

## 🚀 QUICK START GUIDES

### For New Developers
1. **[00_START_HERE_FIRST.md](./00_START_HERE_FIRST.md)** - Project onboarding
2. **[README.md](./README.md)** - Project overview
3. **[CODE_ARCHITECTURE.md](./CODE_ARCHITECTURE.md)** - System design

### For Teachers/Admins
1. **[USER_INSTRUCTIONS.md](./USER_INSTRUCTIONS.md)** - How to use the platform
2. **[TEACHER_DASHBOARD_GUIDE.md](./TEACHER_DASHBOARD_GUIDE.md)** - Dashboard features
3. **[GI_JOE_TEST_STUDENTS_GUIDE.md](./GI_JOE_TEST_STUDENTS_GUIDE.md)** - Test accounts

### For Testers
1. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing
2. **[OCEAN_TESTING_GUIDE.md](./OCEAN_TESTING_GUIDE.md)** - Ocean Explorer testing
3. **[ACHIEVEMENT_TESTING.md](./ACHIEVEMENT_TESTING.md)** - Achievement system testing

---

## 🗺️ CORE APPLICATION

### Main Files
- **[index.html](./index.html)** - Main application (10,707 lines)
  - Contains ALL game modes, map logic, achievements
  - **Line ranges:**
    - Lines 1-2500: Supabase setup & authentication
    - Lines 2500-4000: Location Explorer & geocoding
    - Lines 4000-6000: Card system (Quick Facts, Photos, AI Facts)
    - Lines 6000-8000: Achievement system & cloud sync
    - Lines 8000-9000: Map interactions & events
    - Lines 9000-10000: Game modes (Mystery, Scavenger, Guess)
    - Lines 10000-10707: Modals, UI helpers, initialization

- **[ocean-data.js](./ocean-data.js)** - Ocean facts and data
- **[real-life-facts.js](./real-life-facts.js)** - Geography applications
- **[photo-modal-functions.js](./photo-modal-functions.js)** - Photo enlargement & AI captions

### Game Modes Documentation
| Mode | Description | Documentation |
|------|-------------|---------------|
| 🔍 **Mystery Challenge** | Guess locations from clues | [MYSTERY_CHALLENGE_OVERHAUL.md](./MYSTERY_CHALLENGE_OVERHAUL.md) |
| 🎯 **Scavenger Hunt** | Find specific landmarks | [GAME_MODES_AUDIT.md](./GAME_MODES_AUDIT.md) |
| 🎲 **Guess Game** | Rapid-fire location guessing | [GAME_BUILDING_SPRINT.md](./GAME_BUILDING_SPRINT.md) |
| 🌊 **Ocean Explorer** | Deep-sea discovery game | [OCEAN_EXPLORER_RESEARCH.md](./OCEAN_EXPLORER_RESEARCH.md) |

### Navigation & Access Points

**Game Mode Buttons (Lines 3043-3052):**
```html
<div id="game-modes">
    <button class="mode-btn active" onclick="switchMode('explore')">🗺️ EXPLORE</button>
    <button class="mode-btn" onclick="switchMode('mystery')">🎯 MYSTERY</button>
    <button class="mode-btn" onclick="switchMode('scavenger')">🌍 SCAVENGER</button>
    <button class="mode-btn" onclick="switchMode('guess')">📸 GUESS</button>
    <button class="mode-btn" onclick="switchMode('missions')">🏆 MISSIONS</button>
    <button class="mode-btn" onclick="switchMode('create')">🗺️ CREATE</button>
    <button class="mode-btn" onclick="switchMode('alaska')">🏔️ ALASKA</button>
    <button class="mode-btn" onclick="window.location.href='/ocean-explorer-v3.html'">🌊 OCEAN</button>
</div>
```

**Ocean Explorer Access Points:**
1. **Game mode button** (Lines 3043-3052) - Always visible in top navigation
2. **Sidebar footer button** (Lines 10633-10643) - Shows only for ocean locations
3. **AI Facts section** (Lines 5357-5370) - Shows only for ocean locations

### Key Features
- **Location Explorer Sidebar:** Lines 3800-4200 in index.html
  - 5-card system: Location, Quick Facts, Comparison, AI Facts, Photos
  - Dynamic content population
  - Expandable/collapsible sections
  
- **Achievement System:** Lines 6600-7000 in index.html
  - XP progression (0-1000 XP)
  - 15+ unique badges
  - Cloud synchronization
  - Real-time notifications

- **Cloud Sync:** Lines 7900-8000 in index.html
  - Auto-save every 30 seconds
  - Supabase `game_progress` table
  - Conflict resolution

---

## 🌊 OCEAN EXPLORER GAME

### Main File
**[ocean-explorer-v3.html](./ocean-explorer-v3.html)** - Complete ocean exploration game (2,700+ lines)

### Architecture Overview
```
┌─────────────────────────────────────────────────┐
│          OCEAN EXPLORER STRUCTURE               │
├─────────────────────────────────────────────────┤
│ Lines 1-300:    CSS Styles & Animations        │
│ Lines 300-950:  HTML Structure (Canvas, UI)    │
│ Lines 950-1200: Supabase Setup                 │
│ Lines 1200-1400: Game State & Sprite Loading   │
│ Lines 1400-1700: Canvas Setup & Animation      │
│ Lines 1700-2000: Discovery System & Dive Logic │
│ Lines 2000-2200: Database Save/Load            │
│ Lines 2200-2500: Species Grid & UI Updates     │
│ Lines 2500-2700: Achievements & Save System    │
└─────────────────────────────────────────────────┘
```

### Key Systems

#### 1. Discovery System (Lines 1846-1900)
```javascript
// LINEAR DISCOVERY: Every 1500ft = 1 new species
const speciesIndex = Math.floor(gameState.depth / 1500);
// 30ft per click × 50 clicks = 1500ft = 1 species
```
- **No RNG spam** - predictable progression
- **30 species total** - discovered in depth order
- **3 zones:** Sunlight (0-660ft), Twilight (660-3300ft), Midnight (3300-13000ft)

#### 2. Photo Integration (Lines 2020-2090)
```javascript
// Netlify Function: get-species-photos
// Returns: {url, thumbnail, photographer, source}
// Saves to: gameState.speciesPhotos[speciesId]
// Persists: Supabase ocean_species_discoveries table
```

#### 3. AI Facts (Lines 2055-2110)
```javascript
// Netlify Function: get-species-ai-facts
// AI: Claude 3.5 Sonnet (primary), GPT-4o-mini (fallback)
// Returns: 5 fact types (fun_fact, habitat, diet, conservation, behavior)
```

#### 4. Database Persistence (Lines 2112-2190)
```javascript
// Table: ocean_species_discoveries
// Stores: user_id, species_id, photos, AI facts, discovery metadata
// RLS: Students see own, teachers see their students
```

#### 5. Celebration System (Lines 1869-1900)
```javascript
// 67 Click Celebration
if (gameState.clickCount % 67 === 0) {
    show67Celebration(); // Full-screen epic animation
}
```

### Assets
- **Kenney Fish Pack:** `/assets/sprites/fish/PNG/Default/`
  - 9 fish sprites (blue, green, orange, pink, red, grey, 3 skeletons)
  - 3 bubble sprites (a, b, c)
  - 4 seaweed sprites (green_a, green_b, orange_a, pink_a)
  - 2 rock sprites (a, b)
- **Kenney UI Pack:** `/assets/buttons/PNG/Blue/Default/`
  - button_round_depth_gradient.png (epic dive button)
  - arrow_decorative_s.png (dive arrow)

### Documentation Files
| File | Purpose |
|------|---------|
| [OCEAN_EXPLORER_RESEARCH.md](./OCEAN_EXPLORER_RESEARCH.md) | Gen Alpha psychology & game design |
| [OCEAN_ENHANCEMENT_PLAN.md](./OCEAN_ENHANCEMENT_PLAN.md) | Feature roadmap |
| [OCEAN_PHOTOS_INTEGRATION.md](./OCEAN_PHOTOS_INTEGRATION.md) | Photo system details |
| [OCEAN_ASSETS_PLAN.md](./OCEAN_ASSETS_PLAN.md) | Asset integration |
| [LINEAR_DISCOVERY_COMPLETE.md](./LINEAR_DISCOVERY_COMPLETE.md) | Discovery system docs |
| [EPIC_DIVE_BUTTON_COMPLETE.md](./EPIC_DIVE_BUTTON_COMPLETE.md) | Button implementation |
| [OCEAN_EXPLORER_UX_FIXES.md](./OCEAN_EXPLORER_UX_FIXES.md) | UX improvements |

---

## 🗄️ DATABASE & BACKEND

### Supabase Tables

#### 1. `accounts` - User profiles
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    account_type TEXT CHECK (account_type IN ('student', 'teacher', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `game_progress` - XP & achievements
```sql
CREATE TABLE game_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_account_id UUID REFERENCES accounts(id),
    xp INTEGER DEFAULT 0,
    unlocked_achievements TEXT[],
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `ocean_species_discoveries` - Ocean Explorer data
```sql
CREATE TABLE ocean_species_discoveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_account_id UUID, -- NO FOREIGN KEY (works without accounts table)
    species_id INTEGER,
    species_name TEXT,
    photo_url TEXT,
    photo_thumbnail TEXT,
    photo_photographer TEXT,
    photo_photographer_url TEXT,
    photo_source TEXT,
    ai_fun_fact TEXT,
    ai_habitat TEXT,
    ai_diet TEXT,
    ai_conservation_status TEXT,
    ai_interesting_behavior TEXT,
    discovered_at_depth INTEGER,
    discovered_at_zone TEXT,
    discovery_timestamp TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_account_id, species_id)
);
```

### Database Setup Files
- **[supabase-setup-complete.sql](./supabase-setup-complete.sql)** - Initial setup
- **[complete-hybrid-database-setup.sql](./complete-hybrid-database-setup.sql)** - Full schema
- **[create-ocean-species-table.sql](./create-ocean-species-table.sql)** - Ocean Explorer table
- **[remove-ocean-explorer-fk-constraint.sql](./remove-ocean-explorer-fk-constraint.sql)** - Remove foreign key (allows student accounts without full profiles)

### RLS Policies
```sql
-- Students see only their own data
CREATE POLICY "Students can view own progress"
ON game_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_account_id);

-- Teachers see their students' data
CREATE POLICY "Teachers can view student progress"
ON game_progress FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM accounts WHERE id = auth.uid() AND account_type = 'teacher'
    )
);
```

### Documentation Files
- **[DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)** - Setup instructions
- **[SUPABASE_QUICK_REFERENCE.md](./SUPABASE_QUICK_REFERENCE.md)** - Quick reference
- **[SUPABASE_CONNECTION_TEST.md](./SUPABASE_CONNECTION_TEST.md)** - Testing guide

---

## 🔌 API & FUNCTIONS

### Netlify Functions Location
`/netlify/functions/`

### Main Functions

#### 1. `get-species-photos.js`
**Purpose:** Fetch kid-safe photos for Ocean Explorer species
```javascript
// 3-tier fallback system
// 1. Unsplash (content_filter=high, educational context)
// 2. Pexels (curated safe content)
// 3. Simplified name search (removes "fish" suffix)

// Returns:
{
    url: "https://...",
    thumbnail: "https://...",
    photographer: "John Doe",
    photographer_url: "https://...",
    source: "unsplash"
}
```

#### 2. `get-species-ai-facts.js`
**Purpose:** Generate educational facts about species
```javascript
// AI: Claude 3.5 Sonnet (primary) → GPT-4o-mini (fallback)
// Age-appropriate: 8-14 years old
// Character limit: <150 chars per fact

// Returns:
{
    fun_fact: "Green sea turtles can hold...",
    habitat: "They live in warm, shallow...",
    diet: "These turtles munch on...",
    conservation_status: "Octopuses are uncommon now...",
    interesting_behavior: "Octopuses can change color..."
}
```

#### 3. `match-photos-to-facts.js`
**Purpose:** Match Unsplash photos to AI-generated facts (main map)
- Uses Claude AI to analyze facts and generate photo queries
- Fetches photos with `content_filter=high`
- Returns array of {fact, photo} pairs

#### 4. `get-photos.js`
**Purpose:** Fetch location photos for main map
- Unsplash API with educational context
- Kid-safe filtering
- Fallback to simplified queries

#### 5. `get-weather.js`
**Purpose:** Current weather data for locations
- OpenWeather API
- Returns temperature, conditions, icon

#### 6. `generate-real-life-geography.js`
**Purpose:** Generate "Geography in Real Life" applications
- Uses Claude AI to create practical connections
- 3-5 applications per location

#### 7. `get-ai-facts.js`
**Purpose:** Generate AI facts for main map locations
- Claude AI primary, OpenAI fallback
- 5 educational facts per location

### API Keys (in `.env`)
```bash
# Photos
UNSPLASH_ACCESS_KEY=xxx
PEXELS_API_KEY=xxx

# AI
ANTHROPIC_API_KEY=xxx  # Claude
OPENAI_API_KEY=xxx     # OpenAI GPT-4o-mini

# Weather
OPENWEATHER_API_KEY=xxx
```

### Documentation Files
- **[NETLIFY_FUNCTIONS_REFERENCE.md](./NETLIFY_FUNCTIONS_REFERENCE.md)** - Complete API reference
- **[NETLIFY_FUNCTIONS_SETUP.md](./NETLIFY_FUNCTIONS_SETUP.md)** - Setup guide
- **[AI_INTEGRATION_PLAN.md](./AI_INTEGRATION_PLAN.md)** - AI integration docs
- **[PHOTO_FACT_MATCHING.md](./PHOTO_FACT_MATCHING.md)** - Photo matching system

---

## 🔐 AUTHENTICATION & SECURITY

### Authentication Flow
```
1. User visits login.html
2. Supabase Auth (email/password or OAuth)
3. Session stored in localStorage
4. Session checked on page load
5. RLS policies enforce data access
```

### Security Features
- **FERPA Compliance:** Student data protection
- **Row-Level Security (RLS):** Database-level access control
- **Content Filtering:** Kid-safe photo guardrails
- **XSS Prevention:** HTML escaping on all user inputs
- **CSRF Protection:** Supabase JWT tokens

### Authentication Code (index.html)
```javascript
// Lines 2545-2640: Authentication check
async function checkAuthentication() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
        return false;
    }
    // Load user profile, sync progress, etc.
}
```

### Ocean Explorer Auth (ocean-explorer-v3.html)
```javascript
// Lines 950-980: Supabase setup
const SUPABASE_URL = 'https://fuppbkhfqutzcromomkc.supabase.co';
const SUPABASE_ANON_KEY = '...';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Documentation Files
- **[AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)** - Setup guide
- **[AUTHENTICATION_SUCCESS.md](./AUTHENTICATION_SUCCESS.md)** - Implementation details
- **[FERPA_COMPLIANCE_GUIDE.md](./FERPA_COMPLIANCE_GUIDE.md)** - Compliance checklist
- **[FERPA_QUICK_START.md](./FERPA_QUICK_START.md)** - Quick reference
- **[STUDENT_AUTH_PLAN.md](./STUDENT_AUTH_PLAN.md)** - Student authentication
- **[SECURITY_AND_ENV_DOCUMENTATION.md](./SECURITY_AND_ENV_DOCUMENTATION.md)** - Security overview

---

## 🚀 DEPLOYMENT & DEVOPS

### Local Development
```bash
# Install dependencies
npm install

# Start local dev server (with Netlify Functions)
netlify dev

# Or offline mode (no auth required)
netlify dev --offline

# Runs on: http://localhost:8888
```

### Deployment
```bash
# Deploy to Netlify
netlify deploy --prod

# Or use continuous deployment (linked to GitHub)
git push origin main  # Auto-deploys
```

### Environment Variables
**Required in Netlify Dashboard:**
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Photos
UNSPLASH_ACCESS_KEY=xxx
PEXELS_API_KEY=xxx

# AI
ANTHROPIC_API_KEY=xxx
OPENAI_API_KEY=xxx

# Weather
OPENWEATHER_API_KEY=xxx
```

### Configuration Files
- **[netlify.toml](./netlify.toml)** - Netlify configuration
- **[package.json](./package.json)** - Node dependencies
- **[.env.example](./.env.example)** - Environment variable template

### Documentation Files
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[NETLIFY_DEPLOYMENT_CHECKLIST.md](./NETLIFY_DEPLOYMENT_CHECKLIST.md)** - Checklist
- **[SAFE_DEPLOYMENT_STRATEGY.md](./SAFE_DEPLOYMENT_STRATEGY.md)** - Safety guidelines
- **[PRODUCTION_SAFETY_QUICK_REFERENCE.md](./PRODUCTION_SAFETY_QUICK_REFERENCE.md)** - Quick reference

---

## 🏗️ CODE ARCHITECTURE

### Main Application Structure (index.html)
```
┌────────────────────────────────────────────┐
│         APPLICATION ARCHITECTURE           │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   SUPABASE SETUP (Lines 1-2500)      │ │
│  │   - Authentication                    │ │
│  │   - Database client initialization    │ │
│  │   - Session management                │ │
│  └──────────────────────────────────────┘ │
│                    ↓                       │
│  ┌──────────────────────────────────────┐ │
│  │   LOCATION EXPLORER (2500-6000)      │ │
│  │   - Geocoding & reverse geocoding    │ │
│  │   - 5-card system                    │ │
│  │   - Ocean detection (100km hitbox)   │ │
│  │   - XP deduplication                 │ │
│  └──────────────────────────────────────┘ │
│                    ↓                       │
│  ┌──────────────────────────────────────┐ │
│  │   ACHIEVEMENT SYSTEM (6000-8000)     │ │
│  │   - XP progression                   │ │
│  │   - Badge unlocks                    │ │
│  │   - Cloud sync                       │ │
│  └──────────────────────────────────────┘ │
│                    ↓                       │
│  ┌──────────────────────────────────────┐ │
│  │   GAME MODES (9000-10000)            │ │
│  │   - Mystery Challenge                │ │
│  │   - Scavenger Hunt                   │ │
│  │   - Guess Game                       │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

### Ocean Explorer Structure (ocean-explorer-v3.html)
```
┌────────────────────────────────────────────┐
│       OCEAN EXPLORER ARCHITECTURE          │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   GAME STATE (Lines 866-950)         │ │
│  │   - depth, maxDepth, points          │ │
│  │   - discoveredSpecies (Set)          │ │
│  │   - speciesPhotos (cached)           │ │
│  │   - speciesAIFacts (cached)          │ │
│  │   - clickCount (for 67 celebration)  │ │
│  └──────────────────────────────────────┘ │
│                    ↓                       │
│  ┌──────────────────────────────────────┐ │
│  │   CANVAS SYSTEM (1400-1700)          │ │
│  │   - Submarine sprite (rotated 45°)   │ │
│  │   - Background fish (8 parallel)     │ │
│  │   - Bubbles (30 total)               │ │
│  │   - Ocean floor (seaweed + rocks)    │ │
│  │   - Parallax scrolling               │ │
│  └──────────────────────────────────────┘ │
│                    ↓                       │
│  ┌──────────────────────────────────────┐ │
│  │   DISCOVERY ENGINE (1700-2000)       │ │
│  │   - Linear: depth / 1500 = species   │ │
│  │   - Fetch photos (Unsplash/Pexels)   │ │
│  │   - Generate AI facts (Claude/GPT)   │ │
│  │   - Save to Supabase                 │ │
│  └──────────────────────────────────────┘ │
│                    ↓                       │
│  ┌──────────────────────────────────────┐ │
│  │   PERSISTENCE (2000-2200)            │ │
│  │   - Load from database on startup    │ │
│  │   - Save discoveries to Supabase     │ │
│  │   - localStorage cache               │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

### Key Design Patterns

#### 1. Card System (Location Explorer)
```javascript
// Each card is a module with:
// - populateX(data) - Fill card with data
// - clearX() - Clear card contents
// - cardElement.classList.add('loading') - Show loading state

populateQuickFacts(geocodeData, countryData);
populateComparison(distance, bearing, geocodeData);
populateAIFacts(facts);
populatePhotos(photos);
```

#### 2. Achievement System
```javascript
// Achievement structure:
{
    id: 'first_discovery',
    name: 'First Discovery',
    description: 'Explore your first location',
    icon: '🗺️',
    condition: (stats) => stats.explore.locationsExplored >= 1,
    xpReward: 10
}

// Check achievements after every action:
checkAchievements(); // Loops through all, unlocks if condition met
```

#### 3. Cloud Sync
```javascript
// Auto-save pattern:
setInterval(() => {
    saveProgressToCloud(currentUser.id, gameState.xp, unlockedAchievements);
}, 30000); // Every 30 seconds
```

### Documentation Files
- **[CODE_ARCHITECTURE.md](./CODE_ARCHITECTURE.md)** - System design
- **[CODE_REVIEW_SUMMARY.md](./CODE_REVIEW_SUMMARY.md)** - Code review notes
- **[IMPLEMENTATION_AUDIT_2025.md](./IMPLEMENTATION_AUDIT_2025.md)** - Current state audit

---

## 🧪 TESTING & DEBUGGING

### Test Accounts
**Test Student Account:**
- Email: test@mrsomers.student
- Password: (see GI_JOE_TEST_STUDENTS_GUIDE.md)
- ID: d17c2e16-7fd9-498f-b841-99d1b780d67e

### Testing Checklist

#### Main Map
- [ ] Login with test account
- [ ] Click on land location → Info card appears
- [ ] Click on ocean → Ocean Explorer button appears
- [ ] Click same location twice → No duplicate XP
- [ ] Click 100km away → New XP awarded

#### Ocean Explorer
- [ ] Click "DIVE INTO OCEAN EXPLORER" button
- [ ] Click 50 times (30ft × 50 = 1500ft) → Species discovered
- [ ] Check species card → Photo appears (not emoji)
- [ ] Refresh page → Photos persist
- [ ] Click 67 times → Epic "67!" celebration appears
- [ ] Check Supabase → Record in `ocean_species_discoveries`

#### Achievements
- [ ] Earn XP → Progress bar updates
- [ ] Unlock achievement → Notification appears
- [ ] Refresh page → Achievements persist
- [ ] Check Supabase → Record in `game_progress`

### Debugging Tools

#### Browser Console Logs
```javascript
// Main map ocean detection
console.log('🌊 Ocean detected:', {basin, region, lat, lng});
console.log('✅ Location added to collection!');
console.log('ℹ️ Location already explored (within 100km)');

// Ocean Explorer
console.log('🎣 DISCOVERING:', species.name);
console.log('📸 Photo result:', photo ? 'GOT PHOTO' : 'NO PHOTO');
console.log('💾 Saving to database...');
console.log('✅ Saved to database successfully!');
console.log('🎨 Rendering grid. Photo in gameState?', true/false);
```

#### SQL Debugging Queries
```sql
-- Check ocean discoveries
SELECT * FROM ocean_species_discoveries 
WHERE user_account_id = 'd17c2e16-7fd9-498f-b841-99d1b780d67e';

-- Check game progress
SELECT * FROM game_progress 
WHERE user_account_id = 'd17c2e16-7fd9-498f-b841-99d1b780d67e';

-- Check account
SELECT * FROM accounts 
WHERE email = 'test@mrsomers.student';
```

### Common Issues & Solutions

#### Issue: Photos not appearing in Ocean Explorer
**Cause:** Netlify Functions not running (using simple server)
**Solution:** Use `netlify dev` or `netlify dev --offline`

#### Issue: XP awarded multiple times for same ocean
**Cause:** Browser cache (old index.html without 100km hitbox)
**Solution:** Hard refresh (Ctrl + Shift + R)

#### Issue: Database save fails with foreign key error
**Cause:** Student account not in `accounts` table
**Solution:** Run `remove-ocean-explorer-fk-constraint.sql`

#### Issue: 404 errors for Netlify Functions
**Cause:** Simple Node server doesn't support functions
**Solution:** Switch to `netlify dev`

### Documentation Files
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Complete testing guide
- **[OCEAN_TESTING_GUIDE.md](./OCEAN_TESTING_GUIDE.md)** - Ocean Explorer testing
- **[DEBUGGING_DATA_ISSUE.md](./DEBUGGING_DATA_ISSUE.md)** - Debugging tips
- **[BUGS_DETAILED.md](./BUGS_DETAILED.md)** - Known bugs & fixes

---

## 📚 ADDITIONAL DOCUMENTATION

### Feature Implementation
- **[ACHIEVEMENT_UNLOCKS_COMPLETE.md](./ACHIEVEMENT_UNLOCKS_COMPLETE.md)** - Achievement system
- **[CLOUD_SYNC_IMPLEMENTATION.md](./CLOUD_SYNC_IMPLEMENTATION.md)** - Cloud sync
- **[PHOTO_MODAL_COMPLETE.md](./PHOTO_MODAL_COMPLETE.md)** - Photo enlargement
- **[TEACHER_DASHBOARD_COMPLETE.md](./TEACHER_DASHBOARD_COMPLETE.md)** - Teacher dashboard
- **[LINEAR_DISCOVERY_COMPLETE.md](./LINEAR_DISCOVERY_COMPLETE.md)** - Linear discovery system
- **[EPIC_DIVE_BUTTON_COMPLETE.md](./EPIC_DIVE_BUTTON_COMPLETE.md)** - Dive button

### Planning & Roadmap
- **[IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md)** - Future improvements
- **[GAME_IMPROVEMENT_ROADMAP.md](./GAME_IMPROVEMENT_ROADMAP.md)** - Game roadmap
- **[IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md)** - Implementation plan
- **[SAAS_TRANSFORMATION_ROADMAP.md](./SAAS_TRANSFORMATION_ROADMAP.md)** - SaaS features

### Session Summaries
- **[SESSION_1_SUMMARY.md](./SESSION_1_SUMMARY.md)** - First dev session
- **[SESSION_2_SUMMARY.md](./SESSION_2_SUMMARY.md)** - Second dev session
- **[SESSION_COMPLETE_SUMMARY.md](./SESSION_COMPLETE_SUMMARY.md)** - All sessions
- **[DAY_1_2_VICTORY_LAP.md](./DAY_1_2_VICTORY_LAP.md)** - Major milestones

---

## 🆘 GETTING HELP

### Quick Reference Guides
1. **[QUICK_FIXES.md](./QUICK_FIXES.md)** - Common fixes
2. **[DASHBOARD_QUICK_REFERENCE.md](./DASHBOARD_QUICK_REFERENCE.md)** - Dashboard guide
3. **[SUPABASE_QUICK_REFERENCE.md](./SUPABASE_QUICK_REFERENCE.md)** - Database guide
4. **[PRODUCTION_SAFETY_QUICK_REFERENCE.md](./PRODUCTION_SAFETY_QUICK_REFERENCE.md)** - Safety checklist

### Contact
- **Project Lead:** Mr. Somers
- **School:** [School Name]
- **GitHub:** https://github.com/TheAccidentalTeacher/maps

---

## 📝 CHANGELOG

### October 24, 2025
- ✅ Added Ocean Explorer button to game modes navigation (always visible)
- ✅ Added Ocean Explorer 67 click celebration
- ✅ Implemented ocean spam prevention (100km hitbox)
- ✅ Added conditional Ocean Explorer buttons (sidebar & AI Facts)
- ✅ Fixed database foreign key constraint
- ✅ Improved species card photo visibility
- ✅ Created master documentation index

### October 23, 2025
- ✅ Integrated Supabase database for Ocean Explorer
- ✅ Added photo persistence across page refreshes
- ✅ Fixed race condition with photo loading
- ✅ Enhanced species cards with taller layout

### Previous
- See [01_CODE_REVIEW_ARCHIVE.md](./01_CODE_REVIEW_ARCHIVE.md) for full history

---

**END OF MASTER DOCUMENTATION**

*For specific feature documentation, see the individual files listed in each section.*
