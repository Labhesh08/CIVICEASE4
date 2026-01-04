
import React, { useState, useEffect, useRef } from 'react';
import { User, Complaint, IssueStatus } from '../types';
import { categorizeIssue, geocodeAddress } from '../services/geminiService';
import { saveComplaint } from '../services/mockStore';

interface SubmitComplaintProps {
  user: User;
  onSuccess: (complaintId: string) => void;
}

const SubmitComplaint: React.FC<SubmitComplaintProps> = ({ user, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: 18.5204, lng: 73.8567 });
  const [searchingMap, setSearchingMap] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn('GPS signal weak, using default location', err)
      );
    }
  }, []);

  const handleMapSearch = async () => {
    if (!address.trim()) {
      alert("Please enter a specific address to locate on the digital registry.");
      return;
    }
    setSearchingMap(true);
    try {
      const coords = await geocodeAddress(address);
      setLocation(coords);
    } catch (err) {
      alert("Address resolution timeout. Please refine your input.");
    } finally {
      setSearchingMap(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
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
      alert("Registry Alert: Camera access denied or unavailable.");
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
        setImage(dataUrl);
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

  const finalizeSubmission = async () => {
    if (!image) {
      alert("Photographic evidence is mandatory for case validation.");
      return;
    }
    setLoading(true);
    try {
      const aiData = await categorizeIssue(description);
      const newId = `CE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const newComplaint: Complaint = {
        id: newId,
        uid: user.id,
        name: fullName,
        email: email,
        mobile,
        address,
        description,
        category: aiData.category,
        department: aiData.department,
        helpline: aiData.helpline,
        imageUrl: image,
        status: IssueStatus.SUBMITTED,
        location,
        createdAt: Date.now(),
      };

      saveComplaint(newComplaint);
      setGeneratedId(newId);
      setStep(3); 
    } catch (err) {
      alert('AI synchronization failure. Transmission aborted.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 animate-in zoom-in duration-700">
        <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] p-12 md:p-24 border border-emerald-100 text-center">
          <div className="w-32 h-32 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-emerald-200 animate-bounce">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">Case Indexed Successfully</h2>
          <div className="inline-block px-8 py-3 bg-slate-100 rounded-2xl text-blue-600 font-black text-xl mb-10 tracking-widest uppercase">
            ID: {generatedId}
          </div>
          
          <div className="max-w-md mx-auto space-y-8 mb-16">
            <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
              <div className="flex items-center space-x-4 mb-4 justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Confirmation Mail Sent</span>
              </div>
              <p className="text-slate-600 font-medium italic">
                A digital receipt and tracking dossier have been transmitted to <span className="text-slate-900 font-bold">{email}</span>.
              </p>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60">CvicEase by-Syntax-tic.4 Registry Synchronized</p>
          </div>

          <button 
            onClick={() => generatedId && onSuccess(generatedId)}
            className="w-full py-8 bg-[#2563EB] text-white rounded-full text-2xl font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-2 active:translate-y-0 active:scale-95 uppercase tracking-widest"
          >
            Access Case Dossier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex items-center justify-between mb-20 px-16 relative">
        <div className="absolute top-1/2 left-[20%] right-[20%] h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>
        {[1, 2].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-3xl flex items-center justify-center font-black transition-all transform duration-500 ${step >= s ? 'bg-[#2563EB] text-white shadow-2xl scale-110' : 'bg-white text-slate-200 border-2 border-slate-50'}`}>
              {s}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-4 ${step >= s ? 'text-blue-600' : 'text-slate-300'}`}>
              {s === 1 ? 'Data Entry' : 'Verification'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] p-12 md:p-20 border border-slate-50">
        {step === 1 ? (
          <div className="space-y-12">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase tracking-widest">Submit Case File</h2>
              <p className="text-slate-500 font-medium text-lg italic">Provide infrastructure details for regional dispatch.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 font-bold transition-all outline-none"
                  placeholder="Official Name" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dispatch Email</label>
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[2rem] focus:ring-4 focus:ring-blue-100 font-bold transition-all outline-none"
                  placeholder="contact@email.com" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Hotline</label>
                <input 
                  required 
                  type="tel" 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 font-bold transition-all outline-none shadow-inner"
                  placeholder="+91 Mobile Number" 
                />
              </div>
              <div className="space-y-3 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spatial Location</label>
                <div className="relative">
                  <input 
                    required 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 font-bold pr-20 transition-all outline-none shadow-inner"
                    placeholder="Search address or landmark..." 
                  />
                  <button 
                    onClick={handleMapSearch} 
                    disabled={searchingMap}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-[#2563EB] text-white shadow-xl rounded-2xl hover:bg-blue-700 transition-all transform active:scale-90"
                  >
                    <svg className={`w-6 h-6 ${searchingMap ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] h-[450px] relative overflow-hidden group shadow-2xl border-8 border-white">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
                allowFullScreen
                className={`transition-opacity duration-1000 ${searchingMap ? 'opacity-30' : 'opacity-100'}`}
              ></iframe>
              
              {searchingMap && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white font-black uppercase text-xs tracking-widest">Satellite Indexing...</span>
                  </div>
                </div>
              )}

              <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 z-20">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Map Intelligence Core Active</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observational Narrative</label>
              <textarea 
                required 
                rows={5} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-10 py-8 bg-slate-50 border-none rounded-[3rem] focus:ring-4 focus:ring-blue-100 font-bold resize-none transition-all outline-none leading-relaxed shadow-inner"
                placeholder="Briefly explain the infrastructure issue..." 
              />
            </div>

            <button 
              onClick={() => setStep(2)} 
              disabled={!description || !address || !fullName || !email || searchingMap}
              className="w-full py-7 bg-[#2563EB] text-white rounded-full text-xl font-black shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-slate-100 disabled:text-slate-300 uppercase tracking-widest"
            >
              Next: Visual Evidence
            </button>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-16 duration-700">
            <div className="text-center">
              <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase tracking-widest">Visual Entry</h2>
              <p className="text-slate-500 font-medium text-lg italic">Attach photographic proof via direct capture or system upload.</p>
            </div>

            <div 
              className={`relative border-8 border-dashed rounded-[4rem] h-[550px] flex flex-col items-center justify-center transition-all duration-700 group ${image && !isCameraActive ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-50 bg-slate-50/50 hover:border-blue-400 hover:bg-white'}`}
            >
              {isCameraActive ? (
                <div className="w-full h-full p-4 relative flex flex-col items-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white" />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-10 flex space-x-6">
                    <button 
                      onClick={capturePhoto}
                      className="bg-blue-600 text-white p-6 rounded-full shadow-2xl hover:bg-blue-700 active:scale-90 transition-all border-4 border-white"
                    >
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={stopCamera}
                      className="bg-slate-800/80 backdrop-blur-md text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : image ? (
                <div className="w-full h-full p-8 relative" onClick={() => !isCameraActive && setIsCameraActive(false)}>
                  <img src={image} className="w-full h-full object-cover rounded-[3.5rem] shadow-2xl border-8 border-white" alt="Evidence" />
                  <div className="absolute top-12 right-12 flex flex-col space-y-4">
                    <button 
                      onClick={() => setImage(null)}
                      className="bg-red-500 text-white p-4 rounded-2xl shadow-xl hover:bg-red-600 transition-all active:scale-95"
                    >
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="absolute bottom-12 right-12 bg-emerald-600 text-white p-5 rounded-3xl shadow-2xl animate-in zoom-in duration-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-12">
                  <div className="flex space-x-12 justify-center">
                    <button 
                      onClick={() => document.getElementById('capture-trigger')?.click()}
                      className="flex flex-col items-center space-y-4 group"
                    >
                      <div className="w-24 h-24 bg-blue-100 rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-2xl shadow-blue-50 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload File</span>
                    </button>
                    <button 
                      onClick={startCamera}
                      className="flex flex-col items-center space-y-4 group"
                    >
                      <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Click Photo</span>
                    </button>
                  </div>
                  <input id="capture-trigger" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              )}
            </div>

            <div className="flex space-x-8">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 py-7 bg-slate-100 text-slate-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
              >
                Return to Data
              </button>
              <button 
                onClick={finalizeSubmission} 
                disabled={loading || !image || isCameraActive}
                className="flex-[2] py-7 bg-[#2563EB] text-white rounded-full font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 uppercase tracking-widest"
              >
                {loading ? 'Transmitting Registry...' : 'Authorize Case File'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitComplaint;
