import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [animalsRes, alertsRes, videosRes] = await Promise.all([
        supabase.from('animals').select('*'),
        supabase.from('health_alerts').select('*'),
        supabase.from('video_analyses').select('*')
      ])

      const animals = animalsRes.data || []
      const alerts = alertsRes.data || []
      const videos = videosRes.data || []

      const healthStatusCount = {
        healthy: animals.filter(a => a.health_status === 'healthy').length,
        monitoring: animals.filter(a => a.health_status === 'monitoring').length,
        sick: animals.filter(a => a.health_status === 'sick').length,
        critical: animals.filter(a => a.health_status === 'critical').length
      }

      const typeCount = {
        cow: animals.filter(a => a.type === 'cow').length,
        pig: animals.filter(a => a.type === 'pig').length,
        chicken: animals.filter(a => a.type === 'chicken').length
      }

      const severityCount = {
        low: alerts.filter(a => a.severity === 'low').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        high: alerts.filter(a => a.severity === 'high').length,
        critical: alerts.filter(a => a.severity === 'critical').length
      }

      const resolvedAlerts = alerts.filter(a => a.resolved).length
      const activeAlerts = alerts.filter(a => !a.resolved).length

      const completedVideos = videos.filter(v => v.analysis_status === 'completed').length
      const totalAnomalies = videos.reduce((sum, v) => sum + (v.anomalies_found || 0), 0)

      setAnalytics({
        totalAnimals: animals.length,
        healthStatusCount,
        typeCount,
        totalAlerts: alerts.length,
        activeAlerts,
        resolvedAlerts,
        severityCount,
        totalVideos: videos.length,
        completedVideos,
        totalAnomalies,
        healthRate: animals.length > 0 ? ((healthStatusCount.healthy / animals.length) * 100).toFixed(1) : 0
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-center text-slate-500">No data available</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
        <p className="text-slate-600 mt-1">Comprehensive overview of farm health metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-emerald-100 text-sm">Health Rate</p>
          <p className="text-3xl font-bold mt-1">{analytics.healthRate}%</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-blue-100 text-sm">Total Animals</p>
          <p className="text-3xl font-bold mt-1">{analytics.totalAnimals}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            {analytics.activeAlerts > 5 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>
          <p className="text-orange-100 text-sm">Active Alerts</p>
          <p className="text-3xl font-bold mt-1">{analytics.activeAlerts}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-purple-100 text-sm">Videos Analyzed</p>
          <p className="text-3xl font-bold mt-1">{analytics.completedVideos}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Health Status Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.healthStatusCount).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 capitalize">{status}</span>
                  <span className="font-medium text-slate-800">{count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      status === 'healthy' ? 'bg-emerald-500' :
                      status === 'monitoring' ? 'bg-blue-500' :
                      status === 'sick' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${analytics.totalAnimals > 0 ? (count / analytics.totalAnimals) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Animal Type Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.typeCount).map(([type, count]) => (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 capitalize">{type}</span>
                  <span className="font-medium text-slate-800">{count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analytics.totalAnimals > 0 ? (count / analytics.totalAnimals) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-600" />
            Alert Severity Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.severityCount).map(([severity, count]) => (
              <div key={severity}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 capitalize">{severity}</span>
                  <span className="font-medium text-slate-800">{count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      severity === 'low' ? 'bg-yellow-500' :
                      severity === 'medium' ? 'bg-orange-500' :
                      severity === 'high' ? 'bg-red-500' : 'bg-rose-600'
                    }`}
                    style={{ width: `${analytics.totalAlerts > 0 ? (count / analytics.totalAlerts) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">Total Alerts</span>
              <span className="font-semibold text-slate-800">{analytics.totalAlerts}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">Resolved Alerts</span>
              <span className="font-semibold text-emerald-600">{analytics.resolvedAlerts}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <span className="text-slate-600">Total Videos</span>
              <span className="font-semibold text-slate-800">{analytics.totalVideos}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">Total Anomalies</span>
              <span className="font-semibold text-rose-600">{analytics.totalAnomalies}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
