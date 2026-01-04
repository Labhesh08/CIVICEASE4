
import React, { useState, useRef } from 'react';
import { Complaint, User, UserRole, IssueStatus } from '../types';
import { updateComplaintStatus } from '../services/mockStore';
import { DEPARTMENTS } from '../constants';

interface ComplaintDetailProps {
  complaint: Complaint;
  user: User;
  onBack: () => void;
  onRefresh: () => void;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, user, onBack, onRefresh }) => {
  const [updating, setUpdating] = useState(false);
  const [resolutionImg, setResolutionImg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getDeptInfo = (cat: string) => {
    return (DEPARTMENTS[cat as keyof typeof DEPARTMENTS] as any) || DEPARTMENTS.Other;
  };

  const handleUpdateStatus = (newStatus: IssueStatus) => {
    if (newStatus === IssueStatus.RESOLVED && !resolutionImg && !complaint.resolutionImage) {
      alert('Official verification requires photographic repair proof for case closure.');
      return;
    }
    
    if (newStatus === complaint.status) return;

    setUpdating(true);
    setTimeout(() => {
      updateComplaintStatus(complaint.id, newStatus, resolutionImg || undefined);
      setUpdating(false);
      onRefresh();
      alert(`System Transmission Successful: Case transitioned to [${newStatus.toUpperCase()}]`);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setResolutionImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Dispatch Alert: Device camera access prohibited.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setResolutionImg(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const downloadPDF = () => {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26); doc.text("CvicEase by-Syntax-tic.4 OFFICIAL RECORD", 20, 30);
    doc.setFontSize(12); doc.setFont("helvetica", "normal");
    doc.text(`REGISTRY_ID: ${complaint.id}`, 20, 45);
    doc.text(`SERVICE_HUB: ${complaint.department}`, 20, 52);
    doc.text(`SUBMITTED_BY: ${complaint.name}`, 20, 59);
    doc.text(`REGISTRY_DATE: ${new Date(complaint.createdAt).toLocaleString()}`, 20, 66);
    doc.text(`LOCATION: ${complaint.address}`, 20, 73);
    doc.text(`GEO_COORDS: ${complaint.location.lat}, ${complaint.location.lng}`, 20, 80);
    doc.text(`STATUS_LOG: ${complaint.status}`, 20, 87);
    doc.save(`CASE_FILE_${complaint.id}.pdf`);
  };

  const deptInfo = getDeptInfo(complaint.category);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-1000">
      <button onClick={onBack} className="flex items-center space-x-3 text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-12 hover:text-blue-600 transition-all group">
        <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Secure Registry Portal</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          <div className="p-12 bg-[#2563EB] rounded-[4rem] border border-blue-400 shadow-2xl shadow-blue-100 text-white relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.5em] mb-4">Official Dispatch Hotline</h4>
                <div className="flex items-center space-x-6">
                  <div className="bg-white/20 p-5 rounded-3xl backdrop-blur-md">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-6xl font-black tracking-tighter">{complaint.helpline}</p>
                    <p className="text-xs font-bold text-blue-200 mt-2 uppercase tracking-[0.2em] opacity-80">24/7 Digital Protocol Active</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 md:mt-0 text-right">
                <span className="inline-block px-6 py-2 bg-emerald-500/20 rounded-full text-[10px] font-black text-emerald-300 uppercase tracking-[0.4em] border border-emerald-500/30">Registry Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[4rem] shadow-2xl p-12 md:p-20 border border-slate-50 relative overflow-hidden">
            <div className="absolute top-12 right-12">
              <span className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-lg border-2 ${
                complaint.status === IssueStatus.SUBMITTED ? 'bg-amber-50 text-amber-600 border-amber-100' :
                complaint.status === IssueStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {complaint.status}
              </span>
            </div>
            
            <div className="mb-20">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6 block">Regional Case Dossier</span>
              <h2 className="text-7xl font-black text-slate-900 mb-12 flex items-center tracking-tighter">
                <span className="mr-8 text-8xl drop-shadow-2xl">{deptInfo.emoji}</span>
                #{complaint.id}
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Service Domain</p>
                  <p className="text-3xl font-black text-slate-900">{complaint.category}</p>
                </div>
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Allocated Hub</p>
                  <p className="text-2xl font-black text-slate-900 leading-tight">{complaint.department}</p>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <div className="bg-slate-900 text-slate-200 p-12 rounded-[3.5rem] border-l-[16px] border-blue-600 shadow-2xl shadow-blue-900/10 italic text-2xl leading-relaxed">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] mb-8 not-italic">Statement Disclosure</p>
                "{complaint.description}"
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center">
                  <span className="w-4 h-4 bg-blue-600 rounded-full mr-6 shadow-[0_0_15px_rgba(37,99,235,0.6)]"></span> Photographic Registry Proof
                </h3>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="group relative overflow-hidden rounded-[3.5rem] shadow-2xl border-4 border-white">
                    <img src={complaint.imageUrl} className="w-full h-96 object-cover transition-transform duration-1000 group-hover:scale-110" alt="Capture Proof" />
                    <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-[10px] text-white font-black tracking-widest uppercase">Initial Entry</div>
                  </div>
                  {(complaint.resolutionImage || resolutionImg) && (
                    <div className="group relative overflow-hidden rounded-[3.5rem] shadow-2xl border-4 border-emerald-500/20 animate-in slide-in-from-right-10 duration-500">
                      <img src={resolutionImg || complaint.resolutionImage} className="w-full h-96 object-cover transition-transform duration-1000 group-hover:scale-110" alt="Repair Entry" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent flex items-end p-10">
                        <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Resolution Verification</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[4rem] shadow-2xl h-[500px] relative overflow-hidden border-[12px] border-white">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://maps.google.com/maps?q=${complaint.location.lat},${complaint.location.lng}&z=16&output=embed`}
              allowFullScreen
            ></iframe>
            
            <div className="absolute bottom-16 left-16 right-16 pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-xl p-10 rounded-[3rem] border border-white/20 shadow-2xl">
                <h4 className="text-white text-3xl font-black tracking-tighter mb-4 flex items-center uppercase tracking-widest">
                  <svg className="w-8 h-8 mr-4 text-blue-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" /></svg>
                  Spatial Index
                </h4>
                <p className="text-slate-400 font-bold text-lg max-w-2xl leading-relaxed">{complaint.address}</p>
                <div className="flex space-x-6 mt-6">
                  <div className="bg-blue-600/20 px-6 py-2 rounded-xl border border-blue-500/30 text-white font-black text-[10px] uppercase tracking-widest">
                    ID_LOC: {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          
          <div className="bg-white rounded-[4rem] shadow-2xl p-12 border border-slate-50">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12 flex items-center">
              <span className="w-2 h-6 bg-slate-200 rounded-full mr-4"></span> Reporter Profile
            </h3>
            <div className="space-y-12">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-inner">{complaint.name.charAt(0)}</div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Citizen</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight">{complaint.name}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Hotline</p>
                  <p className="font-bold text-slate-800 text-lg">{complaint.mobile}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated Email</p>
                  <p className="text-blue-600 font-bold break-all">{complaint.email}</p>
                </div>
              </div>
            </div>
            <button onClick={downloadPDF} className="w-full mt-12 py-6 bg-slate-900 text-white rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center space-x-4 hover:bg-black transition-all shadow-2xl transform active:scale-95">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Export Dossier</span>
            </button>
          </div>

          {user.role === UserRole.OFFICER && (
            <div className="bg-white rounded-[4rem] shadow-2xl p-12 border-8 border-blue-50/50">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-12 flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded-full mr-4 shadow-xl"></span> Dispatch CMD
              </h3>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] ml-2">Case Status Transition</label>
                  <div className="relative">
                    <select 
                      value={complaint.status} 
                      disabled={updating || complaint.status === IssueStatus.RESOLVED}
                      onChange={(e) => handleUpdateStatus(e.target.value as IssueStatus)}
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-xs uppercase tracking-widest appearance-none outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer shadow-inner disabled:opacity-50"
                    >
                      <option value={IssueStatus.SUBMITTED}>{IssueStatus.SUBMITTED}</option>
                      <option value={IssueStatus.IN_PROGRESS}>{IssueStatus.IN_PROGRESS}</option>
                      <option value={IssueStatus.RESOLVED}>{IssueStatus.RESOLVED}</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>

                {complaint.status === IssueStatus.SUBMITTED && (
                   <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest text-center px-6 leading-relaxed bg-amber-50 py-4 rounded-2xl border border-amber-100">Evidence not required for acknowledgement.</p>
                    <button 
                      disabled={updating} 
                      onClick={() => handleUpdateStatus(IssueStatus.IN_PROGRESS)}
                      className="w-full py-7 bg-blue-600 text-white rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-[0_25px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all active:scale-95"
                    >
                      {updating ? 'Updating Dispatch...' : 'Acknowledge Case'}
                    </button>
                  </div>
                )}

                {complaint.status === IssueStatus.IN_PROGRESS && (
                  <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
                    <div 
                      className={`relative border-8 border-dashed rounded-[3rem] p-12 transition-all flex flex-col items-center justify-center min-h-[300px] ${resolutionImg && !isCameraActive ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50/50 hover:border-blue-400'}`}
                    >
                      {isCameraActive ? (
                        <div className="w-full h-full p-2 relative flex flex-col items-center">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded-2xl shadow-xl border-2 border-white" />
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="flex space-x-4 mt-6">
                            <button 
                              onClick={capturePhoto}
                              className="bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-700 active:scale-90 transition-all"
                            >
                               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              onClick={stopCamera}
                              className="bg-slate-800 text-white px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest"
                            >
                              Exit
                            </button>
                          </div>
                        </div>
                      ) : resolutionImg ? (
                        <div className="text-center">
                          <img src={resolutionImg} className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 border-4 border-white shadow-xl" />
                          <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em]">Proof Index OK</p>
                          <button onClick={() => setResolutionImg(null)} className="text-[10px] text-red-500 font-bold uppercase mt-2">Clear</button>
                        </div>
                      ) : (
                        <div className="text-center w-full">
                          <div className="flex justify-center space-x-8">
                             <button 
                              onClick={() => document.getElementById('resol-upload-trigger')?.click()}
                              className="flex flex-col items-center space-y-2 group"
                            >
                              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-100 group-hover:text-blue-600 transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Upload</span>
                            </button>
                            <button 
                              onClick={startCamera}
                              className="flex flex-col items-center space-y-2 group"
                            >
                              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-blue-600">Camera</span>
                            </button>
                          </div>
                          <input id="resol-upload-trigger" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </div>
                      )}
                    </div>
                    
                    <button 
                      disabled={updating || !resolutionImg || isCameraActive} 
                      onClick={() => handleUpdateStatus(IssueStatus.RESOLVED)}
                      className={`w-full py-7 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-[0_25px_50px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center ${resolutionImg ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                      {updating ? 'Archiving Resolution...' : 'Sync & Mark Resolved'}
                    </button>
                  </div>
                )}

                {complaint.status === IssueStatus.RESOLVED && (
                  <div className="p-12 bg-emerald-50 rounded-[4rem] border-4 border-emerald-100 text-center shadow-inner animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="font-black text-emerald-800 uppercase text-[10px] tracking-[0.5em]">Case File Archived</p>
                    <p className="text-xs text-emerald-600 mt-4 font-bold uppercase tracking-widest italic">Officially Closed.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
