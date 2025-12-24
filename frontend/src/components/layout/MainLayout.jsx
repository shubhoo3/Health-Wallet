import React, { useState } from 'react';
import Header from '../shared/Header';
import Navigation from '../shared/Navigation';
import Dashboard from '../dashboard/Dashboard';
import ReportList from '../reports/ReportList';
import VitalsList from '../vitals/VitalsList';
import SharedAccess from '../shared/SharedAccess';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <ReportList />;
      case 'vitals':
        return <VitalsList />;
      case 'shared':
        return <SharedAccess />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>© 2024 Health Wallet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;