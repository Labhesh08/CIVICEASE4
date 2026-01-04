
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-blue-600 p-2 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">
            CvicEase<span className="text-blue-600">.4</span>
          </span>
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate(user.role === UserRole.CITIZEN ? 'citizen-dashboard' : 'officer-dashboard')}
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              {user.role === UserRole.CITIZEN && (
                <button 
                  onClick={() => onNavigate('submit')}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Submit Complaint
                </button>
              )}
              <div className="flex items-center space-x-3 border-l pl-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;