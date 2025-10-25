-- ============================================
-- OCEAN EXPLORER SPECIES DISCOVERIES
-- Save each student's personal ocean catalog
-- ============================================

-- Create table for species discoveries with photos and AI facts
CREATE TABLE IF NOT EXISTS ocean_species_discoveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    child_profile_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
    species_id INTEGER NOT NULL,
    species_name TEXT NOT NULL,
    
    -- Photo data
    photo_url TEXT,
    photo_thumbnail TEXT,
    photo_photographer TEXT,
    photo_photographer_url TEXT,
    photo_source TEXT, -- 'unsplash' or 'pexels'
    
    -- AI-generated facts
    ai_fun_fact TEXT,
    ai_habitat TEXT,
    ai_diet TEXT,
    ai_conservation_status TEXT,
    ai_interesting_behavior TEXT,
    
    -- Discovery metadata
    discovered_at_depth INTEGER,
    discovered_at_zone TEXT, -- 'sunlight', 'twilight', 'midnight'
    discovery_timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK ((user_account_id IS NOT NULL) OR (child_profile_id IS NOT NULL)),
    UNIQUE(user_account_id, species_id),
    UNIQUE(child_profile_id, species_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_ocean_discoveries_user ON ocean_species_discoveries(user_account_id);
CREATE INDEX IF NOT EXISTS idx_ocean_discoveries_child ON ocean_species_discoveries(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_ocean_discoveries_species ON ocean_species_discoveries(species_id);
CREATE INDEX IF NOT EXISTS idx_ocean_discoveries_timestamp ON ocean_species_discoveries(discovery_timestamp DESC);

-- Enable RLS
ALTER TABLE ocean_species_discoveries ENABLE ROW LEVEL SECURITY;

-- Students can see their own discoveries
CREATE POLICY "Students can view own discoveries"
ON ocean_species_discoveries
FOR SELECT
USING (
    auth.uid()::text = user_account_id::text
    OR child_profile_id IN (
        SELECT id FROM child_profiles WHERE parent_account_id::text = auth.uid()::text
    )
);

-- Students can insert their own discoveries
CREATE POLICY "Students can insert own discoveries"
ON ocean_species_discoveries
FOR INSERT
WITH CHECK (
    auth.uid()::text = user_account_id::text
    OR child_profile_id IN (
        SELECT id FROM child_profiles WHERE parent_account_id::text = auth.uid()::text
    )
);

-- Students can update their own discoveries (for adding AI facts later)
CREATE POLICY "Students can update own discoveries"
ON ocean_species_discoveries
FOR UPDATE
USING (
    auth.uid()::text = user_account_id::text
    OR child_profile_id IN (
        SELECT id FROM child_profiles WHERE parent_account_id::text = auth.uid()::text
    )
);

-- Teachers can view their students' discoveries
CREATE POLICY "Teachers can view student discoveries"
ON ocean_species_discoveries
FOR SELECT
USING (
    user_account_id IN (
        SELECT student_id FROM teacher_students 
        WHERE teacher_id::text = auth.uid()::text
    )
);

COMMENT ON TABLE ocean_species_discoveries IS 'Stores each student''s personal ocean species catalog with photos and AI-generated educational content';
