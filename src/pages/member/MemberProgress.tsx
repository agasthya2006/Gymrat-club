// src/pages/member/MemberProgress.tsx
import React, { useState, useEffect } from 'react';
import { demoStore } from '../../demo/mockStore';
import {
  TrendingUp,
  Dumbbell,
  Calendar,
  Flame,
  CheckCircle2,
  Award,
  Target,
  QrCode,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const MemberProgress: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const { member, workoutHistory, attendanceHistory } = storeState;

  // Weight progression trajectory points (from starting 72kg towards 78kg)
  const weightTimeline = [
    { week: 'W1', weight: 72.0, target: 78.0 },
    { week: 'W2', weight: 72.8, target: 78.0 },
    { week: 'W3', weight: 73.5, target: 78.0 },
    { week: 'W4', weight: 74.4, target: 78.0 },
    { week: 'W5', weight: 75.1, target: 78.0 },
    { week: 'Current', weight: 75.8, target: 78.0 }
  ];

  // Verified Strength Progression (in KG)
  const strengthLifts = [
    { lift: 'BARBELL BENCH PRESS', current: '80 KG', pr_increase: '+10 KG', percent: 80, reps: '4 × 8 Reps' },
    { lift: 'INCLINE DUMBBELL PRESS', current: '24 KG', pr_increase: '+4 KG', percent: 72, reps: '3 × 10 Reps' },
    { lift: 'COMPETITION BACK SQUAT', current: '140 KG', pr_increase: '+15 KG', percent: 88, reps: '5 × 5 Reps' },
    { lift: 'CONVENTIONAL DEADLIFT', current: '180 KG', pr_increase: '+20 KG', percent: 92, reps: '3 × 5 Reps' }
  ];

  // Week days workout consistency
  const days = [
    { name: 'MON', completed: true },
    { name: 'TUE', completed: true },
    { name: 'WED', completed: true },
    { name: 'THU', completed: true },
    { name: 'FRI', completed: false, isToday: true },
    { name: 'SAT', completed: false },
    { name: 'SUN', completed: false }
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
          BIOMETRIC AUDIT & ANALYTICS
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          ATHLETE PROGRESSION TELEMETRY
        </h1>
        <p className="text-xs text-zinc-400">
          Weight trajectory, strength hypertrophy velocity, and verifiable attendance history.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-[#14151C] border border-[#27272A] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>CURRENT STREAK</span>
            <Flame className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-4xl font-bold text-white tracking-wide">
            {member.streak} <span className="text-base text-[#FF5500] font-mono">SESSIONS</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            ● TOP 5% ATHLETE ADHERENCE
          </div>
        </div>

        {/* Performance Score */}
        <div className="bg-[#14151C] border border-[#27272A] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>PERFORMANCE SCORE</span>
            <Activity className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-4xl font-bold text-white tracking-wide">
            {member.performanceScore} <span className="text-base text-zinc-500 font-mono">/ 100</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            +4.2 PTS SINCE LAST CYCLE
          </div>
        </div>

        {/* Weekly Consistency */}
        <div className="bg-[#14151C] border border-[#27272A] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>WEEKLY TARGET</span>
            <Target className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-4xl font-bold text-white tracking-wide">
            {member.weeklyCompleted} / {member.weeklyTarget}{' '}
            <span className="text-base text-[#FF5500] font-mono">DONE</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            80% TARGET RATE
          </div>
        </div>

        {/* Goal Trajectory */}
        <div className="bg-[#14151C] border border-[#27272A] p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>GOAL: {member.goal.toUpperCase()}</span>
            <TrendingUp className="w-4 h-4 text-[#FF5500]" />
          </div>
          <div className="font-display text-4xl font-bold text-white tracking-wide">
            75.8 <span className="text-base text-zinc-500 font-mono">/ 78 KG</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            +3.8 KG LEAN MASS GAINED
          </div>
        </div>
      </div>

      {/* Grid: Weight Progression Chart & Weekly Consistency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progression Chart */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF5500]" />
              <h2 className="font-display text-xl uppercase font-bold text-white tracking-wide">
                WEIGHT PROGRESSION ({member.weight} KG → {member.targetWeight} KG)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/30 px-2 py-0.5 rounded">
              BULKING CYCLE
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Controlled surplus tracking toward the {member.targetWeight} KG target goal.
          </p>

          {/* Bar Visualizer */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-zinc-800 pb-2">
            {weightTimeline.map((item, idx) => {
              const heightPct = ((item.weight - 70) / 10) * 100;
              const isCurrent = idx === weightTimeline.length - 1;

              return (
                <div key={item.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-[#FF5500]' : 'text-zinc-400'}`}>
                    {item.weight}
                  </span>
                  <div className="w-full max-w-[40px] bg-zinc-900 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-[#FF5500] to-[#FF7728] shadow-[0_0_15px_rgba(255,85,0,0.5)]'
                          : 'bg-zinc-700 group-hover:bg-zinc-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{item.week}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2">
            <span>START: 72.0 KG (15 JAN)</span>
            <span className="text-emerald-400 font-bold">+3.8 KG GAIN</span>
            <span className="text-[#FF5500] font-bold">TARGET: 78.0 KG</span>
          </div>
        </div>

        {/* Workout Consistency Week Matrix */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF5500]" />
              <h2 className="font-display text-xl uppercase font-bold text-white tracking-wide">
                WEEKLY WORKOUT CONSISTENCY
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">
              4 OF 5 LOGGED
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Adherence protocol for the current weekly cycle (Monday – Sunday).
          </p>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {days.map(d => (
              <div
                key={d.name}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  d.completed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : d.isToday
                    ? 'bg-[#FF5500]/15 border-[#FF5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.25)]'
                    : 'bg-[#070709] border-zinc-800 text-zinc-500'
                }`}
              >
                <span className="text-[10px] font-mono font-bold">{d.name}</span>
                {d.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] font-mono">
                    {d.isToday ? 'TODAY' : '-'}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#070709] border border-zinc-800 rounded-xl space-y-2 text-xs font-mono text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">TRAINER IN CHARGE:</span>
              <span className="text-white font-bold">{member.trainer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">CONSISTENCY ADHERENCE:</span>
              <span className="text-emerald-400 font-bold">96.4% OVER 12 WEEKS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strength Progression 1RM Section */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6">
        <h2 className="font-display text-xl uppercase font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#FF5500]" />
          <span>VERIFIED 1RM STRENGTH PROGRESSION</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengthLifts.map(rec => (
            <div key={rec.lift} className="p-4 bg-[#070709] border border-zinc-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{rec.lift}</span>
                <span className="text-emerald-400 font-bold">{rec.pr_increase}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="font-display text-2xl font-bold text-[#FF5500]">{rec.current}</div>
                <div className="text-[10px] font-mono text-zinc-500">{rec.reps}</div>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-gradient-to-r from-[#FF5500] to-[#FF7728] h-full rounded-full transition-all"
                  style={{ width: `${rec.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Arena Workout Logs */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl uppercase font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#FF5500]" />
            <span>COMPLETED WORKOUT SESSIONS ({workoutHistory.length})</span>
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            IMMUTABLE LOCAL ARCHIVE
          </span>
        </div>

        <div className="space-y-3">
          {workoutHistory.map(w => (
            <div
              key={w.id}
              className="p-4 bg-[#070709] border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
            >
              <div>
                <div className="text-[10px] text-[#FF5500] font-bold mb-1">
                  {w.date} • {w.durationMinutes} MINUTES
                </div>
                <div className="font-display text-base uppercase font-bold text-white">
                  {w.title}
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">
                  {w.exercisesCompleted} / {w.totalExercises} Exercises Completed
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-zinc-500 text-[10px] uppercase">TOTAL LOAD VOLUME</div>
                <div className="font-display text-lg font-bold text-[#FF5500]">
                  {w.volumeKg.toLocaleString()} KG
                </div>
                <span className="text-[10px] text-emerald-400">VERIFIED COMPLETE ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl uppercase font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#FF5500]" />
            <span>ARENA ENTRY ATTENDANCE LOG ({attendanceHistory.length})</span>
          </h2>
          <span className="text-[10px] font-mono text-emerald-400">
            ALL PASSES VERIFIED
          </span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {attendanceHistory.map(att => (
            <div
              key={att.id}
              className="p-3 bg-[#070709] border border-zinc-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-bold">{att.location}</span>
                  <span className="text-zinc-500 text-[10px] block">{att.timestamp}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                {att.method}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MemberProgress;
