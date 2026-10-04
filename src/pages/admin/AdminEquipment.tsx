// src/pages/admin/AdminEquipment.tsx
import React, { useState } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { Wrench, Plus, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

export const AdminEquipment: React.FC = () => {
  const { equipment, updateEquipmentStatusAction } = useGymData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: 'OPERATIONAL' | 'MAINTENANCE_REQUIRED' | 'OUT_OF_SERVICE') => {
    setUpdatingId(id);
    try {
      await updateEquipmentStatusAction(id, newStatus);
      setNotice(`EQUIPMENT STATUS MUTATED // Unit updated to ${newStatus}`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location_zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            HARDWARE INVENTORY & RIG INTEGRITY
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            EQUIPMENT MAINTENANCE TELEMETRY
          </h1>
          <p className="text-xs text-zinc-400">
            Monitor mechanical integrity of calibrated racks, barbells, cable monoliths, and recovery tanks.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search equipment by code, name, zone..."
            className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded pl-9 pr-3 py-2 text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500">FILTER STATUS:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0D0D11] border border-[#27272A] rounded px-3 py-2 text-white"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="OPERATIONAL">OPERATIONAL</option>
            <option value="MAINTENANCE_REQUIRED">MAINTENANCE REQUIRED</option>
            <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
          </select>
        </div>
      </div>

      {/* Equipment List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
        {filtered.map(eq => {
          const isUpdating = updatingId === eq.id;
          return (
            <div
              key={eq.id}
              className={`p-5 bg-[#14151C] border rounded-xl flex flex-col justify-between transition-all ${
                eq.status === 'OUT_OF_SERVICE'
                  ? 'border-red-500/50'
                  : eq.status === 'MAINTENANCE_REQUIRED'
                  ? 'border-amber-500/50'
                  : 'border-[#27272A]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-zinc-500">{eq.code} • {eq.category}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    eq.status === 'OPERATIONAL'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : eq.status === 'MAINTENANCE_REQUIRED'
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      : 'bg-red-950/60 text-red-400 border border-red-500/30'
                  }`}>
                    {eq.status}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white uppercase mb-1">
                  {eq.name}
                </h3>
                <div className="text-[11px] text-zinc-400 mb-3">{eq.location_zone}</div>
                <p className="text-zinc-400 text-xs italic bg-[#0D0D11] p-2.5 rounded border border-[#27272A]/50 mb-4">
                  "{eq.notes}"
                </p>
              </div>

              {/* Status Toggle Controls */}
              <div className="pt-3 border-t border-[#27272A] space-y-2">
                <div className="text-[10px] text-zinc-500 uppercase">CHANGE OPERATIONAL STATE:</div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    onClick={() => handleStatusChange(eq.id, 'OPERATIONAL')}
                    disabled={isUpdating || eq.status === 'OPERATIONAL'}
                    className={`py-1.5 rounded transition-all ${
                      eq.status === 'OPERATIONAL'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-[#0D0D11] hover:bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    READY
                  </button>
                  <button
                    onClick={() => handleStatusChange(eq.id, 'MAINTENANCE_REQUIRED')}
                    disabled={isUpdating || eq.status === 'MAINTENANCE_REQUIRED'}
                    className={`py-1.5 rounded transition-all ${
                      eq.status === 'MAINTENANCE_REQUIRED'
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-[#0D0D11] hover:bg-amber-950/40 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    MAINT
                  </button>
                  <button
                    onClick={() => handleStatusChange(eq.id, 'OUT_OF_SERVICE')}
                    disabled={isUpdating || eq.status === 'OUT_OF_SERVICE'}
                    className={`py-1.5 rounded transition-all ${
                      eq.status === 'OUT_OF_SERVICE'
                        ? 'bg-red-500 text-black font-bold'
                        : 'bg-[#0D0D11] hover:bg-red-950/40 text-red-300 border border-red-500/30'
                    }`}
                  >
                    OFFLINE
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
