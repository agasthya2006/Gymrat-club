// src/pages/LandingPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Attempt autoplay on mount with strict mobile/iOS Safari compatibility
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const startPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If iOS Low Power Mode restricts autoplay, resume on first user interaction
            const resumeOnTouch = () => {
              video.play().catch(() => {});
              window.removeEventListener('touchstart', resumeOnTouch);
              window.removeEventListener('click', resumeOnTouch);
            };
            window.addEventListener('touchstart', resumeOnTouch, { once: true, passive: true });
            window.addEventListener('click', resumeOnTouch, { once: true, passive: true });
          });
        }
      };

      startPlay();
    }
  }, []);

  const handleStartJourney = () => {
    setIsTransitioning(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 14;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTransitionProgress(100);
        setTimeout(() => {
          navigate('/gym-network');
        }, 300);
      } else {
        setTransitionProgress(p);
      }
    }, 100);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070709] text-white font-sans overflow-x-hidden flex flex-col justify-between select-none">
      
      {/* ================= LAYER 1: CINEMATIC BATTLE ROPE VIDEO BACKGROUND ================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Hardware-accelerated Video (Active across Mobile, Tablet, and Desktop) */}
        <video
          ref={videoRef}
          src="/battle_rope_hero.mp4"
          poster="/battle_rope_poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className="w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-center"
          style={{ pointerEvents: 'none' }}
        />

        {/* Fallback image poster before first frame decodes */}
        {!videoLoaded && (
          <img
            src="/battle_rope_poster.jpg"
            alt="GymRat Athlete Training"
            className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-center"
            loading="eager"
          />
        )}
      </div>

      {/* ================= LAYER 2: DARK GRADIENT OVERLAY (KEEPS ATHLETE & ROPE VISIBLE) ================= */}
      {/* Desktop: Stronger dark scrim on left for typography readability, open on right for battle-rope movement */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#070709]/95 via-[#070709]/75 to-transparent md:from-[#070709]/95 md:via-[#070709]/65 md:to-black/30"
        aria-hidden="true"
      />
      {/* Top and Bottom soft vignette for edge integration */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#070709]/80 via-transparent to-[#070709]/90"
        aria-hidden="true"
      />
      {/* Subtle brand orange atmospheric glow accent (hidden on mobile to save GPU cycles) */}
      <div className="hidden sm:block absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E1601B]/15 blur-[60px] pointer-events-none z-[1]" />

      {/* ================= LAYER 3: GYMRAT CONTENT (HEADER, HERO, FOOTER) ================= */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-6 max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION BAR */}
        <header className="w-full flex items-center justify-between pb-6 border-b border-zinc-800/40">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#14151C]/90 border border-[#27272A] shadow-lg overflow-hidden group-hover:border-[#E1601B] transition-colors">
              <img 
                src="/gymrat_badge.png" 
                alt="GymRat Club" 
                className="w-9 h-9 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg tracking-wider uppercase text-white font-bold">
                  GYMRAT CLUB
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1E1F28] text-[#E1601B] border border-[#E1601B]/40 uppercase tracking-widest font-bold">
                  PRO
                </span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
                PERFORMANCE ECOSYSTEM
              </span>
            </div>
          </Link>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/member/membership"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14151C]/80 hover:bg-[#1E1F28] text-zinc-300 hover:text-white font-mono text-xs border border-zinc-800 transition-all"
            >
              <span>MEMBERSHIPS</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14151C]/80 hover:bg-[#1E1F28] hover:border-[#E1601B] text-white font-mono text-xs border border-zinc-800 transition-all shadow-sm"
            >
              <span>SIGN IN</span>
              <span className="material-symbols-outlined text-sm text-[#E1601B]">arrow_forward</span>
            </Link>
          </div>
        </header>

        {/* HERO CONTENT: POSITIONED ON THE CLEAR LEFT / CENTER-LEFT */}
        <main className="w-full my-auto py-12 md:py-20 flex flex-col justify-center">
          <div className="max-w-2xl text-left space-y-6">
            
            {/* Clean Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14151C]/90 border border-zinc-800 shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
              <span className="text-xs font-medium text-zinc-300">
                Multi-Gym Fitness Network
              </span>
            </div>

            {/* Official GymRat Club Badge Logo & Brand Lockup */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-1 pb-2">
              {/* Tactical Framed Circular Badge */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-2 rounded-full bg-[#FF5500]/20 blur-xl group-hover:bg-[#FF5500]/30 transition-all duration-300 pointer-events-none" />
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full bg-black/80 p-2 border border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  <img
                    src="/gymrat_badge.png"
                    alt="GYMRAT CLUB"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,85,0,0.5)]"
                  />
                </div>
              </div>

              {/* Athletic Title & Tagline */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase font-bold tracking-wider text-white leading-none">
                    GYMRAT
                  </h1>
                  <span className="font-display text-4xl sm:text-5xl md:text-6xl uppercase font-bold tracking-wider text-[#FF5500] leading-none drop-shadow-[0_0_25px_rgba(255,85,0,0.7)]">
                    CLUB
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-300 font-medium">
                  <span>YOUR FITNESS</span>
                  <span className="text-[#FF5500] font-bold">•</span>
                  <span>YOUR JOURNEY</span>
                  <span className="text-[#FF5500] font-bold">•</span>
                  <span className="text-white font-semibold">YOUR PROGRESS</span>
                </div>
              </div>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed">
              Discover premier gyms near you, manage your memberships, book certified trainers, and track your workouts in one connected app.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              {/* Primary Action */}
              <button
                onClick={handleStartJourney}
                className="py-4 px-8 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-base sm:text-lg uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(225,96,27,0.45)] hover:shadow-[0_0_40px_rgba(225,96,27,0.7)] active:scale-[0.97] cursor-pointer hover:-translate-y-0.5"
              >
                <span>EXPLORE GYMS</span>
                <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>
              </button>

              {/* Secondary Action */}
              <Link
                to="/gym-network"
                className="py-4 px-8 rounded-full bg-[#14151C]/90 hover:bg-[#1E1F28] text-zinc-200 hover:text-white font-display text-base sm:text-lg uppercase tracking-wider font-semibold border border-zinc-800 hover:border-[#E1601B]/60 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <span>VIEW NETWORK</span>
              </Link>
            </div>

            {/* Clean Feature Highlights */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]" />
                <span>Instant QR Check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]" />
                <span>Certified Coaches</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E1601B]" />
                <span>Live Gym Occupancy</span>
              </div>
            </div>

          </div>
        </main>

        {/* CLEAN, SIMPLE FOOTER */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 border-t border-zinc-800/40 text-zinc-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">GYMRAT CLUB</span>
            <span className="text-zinc-600">•</span>
            <span>Multi-Gym Fitness Platform</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-500">
            <span>Discover</span>
            <span>•</span>
            <span>Join</span>
            <span>•</span>
            <span className="text-[#E1601B]">Transform</span>
          </div>
        </footer>

      </div>

      {/* FULLSCREEN LOADING TRANSITION OVERLAY */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300">
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-[#E1601B]/50 animate-spin p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.6)] overflow-hidden bg-white flex items-center justify-center relative p-3">
                <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
                  <source src="/dumbbell_loader.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2 text-center">
              <span className="font-display text-base tracking-wider text-white uppercase font-bold">
                EXPLORING GYM NETWORK
              </span>
              <div className="w-56 h-1.5 bg-[#1E1F28] rounded-full overflow-hidden mt-1 border border-zinc-800">
                <div 
                  className="h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] shadow-[0_0_12px_#E1601B] transition-all duration-150"
                  style={{ width: `${transitionProgress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 mt-1 font-mono">
                Loading nearby gyms... {transitionProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
