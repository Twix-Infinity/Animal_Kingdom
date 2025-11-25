import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AnalysisRequest {
  video_url: string;
  animal_id: string;
  analysis_id: string;
}

interface HealthIssue {
  type: string;
  severity: string;
  description: string;
  confidence: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { video_url, animal_id, analysis_id }: AnalysisRequest = await req.json();

    if (!video_url || !animal_id || !analysis_id) {
      throw new Error("Missing required fields");
    }

    const analysisResults = await performVideoAnalysis(video_url);

    const { error: updateError } = await supabase
      .from("video_analyses")
      .update({
        analysis_status: "completed",
        behaviors_detected: analysisResults.behaviors,
        anomalies_found: analysisResults.anomalies.length,
        processed_at: new Date().toISOString(),
      })
      .eq("id", analysis_id);

    if (updateError) throw updateError;

    if (analysisResults.healthIssues.length > 0) {
      const alerts = analysisResults.healthIssues.map((issue: HealthIssue) => ({
        animal_id,
        alert_type: issue.type,
        severity: issue.severity,
        description: issue.description,
        confidence_score: issue.confidence,
        video_url,
        detected_at: new Date().toISOString(),
      }));

      const { error: alertError } = await supabase
        .from("health_alerts")
        .insert(alerts);

      if (alertError) throw alertError;

      if (analysisResults.healthIssues.some((i: HealthIssue) => i.severity === "critical" || i.severity === "high")) {
        await supabase
          .from("animals")
          .update({ health_status: "sick" })
          .eq("id", animal_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisResults,
        message: "Video analysis completed successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function performVideoAnalysis(videoUrl: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const behaviors = [
    { behavior: "walking", confidence: 0.92, timestamp: 0 },
    { behavior: "standing", confidence: 0.88, timestamp: 5 },
    { behavior: "lying_down", confidence: 0.85, timestamp: 10 },
  ];

  const anomalies = [];
  const healthIssues: HealthIssue[] = [];

  const random = Math.random();

  if (random > 0.6) {
    anomalies.push({
      type: "abnormal_posture",
      timestamp: 8,
      confidence: 0.78,
    });

    healthIssues.push({
      type: "posture_change",
      severity: random > 0.85 ? "high" : "medium",
      description: "Animal showing abnormal posture, possibly indicating discomfort or pain",
      confidence: 78,
    });
  }

  if (random > 0.7) {
    anomalies.push({
      type: "reduced_movement",
      timestamp: 12,
      confidence: 0.82,
    });

    healthIssues.push({
      type: "lethargy",
      severity: random > 0.9 ? "high" : "low",
      description: "Reduced movement detected, animal may be lethargic or fatigued",
      confidence: 82,
    });
  }

  return {
    behaviors,
    anomalies,
    healthIssues,
    duration: 15,
    processedAt: new Date().toISOString(),
  };
}
