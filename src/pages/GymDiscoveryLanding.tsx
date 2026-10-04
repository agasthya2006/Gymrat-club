// src/pages/GymDiscoveryLanding.tsx
// Multi-Gym Platform Discovery Page — Shown AFTER main landing, BEFORE role-select login
// This is the "gateway" from the main GYMRAT CLUB landing into the multi-gym network
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEARBY_GYMS } from '../data/nearbyGyms';
import {
  MapPin,
  Star,
  Users,
  Zap,
  ChevronRight,
  ArrowRight,
  Search,
  Building2,
} from 'lucide-react';

// ─── Animated Counter ────────────────────────────────────────
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    const duration = 60;
    const step = () => {
      frame++;
      setCount(Math.min(Math.round((frame / duration) * target), target));
      if (frame < duration) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

// ─── Gym Preview Card ─────────────────────────────────────────
function PreviewCard({
  gym,
  delay,
  onClick,
}: {
  gym: (typeof NEARBY_GYMS)[0];
  delay: number;
  onClick: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      className={`group text-left bg-[#0D0D11]/90 border border-zinc-800/60 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,85,0,0.2)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: visible ? '0ms' : `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={gym.photos[0].url}
          alt={gym.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gym.coverGradient} opacity-75`} />
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border ${
            gym.isOpen
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-zinc-800/60 border-zinc-700 text-zinc-400'
          }`}>
            {gym.isOpen ? '● OPEN' : '● CLOSED'}
          </span>
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star className="w-2.5 h-2.5 text-[#FF5500] fill-[#FF5500]" />
          <span className="font-mono text-[10px] font-bold text-white">{gym.rating}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-display text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#FF5500] transition-colors leading-tight">
            {gym.name}
          </h3>
          {gym.cleanliness && (
            <p className="text-[9px] text-zinc-400 mt-0.5">
              ✨ {gym.cleanliness.score} Clean • {gym.cleanliness.status}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-zinc-500">
            <MapPin className="w-2.5 h-2.5" />
            <span className="font-mono text-[9px]">{gym.distance_km} km</span>
          </div>
          <div>
            <span className="font-display text-sm font-bold text-[#FF5500]">₹{gym.starting_price.toLocaleString('en-IN')}</span>
            <span className="font-mono text-[9px] text-zinc-500">/mo</span>
          </div>
        </div>
        {/* Occupancy mini bar */}
        {gym.isOpen && (
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${gym.occupancy >= 85 ? 'bg-red-500' : gym.occupancy >= 60 ? 'bg-amber-400' : 'bg-[#FF5500]'}`}
              style={{ width: `${gym.occupancy}%` }}
            />
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main Discovery Landing ───────────────────────────────────
export const GymDiscoveryLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [transitionTarget, setTransitionTarget] = useState<'login' | 'role-select'>('role-select');

  const openGyms = NEARBY_GYMS.filter(g => g.isOpen).length;
  const totalMembers = 120000;

  const handleTransition = (target: 'login' | 'role-select') => {
    setTransitionTarget(target);
    setIsTransitioning(true);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 14;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTransitionProgress(100);
        setTimeout(() => {
          navigate(target === 'login' ? '/login' : '/role-select');
        }, 300);
      } else {
        setTransitionProgress(p);
      }
    }, 80);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070709] text-white font-sans overflow-x-hidden select-none">
      {/* Ambient grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />

      {/* Orange glow accent */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#FF5500]/8 blur-[100px] z-0" />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[#FF5500]/5 blur-[120px] z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex flex-col">

        {/* ── TOP NAV ──────────────────────────── */}
        <header className="flex items-center justify-between pb-6 border-b border-zinc-800/40">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#14151C] border border-[#27272A] group-hover:border-[#FF5500] transition-colors overflow-hidden">
              <img src="/gymrat_badge.png" alt="GymRat Club" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base tracking-wider uppercase text-white font-bold">GYMRAT CLUB</span>
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#1E1F28] text-[#FF5500] border border-[#FF5500]/40 uppercase font-bold">MULTI-GYM</span>
              </div>
              <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">PERFORMANCE NETWORK</span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTransition('login')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14151C] hover:bg-[#1E1F28] text-zinc-300 hover:text-white font-mono text-xs border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              SIGN IN
            </button>
            <button
              onClick={() => handleTransition('role-select')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E1601B] to-[#FF7728] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(225,96,27,0.5)]"
            >
              GET STARTED <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* ── HERO SECTION ─────────────────────── */}
        <main className="flex-1 flex flex-col justify-center py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Copy */}
            <div className="space-y-6 max-w-xl">
              {/* Clean Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14151C]/90 border border-zinc-800 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
                <span className="text-xs font-medium text-zinc-300">
                  {openGyms} Nearby Gyms Available Now
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase font-bold tracking-wider text-white leading-none">
                  ONE APP.
                </h1>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase font-bold tracking-wider leading-none">
                  <span className="text-[#FF5500] drop-shadow-[0_0_25px_rgba(255,85,0,0.6)]">ALL YOUR</span> GYMS.
                </h1>
              </div>

              {/* Supporting copy */}
              <p className="text-sm sm:text-base text-zinc-300 max-w-md leading-relaxed">
                Discover premier fitness clubs near you, compare memberships, track workouts, and check in seamlessly with a single tap.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="font-display text-2xl font-bold text-[#FF5500]">
                    <AnimatedNumber target={NEARBY_GYMS.length} />
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Nearby Gyms</p>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <p className="font-display text-2xl font-bold text-white">
                    <AnimatedNumber target={120} suffix="K+" />
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Active Members</p>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <p className="font-display text-2xl font-bold text-[#FF5500]">
                    <AnimatedNumber target={openGyms} />
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Open Now</p>
                </div>
              </div>

              {/* Feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: Search, text: 'Discover & Compare Gyms' },
                  { icon: MapPin, text: 'Live Occupancy Data' },
                  { icon: Users, text: 'Multi-Gym Memberships' },
                  { icon: Zap, text: '1-Tap Arena Check-In' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-[#FF5500]" />
                    </div>
                    <span className="font-mono text-xs text-zinc-300">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => handleTransition('role-select')}
                  className="py-4 px-8 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-base sm:text-lg uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(225,96,27,0.5)] hover:shadow-[0_0_45px_rgba(225,96,27,0.8)] active:scale-[0.98]"
                >
                  <Building2 className="w-5 h-5" />
                  EXPLORE NEARBY GYMS
                </button>
                <button
                  onClick={() => handleTransition('login')}
                  className="py-4 px-8 rounded-full bg-[#14151C]/90 hover:bg-[#1E1F28] text-zinc-200 hover:text-white font-display text-base sm:text-lg uppercase tracking-wider font-semibold border border-zinc-700/80 hover:border-[#E1601B]/70 transition-all flex items-center justify-center gap-2"
                >
                  SIGN IN
                </button>
              </div>
            </div>

            {/* Right: Gym card grid */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {NEARBY_GYMS.slice(0, 4).map((gym, i) => (
                  <PreviewCard
                    key={gym.id}
                    gym={gym}
                    delay={i * 100}
                    onClick={() => handleTransition('role-select')}
                  />
                ))}
              </div>
              <div className="mt-3 text-center">
                <button
                  onClick={() => handleTransition('role-select')}
                  className="font-mono text-xs text-zinc-500 hover:text-[#FF5500] transition-colors flex items-center gap-1 mx-auto"
                >
                  +{NEARBY_GYMS.length - 4} more gyms in the network <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mobile: Horizontal scroll preview */}
            <div className="lg:hidden">
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {NEARBY_GYMS.slice(0, 4).map((gym, i) => (
                  <div key={gym.id} className="shrink-0 w-48">
                    <PreviewCard
                      gym={gym}
                      delay={i * 80}
                      onClick={() => handleTransition('role-select')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* ── FOOTER ───────────────────────────── */}
        <footer className="pt-6 pb-4 border-t border-zinc-800/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-200 font-semibold">GYMRAT CLUB</span>
              <span className="text-zinc-700">•</span>
              <span>Multi-Gym Platform</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-500">
              <span>{openGyms} Gyms Open Now</span>
              <span>•</span>
              <span>Instant QR Entry</span>
              <span>•</span>
              <span>Certified Coaches</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ── TRANSITION OVERLAY ────────────────── */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center gap-6">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-[#E1601B]/50 animate-spin p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-2 border-[#E1601B] shadow-[0_0_30px_rgba(225,96,27,0.6)] overflow-hidden bg-white flex items-center justify-center p-3">
                <video className="w-full h-full object-contain" autoPlay loop muted playsInline>
                  <source src="/dumbbell_loader.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="font-display text-base tracking-wider text-white uppercase font-bold">
                {transitionTarget === 'login' ? 'LOADING SIGN IN' : 'CHOOSE YOUR ROLE'}
              </span>
              <div className="w-56 h-1.5 bg-[#1E1F28] rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] shadow-[0_0_12px_#E1601B] transition-all duration-150"
                  style={{ width: `${transitionProgress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Loading... {transitionProgress}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymDiscoveryLanding;
