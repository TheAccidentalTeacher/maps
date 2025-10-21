# 👩‍🏫 Teacher & Parent Dashboard - Complete Specification

**Version:** 1.0  
**Last Updated:** October 20, 2025  
**Status:** Ready for implementation  
**Priority:** CRITICAL - Core SaaS feature

---

## 📋 EXECUTIVE SUMMARY

### What This Document Covers
1. **Free Access System** - Give students free accounts while charging others
2. **Easy Testing Access** - Simple dev login (username: `test`, password: `test123`)
3. **Teacher Dashboard** - Monitor student progress, achievements, errors, engagement
4. **Parent Dashboard** - Moms can monitor their children (same features as teachers)
5. **Email Notifications** - Automatic achievement alerts to parents/teachers
6. **Error Logging** - Real-time error tracking visible to educators
7. **Student-Friendly UI** - Simple, fun interface for kids
8. **Educator-Friendly UI** - Robust analytics and monitoring tools

---

## 🎯 USER TYPES & ACCESS LEVELS

### 1. Students (Free via Teacher)
**Access Level:** Player only  
**Features:**
- ✅ All 6 game modes
- ✅ Achievement system
- ✅ Progress tracking
- ❌ No dashboard access
- ❌ No analytics

**How They Get Access:**
- Teacher creates account for them
- Teacher sets `account_type = 'classroom_free'`
- No payment required, no expiration

---

### 2. Students (Paid via Parent)
**Access Level:** Player only  
**Features:**
- ✅ All 6 game modes
- ✅ Achievement system
- ✅ Progress tracking
- ✅ Cloud sync
- ❌ No dashboard access

**How They Get Access:**
- Parent signs up for Premium ($9.99/month)
- Parent creates child profiles (up to 3)
- Payment via Stripe

---

### 3. Teachers (Classroom Account)
**Access Level:** Administrator  
**Features:**
- ✅ Create unlimited free student accounts
- ✅ Full dashboard with analytics
- ✅ Error logs
- ✅ Email notifications
- ✅ Progress reports
- ✅ Achievement tracking
- ✅ Engagement metrics

**How They Get Access:**
- Sign up for Classroom account (custom pricing)
- OR: You manually create account for Alaska students
- Account type: `classroom_teacher`

---

### 4. Parents (Family Account)
**Access Level:** Administrator (for their children only)  
**Features:**
- ✅ Create up to 3 child profiles (Premium) or unlimited (Family)
- ✅ Full dashboard (same as teacher)
- ✅ Error logs
- ✅ Email notifications
- ✅ Progress reports
- ✅ Achievement tracking
- ✅ Engagement metrics

**How They Get Access:**
- Sign up for Premium ($9.99/month) or Family ($19.99/month)
- Payment via Stripe
- Account type: `family_parent`

---

### 5. Admin (You)
**Access Level:** Super admin  
**Features:**
- ✅ Access all accounts
- ✅ Global error logs
- ✅ System analytics
- ✅ Grant free access
- ✅ Manage subscriptions
- ✅ Override any setting

**How You Get Access:**
- Dev login: `username: test`, `password: test123`
- Account type: `admin`

---

## 🆓 FREE ACCESS SYSTEM

### Use Case: Your Alaska Students
You want to give 15 Alaska middle school students free access forever without requiring payment.

### Database Schema

```sql
-- Accounts table with free access flag
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID REFERENCES auth.users(id),
  account_type TEXT CHECK (account_type IN (
    'family_parent',      -- Paid parent account
    'classroom_teacher',  -- Paid teacher account
    'classroom_free',     -- FREE teacher-granted account
    'admin'               -- System admin (you)
  )),
  plan_type TEXT CHECK (plan_type IN (
    'free',              -- FREE forever
    'trial',             -- 14-day trial
    'premium',           -- $9.99/month
    'family',            -- $19.99/month
    'classroom'          -- Custom pricing
  )),
  subscription_status TEXT CHECK (subscription_status IN (
    'active',
    'canceled',
    'expired',
    'free_forever'       -- Never expires, no payment
  )),
  
  -- Free access tracking
  is_free_access BOOLEAN DEFAULT false,
  granted_by UUID REFERENCES auth.users(id), -- Who granted free access
  free_access_reason TEXT, -- "Alaska classroom 2025-2026"
  granted_at TIMESTAMPTZ,
  
  -- Standard fields
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profiles (belong to accounts)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER,
  grade INTEGER,
  username TEXT UNIQUE, -- For student login
  avatar_url TEXT,
  
  -- Access control
  is_active BOOLEAN DEFAULT true,
  last_played_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### How to Grant Free Access (Admin Panel)

```javascript
// Admin function to grant free access
async function grantFreeAccess(teacherEmail, studentNames, reason) {
  // 1. Create teacher account (if doesn't exist)
  const { data: teacher } = await supabase.auth.signUp({
    email: teacherEmail,
    password: generateSecurePassword(), // Send to teacher via email
  });
  
  // 2. Create classroom account with free access
  const { data: account } = await supabase
    .from('accounts')
    .insert({
      owner_user_id: teacher.user.id,
      account_type: 'classroom_free',
      plan_type: 'free',
      subscription_status: 'free_forever',
      is_free_access: true,
      granted_by: adminUserId, // Your admin user ID
      free_access_reason: reason, // "Alaska Middle School 2025-2026"
      granted_at: new Date().toISOString()
    })
    .select()
    .single();
  
  // 3. Create student profiles
  for (const studentName of studentNames) {
    await supabase
      .from('profiles')
      .insert({
        account_id: account.id,
        display_name: studentName,
        username: generateUsername(studentName), // e.g., "emma_001"
        is_active: true
      });
  }
  
  // 4. Send welcome email to teacher
  await sendEmail({
    to: teacherEmail,
    subject: 'Free Geographic Detective Academy Access',
    body: `
      Your classroom account has been activated with free access!
      
      Student accounts created: ${studentNames.length}
      Access: Free forever
      
      Login at: https://yourapp.com/login
      
      Questions? Reply to this email.
    `
  });
  
  return { success: true, studentCount: studentNames.length };
}

// Example usage for your Alaska students
await grantFreeAccess(
  'mrs.somers@alaskaschool.edu',
  ['Emma', 'Liam', 'Sofia', 'Noah', 'Olivia', /* ...15 total */],
  'Alaska Middle School - Free classroom access 2025-2026 school year'
);
```

### Admin Panel UI (For You)

```html
<!-- Simple form to grant free access -->
<div class="admin-panel">
  <h2>Grant Free Access</h2>
  
  <form id="grantAccessForm">
    <label>Teacher Email:</label>
    <input type="email" id="teacherEmail" required>
    
    <label>Student Names (one per line):</label>
    <textarea id="studentNames" rows="15" placeholder="Emma
Liam
Sofia
Noah
Olivia"></textarea>
    
    <label>Reason:</label>
    <input type="text" id="reason" value="Alaska Middle School 2025-2026">
    
    <button type="submit">Grant Free Access</button>
  </form>
  
  <div id="result"></div>
</div>
```

---

## 🧪 EASY TESTING ACCESS (Dev Login)

### Use Case: Quick Testing Without Complex Password
You want to login as `test` / `test123` and immediately see the app.

### Implementation

```javascript
// Create test account on database setup
async function createTestAccount() {
  // 1. Create auth user
  const { data: testUser } = await supabase.auth.admin.createUser({
    email: 'test@geoapp.com',
    password: 'test123',
    email_confirm: true // Skip email verification
  });
  
  // 2. Create admin account
  await supabase
    .from('accounts')
    .insert({
      owner_user_id: testUser.user.id,
      account_type: 'admin',
      plan_type: 'free',
      subscription_status: 'free_forever',
      is_free_access: true
    });
  
  // 3. Create test student profiles
  const testStudents = ['Test Student 1', 'Test Student 2', 'Test Student 3'];
  for (const name of testStudents) {
    await supabase
      .from('profiles')
      .insert({
        account_id: account.id,
        display_name: name,
        username: name.toLowerCase().replace(/ /g, '_'),
        age: 13,
        grade: 7
      });
  }
}

// Enhanced login with username support
async function login(identifier, password) {
  let email = identifier;
  
  // Check if identifier is username instead of email
  if (!identifier.includes('@')) {
    // Look up email by username
    const { data: profile } = await supabase
      .from('profiles')
      .select('accounts!inner(owner_user_id), auth.users!inner(email)')
      .eq('username', identifier)
      .single();
    
    email = profile?.users?.email;
  }
  
  // Standard Supabase login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}

// Quick dev login button
function addDevLoginButton() {
  const button = document.createElement('button');
  button.textContent = 'Dev Login (test/test123)';
  button.onclick = async () => {
    await login('test@geoapp.com', 'test123');
    window.location.href = '/dashboard';
  };
  document.body.appendChild(button);
}
```

### Login Screen with Quick Access

```html
<div class="login-screen">
  <h1>Geographic Detective Academy</h1>
  
  <!-- Standard login -->
  <form id="loginForm">
    <input type="text" placeholder="Username or Email" id="identifier">
    <input type="password" placeholder="Password" id="password">
    <button type="submit">Login</button>
  </form>
  
  <!-- Quick dev login (only in development) -->
  <div class="dev-login" style="display: none;"> <!-- Show only in dev -->
    <button onclick="quickLogin('test@geoapp.com', 'test123')">
      🧪 Dev Login (test/test123)
    </button>
  </div>
</div>
```

---

## 📊 TEACHER/PARENT DASHBOARD

### Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│  Geographic Detective Academy - Teacher Dashboard│
├─────────────────────────────────────────────────┤
│  👋 Welcome, Mrs. Somers                        │
│  📧 Notifications: 3 new achievements           │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Students │  │ Activity │  │ Errors   │     │
│  │    15    │  │   12     │  │    2     │     │
│  │          │  │  active  │  │  today   │     │
│  └──────────┘  └──────────┘  └──────────┘     │
├─────────────────────────────────────────────────┤
│  Student List                                   │
│  ┌───────────────────────────────────────────┐ │
│  │ 🟢 Emma        Level 12   450 XP   🏆 15  │ │
│  │ 🟢 Liam        Level 10   380 XP   🏆 12  │ │
│  │ 🔴 Sofia       Level 3    90 XP    🏆 2   │ │ <- Needs attention
│  │ 🟢 Noah        Level 8    250 XP   🏆 8   │ │
│  └───────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│  Recent Achievements                            │
│  🏆 Emma unlocked "Geography Expert"           │
│  🏆 Liam completed Alaska Adventure Round 5    │
│  🏆 Noah found 10 mystery locations            │
└─────────────────────────────────────────────────┘
```

### Database Schema for Dashboard

```sql
-- Error logging (for teacher visibility)
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  account_id UUID REFERENCES accounts(id),
  
  -- Error details
  error_type TEXT, -- 'js_error', 'api_error', 'game_error'
  error_message TEXT,
  error_stack TEXT,
  game_mode TEXT, -- Which mode crashed
  
  -- Context
  user_agent TEXT,
  url TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Teacher actions
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  notes TEXT
);

-- Activity tracking (for engagement metrics)
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),
  account_id UUID REFERENCES accounts(id),
  
  -- Activity details
  activity_type TEXT, -- 'login', 'game_start', 'game_complete', 'achievement'
  game_mode TEXT,
  duration_seconds INTEGER,
  
  -- Metrics
  score INTEGER,
  xp_earned INTEGER,
  achievements_unlocked INTEGER,
  
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Email notification preferences
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES accounts(id),
  user_id UUID REFERENCES auth.users(id),
  
  -- What to notify
  notify_achievements BOOLEAN DEFAULT true,
  notify_weekly_report BOOLEAN DEFAULT true,
  notify_errors BOOLEAN DEFAULT true,
  notify_milestones BOOLEAN DEFAULT true,
  
  -- Where to send
  notification_email TEXT,
  notification_frequency TEXT CHECK (notification_frequency IN (
    'instant',    -- Email immediately
    'daily',      -- Daily digest
    'weekly'      -- Weekly summary
  )),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Dashboard API Endpoints

```javascript
// Get dashboard summary
async function getDashboardSummary(accountId) {
  // 1. Get student count
  const { count: studentCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId);
  
  // 2. Get active students (played in last 7 days)
  const { count: activeCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)
    .gte('last_played_at', sevenDaysAgo);
  
  // 3. Get error count (last 24 hours)
  const { count: errorCount } = await supabase
    .from('error_logs')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)
    .gte('timestamp', twentyFourHoursAgo);
  
  // 4. Get recent achievements (last 7 days)
  const { data: achievements } = await supabase
    .from('achievements')
    .select(`
      *,
      profiles:profile_id (display_name)
    `)
    .eq('account_id', accountId)
    .gte('unlocked_at', sevenDaysAgo)
    .order('unlocked_at', { ascending: false })
    .limit(10);
  
  return {
    studentCount,
    activeCount,
    errorCount,
    achievements
  };
}

// Get student detail
async function getStudentDetail(profileId) {
  // 1. Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();
  
  // 2. Get game progress
  const { data: progress } = await supabase
    .from('game_progress')
    .select('*')
    .eq('profile_id', profileId);
  
  // 3. Get achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('profile_id', profileId);
  
  // 4. Get recent activity
  const { data: activity } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('profile_id', profileId)
    .order('timestamp', { ascending: false })
    .limit(20);
  
  // 5. Get errors (if any)
  const { data: errors } = await supabase
    .from('error_logs')
    .select('*')
    .eq('profile_id', profileId)
    .order('timestamp', { ascending: false })
    .limit(10);
  
  return {
    profile,
    progress,
    achievements,
    activity,
    errors
  };
}
```

### Teacher Dashboard HTML

```html
<div class="teacher-dashboard">
  <!-- Header -->
  <header>
    <h1>🏫 Teacher Dashboard</h1>
    <p>Welcome, <span id="teacherName"></span></p>
    <button onclick="logout()">Logout</button>
  </header>
  
  <!-- Summary Cards -->
  <div class="summary-cards">
    <div class="card">
      <h3>Students</h3>
      <p class="big-number" id="studentCount">15</p>
    </div>
    <div class="card">
      <h3>Active This Week</h3>
      <p class="big-number" id="activeCount">12</p>
    </div>
    <div class="card alert" id="errorCard">
      <h3>⚠️ Errors Today</h3>
      <p class="big-number" id="errorCount">2</p>
    </div>
  </div>
  
  <!-- Student List -->
  <div class="student-list">
    <h2>Student Progress</h2>
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Name</th>
          <th>Level</th>
          <th>XP</th>
          <th>Achievements</th>
          <th>Last Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="studentTableBody">
        <!-- Populated by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Recent Achievements -->
  <div class="recent-achievements">
    <h2>🏆 Recent Achievements</h2>
    <div id="achievementList">
      <!-- Populated by JavaScript -->
    </div>
  </div>
  
  <!-- Error Logs -->
  <div class="error-logs">
    <h2>⚠️ Error Logs</h2>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Student</th>
          <th>Error</th>
          <th>Game Mode</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="errorTableBody">
        <!-- Populated by JavaScript -->
      </tbody>
    </table>
  </div>
</div>
```

---

## 📧 EMAIL NOTIFICATION SYSTEM

### Use Case: Automatic Achievement Emails
When a student unlocks an achievement, automatically email the parent/teacher.

### Email Service Setup

**Recommended:** [Postmark](https://postmarkapp.com/) - $10/month for 10,000 emails

```javascript
// Install Postmark
// npm install postmark

const postmark = require('postmark');
const client = new postmark.ServerClient('YOUR_API_KEY');

// Send achievement notification
async function sendAchievementEmail(achievement, profile, recipientEmail) {
  await client.sendEmail({
    From: 'notifications@geoapp.com',
    To: recipientEmail,
    Subject: `🏆 ${profile.display_name} unlocked "${achievement.title}"!`,
    HtmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>🎉 New Achievement Unlocked!</h1>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h2>${achievement.title}</h2>
          <p>${achievement.description}</p>
          <p><strong>Earned by:</strong> ${profile.display_name}</p>
          <p><strong>Date:</strong> ${new Date(achievement.unlocked_at).toLocaleDateString()}</p>
        </div>
        
        <p>🎮 <strong>Progress Update:</strong></p>
        <ul>
          <li>Total Achievements: ${achievement.total_unlocked} / 59</li>
          <li>Current XP: ${profile.total_xp}</li>
          <li>Level: ${profile.level}</li>
        </ul>
        
        <a href="https://yourapp.com/dashboard" 
           style="background: #3b82f6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          View Full Progress
        </a>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          You're receiving this email because you enabled achievement notifications.
          <a href="https://yourapp.com/settings">Manage notification settings</a>
        </p>
      </div>
    `,
    TextBody: `
      New Achievement Unlocked!
      
      ${achievement.title}
      ${achievement.description}
      
      Earned by: ${profile.display_name}
      Date: ${new Date(achievement.unlocked_at).toLocaleDateString()}
      
      Progress Update:
      - Total Achievements: ${achievement.total_unlocked} / 59
      - Current XP: ${profile.total_xp}
      - Level: ${profile.level}
      
      View full progress: https://yourapp.com/dashboard
    `,
    MessageStream: 'outbound'
  });
}

// Trigger on achievement unlock
async function onAchievementUnlocked(profileId, achievementId) {
  // 1. Get achievement details
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', achievementId)
    .single();
  
  // 2. Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      accounts:account_id (
        owner_user_id,
        notification_settings (*)
      )
    `)
    .eq('id', profileId)
    .single();
  
  // 3. Check if notifications enabled
  const settings = profile.accounts.notification_settings;
  if (!settings?.notify_achievements) return;
  
  // 4. Get recipient email
  const { data: user } = await supabase.auth.admin.getUserById(
    profile.accounts.owner_user_id
  );
  
  const recipientEmail = settings.notification_email || user.email;
  
  // 5. Check frequency
  if (settings.notification_frequency === 'instant') {
    // Send immediately
    await sendAchievementEmail(achievement, profile, recipientEmail);
  } else {
    // Queue for daily/weekly digest
    await queueForDigest(achievement, profile, recipientEmail, settings.notification_frequency);
  }
}
```

### Netlify Function for Email Notifications

```javascript
// netlify/functions/send-achievement-notification.js
const postmark = require('postmark');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  const { achievement, profile, recipientEmail } = JSON.parse(event.body);
  
  // Send email via Postmark
  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
  
  try {
    await client.sendEmail({
      From: 'notifications@geoapp.com',
      To: recipientEmail,
      Subject: `🏆 ${profile.display_name} unlocked "${achievement.title}"!`,
      HtmlBody: `<!-- Email template here -->`,
      MessageStream: 'outbound'
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Email send failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Weekly Progress Report Email

```javascript
// Send weekly digest every Sunday at 6 PM
async function sendWeeklyReport(accountId) {
  // 1. Get account and notification settings
  const { data: account } = await supabase
    .from('accounts')
    .select(`
      *,
      notification_settings (*),
      profiles (*)
    `)
    .eq('id', accountId)
    .single();
  
  // 2. Get weekly stats for all students
  const stats = [];
  for (const profile of account.profiles) {
    const weeklyStats = await getWeeklyStats(profile.id);
    stats.push({ profile, ...weeklyStats });
  }
  
  // 3. Get recipient email
  const settings = account.notification_settings;
  const recipientEmail = settings.notification_email;
  
  // 4. Send email
  await client.sendEmail({
    From: 'reports@geoapp.com',
    To: recipientEmail,
    Subject: '📊 Weekly Progress Report - Geographic Detective Academy',
    HtmlBody: generateWeeklyReportHTML(stats),
    MessageStream: 'outbound'
  });
}

function generateWeeklyReportHTML(stats) {
  return `
    <h1>📊 Weekly Progress Report</h1>
    <p><strong>Week of:</strong> ${getWeekDateRange()}</p>
    
    <h2>Class Summary</h2>
    <ul>
      <li>Total Play Time: ${sumPlayTime(stats)} hours</li>
      <li>Achievements Unlocked: ${sumAchievements(stats)}</li>
      <li>Most Active Student: ${getMostActive(stats)}</li>
    </ul>
    
    <h2>Individual Progress</h2>
    ${stats.map(s => `
      <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>${s.profile.display_name}</h3>
        <ul>
          <li>Play Time: ${s.playTimeHours} hours</li>
          <li>Games Played: ${s.gamesPlayed}</li>
          <li>Achievements: ${s.achievementsUnlocked}</li>
          <li>XP Gained: ${s.xpGained}</li>
        </ul>
      </div>
    `).join('')}
    
    <a href="https://yourapp.com/dashboard">View Full Dashboard</a>
  `;
}
```

---

## 🚨 ERROR LOGGING SYSTEM

### Automatic Error Capture

```javascript
// Global error handler (in index.html)
window.addEventListener('error', async (event) => {
  const error = {
    error_type: 'js_error',
    error_message: event.message,
    error_stack: event.error?.stack,
    url: window.location.href,
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
  
  // Log to database
  await logError(error);
  
  // Show user-friendly message
  showToast('Oops! Something went wrong. Your teacher has been notified.', 'error');
});

// Log error to database
async function logError(error) {
  const { data: session } = await supabase.auth.getSession();
  if (!session) return;
  
  // Get current profile
  const profile = JSON.parse(localStorage.getItem('currentProfile'));
  
  await supabase
    .from('error_logs')
    .insert({
      profile_id: profile?.id,
      account_id: profile?.account_id,
      game_mode: currentGameMode,
      ...error
    });
  
  // If critical error, send immediate email
  if (error.error_type === 'game_crash') {
    await notifyTeacherOfCriticalError(error);
  }
}

// Catch API errors
async function callAPI(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // Log API error
    await logError({
      error_type: 'api_error',
      error_message: error.message,
      error_stack: error.stack,
      url: endpoint,
      user_agent: navigator.userAgent
    });
    
    throw error;
  }
}

// Catch game errors
async function startMystery() {
  try {
    // Game logic here
  } catch (error) {
    await logError({
      error_type: 'game_error',
      error_message: error.message,
      error_stack: error.stack,
      game_mode: 'mystery',
      url: window.location.href
    });
    
    showToast('Game error. Returning to menu.', 'error');
    switchMode('menu');
  }
}
```

### Teacher Error Dashboard

```javascript
// Get errors for teacher dashboard
async function getRecentErrors(accountId, limit = 20) {
  const { data: errors } = await supabase
    .from('error_logs')
    .select(`
      *,
      profiles:profile_id (display_name)
    `)
    .eq('account_id', accountId)
    .order('timestamp', { ascending: false })
    .limit(limit);
  
  return errors;
}

// Acknowledge error (mark as seen)
async function acknowledgeError(errorId, teacherUserId, notes) {
  await supabase
    .from('error_logs')
    .update({
      acknowledged: true,
      acknowledged_by: teacherUserId,
      acknowledged_at: new Date().toISOString(),
      notes
    })
    .eq('id', errorId);
}
```

---

## 🎨 STUDENT-FRIENDLY UI

### Design Principles
1. **Simple:** Big buttons, clear labels
2. **Colorful:** Bright, engaging colors
3. **Forgiving:** Undo buttons, confirmations
4. **Encouraging:** Positive feedback, celebrations
5. **Accessible:** Large text, high contrast

### Example Student UI

```html
<!-- Simple game selection -->
<div class="student-game-menu">
  <h1>Choose Your Adventure! 🗺️</h1>
  
  <div class="game-grid">
    <button class="game-card" onclick="startMode('mystery')">
      <div class="icon">🔍</div>
      <h2>Mystery Challenge</h2>
      <p>Find secret locations!</p>
    </button>
    
    <button class="game-card" onclick="startMode('scavenger')">
      <div class="icon">🏃</div>
      <h2>Scavenger Hunt</h2>
      <p>Complete objectives!</p>
    </button>
    
    <button class="game-card" onclick="startMode('guess')">
      <div class="icon">📸</div>
      <h2>Guess the Location</h2>
      <p>Identify places from photos!</p>
    </button>
  </div>
</div>

<style>
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.game-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 40px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.game-card .icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.game-card h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.game-card p {
  font-size: 16px;
  opacity: 0.9;
}
</style>
```

---

## 👩‍💼 EDUCATOR-FRIENDLY UI

### Design Principles
1. **Data-Rich:** Charts, tables, metrics
2. **Professional:** Clean, organized layout
3. **Actionable:** Export buttons, filters, search
4. **Informative:** Tooltips, help text
5. **Efficient:** Keyboard shortcuts, bulk actions

### Example Teacher Dashboard CSS

```css
.teacher-dashboard {
  font-family: 'Inter', sans-serif;
  background: #f8fafc;
  min-height: 100vh;
  padding: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card h3 {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;
}

.card .big-number {
  font-size: 36px;
  font-weight: bold;
  color: #1e293b;
}

.card.alert {
  border-left: 4px solid #ef4444;
}

.student-list table {
  width: 100%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.student-list th {
  background: #f1f5f9;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #475569;
}

.student-list td {
  padding: 15px;
  border-bottom: 1px solid #f1f5f9;
}

.student-list tr:hover {
  background: #f8fafc;
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Week 1: Free Access System (6-8 hours)
- [ ] Create `accounts` table with `is_free_access` field
- [ ] Create `grantFreeAccess()` admin function
- [ ] Build admin panel UI for granting access
- [ ] Create test account (test@geoapp.com / test123)
- [ ] Test granting free access to 15 students

### Week 2: Dashboard Backend (10-12 hours)
- [ ] Create `error_logs` table
- [ ] Create `activity_logs` table
- [ ] Create `notification_settings` table
- [ ] Build `getDashboardSummary()` API
- [ ] Build `getStudentDetail()` API
- [ ] Build `getRecentErrors()` API
- [ ] Implement global error handler

### Week 3: Dashboard Frontend (8-10 hours)
- [ ] Build teacher dashboard HTML/CSS
- [ ] Build student list table
- [ ] Build achievement feed
- [ ] Build error log viewer
- [ ] Add real-time updates (Supabase Realtime)
- [ ] Test on mobile devices

### Week 4: Email Notifications (6-8 hours)
- [ ] Sign up for Postmark account
- [ ] Create email templates (achievements, weekly report, errors)
- [ ] Build `sendAchievementEmail()` function
- [ ] Build `sendWeeklyReport()` function (cron job)
- [ ] Create notification settings UI
- [ ] Test all email scenarios

### Week 5: Polish & Testing (4-6 hours)
- [ ] Add tooltips and help text
- [ ] Implement keyboard shortcuts
- [ ] Add export to CSV functionality
- [ ] Cross-browser testing
- [ ] Mobile optimization
- [ ] User testing with your 15 students

**Total Time:** 34-44 hours

---

## 🎯 PRIORITY FEATURES (MVP)

For your initial Alaska student deployment, focus on these MUST-HAVE features:

### P0 (Critical - Week 1)
1. ✅ Free access system (so students don't need to pay)
2. ✅ Simple dev login (test/test123)
3. ✅ Basic error logging (so you see crashes)

### P1 (Important - Week 2-3)
4. ✅ Teacher dashboard (view student progress)
5. ✅ Student list with basic stats
6. ✅ Achievement tracking

### P2 (Nice to Have - Week 4-5)
7. ✅ Email notifications (achievement alerts)
8. ✅ Weekly progress reports
9. ✅ Parent dashboard (same as teacher)
10. ✅ Export to CSV

---

## 💡 RECOMMENDATIONS

### Start Small, Iterate Fast
1. **Week 1:** Deploy free access system to your 15 students
2. **Week 2:** Add basic dashboard so you can monitor them
3. **Week 3:** Get feedback from students on what's confusing
4. **Week 4:** Add email notifications for yourself
5. **Week 5:** Polish based on real usage data

### Use Your Students as Beta Testers
- They'll find bugs faster than you ever could
- Their feedback is invaluable for UI/UX
- They're motivated (it's their game!)

### Keep It Simple
- Don't over-engineer the dashboard
- Focus on: "Is the student engaged? Are they learning?"
- Fancy charts can come later

---

**You now have a complete specification for teacher/parent dashboards with free access, easy testing, error logging, and email notifications!** 🎉

**Next steps:** Review this spec, prioritize features, and start building Week 1 (free access system).
