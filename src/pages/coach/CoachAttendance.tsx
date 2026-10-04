// src/pages/coach/CoachAttendance.tsx
import React from 'react';
import { useGymData } from '../../context/GymDataContext';
import { CheckSquare, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const CoachAttendance: React.FC = () => {
  const { attendance } = useGymData();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          FACILITY CHECK-IN FEED
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          ATHLETE ATTENDANCE AUDIT
        </h1>
        <p className="text-xs text-zinc-400">
          Live feed of turnstile check-ins and session admissions across all arena sectors.
        </p>
      </div>

      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between font-mono text-xs">
          <span className="text-zinc-400">TOTAL VERIFIED CHECK-INS: <strong className="text-white">{attendance.length}</strong></span>
          <span className="text-[#FF5500] flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#FF5500]" /> LIVE STREAM ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0D0D11] text-zinc-500 uppercase border-b border-[#27272A] text-[10px]">
                <th className="p-4">ATHLETE NAME</th>
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">FACILITY LOCATION</th>
                <th className="p-4">METHOD</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {attendance.map(a => (
                <tr key={a.id} className="hover:bg-[#1E1F28]/50 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{a.member_name}</span>
                  </td>
                  <td className="p-4 text-zinc-300">
                    {new Date(a.checked_in_at).toLocaleDateString()} {new Date(a.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-4 text-zinc-400">{a.location}</td>
                  <td className="p-4">
                    <span className="px-1.5 py-0.5 bg-[#0D0D11] border border-[#27272A] text-[#E1601B] rounded text-[10px]">
                      {a.method}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-emerald-400 font-bold text-[10px]">VERIFIED ✓</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
