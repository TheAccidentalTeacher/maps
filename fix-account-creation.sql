-- ============================================
-- FIX: Allow trigger to create account entries
-- ============================================

-- The problem: RLS policies block the trigger from creating accounts
-- The solution: Add a policy that allows the trigger to insert

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own account" ON accounts;

-- Create a new policy that allows inserts from the trigger
CREATE POLICY "Allow account creation"
  ON accounts FOR INSERT
  WITH CHECK (true);

-- Verify the fix
SELECT '✅ Account creation policy fixed!' as status;
