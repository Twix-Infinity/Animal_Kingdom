import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { supabase, type HealthAlert, type Animal } from '../lib/supabase';

type HealthAlertsProps = {
  alerts: (HealthAlert & { animal?: Animal })[];
  onResolve: () => void;
};

const severityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  high: 'bg-orange-50 border-orange-200 text-orange-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
};

const severityBadges = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function HealthAlerts({ alerts, onResolve }: HealthAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const handleResolve = async (alertId: string) => {
    setResolving(true);
    try {
      await supabase
        .from('health_alerts')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          notes: notes,
        })
        .eq('id', alertId);

      setSelectedAlert(null);
      setNotes('');
      onResolve();
    } catch (error) {
      console.error('Error resolving alert:', error);
    } finally {
      setResolving(false);
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Health Alerts</h2>
          <p className="text-sm text-slate-600">
            {unresolvedAlerts.length} unresolved, {resolvedAlerts.length} resolved
          </p>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {unresolvedAlerts.length === 0 && resolvedAlerts.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-slate-600">No health alerts yet</p>
            <p className="text-sm text-slate-500">Alerts will appear here when detected</p>
          </div>
        )}

        {unresolvedAlerts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Unresolved Alerts
            </h3>
            {unresolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${severityColors[alert.severity]}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${severityBadges[alert.severity]} uppercase`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                        {alert.alert_type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900 mb-1">
                      {alert.animal?.name} ({alert.animal?.type})
                    </p>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.detected_at).toLocaleString()}
                      </span>
                      <span>Confidence: {Math.round(alert.confidence_score)}%</span>
                    </div>
                  </div>
                </div>

                {selectedAlert === alert.id ? (
                  <div className="mt-4 pt-4 border-t border-current/20">
                    <label className="block text-sm font-medium mb-2">
                      Resolution Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about treatment or observations..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm mb-3"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleResolve(alert.id)}
                        disabled={resolving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:bg-slate-400"
                      >
                        {resolving ? 'Resolving...' : 'Mark as Resolved'}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAlert(null);
                          setNotes('');
                        }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedAlert(alert.id)}
                    className="mt-2 text-sm font-medium hover:underline"
                  >
                    Resolve Alert →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {resolvedAlerts.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Resolved Alerts
            </h3>
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50 opacity-75"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                        {alert.alert_type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900 mb-1 text-sm">
                      {alert.animal?.name} ({alert.animal?.type})
                    </p>
                    <p className="text-sm text-slate-600 mb-2">{alert.description}</p>
                    {alert.notes && (
                      <div className="flex items-start gap-2 text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                        <FileText className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{alert.notes}</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      Resolved: {alert.resolved_at ? new Date(alert.resolved_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
