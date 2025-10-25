-- FIX ACCOUNT TYPE CONSTRAINT TO SUPPORT BOTH CLASSROOM AND SAAS
-- This allows 'student' accounts (for classroom) AND 'parent' accounts (for SaaS)

-- 1. Drop the old constraint
ALTER TABLE accounts 
DROP CONSTRAINT IF EXISTS accounts_account_type_check;

-- 2. Add new constraint that supports ALL user types
ALTER TABLE accounts 
ADD CONSTRAINT accounts_account_type_check 
CHECK (account_type = ANY (ARRAY['teacher', 'student', 'parent', 'admin']));

-- 3. Verify it worked
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'accounts_account_type_check';

-- 4. Now insert your GI Joe test students
INSERT INTO accounts (auth_user_id, full_name, email, account_type, created_at, updated_at)
VALUES
    (gen_random_uuid(), 'Duke Hauser', 'duke@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Scarlett O''Hara', 'scarlett@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Snake Eyes', 'snakeeyes@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Roadblock Hinton', 'roadblock@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Lady Jaye Burnett', 'ladyjaye@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Flint Fairborne', 'flint@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Gung-Ho Rocco', 'gungho@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Shipwreck Hector', 'shipwreck@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Bazooka David', 'bazooka@gijoe.test', 'student', NOW(), NOW()),
    (gen_random_uuid(), 'Quick Kick MacArthur', 'quickkick@gijoe.test', 'student', NOW(), NOW());

-- 5. Verify students were created
SELECT full_name, email, account_type, created_at 
FROM accounts 
WHERE account_type = 'student'
ORDER BY created_at DESC
LIMIT 10;
