import { Trash2, MapPin, Calendar, Edit2, Video } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useState } from 'react'
import AnimalForm from './AnimalForm'
import VideoAnalysis from './VideoAnalysis'

export default function AnimalList({ animals, onAnimalDeleted }) {
  const [deletingId, setDeletingId] = useState(null)
  const [editingAnimal, setEditingAnimal] = useState(null)
  const [analyzingAnimal, setAnalyzingAnimal] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this animal?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase.from('animals').delete().eq('id', id)
      if (error) throw error
      onAnimalDeleted()
    } catch (error) {
      console.error('Error deleting animal:', error)
      alert('Failed to delete animal')
    } finally {
      setDeletingId(null)
    }
  }

  const getHealthStatusColor = (status) => {
    const colors = {
      healthy: 'bg-emerald-100 text-emerald-700',
      monitoring: 'bg-blue-100 text-blue-700',
      sick: 'bg-amber-100 text-amber-700',
      critical: 'bg-rose-100 text-rose-700'
    }
    return colors[status] || colors.healthy
  }

  if (animals.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500">No animals added yet. Click "Add Animal" to get started.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-200">
      {animals.map((animal) => (
        <div key={animal.id}>
          {editingAnimal?.id === animal.id ? (
            <div className="p-6 bg-slate-50">
              <AnimalForm
                animal={animal}
                onSuccess={() => {
                  setEditingAnimal(null)
                  onAnimalDeleted()
                }}
                onCancel={() => setEditingAnimal(null)}
              />
            </div>
          ) : analyzingAnimal?.id === animal.id ? (
            <div className="p-6 bg-slate-50">
              <VideoAnalysis
                animal={animal}
                onAnalysisComplete={() => {
                  setAnalyzingAnimal(null)
                  onAnimalDeleted()
                }}
              />
              <button
                onClick={() => setAnalyzingAnimal(null)}
                className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{animal.name}</h3>
                      <p className="text-sm text-slate-600">{animal.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(animal.health_status)}`}>
                      {animal.health_status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>Age: {animal.age_months} months</span>
                    <span>Weight: {animal.weight_kg} kg</span>
                    {animal.pen_location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {animal.pen_location}
                      </span>
                    )}
                    {animal.last_checked && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last checked: {new Date(animal.last_checked).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnalyzingAnimal(animal)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Analyze video"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingAnimal(animal)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Edit animal"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id)}
                    disabled={deletingId === animal.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete animal"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
