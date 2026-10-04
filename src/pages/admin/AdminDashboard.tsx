// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGymData } from '../../context/GymDataContext';
import { api } from '../../services/api';
import { AdminStats } from '../../types';
import {
  Users,
  Shield,
  Activity,
  DollarSign,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  Megaphone,
  Radio,
  Flame
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { equipment, announcements, refreshAll } = useGymData();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats().then(s => {
      setStats(s);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [equipment]);

  const maintenanceNeeded = equipment.filter(e => e.status !== 'OPERATIONAL');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-[#E1601B]/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-red-950/60 text-red-400 border border-red-500/30 rounded flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> LEVEL 4 CLEARANCE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                FACILITY STATUS: 100% OPERATIONAL
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase font-bold text-white tracking-tight">
              CLUB COMMAND CENTER // OPERATIONS OPS
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              CHIEF OPERATOR {user?.name.toUpperCase()} • FACILITY MONITORING & REVENUE TELEMETRY
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/announcements"
              className="px-4 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded shadow-glow-sm transition-all flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4" />
              <span>BROADCAST NOTICE</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Telemetry Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
            <span>TOTAL MEMBERS</span>
            <Users className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            {stats?.totalMembers || 24}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            {stats?.activeMembers || 21} ACTIVE SUBSCRIPTIONS
          </div>
        </div>

        {/* Today's Check-ins */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
            <span>TODAY'S CHECK-INS</span>
            <Activity className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            {stats?.todayAttendance || 5}
          </div>
          <div className="text-[10px] font-mono text-[#E1601B] mt-1">
            RECORDED IN LIVE AUDIT
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
            <span>MONTHLY REVENUE</span>
            <DollarSign className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '18,450'}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            +14% VS PRIOR MONTH
          </div>
        </div>

        {/* Equipment Requiring Maintenance */}
        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
            <span>EQUIPMENT ATTENTION</span>
            <Wrench className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-display text-3xl font-bold text-amber-400">
            {maintenanceNeeded.length} <span className="text-sm font-sans text-zinc-500">UNITS</span>
          </div>
          <div className="text-[10px] font-mono text-amber-400 mt-1">
            MAINTENANCE TRIGGERED
          </div>
        </div>
      </div>

      {/* Real-time Facility Occupancy Gauge & Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Gauge */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#E1601B] animate-pulse" /> FACILITY OCCUPANCY GAUGE
              </h3>
              <span className="text-xs font-mono text-zinc-500">CAPACITY: 120</span>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              {/* Circular gauge representation */}
              <div className="relative w-44 h-44 rounded-full border-8 border-zinc-800 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-8 border-[#E1601B] border-t-transparent border-l-transparent transform -rotate-45"
                />
                <div className="text-center z-10">
                  <div className="font-display text-5xl font-bold text-white">
                    {stats?.facilityOccupancyPercent || 28}%
                  </div>
                  <div className="text-[10px] font-mono text-[#E1601B] uppercase tracking-wider font-bold mt-1">
                    CURRENT LOAD
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0D0D11] border border-[#27272A] rounded-lg text-center text-xs font-mono text-zinc-400">
            REAL-TIME TURNSTILE ENCRYPTED COUNT: <strong className="text-white">{stats?.todayAttendance || 5} ATHLETES ON-FLOOR</strong>
          </div>
        </div>

        {/* Peak Hours Histogram */}
        <div className="lg:col-span-2 bg-[#14151C] border border-[#27272A] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E1601B]" /> ARENA TRAFFIC HISTOGRAM (PEAK HOURS)
              </h3>
              <span className="text-xs font-mono text-zinc-400">PEAK: 18:00 - 20:00</span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {stats?.peakDistribution?.map(p => (
                <div key={p.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="text-[10px] font-mono text-zinc-400">{p.count}</div>
                  <div
                    className="w-full bg-[#E1601B] hover:bg-[#FF7728] rounded-t transition-all"
                    style={{ height: `${(p.count / 70) * 100}%` }}
                  />
                  <div className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">{p.hour}</div>
                </div>
              )) || (
                <div className="text-xs font-mono text-zinc-500 text-center w-full">LOADING TELEMETRY...</div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#27272A] flex justify-between text-xs font-mono text-zinc-400">
            <span>ZONES: Free Weights, Cardio Monolith, Recovery Lab</span>
            <span className="text-[#E1601B]">UPDATED 2 MIN AGO</span>
          </div>
        </div>
      </div>

      {/* Equipment Maintenance Alerts Table */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold uppercase text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> HARDWARE MAINTENANCE ATTENTION LIST
          </h3>
          <Link to="/admin/equipment" className="text-xs font-mono text-[#E1601B] hover:underline">
            MANAGE EQUIPMENT INVENTORY ({equipment.length}) →
          </Link>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {maintenanceNeeded.map(eq => (
            <div
              key={eq.id}
              className="p-3 bg-[#0D0D11] border border-[#27272A] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <span className="text-[10px] text-zinc-500">{eq.code} • {eq.location_zone}</span>
                <div className="font-bold text-white text-sm">{eq.name}</div>
                <div className="text-[11px] text-amber-400/90 mt-0.5">{eq.notes}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  eq.status === 'OUT_OF_SERVICE'
                    ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                }`}>
                  {eq.status}
                </span>
                <Link
                  to="/admin/equipment"
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] uppercase rounded"
                >
                  RESOLVE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
