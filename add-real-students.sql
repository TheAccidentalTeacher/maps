-- ============================================
-- ADD 40 REAL ALASKA STUDENT ACCOUNTS
-- ============================================
-- Run this in Supabase SQL Editor
-- These will be REAL student accounts with proper auth
-- ============================================

-- Step 1: First, let's see what students already exist in auth.users
-- This will show us the 40 students that were created during initial setup
SELECT 
    id as auth_user_id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
WHERE email LIKE '%@student.mrsomers.com'
ORDER BY email;

-- Step 2: Now let's check if they have accounts in the accounts table
SELECT 
    a.id,
    a.auth_user_id,
    a.full_name,
    a.email,
    a.account_type,
    a.created_at
FROM accounts a
WHERE a.email LIKE '%@student.mrsomers.com'
ORDER BY a.email;

-- Step 3: LINK existing auth.users to accounts table
-- This creates accounts for students that exist in auth but not in accounts
INSERT INTO accounts (auth_user_id, full_name, email, account_type, created_at, updated_at)
SELECT 
    u.id as auth_user_id,
    SPLIT_PART(u.email, '@', 1) as full_name, -- Use email prefix as name (you can update later)
    u.email,
    'student' as account_type,
    u.created_at,
    NOW() as updated_at
FROM auth.users u
LEFT JOIN accounts a ON u.id = a.auth_user_id
WHERE u.email LIKE '%@student.mrsomers.com'
  AND a.id IS NULL; -- Only insert if they don't already have an account

-- Step 4: Verify all students now have accounts
SELECT 
    COUNT(*) as total_real_students
FROM accounts
WHERE email LIKE '%@student.mrsomers.com';

-- Step 5: Link your teacher account to all students
-- First, get your teacher account ID
SELECT id, full_name, email, account_type 
FROM accounts 
WHERE account_type = 'teacher'
  AND email = 'scosom@gmail.com';

-- Step 6: Create teacher-student relationships
-- ✅ Your teacher ID has been inserted below
INSERT INTO teacher_students (teacher_id, student_id, class_name, school_year)
SELECT 
    '67d2cb61-934a-4909-a2e3-3dd58e9bb38c'::uuid as teacher_id,  -- ✅ Your teacher account
    a.id as student_id,
    '7th Grade Geography - Alaska' as class_name,
    '2024-2025' as school_year
FROM accounts a
WHERE a.account_type = 'student'
  AND a.email LIKE '%@student.mrsomers.com'
ON CONFLICT (teacher_id, student_id) DO NOTHING;

-- Step 7: Initialize game_progress for all students
-- This ensures every student has a progress record ready
INSERT INTO game_progress (user_account_id, total_xp, locations_visited, countries_unlocked, achievements, current_streak_days, longest_streak_days, created_at, updated_at)
SELECT 
    a.id as user_account_id,
    0 as total_xp,
    '[]'::jsonb as locations_visited,
    '[]'::jsonb as countries_unlocked,
    '[]'::jsonb as achievements,
    0 as current_streak_days,
    0 as longest_streak_days,
    NOW() as created_at,
    NOW() as updated_at
FROM accounts a
LEFT JOIN game_progress gp ON a.id = gp.user_account_id
WHERE a.account_type = 'student'
  AND gp.id IS NULL; -- Only create if they don't already have progress

-- Step 8: FINAL VERIFICATION - Show complete student list
SELECT 
    a.full_name,
    a.email,
    a.account_type,
    CASE WHEN a.auth_user_id IS NOT NULL THEN '✅' ELSE '❌' END as has_auth,
    CASE WHEN gp.id IS NOT NULL THEN '✅' ELSE '❌' END as has_progress,
    COALESCE(gp.total_xp, 0) as xp,
    COALESCE(jsonb_array_length(gp.locations_visited), 0) as locations_visited,
    COALESCE(jsonb_array_length(gp.achievements), 0) as achievements,
    a.created_at as joined_date
FROM accounts a
LEFT JOIN game_progress gp ON a.id = gp.user_account_id
WHERE a.account_type = 'student'
ORDER BY a.email;

-- Step 9: Summary counts
SELECT 
    'Total Students' as metric,
    COUNT(*) as count
FROM accounts
WHERE account_type = 'student'
UNION ALL
SELECT 
    'Students with Auth' as metric,
    COUNT(*) as count
FROM accounts
WHERE account_type = 'student' AND auth_user_id IS NOT NULL
UNION ALL
SELECT 
    'Students with Progress' as metric,
    COUNT(*) as count
FROM accounts a
INNER JOIN game_progress gp ON a.id = gp.user_account_id
WHERE a.account_type = 'student'
UNION ALL
SELECT 
    'GI Joe Test Students' as metric,
    COUNT(*) as count
FROM accounts
WHERE account_type = 'student' AND auth_user_id IS NULL;

-- ============================================
-- OPTIONAL: Update student names from email to real names
-- ============================================
-- Run these one at a time, replacing with real student names
-- Example:
-- UPDATE accounts 
-- SET full_name = 'John Smith' 
-- WHERE email = 'kalayabo@student.mrsomers.com';
