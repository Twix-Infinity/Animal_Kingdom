import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Animal = {
  id: string;
  name: string;
  type: 'cow' | 'pig' | 'chicken';
  pen_location: string;
  age_months: number;
  weight_kg: number;
  health_status: 'healthy' | 'monitoring' | 'sick' | 'critical';
  last_checked: string;
  created_at: string;
};

export type HealthAlert = {
  id: string;
  animal_id: string;
  alert_type: 'posture_change' | 'lethargy' | 'coughing' | 'pecking_pattern' | 'abnormal_movement' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  confidence_score: number;
  video_url: string | null;
  detected_at: string;
  resolved: boolean;
  resolved_at: string | null;
  notes: string;
  created_at: string;
};

export type VideoAnalysis = {
  id: string;
  animal_id: string;
  video_url: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  duration_seconds: number;
  behaviors_detected: any[];
  anomalies_found: number;
  processed_at: string | null;
  created_at: string;
};
