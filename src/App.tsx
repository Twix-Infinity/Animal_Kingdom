import { useState, useEffect } from 'react';
import { Stethoscope } from 'lucide-react';
import { supabase, type Animal, type HealthAlert } from './lib/supabase';
import DashboardStats from './components/DashboardStats';
import AnimalCard from './components/AnimalCard';
import VideoAnalyzer from './components/VideoAnalyzer';
import HealthAlerts from './components/HealthAlerts';
import AddAnimalForm from './components/AddAnimalForm';

function App() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [alerts, setAlerts] = useState<(HealthAlert & { animal?: Animal })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'cow' | 'pig' | 'chicken'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'healthy' | 'monitoring' | 'sick' | 'critical'>('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: animalsData } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: alertsData } = await supabase
        .from('health_alerts')
        .select('*')
        .order('detected_at', { ascending: false });

      if (animalsData) {
        setAnimals(animalsData);
      }

      if (alertsData) {
        const alertsWithAnimals = alertsData.map(alert => {
          const animal = animalsData?.find(a => a.id === alert.animal_id);
          return { ...alert, animal };
        });
        setAlerts(alertsWithAnimals);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const animalsChannel = supabase
      .channel('animals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'animals' }, () => {
        loadData();
      })
      .subscribe();

    const alertsChannel = supabase
      .channel('alerts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'health_alerts' }, () => {
        loadData();
      })
      .subscribe();

    const analysesChannel = supabase
      .channel('analyses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_analyses' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(animalsChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(analysesChannel);
    };
  }, []);

  const filteredAnimals = animals.filter(animal => {
    const typeMatch = filterType === 'all' || animal.type === filterType;
    const statusMatch = filterStatus === 'all' || animal.health_status === filterStatus;
    return typeMatch && statusMatch;
  });

  const getAlertCount = (animalId: string) => {
    return alerts.filter(alert => alert.animal_id === animalId && !alert.resolved).length;
  };

  const stats = {
    totalAnimals: animals.length,
    healthyAnimals: animals.filter(a => a.health_status === 'healthy').length,
    activeAlerts: alerts.filter(a => !a.resolved).length,
    monitoringAnimals: animals.filter(a => a.health_status === 'monitoring').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Animal Kingdom</h1>
                <p className="text-sm text-slate-600">AI-Powered Animal Health Detection</p>
              </div>
            </div>
            <AddAnimalForm onAnimalAdded={loadData} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <DashboardStats {...stats} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <VideoAnalyzer animals={animals} onAnalysisComplete={loadData} />
          </div>
          <div className="lg:col-span-1">
            <HealthAlerts alerts={alerts} onResolve={loadData} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Animal Inventory</h2>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="cow">Cows</option>
                <option value="pig">Pigs</option>
                <option value="chicken">Chickens</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="healthy">Healthy</option>
                <option value="monitoring">Monitoring</option>
                <option value="sick">Sick</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {filteredAnimals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-2">No animals found</p>
              <p className="text-sm text-slate-500">Add your first animal to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnimals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  alertCount={getAlertCount(animal.id)}
                  onDelete={loadData}
                  onUpdate={loadData}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
