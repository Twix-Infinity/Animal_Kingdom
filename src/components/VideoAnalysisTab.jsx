import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Video, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VideoAnalysisTab() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyses()
  }, [])

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*, animals(name, type)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAnalyses(data || [])
    } catch (error) {
      console.error('Error loading analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Video Analysis History</h2>
        <p className="text-slate-600 mt-1">View all processed video analyses and their results</p>
      </div>

      {analyses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Video className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No video analyses yet</p>
          <p className="text-sm text-slate-400 mt-1">Upload a video from the Animals tab to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon(analysis.analysis_status)}
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {analysis.animals?.name || 'Unknown Animal'}
                      </h3>
                      <p className="text-sm text-slate-600">{analysis.animals?.type || 'Unknown type'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.analysis_status)}`}>
                      {analysis.analysis_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Duration</p>
                      <p className="font-medium text-slate-800">{analysis.duration_seconds || 0}s</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Behaviors</p>
                      <p className="font-medium text-slate-800">
                        {Array.isArray(analysis.behaviors_detected) ? analysis.behaviors_detected.length : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Anomalies</p>
                      <p className="font-medium text-slate-800">{analysis.anomalies_found || 0}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Processed</p>
                      <p className="font-medium text-slate-800">
                        {analysis.processed_at
                          ? new Date(analysis.processed_at).toLocaleDateString()
                          : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {analysis.behaviors_detected && Array.isArray(analysis.behaviors_detected) && analysis.behaviors_detected.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-sm font-medium text-slate-700 mb-2">Detected Behaviors:</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.behaviors_detected.map((behavior, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {behavior.behavior || 'Unknown'} ({Math.round((behavior.confidence || 0) * 100)}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
