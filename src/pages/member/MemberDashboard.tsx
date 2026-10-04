// src/pages/member/MemberDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { demoStore, DemoStoreState } from '../../demo/mockStore';
import {
  Flame,
  Dumbbell,
  Calendar,
  Users,
  QrCode,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity,
  Award,
  ShieldCheck,
  Zap,
  Sparkles,
  X,
  Trophy,
  Target,
  Star
} from 'lucide-react';
import { loadStreakData, StreakData } from '../../services/streakService';
import { NEARBY_GYMS } from '../../data/nearbyGyms';

// ─── MOCK OCCUPANCY DATA ───────────────────────────────────────────────────────
const CAPACITY = 150;

type OccupancyLevel = 'LOW' | 'MODERATE' | 'BUSY';

interface TimeSlot {
  time: string;
  count: number;
  level: OccupancyLevel;
}

const HOURLY_SCHEDULE: TimeSlot[] = [
  { time: '6:00 AM',  count: 22,  level: 'LOW'      },
  { time: '7:00 AM',  count: 58,  level: 'MODERATE' },
  { time: '8:00 AM',  count: 95,  level: 'BUSY'     },
  { time: '9:00 AM',  count: 110, level: 'BUSY'     },
  { time: '10:00 AM', count: 67,  level: 'MODERATE' },
  { time: '11:00 AM', count: 41,  level: 'LOW'      },
  { time: '12:00 PM', count: 78,  level: 'MODERATE' },
  { time: '1:00 PM',  count: 55,  level: 'MODERATE' },
  { time: '2:00 PM',  count: 30,  level: 'LOW'      },
  { time: '3:00 PM',  count: 38,  level: 'LOW'      },
  { time: '4:00 PM',  count: 84,  level: 'MODERATE' },
  { time: '5:00 PM',  count: 84,  level: 'MODERATE' },
  { time: '6:00 PM',  count: 132, level: 'BUSY'     },
  { time: '7:00 PM',  count: 141, level: 'BUSY'     },
  { time: '8:00 PM',  count: 88,  level: 'MODERATE' },
  { time: '9:00 PM',  count: 45,  level: 'LOW'      },
];

// Current mock live snapshot (4 PM slot)
const CURRENT: TimeSlot = { time: '4:00 PM', count: 84, level: 'MODERATE' };

// Colour palette per level
const LEVEL_CONFIG: Record<OccupancyLevel, {
  dot: string; badge: string; bar: string; text: string; border: string; bg: string;
}> = {
  LOW:      { dot: 'bg-[#FF5500]', badge: 'text-[#FF5500] bg-[#FF5500]/10 border-[#FF5500]/30', bar: 'from-[#FF5500] to-[#FF7728]', text: 'text-[#FF5500]', border: 'border-[#FF5500]/30', bg: 'bg-[#FF5500]/10' },
  MODERATE: { dot: 'bg-amber-400',   badge: 'text-amber-400   bg-amber-950/50   border-amber-500/40',   bar: 'from-amber-500   to-amber-400',   text: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-950/20'   },
  BUSY:     { dot: 'bg-red-400',     badge: 'text-red-400     bg-red-950/50     border-red-500/40',     bar: 'from-red-500     to-red-400',     text: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-950/20'     },
};

// ─── OCCUPANCY MODAL ──────────────────────────────────────────────────────────
const OccupancyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const cfg = LEVEL_CONFIG[CURRENT.level];
  const occupancyPct = Math.round((CURRENT.count / CAPACITY) * 100);

  // Show detail row for selected slot (or current as default)
  const detail = selectedSlot ?? CURRENT;
  const detailCfg = LEVEL_CONFIG[detail.level];
  const detailPct = Math.round((detail.count / CAPACITY) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-[#14151C] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden">

        {/* HUD corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5500]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF5500]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF5500]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5500]" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-800/60">
          <div>
            <span className="font-mono text-[10px] text-[#FF5500] uppercase tracking-widest font-bold block">
              LIVE ARENA TELEMETRY
            </span>
            <h2 className="font-display text-xl uppercase font-bold text-white tracking-wider">
              CURRENT GYM STATUS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#070709] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Live snapshot */}
          <div className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
              <span className={`font-display text-2xl font-bold tracking-wider ${cfg.text}`}>
                ● {CURRENT.level}
              </span>
            </div>
            <div className="text-right">
              <div className="font-display text-xl font-bold text-white">
                {CURRENT.count} / {CAPACITY}
              </div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                MEMBERS
              </div>
            </div>
          </div>

          {/* Occupancy bar */}
          <div>
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase mb-2">
              <span>ARENA CAPACITY</span>
              <span className={`font-bold ${cfg.text}`}>{occupancyPct}% OCCUPIED</span>
            </div>
            <div className="w-full h-2.5 bg-[#070709] rounded-full overflow-hidden border border-zinc-800">
              <div
                className={`h-full bg-gradient-to-r ${cfg.bar} rounded-full transition-all duration-700`}
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-zinc-600 mt-1">
              <span>0</span>
              <span>EMPTY ← → FULL</span>
              <span>{CAPACITY}</span>
            </div>
          </div>

          {/* Selected time detail (if different from current) */}
          {selectedSlot && (
            <div className={`p-3 rounded-xl border ${detailCfg.border} ${detailCfg.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${detailCfg.dot}`} />
                  <span className="font-mono text-xs text-zinc-300 font-semibold">{detail.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-xs font-bold ${detailCfg.text}`}>{detail.level}</span>
                  <span className="font-mono text-xs text-zinc-400">{detail.count}/{CAPACITY}</span>
                  <span className={`font-mono text-xs font-bold ${detailCfg.text}`}>{detailPct}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Hourly schedule */}
          <div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
              TODAY'S SCHEDULE — TAP A TIME
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scroll">
              {HOURLY_SCHEDULE.map((slot) => {
                const sCfg = LEVEL_CONFIG[slot.level];
                const sPct = Math.round((slot.count / CAPACITY) * 100);
                const isSelected = selectedSlot?.time === slot.time;
                const isCurrent  = slot.time === CURRENT.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedSlot(isSelected ? null : slot)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all text-left ${
                      isSelected
                        ? `${sCfg.border} ${sCfg.bg}`
                        : isCurrent
                        ? 'border-[#FF5500]/30 bg-[#FF5500]/5'
                        : 'border-transparent hover:border-zinc-800 hover:bg-[#1E1F28]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                      <span className="font-mono text-xs text-zinc-300 w-16">{slot.time}</span>
                      {isCurrent && (
                        <span className="font-mono text-[9px] text-[#FF5500] font-bold uppercase tracking-wider">NOW</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {/* mini bar */}
                      <div className="w-16 h-1.5 bg-[#070709] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${sCfg.bar} rounded-full`}
                          style={{ width: `${sPct}%` }}
                        />
                      </div>
                      <span className={`font-mono text-[11px] font-bold w-16 text-right ${sCfg.text}`}>
                        {slot.level}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-center gap-4 font-mono text-[10px] text-zinc-600 uppercase tracking-wider pt-3 border-t border-zinc-800/60">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />LOW &lt;40%</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />MODERATE 40–79%</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />BUSY ≥80%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// ─── OCCUPANCY DASHBOARD CARD ─────────────────────────────────────────────────
const GymOccupancyCard: React.FC<{ onViewDetails: () => void }> = ({ onViewDetails }) => {
  const cfg = LEVEL_CONFIG[CURRENT.level];
  const pct = Math.round((CURRENT.count / CAPACITY) * 100);

  return (
    <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-4 sm:p-5 shadow-lg hover:border-zinc-700 transition-colors relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            GYM OCCUPANCY
          </span>
        </div>
        <span className="font-mono text-[9px] text-zinc-600 uppercase">LIVE</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        <span className={`font-display text-xl font-bold tracking-wider ${cfg.text}`}>
          {CURRENT.level}
        </span>
      </div>

      {/* Count */}
      <div className="font-display text-2xl font-bold text-white mb-0.5">
        {CURRENT.count} / {CAPACITY}
        <span className="text-sm font-sans text-zinc-500 ml-1">MEMBERS</span>
      </div>

      {/* Bar */}
      <div className="w-full h-1.5 bg-[#070709] rounded-full overflow-hidden border border-zinc-800 my-2">
        <div
          className={`h-full bg-gradient-to-r ${cfg.bar} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Pct + View Details */}
      <div className="flex items-center justify-between mt-2">
        <span className={`font-mono text-xs font-bold ${cfg.text}`}>{pct}% OCCUPIED</span>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-1 font-mono text-[11px] text-[#FF5500] hover:text-[#ff7728] font-bold uppercase tracking-wider transition-colors"
        >
          VIEW DETAILS
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ─── STREAK DASHBOARD CARD ────────────────────────────────────────────────────
const StreakDashboardCard: React.FC = () => {
  const [data, setData] = useState<StreakData>(loadStreakData);

  // refresh if another tab changes localStorage (e.g. after workout / check-in)
  useEffect(() => {
    const onStorage = () => setData(loadStreakData());
    window.addEventListener('storage', onStorage);
    // Also poll briefly to catch same-tab updates
    const interval = setInterval(() => setData(loadStreakData()), 2000);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(interval); };
  }, []);

  const weekPct = Math.min(100, Math.round((data.weeklyCompleted / data.weeklyTarget) * 100));

  return (
    <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden hover:border-zinc-700 transition-colors">
      <div className="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-[#FF5500]/5 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-[#FF5500]" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            STREAK & ACHIEVEMENTS
          </span>
        </div>
        <Link
          to="/member/achievements"
          className="flex items-center gap-1 font-mono text-[11px] text-[#FF5500] hover:text-[#ff7728] font-bold uppercase tracking-wider transition-colors"
        >
          VIEW ACHIEVEMENTS
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 3 Stat Columns */}
      <div className="grid grid-cols-3 gap-3">
        {/* Current Streak */}
        <div className="p-3 bg-[#070709] border border-[#FF5500]/20 rounded-xl">
          <div className="flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-[#FF5500]" />
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">CURRENT</span>
          </div>
          <div className="font-display text-2xl font-bold text-white">{data.currentStreak}</div>
          <div className="font-mono text-[9px] text-[#FF5500] uppercase">DAY STREAK</div>
        </div>

        {/* Best Streak */}
        <div className="p-3 bg-[#070709] border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-1 mb-1">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">BEST</span>
          </div>
          <div className="font-display text-2xl font-bold text-white">{data.bestStreak}</div>
          <div className="font-mono text-[9px] text-amber-400 uppercase">PERSONAL BEST</div>
        </div>

        {/* Weekly Target */}
        <div className="p-3 bg-[#070709] border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-1 mb-1">
            <Target className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">WEEKLY</span>
          </div>
          <div className="font-display text-2xl font-bold text-white">
            {data.weeklyCompleted}<span className="text-sm text-zinc-500">/{data.weeklyTarget}</span>
          </div>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              style={{ width: `${weekPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [storeState, setStoreState] = useState<DemoStoreState>(demoStore.getState());
  const [streakData, setStreakData] = useState<StreakData>(loadStreakData);
  const [showOccupancy, setShowOccupancy] = useState(false);

  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setStoreState(demoStore.getState());
    });
    const handleStreakUpdate = () => {
      setStreakData(loadStreakData());
    };
    window.addEventListener('gymrat-streak-updated', handleStreakUpdate);
    window.addEventListener('storage', handleStreakUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener('gymrat-streak-updated', handleStreakUpdate);
      window.removeEventListener('storage', handleStreakUpdate);
    };
  }, []);

  const { member, workout, bookings, classes, membershipPlan, attendanceHistory } = storeState;

  // Next upcoming session
  const upcomingBooking = bookings[0];
  const todayCheckedIn = attendanceHistory.some(a => a.timestamp.includes('Today'));
  const homeGym = NEARBY_GYMS[0];

  return (
    <div className="w-full space-y-6 select-none">
      
      {/* 1. ATHLETE COMMAND CENTER HEADER */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#FF5500]/15 via-[#FF5500]/5 to-transparent pointer-events-none" />
        
        {/* Corner Reticle Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5500]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF5500]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF5500]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5500]" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40 rounded-full font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                SYSTEM ONLINE
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                {member.membership} • {member.status}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl uppercase font-bold text-white tracking-wider">
              ATHLETE COMMAND CENTER
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
              Welcome back, <strong className="text-white font-semibold">{user?.name || member.name || 'Agasthya'}</strong>. Ready to conquer your meso-cycle?
            </p>
          </div>

          {/* Quick Arena Check-In CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/member/check-in"
              className={`py-3 px-5 rounded-xl font-display tracking-wider uppercase font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 ${
                todayCheckedIn 
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                  : 'bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white shadow-[0_0_20px_rgba(255,85,0,0.4)]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>{todayCheckedIn ? 'CHECKED IN TODAY' : 'ARENA ENTRY'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CORE METRICS & TELEMETRY ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Membership */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 sm:p-5 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span className="text-[10px] tracking-wider uppercase">ACTIVE MEMBERSHIP</span>
            <ShieldCheck className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
            {member.membership}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FF5500]" />
            <span>EXP: {member.expiry}</span>
          </div>
        </div>

        {/* Weekly Consistency */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 sm:p-5 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span className="text-[10px] tracking-wider uppercase">WEEKLY CONSISTENCY</span>
            <Calendar className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
            {streakData.weeklyCompleted} / {streakData.weeklyTarget} <span className="text-xs font-sans text-zinc-500">SESSIONS</span>
          </div>
          <div className="w-full bg-[#070709] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-gradient-to-r from-[#FF5500] to-[#FF7728] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (streakData.weeklyCompleted / streakData.weeklyTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <Link
          to="/member/achievements"
          className="bg-[#14151C] border border-[#27272A] hover:border-[#FF5500]/50 p-4 sm:p-5 rounded-xl flex flex-col justify-between transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span className="text-[10px] tracking-wider uppercase group-hover:text-white transition-colors">CURRENT STREAK</span>
            <Flame className="w-4 h-4 text-[#FF5500] group-hover:scale-110 transition-transform" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
            {streakData.currentStreak} <span className="text-xs font-sans text-zinc-500">SESSIONS</span>
          </div>
          <div className="text-[10px] font-mono text-[#FF5500] mt-1 flex items-center justify-between">
            <span>BEST: {streakData.bestStreak} DAYS</span>
            <span className="text-[9px] text-zinc-400 group-hover:text-white uppercase flex items-center gap-0.5">
              VIEW <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Performance Score */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 sm:p-5 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span className="text-[10px] tracking-wider uppercase">PERFORMANCE SCORE</span>
            <Activity className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide flex items-baseline gap-1">
            <span>{member.performanceScore}</span>
            <span className="text-xs font-mono text-zinc-500">/ 100</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            TIER 1 ATHLETIC RANK
          </div>
        </div>
      </div>

      {/* 2b. GYM OCCUPANCY CARD — spans full width */}
      <GymOccupancyCard onViewDetails={() => setShowOccupancy(true)} />

      {/* 2c. STREAK & ACHIEVEMENTS CARD — spans full width */}
      <StreakDashboardCard />

      {/* 3. HERO TRAINING & UPCOMING SESSION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* TODAY'S TRAINING (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between relative shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center text-[#FF5500]">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[#FF5500] tracking-wider block font-bold">
                      SCHEDULED PROTOCOL
                    </span>
                    <h2 className="font-display text-xl uppercase font-bold text-white leading-tight">
                      TODAY'S TRAINING
                    </h2>
                  </div>
                </div>

                <span className="px-3 py-1 text-xs font-mono bg-[#070709] border border-zinc-800 text-zinc-300 rounded-lg">
                  {workout.durationMinutes} MIN
                </span>
              </div>

              {/* Title & Goal */}
              <div className="p-4 bg-[#070709] border border-[#27272A] rounded-xl mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-2xl text-white font-bold tracking-wide uppercase">
                    {workout.title}
                  </h3>
                  {workout.completed ? (
                    <span className="px-2.5 py-1 text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-mono bg-[#1E1F28] border border-zinc-700 text-zinc-300 rounded-full font-semibold">
                      INCOMPLETE ({workout.exercises.filter(e => e.completed).length}/{workout.exercises.length})
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  {workout.exercises.map(ex => (
                    <div 
                      key={ex.id}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                        ex.completed 
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                          : 'bg-[#14151C] border-[#27272A] text-zinc-300'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <span className="block font-semibold truncate">{ex.name}</span>
                        <span className="text-[10px] text-zinc-500">{ex.sets} × {ex.reps} @ {ex.weight}</span>
                      </div>
                      {ex.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-zinc-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                to="/member/workout"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-base uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(255,85,0,0.4)] transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>{workout.completed ? 'REVIEW COMPLETED WORKOUT' : 'START WORKOUT'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* UPCOMING SESSION & QUICK METRICS (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Upcoming Session Card */}
          <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-blue-400 tracking-wider block font-bold">
                      TODAY'S CALENDAR
                    </span>
                    <h2 className="font-display text-xl uppercase font-bold text-white">
                      UPCOMING SESSION
                    </h2>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                  CONFIRMED
                </span>
              </div>

              {upcomingBooking ? (
                <div className="p-4 bg-[#070709] border border-[#27272A] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#1E1F28] border border-zinc-700 flex items-center justify-center font-display text-xl font-bold text-[#FF5500]">
                      RS
                    </div>
                    <div>
                      <div className="font-display text-lg font-bold text-white uppercase">
                        {upcomingBooking.coach_name}
                      </div>
                      <div className="text-xs font-mono text-zinc-400">
                        {upcomingBooking.notes}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-[#FF5500]">
                      {upcomingBooking.time}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      {upcomingBooking.date}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#070709] border border-[#27272A] rounded-xl text-center text-xs font-mono text-zinc-500">
                  No upcoming bookings. Book your private coach below.
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <Link
                to="/member/schedule"
                className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>VIEW FULL SCHEDULE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/member/trainers"
                className="text-xs font-mono text-[#FF5500] hover:text-[#ff7728] font-bold flex items-center gap-1 transition-colors"
              >
                <span>BOOK COACH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Target Weight Goal Micro-Widget */}
          <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  GOAL: {member.goal.toUpperCase()}
                </span>
                <div className="font-display text-lg font-bold text-white">
                  {member.weight} KG <span className="text-zinc-500 font-sans text-xs">→ TARGET: {member.targetWeight} KG</span>
                </div>
              </div>
            </div>
            <Link
              to="/member/progress"
              className="px-3 py-1.5 rounded-lg bg-[#070709] hover:bg-[#1E1F28] border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              DETAILS
            </Link>
          </div>

        </div>

      </div>

      {/* 4. ARENA FACILITIES & CLEANLINESS HYGIENE METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature 1: Gym Facilities */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#FF5500]" />
              <h3 className="font-display text-lg uppercase font-bold text-white tracking-wider">
                GYM FACILITIES & AMENITIES
              </h3>
            </div>
            <Link
              to="/member/gyms"
              className="text-xs font-mono text-[#FF5500] hover:underline flex items-center gap-1"
            >
              <span>EXPLORE ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <p className="text-xs text-zinc-400 mb-4 font-mono">
            Active zones & certified gear at your base ({homeGym.name}):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {homeGym.facilities.map((fac, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#0D0D11] border border-zinc-800 rounded-xl flex items-center gap-2.5 transition-all hover:border-[#FF5500]/40 group"
              >
                <div className="w-2 h-2 rounded-full bg-[#FF5500] shrink-0" />
                <span className="font-mono text-xs text-zinc-300 group-hover:text-white truncate">
                  {fac}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 2: Gym Cleanliness & Hygiene Verification */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5500]" />
                <h3 className="font-display text-lg uppercase font-bold text-white tracking-wider">
                  GYM CLEANLINESS & HYGIENE
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30">
                {homeGym.cleanliness?.status || 'SPOTLESS & CERTIFIED'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-3">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">
                ✨ {homeGym.cleanliness?.score || 4.9}
              </div>
              <div className="text-xs font-mono text-zinc-400">
                / 5.0 AUDIT SCORE • <span className="text-[#FF5500]">{homeGym.cleanliness?.inspections_today || 8} DAILY AUDITS</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-4 font-mono">
              🕒 Last Sanitized: <span className="text-zinc-200 font-bold">{homeGym.cleanliness?.last_sanitized || '25 mins ago'}</span>
            </p>

            <div className="space-y-2 border-t border-zinc-800/80 pt-3">
              {(homeGym.cleanliness?.highlights || [
                'Hospital-grade surface sanitization',
                'HEPA H13 medical air filtration active',
                'Touchless sanitizers at all lifting stations'
              ]).map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5500] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. QUICK ACTIONS PANEL (ALL BUTTONS WORK DIRECTLY) */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF5500]" />
            <h3 className="font-display text-lg uppercase font-bold text-white tracking-wider">
              QUICK ATHLETIC ACTIONS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            DIRECT PROTOCOL LAUNCHERS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/member/workout"
            className="p-4 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500] rounded-xl flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <Dumbbell className="w-5 h-5 text-[#FF5500] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm uppercase font-bold text-white group-hover:text-[#FF5500]">
              START WORKOUT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">75 MIN PROTOCOL</span>
          </Link>

          <Link
            to="/member/check-in"
            className="p-4 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500] rounded-xl flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <QrCode className="w-5 h-5 text-[#FF5500] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm uppercase font-bold text-white group-hover:text-[#FF5500]">
              ARENA ENTRY
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">DIGITAL QR PASS</span>
          </Link>

          <Link
            to="/member/trainers"
            className="p-4 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500] rounded-xl flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <Users className="w-5 h-5 text-[#FF5500] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm uppercase font-bold text-white group-hover:text-[#FF5500]">
              BOOK COACH
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">3 CERTIFIED PROS</span>
          </Link>

          <Link
            to="/member/classes"
            className="p-4 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500] rounded-xl flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <Calendar className="w-5 h-5 text-[#FF5500] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm uppercase font-bold text-white group-hover:text-[#FF5500]">
              CLASSES
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">4 DAILY SLOTS</span>
          </Link>

          <Link
            to="/member/progress"
            className="p-4 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500] rounded-xl flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <TrendingUp className="w-5 h-5 text-[#FF5500] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm uppercase font-bold text-white group-hover:text-[#FF5500]">
              PROGRESS
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">TELEMETRY & 1RM</span>
          </Link>

          <Link
            to="/member/membership"
            className="p-4 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#FF5500] rounded-xl flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <CreditCard className="w-5 h-5 text-[#FF5500] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-display text-sm uppercase font-bold text-white group-hover:text-[#FF5500]">
              MEMBERSHIP
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-0.5">GYMRAT PRO TIER</span>
          </Link>
        </div>
      </div>

      {/* GYM OCCUPANCY DETAIL MODAL */}
      {showOccupancy && <OccupancyModal onClose={() => setShowOccupancy(false)} />}

    </div>
  );
};
export default MemberDashboard;
