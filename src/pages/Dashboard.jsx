import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Stethoscope, LogOut, Plus } from 'lucide-react'
import AnimalList from '../components/AnimalList'
import AnimalForm from '../components/AnimalForm'
import HealthAlerts from '../components/HealthAlerts'
import Stats from '../components/Stats'
import Sidebar from '../components/Sidebar'
import VideoAnalysisTab from '../components/VideoAnalysisTab'
import HealthAlertsTab from '../components/HealthAlertsTab'
import AnalyticsTab from '../components/AnalyticsTab'

export default function Dashboard({ session }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddAnimal, setShowAddAnimal] = useState(false)
  const [animals, setAnimals] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [animalsRes, alertsRes] = await Promise.all([
        supabase.from('animals').select('*').order('created_at', { ascending: false }),
        supabase.from('health_alerts').select('*, animals(name, type)').eq('resolved', false).order('created_at', { ascending: false })
      ])

      if (animalsRes.data) {
        setAnimals(animalsRes.data)
        calculateStats(animalsRes.data)
      }
      if (alertsRes.data) setAlerts(alertsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (animalsData) => {
    const total = animalsData.length
    const healthy = animalsData.filter(a => a.health_status === 'healthy').length
    const avgAge = total > 0 ? animalsData.reduce((sum, a) => sum + (a.age_months || 0), 0) / total : 0

    setStats({
      totalAnimals: total,
      healthyAnimals: healthy,
      activeAlerts: alerts.length,
      averageAge: avgAge.toFixed(1)
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleAnimalAdded = () => {
    setShowAddAnimal(false)
    loadData()
  }

  const handleAnimalDeleted = () => {
    loadData()
  }

  const handleAlertResolved = () => {
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'animals':
        return (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Animals</h2>
                <p className="text-slate-600 mt-1">Manage your farm animals</p>
              </div>
              <button
                onClick={() => setShowAddAnimal(!showAddAnimal)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Animal</span>
              </button>
            </div>

            {showAddAnimal && (
              <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                <AnimalForm onSuccess={handleAnimalAdded} onCancel={() => setShowAddAnimal(false)} />
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <AnimalList animals={animals} onAnimalDeleted={handleAnimalDeleted} />
            </div>
          </div>
        )
      case 'videos':
        return <VideoAnalysisTab />
      case 'alerts':
        return <HealthAlertsTab />
      case 'analytics':
        return <AnalyticsTab />
      default:
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-slate-600 mt-1">Monitor your farm's health at a glance</p>
            </div>
            <Stats stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">Recent Animals</h2>
                  </div>
                  <AnimalList animals={animals.slice(0, 5)} onAnimalDeleted={handleAnimalDeleted} />
                </div>
              </div>
              <div className="lg:col-span-1">
                <HealthAlerts alerts={alerts} onAlertResolved={handleAlertResolved} />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <nav className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Stethoscope className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Animal Kingdom</h1>
                  <p className="text-xs text-slate-500">Farm Health Monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">{session.user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 px-6 lg:px-8 py-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
