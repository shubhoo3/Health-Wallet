import React, { useState, useEffect } from 'react';
import { getVitals, deleteVital } from '../../services/vitalService';
import VitalForm from './VitalForm';
import { Plus, Trash2, Edit, Activity, Loader, AlertCircle } from 'lucide-react';

const VitalsList = () => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVital, setEditingVital] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVitals();
  }, []);

  const loadVitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getVitals();
      setVitals(data);
    } catch (err) {
      console.error('Error loading vitals:', err);
      setError(err.response?.data?.error || 'Failed to load vitals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vital record? This action cannot be undone.')) {
      try {
        await deleteVital(id);
        setVitals(vitals.filter(v => v.id !== id));
      } catch (err) {
        console.error('Error deleting vital:', err);
        alert(err.response?.data?.error || 'Failed to delete vital record');
      }
    }
  };

  const handleEdit = (vital) => {
    setEditingVital(vital);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingVital(null);
    loadVitals();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading vitals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-gray-800 font-semibold mb-2">Failed to load vitals</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadVitals}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vitals History</h2>
          <p className="text-gray-600 mt-1">Track your health metrics over time</p>
        </div>
        <button
          onClick={() => {
            setEditingVital(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Vital</span>
        </button>
      </div>

      {/* Vitals Table */}
      {vitals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No vitals recorded yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your health by adding your first vital reading</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Add First Vital
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Blood Sugar</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Blood Pressure</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Heart Rate</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Temperature</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Weight</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Notes</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vitals.map((vital) => (
                  <tr key={vital.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {new Date(vital.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {vital.blood_sugar ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                          {vital.blood_sugar} mg/dL
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {vital.blood_pressure ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                          {vital.blood_pressure} mmHg
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {vital.heart_rate ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                          {vital.heart_rate} bpm
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {vital.temperature ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                          {vital.temperature}°F
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {vital.weight ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                          {vital.weight} kg
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
                      {vital.notes ? (
                        <span className="text-gray-700" title={vital.notes}>
                          {vital.notes}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(vital)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vital.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Total Count */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold text-gray-800">{vitals.length}</span> vital records
            </p>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <VitalForm
          vital={editingVital}
          onClose={() => {
            setShowForm(false);
            setEditingVital(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default VitalsList;