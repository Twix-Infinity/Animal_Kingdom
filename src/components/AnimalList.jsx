import { Trash2, MapPin, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export default function AnimalList({ animals, onAnimalDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

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
      sick: 'bg-red-100 text-red-700',
      recovering: 'bg-amber-100 text-amber-700',
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
        <div key={animal.id} className="p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{animal.name}</h3>
                  <p className="text-sm text-slate-600">{animal.species}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(animal.health_status)}`}>
                  {animal.health_status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span>Age: {animal.age} years</span>
                {animal.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {animal.location}
                  </span>
                )}
                {animal.last_checkup && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Last checkup: {new Date(animal.last_checkup).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
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
      ))}
    </div>
  )
}
