# 🏗️ PHASE 1: INFRASTRUCTURE SETUP

**Phase:** 1 of 5  
**Duration:** 2 days (Day 1-2)  
**Status:** 📋 READY TO START  
**Dependencies:** None  
**Blocks:** Phase 2 (Core Game)

---

## 🎯 PHASE 1 GOALS

By the end of Phase 1, we will have:

```
✅ Database table created (`city_progress`)
✅ File structure established
✅ Blank HTML page with authentication
✅ Supabase connection working
✅ Student can access page from main app
✅ Save/load functions ready (empty data)
```

---

## 📋 TASK BREAKDOWN

### Task 1.1: Create Database Schema (30 minutes)

**SQL to run in Supabase:**

```sql
-- ============================================
-- MATH CITY BUILDER: city_progress TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS city_progress (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- City State (JSONB for flexibility)
  buildings JSONB DEFAULT '[]'::jsonb,
  -- Example structure:
  -- [
  --   {
  --     "id": "bldg_001",
  --     "type": "small-house-a",
  --     "tier": 1,
  --     "x": 10,
  --     "y": 15,
  --     "cost": 500,
  --     "income": 10,
  --     "placed_at": "2025-10-25T10:30:00Z"
  --   }
  -- ]
  
  grid_size INTEGER DEFAULT 50 NOT NULL,
  
  -- Economy
  cash DECIMAL(12, 2) DEFAULT 500.00 NOT NULL,
  total_income DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  city_value DECIMAL(12, 2) DEFAULT 0.00 NOT NULL,
  
  -- Progress Tracking
  current_tier INTEGER DEFAULT 1 NOT NULL CHECK (current_tier BETWEEN 1 AND 4),
  buildings_placed INTEGER DEFAULT 0 NOT NULL,
  quizzes_completed INTEGER DEFAULT 0 NOT NULL,
  correct_answers INTEGER DEFAULT 0 NOT NULL,
  incorrect_answers INTEGER DEFAULT 0 NOT NULL,
  
  -- Times Tables Progress
  times_tables_mastered INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  -- Example: {2, 3, 5} means student mastered 2×, 3×, and 5× tables
  
  current_table INTEGER DEFAULT 2 NOT NULL CHECK (current_table BETWEEN 2 AND 12),
  table_accuracy JSONB DEFAULT '{}'::jsonb,
  -- Example structure:
  -- {
  --   "2": {"correct": 50, "total": 50, "accuracy": 100},
  --   "3": {"correct": 45, "total": 50, "accuracy": 90}
  -- }
  
  -- Achievements
  achievements_unlocked TEXT[] DEFAULT ARRAY[]::TEXT[],
  -- Example: {"first_building", "10k_city", "100k_city", "tier2_unlocked"}
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_played_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one city per student
  UNIQUE(student_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE city_progress ENABLE ROW LEVEL SECURITY;

-- Students can only view their own city
CREATE POLICY "Students can view own city"
  ON city_progress
  FOR SELECT
  USING (auth.uid() = student_id);

-- Students can insert their own city (first time playing)
CREATE POLICY "Students can create own city"
  ON city_progress
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own city
CREATE POLICY "Students can update own city"
  ON city_progress
  FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Teachers can view all cities in their account
CREATE POLICY "Teachers can view student cities"
  ON city_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.account_type = 'teacher'
    )
  );

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_city_progress_student 
  ON city_progress(student_id);

CREATE INDEX idx_city_progress_last_played 
  ON city_progress(last_played_at DESC);

CREATE INDEX idx_city_progress_city_value 
  ON city_progress(city_value DESC);

-- ============================================
-- TRIGGER: Update timestamp on save
-- ============================================

CREATE OR REPLACE FUNCTION update_city_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_played_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER city_progress_update_timestamp
  BEFORE UPDATE ON city_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_city_progress_timestamp();

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Run this to verify table was created successfully:
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'city_progress') as column_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'city_progress';

-- Expected output: table_name = 'city_progress', column_count = 19
```

**VERIFICATION STEPS:**

1. Go to Supabase dashboard: https://supabase.com/dashboard/project/fuppbkhfqutzcromomkc
2. Click "SQL Editor" (left sidebar)
3. Click "New query"
4. Paste the SQL above
5. Click "Run"
6. Should see: ✅ Success. No rows returned.
7. Click "Table Editor" (left sidebar)
8. Find `city_progress` table in list
9. Click it to verify columns exist

---

### Task 1.2: Create File Structure (15 minutes)

**PowerShell commands:**

```powershell
# Navigate to project root
cd C:\Users\scoso\WEBSITES\Mrsomersmaps

# Create asset directories
New-Item -ItemType Directory -Path "assets\city-builder\sprites\tier1" -Force
New-Item -ItemType Directory -Path "assets\city-builder\sprites\tier2" -Force
New-Item -ItemType Directory -Path "assets\city-builder\sprites\tier3" -Force
New-Item -ItemType Directory -Path "assets\city-builder\sprites\tier4" -Force
New-Item -ItemType Directory -Path "assets\city-builder\roads" -Force
New-Item -ItemType Directory -Path "assets\city-builder\ui" -Force
New-Item -ItemType Directory -Path "assets\city-builder\data" -Force

# Create script directories
New-Item -ItemType Directory -Path "scripts\city-builder" -Force

# Create style directory (if doesn't exist)
New-Item -ItemType Directory -Path "styles" -Force

# Verify structure
Get-ChildItem -Path "assets\city-builder" -Recurse -Directory | Select-Object FullName
```

**Expected output:**
```
assets\city-builder\sprites
assets\city-builder\sprites\tier1
assets\city-builder\sprites\tier2
assets\city-builder\sprites\tier3
assets\city-builder\sprites\tier4
assets\city-builder\roads
assets\city-builder\ui
assets\city-builder\data
```

---

### Task 1.3: Create Building Data File (20 minutes)

**File:** `assets/city-builder/data/buildings.json`

```json
{
  "tier1": [
    {
      "id": "small-house-a",
      "name": "Tiny House",
      "description": "A cozy starter home",
      "cost": 500,
      "income": 10,
      "tier": 1,
      "size": {"width": 1, "height": 1},
      "sprite": "assets/city-builder/sprites/tier1/small-house-a.png",
      "unlockRequirement": {
        "type": "start",
        "description": "Available from the start"
      }
    },
    {
      "id": "small-house-b",
      "name": "Small Cottage",
      "description": "Slightly bigger starter home",
      "cost": 1000,
      "income": 20,
      "tier": 1,
      "size": {"width": 1, "height": 1},
      "sprite": "assets/city-builder/sprites/tier1/small-house-b.png",
      "unlockRequirement": {
        "type": "cityValue",
        "value": 2500,
        "description": "City value: $2,500"
      }
    },
    {
      "id": "small-house-c",
      "name": "Starter Home",
      "description": "Your first real home",
      "cost": 1500,
      "income": 30,
      "tier": 1,
      "size": {"width": 1, "height": 1},
      "sprite": "assets/city-builder/sprites/tier1/small-house-c.png",
      "unlockRequirement": {
        "type": "cityValue",
        "value": 5000,
        "description": "City value: $5,000"
      }
    },
    {
      "id": "small-house-d",
      "name": "Nice House",
      "description": "A comfortable home",
      "cost": 2000,
      "income": 40,
      "tier": 1,
      "size": {"width": 1, "height": 1},
      "sprite": "assets/city-builder/sprites/tier1/small-house-d.png",
      "unlockRequirement": {
        "type": "cityValue",
        "value": 7500,
        "description": "City value: $7,500"
      }
    },
    {
      "id": "garage",
      "name": "Garage",
      "description": "Park your virtual car",
      "cost": 1000,
      "income": 20,
      "tier": 1,
      "size": {"width": 1, "height": 1},
      "sprite": "assets/city-builder/sprites/tier1/garage.png",
      "unlockRequirement": {
        "type": "cityValue",
        "value": 3000,
        "description": "City value: $3,000"
      }
    }
  ],
  
  "tier2": [
    {
      "id": "suburban-a",
      "name": "Family Home",
      "description": "Perfect for raising a family",
      "cost": 5000,
      "income": 100,
      "tier": 2,
      "size": {"width": 2, "height": 2},
      "sprite": "assets/city-builder/sprites/tier2/suburban-a.png",
      "unlockRequirement": {
        "type": "tierUnlock",
        "value": 2,
        "description": "Unlock Tier 2 ($10,000 city value)"
      }
    },
    {
      "id": "suburban-b",
      "name": "Two-Story House",
      "description": "More space for more income",
      "cost": 6000,
      "income": 120,
      "tier": 2,
      "size": {"width": 2, "height": 2},
      "sprite": "assets/city-builder/sprites/tier2/suburban-b.png",
      "unlockRequirement": {
        "type": "tierUnlock",
        "value": 2,
        "description": "Unlock Tier 2 ($10,000 city value)"
      }
    },
    {
      "id": "suburban-c",
      "name": "Colonial Home",
      "description": "Classic American architecture",
      "cost": 7000,
      "income": 140,
      "tier": 2,
      "size": {"width": 2, "height": 2},
      "sprite": "assets/city-builder/sprites/tier2/suburban-c.png",
      "unlockRequirement": {
        "type": "tierUnlock",
        "value": 2,
        "description": "Unlock Tier 2 ($10,000 city value)"
      }
    }
  ],
  
  "tier3": [
    {
      "id": "commercial-a",
      "name": "Corner Shop",
      "description": "Your first business",
      "cost": 10000,
      "income": 500,
      "tier": 3,
      "size": {"width": 2, "height": 2},
      "sprite": "assets/city-builder/sprites/tier3/commercial-a.png",
      "unlockRequirement": {
        "type": "tierUnlock",
        "value": 3,
        "description": "Unlock Tier 3 ($100,000 city value)"
      }
    },
    {
      "id": "commercial-b",
      "name": "Office Building",
      "description": "Corporate headquarters",
      "cost": 15000,
      "income": 750,
      "tier": 3,
      "size": {"width": 2, "height": 2},
      "sprite": "assets/city-builder/sprites/tier3/commercial-b.png",
      "unlockRequirement": {
        "type": "tierUnlock",
        "value": 3,
        "description": "Unlock Tier 3 ($100,000 city value)"
      }
    }
  ],
  
  "tier4": [
    {
      "id": "skyscraper-a",
      "name": "Downtown Tower",
      "description": "The crown jewel of your city",
      "cost": 100000,
      "income": 5000,
      "tier": 4,
      "size": {"width": 3, "height": 3},
      "sprite": "assets/city-builder/sprites/tier4/skyscraper-a.png",
      "unlockRequirement": {
        "type": "tierUnlock",
        "value": 4,
        "description": "Unlock Tier 4 ($1,000,000 city value)"
      }
    }
  ],
  
  "tierUnlockRequirements": {
    "1": {
      "cityValue": 0,
      "description": "Available from start"
    },
    "2": {
      "cityValue": 10000,
      "description": "Reach $10,000 city value",
      "achievementId": "tier2_unlocked"
    },
    "3": {
      "cityValue": 100000,
      "description": "Reach $100,000 city value",
      "achievementId": "tier3_unlocked"
    },
    "4": {
      "cityValue": 1000000,
      "description": "Reach $1,000,000 city value",
      "achievementId": "tier4_unlocked"
    }
  }
}
```

**Save this as:** `C:\Users\scoso\WEBSITES\Mrsomersmaps\assets\city-builder\data\buildings.json`

---

### Task 1.4: Create HTML Page Structure (45 minutes)

**File:** `math-city-builder.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Math City Builder | Geographic Detective Academy</title>
    
    <!-- Supabase Client Library -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            /* Color Palette */
            --primary: #667eea;
            --secondary: #764ba2;
            --success: #4ade80;
            --warning: #fbbf24;
            --danger: #ef4444;
            
            --bg-dark: #0a0e27;
            --bg-panel: #0f1329;
            --bg-section: #1a1f3a;
            
            --grass: #22c55e;
            --road: #64748b;
            --water: #3b82f6;
            
            --text-primary: #ffffff;
            --text-secondary: #aaaaaa;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: var(--bg-dark);
            color: var(--text-primary);
            height: 100vh;
            overflow: hidden;
        }
        
        /* Header */
        #header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            padding: 12px 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
        }
        
        #header h1 {
            font-size: 20px;
            font-weight: 700;
        }
        
        .header-stats {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .stat-display {
            background: rgba(0,0,0,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
        }
        
        #back-btn, #logout-btn {
            background: rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            color: white;
            font-weight: 700;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        #back-btn:hover, #logout-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        
        /* Main Layout */
        #container {
            display: flex;
            height: calc(100vh - 60px);
        }
        
        /* Sidebar */
        #sidebar {
            width: 320px;
            background: var(--bg-panel);
            box-shadow: 4px 0 20px rgba(0,0,0,0.5);
            padding: 20px;
            overflow-y: auto;
        }
        
        .section {
            background: var(--bg-section);
            padding: 18px;
            border-radius: 12px;
            margin-bottom: 16px;
            border: 2px solid #2a2f4a;
        }
        
        .section h2 {
            font-size: 16px;
            font-weight: 700;
            color: var(--warning);
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--primary);
        }
        
        .building-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
        }
        
        .building-item {
            background: rgba(255,255,255,0.05);
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
        }
        
        .building-item:hover {
            background: rgba(255,255,255,0.1);
            border-color: var(--primary);
            transform: translateX(4px);
        }
        
        .building-item.locked {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .building-item.selected {
            background: var(--primary);
            border-color: var(--warning);
        }
        
        .building-name {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 4px;
        }
        
        .building-cost {
            font-size: 12px;
            color: var(--success);
        }
        
        .building-income {
            font-size: 12px;
            color: var(--warning);
        }
        
        /* Quiz Button */
        #quiz-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, var(--success) 0%, #22c55e 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 15px rgba(74, 222, 128, 0.4);
        }
        
        #quiz-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(74, 222, 128, 0.6);
        }
        
        /* Canvas Area */
        #canvas-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #1a1f3a 0%, #0f1329 100%);
            position: relative;
        }
        
        #city-canvas {
            border: 3px solid var(--primary);
            border-radius: 8px;
            background: var(--grass);
            image-rendering: pixelated;
            box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }
        
        /* Loading Screen */
        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-dark);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255,255,255,0.1);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loading-text {
            margin-top: 20px;
            font-size: 18px;
            color: var(--text-secondary);
        }
        
        /* Hidden by default */
        .hidden {
            display: none !important;
        }
    </style>
</head>
<body>
    <!-- Loading Screen -->
    <div id="loading-screen">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading Math City Builder...</div>
    </div>
    
    <!-- Main App (hidden until loaded) -->
    <div id="app" class="hidden">
        <!-- Header -->
        <div id="header">
            <h1>🏙️ Math City Builder</h1>
            <div class="header-stats">
                <div class="stat-display">💰 Cash: $<span id="cash-display">500</span></div>
                <div class="stat-display">🏆 XP: <span id="xp-display">0</span></div>
                <div class="stat-display">🏘️ Value: $<span id="value-display">0</span></div>
                <button id="back-btn">← Back to Maps</button>
                <button id="logout-btn">Logout</button>
            </div>
        </div>
        
        <!-- Main Container -->
        <div id="container">
            <!-- Sidebar -->
            <div id="sidebar">
                <!-- Stats Section -->
                <div class="section">
                    <h2>📊 City Stats</h2>
                    <div style="font-size: 14px; line-height: 1.8;">
                        <div>🏢 Buildings: <span id="building-count">0</span></div>
                        <div>💵 Income per Quiz: $<span id="income-display">0</span></div>
                        <div>📈 Current Tier: <span id="tier-display">1</span></div>
                        <div>🎯 Quizzes Completed: <span id="quiz-count">0</span></div>
                        <div>✅ Accuracy: <span id="accuracy-display">0</span>%</div>
                    </div>
                </div>
                
                <!-- Quiz Button -->
                <div class="section">
                    <button id="quiz-btn">🎓 Answer Quiz (+$<span id="quiz-reward">10</span>)</button>
                </div>
                
                <!-- Buildings Section -->
                <div class="section">
                    <h2>🏗️ Buildings</h2>
                    <div id="building-list" class="building-grid">
                        <!-- Buildings will be populated here -->
                    </div>
                </div>
            </div>
            
            <!-- Canvas Area -->
            <div id="canvas-container">
                <canvas id="city-canvas" width="800" height="600"></canvas>
            </div>
        </div>
    </div>
    
    <!-- Scripts will be added in next tasks -->
    <script>
        // Placeholder - scripts will be added in Task 1.5
        console.log('Math City Builder loaded!');
    </script>
</body>
</html>
```

**Save this as:** `C:\Users\scoso\WEBSITES\Mrsomersmaps\math-city-builder.html`

---

### Task 1.5: Initialize Supabase Connection (30 minutes)

Add this script section to `math-city-builder.html` (before the closing `</body>` tag):

```javascript
<script>
// ============================================
// SUPABASE INITIALIZATION
// ============================================

const SUPABASE_URL = 'https://fuppbkhfqutzcromomkc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cHBia2hmcXV0emNyb21vbWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODE4NDQsImV4cCI6MjA3NjU1Nzg0NH0.A1kARz6ujz1wMQy-T_4W2EN1wrroma6f230_-rKnNBo';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: window.localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

console.log('✅ Supabase initialized');

// ============================================
// AUTHENTICATION CHECK
// ============================================

let currentUser = null;
let cityData = null;

async function checkAuth() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
            console.warn('No active session - redirecting to login');
            window.location.href = '/login.html';
            return false;
        }
        
        currentUser = session.user;
        console.log('✅ Authenticated:', currentUser.email);
        return true;
        
    } catch (error) {
        console.error('❌ Auth check failed:', error);
        window.location.href = '/login.html';
        return false;
    }
}

// ============================================
// LOAD CITY DATA
// ============================================

async function loadCityData() {
    try {
        console.log('📦 Loading city data for user:', currentUser.id);
        
        const { data, error } = await supabase
            .from('city_progress')
            .select('*')
            .eq('student_id', currentUser.id)
            .single();
        
        if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows found (first time playing)
            throw error;
        }
        
        if (data) {
            console.log('✅ Loaded existing city:', data);
            cityData = data;
        } else {
            console.log('🆕 First time playing - creating new city');
            cityData = await createNewCity();
        }
        
        return cityData;
        
    } catch (error) {
        console.error('❌ Failed to load city:', error);
        alert('Failed to load your city. Please try refreshing the page.');
        return null;
    }
}

// ============================================
// CREATE NEW CITY (First Time)
// ============================================

async function createNewCity() {
    try {
        const newCity = {
            student_id: currentUser.id,
            buildings: [],
            grid_size: 50,
            cash: 500.00,
            total_income: 0.00,
            city_value: 0.00,
            current_tier: 1,
            buildings_placed: 0,
            quizzes_completed: 0,
            correct_answers: 0,
            incorrect_answers: 0,
            times_tables_mastered: [],
            current_table: 2,
            table_accuracy: {},
            achievements_unlocked: []
        };
        
        const { data, error } = await supabase
            .from('city_progress')
            .insert([newCity])
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('✅ Created new city:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Failed to create city:', error);
        throw error;
    }
}

// ============================================
// SAVE CITY DATA
// ============================================

async function saveCityData() {
    try {
        const { data, error } = await supabase
            .from('city_progress')
            .update({
                buildings: cityData.buildings,
                cash: cityData.cash,
                total_income: cityData.total_income,
                city_value: cityData.city_value,
                current_tier: cityData.current_tier,
                buildings_placed: cityData.buildings_placed,
                quizzes_completed: cityData.quizzes_completed,
                correct_answers: cityData.correct_answers,
                incorrect_answers: cityData.incorrect_answers,
                times_tables_mastered: cityData.times_tables_mastered,
                current_table: cityData.current_table,
                table_accuracy: cityData.table_accuracy,
                achievements_unlocked: cityData.achievements_unlocked
            })
            .eq('student_id', currentUser.id)
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('✅ City saved:', data);
        return true;
        
    } catch (error) {
        console.error('❌ Failed to save city:', error);
        return false;
    }
}

// ============================================
// AUTO-SAVE (Every 30 seconds)
// ============================================

let autoSaveInterval = null;

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    
    autoSaveInterval = setInterval(async () => {
        console.log('💾 Auto-saving city...');
        const success = await saveCityData();
        if (success) {
            console.log('✅ Auto-save successful');
        }
    }, 30000); // 30 seconds
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

// ============================================
// LOGOUT
// ============================================

async function logout() {
    try {
        // Save before logout
        await saveCityData();
        
        // Stop auto-save
        stopAutoSave();
        
        // Sign out
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Redirect to login
        window.location.href = '/login.html';
        
    } catch (error) {
        console.error('❌ Logout failed:', error);
        // Force redirect anyway
        window.location.href = '/login.html';
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function initializeApp() {
    try {
        // Check authentication
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) return;
        
        // Load city data
        const loaded = await loadCityData();
        if (!loaded) return;
        
        // Update UI with city data
        updateUI();
        
        // Start auto-save
        startAutoSave();
        
        // Hide loading screen
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        
        console.log('✅ App initialized successfully!');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        alert('Failed to load Math City Builder. Please try again.');
    }
}

// ============================================
// UPDATE UI
// ============================================

function updateUI() {
    // Update header stats
    document.getElementById('cash-display').textContent = cityData.cash.toFixed(2);
    document.getElementById('xp-display').textContent = cityData.quizzes_completed * 10; // Placeholder
    document.getElementById('value-display').textContent = cityData.city_value.toFixed(2);
    
    // Update sidebar stats
    document.getElementById('building-count').textContent = cityData.buildings_placed;
    document.getElementById('income-display').textContent = calculateTotalIncome();
    document.getElementById('tier-display').textContent = cityData.current_tier;
    document.getElementById('quiz-count').textContent = cityData.quizzes_completed;
    
    const accuracy = cityData.quizzes_completed > 0 
        ? ((cityData.correct_answers / (cityData.correct_answers + cityData.incorrect_answers)) * 100).toFixed(1)
        : 0;
    document.getElementById('accuracy-display').textContent = accuracy;
    
    const income = calculateTotalIncome();
    document.getElementById('quiz-reward').textContent = income;
}

function calculateTotalIncome() {
    if (!cityData || !cityData.buildings) return 0;
    return cityData.buildings.reduce((sum, building) => sum + (building.income || 0), 0);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.getElementById('back-btn').addEventListener('click', async () => {
    await saveCityData();
    window.location.href = '/index.html';
});

document.getElementById('logout-btn').addEventListener('click', logout);

// Save before page unload
window.addEventListener('beforeunload', async (e) => {
    await saveCityData();
});

// ============================================
// START APP
// ============================================

initializeApp();
</script>
```

---

### Task 1.6: Add Link from Main App (10 minutes)

**File:** `index.html`

Find the game modes section and add Math City Builder:

```html
<!-- Around line 1000-1100, in the game modes section -->

<button class="mode-btn" data-mode="math-city-builder">
    🏙️ Math City Builder
</button>
```

Then add the click handler in the JavaScript section:

```javascript
// Find the game mode click handlers (around line 5000-6000)

// Add this handler
if (mode === 'math-city-builder') {
    window.location.href = '/math-city-builder.html';
    return;
}
```

---

## ✅ PHASE 1 VERIFICATION

### Checklist

Run through this checklist to verify Phase 1 is complete:

```
✅ Supabase table `city_progress` exists
✅ File structure created (assets/city-builder folders)
✅ buildings.json file created with 15 buildings
✅ math-city-builder.html created
✅ Supabase connection working (no console errors)
✅ Page redirects to login if not authenticated
✅ New city created on first visit
✅ City data saves to Supabase
✅ Auto-save runs every 30 seconds
✅ Link from index.html works
✅ Back button returns to index.html
✅ Logout button works
```

### Testing Steps

1. **Open browser console** (F12)
2. **Navigate to:** http://localhost:8888/math-city-builder.html
3. **Expected console output:**
```
✅ Supabase initialized
✅ Authenticated: agent001@example.com
📦 Loading city data for user: [uuid]
🆕 First time playing - creating new city
✅ Created new city: [object]
✅ App initialized successfully!
💾 Auto-saving city... (after 30 seconds)
✅ Auto-save successful
```

4. **Check Supabase:**
   - Go to Table Editor → city_progress
   - Should see 1 row with your student_id
   - Cash should be $500.00
   - Buildings should be empty array []

5. **Test navigation:**
   - Click "Back to Maps" → Should return to index.html
   - Click "Math City Builder" → Should return to math-city-builder.html
   - Data should persist (cash still $500)

---

## 🚀 NEXT PHASE

**Phase 1 Complete! ✅**

Next: **[Phase 2: Core Game](MATH_CITY_BUILDER_PHASE2_CORE_GAME.md)**

In Phase 2, we will:
- Implement 50×50 grid system
- Add building placement mechanics
- Render buildings on canvas
- Implement economic system
- Load 15 MVP buildings

---

**Document Version:** 1.0  
**Last Updated:** October 25, 2025  
**Status:** 🟢 READY TO IMPLEMENT  
**Estimated Time:** 2 days (Day 1-2)
