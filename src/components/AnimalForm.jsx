import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X } from 'lucide-react'

export default function AnimalForm({ onSuccess, onCancel, animal = null }) {
  const isEditing = !!animal
  const [formData, setFormData] = useState(animal ? {
    name: animal.name,
    type: animal.type,
    age_months: animal.age_months.toString(),
    weight_kg: animal.weight_kg?.toString() || '0',
    health_status: animal.health_status,
    pen_location: animal.pen_location || '',
    last_checked: animal.last_checked ? new Date(animal.last_checked).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  } : {
    name: '',
    type: 'cow',
    age_months: '',
    weight_kg: '0',
    health_status: 'healthy',
    pen_location: '',
    last_checked: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        ...formData,
        age_months: parseInt(formData.age_months),
        weight_kg: parseFloat(formData.weight_kg)
      }

      const { error } = isEditing
        ? await supabase.from('animals').update(data).eq('id', animal.id)
        : await supabase.from('animals').insert([data])

      if (error) throw error
      onSuccess()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          >
            <option value="cow">Cow</option>
            <option value="pig">Pig</option>
            <option value="chicken">Chicken</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Age (months)</label>
          <input
            type="number"
            name="age_months"
            value={formData.age_months}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight_kg"
            value={formData.weight_kg}
            onChange={handleChange}
            min="0"
            step="0.1"
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Health Status</label>
          <select
            name="health_status"
            value={formData.health_status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          >
            <option value="healthy">Healthy</option>
            <option value="monitoring">Monitoring</option>
            <option value="sick">Sick</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pen Location</label>
          <input
            type="text"
            name="pen_location"
            value={formData.pen_location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Checked</label>
          <input
            type="date"
            name="last_checked"
            value={formData.last_checked}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-amber-700 text-white py-2 rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
        >
          {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Animal' : 'Add Animal')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
