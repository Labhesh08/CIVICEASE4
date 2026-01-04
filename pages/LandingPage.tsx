
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden">
      {/* Hero Section - Clean & High Impact */}
      <section className="relative pt-32 pb-40">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-50/40 -skew-x-12 transform origin-top-right -z-10"></div>
        <div className="max-w-7xl mx-auto px-10">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center space-x-3 px-6 py-2.5 mb-10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 bg-white shadow-xl shadow-blue-100/50 rounded-full border border-blue-50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>CvicEase by-Syntax-tic.4</span>
            </div>
            
            <h1 className="text-8xl md:text-[9.5rem] font-black text-slate-900 leading-[0.85] mb-12 tracking-tighter">
              CvicEase <br />
              <span className="text-blue-600">Protocol.</span>
            </h1>
            
            <div className="grid md:grid-cols-2 gap-16 items-start mb-16">
              <p className="text-2xl text-slate-500 leading-relaxed font-medium italic border-l-8 border-blue-600 pl-10">
                The ultimate AI-driven interface for civic accountability. Report, track, and resolve infrastructure issues with sub-second precision.
              </p>
              <div className="flex flex-col space-y-6 justify-center">
                <button 
                  onClick={onGetStarted}
                  className="w-full md:w-fit bg-[#2563EB] text-white px-16 py-8 rounded-full text-xl font-black shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all hover:-translate-y-2 active:translate-y-0 active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center space-x-4"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Submit Complaint</span>
                </button>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center md:text-left">Immediate Registry Access</p>
              </div>
            </div>

            {/* Live Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 max-w-5xl">
              {[
                { label: 'Uptime', value: '99.9%' },
                { label: 'Resolutions', value: '5.1k+' },
                { label: 'Latency', value: '0.8s' },
                { label: 'Protocol', value: 'Alpha v.4' },
              ].map((stat, i) => (
                <div key={i} className="px-8 py-6 rounded-[1.8rem] bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Grid of Capabilities */}
      <section className="bg-slate-900 py-40">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="text-5xl font-black text-white tracking-tighter">
              Governance <br />
              Tech Stack.
            </h2>
            <div className="h-0.5 flex-grow bg-white/10 mx-10 mb-6 hidden md:block"></div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Architecture Overview</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                title: "AI Routing",
                desc: "Powered by Gemini 3 Flash for near-instant categorization and regional dispatch routing.",
                num: "01"
              },
              {
                title: "Spatial Index",
                desc: "High-precision coordinate mapping ensures officers reach the exact site of impact.",
                num: "02"
              },
              {
                title: "Email Verification",
                desc: "Automated Gmail API integration for instant receipts and status change notifications.",
                num: "03"
              }
            ].map((pillar, idx) => (
              <div key={idx} className="group p-12 rounded-[3.5rem] border border-white/10 hover:bg-white transition-all duration-700 hover:scale-[1.02] cursor-default">
                <span className="text-blue-600 font-black text-5xl mb-10 block group-hover:scale-110 transition-transform">{pillar.num}</span>
                <h3 className="text-3xl font-black text-white group-hover:text-slate-900 mb-6 tracking-tight transition-colors">{pillar.title}</h3>
                <p className="text-slate-400 group-hover:text-slate-500 font-medium leading-relaxed transition-colors">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;