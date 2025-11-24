import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type AddAnimalFormProps = {
  onAnimalAdded: () => void;
};

export default function AddAnimalForm({ onAnimalAdded }: AddAnimalFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cow' as 'cow' | 'pig' | 'chicken',
    pen_location: '',
    age_months: '',
    weight_kg: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await supabase.from('animals').insert({
        name: formData.name,
        type: formData.type,
        pen_location: formData.pen_location,
        age_months: parseInt(formData.age_months) || 0,
        weight_kg: parseFloat(formData.weight_kg) || 0,
        health_status: 'healthy',
      });

      setFormData({
        name: '',
        type: 'cow',
        pen_location: '',
        age_months: '',
        weight_kg: '',
      });
      setIsOpen(false);
      onAnimalAdded();
    } catch (error) {
      console.error('Error adding animal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus className="w-5 h-5" />
        Add Animal
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Add New Animal</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Animal Name/ID
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Bessie, Cow-042"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Animal Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cow">Cow</option>
              <option value="pig">Pig</option>
              <option value="chicken">Chicken</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pen Location
            </label>
            <input
              type="text"
              required
              value={formData.pen_location}
              onChange={(e) => setFormData({ ...formData, pen_location: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Barn A-12, Pen 5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Age (months)
              </label>
              <input
                type="number"
                min="0"
                value={formData.age_months}
                onChange={(e) => setFormData({ ...formData, age_months: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
            >
              {submitting ? 'Adding...' : 'Add Animal'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 bg-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
