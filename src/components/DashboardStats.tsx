import { Activity, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

type DashboardStatsProps = {
  totalAnimals: number;
  healthyAnimals: number;
  activeAlerts: number;
  monitoringAnimals: number;
};

export default function DashboardStats({
  totalAnimals,
  healthyAnimals,
  activeAlerts,
  monitoringAnimals,
}: DashboardStatsProps) {
  const healthRate = totalAnimals > 0 ? Math.round((healthyAnimals / totalAnimals) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Animals</p>
            <p className="text-2xl font-bold text-slate-900">{totalAnimals}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Healthy Animals</p>
            <p className="text-2xl font-bold text-green-600">{healthyAnimals}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Active Alerts</p>
            <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 mb-1">Health Rate</p>
            <p className="text-2xl font-bold text-slate-900">{healthRate}%</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
