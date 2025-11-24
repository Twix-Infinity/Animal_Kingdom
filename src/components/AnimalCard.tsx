import { Beef, Bird, PiggyBank, AlertCircle, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { type Animal, supabase } from '../lib/supabase';
import { useState } from 'react';

type AnimalCardProps = {
  animal: Animal;
  alertCount?: number;
  onDelete?: () => void;
  onUpdate?: () => void;
};

const animalIcons = {
  cow: Beef,
  pig: PiggyBank,
  chicken: Bird,
};

const statusColors = {
  healthy: 'bg-green-100 text-green-700 border-green-200',
  monitoring: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  sick: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons = {
  healthy: CheckCircle,
  monitoring: AlertCircle,
  sick: AlertCircle,
  critical: AlertCircle,
};

export default function AnimalCard({ animal, alertCount = 0, onDelete, onUpdate }: AnimalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    pen_location: animal.pen_location,
    weight_kg: animal.weight_kg,
    age_months: animal.age_months,
  });
  const Icon = animalIcons[animal.type];
  const StatusIcon = statusIcons[animal.health_status];
  const lastChecked = new Date(animal.last_checked).toLocaleString();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${animal.name}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', animal.id);

      if (error) throw error;

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting animal:', error);
      alert('Failed to delete animal');
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('animals')
        .update({
          pen_location: editData.pen_location,
          weight_kg: editData.weight_kg,
          age_months: editData.age_months,
        })
        .eq('id', animal.id);

      if (error) throw error;

      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating animal:', error);
      alert('Failed to update animal');
    }
  };

  const handleCancel = () => {
    setEditData({
      pen_location: animal.pen_location,
      weight_kg: animal.weight_kg,
      age_months: animal.age_months,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow relative group">
      <div className="absolute top-3 right-3 flex gap-1">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isDeleting || isEditing}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Edit animal"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting || isEditing}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Delete animal"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Icon className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{animal.name}</h3>
            <p className="text-sm text-slate-600 capitalize">{animal.type}</p>
          </div>
        </div>
        {alertCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {alertCount}
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs text-slate-600 mb-1">Location</label>
            <input
              type="text"
              value={editData.pen_location}
              onChange={(e) => setEditData({ ...editData, pen_location: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Age (months)</label>
            <input
              type="number"
              value={editData.age_months}
              onChange={(e) => setEditData({ ...editData, age_months: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={editData.weight_kg}
              onChange={(e) => setEditData({ ...editData, weight_kg: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleUpdate}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Location:</span>
            <span className="font-medium text-slate-900">{animal.pen_location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Age:</span>
            <span className="font-medium text-slate-900">{animal.age_months} months</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Weight:</span>
            <span className="font-medium text-slate-900">{animal.weight_kg} kg</span>
          </div>
        </div>
      )}

      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusColors[animal.health_status]}`}>
        <StatusIcon className="w-4 h-4" />
        <span className="text-sm font-medium capitalize">{animal.health_status}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500">Last checked: {lastChecked}</p>
      </div>
    </div>
  );
}
