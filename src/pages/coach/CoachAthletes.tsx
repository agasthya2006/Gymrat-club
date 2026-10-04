// src/pages/coach/CoachAthletes.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Flame, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

export const CoachAthletes: React.FC = () => {
  const { user } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');

  useEffect(() => {
    api.getMembers().then(data => {
      setAthletes(data);
    }).catch(err => console.error(err));
  }, []);

  const filtered = athletes.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.profile?.athlete_code && a.profile.athlete_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlan = filterPlan === 'ALL' || a.profile?.plan_id === filterPlan;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            CLIENT TELEMETRY ROSTER
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            ASSIGNED ATHLETE ROSTER
          </h1>
          <p className="text-xs text-zinc-400">
            Monitor client consistency streaks, session progression, and active goals.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by athlete name..."
            className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">TOTAL ATHLETES: <strong className="text-white">{filtered.length}</strong></span>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">FILTER PLAN:</span>
            <select
              value={filterPlan}
              onChange={e => setFilterPlan(e.target.value)}
              className="bg-[#0D0D11] border border-[#27272A] rounded px-2 py-1 text-xs text-white"
            >
              <option value="ALL">ALL PLANS</option>
              <option value="plan-elite">TITAN ELITE</option>
              <option value="plan-pro">BLACK PROTOCOL</option>
              <option value="plan-basic">STANDARD</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#27272A]/50 font-mono text-xs">
          {filtered.map(athlete => {
            const prof = athlete.profile || {};
            return (
              <div
                key={athlete.id}
                className="p-4 hover:bg-[#1E1F28]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-[#27272A] overflow-hidden shrink-0">
                    <img src={athlete.avatar_url} alt={athlete.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{athlete.name}</div>
                    <div className="text-[10px] text-zinc-500">{prof.athlete_code || 'GRC-ATH'} • {athlete.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center sm:text-right">
                    <div className="text-[10px] text-zinc-500">TRAINING STREAK</div>
                    <div className="font-bold text-[#E1601B] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{prof.streak_days || 14} DAYS</span>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-[10px] text-zinc-500">WORKOUTS</div>
                    <div className="font-bold text-zinc-200">{prof.total_workouts || 48}</div>
                  </div>

                  <div className="text-center sm:text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {prof.status || 'ACTIVE'}
                    </span>
                  </div>

                  <Link
                    to={`/coach/athletes/${athlete.id}`}
                    className="p-2 bg-[#0D0D11] hover:bg-[#14151C] border border-[#27272A] rounded text-zinc-300 hover:text-white transition-colors"
                    title="View Athlete Dossier"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
