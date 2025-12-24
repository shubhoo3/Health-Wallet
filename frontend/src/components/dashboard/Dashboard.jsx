import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/dashboardService';
import { getVitals } from '../../services/vitalService';
import StatsCard from './StatsCard';
import VitalsChart from './VitalsChart';
import { FileText, Activity, Users, TrendingUp, Loader, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, vitalsData] = await Promise.all([
        getDashboardStats(),
        getVitals({ limit: 30 })
      ]);
      setStats(statsData);
      setVitals(vitalsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-gray-800 font-semibold mb-2">Failed to load dashboard</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Health Dashboard</h2>
        <p className="text-indigo-100">Track your health metrics and manage your medical records all in one place</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Reports"
          value={stats?.totalReports || 0}
          icon={FileText}
          color="blue"
          subtitle="Medical documents"
        />
        <StatsCard
          title="Vitals Tracked"
          value={stats?.totalVitals || 0}
          icon={Activity}
          color="green"
          subtitle="Health readings"
        />
        <StatsCard
          title="Shared Reports"
          value={stats?.sharedReports || 0}
          icon={Users}
          color="purple"
          subtitle="With doctors & family"
        />
      </div>

      {/* Vitals Chart */}
      {vitals.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-800">Vitals Trend</h3>
            </div>
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>
          <VitalsChart data={vitals} />
        </div>
      )}

      {/* Latest Vital Reading */}
      {stats?.latestVital && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Latest Health Reading</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.latestVital.blood_sugar && (
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Blood Sugar</p>
                <p className="text-2xl font-bold text-blue-600">{stats.latestVital.blood_sugar}</p>
                <p className="text-xs text-gray-500 mt-1">mg/dL</p>
              </div>
            )}
            {stats.latestVital.blood_pressure && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                <p className="text-2xl font-bold text-green-600">{stats.latestVital.blood_pressure}</p>
                <p className="text-xs text-gray-500 mt-1">mmHg</p>
              </div>
            )}
            {stats.latestVital.heart_rate && (
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                <p className="text-2xl font-bold text-red-600">{stats.latestVital.heart_rate}</p>
                <p className="text-xs text-gray-500 mt-1">bpm</p>
              </div>
            )}
            {stats.latestVital.temperature && (
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-sm text-gray-600 mb-1">Temperature</p>
                <p className="text-2xl font-bold text-orange-600">{stats.latestVital.temperature}</p>
                <p className="text-xs text-gray-500 mt-1">°F</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            📅 Last updated: {new Date(stats.latestVital.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      )}

      {/* Statistics Summary */}
      {stats?.vitalStats && stats.vitalStats.total_readings > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Sugar */}
            {stats.vitalStats.avg_blood_sugar && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-medium">Blood Sugar (mg/dL)</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.avg_blood_sugar?.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Min</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.min_blood_sugar?.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.max_blood_sugar?.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Blood Pressure */}
            {stats.vitalStats.avg_blood_pressure && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-medium">Blood Pressure (mmHg)</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.avg_blood_pressure?.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Min</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.min_blood_pressure?.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.max_blood_pressure?.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Heart Rate */}
            {stats.vitalStats.avg_heart_rate && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3 font-medium">Heart Rate (bpm)</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Average</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.avg_heart_rate?.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Min</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.min_heart_rate?.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Max</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {stats.vitalStats.max_heart_rate?.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Based on {stats.vitalStats.total_readings} total readings
          </p>
        </div>
      )}

      {/* Empty State */}
      {stats?.totalReports === 0 && stats?.totalVitals === 0 && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="max-w-md mx-auto">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Started with Health Wallet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your health by uploading medical reports and recording vital signs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
                Upload First Report
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                Add First Vital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
