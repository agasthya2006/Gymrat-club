// src/pages/DiscoverGymsPage.tsx
// Multi-Gym Discovery Hub — GYMRAT CLUB Platform
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NEARBY_GYMS, NearbyGym } from '../data/nearbyGyms';
import {
  MapPin,
  Star,
  Search,
  SlidersHorizontal,
  Users,
  Clock,
  ChevronRight,
  Zap,
  X,
  CheckCircle2,
} from 'lucide-react';

// ─── Occupancy bar helpers ────────────────────────────────────
function OccupancyBar({ pct }: { pct: number }) {
  const color =
    pct >= 85 ? 'bg-red-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-emerald-400';
  const label =
    pct >= 85 ? 'PACKED' : pct >= 60 ? 'MODERATE' : 'CLEAR';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono text-[9px] tracking-widest font-bold ${pct >= 85 ? 'text-red-400' : pct >= 60 ? 'text-yellow-400' : 'text-emerald-400'}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Star row ────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-[#FF5500] fill-[#FF5500]' : 'text-zinc-700'}`}
        />
      ))}
    </div>
  );
}

// ─── Gym Card ────────────────────────────────────────────────
function GymCard({ gym, onClick }: { gym: NearbyGym; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative group bg-[#0D0D11] border border-[#27272A] hover:border-[#FF5500]/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,85,0,0.15)]"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={gym.photos[0].url}
          alt={gym.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gym.coverGradient} opacity-80`} />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <span
            className={`font-mono text-[10px] tracking-widest font-bold px-2.5 py-1 rounded-full border ${
              gym.isOpen
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/20 border-red-500/40 text-red-300'
            }`}
          >
            {gym.isOpen ? '● OPEN' : '● CLOSED'}
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="w-3 h-3 text-[#FF5500] fill-[#FF5500]" />
            <span className="font-mono text-[11px] font-bold text-white">{gym.rating}</span>
            <span className="font-mono text-[10px] text-zinc-400">({gym.review_count})</span>
          </div>
        </div>

        {/* Distance pill */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1">
            <MapPin className="w-3 h-3 text-[#FF5500]" />
            <span className="font-mono text-[10px] font-bold text-white">{gym.distance_km} km away</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider leading-tight group-hover:text-[#FF5500] transition-colors">
            {gym.name}
          </h3>
          <p className="font-mono text-[10px] text-zinc-500 mt-0.5 tracking-wider">{gym.tagline}</p>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1.5 text-zinc-400">
          <MapPin className="w-3 h-3 shrink-0 text-zinc-600" />
          <span className="font-mono text-[10px] truncate">{gym.address}</span>
        </div>

        {/* Occupancy */}
        {gym.isOpen ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-zinc-500" />
                <span className="font-mono text-[10px] text-zinc-500">OCCUPANCY</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">
                {gym.occupancy_count}/{gym.occupancy_max}
              </span>
            </div>
            <OccupancyBar pct={gym.occupancy} />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-600">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-[10px]">Currently Closed</span>
          </div>
        )}

        {/* Facilities Preview */}
        <div className="flex flex-wrap gap-1.5">
          {gym.facilities.slice(0, 3).map(f => (
            <span key={f} className="text-[10px] px-2 py-0.5 rounded-md bg-[#181922] text-zinc-300 border border-zinc-800">
              {f}
            </span>
          ))}
          {gym.facilities.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#181922] text-zinc-500 border border-zinc-800">
              +{gym.facilities.length - 3} more
            </span>
          )}
        </div>

        {/* Cleanliness & Hygiene Feature Badge */}
        {gym.cleanliness && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#14151C] border border-zinc-800/80 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="text-[#FF5500]">✨</span>
              <span className="text-zinc-300 font-semibold">{gym.cleanliness.score} Cleanliness</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{gym.cleanliness.status}</span>
            </div>
            <span className="text-zinc-500 text-[9px]">{gym.cleanliness.last_sanitized}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
          <div>
            <span className="text-[10px] text-zinc-500 font-mono">FROM </span>
            <span className="font-display text-base font-bold text-[#FF5500]">₹{gym.starting_price.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-zinc-500 font-mono">/mo</span>
          </div>
          <button className="flex items-center gap-1 text-[11px] text-[#FF5500] hover:text-white transition-colors font-bold uppercase tracking-wider">
            VIEW GYM <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export const DiscoverGymsPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterDistance, setFilterDistance] = useState<number>(10);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(10000);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [filterOpenOnly, setFilterOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');

  const filtered = useMemo(() => {
    let gyms = [...NEARBY_GYMS];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      gyms = gyms.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.address.toLowerCase().includes(q) ||
          g.facilities.some(f => f.toLowerCase().includes(q)) ||
          g.tagline.toLowerCase().includes(q)
      );
    }

    // Filters
    gyms = gyms.filter(g => g.distance_km <= filterDistance);
    gyms = gyms.filter(g => g.starting_price <= filterMaxPrice);
    gyms = gyms.filter(g => g.rating >= filterMinRating);
    if (filterOpenOnly) gyms = gyms.filter(g => g.isOpen);

    // Sort
    gyms.sort((a, b) => {
      if (sortBy === 'distance') return a.distance_km - b.distance_km;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.starting_price - b.starting_price;
      return 0;
    });

    return gyms;
  }, [query, filterDistance, filterMaxPrice, filterMinRating, filterOpenOnly, sortBy]);

  const openCount = NEARBY_GYMS.filter(g => g.isOpen).length;
  const avgRating = (NEARBY_GYMS.reduce((s, g) => s + g.rating, 0) / NEARBY_GYMS.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            NEARBY <span className="text-[#FF5500]">GYMS</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Browse verified fitness centers, compare membership plans, and check live capacity.
          </p>
        </div>

        {/* Clean Network summary */}
        <div className="flex items-center gap-4 shrink-0 bg-[#0D0D11] border border-zinc-800 rounded-xl px-4 py-2">
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Gyms</p>
            <p className="font-display text-lg font-bold text-white">{NEARBY_GYMS.length}</p>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Top Rating</p>
            <p className="font-display text-lg font-bold text-[#FF5500]">{avgRating}★</p>
          </div>
          <div className="w-px h-6 bg-zinc-800" />
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Open Now</p>
            <p className="font-display text-lg font-bold text-emerald-400">{openCount}</p>
          </div>
        </div>
      </div>

      {/* ── Search + Sort ───────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search gyms, facilities, locations..."
            className="w-full bg-[#14151C] border border-zinc-800 hover:border-zinc-700 focus:border-[#FF5500]/60 text-white placeholder-zinc-600 rounded-xl py-3 pl-10 pr-4 font-mono text-sm outline-none transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="bg-[#14151C] border border-zinc-800 text-white font-mono text-sm rounded-xl px-4 py-3 outline-none cursor-pointer hover:border-zinc-700 transition-colors"
        >
          <option value="distance">Sort: Nearest</option>
          <option value="rating">Sort: Top Rated</option>
          <option value="price">Sort: Lowest Price</option>
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-mono text-sm transition-all ${
            showFilters
              ? 'bg-[#FF5500]/15 border-[#FF5500]/50 text-[#FF5500]'
              : 'bg-[#14151C] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>FILTERS</span>
        </button>
      </div>

      {/* ── Filter Panel ────────────────────────── */}
      {showFilters && (
        <div className="bg-[#0D0D11] border border-zinc-800 rounded-2xl p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Distance */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                Max Distance: <span className="text-[#FF5500]">{filterDistance} km</span>
              </label>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.5}
                value={filterDistance}
                onChange={e => setFilterDistance(parseFloat(e.target.value))}
                className="w-full accent-[#FF5500]"
              />
              <div className="flex justify-between font-mono text-[9px] text-zinc-600">
                <span>0.5km</span><span>10km</span>
              </div>
            </div>

            {/* Price (INR) */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                Max Price: <span className="text-[#FF5500]">₹{filterMaxPrice.toLocaleString('en-IN')}/mo</span>
              </label>
              <input
                type="range"
                min={1000}
                max={10000}
                step={250}
                value={filterMaxPrice}
                onChange={e => setFilterMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#FF5500]"
              />
              <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                <span>₹1,000</span><span>₹10,000</span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                Min Rating: <span className="text-[#FF5500]">{filterMinRating.toFixed(1)}+</span>
              </label>
              <input
                type="range"
                min={0}
                max={5}
                step={0.1}
                value={filterMinRating}
                onChange={e => setFilterMinRating(parseFloat(e.target.value))}
                className="w-full accent-[#FF5500]"
              />
              <div className="flex justify-between font-mono text-[9px] text-zinc-500">
                <span>Any</span><span>5.0★</span>
              </div>
            </div>

            {/* Open only */}
            <div className="flex flex-col justify-center">
              <button
                onClick={() => setFilterOpenOnly(v => !v)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  filterOpenOnly
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                    : 'bg-[#14151C] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${filterOpenOnly ? 'text-emerald-400' : 'text-zinc-600'}`} />
                <span className="font-mono text-xs">OPEN NOW ONLY</span>
              </button>
            </div>
          </div>

          {/* Reset */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFilterDistance(10);
                setFilterMaxPrice(300);
                setFilterMinRating(0);
                setFilterOpenOnly(false);
              }}
              className="font-mono text-xs text-zinc-500 hover:text-[#FF5500] transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        </div>
      )}

      {/* ── Results count ───────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-zinc-500">
          <span className="text-white font-bold">{filtered.length}</span> gyms found
          {query && <> for "<span className="text-[#FF5500]">{query}</span>"</>}
        </p>
        {filtered.length === 0 && (
          <button
            onClick={() => { setQuery(''); setFilterDistance(10); setFilterMaxPrice(300); setFilterMinRating(0); setFilterOpenOnly(false); }}
            className="font-mono text-xs text-[#FF5500] hover:text-white transition-colors"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* ── Gym Grid ────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(gym => (
            <GymCard
              key={gym.id}
              gym={gym}
              onClick={() => navigate(`/discover/${gym.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#14151C] border border-zinc-800 flex items-center justify-center">
            <Zap className="w-7 h-7 text-zinc-700" />
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-400 uppercase">NO GYMS FOUND</h3>
          <p className="font-mono text-xs text-zinc-600 max-w-sm">
            Try adjusting your filters or clearing your search to discover all nearby arenas.
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoverGymsPage;
