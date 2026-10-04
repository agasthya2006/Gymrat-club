// src/pages/member/MemberMyGyms.tsx
// My Gyms — User's active gym memberships across the network
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NEARBY_GYMS, USER_GYM_MEMBERSHIPS } from '../../data/nearbyGyms';
import {
  MapPin,
  Star,
  Calendar,
  Check,
  ChevronRight,
  Plus,
  Dumbbell,
  Clock,
  QrCode,
  Zap,
} from 'lucide-react';

function OccupancyBar({ pct }: { pct: number }) {
  const color = pct >= 85 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-emerald-400';
  const label = pct >= 85 ? 'PACKED' : pct >= 60 ? 'MODERATE' : 'LIGHT';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`font-mono text-[9px] font-bold ${pct >= 85 ? 'text-red-400' : pct >= 60 ? 'text-yellow-400' : 'text-emerald-400'}`}>
        {label}
      </span>
    </div>
  );
}

export const MemberMyGyms: React.FC = () => {
  const navigate = useNavigate();

  // Merge user memberships with gym data
  const myGyms = USER_GYM_MEMBERSHIPS.map(membership => ({
    membership,
    gym: NEARBY_GYMS.find(g => g.id === membership.gym_id)!,
  })).filter(entry => !!entry.gym);

  const otherGyms = NEARBY_GYMS.filter(
    g => !USER_GYM_MEMBERSHIPS.some(m => m.gym_id === g.id)
  );

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────── */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
          MY <span className="text-[#FF5500]">GYMS</span>
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your active memberships, view renewal dates, and access instant QR entry passes.
        </p>
      </div>

      {/* ── Active Memberships ────────────────── */}
      {myGyms.length > 0 ? (
        <div className="space-y-5">
          <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" /> ACTIVE MEMBERSHIPS ({myGyms.length})
          </h2>

          {myGyms.map(({ membership, gym }) => {
            const daysLeft = Math.max(
              0,
              Math.floor(
                (new Date(membership.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
            );
            const expiryWarning = daysLeft <= 7;

            return (
              <div
                key={membership.gym_id}
                className="bg-[#0D0D11] border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#FF5500]/30 transition-colors"
              >
                {/* Cover banner */}
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={gym.photos[0].url}
                    alt={gym.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${gym.coverGradient} opacity-75`} />

                  {/* Status badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      membership.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/20 border-red-500/40 text-red-300'
                    }`}>
                      ● {membership.status}
                    </span>
                    {gym.isOpen && (
                      <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FF5500]/20 border border-[#FF5500]/40 text-[#FF5500]">
                        OPEN NOW
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                      {gym.name}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  {/* Plan info */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-zinc-500">PLAN:</span>
                        <span className="font-display text-sm font-bold text-[#FF5500]">{membership.plan_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-zinc-500">MEMBER CODE:</span>
                        <span className="font-mono text-[10px] text-white font-bold">{membership.member_code}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="w-3 h-3 text-[#FF5500]" />
                        <span className="font-mono text-[10px] text-zinc-400">{membership.check_ins} check-ins</span>
                      </div>
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    expiryWarning
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-[#14151C] border-zinc-800'
                  }`}>
                    <Calendar className={`w-3.5 h-3.5 ${expiryWarning ? 'text-red-400' : 'text-zinc-500'}`} />
                    <span className={`font-mono text-[10px] ${expiryWarning ? 'text-red-300 font-bold' : 'text-zinc-400'}`}>
                      {expiryWarning
                        ? `⚠ EXPIRING IN ${daysLeft} DAYS — ${membership.expiry_date}`
                        : `Renews: ${membership.expiry_date} • ${daysLeft} days remaining`}
                    </span>
                  </div>

                  {/* Occupancy */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-zinc-600" />
                        <span className="font-mono text-[10px] text-zinc-500">LIVE OCCUPANCY</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {gym.isOpen ? `${gym.occupancy_count}/${gym.occupancy_max}` : 'CLOSED'}
                      </span>
                    </div>
                    {gym.isOpen ? (
                      <OccupancyBar pct={gym.occupancy} />
                    ) : (
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-[10px]">Currently Closed</span>
                      </div>
                    )}
                  </div>

                  {/* Quick info row */}
                  <div className="flex flex-wrap gap-3 text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#FF5500]" />
                      <span className="font-mono text-[10px]">{gym.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-[#FF5500]" />
                      <span className="font-mono text-[10px]">{gym.rating} ({gym.review_count})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-600" />
                      <span className="font-mono text-[10px]">{gym.openingHours[0].hours}</span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-3 pt-1 border-t border-zinc-800/60">
                    <button
                      onClick={() => navigate(`/discover/${gym.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#14151C] hover:bg-[#1E1F28] border border-zinc-800 hover:border-zinc-700 text-white font-mono text-[11px] uppercase tracking-wider font-bold transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#FF5500]" /> GYM PROFILE
                    </button>
                    <button
                      onClick={() => navigate('/member/check-in')}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-mono text-[11px] uppercase tracking-wider font-bold transition-all"
                    >
                      <QrCode className="w-3.5 h-3.5" /> CHECK IN
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
          <div className="w-20 h-20 rounded-full bg-[#14151C] border border-zinc-800 flex items-center justify-center">
            <Dumbbell className="w-9 h-9 text-zinc-700" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-zinc-400 uppercase">NO ACTIVE MEMBERSHIPS</h3>
            <p className="font-mono text-xs text-zinc-600 mt-2 max-w-sm">
              You haven't joined any gyms yet. Discover nearby arenas and start your journey.
            </p>
          </div>
          <button
            onClick={() => navigate('/member/discover-gyms')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] text-white font-display text-sm uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(225,96,27,0.4)]"
          >
            <Plus className="w-4 h-4" /> DISCOVER GYMS
          </button>
        </div>
      )}

      {/* ── Other Gyms in Network ─────────────── */}
      <div className="space-y-4">
        <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#FF5500]" /> MORE NEARBY ARENAS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherGyms.map(gym => (
            <button
              key={gym.id}
              onClick={() => navigate(`/discover/${gym.id}`)}
              className="group text-left bg-[#0D0D11] border border-zinc-800 hover:border-[#FF5500]/40 rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,85,0,0.1)]"
            >
              <div className="relative h-28 overflow-hidden">
                <img src={gym.photos[0].url} alt={gym.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className={`absolute inset-0 bg-gradient-to-t ${gym.coverGradient} opacity-70`} />
                <div className="absolute top-2 left-2">
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    gym.isOpen
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-zinc-800/60 border-zinc-700/40 text-zinc-400'
                  }`}>
                    {gym.isOpen ? '● OPEN' : '● CLOSED'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider truncate group-hover:text-[#FF5500] transition-colors">
                      {gym.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500]" />
                      <span className="font-mono text-[10px] text-zinc-400">{gym.rating} • {gym.distance_km} km</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-sm font-bold text-[#FF5500]">₹{gym.starting_price.toLocaleString('en-IN')}</span>
                    <p className="font-mono text-[9px] text-zinc-500">/mo</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center gap-1.5">
                    {gym.cleanliness && (
                      <span className="text-[10px] text-zinc-400">
                        ✨ {gym.cleanliness.score} Clean
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FF5500] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/member/discover-gyms')}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-[#FF5500]/40 text-zinc-500 hover:text-[#FF5500] font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> DISCOVER ALL NEARBY GYMS
        </button>
      </div>
    </div>
  );
};

export default MemberMyGyms;
