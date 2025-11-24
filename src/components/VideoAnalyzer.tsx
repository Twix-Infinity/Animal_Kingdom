import { useState } from 'react';
import { Upload, AlertTriangle } from 'lucide-react';
import { supabase, type Animal } from '../lib/supabase';

type VideoAnalyzerProps = {
  animals: Animal[];
  onAnalysisComplete: () => void;
};

export default function VideoAnalyzer({ animals, onAnalysisComplete }: VideoAnalyzerProps) {
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const simulateVideoAnalysis = async (animalId: string) => {
    const behaviors = [
      { behavior: 'standing', duration: 45, normal: true },
      { behavior: 'lying_down', duration: 120, normal: true },
      { behavior: 'eating', duration: 30, normal: true },
      { behavior: 'walking', duration: 25, normal: true },
    ];

    const anomalyDetection = Math.random();
    let anomalies = 0;
    const alerts = [];

    if (anomalyDetection > 0.6) {
      anomalies = Math.floor(Math.random() * 3) + 1;

      const possibleAlerts = [
        {
          type: 'posture_change',
          severity: 'medium',
          description: 'Animal showing abnormal posture - hunched back detected',
          confidence: 78 + Math.random() * 15,
        },
        {
          type: 'lethargy',
          severity: 'high',
          description: 'Reduced movement detected - 60% less activity than baseline',
          confidence: 82 + Math.random() * 12,
        },
        {
          type: 'coughing',
          severity: 'high',
          description: 'Repeated coughing pattern detected - respiratory concern',
          confidence: 85 + Math.random() * 10,
        },
        {
          type: 'abnormal_movement',
          severity: 'medium',
          description: 'Limping detected on left rear leg',
          confidence: 75 + Math.random() * 15,
        },
      ];

      for (let i = 0; i < anomalies; i++) {
        alerts.push(possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)]);
      }
    }

    const videoAnalysis = {
      animal_id: animalId,
      video_url: videoFile ? URL.createObjectURL(videoFile) : 'simulated_video.mp4',
      analysis_status: 'completed' as const,
      duration_seconds: 180 + Math.floor(Math.random() * 120),
      behaviors_detected: behaviors,
      anomalies_found: anomalies,
      processed_at: new Date().toISOString(),
    };

    await supabase.from('video_analyses').insert(videoAnalysis);

    if (alerts.length > 0) {
      const healthAlerts = alerts.map(alert => ({
        animal_id: animalId,
        alert_type: alert.type,
        severity: alert.severity,
        description: alert.description,
        confidence_score: Math.round(alert.confidence),
        video_url: videoAnalysis.video_url,
        detected_at: new Date().toISOString(),
        resolved: false,
      }));

      await supabase.from('health_alerts').insert(healthAlerts);

      const newStatus = alerts.some(a => a.severity === 'high') ? 'sick' : 'monitoring';
      await supabase
        .from('animals')
        .update({
          health_status: newStatus,
          last_checked: new Date().toISOString()
        })
        .eq('id', animalId);
    } else {
      await supabase
        .from('animals')
        .update({
          health_status: 'healthy',
          last_checked: new Date().toISOString()
        })
        .eq('id', animalId);
    }

    return anomalies;
  };

  const handleAnalyze = async () => {
    if (!selectedAnimal) return;

    setAnalyzing(true);
    try {
      await simulateVideoAnalysis(selectedAnimal);
      onAnalysisComplete();
      setSelectedAnimal('');
      setVideoFile(null);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Upload className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Video Analysis</h2>
          <p className="text-sm text-slate-600">Upload and analyze animal behavior</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Animal
          </label>
          <select
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={analyzing}
          >
            <option value="">Choose an animal...</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name} - {animal.type} ({animal.pen_location})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Video Feed
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="hidden"
              id="video-upload"
              disabled={analyzing}
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-600">
                {videoFile ? videoFile.name : 'Click to upload or drag and drop'}
              </span>
              <span className="text-xs text-slate-500 mt-1">MP4, AVI, MOV up to 500MB</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">AI Analysis Features</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Posture and movement pattern detection</li>
              <li>• Behavioral anomaly identification</li>
              <li>• Respiratory distress indicators</li>
              <li>• Activity level monitoring</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!selectedAnimal || analyzing}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {analyzing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analyzing Video...
            </span>
          ) : (
            'Start Analysis'
          )}
        </button>
      </div>
    </div>
  );
}
