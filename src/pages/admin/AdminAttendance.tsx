// src/pages/admin/AdminAttendance.tsx
import React, { useState } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { CheckSquare, Search, Radio, Clock, MapPin } from 'lucide-react';

export const AdminAttendance: React.FC = () => {
  const { attendance } = useGymData();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = attendance.filter(a =>
    a.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            FACILITY TURNSTILE TELEMETRY
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            ATTENDANCE & ADMISSION AUDIT
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time feed of hardware turnstile passes, QR scans, and room access events.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by athlete or terminal..."
            className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#E1601B] rounded pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
          <span className="text-zinc-400">TOTAL VERIFIED CHECK-INS: <strong className="text-white">{filtered.length}</strong></span>
          <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> OPTICAL SCANNER FEED SYNCED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0D0D11] text-zinc-500 uppercase border-b border-[#27272A] text-[10px]">
                <th className="p-4">ATHLETE</th>
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">TERMINAL LOCATION</th>
                <th className="p-4">METHOD</th>
                <th className="p-4 text-right">SECURITY STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-[#1E1F28]/50 transition-colors">
                  <td className="p-4 font-bold text-white">{a.member_name}</td>
                  <td className="p-4 text-zinc-300">
                    {new Date(a.checked_in_at).toLocaleDateString()} {new Date(a.checked_in_at).toLocaleTimeString()}
                  </td>
                  <td className="p-4 text-zinc-400">{a.location}</td>
                  <td className="p-4">
                    <span className="px-1.5 py-0.5 bg-[#0D0D11] border border-[#27272A] text-[#E1601B] rounded text-[10px]">
                      {a.method}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-emerald-400 font-bold text-[10px]">ACCESS GRANTED ✓</span>
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
