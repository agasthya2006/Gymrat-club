// src/pages/coach/CoachAvailability.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Clock, Plus, CheckCircle2, Calendar, AlertCircle } from 'lucide-react';

export const CoachAvailability: React.FC = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState<any[]>([]);
  const [date, setDate] = useState('2026-09-30');
  const [time, setTime] = useState('11:00 - 12:00');
  const [isAdding, setIsAdding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      api.getCoachSlots(user.id).then(res => {
        setSlots(res || []);
      }).catch(err => console.error(err));
    }
  }, [user]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsAdding(true);
    setNotice(null);

    try {
      const newSlot = await api.addCoachSlot(user.id, { date, time });
      setSlots(prev => [...prev, newSlot]);
      setNotice(`TIME SLOT ACTIVE // Athletes can now book ${date} at ${time}`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          CAPACITY & APPOINTMENT CADENCE
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          TRAINER AVAILABILITY MANAGER
        </h1>
        <p className="text-xs text-zinc-400">
          Open or restrict appointment windows for private 1-on-1 coaching blocks.
        </p>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add Slot Form */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
        <h2 className="font-display text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#E1601B]" /> OPEN NEW BOOKABLE APPOINTMENT SLOT
        </h2>

        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
              SESSION DATE
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1">
              TIME WINDOW
            </label>
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none"
            >
              <option value="08:00 - 09:00">08:00 - 09:00</option>
              <option value="09:30 - 10:30">09:30 - 10:30</option>
              <option value="11:00 - 12:00">11:00 - 12:00</option>
              <option value="14:00 - 15:00">14:00 - 15:00</option>
              <option value="16:00 - 17:00">16:00 - 17:00</option>
              <option value="18:00 - 19:00">18:00 - 19:00</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isAdding}
            className="w-full py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-sm rounded shadow-glow-sm transition-all"
          >
            {isAdding ? 'OPENING...' : 'PUBLISH SLOT'}
          </button>
        </form>
      </div>

      {/* Existing Slots */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
        <h2 className="font-display text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#E1601B]" /> ACTIVE APPOINTMENT BLOCKS ({slots.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {slots.map(s => (
            <div
              key={s.id}
              className={`p-3 rounded-lg border font-mono text-xs ${
                s.is_booked
                  ? 'bg-red-950/20 border-red-500/30 text-red-300'
                  : 'bg-[#0D0D11] border-[#27272A] text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span>{s.date}</span>
                <span className={`px-1.5 py-0.5 rounded font-bold ${
                  s.is_booked ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {s.is_booked ? 'BOOKED' : 'OPEN'}
                </span>
              </div>
              <div className="font-bold text-white text-sm">{s.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
