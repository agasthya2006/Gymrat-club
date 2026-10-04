// src/pages/OnboardingAthletePage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoStore } from '../demo/mockStore';
import { api } from '../services/api';

export const OnboardingAthletePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(() => {
    if (user?.name && !user.name.toLowerCase().includes('alex morgan')) return user.name;
    const stored = localStorage.getItem('gymrat_user_name');
    if (stored && !stored.toLowerCase().includes('alex morgan')) return stored;
    return 'Agasthya';
  });
  const [age, setAge] = useState('21');
  const [height, setHeight] = useState('178 cm');
  const [weight, setWeight] = useState('72 kg');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [objective, setObjective] = useState<'muscle' | 'strength' | 'cut' | 'endurance' | 'general'>('strength');
  const [frequency, setFrequency] = useState<'2-3' | '4-5' | '6+'>('4-5');
  const [trainingWindow, setTrainingWindow] = useState<'morning' | 'afternoon' | 'evening'>('evening');

  // Loader state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('CONFIGURING PERFORMANCE TARGETS... 0%');

  const handleContinue = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStatus(`CONFIGURING ${objective.toUpperCase()} MESO-CYCLE... 0%`);

    const finalName = fullName.trim() || 'Agasthya';
    localStorage.setItem('gymrat_user_name', finalName);
    if (updateUser) {
      updateUser({ name: finalName });
    }
    demoStore.update(s => {
      s.member.name = finalName;
      const weightNum = parseFloat(weight.replace(/[^0-9.]/g, '')) || 72;
      s.member.weight = weightNum;
      s.member.goal = objective.charAt(0).toUpperCase() + objective.slice(1);
    });

    // Persist to backend if user is authenticated
    if (user) {
      try {
        const weightNum = parseFloat(weight.replace(/[^0-9.]/g, '')) || 72;
        await api.saveMemberGoals(user.id, {
          primary_goal: objective.toUpperCase(),
          current_weight: weightNum,
          target_weight: weightNum + (objective === 'muscle' || objective === 'strength' ? 4 : -3),
          weekly_target_sessions: frequency === '2-3' ? 3 : frequency === '4-5' ? 5 : 6,
          target_date: '2026-12-31',
          preferred_days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
          preferred_time: trainingWindow.toUpperCase()
        });
      } catch (err) {
        console.warn('Goals saved locally:', err);
      }
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadingProgress(100);
        setLoadingStatus('PROFILE INITIALIZED // PROCEEDING TO TARGETS');

        setTimeout(() => {
          navigate('/member/dashboard');
        }, 600);
      } else {
        setLoadingProgress(progress);
        setLoadingStatus(`CONFIGURING ${objective.toUpperCase()} MESO-CYCLE... ${progress}%`);
      }
    }, 100);
  };

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
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E1F28] text-[#E1601B] font-bold">MEMBER</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">PROFILE SETUP</span>
            </div>
          </Link>

          {/* Progress Track (Stage 02 of 04) */}
          <div className="flex flex-col items-center gap-2 w-full md:w-80">
            <div className="flex items-center justify-between w-full text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>
                Step 2 of 4
              </span>
              <span className="text-white font-semibold">Profile Setup</span>
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
            <span>Step 2: Tell Us About Yourself</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-white font-bold leading-tight">
            BUILD YOUR <span className="text-[#E1601B] drop-shadow-[0_0_28px_rgba(225,96,27,0.6)] [text-shadow:0_0_30px_rgba(225,96,27,0.7)]">ATHLETE PROFILE</span>
          </h1>
          
          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Configure your personal performance profile before entering the GYMRAT CLUB arena.
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
              
              {/* ================= LEFT SECTION: IDENTITY DATA ================= */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
                  <span className="material-symbols-outlined text-[#E1601B] text-lg">badge</span>
                  <span className="font-mono text-xs text-white uppercase font-bold tracking-wider">IDENTITY DATA</span>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    FULL NAME
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1601B] focus:ring-1 focus:ring-[#E1601B] transition-all font-sans"
                  />
                </div>

                {/* Age, Height, Weight in 3 Columns */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                      AGE
                    </label>
                    <input 
                      type="text" 
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1601B] font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                      HEIGHT
                    </label>
                    <input 
                      type="text" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1601B] font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                      CURRENT WEIGHT
                    </label>
                    <input 
                      type="text" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-[#0D0D11] border border-[#27272A] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#E1601B] font-mono text-center"
                    />
                  </div>
                </div>

                {/* Fitness Experience Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                    FITNESS EXPERIENCE
                  </label>
                  <div className="grid grid-cols-3 gap-2" id="exp-group">
                    <button 
                      type="button" 
                      onClick={() => setExperience('beginner')}
                      className={`exp-btn py-2 px-2 rounded-lg font-mono text-xs uppercase transition-all ${
                        experience === 'beginner'
                          ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                          : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                      }`}
                    >
                      BEGINNER
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setExperience('intermediate')}
                      className={`exp-btn py-2 px-2 rounded-lg font-mono text-xs uppercase transition-all ${
                        experience === 'intermediate'
                          ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                          : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                      }`}
                    >
                      INTERMEDIATE
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setExperience('advanced')}
                      className={`exp-btn py-2 px-2 rounded-lg font-mono text-xs uppercase transition-all ${
                        experience === 'advanced'
                          ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                          : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                      }`}
                    >
                      ADVANCED
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT SECTION: PERFORMANCE OBJECTIVE ================= */}
              <div className="lg:col-span-7 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#E1601B] text-lg">track_changes</span>
                    <span className="font-mono text-xs text-white uppercase font-bold tracking-wider">PERFORMANCE OBJECTIVE</span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500">SELECT ONE PRIMARY GOAL</span>
                </div>

                <p className="font-display text-sm tracking-wider uppercase text-zinc-300 font-bold">
                  WHAT ARE YOU TRAINING FOR?
                </p>

                {/* Objective Selectable Cards Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="objective-group">
                  
                  {/* 1. MUSCLE */}
                  <div 
                    onClick={() => setObjective('muscle')}
                    className={`obj-card p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 group ${
                      objective === 'muscle'
                        ? 'active-glow bg-[#1E1F28] border border-[#E1601B]'
                        : 'bg-[#0D0D11] border border-[#27272A] hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-[#14151C] flex items-center justify-center shrink-0 mt-0.5 ${
                      objective === 'muscle' ? 'text-[#E1601B]' : 'text-zinc-400 group-hover:text-white'
                    }`}>
                      <span className="material-symbols-outlined text-base">fitness_center</span>
                    </div>
                    <div>
                      <h3 className="font-display text-sm uppercase text-white font-bold tracking-wide flex items-center gap-1.5">
                        MUSCLE
                        {objective === 'muscle' && <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>}
                      </h3>
                      <p className="font-sans text-xs text-zinc-400 leading-tight">Build lean muscle and size</p>
                    </div>
                  </div>

                  {/* 2. STRENGTH */}
                  <div 
                    onClick={() => setObjective('strength')}
                    className={`obj-card p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 group ${
                      objective === 'strength'
                        ? 'active-glow bg-[#1E1F28] border border-[#E1601B]'
                        : 'bg-[#0D0D11] border border-[#27272A] hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-[#14151C] flex items-center justify-center shrink-0 mt-0.5 ${
                      objective === 'strength' ? 'text-[#E1601B]' : 'text-zinc-400 group-hover:text-white'
                    }`}>
                      <span className="material-symbols-outlined text-base">bolt</span>
                    </div>
                    <div>
                      <h3 className="font-display text-sm uppercase text-white font-bold tracking-wide flex items-center gap-1.5">
                        STRENGTH
                        {objective === 'strength' && <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>}
                      </h3>
                      <p className="font-sans text-xs text-zinc-300 leading-tight">Increase power and lifting performance</p>
                    </div>
                  </div>

                  {/* 3. CUT */}
                  <div 
                    onClick={() => setObjective('cut')}
                    className={`obj-card p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 group ${
                      objective === 'cut'
                        ? 'active-glow bg-[#1E1F28] border border-[#E1601B]'
                        : 'bg-[#0D0D11] border border-[#27272A] hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-[#14151C] flex items-center justify-center shrink-0 mt-0.5 ${
                      objective === 'cut' ? 'text-[#E1601B]' : 'text-zinc-400 group-hover:text-white'
                    }`}>
                      <span className="material-symbols-outlined text-base">local_fire_department</span>
                    </div>
                    <div>
                      <h3 className="font-display text-sm uppercase text-white font-bold tracking-wide flex items-center gap-1.5">
                        CUT
                        {objective === 'cut' && <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>}
                      </h3>
                      <p className="font-sans text-xs text-zinc-400 leading-tight">Reduce body fat and improve definition</p>
                    </div>
                  </div>

                  {/* 4. ENDURANCE */}
                  <div 
                    onClick={() => setObjective('endurance')}
                    className={`obj-card p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 group ${
                      objective === 'endurance'
                        ? 'active-glow bg-[#1E1F28] border border-[#E1601B]'
                        : 'bg-[#0D0D11] border border-[#27272A] hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-[#14151C] flex items-center justify-center shrink-0 mt-0.5 ${
                      objective === 'endurance' ? 'text-[#E1601B]' : 'text-zinc-400 group-hover:text-white'
                    }`}>
                      <span className="material-symbols-outlined text-base">cardiology</span>
                    </div>
                    <div>
                      <h3 className="font-display text-sm uppercase text-white font-bold tracking-wide flex items-center gap-1.5">
                        ENDURANCE
                        {objective === 'endurance' && <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>}
                      </h3>
                      <p className="font-sans text-xs text-zinc-400 leading-tight">Improve stamina and conditioning</p>
                    </div>
                  </div>

                  {/* 5. GENERAL (Spans 2 columns on sm+) */}
                  <div 
                    onClick={() => setObjective('general')}
                    className={`obj-card sm:col-span-2 p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 group ${
                      objective === 'general'
                        ? 'active-glow bg-[#1E1F28] border border-[#E1601B]'
                        : 'bg-[#0D0D11] border border-[#27272A] hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-[#14151C] flex items-center justify-center shrink-0 mt-0.5 ${
                      objective === 'general' ? 'text-[#E1601B]' : 'text-zinc-400 group-hover:text-white'
                    }`}>
                      <span className="material-symbols-outlined text-base">accessibility_new</span>
                    </div>
                    <div>
                      <h3 className="font-display text-sm uppercase text-white font-bold tracking-wide flex items-center gap-1.5">
                        GENERAL FITNESS
                        {objective === 'general' && <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]"></span>}
                      </h3>
                      <p className="font-sans text-xs text-zinc-400 leading-tight">Improve overall functional health, mobility, and everyday energy</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* ================= LOWER SECTION: TRAINING FREQUENCY & WINDOW ================= */}
            <div className="pt-5 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              
              {/* Frequency */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E1601B]">event_repeat</span>
                  PREFERRED TRAINING FREQUENCY
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['2-3', '4-5', '6+'] as const).map(freq => (
                    <button 
                      key={freq}
                      type="button" 
                      onClick={() => setFrequency(freq)}
                      className={`freq-btn py-2.5 rounded-lg font-mono text-xs transition-all ${
                        frequency === freq
                          ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                          : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                      }`}
                    >
                      {freq === '6+' ? '6+ DAYS' : `${freq} DAYS`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Window */}
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E1601B]">schedule</span>
                  PREFERRED TRAINING WINDOW
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map(win => (
                    <button 
                      key={win}
                      type="button" 
                      onClick={() => setTrainingWindow(win)}
                      className={`win-btn py-2.5 rounded-lg font-mono text-xs uppercase transition-all ${
                        trainingWindow === win
                          ? 'active-glow bg-[#1E1F28] border border-[#E1601B] text-white font-bold'
                          : 'bg-[#0D0D11] border border-[#27272A] text-zinc-400 hover:text-white font-semibold'
                      }`}
                    >
                      {win}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Clean Profile Completion Status */}
            <div className="pt-4 border-t border-zinc-800/80 bg-[#0D0D11]/60 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:p-5 rounded-b-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-2">
                <div>Profile: <span className="text-white font-medium">In Progress</span></div>
                <div>Completion: <span className="text-emerald-400 font-bold">50%</span></div>
              </div>

              {/* Progress Bar */}
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
              <span>CONTINUE TO ARENA DASHBOARD</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1.5 transition-transform">arrow_forward</span>
            </button>

            <Link to="/member/dashboard" className="font-mono text-xs text-zinc-500 hover:text-zinc-300 tracking-wider uppercase transition-colors">
              SAVE &amp; COMPLETE LATER
            </Link>
          </div>

          <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest pt-1">
            GYMRAT CLUB BIOMETRICS PROTOCOL • LOCAL TERMINAL ENCRYPTED
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
                  SAVING ATHLETE PROFILE &amp; TARGETS
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
