# 🎯 SUPABASE QUICK REFERENCE CARD

**Project:** Geographic Detective Academy  
**Last Updated:** October 20, 2025

---

## 📊 PROJECT INFO

| Property | Value |
|----------|-------|
| **Project Name** | Geographic Detective Academy |
| **Project URL** | https://fuppbkhfqutzcromomkc.supabase.co |
| **Project ID** | fuppbkhfqutzcromomkc |
| **Region** | us-east-1 |
| **Plan** | Free Tier (500MB database, 50K monthly active users) |
| **Created** | October 20, 2025 |

---

## 🔑 API KEYS

### Anon Key (Public - Safe in Frontend)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cHBia2hmcXV0emNyb21vbWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODE4NDQsImV4cCI6MjA3NjU1Nzg0NH0.A1kARz6ujz1wMQy-T_4W2EN1wrroma6f230_-rKnNBo
```

**Used In:**
- `index.html` (line 2467)
- `login.html` (line 568)

**Purpose:**
- Client-side authentication
- Database queries from frontend
- Protected by Row Level Security (RLS)

### Service Role Key (SECRET - Never Expose!)
**Location:** Supabase Dashboard → Project Settings → API  
**Use Only:** Server-side operations (if needed)  
**DO NOT:** Put in frontend code or commit to Git

---

## 🗄️ DATABASE SCHEMA

### Tables

#### 1. `accounts` (User Account Info)
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    account_type TEXT DEFAULT 'student', -- 'student' or 'teacher'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Current Data:**
- 40 accounts total
- 1 teacher: `scosom@gmail.com`
- 39 students: `kalayabo@student.mrsomers.com`, etc.

#### 2. `profiles` (Extended User Data)
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES accounts(auth_user_id),
    grade_level INTEGER,
    school TEXT,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `game_progress` (Student Progress Tracking)
```sql
CREATE TABLE game_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES accounts(auth_user_id),
    locations_visited JSONB,
    countries_unlocked JSONB,
    total_score INTEGER DEFAULT 0,
    achievements JSONB,
    last_played TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. `achievements` (Achievement Unlocks)
```sql
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES accounts(auth_user_id),
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT NOW(),
    achievement_data JSONB
);
```

#### 5. `error_logs` (Error Tracking)
```sql
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES accounts(auth_user_id),
    error_type TEXT,
    error_message TEXT,
    stack_trace TEXT,
    context JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔒 ROW LEVEL SECURITY (RLS)

### Policies in Place

#### Students (account_type = 'student')
```sql
-- Students can only read/write their own data
CREATE POLICY "students_own_data" ON game_progress
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "students_own_achievements" ON achievements
    FOR ALL USING (user_id = auth.uid());
```

#### Teachers (account_type = 'teacher')
```sql
-- Teachers can read ALL student data (but not modify)
CREATE POLICY "teachers_read_all" ON game_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accounts
            WHERE auth_user_id = auth.uid()
            AND account_type = 'teacher'
        )
    );

CREATE POLICY "teachers_read_all_accounts" ON accounts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accounts
            WHERE auth_user_id = auth.uid()
            AND account_type = 'teacher'
        )
    );
```

**Result:**
- ✅ Students can't peek at other students' progress
- ✅ Teachers can view all 40 students
- ✅ Enforced at database level (can't bypass from frontend)

---

## 👥 USER ACCOUNTS

### Teacher Account
- **Email:** scosom@gmail.com
- **Account Type:** teacher
- **Permissions:** View all students, manage classroom

### Student Accounts (39 total)

**Format:** `{username}@student.mrsomers.com`

**Sample Students:**
1. kalayabo@student.mrsomers.com (Kalaya Boston)
2. kisubo@student.mrsomers.com (Kisu Boston)
3. saynacu@student.mrsomers.com (Sayna Cummings)
4. helenade@student.mrsomers.com (Helena Debler)
5. ... (35 more)

**Full List:** See `student-batch-data.sql`

**Passwords:** Set individually during account creation

---

## 🔐 AUTHENTICATION SETTINGS

| Setting | Value | Why |
|---------|-------|-----|
| **Enable Email Signup** | ✅ Yes | Students/parents can register |
| **Email Confirmations** | ❌ No | Easier for students (no email access needed) |
| **Password Requirements** | Minimum 6 chars | Student-friendly |
| **Session Duration** | 604800s (7 days) | Stay logged in for a week |
| **Session Storage** | localStorage | Works on localhost + production |
| **Auto Refresh Token** | ✅ Yes | Seamless experience |
| **Detect Session in URL** | ❌ No | Prevents redirect loops |

---

## 🌐 CONNECTION EXAMPLES

### JavaScript (Frontend)
```javascript
// Initialize Supabase client
const SUPABASE_URL = 'https://fuppbkhfqutzcromomkc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: window.localStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false
    }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
    email: 'kalayabo@student.mrsomers.com',
    password: 'kinddoor79'
});

// Get current session
const { data: { session } } = await supabase.auth.getSession();

// Query database (RLS enforced)
const { data: progress } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', session.user.id);
```

### SQL (Direct Database Access)
```sql
-- Get teacher info
SELECT * FROM accounts WHERE account_type = 'teacher';

-- Get all students
SELECT full_name, created_at 
FROM accounts 
WHERE account_type = 'student'
ORDER BY full_name;

-- Check student progress
SELECT a.full_name, gp.total_score, gp.locations_visited
FROM accounts a
JOIN game_progress gp ON a.auth_user_id = gp.user_id
ORDER BY gp.total_score DESC;
```

---

## 📈 USAGE LIMITS (Free Tier)

| Resource | Limit | Current Usage |
|----------|-------|---------------|
| **Database Storage** | 500 MB | ~1 MB (40 users) |
| **Monthly Active Users** | 50,000 | 40 |
| **Egress Bandwidth** | 2 GB | Minimal |
| **Edge Functions** | 500K invocations | 0 (not using yet) |
| **Storage (files)** | 1 GB | 0 (not using yet) |

**Status:** ✅ Well within free tier limits

---

## 🔧 COMMON OPERATIONS

### Check User Session
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);
```

### Sign Out
```javascript
await supabase.auth.signOut();
localStorage.clear();
```

### Get Account Data
```javascript
const { data: accountData } = await supabase
    .from('accounts')
    .select('full_name, account_type')
    .eq('auth_user_id', session.user.id)
    .single();
```

### Save Progress
```javascript
const { error } = await supabase
    .from('game_progress')
    .upsert({
        user_id: session.user.id,
        locations_visited: { Alaska: true, China: true },
        total_score: 150,
        updated_at: new Date().toISOString()
    });
```

---

## 🚨 TROUBLESHOOTING

### Issue: "Session not found"
**Solution:** Check localStorage is enabled, session hasn't expired

### Issue: "Column does not exist"
**Solution:** Verify table schema matches queries (don't query `username` - it doesn't exist!)

### Issue: "Row Level Security policy violation"
**Solution:** Ensure RLS policies are set up correctly for students vs teachers

### Issue: "Invalid API key"
**Solution:** Verify anon key matches Supabase dashboard (Project Settings → API)

---

## 📞 SUPPORT

**Supabase Dashboard:** https://app.supabase.com/project/fuppbkhfqutzcromomkc  
**Documentation:** https://supabase.com/docs  
**Support:** support@supabase.com  

---

## ✅ STATUS CHECK

**As of October 20, 2025:**

✅ Supabase project created and configured  
✅ Database schema deployed  
✅ RLS policies active  
✅ 40 user accounts created (1 teacher + 39 students)  
✅ Authentication working in login.html  
✅ Session management working in index.html  
✅ Frontend integrated successfully  

**Ready for:** Student deployment 🚀
