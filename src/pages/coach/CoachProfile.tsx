// src/pages/coach/CoachProfile.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Award, Star, Save, CheckCircle2 } from 'lucide-react';

export const CoachProfile: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [callsign, setCallsign] = useState((profile as any)?.callsign || 'IRONCLAD');
  const [bio, setBio] = useState((profile as any)?.bio || '');
  const [hourlyRate, setHourlyRate] = useState((profile as any)?.hourly_rate || 110);
  const [experience, setExperience] = useState((profile as any)?.experience_years || 12);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateCoach(user.id, {
        callsign,
        bio,
        hourly_rate: Number(hourlyRate),
        experience_years: Number(experience)
      });
      await refreshProfile();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          PUBLIC COACH PROFILE
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          TRAINER DOSSIER & CREDENTIALS
        </h1>
        <p className="text-xs text-zinc-400">
          Public information visible to athletes during trainer discovery and booking.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>COACH PROFILE PERSISTED SUCCESSFULLY</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                COACH CALLSIGN
              </label>
              <input
                type="text"
                value={callsign}
                onChange={e => setCallsign(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                HOURLY RATE (₹ INR)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={e => setHourlyRate(Number(e.target.value))}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                YEARS OF EXPERIENCE
              </label>
              <input
                type="number"
                value={experience}
                onChange={e => setExperience(Number(e.target.value))}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
              PROFESSIONAL BIOGRAPHY & PROTOCOL METHODOLOGY
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded p-3 text-sm text-zinc-200 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-widest text-sm rounded shadow-glow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'PERSISTING...' : 'SAVE DOSSIER CHANGES'}</span>
        </button>
      </form>
    </div>
  );
};
