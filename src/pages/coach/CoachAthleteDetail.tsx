// src/pages/coach/CoachAthleteDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Target, Flame, Dumbbell, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const CoachAthleteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getMemberDetail(id).then(res => {
        setData(res);
        setIsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading || !data) {
    return <div className="p-8 font-mono text-xs text-zinc-500">RETRIEVING ATHLETE BIOMETRIC DOSSIER...</div>;
  }

  const { user: mUser, profile, goals, workoutHistory } = data;

  return (
    <div className="space-y-6">
      <Link
        to="/coach/athletes"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO ATHLETE ROSTER</span>
      </Link>

      {/* Header Profile */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border border-[#E1601B] overflow-hidden bg-zinc-900 shrink-0">
            <img src={mUser.avatar_url} alt={mUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#E1601B]/20 text-[#E1601B] font-mono text-[10px] font-bold rounded">
                CODE: {profile?.athlete_code || 'GRC-ATH'}
              </span>
              <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 font-mono text-[10px] font-bold rounded">
                STATUS: {profile?.status || 'ACTIVE'}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold uppercase text-white">{mUser.name}</h1>
            <p className="text-xs font-mono text-zinc-400">{mUser.email} • {mUser.phone}</p>
          </div>
        </div>

        <Link
          to="/coach/workouts"
          className="px-5 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded shadow-glow-sm transition-all"
        >
          ASSIGN NEW WORKOUT
        </Link>
      </div>

      {/* Goals & Biometrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <h2 className="font-display text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-[#E1601B]" /> ATHLETE GOALS & TARGETS
          </h2>
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-500">PRIMARY GOAL:</span>
              <span className="text-white font-bold">{goals?.primary_goal || 'Strength & Hypertrophy'}</span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-500">CURRENT WEIGHT:</span>
              <span className="text-white">{goals?.current_weight || 198} LBS</span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-500">TARGET WEIGHT:</span>
              <span className="text-[#E1601B] font-bold">{goals?.target_weight || 205} LBS</span>
            </div>
            <div className="flex justify-between border-b border-[#27272A] pb-2">
              <span className="text-zinc-500">WEEKLY SESSIONS:</span>
              <span className="text-white">{goals?.weekly_target_sessions || 5} Days / Week</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">TARGET DATE:</span>
              <span className="text-zinc-300">{goals?.target_date || '2026-12-31'}</span>
            </div>
          </div>
        </div>

        {/* Workout History */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <h2 className="font-display text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-[#E1601B]" /> RECENT LOGGED SESSIONS
          </h2>
          <div className="space-y-2.5 font-mono text-xs max-h-48 overflow-y-auto">
            {workoutHistory?.map((log: any) => (
              <div key={log.id} className="p-3 bg-[#0D0D11] border border-[#27272A] rounded flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{log.workout_title}</div>
                  <div className="text-[10px] text-zinc-500">{new Date(log.completed_at).toLocaleDateString()}</div>
                </div>
                <span className="text-[#E1601B] font-bold">{log.total_volume_lbs ? log.total_volume_lbs.toLocaleString() : '18,450'} lbs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
