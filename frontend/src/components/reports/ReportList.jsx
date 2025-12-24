import React, { useState, useEffect } from 'react';
import { getReports, deleteReport } from '../../services/reportService';
import ReportCard from './ReportCard';
import ReportUpload from './ReportUpload';
import ReportFilter from './ReportFilter';
import { Upload, Search, Loader, AlertCircle } from 'lucide-react';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: '',
    type: '',
    vitalType: '',
    search: ''
  });

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError(err.response?.data?.error || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.date) {
      filtered = filtered.filter(r => r.date === filters.date);
    }

    if (filters.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    if (filters.vitalType) {
      filtered = filtered.filter(r => 
        r.vitals && r.vitals.includes(filters.vitalType)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchLower) ||
        r.type.toLowerCase().includes(searchLower)
      );
    }

    setFilteredReports(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await deleteReport(id);
        setReports(reports.filter(r => r.id !== id));
      } catch (err) {
        console.error('Error deleting report:', err);
        alert(err.response?.data?.error || 'Failed to delete report');
      }
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    loadReports();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-gray-800 font-semibold mb-2">Failed to load reports</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadReports}
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
          <h2 className="text-2xl font-bold text-gray-800">Medical Reports</h2>
          <p className="text-gray-600 mt-1">Manage your health records</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <Upload className="w-5 h-5" />
          <span className="font-medium">Upload Report</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search reports by title or type..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Filters */}
      <ReportFilter filters={filters} setFilters={setFilters} />

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {reports.length === 0 ? 'No reports yet' : 'No reports match your filters'}
          </h3>
          <p className="text-gray-600 mb-6">
            {reports.length === 0 
              ? 'Upload your first medical report to get started'
              : 'Try adjusting your filters to see more results'
            }
          </p>
          {reports.length === 0 && (
            <button
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Upload First Report
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                onDelete={handleDelete}
                onUpdate={loadReports}
              />
            ))}
          </div>
          
          {/* Results Count */}
          <div className="text-center text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredReports.length}</span> of <span className="font-semibold">{reports.length}</span> reports
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <ReportUpload
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default ReportList;