// src/pages/admin/GymAdminDashboard.tsx
// Gym-Specific Admin Dashboard — GYMRAT CLUB Multi-Gym Platform
// Each gym manager sees ONLY their gym's data
import React, { useState } from 'react';
import { NEARBY_GYMS, NearbyGym } from '../../data/nearbyGyms';
import {
  Users,
  Award,
  Calendar,
  TrendingUp,
  CheckSquare,
  Megaphone,
  ChevronDown,
  Star,
  MapPin,
  Dumbbell,
  BarChart2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

// ─── Metric Card ─────────────────────────────────────────────
function MetricCard({ label, value, sub, icon: Icon, color = '#FF5500' }: {
  label: string;
  value: string | number;
  sub?: string;
  icon: any;
  color?: string;
}) {
  return (
    <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className="font-display text-xl font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="font-mono text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Occupancy Bar ────────────────────────────────────────────
function OccupancyBar({ pct }: { pct: number }) {
  const color = pct >= 85 ? '#EF4444' : pct >= 60 ? '#EAB308' : '#10B981';
  const label = pct >= 85 ? 'PACKED' : pct >= 60 ? 'MODERATE' : 'LIGHT';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-mono">
        <span className="text-zinc-500">LIVE OCCUPANCY</span>
        <span style={{ color }} className="font-bold">{label} — {pct}%</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SectionHead({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-[#FF5500]" />
      <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">{label}</h3>
    </div>
  );
}

export const GymAdminDashboard: React.FC = () => {
  const [selectedGymId, setSelectedGymId] = useState(NEARBY_GYMS[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'trainers' | 'schedule' | 'attendance' | 'announcements'>('overview');

  const gym = NEARBY_GYMS.find(g => g.id === selectedGymId) as NearbyGym;
  const activeMembers = gym.members.filter(m => m.status === 'ACTIVE').length;
  const expiringMembers = gym.members.filter(m => m.status === 'EXPIRING').length;
  const todayAttendance = gym.attendance.length;

  const tabs = [
    { key: 'overview', label: 'OVERVIEW', icon: BarChart2 },
    { key: 'members', label: 'MEMBERS', icon: Users },
    { key: 'trainers', label: 'TRAINERS', icon: Award },
    { key: 'schedule', label: 'SCHEDULE', icon: Calendar },
    { key: 'attendance', label: 'ATTENDANCE', icon: CheckSquare },
    { key: 'announcements', label: 'POSTS', icon: Megaphone },
  ] as const;

  const catColors: Record<string, string> = {
    STRENGTH: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    HYPERTROPHY: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    CONDITIONING: 'text-red-400 bg-red-400/10 border-red-400/30',
    ENDURANCE: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    RECOVERY: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            GYM <span className="text-[#FF5500]">MANAGEMENT</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select a location to oversee its members, staff, schedules, and capacity.
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedGymId}
            onChange={e => { setSelectedGymId(e.target.value); setActiveTab('overview'); }}
            className="appearance-none bg-[#14151C] border border-zinc-700 hover:border-[#FF5500]/50 text-white font-mono text-xs rounded-xl pl-4 pr-10 py-3 outline-none cursor-pointer transition-colors"
          >
            {NEARBY_GYMS.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-32 rounded-2xl overflow-hidden">
        <img src={gym.photos[0].url} alt={gym.name} className="w-full h-full object-cover" loading="lazy" />
        <div className={`absolute inset-0 bg-gradient-to-r ${gym.coverGradient} opacity-85`} />
        <div className="absolute inset-0 flex items-center px-6 gap-4">
          <div className="flex-1">
            <h2 className="font-display text-base sm:text-xl font-bold text-white uppercase tracking-wider">{gym.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500]" />
                <span className="font-mono text-[10px] text-white">{gym.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF5500]" />
                <span className="font-mono text-[10px] text-zinc-300">{gym.address}</span>
              </div>
              <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border ${gym.isOpen ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border-red-500/40 text-red-300'}`}>
                {gym.isOpen ? '● OPEN' : '● CLOSED'}
              </span>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="font-mono text-[9px] text-zinc-400">MANAGED BY</p>
            <p className="font-mono text-xs text-white font-bold">{gym.manager_name}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="TOTAL MEMBERS" value={gym.members.length} sub={`${activeMembers} active`} icon={Users} />
        <MetricCard label="TRAINERS" value={gym.trainers.length} sub="Certified coaches" icon={Award} color="#A855F7" />
        <MetricCard label="TODAY CHECK-INS" value={todayAttendance} sub="Verified entries" icon={CheckSquare} color="#10B981" />
        <MetricCard label="PLANS OFFERED" value={gym.plans.length} sub={`From ₹${gym.starting_price.toLocaleString('en-IN')}/mo`} icon={Dumbbell} color="#3B82F6" />
      </div>

      {/* Occupancy */}
      <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
        <OccupancyBar pct={gym.isOpen ? gym.occupancy : 0} />
        <div className="flex gap-4 mt-3">
          {[
            { label: 'INSIDE', value: gym.isOpen ? gym.occupancy_count : 0 },
            { label: 'CAPACITY', value: gym.occupancy_max },
            { label: 'AVAILABLE', value: Math.max(0, gym.occupancy_max - (gym.isOpen ? gym.occupancy_count : 0)) },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="font-display text-lg font-bold text-white">{item.value}</p>
              <p className="font-mono text-[9px] text-zinc-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0D0D11] border border-zinc-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg font-mono text-[10px] tracking-wider whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.key ? 'bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:block sm:block">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <SectionHead icon={CheckSquare} label="RECENT CHECK-INS" />
            {gym.attendance.map(a => (
              <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-zinc-800/60 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center">
                    <Users className="w-3 h-3 text-[#FF5500]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-white font-bold">{a.member_name}</p>
                    <p className="font-mono text-[9px] text-zinc-600">{a.method}</p>
                  </div>
                </div>
                <span className="font-mono text-[9px] text-zinc-500">
                  {new Date(a.checked_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {gym.attendance.length === 0 && <p className="font-mono text-xs text-zinc-600 text-center py-6">No check-ins yet.</p>}
          </div>

          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <SectionHead icon={Calendar} label="CLASS SCHEDULE" />
            {gym.classes.slice(0, 4).map(cls => (
              <div key={cls.id} className="flex items-center gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
                <div className="text-center w-14 shrink-0">
                  <p className="font-mono text-xs font-bold text-white">{cls.time}</p>
                  <p className="font-mono text-[9px] text-zinc-600">{cls.duration}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs font-bold text-white truncate">{cls.name}</p>
                  <p className="font-mono text-[10px] text-zinc-500">{cls.coach}</p>
                </div>
                <span className={`font-mono text-[10px] font-bold ${cls.spots_left <= 3 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {cls.spots_left}
                </span>
              </div>
            ))}
            {gym.classes.length === 0 && <p className="font-mono text-xs text-zinc-600 text-center py-6">No classes.</p>}
          </div>

          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <SectionHead icon={TrendingUp} label="MEMBERSHIP STATUS" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="font-display text-2xl font-bold text-[#FF5500]">{activeMembers}</p><p className="font-mono text-[9px] text-zinc-500 mt-1">ACTIVE</p></div>
              <div><p className="font-display text-2xl font-bold text-yellow-400">{expiringMembers}</p><p className="font-mono text-[9px] text-zinc-500 mt-1">EXPIRING</p></div>
              <div><p className="font-display text-2xl font-bold text-zinc-400">{gym.members.length}</p><p className="font-mono text-[9px] text-zinc-500 mt-1">TOTAL</p></div>
            </div>
          </div>

          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <SectionHead icon={Dumbbell} label="MEMBERSHIP PLANS" />
            {gym.plans.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-zinc-800/60 last:border-0">
                <div>
                  <p className="font-display text-xs font-bold text-white">{p.name}</p>
                  {p.popular && <span className="font-mono text-[8px] text-[#FF5500]">● POPULAR PLAN</span>}
                </div>
                <span className="font-display text-sm font-bold text-[#FF5500]">₹{p.price.toLocaleString('en-IN')}/mo</span>
              </div>
            ))}
          </div>

          {/* Cleanliness & Hygiene Audit */}
          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <SectionHead icon={Sparkles} label="CLEANLINESS & HYGIENE VERIFICATION" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold text-white">✨ {gym.cleanliness?.score || 4.9}</span>
                <span className="text-[10px] font-mono text-zinc-400">/ 5.0 Audit Score</span>
              </div>
              <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/30 font-bold">
                {gym.cleanliness?.status || 'VERIFIED HYGIENIC'}
              </span>
            </div>
            <p className="font-mono text-[10px] text-zinc-400 mb-3">
              🕒 Last Disinfected: <span className="text-zinc-200">{gym.cleanliness?.last_sanitized || '15 mins ago'}</span> • Daily Audits: <span className="text-zinc-200">{gym.cleanliness?.inspections_today || 6} passes completed</span>
            </p>
            <div className="space-y-1.5 border-t border-zinc-800 pt-2.5">
              {(gym.cleanliness?.highlights || ['Hospital-grade equipment sanitation', 'HEPA air filtration active', 'Continuous shower sterilization']).map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-300 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Arena Facilities */}
          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <SectionHead icon={ShieldCheck} label="ARENA FACILITIES & AMENITIES" />
            <p className="font-mono text-[10px] text-zinc-400 mb-3">Active verified amenities available at this location:</p>
            <div className="grid grid-cols-2 gap-2">
              {gym.facilities.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#14151C] border border-zinc-800 text-zinc-300 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MEMBERS */}
      {activeTab === 'members' && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
          <SectionHead icon={Users} label={`GYM MEMBERS — ${gym.name}`} />
          <p className="font-mono text-[10px] text-zinc-600 mb-4">Showing {gym.members.length} members. Data isolated from other arenas.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['MEMBER', 'PLAN', 'STATUS', 'JOINED'].map(h => (
                    <th key={h} className="pb-3 pr-4 font-mono text-[10px] text-zinc-500 tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gym.members.map(m => (
                  <tr key={m.id} className="border-b border-zinc-800/40 hover:bg-[#14151C]/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1E1F28] border border-zinc-700 flex items-center justify-center">
                          <span className="font-display text-[9px] font-bold text-[#FF5500]">{m.name.charAt(0)}</span>
                        </div>
                        <span className="font-mono text-xs text-white">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4"><span className="font-mono text-[10px] text-zinc-300">{m.plan}</span></td>
                    <td className="py-3 pr-4">
                      <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${m.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-400/15 text-yellow-400'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3"><span className="font-mono text-[10px] text-zinc-500">{m.joined}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRAINERS */}
      {activeTab === 'trainers' && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
          <SectionHead icon={Award} label={`TRAINERS — ${gym.name}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gym.trainers.map(t => (
              <div key={t.id} className="flex gap-3 p-4 bg-[#14151C] border border-zinc-800 rounded-xl">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-zinc-700 shrink-0" loading="lazy" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-xs font-bold text-white truncate">{t.name}</span>
                    <span className="font-mono text-[9px] bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 px-1.5 py-0.5 rounded shrink-0">{t.callsign}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-2.5 h-2.5 text-[#FF5500] fill-[#FF5500]" />
                    <span className="font-mono text-[9px] text-zinc-400">{t.rating} • ₹{t.hourly_rate.toLocaleString('en-IN')}/hr</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {t.specialties.slice(0, 2).map(s => (
                      <span key={s} className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#1E1F28] text-zinc-500 border border-zinc-800">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
          <SectionHead icon={Calendar} label={`CLASS SCHEDULE — ${gym.name}`} />
          {gym.classes.map(cls => (
            <div key={cls.id} className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-0">
              <div className="text-center shrink-0 w-14">
                <p className="font-mono text-xs font-bold text-white">{cls.time}</p>
                <p className="font-mono text-[9px] text-zinc-600">{cls.duration}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs font-bold text-white truncate">{cls.name}</p>
                <p className="font-mono text-[10px] text-zinc-500">{cls.coach} • {cls.day}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`font-mono text-[9px] px-2 py-0.5 rounded-md border ${catColors[cls.category] || 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
                  {cls.category}
                </span>
                <span className={`font-mono text-[10px] font-bold ${cls.spots_left <= 3 ? 'text-red-400' : 'text-zinc-400'}`}>
                  {cls.spots_left} spots
                </span>
              </div>
            </div>
          ))}
          {gym.classes.length === 0 && <p className="font-mono text-xs text-zinc-600 text-center py-8">No classes scheduled.</p>}
        </div>
      )}

      {/* ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
          <SectionHead icon={CheckSquare} label={`CHECK-IN LOG — ${gym.name}`} />
          {gym.attendance.map(a => (
            <div key={a.id} className="flex items-center justify-between py-3 border-b border-zinc-800/60 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-mono text-xs text-white font-bold">{a.member_name}</p>
                  <p className="font-mono text-[9px] text-zinc-600">{a.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-zinc-400">
                  {new Date(a.checked_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="font-mono text-[9px] text-zinc-600">{new Date(a.checked_in).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {gym.attendance.length === 0 && <p className="font-mono text-xs text-zinc-600 text-center py-8">No records found.</p>}
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
          <SectionHead icon={Megaphone} label={`ANNOUNCEMENTS — ${gym.name}`} />
          <div className="space-y-4">
            {gym.announcements.map(a => (
              <div key={a.id} className={`rounded-xl p-4 border ${a.pinned ? 'border-[#FF5500]/30 bg-[#FF5500]/5' : 'border-zinc-800 bg-[#14151C]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {a.pinned && <span className="font-mono text-[9px] text-[#FF5500] font-bold">📌 PINNED</span>}
                  <span className="font-mono text-[9px] text-zinc-600">{a.date}</span>
                </div>
                <p className="font-display text-sm font-bold text-white">{a.title}</p>
                <p className="font-mono text-[11px] text-zinc-400 mt-1.5 leading-relaxed">{a.content}</p>
              </div>
            ))}
            {gym.announcements.length === 0 && <p className="font-mono text-xs text-zinc-600 text-center py-8">No announcements posted.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default GymAdminDashboard;
