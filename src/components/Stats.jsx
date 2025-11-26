import { Activity, Heart, AlertTriangle, TrendingUp } from 'lucide-react'

export default function Stats({ stats }) {
  if (!stats) return null

  const statCards = [
    {
      icon: Activity,
      label: 'Total Animals',
      value: stats.totalAnimals,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Heart,
      label: 'Healthy Animals',
      value: stats.healthyAnimals,
      color: 'bg-amber-100 text-amber-700',
      bgColor: 'bg-amber-50'
    },
    {
      icon: AlertTriangle,
      label: 'Active Alerts',
      value: stats.activeAlerts,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: TrendingUp,
      label: 'Average Age',
      value: `${stats.averageAge} yrs`,
      color: 'bg-amber-100 text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
