
import React, { useState, useEffect } from 'react';
import { User, Complaint, IssueStatus } from '../types';
import { getComplaints } from '../services/mockStore';

interface CitizenDashboardProps {
  user: User;
  onViewDetail: (id: string) => void;
  onFileComplaint: () => void;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, onViewDetail, onFileComplaint }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const all = getComplaints();
    setComplaints(all.filter(c => c.uid === user.id));
  }, [user.id]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-10">
        <div>
          <h2 className="text-6xl font-black text-slate-900 mb-3 tracking-tighter">Citizen Portal</h2>
          <p className="text-slate-500 font-medium text-lg italic">Transparency in every resolution.</p>
        </div>
        
        <button 
          onClick={onFileComplaint}
          className="group flex items-center space-x-6 bg-[#2563EB] text-white pl-10 pr-12 py-6 rounded-[2.5rem] text-xl font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-2 active:translate-y-0 active:scale-95"
        >
          <span className="bg-white/20 p-3 rounded-2xl group-hover:rotate-90 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          <span className="uppercase tracking-widest">File a Complaint</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 -mr-12 -mt-12 rounded-full opacity-50"></div>
          <span className="text-6xl font-black text-blue-600 mb-3 block">{complaints.length}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Registry Entries</span>
        </div>
        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 -mr-12 -mt-12 rounded-full opacity-50"></div>
          <span className="text-6xl font-black text-amber-500 mb-3 block">
            {complaints.filter(c => c.status === IssueStatus.IN_PROGRESS).length}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Cases in Dispatch</span>
        </div>
        <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 -mr-12 -mt-12 rounded-full opacity-50"></div>
          <span className="text-6xl font-black text-emerald-500 mb-3 block">
            {complaints.filter(c => c.status === IssueStatus.RESOLVED).length}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Verified Resolutions</span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-10 px-4 uppercase tracking-[0.2em] flex items-center">
          <span className="w-2.5 h-10 bg-blue-600 rounded-full mr-6 shadow-xl shadow-blue-100"></span>
          Personal Case History
        </h3>
        
        {complaints.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-50">
            <div className="bg-slate-50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-2xl font-black tracking-tight mb-4">Registry is currently empty.</p>
            <button onClick={onFileComplaint} className="text-blue-600 font-black uppercase text-xs tracking-[0.3em] hover:text-blue-800 transition-colors">Begin first report process</button>
          </div>
        ) : (
          <div className="grid xl:grid-cols-2 gap-10">
            {complaints.map(c => (
              <div 
                key={c.id}
                onClick={() => onViewDetail(c.id)}
                className="group bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-3 transition-all cursor-pointer flex flex-col sm:flex-row gap-10 items-center overflow-hidden relative"
              >
                <div className="w-full sm:w-48 h-48 flex-shrink-0 relative">
                  <img src={c.imageUrl} className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-110" alt="Issue" />
                </div>
                <div className="flex-grow space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">ID: {c.id}</span>
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      c.status === IssueStatus.SUBMITTED ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      c.status === IssueStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tighter">
                    {c.category}
                  </h3>
                  <p className="text-slate-500 line-clamp-2 text-sm font-medium leading-relaxed">{c.description}</p>
                  <div className="flex items-center space-x-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
