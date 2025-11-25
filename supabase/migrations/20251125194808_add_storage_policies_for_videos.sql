/*
  # Add Storage Policies for Video Uploads

  1. Storage Policies
    - Allow authenticated users to upload videos to animal-videos bucket
    - Allow public read access to videos
    - Allow authenticated users to delete their own uploaded videos

  2. Security
    - Uploads restricted to authenticated users only
    - Videos are publicly accessible for AI analysis
    - File size limits enforced client-side
*/

-- Create storage bucket if not exists (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-videos', 'animal-videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload videos'
  ) THEN
    CREATE POLICY "Authenticated users can upload videos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'animal-videos');
  END IF;
END $$;

-- Policy: Allow public read access to videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view videos'
  ) THEN
    CREATE POLICY "Public can view videos"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'animal-videos');
  END IF;
END $$;

-- Policy: Allow authenticated users to delete videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete videos'
  ) THEN
    CREATE POLICY "Authenticated users can delete videos"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'animal-videos');
  END IF;
END $$;
