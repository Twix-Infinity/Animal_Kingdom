/*
  # Remove Unused Indexes

  1. Changes
    - Remove unused indexes from animals table
    - Remove unused indexes from health_alerts table
    - Remove unused indexes from video_analyses table
    - These indexes were not being utilized by queries

  2. Performance
    - Reduces database maintenance overhead
    - Frees up storage space
    - Improves write performance by reducing index updates
*/

-- Remove unused indexes from animals table
DROP INDEX IF EXISTS idx_animals_type;
DROP INDEX IF EXISTS idx_animals_health_status;

-- Remove unused indexes from health_alerts table
DROP INDEX IF EXISTS idx_health_alerts_severity;
DROP INDEX IF EXISTS idx_health_alerts_resolved;

-- Remove unused indexes from video_analyses table
DROP INDEX IF EXISTS idx_video_analyses_animal_id;
DROP INDEX IF EXISTS idx_video_analyses_status;
