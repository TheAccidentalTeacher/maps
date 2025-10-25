-- ============================================
-- NUCLEAR OPTION: Temporarily Disable RLS for Testing
-- ============================================

-- Drop ALL policies on accounts table
DROP POLICY IF EXISTS "teachers_can_view_all_students" ON accounts;
DROP POLICY IF EXISTS "teachers_and_students_access" ON accounts;
DROP POLICY IF EXISTS "Allow account creation" ON accounts;
DROP POLICY IF EXISTS "Users can update own account" ON accounts;
DROP POLICY IF EXISTS "Users can view own account" ON accounts;

-- Disable RLS entirely for now (we'll re-enable properly later)
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'accounts';
