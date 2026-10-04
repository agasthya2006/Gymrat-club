// src/pages/coach/CoachWorkouts.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { demoStore } from '../../demo/mockStore';
import { api } from '../../services/api';
import { Dumbbell, Plus, Trash2, CheckCircle2, Save, Send } from 'lucide-react';

interface ExerciseRow {
  name: string;
  target_sets: number;
  target_reps: string;
  target_weight_lbs: number;
  rest_seconds: number;
  notes?: string;
}

export const CoachWorkouts: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('usr-member-1');
  const [title, setTitle] = useState('EXPLOSIVE BARBELL SQUAT PROTOCOL');
  const [category, setCategory] = useState('STRENGTH');
  const [duration, setDuration] = useState(70);

  const [exercises, setExercises] = useState<ExerciseRow[]>([
    { name: 'Barbell Back Squat (Low Bar)', target_sets: 4, target_reps: '5 reps', target_weight_lbs: 365, rest_seconds: 180, notes: 'Maintain torso stiffness.' },
    { name: 'Romanian Deadlifts (RDL)', target_sets: 3, target_reps: '8 reps', target_weight_lbs: 275, rest_seconds: 120, notes: 'Max hamstring stretch.' },
    { name: 'Walking Dumbbell Lunges', target_sets: 3, target_reps: '12 steps', target_weight_lbs: 70, rest_seconds: 90, notes: 'Upright posture.' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    api.getMembers().then(data => {
      setMembers(data);
      if (data.length > 0) setSelectedMemberId(data[0].id);
    }).catch(err => console.error(err));
  }, []);

  const addExercise = () => {
    setExercises(prev => [
      ...prev,
      { name: 'Cable Lateral Raise', target_sets: 3, target_reps: '12 reps', target_weight_lbs: 30, rest_seconds: 60 }
    ]);
  };

  const removeExercise = (idx: number) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx: number, field: keyof ExerciseRow, val: any) => {
    setExercises(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedMemberId) return;
    setIsSubmitting(true);
    setSuccessNotice(null);

    try {
      const created = await api.createWorkout({
        title,
        category,
        assigned_by: user.id,
        assigned_to: selectedMemberId,
        duration_minutes: Number(duration),
        exercises
      });

      // Broadcast workout notification to member
      demoStore.update(s => {
        s.notifications.unshift({
          id: `notif-workout-${Date.now().toString(36)}`,
          title: `🏋️ Workout Assigned: ${title}`,
          message: `${user?.name || 'Coach Akhil Gandloji'} assigned a new workout protocol "${title}" to your routine. Check your Workout tab!`,
          time: 'Just now',
          read: false,
          type: 'WORKOUT',
          recipient_role: 'MEMBER'
        });
      });

      const memberObj = members.find(m => m.id === selectedMemberId);
      setSuccessNotice(`SUCCESS: Assigned "${title}" directly to ${memberObj?.name || 'Athlete'}. Instantly visible on their dashboard!`);
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      console.error('Failed to create workout:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          PROGRAMMING BLUEPRINT
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          WORKOUT PROGRAM BUILDER
        </h1>
        <p className="text-xs text-zinc-400">
          Design periodized exercise protocols and assign them to your designated athletes.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      <form onSubmit={handleAssign} className="space-y-6">
        {/* Meta Header */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                WORKOUT PROTOCOL TITLE
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                ASSIGN TO ATHLETE
              </label>
              <select
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.profile?.athlete_code || 'ATH'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              >
                <option value="STRENGTH">STRENGTH (Barbell Power)</option>
                <option value="HYPERTROPHY">HYPERTROPHY (Volume Load)</option>
                <option value="CONDITIONING">CONDITIONING (Metabolic)</option>
                <option value="RECOVERY">RECOVERY (Mobility/Zero)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                ESTIMATED DURATION (MINUTES)
              </label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Exercises Builder */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#E1601B]" /> EXERCISE MATRIX ({exercises.length})
            </h2>
            <button
              type="button"
              onClick={addExercise}
              className="px-3 py-1.5 bg-[#E1601B]/20 text-[#E1601B] hover:bg-[#E1601B] hover:text-black border border-[#E1601B]/40 rounded text-xs font-mono uppercase font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> ADD EXERCISE
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((ex, idx) => (
              <div key={idx} className="p-4 bg-[#0D0D11] border border-[#27272A] rounded-lg relative">
                <button
                  type="button"
                  onClick={() => removeExercise(idx)}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pr-8">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      EXERCISE NAME
                    </label>
                    <input
                      type="text"
                      value={ex.name}
                      onChange={e => updateExercise(idx, 'name', e.target.value)}
                      className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      SETS
                    </label>
                    <input
                      type="number"
                      value={ex.target_sets}
                      onChange={e => updateExercise(idx, 'target_sets', Number(e.target.value))}
                      className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      REPETITIONS
                    </label>
                    <input
                      type="text"
                      value={ex.target_reps}
                      onChange={e => updateExercise(idx, 'target_reps', e.target.value)}
                      className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      LOAD (LBS)
                    </label>
                    <input
                      type="number"
                      value={ex.target_weight_lbs}
                      onChange={e => updateExercise(idx, 'target_weight_lbs', Number(e.target.value))}
                      className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      REST (SEC)
                    </label>
                    <input
                      type="number"
                      value={ex.rest_seconds}
                      onChange={e => updateExercise(idx, 'rest_seconds', Number(e.target.value))}
                      className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1">
                      COACHING CUES / INSTRUCTIONS
                    </label>
                    <input
                      type="text"
                      value={ex.notes || ''}
                      onChange={e => updateExercise(idx, 'notes', e.target.value)}
                      placeholder="e.g. Pause 1s on chest; flare lats"
                      className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-widest text-base rounded shadow-glow-sm transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'ASSIGNING PROTOCOL...' : 'PUBLISH & ASSIGN WORKOUT'}</span>
        </button>
      </form>
    </div>
  );
};
