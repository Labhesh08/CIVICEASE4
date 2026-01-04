
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SubmitComplaint from './pages/SubmitComplaint';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import { User, Complaint, UserRole } from './types';
import { getComplaintById, getComplaints } from './services/mockStore';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentPage(u.role === UserRole.CITIZEN ? 'citizen-dashboard' : 'officer-dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const navigateToDetail = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentPage('detail');
  };

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'submit':
        return user ? (
          <SubmitComplaint 
            user={user} 
            onSuccess={(id) => {
              triggerRefresh();
              navigateToDetail(id);
            }} 
          />
        ) : null;
      case 'citizen-dashboard':
        return user ? (
          <CitizenDashboard 
            key={`citizen-${refreshKey}`}
            user={user} 
            onViewDetail={navigateToDetail} 
            onFileComplaint={() => setCurrentPage('submit')}
          />
        ) : null;
      case 'officer-dashboard':
        return user ? (
          <OfficerDashboard 
            key={`officer-${refreshKey}`}
            user={user} 
            onViewDetail={navigateToDetail} 
          />
        ) : null;
      case 'detail':
        const complaint = selectedComplaintId ? getComplaintById(selectedComplaintId) : null;
        return complaint && user ? (
          <ComplaintDetail 
            key={`detail-${refreshKey}`}
            complaint={complaint} 
            user={user} 
            onBack={() => {
              triggerRefresh();
              setCurrentPage(user.role === UserRole.CITIZEN ? 'citizen-dashboard' : 'officer-dashboard');
            }}
            onRefresh={triggerRefresh}
          />
        ) : null;
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={(p) => {
          triggerRefresh();
          setCurrentPage(p);
        }} 
      />
      <main className="pb-24">
        {renderPage()}
      </main>
      
      <footer className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="bg-[#2563EB] p-4 rounded-3xl shadow-2xl shadow-blue-500/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-4xl font-black text-white tracking-tighter">CvicEase<span className="text-blue-500">.4</span></span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">GDG TechSprint Open Innovation</p>
            <p className="text-slate-500 text-sm font-semibold max-w-sm leading-relaxed">Pioneering AI-driven civic accountability for a smarter, more transparent urban infrastructure.</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Build Protocol Alpha</span>
            <span className="text-slate-600 text-sm font-bold font-mono bg-white/5 px-4 py-2 rounded-xl">REGISTRY_ST_4.0.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;