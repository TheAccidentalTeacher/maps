-- ============================================
-- COMPLETE DATABASE SETUP FOR HYBRID MODEL
-- Classroom + SaaS in one system
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. FIX ACCOUNT TYPE CONSTRAINT
ALTER TABLE accounts 
DROP CONSTRAINT IF EXISTS accounts_account_type_check;

ALTER TABLE accounts 
ADD CONSTRAINT accounts_account_type_check 
CHECK (account_type = ANY (ARRAY['teacher', 'student', 'parent', 'admin']));

-- 2. CHILD PROFILES (For SaaS families)
CREATE TABLE IF NOT EXISTS child_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    child_name TEXT NOT NULL,
    age INTEGER,
    grade_level INTEGER,
    avatar_emoji TEXT DEFAULT '🎓',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_child_profiles_parent ON child_profiles(parent_account_id);

-- 3. SUBSCRIPTIONS (For SaaS billing)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    plan_type TEXT CHECK (plan_type IN ('free', 'premium', 'family', 'classroom')) DEFAULT 'free',
    status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'trial',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_account ON subscriptions(user_account_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 4. GAME PROGRESS (For both students and child profiles)
-- NOTE: This might conflict with existing game_progress table - will handle gracefully
DO $$ 
BEGIN
    -- Try to rename old table if it exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'game_progress') THEN
        ALTER TABLE game_progress RENAME TO game_progress_old;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    child_profile_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    locations_visited JSONB DEFAULT '[]'::jsonb,
    countries_unlocked JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    last_played_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CHECK ((user_account_id IS NOT NULL) OR (child_profile_id IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_game_progress_account ON game_progress(user_account_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_child ON game_progress(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_last_played ON game_progress(last_played_at DESC);

-- 5. TEACHER-STUDENT RELATIONSHIPS
CREATE TABLE IF NOT EXISTS teacher_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    student_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    class_name TEXT,
    school_year TEXT DEFAULT '2024-2025',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(teacher_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_students_teacher ON teacher_students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_students_student ON teacher_students(student_id);

-- 6. INVITE CODES (For easy classroom signup)
CREATE TABLE IF NOT EXISTS invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    created_by_teacher_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    class_name TEXT,
    max_uses INTEGER DEFAULT 30,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_teacher ON invite_codes(created_by_teacher_id);

-- 7. ACTIVITY LOG (Analytics and debugging)
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_account ON activity_log(user_account_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Child Profiles: Parents can only see their own children
CREATE POLICY "parents_own_children" ON child_profiles
    FOR ALL USING (parent_account_id = auth.uid());

-- Subscriptions: Users can only see their own
CREATE POLICY "users_own_subscription" ON subscriptions
    FOR ALL USING (user_account_id = auth.uid());

-- Game Progress: Users see own progress + parents see children's progress
CREATE POLICY "users_own_progress" ON game_progress
    FOR ALL USING (
        user_account_id = auth.uid() 
        OR child_profile_id IN (
            SELECT id FROM child_profiles WHERE parent_account_id = auth.uid()
        )
    );

-- Teacher-Students: Teachers see their students
CREATE POLICY "teachers_see_students" ON teacher_students
    FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "teachers_manage_students" ON teacher_students
    FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "teachers_update_students" ON teacher_students
    FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "teachers_delete_students" ON teacher_students
    FOR DELETE USING (teacher_id = auth.uid());

-- Invite Codes: Teachers manage their own codes
CREATE POLICY "teachers_own_invites" ON invite_codes
    FOR ALL USING (created_by_teacher_id = auth.uid());

-- Activity Log: Users see their own activity
CREATE POLICY "users_own_activity" ON activity_log
    FOR SELECT USING (user_account_id = auth.uid());

-- ============================================
-- INSERT TEST DATA (GI JOE STUDENTS)
-- ============================================

-- Temporarily allow NULL auth_user_id for test students
-- (In production, you'd create real auth users first)
ALTER TABLE accounts ALTER COLUMN auth_user_id DROP NOT NULL;

INSERT INTO accounts (auth_user_id, full_name, email, account_type, created_at, updated_at)
VALUES
    (NULL, 'Duke Hauser', 'duke@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Scarlett O''Hara', 'scarlett@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Snake Eyes', 'snakeeyes@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Roadblock Hinton', 'roadblock@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Lady Jaye Burnett', 'ladyjaye@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Flint Fairborne', 'flint@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Gung-Ho Rocco', 'gungho@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Shipwreck Hector', 'shipwreck@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Bazooka David', 'bazooka@gijoe.test', 'student', NOW(), NOW()),
    (NULL, 'Quick Kick MacArthur', 'quickkick@gijoe.test', 'student', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('accounts', 'child_profiles', 'subscriptions', 'game_progress', 'teacher_students', 'invite_codes', 'activity_log')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('accounts', 'child_profiles', 'subscriptions', 'game_progress', 'teacher_students', 'invite_codes', 'activity_log');

-- Check test students were created
SELECT full_name, email, account_type, created_at 
FROM accounts 
WHERE email LIKE '%@gijoe.test'
ORDER BY full_name;

-- Summary counts
SELECT 
    (SELECT COUNT(*) FROM accounts WHERE account_type = 'teacher') as teachers,
    (SELECT COUNT(*) FROM accounts WHERE account_type = 'student') as students,
    (SELECT COUNT(*) FROM accounts WHERE account_type = 'parent') as parents,
    (SELECT COUNT(*) FROM child_profiles) as children,
    (SELECT COUNT(*) FROM subscriptions) as subscriptions,
    (SELECT COUNT(*) FROM game_progress) as progress_records;
