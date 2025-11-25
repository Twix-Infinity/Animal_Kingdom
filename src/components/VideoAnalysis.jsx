import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Upload, Video, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function VideoAnalysis({ animal, onAnalysisComplete }) {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleVideoUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file')
      return
    }

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Video file must be smaller than 50MB')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${animal.id}-${Date.now()}.${fileExt}`
      const filePath = `videos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('animal-videos')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('animal-videos')
        .getPublicUrl(filePath)

      await analyzeVideo(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const analyzeVideo = async (videoUrl) => {
    setAnalyzing(true)
    setError(null)

    try {
      const { data: analysisRecord, error: recordError } = await supabase
        .from('video_analyses')
        .insert([{
          animal_id: animal.id,
          video_url: videoUrl,
          analysis_status: 'processing'
        }])
        .select()
        .single()

      if (recordError) throw recordError

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-video`
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          video_url: videoUrl,
          animal_id: animal.id,
          analysis_id: analysisRecord.id
        })
      })

      if (!response.ok) {
        throw new Error('Video analysis failed')
      }

      const result = await response.json()

      setSuccess('Video analyzed successfully! Check health alerts for any issues detected.')
      if (onAnalysisComplete) onAnalysisComplete()
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.message)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Video className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">AI Video Analysis</h3>
          <p className="text-sm text-slate-600">Upload a video to analyze animal health</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-800">{success}</p>
        </div>
      )}

      <div className="relative">
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={handleVideoUpload}
          disabled={uploading || analyzing}
          className="hidden"
        />
        <label
          htmlFor="video-upload"
          className={`
            flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg
            transition-colors cursor-pointer
            ${uploading || analyzing
              ? 'border-slate-300 bg-slate-50 cursor-not-allowed'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
        >
          {uploading ? (
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
          ) : analyzing ? (
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
          ) : (
            <Upload className="w-12 h-12 text-slate-400 mb-3" />
          )}
          <p className="text-sm font-medium text-slate-700 mb-1">
            {uploading ? 'Uploading video...' : analyzing ? 'Analyzing video...' : 'Click to upload video'}
          </p>
          <p className="text-xs text-slate-500">
            {uploading || analyzing ? 'Please wait...' : 'MP4, MOV, AVI (max 50MB)'}
          </p>
        </label>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>AI Analysis includes:</strong> Posture detection, movement patterns, behavioral anomalies,
          and early signs of illness or distress.
        </p>
      </div>
    </div>
  )
}
