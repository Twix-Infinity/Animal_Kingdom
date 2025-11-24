/*
  # Add Public Access Policies

  1. Changes
    - Add public access policies for anon role to all tables
    - This allows the frontend to read and write data without authentication
    - Suitable for demo/development purposes

  2. Security
    - Policies allow anon (public) users to perform all operations
    - In production, these should be replaced with proper authentication-based policies
*/

-- RLS Policies for animals table (anon/public access)
CREATE POLICY "Public users can view animals"
  ON animals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public users can insert animals"
  ON animals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public users can update animals"
  ON animals FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete animals"
  ON animals FOR DELETE
  TO anon
  USING (true);

-- RLS Policies for health_alerts table (anon/public access)
CREATE POLICY "Public users can view health alerts"
  ON health_alerts FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public users can insert health alerts"
  ON health_alerts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public users can update health alerts"
  ON health_alerts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete health alerts"
  ON health_alerts FOR DELETE
  TO anon
  USING (true);

-- RLS Policies for video_analyses table (anon/public access)
CREATE POLICY "Public users can view video analyses"
  ON video_analyses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public users can insert video analyses"
  ON video_analyses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public users can update video analyses"
  ON video_analyses FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public users can delete video analyses"
  ON video_analyses FOR DELETE
  TO anon
  USING (true);