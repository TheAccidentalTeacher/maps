-- Check if ocean species discoveries are being saved to database
-- Run this in Supabase SQL Editor

-- See all discoveries with photo data
SELECT 
    species_name,
    photo_url,
    photo_photographer,
    photo_source,
    ai_fun_fact,
    discovered_at_depth,
    discovered_at_zone,
    discovery_timestamp
FROM ocean_species_discoveries
ORDER BY discovery_timestamp DESC
LIMIT 10;

-- Count total discoveries per user
SELECT 
    user_account_id,
    COUNT(*) as total_discoveries,
    COUNT(photo_url) as discoveries_with_photos,
    COUNT(ai_fun_fact) as discoveries_with_ai_facts
FROM ocean_species_discoveries
GROUP BY user_account_id;
