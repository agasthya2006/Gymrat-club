// src/pages/admin/AdminSettings.tsx
import React, { useState } from 'react';
import { Settings, Shield, Server, Database, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [arenaCapacity, setArenaCapacity] = useState(120);
  const [maintenanceCadenceDays, setMaintenanceCadenceDays] = useState(30);
  const [autoCheckinThresholdMinutes, setAutoCheckinThresholdMinutes] = useState(15);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('SYSTEM PARAMETERS COMMITTED TO OMEGA ENCLAVE');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl font-mono text-xs">
      <div>
        <span className="text-[#E1601B] uppercase tracking-widest block mb-1">
          OPERATIONAL SYSTEM CONFIGURATION
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          FACILITY OPERATING PARAMETERS
        </h1>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-bold uppercase text-white mb-2 flex items-center gap-2">
            <Server className="w-4 h-4 text-[#E1601B]" /> ARENA HARDWARE PARAMETERS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase mb-1">
                MAX FACILITY CAPACITY
              </label>
              <input
                type="number"
                value={arenaCapacity}
                onChange={e => setArenaCapacity(Number(e.target.value))}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">
                MAINTENANCE AUDIT CYCLE (DAYS)
              </label>
              <input
                type="number"
                value={maintenanceCadenceDays}
                onChange={e => setMaintenanceCadenceDays(Number(e.target.value))}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">
                PASS REFRESH INTERVAL (MIN)
              </label>
              <input
                type="number"
                value={autoCheckinThresholdMinutes}
                onChange={e => setAutoCheckinThresholdMinutes(Number(e.target.value))}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-widest text-sm rounded shadow-glow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>COMMIT SYSTEM CONFIGURATION</span>
        </button>
      </form>
    </div>
  );
};
