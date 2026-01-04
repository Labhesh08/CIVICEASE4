
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [email, setEmail] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name: role === UserRole.CITIZEN ? 'Labhesh Sarode' : 'Officer Syntax-tic',
        email: email || (role === UserRole.CITIZEN ? 'labhesh08@gmail.com' : 'officer@syntax.tic'),
        role,
        officerId: role === UserRole.OFFICER ? officerId : undefined,
        mobile: role === UserRole.CITIZEN ? '9876543210' : undefined
      });
      setLoading(false);
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setShowGoogleModal(true);
  };

  const selectGoogleAccount = (accountEmail: string, name: string) => {
    setLoading(true);
    setShowGoogleModal(false);
    setTimeout(() => {
      onLogin({
        id: 'google-uid-' + Date.now(),
        name,
        email: accountEmail,
        role,
        mobile: role === UserRole.CITIZEN ? '9998887770' : undefined
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
      </div>

      <div className="relative z-10 bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] w-full max-w-lg p-12 md:p-16 border border-slate-100">
        <div className="text-center mb-10">
          <div className="bg-[#2563EB] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200 transform transition-transform hover:scale-105 duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">System Authentication</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Official Case Index Authorization</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 shadow-inner">
          <button 
            onClick={() => setRole(UserRole.CITIZEN)}
            className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${role === UserRole.CITIZEN ? 'bg-white text-blue-600 shadow-md translate-y-[-1px]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Citizen
          </button>
          <button 
            onClick={() => setRole(UserRole.OFFICER)}
            className={`flex-1 py-3 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${role === UserRole.OFFICER ? 'bg-white text-blue-600 shadow-md translate-y-[-1px]' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Officer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Identity (Email)</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 font-bold transition-all outline-none"
              placeholder={role === UserRole.CITIZEN ? 'labhesh08@gmail.com' : 'officer@syntax.tic'} 
            />
          </div>

          {role === UserRole.OFFICER && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">4-Digit PIN</label>
              <input 
                required 
                type="password" 
                maxLength={4} 
                value={officerId} 
                onChange={(e) => setOfficerId(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 font-bold transition-all outline-none text-center tracking-[1em] text-2xl"
                placeholder="••••" 
              />
            </div>
          )}

          <button 
            disabled={loading} 
            type="submit"
            className={`w-full py-6 rounded-full text-lg font-black text-white transition-all shadow-2xl shadow-blue-100 ${loading ? 'bg-slate-300 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-95'}`}
          >
            {loading ? 'Authenticating...' : 'Secure Authorization'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100">
          <button 
            onClick={handleGoogleSignIn}
            className="flex items-center space-x-4 px-8 py-4 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm active:scale-95 w-full justify-center group"
          >
            <img src="https://www.google.com/favicon.ico" alt="G" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Login via Cloud Node</span>
          </button>
        </div>
      </div>

      {/* Simulated Google Sign-In Popup */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 pb-4">
              <div className="flex justify-center mb-6">
                <svg className="w-12 h-12" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Choose an account</h3>
              <p className="text-sm text-center text-slate-500 mb-8">to continue to <span className="text-blue-600 font-bold">CvicEase by-Syntax-tic.4</span></p>
              
              <div className="space-y-4">
                <button 
                  onClick={() => selectGoogleAccount('labhesh08@gmail.com', 'Labhesh Sarode')}
                  className="w-full flex items-center space-x-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">L</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Labhesh Sarode</p>
                    <p className="text-xs text-slate-400">labhesh08@gmail.com</p>
                  </div>
                </button>
                <button 
                  onClick={() => selectGoogleAccount('officer@syntax.tic', 'Lead Officer')}
                  className="w-full flex items-center space-x-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">O</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">Lead Officer</p>
                    <p className="text-xs text-slate-400">officer@syntax.tic</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="p-8 pt-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300 font-bold uppercase">
              <button onClick={() => setShowGoogleModal(false)} className="hover:text-slate-600">Cancel</button>
              <div className="flex space-x-4">
                <span>Privacy</span>
                <span>Terms</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;