import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export default function HealthAlerts({ alerts, onAlertResolved }) {
  const [resolvingId, setResolvingId] = useState(null)

  const handleResolve = async (alertId) => {
    setResolvingId(alertId)
    try {
      const { error } = await supabase
        .from('health_alerts')
        .update({ resolved: true, resolved_at: new Date().toISOString() })
        .eq('id', alertId)

      if (error) throw error
      onAlertResolved()
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Health Alerts
        </h2>
      </div>

      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-amber-600 mx-auto mb-2" />
            <p className="text-slate-500">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="mb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <button
                    onClick={() => handleResolve(alert.id)}
                    disabled={resolvingId === alert.id}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium disabled:opacity-50"
                  >
                    {resolvingId === alert.id ? 'Resolving...' : 'Resolve'}
                  </button>
                </div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{alert.alert_type}</h4>
                {alert.animals && (
                  <p className="text-xs text-slate-600 mb-1">
                    {alert.animals.name} ({alert.animals.type})
                  </p>
                )}
                <p className="text-sm text-slate-600">{alert.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
