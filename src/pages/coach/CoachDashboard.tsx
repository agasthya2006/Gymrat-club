// src/pages/coach/CoachDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGymData } from '../../context/GymDataContext';
import { demoStore } from '../../demo/mockStore';
import { mockNotificationService } from '../../demo/mockServices';
import { api } from '../../services/api';
import {
  Users,
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle2,
  Check,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Activity,
  Bell,
  Sparkles,
  X
} from 'lucide-react';

export const CoachDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { bookings, attendance } = useGymData();
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [athletes, setAthletes] = useState<any[]>([]);
  const [liveAlert, setLiveAlert] = useState<{ title: string; message: string } | null>(null);

  const handleMarkAsReadAndConfirm = async (notifId: string) => {
    await mockNotificationService.markAsRead(notifId);
    setLiveAlert({
      title: 'CONFIRMATION DISPATCHED TO ATHLETE',
      message: 'Confirmation notification successfully sent to member! Their workout session is now officially confirmed.'
    });
  };

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });

    const handleNewBooking = (e: any) => {
      const b = e.detail;
      setLiveAlert({
        title: `🔥 NEW ATHLETE SESSION BOOKED`,
        message: `${b.member_name || 'Athlete'} booked a 1-on-1 private coaching session for ${b.date} at ${b.time || b.time_slot}.`
      });
    };

    window.addEventListener('gymrat-booking-created', handleNewBooking);

    if (user) {
      api.getCoachDetail(user.id).then(d => {
        setAthletes(d.athletes || []);
      }).catch(err => console.error(err));
    }

    return () => {
      unsub();
      window.removeEventListener('gymrat-booking-created', handleNewBooking);
    };
  }, [user]);

  // Merge server and demo store bookings
  const mergedBookings = [
    ...(storeState.bookings || []).filter(b => b.coach_id === 'coach-akhil' || b.coach_name?.toLowerCase().includes('akhil') || !b.coach_id),
    ...bookings
  ].filter((b, idx, arr) => arr.findIndex(x => x.id === b.id) === idx);

  const activeBookings = mergedBookings.filter(b => b.status === 'CONFIRMED');

  const coachNotifs = storeState.notifications.filter(
    n => n.recipient_role === 'COACH' || n.title?.toLowerCase().includes('new session booked')
  );

  return (
    <div className="space-y-6">
      {/* Live Booking Alert Notification Banner */}
      {liveAlert && (
        <div className="p-4 bg-gradient-to-r from-[#E1601B]/20 via-[#E1601B]/10 to-transparent border-l-4 border-[#E1601B] rounded-r-xl flex items-center justify-between gap-4 animate-pulse shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E1601B]/20 border border-[#E1601B] flex items-center justify-center text-[#E1601B] shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#E1601B] tracking-wider uppercase flex items-center gap-2">
                <span>{liveAlert.title}</span>
                <span className="px-1.5 py-0.2 bg-[#E1601B] text-black text-[9px] font-bold rounded">JUST NOW</span>
              </div>
              <div className="text-xs text-white mt-0.5">
                {liveAlert.message}
              </div>
            </div>
          </div>
          <button
            onClick={() => setLiveAlert(null)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#E1601B]/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-[#E1601B]/20 text-[#E1601B] border border-[#E1601B]/40 rounded">
                CALLSIGN: {(profile as any)?.callsign || 'IRONCLAD'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> COACH STATUS: ACTIVE DUTY
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl uppercase font-bold text-white tracking-tight">
              COACH COMMAND CENTER // {user?.name.toUpperCase()}
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              MASTER STRENGTH ARCHITECT • USAPL SENIOR COACH • 12 YRS ELITE PROTOCOL
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/coach/workouts"
              className="px-5 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-sm rounded shadow-glow-sm transition-all flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              <span>BUILD WORKOUT</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400">ASSIGNED ATHLETES</span>
            <Users className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            {athletes.length || 12} <span className="text-sm font-sans text-zinc-500">ATHLETES</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">100% RETENTION RATE</div>
        </div>

        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400">TODAY'S SESSIONS</span>
            <Calendar className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            {activeBookings.length} <span className="text-sm font-sans text-zinc-500">BOOKED</span>
          </div>
          <div className="text-[10px] font-mono text-[#E1601B] mt-1">NEXT AT 10:30</div>
        </div>

        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400">HOURLY RATE</span>
            <TrendingUp className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            ₹{((profile as any)?.hourly_rate ? ((profile as any).hourly_rate > 500 ? (profile as any).hourly_rate : (profile as any).hourly_rate * 20) : 1800).toLocaleString('en-IN')} <span className="text-sm font-sans text-zinc-500">/ HR</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">PLATFORM FEE INCL.</div>
        </div>

        <div className="bg-[#14151C] border border-[#27272A] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400">ATHLETE ATTENDANCE</span>
            <Activity className="w-4 h-4 text-[#E1601B]" />
          </div>
          <div className="font-display text-3xl font-bold text-white">
            96.4% <span className="text-sm font-sans text-zinc-500">CADENCE</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">+2.1% THIS MONTH</div>
        </div>
      </div>

      {/* Main Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Bookings and Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl uppercase font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E1601B]" /> SCHEDULED ATHLETE SESSIONS
              </h2>
              <Link to="/coach/bookings" className="text-xs font-mono text-[#E1601B] hover:underline">
                ALL BOOKINGS ({mergedBookings.length}) →
              </Link>
            </div>

            {mergedBookings.length > 0 ? (
              <div className="space-y-3">
                {mergedBookings.map(b => (
                  <div
                    key={b.id}
                    className="p-4 bg-[#0D0D11] border border-[#27272A] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono mb-1">
                        <span className="px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded uppercase font-bold">
                          {b.status}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-[#E1601B]">{b.date}</span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">{b.time_slot || (b as any).time}</span>
                      </div>
                      <h3 className="font-display text-lg font-bold uppercase text-white">
                        {b.member_name || (b as any).athlete_name || 'Athlete'}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{b.notes}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/coach/messages"
                        className="px-3 py-1.5 bg-[#14151C] hover:bg-[#1E1F28] border border-[#27272A] text-zinc-300 text-xs font-mono uppercase rounded transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#E1601B]" />
                        <span>MESSAGE</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-500 font-mono text-xs">
                NO SESSIONS SCHEDULED TODAY
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <h3 className="font-display text-lg uppercase font-bold text-white mb-4">
              COACH COMMAND ACTIONS
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                to="/coach/workouts"
                className="p-3 bg-[#0D0D11] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#E1601B] rounded text-left transition-all"
              >
                <Dumbbell className="w-5 h-5 text-[#E1601B] mb-2" />
                <div className="text-xs font-bold text-white uppercase">ASSIGN ROUTINE</div>
                <div className="text-[10px] font-mono text-zinc-500">Program Builder</div>
              </Link>

              <Link
                to="/coach/availability"
                className="p-3 bg-[#0D0D11] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#E1601B] rounded text-left transition-all"
              >
                <Clock className="w-5 h-5 text-[#E1601B] mb-2" />
                <div className="text-xs font-bold text-white uppercase">TIME SLOTS</div>
                <div className="text-[10px] font-mono text-zinc-500">Manage Availability</div>
              </Link>

              <Link
                to="/coach/athletes"
                className="p-3 bg-[#0D0D11] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#E1601B] rounded text-left transition-all"
              >
                <Users className="w-5 h-5 text-[#E1601B] mb-2" />
                <div className="text-xs font-bold text-white uppercase">ATHLETE ROSTER</div>
                <div className="text-[10px] font-mono text-zinc-500">Track Consistency</div>
              </Link>

              <Link
                to="/coach/messages"
                className="p-3 bg-[#0D0D11] hover:bg-[#1E1F28] border border-[#27272A] hover:border-[#E1601B] rounded text-left transition-all"
              >
                <MessageSquare className="w-5 h-5 text-[#E1601B] mb-2" />
                <div className="text-xs font-bold text-white uppercase">MESSAGES</div>
                <div className="text-[10px] font-mono text-zinc-500">Client Dispatch</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Assigned Athletes List & Booking Dispatches */}
        <div className="space-y-6">
          {/* Athlete Booking Alerts Feed */}
          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#E1601B]" />
                <h3 className="font-display text-lg uppercase font-bold text-white">
                  BOOKING DISPATCHES
                </h3>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#E1601B]/20 text-[#E1601B] rounded border border-[#E1601B]/30 font-bold">
                {coachNotifs.length} ALERTS
              </span>
            </div>

            <div className="space-y-3">
              {coachNotifs.slice(0, 4).map(n => (
                <div key={n.id} className="p-3 bg-[#0D0D11] border border-[#27272A] hover:border-[#E1601B]/50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 1-ON-1 APPOINTMENT
                    </span>
                    <span className="text-zinc-500">{n.time}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{n.title}</div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{n.message}</p>

                  <div className="mt-2.5 pt-2 border-t border-[#27272A] flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">
                      {n.read ? 'Status: Confirmed' : 'Needs Coach Review'}
                    </span>
                    {!n.read ? (
                      <button
                        onClick={() => handleMarkAsReadAndConfirm(n.id)}
                        className="px-2.5 py-1 bg-[#E1601B] hover:bg-[#FF7728] text-black font-mono font-bold text-[10px] uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                      >
                        <Check className="w-3 h-3" />
                        <span>MARK AS READ & CONFIRM</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> CONFIRMATION SENT
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {coachNotifs.length === 0 && (
                <div className="py-4 text-center text-zinc-500 font-mono text-xs">
                  NO PENDING DISPATCHES
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg uppercase font-bold text-white">
                ASSIGNED CLIENT ROSTER
              </h3>
              <Link to="/coach/athletes" className="text-xs font-mono text-[#E1601B] hover:underline">
                ALL →
              </Link>
            </div>

            <div className="space-y-2.5">
              {athletes.slice(0, 5).map((ath, idx) => (
                <div key={idx} className="p-3 bg-[#0D0D11] border border-[#27272A] rounded-lg flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-white">{ath.athlete_name || 'Marcus Vance'}</div>
                    <div className="text-[10px] text-zinc-500">{ath.athlete_code || 'GRC-ATH-001'}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#E1601B] font-bold">{ath.streak_days || 14}d Streak</span>
                    <div className="text-[10px] text-zinc-500">{ath.total_workouts || 48} Logged</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
