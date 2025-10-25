-- Create Test Students - GI Joe Characters
-- Run this in Supabase SQL Editor
-- These will appear in the Teacher Dashboard immediately

-- First, create auth users (you'll need to do this manually in Supabase Auth UI)
-- Or we can just create accounts table entries with dummy auth_user_ids

-- For now, let's insert directly into accounts table with generated UUIDs
-- These won't have auth login capability but will show in dashboard

INSERT INTO accounts (auth_user_id, full_name, account_type, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Duke Hauser', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Scarlett O''Hara', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Snake Eyes', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Roadblock Hinton', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Lady Jaye Burnett', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Flint Fairborne', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Gung-Ho Rocco', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Shipwreck Hector', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Bazooka David', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Quick Kick MacArthur', 'student', NOW(), NOW());

-- Verify they were created
SELECT full_name, account_type, created_at 
FROM accounts 
WHERE account_type = 'student'
ORDER BY created_at DESC
LIMIT 10;
