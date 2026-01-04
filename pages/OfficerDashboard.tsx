
import React, { useState, useEffect } from 'react';
import { User, Complaint, IssueStatus } from '../types';
import { getComplaints, updateComplaintStatus } from '../services/mockStore';

interface OfficerDashboardProps {
  user: User;
  onViewDetail: (id: string) => void;
}

const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ user, onViewDetail }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<IssueStatus | 'All'>('All');

  useEffect(() => {
    setComplaints(getComplaints());
  }, []);

  const filteredComplaints = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Dispatch Center</h2>
          <p className="text-slate-500">Monitoring civic grievances across all departments.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          {(['All', IssueStatus.SUBMITTED, IssueStatus.IN_PROGRESS, IssueStatus.RESOLVED] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-gov shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Complaint ID</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Citizen</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredComplaints.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-black text-blue-600 text-sm">{c.id}</td>
                <td className="px-8 py-6">
                  <div className="text-sm font-bold text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.mobile}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-bold text-slate-700">{c.category}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    c.status === IssueStatus.SUBMITTED ? 'bg-amber-50 text-amber-600' :
                    c.status === IssueStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => onViewDetail(c.id)}
                    className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredComplaints.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-medium">
            No complaints found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
