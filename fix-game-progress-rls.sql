-- ============================================
-- FIX GAME_PROGRESS RLS FOR ACCOUNT-BASED MODEL
-- ============================================
-- Context:
-- The app reads/writes public.game_progress using column `user_account_id`
-- that points to public.accounts(id). Current RLS policies in prod appear to
-- reference an older schema that used `profile_id`, which causes 403 errors
-- (code 42501: new row violates row-level security policy) on INSERT/UPSERT
-- and 406/403 on SELECTs.
--
-- This script aligns RLS with the current schema so that an authenticated user
-- can SELECT/INSERT/UPDATE ONLY their own game_progress row, identified by the
-- mapping accounts.id = game_progress.user_account_id AND
-- accounts.auth_user_id = auth.uid().
-- ============================================

-- Safety: ensure the table exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'game_progress'
  ) THEN
    RAISE EXCEPTION 'Table public.game_progress does not exist. Aborting.';
  END IF;
END $$;

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

-- Drop any old profile-based policies if present
DROP POLICY IF EXISTS "Users can view own game progress" ON public.game_progress;
DROP POLICY IF EXISTS "Users can insert own game progress" ON public.game_progress;
DROP POLICY IF EXISTS "Users can update own game progress" ON public.game_progress;
DROP POLICY IF EXISTS users_own_progress ON public.game_progress;
DROP POLICY IF EXISTS users_update_own_progress ON public.game_progress;
DROP POLICY IF EXISTS users_insert_own_progress ON public.game_progress;

-- Drop our new policies if they exist (allows re-running this script)
DROP POLICY IF EXISTS "gp_select_own_by_account" ON public.game_progress;
DROP POLICY IF EXISTS "gp_insert_own_by_account" ON public.game_progress;
DROP POLICY IF EXISTS "gp_update_own_by_account" ON public.game_progress;

-- Create hybrid policies (supports both user_account_id and child_profile_id)
-- 1) SELECT: user can read their own row OR their child's row
CREATE POLICY "gp_select_own_by_account" ON public.game_progress
  FOR SELECT
  USING (
    -- Direct account access
    (user_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = public.game_progress.user_account_id
        AND a.auth_user_id = auth.uid()
    ))
    OR
    -- Child profile access (if child_profiles table exists)
    (child_profile_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.child_profiles cp
      JOIN public.accounts a ON cp.parent_account_id = a.id
      WHERE cp.id = public.game_progress.child_profile_id
        AND a.auth_user_id = auth.uid()
    ))
  );

-- 2) INSERT: user can create their own row OR their child's row
CREATE POLICY "gp_insert_own_by_account" ON public.game_progress
  FOR INSERT
  WITH CHECK (
    -- Direct account access
    (user_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = public.game_progress.user_account_id
        AND a.auth_user_id = auth.uid()
    ))
    OR
    -- Child profile access (if child_profiles table exists)
    (child_profile_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.child_profiles cp
      JOIN public.accounts a ON cp.parent_account_id = a.id
      WHERE cp.id = public.game_progress.child_profile_id
        AND a.auth_user_id = auth.uid()
    ))
  );

-- 3) UPDATE: user can update their own row OR their child's row
CREATE POLICY "gp_update_own_by_account" ON public.game_progress
  FOR UPDATE
  USING (
    -- Direct account access
    (user_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = public.game_progress.user_account_id
        AND a.auth_user_id = auth.uid()
    ))
    OR
    -- Child profile access (if child_profiles table exists)
    (child_profile_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.child_profiles cp
      JOIN public.accounts a ON cp.parent_account_id = a.id
      WHERE cp.id = public.game_progress.child_profile_id
        AND a.auth_user_id = auth.uid()
    ))
  )
  WITH CHECK (
    -- Direct account access
    (user_account_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.accounts a
      WHERE a.id = public.game_progress.user_account_id
        AND a.auth_user_id = auth.uid()
    ))
    OR
    -- Child profile access (if child_profiles table exists)
    (child_profile_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.child_profiles cp
      JOIN public.accounts a ON cp.parent_account_id = a.id
      WHERE cp.id = public.game_progress.child_profile_id
        AND a.auth_user_id = auth.uid()
    ))
  );

-- Ensure UPSERT works by enforcing one row per account (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.game_progress'::regclass
      AND conname = 'game_progress_user_account_id_key'
  ) THEN
    ALTER TABLE public.game_progress
      ADD CONSTRAINT game_progress_user_account_id_key UNIQUE (user_account_id);
  END IF;
END $$;

-- Optional: normalize timestamps on update
-- (Only creates the trigger/function if not present)
DO $$ 
DECLARE
  func_exists boolean;
  trig_exists boolean;
BEGIN
  -- Check if function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'set_game_progress_updated_at'
  ) INTO func_exists;
  
  IF NOT func_exists THEN
    CREATE OR REPLACE FUNCTION public.set_game_progress_updated_at()
    RETURNS trigger AS $func$
    BEGIN
      NEW.updated_at := NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
  END IF;

  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_set_game_progress_updated_at'
  ) INTO trig_exists;
  
  IF NOT trig_exists THEN
    CREATE TRIGGER trg_set_game_progress_updated_at
      BEFORE UPDATE ON public.game_progress
      FOR EACH ROW EXECUTE FUNCTION public.set_game_progress_updated_at();
  END IF;
END $$;

-- Verification helpers (read-only)
-- 1) Show policies now active on game_progress
SELECT schemaname, tablename, policyname, cmd, qual AS using_expr, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'game_progress'
ORDER BY policyname;

-- 2) Show unique constraints on game_progress
SELECT conname AS constraint_name, contype AS type
FROM pg_constraint
WHERE conrelid = 'public.game_progress'::regclass AND contype = 'u';

-- 3) Quick glance at structure (columns)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'game_progress'
ORDER BY ordinal_position;

-- ============================================
-- After running:
--  - Try again in the app: it should SELECT/UPSERT without 403/406
--  - Cloud sync auto-save every 30s should succeed
-- ============================================
