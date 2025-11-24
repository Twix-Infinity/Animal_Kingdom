/*
  # Farm Animal Health Monitoring System

  1. New Tables
    - `animals`
      - `id` (uuid, primary key)
      - `name` (text) - Animal identifier/name
      - `type` (text) - Animal type: cow, pig, chicken
      - `pen_location` (text) - Location in farm
      - `age_months` (integer) - Age in months
      - `weight_kg` (numeric) - Current weight
      - `health_status` (text) - Current health status: healthy, monitoring, sick, critical
      - `last_checked` (timestamptz) - Last analysis timestamp
      - `created_at` (timestamptz)
    
    - `health_alerts`
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key) - Reference to animals table
      - `alert_type` (text) - Type: posture_change, lethargy, coughing, pecking_pattern, abnormal_movement
      - `severity` (text) - Severity level: low, medium, high, critical
      - `description` (text) - Detailed description of the alert
      - `confidence_score` (numeric) - AI confidence score (0-100)
      - `video_url` (text) - URL to the analyzed video
      - `detected_at` (timestamptz) - When the issue was detected
      - `resolved` (boolean) - Whether alert has been addressed
      - `resolved_at` (timestamptz) - When alert was resolved
      - `notes` (text) - Veterinarian or handler notes
      - `created_at` (timestamptz)
    
    - `video_analyses`
      - `id` (uuid, primary key)
      - `animal_id` (uuid, foreign key) - Reference to animals table
      - `video_url` (text) - URL to the video
      - `analysis_status` (text) - Status: pending, processing, completed, failed
      - `duration_seconds` (integer) - Video duration
      - `behaviors_detected` (jsonb) - JSON array of detected behaviors
      - `anomalies_found` (integer) - Number of anomalies detected
      - `processed_at` (timestamptz) - When analysis completed
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage all data
    - This is a farm management system where authenticated users should have full access

  3. Indexes
    - Add indexes for efficient querying by animal type, health status, and alert severity
    - Add index for timestamp-based queries

  4. Important Notes
    - Health alerts use confidence scores to indicate AI certainty
    - Video analyses store behaviors as JSONB for flexible data structure
    - All timestamps use timestamptz for timezone awareness
    - Default values ensure data integrity
*/

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('cow', 'pig', 'chicken')),
  pen_location text NOT NULL,
  age_months integer DEFAULT 0,
  weight_kg numeric DEFAULT 0,
  health_status text DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'monitoring', 'sick', 'critical')),
  last_checked timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create health_alerts table
CREATE TABLE IF NOT EXISTS health_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('posture_change', 'lethargy', 'coughing', 'pecking_pattern', 'abnormal_movement', 'other')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  confidence_score numeric NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  video_url text,
  detected_at timestamptz DEFAULT now(),
  resolved boolean DEFAULT false,
  resolved_at timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create video_analyses table
CREATE TABLE IF NOT EXISTS video_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id uuid REFERENCES animals(id) ON DELETE CASCADE,
  video_url text NOT NULL,
  analysis_status text DEFAULT 'pending' CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  duration_seconds integer DEFAULT 0,
  behaviors_detected jsonb DEFAULT '[]'::jsonb,
  anomalies_found integer DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_health_status ON animals(health_status);
CREATE INDEX IF NOT EXISTS idx_health_alerts_animal_id ON health_alerts(animal_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_severity ON health_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_health_alerts_resolved ON health_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_health_alerts_detected_at ON health_alerts(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_analyses_animal_id ON video_analyses(animal_id);
CREATE INDEX IF NOT EXISTS idx_video_analyses_status ON video_analyses(analysis_status);

-- Enable Row Level Security
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for animals table
CREATE POLICY "Authenticated users can view animals"
  ON animals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert animals"
  ON animals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update animals"
  ON animals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete animals"
  ON animals FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for health_alerts table
CREATE POLICY "Authenticated users can view health alerts"
  ON health_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert health alerts"
  ON health_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update health alerts"
  ON health_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete health alerts"
  ON health_alerts FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for video_analyses table
CREATE POLICY "Authenticated users can view video analyses"
  ON video_analyses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert video analyses"
  ON video_analyses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update video analyses"
  ON video_analyses FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete video analyses"
  ON video_analyses FOR DELETE
  TO authenticated
  USING (true);