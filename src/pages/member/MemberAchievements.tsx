// src/pages/member/MemberAchievements.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  loadStreakData,
  getBadges,
  Badge,
  StreakData,
} from '../../services/streakService';
import { Flame, Trophy, Target, ChevronRight, Lock, CheckCircle2, Zap } from 'lucide-react';

// ── colour map (badge.color → tailwind classes) ────────────────────────────────
const COLOR_MAP: Record<string, { border: string; bg: string; text: string; bar: string; glow: string }> = {
  orange: { border: 'border-[#FF5500]/50', bg: 'bg-[#FF5500]/10', text: 'text-[#FF5500]', bar: 'from-[#FF5500] to-[#FF7728]', glow: 'shadow-[0_0_20px_rgba(255,85,0,0.35)]' },
  amber:  { border: 'border-amber-500/50',  bg: 'bg-amber-500/10',  text: 'text-amber-400',  bar: 'from-amber-500 to-amber-400',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
  red:    { border: 'border-red-500/50',    bg: 'bg-red-500/10',    text: 'text-red-400',    bar: 'from-red-500 to-red-400',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
  purple: { border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'from-purple-500 to-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
  blue:   { border: 'border-blue-500/50',   bg: 'bg-blue-500/10',   text: 'text-blue-400',   bar: 'from-blue-500 to-blue-400',   glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
  yellow: { border: 'border-yellow-400/50', bg: 'bg-yellow-400/10', text: 'text-yellow-400', bar: 'from-yellow-400 to-yellow-300', glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]' },
  emerald:{ border: 'border-emerald-500/50',bg: 'bg-emerald-500/10',text: 'text-emerald-400',bar: 'from-emerald-500 to-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  cyan:   { border: 'border-cyan-500/50',   bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   bar: 'from-cyan-500 to-cyan-400',   glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
  gold:   { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-300', bar: 'from-yellow-500 to-yellow-300', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.35)]' },
  teal:   { border: 'border-teal-500/50',   bg: 'bg-teal-500/10',   text: 'text-teal-400',   bar: 'from-teal-500 to-teal-400',   glow: 'shadow-[0_0_20px_rgba(20,184,166,0.3)]' },
};

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  const c = COLOR_MAP[badge.color] ?? COLOR_MAP.orange;
  const locked = !badge.unlocked;

  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 ${
        locked
          ? 'bg-[#14151C] border-[#27272A] opacity-60 grayscale'
          : `bg-[#14151C] ${c.border} ${c.glow}`
      }`}
    >
      {/* HUD corner brackets for unlocked badges */}
      {!locked && (
        <>
          <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${c.text.replace('text-', 'border-')}`} />
          <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${c.text.replace('text-', 'border-')}`} />
          <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${c.text.replace('text-', 'border-')}`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${c.text.replace('text-', 'border-')}`} />
        </>
      )}

      {/* Icon row */}
      <div className="flex items-start justify-between">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${
          locked ? 'bg-[#070709] border-zinc-800' : `${c.bg} ${c.border}`
        }`}>
          {locked ? '🔒' : badge.icon}
        </div>
        {badge.unlocked ? (
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${c.bg} ${c.border} ${c.text}`}>
            <CheckCircle2 className="w-2.5 h-2.5" />
            UNLOCKED
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-500">
            <Lock className="w-2.5 h-2.5" />
            LOCKED
          </span>
        )}
      </div>

      {/* Name + description */}
      <div>
        <h3 className={`font-display text-base uppercase font-bold tracking-wide ${locked ? 'text-zinc-500' : 'text-white'}`}>
          {badge.name}
        </h3>
        <p className="text-[11px] font-sans text-zinc-400 mt-0.5 leading-snug">
          {badge.description}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
            {badge.requirement}
          </span>
          <span className={`font-mono text-[10px] font-bold ${locked ? 'text-zinc-500' : c.text}`}>
            {badge.progress}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#070709] rounded-full overflow-hidden border border-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${locked ? 'bg-zinc-700' : `bg-gradient-to-r ${c.bar}`}`}
            style={{ width: `${badge.progress}%` }}
          />
        </div>
        <span className="font-mono text-[9px] text-zinc-600 mt-0.5 block">{badge.progressLabel}</span>
      </div>

      {/* Unlock date */}
      {badge.unlocked && badge.unlockedAt && (
        <div className={`text-[9px] font-mono ${c.text} uppercase tracking-wider`}>
          UNLOCKED {new Date(badge.unlockedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      )}
    </div>
  );
};

export const MemberAchievements: React.FC = () => {
  const [streakData, setStreakData] = useState<StreakData>(loadStreakData);
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  // Re-read from localStorage on mount and on storage changes
  useEffect(() => {
    const refresh = () => setStreakData(loadStreakData());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  const badges = getBadges(streakData);
  const unlockedCount = badges.filter(b => b.unlocked).length;

  const filtered = badges.filter(b => {
    if (filter === 'UNLOCKED') return b.unlocked;
    if (filter === 'LOCKED') return !b.unlocked;
    return true;
  });

  const weekPct = Math.round((streakData.weeklyCompleted / streakData.weeklyTarget) * 100);

  return (
    <div className="w-full space-y-6 select-none">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#FF5500]/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5500]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF5500]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF5500]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5500]" />

        <div className="relative z-10">
          <span className="font-mono text-[10px] text-[#FF5500] uppercase tracking-[0.3em] font-bold block mb-1">
            PERFORMANCE PROTOCOL
          </span>
          <h1 className="font-display text-2xl sm:text-4xl uppercase font-bold text-white tracking-wider">
            STREAK & ACHIEVEMENTS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Track your consistency, unlock badges, and prove your athletic discipline.
          </p>
        </div>
      </div>

      {/* ── Streak Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Current Streak */}
        <div className="bg-[#14151C] border border-[#FF5500]/30 rounded-2xl p-5 relative overflow-hidden shadow-[0_0_25px_rgba(255,85,0,0.15)]">
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#FF5500]/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-[#FF5500]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">CURRENT STREAK</span>
          </div>
          <div className="font-display text-5xl font-bold text-white">{streakData.currentStreak}</div>
          <div className="font-mono text-xs text-[#FF5500] mt-1 uppercase tracking-wider">CONSECUTIVE DAYS</div>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: Math.min(streakData.currentStreak, 7) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#FF5500] shadow-[0_0_6px_#FF5500]" />
            ))}
            {streakData.currentStreak > 7 && (
              <span className="font-mono text-[9px] text-zinc-500">+{streakData.currentStreak - 7}</span>
            )}
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">BEST STREAK</span>
          </div>
          <div className="font-display text-5xl font-bold text-white">{streakData.bestStreak}</div>
          <div className="font-mono text-xs text-amber-400 mt-1 uppercase tracking-wider">PERSONAL RECORD</div>
          <div className="mt-3 text-[10px] font-mono text-zinc-500">
            {streakData.currentStreak >= streakData.bestStreak
              ? '🏆 YOU ARE AT YOUR BEST!'
              : `${streakData.bestStreak - streakData.currentStreak} DAYS TO BEAT YOUR RECORD`}
          </div>
        </div>

        {/* Weekly Target */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">WEEKLY TARGET</span>
          </div>
          <div className="font-display text-5xl font-bold text-white">
            {streakData.weeklyCompleted}
            <span className="text-xl text-zinc-500 font-sans"> / {streakData.weeklyTarget}</span>
          </div>
          <div className="font-mono text-xs text-emerald-400 mt-1 uppercase tracking-wider">SESSIONS THIS WEEK</div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-[#070709] rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${weekPct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-zinc-500 mt-1 block">{weekPct}% OF WEEKLY GOAL</span>
          </div>
        </div>
      </div>

      {/* ── Progress Summary Bar ─────────────────────────────────────────────── */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#FF5500]" />
          </div>
          <div>
            <div className="font-display text-lg font-bold text-white">
              {unlockedCount} / {badges.length} BADGES EARNED
            </div>
            <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
              {badges.length - unlockedCount} remaining to unlock
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="w-full h-2 bg-[#070709] rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-[#FF5500] to-[#FF7728] rounded-full transition-all duration-700"
              style={{ width: `${Math.round((unlockedCount / badges.length) * 100)}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-[#FF5500] font-bold mt-1 block text-right">
            {Math.round((unlockedCount / badges.length) * 100)}% COMPLETE
          </span>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {(['ALL', 'UNLOCKED', 'LOCKED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all ${
              filter === f
                ? 'bg-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.4)]'
                : 'bg-[#14151C] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
            }`}
          >
            {f}
            {f === 'UNLOCKED' && <span className="ml-1.5 text-[9px]">({unlockedCount})</span>}
            {f === 'LOCKED' && <span className="ml-1.5 text-[9px]">({badges.length - unlockedCount})</span>}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
          {filtered.length} BADGE{filtered.length !== 1 ? 'S' : ''}
        </span>
      </div>

      {/* ── Badge Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(badge => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>

      {/* ── Stats Footer ─────────────────────────────────────────────────────── */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL WORKOUTS', value: streakData.totalWorkouts, icon: '💪', color: 'text-[#FF5500]' },
          { label: 'TOTAL CHECK-INS', value: streakData.totalCheckIns, icon: '🏟️', color: 'text-emerald-400' },
          { label: 'EARLY SESSIONS', value: streakData.earlyRiserCount, icon: '🌅', color: 'text-amber-400' },
          { label: 'BADGES EARNED', value: unlockedCount, icon: '🏆', color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── CTA to keep training ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-[#14151C] border border-[#27272A] rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-[#FF5500]" />
          <div>
            <span className="font-display text-sm font-bold text-white uppercase">Keep Your Streak Alive</span>
            <span className="font-mono text-[10px] text-zinc-400 block">Complete today's workout to extend it</span>
          </div>
        </div>
        <Link
          to="/member/workout"
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7728] text-white font-display text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:from-[#ff661a] hover:to-[#ff8838] transition-all shadow-[0_0_15px_rgba(255,85,0,0.4)]"
        >
          TRAIN NOW
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
export default MemberAchievements;
