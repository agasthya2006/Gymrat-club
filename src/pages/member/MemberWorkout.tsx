// src/pages/member/MemberWorkout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockWorkoutService } from '../../demo/mockServices';
import { demoStore } from '../../demo/mockStore';
import { Dumbbell, CheckCircle2, Play, ArrowRight, RotateCcw, Award, Flame, Sparkles } from 'lucide-react';
import { recordWorkout, loadStreakData, BadgeId } from '../../services/streakService';
import { AchievementToast } from '../../components/common/AchievementToast';


export const MemberWorkout: React.FC = () => {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(demoStore.getState().workout);
  const [elapsedSeconds, setElapsedSeconds] = useState(4080); // ~68 minutes default running time
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<{ duration: string; exercises: string; volume: string; streak: number } | null>(null);
  const [toastBadges, setToastBadges] = useState<BadgeId[]>([]);


  useEffect(() => {
    const unsubscribe = demoStore.subscribe(() => {
      setWorkout(demoStore.getState().workout);
    });
    return () => unsubscribe();
  }, []);

  // Workout duration stopwatch
  useEffect(() => {
    if (workout.completed) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [workout.completed]);

  const formatStopwatch = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleExercise = async (id: string) => {
    await mockWorkoutService.completeExercise(id);
  };

  const handleFinishWorkout = async () => {
    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const volumeKg = 5420;
    const result = await mockWorkoutService.finishWorkout({ durationMinutes, volumeKg });

    // ── Streak & achievement update ──
    const isEarlyMorning = new Date().getHours() < 9;
    const { data: streakData, newlyUnlocked } = recordWorkout(isEarlyMorning);
    if (newlyUnlocked.length > 0) setToastBadges(newlyUnlocked);

    setSummaryData({
      duration: `${result.durationMinutes} MIN`,
      exercises: `${result.exercisesCompleted} / ${result.totalExercises}`,
      volume: `${result.volumeKg.toLocaleString()} KG`,
      streak: streakData.currentStreak,
    });

    setIsCompletedModalOpen(true);
  };

  const completedCount = workout.exercises.filter(e => e.completed).length;

  return (
    <div className="w-full space-y-6 select-none max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            ATHLETE TELEMETRY TRACKER
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wider">
            {workout.title}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Hypertrophy & compound power protocol. Target: RPE 8.5.
          </p>
        </div>

        {/* Stopwatch Badge */}
        <div className="flex items-center gap-3 bg-[#070709] border border-zinc-800 px-4 py-2.5 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5500] animate-pulse" />
          <div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">DURATION</span>
            <span className="font-mono text-lg font-bold text-white tracking-wider">
              {formatStopwatch(elapsedSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
          <Dumbbell className="w-4 h-4 text-[#FF5500]" />
          <span>EXERCISES COMPLETED: <strong className="text-white">{completedCount} / {workout.exercises.length}</strong></span>
        </div>
        <div className="w-48 bg-[#070709] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#FF5500] to-[#FF7728] h-full rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / workout.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3.5">
        {workout.exercises.map((ex, index) => (
          <div
            key={ex.id}
            className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              ex.completed
                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-[#14151C] border-[#27272A] hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-display text-lg font-bold ${
                  ex.completed
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-[#070709] border border-zinc-700 text-zinc-400'
                }`}
              >
                0{index + 1}
              </div>
              <div>
                <h3 className={`font-display text-lg sm:text-xl uppercase font-bold tracking-wide ${
                  ex.completed ? 'text-emerald-300 line-through' : 'text-white'
                }`}>
                  {ex.name}
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                  <span>{ex.sets} SETS</span>
                  <span>•</span>
                  <span>{ex.reps} REPS</span>
                  <span>•</span>
                  <span className="text-[#FF5500] font-semibold">{ex.weight}</span>
                </div>
              </div>
            </div>

            {/* Complete Button */}
            <button
              onClick={() => handleToggleExercise(ex.id)}
              className={`py-2.5 px-6 rounded-xl font-display text-xs sm:text-sm tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                ex.completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-[#070709] hover:bg-[#FF5500] text-zinc-300 hover:text-white border border-[#27272A] hover:border-[#FF5500]'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${ex.completed ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{ex.completed ? 'COMPLETED' : 'COMPLETE'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Complete Session Action */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate('/member/dashboard')}
          className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#14151C] hover:bg-[#1E1F28] border border-zinc-700 text-zinc-300 font-display uppercase tracking-wider text-sm font-semibold transition-colors"
        >
          BACK TO DASHBOARD
        </button>

        <button
          onClick={handleFinishWorkout}
          className="w-full sm:w-auto py-4 px-8 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-base uppercase tracking-wider font-bold shadow-[0_0_25px_rgba(255,85,0,0.5)] transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
        >
          <Award className="w-5 h-5" />
          <span>COMPLETE SESSION</span>
        </button>
      </div>

      {/* SESSION COMPLETE SUMMARY MODAL */}
      {isCompletedModalOpen && summaryData && (
        <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14151C] border border-[#27272A] rounded-2xl max-w-md w-full p-6 sm:p-8 text-center relative shadow-2xl animate-fade-in">
            
            {/* Celebration Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/40 flex items-center justify-center mx-auto mb-4 text-[#FF5500] shadow-[0_0_30px_rgba(255,85,0,0.4)]">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
              PROTOCOL FINALIZED
            </span>
            <h2 className="font-display text-3xl font-bold uppercase text-white tracking-wider mb-6">
              SESSION COMPLETE
            </h2>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#070709] border border-zinc-800 rounded-xl mb-6">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">DURATION</span>
                <span className="font-display text-xl font-bold text-white mt-1 block">
                  {summaryData.duration}
                </span>
              </div>
              <div className="border-x border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">EXERCISES</span>
                <span className="font-display text-xl font-bold text-[#FF5500] mt-1 block">
                  {summaryData.exercises}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">VOLUME</span>
                <span className="font-display text-xl font-bold text-emerald-400 mt-1 block">
                  {summaryData.volume}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-6 font-sans">
              Streak updated to <strong className="text-white">{summaryData.streak} Sessions</strong>. Data synced to telemetry cloud.
            </p>

            <button
              onClick={() => navigate('/member/dashboard')}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-base uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(255,85,0,0.5)] transition-all cursor-pointer"
            >
              RETURN TO COMMAND CENTER
            </button>
          </div>
        </div>
      )}

      {/* Achievement Toast */}
      {toastBadges.length > 0 && (
        <AchievementToast
          badgeIds={toastBadges}
          onDone={() => setToastBadges([])}
        />
      )}

    </div>
  );
};
export default MemberWorkout;
