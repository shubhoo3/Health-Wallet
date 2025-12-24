import React, { useState, useEffect } from 'react';
import { getSharedWithMe, getSharedByMe } from '../../services/shareService';
import { downloadReport } from '../../services/reportService';
import { Users, Download, Calendar, User, FileText, Loader } from 'lucide-react';

const SharedAccess = () => {
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [sharedByMe, setSharedByMe] = useState([]);
  const [activeTab, setActiveTab] = useState('with-me');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedReports();
  }, []);

  const loadSharedReports = async () => {
    try {
      setLoading(true);
      const [withMe, byMe] = await Promise.all([
        getSharedWithMe(),
        getSharedByMe()
      ]);
      setSharedWithMe(withMe);
      setSharedByMe(byMe);
    } catch (error) {
      console.error('Error loading shared reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId, fileName) => {
    try {
      await downloadReport(reportId, fileName);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading shared reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Shared Access</h2>
        <p className="text-gray-600 mt-1">Manage reports shared with you and by you</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('with-me')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === 'with-me'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Shared With Me ({sharedWithMe.length})
            </button>
            <button
              onClick={() => setActiveTab('by-me')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeTab === 'by-me'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              Shared By Me ({sharedByMe.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'with-me' ? (
            sharedWithMe.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No reports shared with you
                </h3>
                <p className="text-gray-600">
                  When someone shares a report with you, it will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedWithMe.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition animate-fadeIn"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          <h3 className="font-semibold text-gray-800">{report.title}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {report.type}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {report.shared_by_name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>
                            Shared {new Date(report.shared_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(report.id, report.file_name)}
                        className="ml-4 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            sharedByMe.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  You haven't shared any reports
                </h3>
                <p className="text-gray-600">
                  Share your reports with doctors, family members, or friends from the Reports page
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedByMe.map((report, index) => (
                  <div
                    key={`${report.id}-${index}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition animate-fadeIn"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-5 h-5 text-indigo-600" />
                          <h3 className="font-semibold text-gray-800">{report.title}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {report.type}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Shared with: {report.shared_with_email}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(report.date).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>
                            Shared {new Date(report.shared_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(report.id, report.file_name)}
                        className="ml-4 p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedAccess;