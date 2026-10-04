// src/pages/RoleSelectPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Users, Shield, Check, ArrowRight } from 'lucide-react';

export const RoleSelectPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'athlete' | 'coach' | 'owner'>('athlete');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { loginAsMember, loginAsCoach } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    athlete: {
      buttonText: 'Continue as Member',
      nextPath: '/onboarding/athlete'
    },
    coach: {
      buttonText: 'Continue as Coach',
      nextPath: '/onboarding/coach'
    },
    owner: {
      buttonText: 'Continue as Management',
      nextPath: '/admin-access'
    }
  };

  const handleContinue = () => {
    setIsLoading(true);
    setLoadingProgress(15);

    const authSync = (async () => {
      try {
        if (selectedRole === 'athlete') {
          await loginAsMember();
        } else if (selectedRole === 'coach') {
          await loginAsCoach();
        }
      } catch (err) {
        console.warn('Auth sync notice:', err);
      }
    })();

    let progress = 15;
    const interval = setInterval(async () => {
      progress += Math.floor(Math.random() * 20) + 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoadingProgress(100);

        await authSync;
        setTimeout(() => {
          navigate(roleConfig[selectedRole].nextPath);
        }, 300);
      } else {
        setLoadingProgress(progress);
      }
    }, 70);
  };

  return (
    <div className="bg-[#070709] text-white font-sans antialiased min-h-screen relative flex flex-col justify-between select-none">
      {/* Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="w-[600px] h-[400px] rounded-full bg-[#E1601B]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-between min-h-screen">
        
        {/* 1. TOP HEADER */}
        <header className="w-full flex items-center justify-between pb-6 border-b border-zinc-800/40">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#14151C] border border-zinc-800 group-hover:border-[#E1601B] transition-colors overflow-hidden">
              <img src="/gymrat_badge.png" alt="GymRat" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div>
              <span className="font-display text-base tracking-wider uppercase text-white font-bold block">
                GYMRAT CLUB
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Multi-Gym Network
              </span>
            </div>
          </Link>

          <Link
            to="/login"
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Already have an account? <span className="text-[#E1601B] font-semibold">Sign in</span>
          </Link>
        </header>

        {/* 2. TITLE SECTION */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto pt-8 pb-4 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14151C] border border-zinc-800 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#E1601B]" />
            <span>Step 1: Choose Your Account Type</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider text-white font-bold leading-tight">
            WHO ARE YOU <span className="text-[#E1601B]">JOINING AS?</span>
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Select your account type to personalize your dashboard and features.
          </p>
        </div>

        {/* 3. THREE ROLE CARDS WITH ANIMATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto py-6">
          
          {/* ROLE 1: MEMBER */}
          <div 
            onClick={() => setSelectedRole('athlete')}
            className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 transform group hover:-translate-y-1 ${
              selectedRole === 'athlete'
                ? 'bg-[#181922] border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.3)] scale-[1.02]'
                : 'bg-[#101117] border border-zinc-800/80 hover:border-zinc-700 shadow-md'
            }`}
          >
            <div>
              {/* Top Icon & Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedRole === 'athlete' 
                    ? 'bg-[#E1601B]/20 text-[#E1601B]' 
                    : 'bg-[#181922] text-zinc-400 group-hover:text-white'
                }`}>
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedRole === 'athlete'
                    ? 'bg-[#E1601B] text-white scale-110 shadow-[0_0_10px_#E1601B]'
                    : 'border border-zinc-700 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="font-display text-xl uppercase text-white tracking-wide font-bold mb-1">
                Member / Athlete
              </h2>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Join nearby gyms, track daily workouts, and book personal trainers.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Access 5+ premier nearby gyms</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>1-Tap digital QR entry pass</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Log workouts & track strength PRs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Book sessions with certified coaches</span>
                </div>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="pt-4 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">ACCESS</span>
              <span className={`font-semibold ${selectedRole === 'athlete' ? 'text-[#E1601B]' : 'text-zinc-400'}`}>
                All Partner Gyms
              </span>
            </div>
          </div>

          {/* ROLE 2: COACH */}
          <div 
            onClick={() => setSelectedRole('coach')}
            className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 transform group hover:-translate-y-1 ${
              selectedRole === 'coach'
                ? 'bg-[#181922] border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.3)] scale-[1.02]'
                : 'bg-[#101117] border border-zinc-800/80 hover:border-zinc-700 shadow-md'
            }`}
          >
            <div>
              {/* Top Icon & Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedRole === 'coach' 
                    ? 'bg-[#E1601B]/20 text-[#E1601B]' 
                    : 'bg-[#181922] text-zinc-400 group-hover:text-white'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedRole === 'coach'
                    ? 'bg-[#E1601B] text-white scale-110 shadow-[0_0_10px_#E1601B]'
                    : 'border border-zinc-700 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="font-display text-xl uppercase text-white tracking-wide font-bold mb-1">
                Certified Coach
              </h2>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Manage client rosters, build workout routines, and track schedules.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Automated client booking calendar</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Interactive workout regimen builder</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Direct client line & video check-ins</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Session attendance & earnings ledger</span>
                </div>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="pt-4 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">ACCESS</span>
              <span className={`font-semibold ${selectedRole === 'coach' ? 'text-[#E1601B]' : 'text-zinc-400'}`}>
                Trainer Portal
              </span>
            </div>
          </div>

          {/* ROLE 3: CLUB MANAGEMENT */}
          <div 
            onClick={() => setSelectedRole('owner')}
            className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 transform group hover:-translate-y-1 ${
              selectedRole === 'owner'
                ? 'bg-[#181922] border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.3)] scale-[1.02]'
                : 'bg-[#101117] border border-zinc-800/80 hover:border-zinc-700 shadow-md'
            }`}
          >
            <div>
              {/* Top Icon & Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  selectedRole === 'owner' 
                    ? 'bg-[#E1601B]/20 text-[#E1601B]' 
                    : 'bg-[#181922] text-zinc-400 group-hover:text-white'
                }`}>
                  <Shield className="w-6 h-6" />
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  selectedRole === 'owner'
                    ? 'bg-[#E1601B] text-white scale-110 shadow-[0_0_10px_#E1601B]'
                    : 'border border-zinc-700 text-transparent'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="font-display text-xl uppercase text-white tracking-wide font-bold mb-1">
                Club Management
              </h2>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Oversee facility access, member plans, and coach schedules.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Live gym occupancy monitoring</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Member database & check-in logs</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Class timetable & coach rosters</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E1601B] font-bold">✓</span>
                  <span>Announcements & facility management</span>
                </div>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="pt-4 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">ACCESS</span>
              <span className={`font-semibold ${selectedRole === 'owner' ? 'text-[#E1601B]' : 'text-zinc-400'}`}>
                Admin Console
              </span>
            </div>
          </div>

        </div>

        {/* 4. ACTION BUTTON & FOOTER */}
        <footer className="w-full flex flex-col items-center gap-4 pt-4 pb-4">
          <div className="w-full max-w-sm flex flex-col items-center gap-3">
            <button 
              onClick={handleContinue}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-base uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(225,96,27,0.45)] hover:shadow-[0_0_35px_rgba(225,96,27,0.7)] active:scale-[0.98] cursor-pointer"
              type="button"
            >
              <span>{roleConfig[selectedRole].buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-xs text-zinc-400">
              Already registered?{' '}
              <Link to="/login" className="text-[#E1601B] font-semibold underline underline-offset-4 hover:text-[#FFA055] transition-colors">
                Sign in directly
              </Link>
            </div>
          </div>
        </footer>

      </div>

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-36 h-36 rounded-full border-2 border-dashed border-[#E1601B]/50 animate-spin p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.6)] overflow-hidden bg-white flex items-center justify-center relative p-3">
                <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
                  <source src="/dumbbell_loader.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <span className="font-display text-base tracking-wider text-white uppercase font-bold">
                SETTING UP YOUR DASHBOARD
              </span>
              <div className="w-56 h-1.5 bg-[#1E1F28] rounded-full overflow-hidden mt-1 border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] shadow-[0_0_12px_#E1601B] transition-all duration-150"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 mt-1 font-mono">
                Preparing role access... {loadingProgress}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
