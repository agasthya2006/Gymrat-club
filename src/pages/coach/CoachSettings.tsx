// src/pages/coach/CoachSettings.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Settings, User, Bell, Save, CheckCircle2 } from 'lucide-react';

export const CoachSettings: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      await api.updateMember(user.id, { name, phone });
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
          COACH PREFERENCES
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          COACH ACCOUNT SETTINGS
        </h1>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>SETTINGS UPDATED SUCCESSFULLY</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                COACH NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
                CONTACT PHONE
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-widest text-sm rounded shadow-glow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'SAVING...' : 'SAVE SETTINGS'}</span>
        </button>
      </form>
    </div>
  );
};
