/*
  # Add Foreign Key Index

  1. Changes
    - Add index on video_analyses.animal_id to improve foreign key query performance
    - This index supports JOIN operations and foreign key lookups

  2. Performance
    - Improves query performance for joins between video_analyses and animals tables
    - Optimizes foreign key constraint checks
*/

-- Add index for the foreign key on video_analyses.animal_id
CREATE INDEX IF NOT EXISTS idx_video_analyses_animal_id ON public.video_analyses(animal_id);
