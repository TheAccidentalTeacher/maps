-- ============================================
-- FIX: Add unique constraint for cloud sync
-- ============================================
-- The UPSERT operation needs a unique constraint to work
-- This ensures each user has only ONE progress record

-- Add unique constraint on user_account_id
ALTER TABLE game_progress
ADD CONSTRAINT game_progress_user_account_id_key 
UNIQUE (user_account_id);

-- Verify the constraint was added
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint
WHERE conrelid = 'game_progress'::regclass
AND conname = 'game_progress_user_account_id_key';
