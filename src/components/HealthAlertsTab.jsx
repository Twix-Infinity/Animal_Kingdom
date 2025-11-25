import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { AlertTriangle, CheckCircle2, Clock, Filter } from 'lucide-react'

export default function HealthAlertsTab() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [resolvingId, setResolvingId] = useState(null)

  useEffect(() => {
    loadAlerts()
  }, [filter])

  const loadAlerts = async () => {
    try {
      let query = supabase
        .from('health_alerts')
        .select('*, animals(name, type)')
        .order('created_at', { ascending: false })

      if (filter === 'active') {
        query = query.eq('resolved', false)
      } else if (filter === 'resolved') {
        query = query.eq('resolved', true)
      }

      const { data, error } = await query

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (alertId) => {
    setResolvingId(alertId)
    try {
      const { error } = await supabase
        .from('health_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', alertId)

      if (error) throw error
      loadAlerts()
    } catch (error) {
      console.error('Error resolving alert:', error)
      alert('Failed to resolve alert')
    } finally {
      setResolvingId(null)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      high: 'bg-red-100 text-red-700 border-red-200',
      critical: 'bg-rose-100 text-rose-700 border-rose-200'
    }
    return colors[severity] || colors.medium
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Health Alerts</h2>
          <p className="text-slate-600 mt-1">Monitor and manage all health alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="all">All Alerts</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <p className="text-slate-500">No alerts found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
                alert.resolved ? 'border-slate-200 opacity-75' : getSeverityColor(alert.severity)
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {alert.resolved ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        {alert.resolved && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-800 text-lg mb-1">
                    {alert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>

                  {alert.animals && (
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">{alert.animals.name}</span> ({alert.animals.type})
                    </p>
                  )}

                  <p className="text-slate-700 mb-3">{alert.description}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(alert.detected_at || alert.created_at).toLocaleString()}
                    </span>
                    <span>Confidence: {alert.confidence_score}%</span>
                  </div>

                  {alert.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600"><strong>Notes:</strong> {alert.notes}</p>
                    </div>
                  )}
                </div>

                {!alert.resolved && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    disabled={resolvingId === alert.id}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {resolvingId === alert.id ? 'Resolving...' : 'Mark Resolved'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
