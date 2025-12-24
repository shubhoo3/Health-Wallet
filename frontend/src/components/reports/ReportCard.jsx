import React, { useState } from 'react';
import { Download, Share2, Trash2, FileText, Calendar } from 'lucide-react';
import { downloadReport } from '../../services/reportService';
import ShareModal from '../shared/ShareModal';

const ReportCard = ({ report, onDelete, onUpdate }) => {
  const [showShare, setShowShare] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadReport(report.id, report.file_name);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    } finally {
      setDownloading(false);
    }
  };

  const handleShareSuccess = () => {
    setShowShare(false);
    onUpdate();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 animate-fadeIn">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-800 truncate" title={report.title}>
                {report.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(report.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {report.type}
          </span>
          {report.vitals && report.vitals.map((vital, idx) => (
            <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              {vital}
            </span>
          ))}
        </div>

        {report.sharedWith && report.sharedWith.length > 0 && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-purple-700 font-medium">
              🔗 Shared with: {report.sharedWith.join(', ')}
            </p>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition disabled:opacity-50"
            title="Download"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">
              {downloading ? 'Downloading...' : 'Download'}
            </span>
          </button>
          <button
            onClick={() => setShowShare(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
          <button
            onClick={() => onDelete(report.id)}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showShare && (
        <ShareModal
          reportId={report.id}
          reportTitle={report.title}
          onClose={() => setShowShare(false)}
          onSuccess={handleShareSuccess}
        />
      )}
    </>
  );
};

export default ReportCard;