// src/pages/GymProfilePage.tsx
// Individual Gym Profile — GYMRAT CLUB Multi-Gym Platform
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NEARBY_GYMS, USER_GYM_MEMBERSHIPS, GymTrainer, GymPlan, GymClass, GymReview } from '../data/nearbyGyms';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Check,
  Zap,
  Award,
  Calendar,
  MessageSquare,
  X,
  Dumbbell,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

// ─── Occupancy bar ────────────────────────────────────────────
function OccupancyBar({ pct, count, max }: { pct: number; count: number; max: number }) {
  const color = pct >= 85 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-[#FF5500]';
  const label = pct >= 85 ? 'PACKED' : pct >= 60 ? 'MODERATE' : 'COMFORTABLE';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">LIVE OCCUPANCY</span>
        <span className={`font-mono text-[10px] font-bold ${pct >= 85 ? 'text-red-400' : pct >= 60 ? 'text-amber-400' : 'text-[#FF5500]'}`}>
          {label} — {count}/{max}
        </span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Join Modal ───────────────────────────────────────────────
function JoinModal({
  gym,
  onClose,
  onJoined,
}: {
  gym: (typeof NEARBY_GYMS)[0];
  onClose: () => void;
  onJoined: (planId: string) => void;
}) {
  const [selected, setSelected] = useState<string>(gym.plans[0].id);
  const [confirming, setConfirming] = useState(false);
  const [joined, setJoined] = useState(false);
  const plan = gym.plans.find(p => p.id === selected)!;

  const handleJoin = () => {
    setConfirming(true);
    setTimeout(() => {
      setJoined(true);
      setTimeout(() => {
        onJoined(selected);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-[#0D0D11] border border-[#27272A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-wider">JOIN GYM</h2>
            <p className="font-mono text-[10px] text-zinc-500">{gym.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#14151C] hover:bg-[#1E1F28] text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Plan selection */}
          <div className="space-y-3">
            {gym.plans.map(p => {
              const isSelected = selected === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 transform ${
                    isSelected
                      ? 'bg-[#FF5500]/10 border-2 border-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.25)] scale-[1.01]'
                      : 'bg-[#14151C] border-zinc-800 hover:border-zinc-700 hover:bg-[#181922]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-[#FF5500] text-white shadow-[0_0_8px_#FF5500]' : 'border border-zinc-600 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-display text-sm font-bold text-white">{p.name}</span>
                      {p.popular && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5500] text-white font-bold">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-display text-lg font-bold text-[#FF5500]">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-zinc-500">/mo</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 pl-7">
                    {p.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#FF5500] mt-0.5 shrink-0" />
                        <span className="text-xs text-zinc-400">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {joined ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-[#FF5500]/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-[#FF5500]" />
              </div>
              <p className="font-display text-base font-bold text-[#FF5500] uppercase tracking-wider">MEMBERSHIP ACTIVATED!</p>
              <p className="text-xs text-zinc-400">Welcome to {gym.name}</p>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={confirming}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(225,96,27,0.4)] hover:shadow-[0_0_35px_rgba(225,96,27,0.6)] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {confirming ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ACTIVATING...
                </>
              ) : (
                <>
                  JOIN {gym.name} — ₹{plan.price.toLocaleString('en-IN')}/mo
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Trainer Card ─────────────────────────────────────────────
function TrainerCard({ trainer }: { trainer: GymTrainer }) {
  return (
    <div className="bg-[#0D0D11] border border-zinc-800 rounded-xl p-4 flex gap-3 hover:border-zinc-700 transition-colors">
      <img
        src={trainer.avatar}
        alt={trainer.name}
        className="w-12 h-12 rounded-full object-cover border border-zinc-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-xs font-bold text-white truncate">{trainer.name}</span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 font-bold shrink-0">
            {trainer.callsign}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500]" />
          <span className="font-mono text-[10px] text-zinc-400">{trainer.rating} • ₹{trainer.hourly_rate.toLocaleString('en-IN')}/hr</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {trainer.specialties.slice(0, 2).map(s => (
            <span key={s} className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-[#1E1F28] text-zinc-500 border border-zinc-800">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Class Row ────────────────────────────────────────────────
function ClassRow({ cls }: { cls: GymClass }) {
  const catColors: Record<string, string> = {
    STRENGTH: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    HYPERTROPHY: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    CONDITIONING: 'text-red-400 bg-red-400/10 border-red-400/30',
    ENDURANCE: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    RECOVERY: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-0">
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
          {cls.spots_left} left
        </span>
      </div>
    </div>
  );
}

// ─── Review Card ─────────────────────────────────────────────
function ReviewCard({ review }: { review: GymReview }) {
  return (
    <div className="bg-[#0D0D11] border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <img src={review.avatar} alt={review.author} className="w-9 h-9 rounded-full object-cover border border-zinc-700" loading="lazy" />
        <div>
          <p className="font-display text-xs font-bold text-white">{review.author}</p>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-2.5 h-2.5 ${i <= review.rating ? 'text-[#FF5500] fill-[#FF5500]' : 'text-zinc-700'}`} />
              ))}
            </div>
            <span className="font-mono text-[9px] text-zinc-600">{review.date}</span>
          </div>
        </div>
      </div>
      <p className="font-sans text-xs text-zinc-400 leading-relaxed">"{review.text}"</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export const GymProfilePage: React.FC = () => {
  const { gymId } = useParams<{ gymId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'trainers' | 'reviews'>('overview');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const gym = NEARBY_GYMS.find(g => g.id === gymId);
  const existingMembership = USER_GYM_MEMBERSHIPS.find(m => m.gym_id === gymId);

  useEffect(() => {
    if (existingMembership) setIsJoined(true);
  }, [existingMembership]);

  if (!gym) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center">
        <Dumbbell className="w-12 h-12 text-zinc-700" />
        <h2 className="font-display text-xl font-bold text-zinc-400 uppercase">GYM NOT FOUND</h2>
        <button
          onClick={() => navigate('/member/discover-gyms')}
          className="font-mono text-sm text-[#FF5500] hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discovery
        </button>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'OVERVIEW', icon: Zap },
    { key: 'classes', label: 'CLASSES', icon: Calendar },
    { key: 'trainers', label: 'TRAINERS', icon: Award },
    { key: 'reviews', label: 'REVIEWS', icon: MessageSquare },
  ] as const;

  return (
    <div className="space-y-0">
      {/* ── Back nav ─────────────────────────── */}
      <button
        onClick={() => navigate('/member/discover-gyms')}
        className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-[#FF5500] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> BACK TO DISCOVER GYMS
      </button>

      {/* ── Photo Hero ───────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden h-56 sm:h-72 lg:h-80 mb-6">
        <img
          src={gym.photos[selectedPhoto].url}
          alt={gym.photos[selectedPhoto].alt}
          className="w-full h-full object-cover transition-all duration-500"
          loading="eager"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gym.coverGradient} opacity-70`} />

        {/* Photo thumbnails */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {gym.photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhoto(i)}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                selectedPhoto === i ? 'border-[#FF5500]' : 'border-zinc-700/50 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={p.url} alt={p.alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="absolute top-4 left-4">
          <span className={`font-mono text-[10px] tracking-widest font-bold px-3 py-1.5 rounded-full border ${
            gym.isOpen
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/20 border-red-500/40 text-red-300'
          }`}>
            {gym.isOpen ? '● OPEN NOW' : '● CLOSED'}
          </span>
        </div>
      </div>

      {/* ── Gym Identity Header ──────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wider leading-tight">
            {gym.name}
          </h1>
          <p className="font-mono text-sm text-[#FF5500] mt-0.5">{gym.tagline}</p>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(gym.rating) ? 'text-[#FF5500] fill-[#FF5500]' : 'text-zinc-700'}`} />
                ))}
              </div>
              <span className="font-mono text-xs font-bold text-white">{gym.rating}</span>
              <span className="font-mono text-[10px] text-zinc-500">({gym.review_count} reviews)</span>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-1.5 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-[#FF5500]" />
              <span className="font-mono text-xs">{gym.distance_km} km • {gym.address}</span>
            </div>
          </div>

          {/* Hours preview */}
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span className="font-mono text-[10px] text-zinc-500">
              {gym.openingHours[0].day}: {gym.openingHours[0].hours}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          {isJoined ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-sm font-bold">
              <Check className="w-4 h-4" />
              MEMBER ACTIVE
            </div>
          ) : (
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] hover:from-[#F06A22] hover:to-[#FF8838] text-white font-display text-sm uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(225,96,27,0.4)] hover:shadow-[0_0_35px_rgba(225,96,27,0.6)] flex items-center gap-2"
            >
              JOIN GYM <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setActiveTab('classes')}
            className="px-6 py-3 rounded-full bg-[#14151C] hover:bg-[#1E1F28] border border-zinc-800 hover:border-zinc-700 text-white font-display text-sm uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
          >
            VIEW CLASSES
          </button>
        </div>
      </div>

      {/* ── Occupancy ────────────────────────── */}
      <div className="bg-[#0D0D11] border border-zinc-800 rounded-xl p-4 mb-6">
        {gym.isOpen ? (
          <OccupancyBar pct={gym.occupancy} count={gym.occupancy_count} max={gym.occupancy_max} />
        ) : (
          <div className="flex items-center gap-3 text-zinc-500">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-xs">GYM CURRENTLY CLOSED — Check hours below</span>
          </div>
        )}
      </div>

      {/* ── Tabs ─────────────────────────────── */}
      <div className="flex gap-1 bg-[#0D0D11] border border-zinc-800 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-[11px] tracking-wider whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.key
                  ? 'bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────── */}

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Facilities Feature */}
          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF5500]" /> GYM FACILITIES & AMENITIES
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">{gym.facilities.length} AMENITIES</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {gym.facilities.map(f => (
                <div key={f} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#14151C] border border-zinc-800/80">
                  <div className="w-5 h-5 rounded-md bg-[#FF5500]/15 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#FF5500]" />
                  </div>
                  <span className="text-xs text-zinc-200 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cleanliness & Hygiene Feature */}
          {gym.cleanliness && (
            <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF5500]" /> CLEANLINESS & HYGIENE
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30">
                    VERIFIED
                  </span>
                </div>

                {/* Score Banner */}
                <div className="flex items-center gap-4 p-3.5 bg-[#14151C] rounded-xl border border-zinc-800/80 mb-3.5">
                  <div className="text-center shrink-0 pr-4 border-r border-zinc-800">
                    <div className="font-display text-2xl font-bold text-white flex items-center justify-center gap-1">
                      {gym.cleanliness.score} <span className="text-[#FF5500] text-lg">★</span>
                    </div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Cleanliness</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white">{gym.cleanliness.status}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Last sanitized <span className="text-zinc-200 font-medium">{gym.cleanliness.last_sanitized}</span> • {gym.cleanliness.inspections_today} audit rounds daily
                    </div>
                  </div>
                </div>

                {/* Cleanliness Highlights */}
                <div className="space-y-2">
                  {gym.cleanliness.highlights.map(h => (
                    <div key={h} className="flex items-start gap-2 text-xs text-zinc-300">
                      <ShieldCheck className="w-4 h-4 text-[#FF5500] mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>HYGIENE AUDIT: PASSED</span>
                <span className="text-zinc-400">UPDATED TODAY</span>
              </div>
            </div>
          )}

          {/* Opening Hours */}
          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF5500]" /> OPENING HOURS
            </h3>
            <div className="space-y-2">
              {gym.openingHours.map(h => (
                <div key={h.day} className="flex items-center justify-between py-2 border-b border-zinc-800/60 last:border-0">
                  <span className="font-mono text-xs text-zinc-400">{h.day}</span>
                  <span className={`font-mono text-xs font-bold ${h.hours === 'CLOSED' ? 'text-red-400' : 'text-white'}`}>
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Plans */}
          <div className="lg:col-span-2 bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF5500]" /> MEMBERSHIP PLANS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gym.plans.map(plan => (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-4 space-y-3 ${
                    plan.popular
                      ? 'border-[#FF5500]/50 bg-[#FF5500]/5'
                      : 'border-zinc-800 bg-[#14151C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-white">{plan.name}</span>
                    {plan.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF5500] text-white font-bold">POPULAR</span>
                    )}
                  </div>
                  <div>
                    <span className="font-display text-2xl font-bold text-[#FF5500]">₹{plan.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-zinc-400">/month</span>
                  </div>
                  <div className="space-y-1.5">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-start gap-2">
                        <Check className="w-3 h-3 text-[#FF5500] mt-0.5 shrink-0" />
                        <span className="text-xs text-zinc-300">{f}</span>
                      </div>
                    ))}
                  </div>
                  {!isJoined && (
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#E1601B] to-[#FF7728] text-white text-xs uppercase tracking-wider font-bold transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      SELECT PLAN
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          {gym.announcements.length > 0 && (
            <div className="lg:col-span-2 bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4">
                📢 GYM ANNOUNCEMENTS
              </h3>
              <div className="space-y-3">
                {gym.announcements.map(a => (
                  <div key={a.id} className={`rounded-xl p-4 border ${a.pinned ? 'border-[#FF5500]/30 bg-[#FF5500]/5' : 'border-zinc-800 bg-[#14151C]'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {a.pinned && <span className="font-mono text-[9px] text-[#FF5500] font-bold">📌 PINNED</span>}
                      <span className="font-mono text-[9px] text-zinc-600">{a.date}</span>
                    </div>
                    <p className="font-display text-sm font-bold text-white">{a.title}</p>
                    <p className="font-mono text-[11px] text-zinc-400 mt-1 leading-relaxed">{a.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CLASSES */}
      {activeTab === 'classes' && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF5500]" /> CLASS SCHEDULE
          </h3>
          {gym.classes.length === 0 ? (
            <p className="font-mono text-xs text-zinc-600 text-center py-8">No classes currently scheduled.</p>
          ) : (
            <div>
              {gym.classes.map(cls => <ClassRow key={cls.id} cls={cls} />)}
            </div>
          )}
        </div>
      )}

      {/* TRAINERS */}
      {activeTab === 'trainers' && (
        <div className="space-y-4">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#FF5500]" /> CERTIFIED TRAINERS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gym.trainers.map(t => <TrainerCard key={t.id} trainer={t} />)}
          </div>

          {/* Trainer detail cards */}
          {gym.trainers.map(t => (
            <div key={t.id} className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-2xl object-cover border border-zinc-700" loading="lazy" />
                <div>
                  <h4 className="font-display text-base font-bold text-white">{t.name}</h4>
                  <p className="font-mono text-[10px] text-[#FF5500] mt-0.5">"{t.callsign}"</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500]" />
                    <span className="font-mono text-[10px] text-zinc-400">{t.rating} • ₹{t.hourly_rate.toLocaleString('en-IN')}/hr • {t.certifications[0]}</span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-xs text-zinc-400 leading-relaxed mb-3">{t.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.certifications.map(c => (
                  <span key={c} className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-[#1E1F28] text-zinc-400 border border-zinc-800">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Rating Summary */}
          <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5 flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-[#FF5500]">{gym.rating}</p>
              <div className="flex justify-center mt-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= Math.round(gym.rating) ? 'text-[#FF5500] fill-[#FF5500]' : 'text-zinc-700'}`} />
                ))}
              </div>
              <p className="font-mono text-[10px] text-zinc-500 mt-1">{gym.review_count} reviews</p>
            </div>
            <div className="h-12 w-px bg-zinc-800" />
            <div>
              <p className="font-display text-sm font-bold text-white uppercase">Highly Rated Arena</p>
              <p className="font-mono text-xs text-zinc-500 mt-1">Members love this gym</p>
            </div>
          </div>

          {/* Review list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gym.reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      )}

      {/* ── Join Button (sticky mobile) ───────── */}
      {!isJoined && (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-30">
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#E1601B] to-[#FF7728] text-white font-display text-sm uppercase tracking-wider font-bold shadow-[0_0_25px_rgba(225,96,27,0.6)] hover:shadow-[0_0_40px_rgba(225,96,27,0.8)] transition-all"
          >
            <Zap className="w-4 h-4" /> JOIN NOW
          </button>
        </div>
      )}

      {/* ── Join Modal ────────────────────────── */}
      {showJoinModal && (
        <JoinModal
          gym={gym}
          onClose={() => setShowJoinModal(false)}
          onJoined={(planId) => {
            setIsJoined(true);
          }}
        />
      )}
    </div>
  );
};

export default GymProfilePage;
