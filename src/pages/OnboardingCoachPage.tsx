// src/pages/OnboardingCoachPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const OnboardingCoachPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.name || 'Ryan Thomas');
  const [experienceYears, setExperienceYears] = useState('8 Years');
  const [bio, setBio] = useState('Elite strength & conditioning specialist. 8+ years developing competitive athletes and physique transformations.');
  const [certifications, setCertifications] = useState<string[]>(['NASM', 'NSCA']);
  const [specializations, setSpecializations] = useState<string[]>(['STRENGTH', 'MUSCLE BUILDING']);
  const [sessionTypes, setSessionTypes] = useState<string[]>(['PERSONAL TRAINING', 'GROUP TRAINING']);

  // Loader State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('INITIALIZING TRAINING CALENDAR... 0%');

  const toggleCert = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(certifications.filter(c => c !== cert));
    } else {
      setCertifications([...certifications, cert]);
    }
  };

  const toggleSpec = (spec: string) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter(s => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const toggleSession = (sess: string) => {
    if (sessionTypes.includes(sess)) {
      setSessionTypes(sessionTypes.filter(s => s !== sess));
    } else {
      setSessionTypes([...sessionTypes, sess]);
    }
  };

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStatus('CONFIGURING COACH AVAILABILITY SLOTS... 0%');

    // Persist to backend
    if (user) {
      try {
        const years = parseInt(experienceYears.replace(/[^0-9]/g, '')) || 8;
        await api.updateCoach(user.id, {
          callsign: fullName.split(' ')[0].toUpperCase() || 'COACH',
          bio,
          hourly_rate: 95,
          experience_years: years,
          specialties: specializations,
          certifications
        });
      } catch (err) {
        console.warn('Coach profile saved locally:', err);
      }
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadingProgress(100);
        setLoadingStatus('COACH PROFILE SAVED // LOADING ROSTER MATRIX');

        setTimeout(() => {
          navigate('/coach/dashboard');
        }, 600);
      } else {
        setLoadingProgress(progress);
        setLoadingStatus(`CONFIGURING COACH AVAILABILITY SLOTS... ${progress}%`);
      }
    }, 100);
  };

  const allCerts = ['ACE', 'NASM', 'ISSA', 'NSCA', 'OTHER'];

  const specsList = [
    { id: 'STRENGTH', title: 'STRENGTH', desc: 'Power & lifting performance', icon: 'fitness_center' },
    { id: 'MUSCLE BUILDING', title: 'MUSCLE BUILDING', desc: 'Hypertrophy & physique', icon: 'bolt' },
    { id: 'WEIGHT LOSS', title: 'WEIGHT LOSS', desc: 'Fat loss & conditioning', icon: 'local_fire_department' },
    { id: 'FUNCTIONAL', title: 'FUNCTIONAL', desc: 'Movement & athletic performance', icon: 'accessibility_new' },
    { id: 'HIIT', title: 'HIIT', desc: 'High intensity conditioning', icon: 'speed' },
    { id: 'MOBILITY', title: 'MOBILITY', desc: 'Flexibility & movement', icon: 'self_improvement' },
    { id: 'SPORTS PERFORMANCE', title: 'SPORTS PERFORMANCE', desc: 'Sport-specific power, agility, and elite athletic conditioning', icon: 'trophy', span: 2 },
  ];

  const allSessionTypes = ['PERSONAL TRAINING', 'GROUP TRAINING', 'ONLINE COACHING'];

  return (
    <div className="bg-[#070709] text-white font-sans antialiased min-h-screen relative flex flex-col justify-between selection:bg-[#E1601B] selection:text-white select-none">
      
      {/* Cinematic Background & Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <img 
          src="/hero_bg.png" 
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero_bg.jpg'; }} 
          alt="Gym Atmosphere" 
          className="w-full h-full object-cover object-center opacity-25 filter grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/85 to-[#070709]/95"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(7,7,9,0.9)_100%)]"></div>
      </div>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:28px_28px] opacity-20"></div>
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="w-[700px] h-[550px] rounded-full bg-[#E1601B]/10 blur-[150px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between min-h-screen">
        
        {/* 1. TOP SYSTEM NAVIGATION & TELEMETRY */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800/50">
          {/* Brand Lockup */}
          <Link to="/role-select" className="flex items-center gap-3 group" title="Return to Role Selection">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#14151C] border border-[#27272A] shadow-md overflow-hidden group-hover:border-[#E1601B] transition-colors">
              <img src="/gymrat_badge.png" alt="GymRat Mascot" className="w-9 h-9 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"/>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg tracking-wider uppercase text-white font-bold">GYMRAT CLUB</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E1F28] text-[#E1601B] font-bold">COACH</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">COACH ONBOARDING</span>
            </div>
          </Link>

          {/* Progress Track (Step 2 of 4) */}
          <div className="flex flex-col items-center gap-2 w-full md:w-80">
            <div className="flex items-center justify-between w-full text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>
                Step 2 of 4
              </span>
              <span className="text-white font-semibold">Coach Profile</span>
            </div>
            {/* Progress Bar: 2/4 (50%) filled */}
            <div className="w-full h-1.5 bg-[#1E1F28] rounded-full overflow-hidden flex">
              <div className="w-1/2 h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] rounded-full shadow-[0_0_12px_rgba(225,96,27,0.8)] transition-all duration-500"></div>
              <div className="w-1/2 h-full bg-transparent"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-end gap-3 w-full md:w-auto">
            <Link to="/role-select" className="text-xs text-zinc-400 hover:text-white transition-colors">
              Change Role
            </Link>
          </div>
        </header>

        {/* 2. MAIN HEADER & DIRECTIVE */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-5 pb-3 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14151C] border border-zinc-800 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#E1601B]"></span>
            <span>Step 2: Setup Your Coach Profile</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white font-bold leading-tight">
            INITIALIZE YOUR <span className="text-[#E1601B] drop-shadow-[0_0_28px_rgba(225,96,27,0.6)] [text-shadow:0_0_30px_rgba(225,96,27,0.7)]">COACH PROFILE</span>
          </h1>
          
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Configure your professional profile so athletes can discover, book and train with you.
          </p>
        </div>

        {/* 3. CENTERED WIDE PROFILE SETUP INTERFACE */}
        <main className="w-full max-w-5xl mx-auto my-auto py-2">
          <div className="relative bg-[#14151C]/90 backdrop-blur-md border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden space-y-6">
            
            {/* Reticle Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E1601B]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E1601B]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E1601B]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E1601B]"></div>

            {/* TOP TWO SECTIONS GRID (LEFT & RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* ================= LEFT SECTION: COACH IDENTITY ================= */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
                  <span className="material-symbols-outlined text-[#E1601B] text-lg">badge</span>
                  <span className="font-mono text-xs text-white uppercase font-bold tracking-wider">COACH IDENTITY</span>
                </div>

                {/* Profile Photo Upload */}
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    PROFILE PHOTO
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl bg-[#0D0D11] border-2 border-dashed border-[#E1601B]/50 hover:border-[#E1601B] transition-colors flex flex-col items-center justify-center cursor-pointer group shadow-inner">
                      <span className="material-symbols-outlined text-zinc-400 group-hover:text-[#E1601B] transition-colors text-2xl">add_a_photo</span>
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E1601B] animate-pulse"></div>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <button type="button" className="text-xs font-mono font-semibold text-white bg-[#1E1F28] hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors">
                        UPLOAD PHOTO
                      </button>
                      <p className="font-mono text-[10px] text-zinc-500">PNG, JPG UP TO 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Full Name & Years Experience */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                      FULL NAME
                    </label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1601B] font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                      EXPERIENCE
                    </label>
                    <input 
                      type="text" 
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1601B] font-mono text-center"
                    />
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    PROFESSIONAL BIO
                  </label>
                  <textarea 
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short professional introduction..."
                    className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#E1601B] font-sans resize-none"
                  />
                </div>

                {/* Certifications (Multi-Select) */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                    <span>CERTIFICATIONS</span>
                    <span className="text-[10px] text-zinc-500 font-normal">MULTI-SELECT</span>
                  </label>
                  <div className="grid grid-cols-5 gap-1.5" id="cert-group">
                    {allCerts.map((cert) => {
                      const isSelected = certifications.includes(cert);
                      return (
                        <button 
                          key={cert}
                          type="button" 
                          onClick={() => toggleCert(cert)}
                          className={`cert-btn py-1.5 px-1 rounded-lg font-mono text-xs transition-all ${
                            isSelected
                              ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                              : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                          }`}
                        >
                          {cert}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ================= RIGHT SECTION: TRAINING SPECIALIZATION ================= */}
              <div className="lg:col-span-7 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E1601B] text-lg">track_changes</span>
                    <span className="font-mono text-xs text-white uppercase font-bold tracking-wider">TRAINING SPECIALIZATION</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">MULTI-SELECT ALLOWED</span>
                </div>

                <p className="font-display text-sm tracking-wider uppercase text-zinc-300 font-bold">
                  DEFINE YOUR TRAINING DOMAIN
                </p>

                {/* Specialization Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="spec-group">
                  {specsList.map(item => {
                    const isSelected = specializations.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleSpec(item.id)}
                        className={`spec-card p-2.5 rounded-xl cursor-pointer transition-all flex items-start gap-2.5 ${
                          item.span === 2 ? 'sm:col-span-2' : ''
                        } ${
                          isSelected
                            ? 'active-glow bg-[#1E1F28] border border-[#E1601B]'
                            : 'bg-[#0D0D11] border border-[#27272A] hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg bg-[#14151C] flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'text-[#E1601B]' : 'text-zinc-400'
                        }`}>
                          <span className="material-symbols-outlined text-sm">{item.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-display text-xs uppercase text-white font-bold tracking-wide flex items-center gap-1">
                            {item.title}
                            {isSelected && <span className="w-1 h-1 rounded-full bg-[#E1601B]"></span>}
                          </h3>
                          <p className="font-sans text-[11px] text-zinc-400 leading-tight">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ================= SESSION TYPES (BELOW SPECIALIZATION) ================= */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
                    <span>AVAILABLE SESSION TYPES</span>
                    <span className="text-[10px] text-zinc-500 font-normal">MULTI-SELECT</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2" id="session-group">
                    {allSessionTypes.map(sess => {
                      const isSelected = sessionTypes.includes(sess);
                      return (
                        <button 
                          key={sess}
                          type="button" 
                          onClick={() => toggleSession(sess)}
                          className={`session-btn py-2 px-2 rounded-lg font-mono text-xs transition-all ${
                            isSelected
                              ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                              : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                          }`}
                        >
                          {sess}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Clean Coach Status */}
            <div className="pt-4 border-t border-zinc-800/80 bg-[#0D0D11]/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:p-5 rounded-b-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
                <div>Certification: <span className="text-amber-400 font-semibold">Verified</span></div>
                <div>Profile Completion: <span className="text-emerald-400 font-bold">50%</span></div>
              </div>

              {/* Progress Bar (50%) */}
              <div className="w-full h-1.5 bg-[#1E1F28] rounded-full overflow-hidden">
                <div className="w-[50%] h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] shadow-[0_0_10px_rgba(225,96,27,0.7)] transition-all duration-300"></div>
              </div>
            </div>

          </div>
        </main>

        {/* 4. PRIMARY ACTIONS FOOTER */}
        <footer className="w-full flex flex-col items-center gap-3 pt-3 pb-3">
          <div className="w-full max-w-md flex flex-col items-center gap-2.5">
            <button 
              onClick={() => handleContinue()}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-lg uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,96,27,0.5)] hover:shadow-[0_0_45px_rgba(225,96,27,0.7)] active:scale-[0.98] cursor-pointer group"
            >
              <span>CONTINUE TO COACH DASHBOARD</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
            </button>

            <Link to="/coach/dashboard" className="font-mono text-xs text-zinc-500 hover:text-zinc-300 tracking-wider uppercase transition-colors">
              SAVE &amp; COMPLETE LATER
            </Link>
          </div>

          <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest pt-1">
            GYMRAT CLUB COACH NETWORK • FIDO2 ENCRYPTED TERMINAL
          </div>
        </footer>

      </div>

      {/* FULLSCREEN TACTICAL 3D DUMBBELL LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-[#E1601B]/50 animate-spin p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-[#E1601B] shadow-[0_0_40px_rgba(225,96,27,0.7)] overflow-hidden bg-white flex items-center justify-center relative p-3">
                <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
                  <source src="/dumbbell_loader.mp4" type="video/mp4" />
                  <source src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/dumbbell-animation-gif-download-8083241.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2.5 text-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E1601B] animate-ping"></span>
                <span className="font-display text-lg tracking-[0.2em] text-white uppercase font-bold">
                  SYNCHRONIZING COACH PROFILE
                </span>
              </div>
              <div className="w-64 h-1.5 bg-[#1E1F28] rounded-full overflow-hidden mt-1 border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] shadow-[0_0_12px_#E1601B] transition-all duration-150"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <span className={`font-mono text-xs tracking-widest mt-1 ${loadingProgress === 100 ? 'text-[#E1601B] font-bold' : 'text-zinc-400'}`}>
                {loadingStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
