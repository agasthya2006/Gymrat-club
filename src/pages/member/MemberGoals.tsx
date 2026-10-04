// src/pages/member/MemberGoals.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Target, Dumbbell, Calendar, Clock, CheckCircle2, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemberGoals: React.FC = () => {
  const { user } = useAuth();
  const [primaryGoal, setPrimaryGoal] = useState('Maximum Strength & Hypertrophy');
  const [currentWeight, setCurrentWeight] = useState(198);
  const [targetWeight, setTargetWeight] = useState(205);
  const [weeklySessions, setWeeklySessions] = useState(5);
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [preferredDays, setPreferredDays] = useState<string[]>(['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']);
  const [preferredTime, setPreferredTime] = useState('18:00 - 20:00');
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      api.getMemberGoals(user.id).then(g => {
        if (g) {
          setPrimaryGoal(g.primary_goal || 'Maximum Strength & Hypertrophy');
          setCurrentWeight(g.current_weight || 198);
          setTargetWeight(g.target_weight || 205);
          setWeeklySessions(g.weekly_target_sessions || 5);
          setTargetDate(g.target_date || '2026-12-31');
          setPreferredDays(g.preferred_days || ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']);
          setPreferredTime(g.preferred_time || '18:00 - 20:00');
        }
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    }
  }, [user]);

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter(d => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await api.saveMemberGoals(user.id, {
        primary_goal: primaryGoal,
        current_weight: Number(currentWeight),
        target_weight: Number(targetWeight),
        weekly_target_sessions: Number(weeklySessions),
        target_date: targetDate,
        preferred_days: preferredDays,
        preferred_time: preferredTime
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save goals:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#E1601B] uppercase tracking-widest mb-1">
            <Target className="w-3.5 h-3.5" /> ATHLETE PERFORMANCE TARGETS
          </div>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            CONFIGURED FITNESS GOALS
          </h1>
          <p className="text-xs text-zinc-400">
            Define your biometrics and weekly targets. Changes persist in the relational database.
          </p>
        </div>

        <Link
          to="/member/dashboard"
          className="px-3 py-2 bg-[#14151C] hover:bg-[#1E1F28] border border-[#27272A] rounded text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO DASHBOARD</span>
        </Link>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-lg flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>PERFORMANCE TARGETS SAVED SUCCESSFULLY // RELATIONAL RECORD UPDATED</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-3">
            PRIMARY ATHLETIC GOAL
          </label>
          <select
            value={primaryGoal}
            onChange={e => setPrimaryGoal(e.target.value)}
            className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded p-3 text-sm font-mono text-white focus:outline-none"
          >
            <option value="Maximum Strength & Hypertrophy">Maximum Strength & Hypertrophy (Heavy Barbell)</option>
            <option value="Tactical Conditioning & Endurance">Tactical Conditioning & Endurance (VO2 Max)</option>
            <option value="Olympic Weightlifting Precision">Olympic Weightlifting Precision (Snatch & C&J)</option>
            <option value="Body Recomposition & Cut">Body Recomposition & Cut (Fat Loss & Retention)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-2">
              CURRENT WEIGHT (LBS)
            </label>
            <input
              type="number"
              value={currentWeight}
              onChange={e => setCurrentWeight(Number(e.target.value))}
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-base font-mono text-white focus:outline-none"
            />
          </div>

          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-2">
              TARGET WEIGHT (LBS)
            </label>
            <input
              type="number"
              value={targetWeight}
              onChange={e => setTargetWeight(Number(e.target.value))}
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-base font-mono text-white focus:outline-none"
            />
          </div>

          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-2">
              WEEKLY TARGET SESSIONS
            </label>
            <select
              value={weeklySessions}
              onChange={e => setWeeklySessions(Number(e.target.value))}
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-base font-mono text-white focus:outline-none"
            >
              <option value={3}>3 Days / Week</option>
              <option value={4}>4 Days / Week</option>
              <option value={5}>5 Days / Week</option>
              <option value={6}>6 Days / Week</option>
            </select>
          </div>
        </div>

        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <label className="block text-xs font-mono uppercase text-zinc-300 font-bold mb-3">
            PREFERRED TRAINING DAYS
          </label>
          <div className="flex flex-wrap gap-2 mb-6">
            {daysList.map(day => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 rounded text-xs font-mono tracking-wider border transition-all ${
                  preferredDays.includes(day)
                    ? 'bg-[#E1601B] border-[#E1601B] text-black font-bold'
                    : 'bg-[#0D0D11] border-[#27272A] text-zinc-400'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                TARGET COMPLETION DATE
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                PREFERRED OPERATIONAL TRAINING WINDOW
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-widest text-base rounded shadow-glow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'PERSISTING GOALS...' : 'SAVE & PERSIST GOALS'}</span>
        </button>
      </form>
    </div>
  );
};
