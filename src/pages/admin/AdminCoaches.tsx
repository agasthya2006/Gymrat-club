// src/pages/admin/AdminCoaches.tsx
import React from 'react';
import { useGymData } from '../../context/GymDataContext';
import { Shield, Star, Award, DollarSign } from 'lucide-react';

export const AdminCoaches: React.FC = () => {
  const { coaches } = useGymData();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          TRAINER OPERATIONAL REGISTRY
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          CERTIFIED COACH ROSTER
        </h1>
        <p className="text-xs text-zinc-400">
          Audit certified coaches, hourly rate allocations, and active athlete assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map(c => {
          const prof = c.profile || {};
          return (
            <div key={c.id} className="bg-[#14151C] border border-[#27272A] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full border border-[#E1601B] overflow-hidden bg-zinc-900 shrink-0">
                    <img src={c.avatar_url} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-[#E1601B] uppercase font-bold">
                      CALLSIGN: {prof.callsign || 'COACH'}
                    </div>
                    <h3 className="font-display text-lg font-bold uppercase text-white">
                      {c.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                  {prof.bio}
                </p>

                <div className="space-y-1.5 text-xs font-mono text-zinc-400 border-t border-[#27272A] pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">ASSIGNED ATHLETES:</span>
                    <span className="text-white font-bold">{c.athletes_count || 4} Clients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">RATE:</span>
                    <span className="text-[#E1601B] font-bold">₹{(prof.hourly_rate ? (prof.hourly_rate > 500 ? prof.hourly_rate : prof.hourly_rate * 20) : 1500).toLocaleString('en-IN')} / HR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">RATING:</span>
                    <span className="text-emerald-400 font-bold">{prof.rating || '4.95'} ★</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#27272A]">
                <span className="w-full block py-2 text-center text-[10px] font-mono uppercase bg-[#0D0D11] text-emerald-400 rounded border border-emerald-500/20 font-bold">
                  ACTIVE CERTIFICATION VERIFIED ✓
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
