-- ============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Geographic Detective Academy - SaaS Platform
-- Created: October 20, 2025
-- ============================================

-- This script creates ALL tables needed for the SaaS platform:
-- 1. accounts (teachers/parents)
-- 2. profiles (students)
-- 3. game_progress (game state tracking)
-- 4. achievements (unlocked achievements)
-- 5. error_logs (error tracking)

-- Run this entire script in Supabase SQL Editor!

-- ============================================
-- STEP 1: DROP TEST TABLE (cleanup)
-- ============================================

DROP TABLE IF EXISTS test_connection CASCADE;

-- ============================================
-- STEP 2: CREATE ACCOUNTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS accounts (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Auth integration (links to Supabase Auth)
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic info
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  account_type TEXT NOT NULL CHECK (account_type IN ('teacher', 'parent', 'admin')),
  
  -- Organization
  organization_name TEXT,
  organization_type TEXT CHECK (organization_type IN ('school', 'homeschool', 'tutoring', 'other')),
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'teacher', 'school', 'district')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trial')),
  stripe_customer_id TEXT UNIQUE,
  
  -- Free access management (for your 15 Alaska students!)
  free_access_granted BOOLEAN DEFAULT false,
  free_access_reason TEXT,
  free_access_granted_by UUID REFERENCES accounts(id),
  free_access_granted_at TIMESTAMPTZ,
  
  -- Settings
  email_notifications BOOLEAN DEFAULT true,
  achievement_emails BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT false,
  
  -- FERPA compliance
  ferpa_acknowledgment BOOLEAN DEFAULT false,
  ferpa_acknowledged_at TIMESTAMPTZ,
  terms_accepted BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_auth_user_id ON accounts(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_accounts_subscription_tier ON accounts(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_accounts_stripe_customer_id ON accounts(stripe_customer_id);

-- ============================================
-- STEP 3: CREATE PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership (which teacher/parent owns this student)
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Student info (NO last names or identifying info - FERPA!)
  student_name TEXT NOT NULL,
  display_name TEXT,
  avatar_emoji TEXT DEFAULT '🎓',
  grade_level TEXT,
  
  -- Game settings
  difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')),
  fun_mode_enabled BOOLEAN DEFAULT false,
  gen_alpha_style BOOLEAN DEFAULT false,
  
  -- Privacy settings
  profile_visible BOOLEAN DEFAULT true,
  show_on_leaderboard BOOLEAN DEFAULT true,
  
  -- Current game state
  current_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  total_locations_explored INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,
  
  -- Constraint: student_name cannot be empty
  CONSTRAINT student_name_not_empty CHECK (length(trim(student_name)) > 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_id ON profiles(account_id);
CREATE INDEX IF NOT EXISTS idx_profiles_student_name ON profiles(student_name);
CREATE INDEX IF NOT EXISTS idx_profiles_current_xp ON profiles(current_xp);
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON profiles(last_active_at);

-- ============================================
-- STEP 4: CREATE GAME_PROGRESS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS game_progress (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links to profile
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Game mode tracking
  game_mode TEXT NOT NULL CHECK (game_mode IN (
    'free_explore', 
    'mystery_challenge', 
    'scavenger_hunt', 
    'guess_location', 
    'missions', 
    'create_heist', 
    'alaska_adventure'
  )),
  
  -- Progress data (stored as JSONB for flexibility)
  progress_data JSONB DEFAULT '{}',
  
  -- Stats
  locations_explored INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  
  -- State
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_progress_profile_id ON game_progress(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_game_mode ON game_progress(game_mode);
CREATE INDEX IF NOT EXISTS idx_game_progress_is_completed ON game_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_game_progress_created_at ON game_progress(created_at);

-- ============================================
-- STEP 5: CREATE ACHIEVEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Links to profile
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Achievement info
  achievement_id TEXT NOT NULL, -- e.g., 'first_explorer', 'alaska_master'
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  achievement_icon TEXT DEFAULT '🏆',
  achievement_category TEXT, -- e.g., 'exploration', 'mastery', 'speed'
  
  -- Unlock details
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  unlock_location TEXT, -- e.g., 'Alaska', 'Antarctica'
  unlock_context JSONB, -- Additional data about how it was unlocked
  
  -- XP reward
  xp_awarded INTEGER DEFAULT 0,
  
  -- Notification
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMPTZ,
  
  -- Constraint: unique achievement per profile
  UNIQUE(profile_id, achievement_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_profile_id ON achievements(profile_id);
CREATE INDEX IF NOT EXISTS idx_achievements_achievement_id ON achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked_at ON achievements(unlocked_at);
CREATE INDEX IF NOT EXISTS idx_achievements_notification_sent ON achievements(notification_sent);

-- ============================================
-- STEP 6: CREATE ERROR_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS error_logs (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User context (optional - may be null for unauthenticated errors)
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  
  -- Error details
  error_type TEXT NOT NULL, -- e.g., 'api_error', 'validation_error', 'network_error'
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_code TEXT,
  
  -- Context
  game_mode TEXT,
  user_action TEXT, -- What the user was trying to do
  browser_info TEXT,
  device_info TEXT,
  
  -- Additional data
  metadata JSONB DEFAULT '{}',
  
  -- Resolution
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES accounts(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_error_logs_profile_id ON error_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_account_id ON error_logs(account_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_is_resolved ON error_logs(is_resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);

-- ============================================
-- STEP 7: AUTO-UPDATE TIMESTAMP FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at column
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_progress_updated_at ON game_progress;
CREATE TRIGGER update_game_progress_updated_at
  BEFORE UPDATE ON game_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 8: ROW LEVEL SECURITY (FERPA COMPLIANCE!)
-- ============================================

-- ACCOUNTS TABLE
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own account" ON accounts;
CREATE POLICY "Users can view own account"
  ON accounts FOR SELECT
  USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update own account" ON accounts;
CREATE POLICY "Users can update own account"
  ON accounts FOR UPDATE
  USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can insert own account" ON accounts;
CREATE POLICY "Users can insert own account"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- PROFILES TABLE
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profiles" ON profiles;
CREATE POLICY "Users can view own profiles"
  ON profiles FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create own profiles" ON profiles;
CREATE POLICY "Users can create own profiles"
  ON profiles FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update own profiles" ON profiles;
CREATE POLICY "Users can update own profiles"
  ON profiles FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete own profiles" ON profiles;
CREATE POLICY "Users can delete own profiles"
  ON profiles FOR DELETE
  USING (account_id IN (
    SELECT id FROM accounts WHERE auth_user_id = auth.uid()
  ));

-- GAME_PROGRESS TABLE
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own game progress" ON game_progress;
CREATE POLICY "Users can view own game progress"
  ON game_progress FOR SELECT
  USING (profile_id IN (
    SELECT p.id FROM profiles p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert own game progress" ON game_progress;
CREATE POLICY "Users can insert own game progress"
  ON game_progress FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT p.id FROM profiles p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update own game progress" ON game_progress;
CREATE POLICY "Users can update own game progress"
  ON game_progress FOR UPDATE
  USING (profile_id IN (
    SELECT p.id FROM profiles p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.auth_user_id = auth.uid()
  ));

-- ACHIEVEMENTS TABLE
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  USING (profile_id IN (
    SELECT p.id FROM profiles p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;
CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT p.id FROM profiles p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.auth_user_id = auth.uid()
  ));

-- ERROR_LOGS TABLE
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own error logs" ON error_logs;
CREATE POLICY "Users can view own error logs"
  ON error_logs FOR SELECT
  USING (
    account_id IN (
      SELECT id FROM accounts WHERE auth_user_id = auth.uid()
    )
    OR profile_id IN (
      SELECT p.id FROM profiles p
      JOIN accounts a ON p.account_id = a.id
      WHERE a.auth_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can insert error logs" ON error_logs;
CREATE POLICY "Anyone can insert error logs"
  ON error_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- STEP 9: CREATE HELPER FUNCTION FOR ACCOUNT CREATION
-- ============================================

CREATE OR REPLACE FUNCTION create_account_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO accounts (auth_user_id, email, full_name, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'teacher')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create account when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_account_on_signup();

-- ============================================
-- STEP 10: VERIFY SETUP
-- ============================================

-- List all tables
SELECT 
  '✅ Tables created:' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';

-- Show table names
SELECT 
  table_name as "✅ Table Name",
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as "Column Count"
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT '🎉 DATABASE SETUP COMPLETE! 🎉' as "STATUS",
       '5 tables created with Row Level Security enabled' as "DETAILS",
       'accounts, profiles, game_progress, achievements, error_logs' as "TABLES";
