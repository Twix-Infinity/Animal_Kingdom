import { Home, Heart, Video, BarChart3, AlertTriangle, Settings } from 'lucide-react'

export default function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'animals', label: 'Animals', icon: Heart },
    { id: 'videos', label: 'Video Analysis', icon: Video },
    { id: 'alerts', label: 'Health Alerts', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 font-medium text-sm
                ${isActive
                  ? 'bg-amber-50 text-amber-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-700' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
