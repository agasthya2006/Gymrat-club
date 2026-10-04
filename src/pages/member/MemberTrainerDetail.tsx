// src/pages/member/MemberTrainerDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { demoStore } from '../../demo/mockStore';
import { mockTrainerService } from '../../demo/mockServices';
import { Star, Clock, Calendar, ArrowLeft, CheckCircle2, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';

export const MemberTrainerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [date, setDate] = useState('Today');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('1-on-1 Biomechanics & Program Tuning');
  const [isBooking, setIsBooking] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const akhilCoach = {
    id: 'coach-akhil',
    name: 'Akhil Gandloji',
    email: 'akhilgandloji789@gmail.com',
    specialization: 'Strength & Hypertrophy',
    experience: '8 years experience',
    experience_years: 8,
    rating: 4.98,
    reviews_count: 142,
    hourly_rate: 1500,
    bio: 'Head Strength Coach & Biomechanics Specialist. Focuses on barbell kinematics, progressive overload periodization, and athletic longevity.',
    avatar_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    availability: ['06:00 AM', '08:30 AM', '11:00 AM', '04:00 PM', '06:00 PM']
  };

  const coach = (id === 'coach-akhil' ? akhilCoach : storeState.coaches.find(c => c.id === id)) || storeState.coaches[0] || akhilCoach;

  useEffect(() => {
    if (coach && !timeSlot) {
      setTimeSlot(coach.availability[0]);
    }
  }, [coach]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coach) return;
    setIsBooking(true);
    setSuccessMsg(null);

    try {
      await mockTrainerService.bookSession({
        coach_id: coach.id,
        date,
        time: timeSlot || coach.availability[0],
        notes,
        member_id: user?.id || 'usr-member-1',
        member_name: user?.name || 'Agasthya Gade',
        member_email: user?.email || 'gadeagasthya551@gmail.com'
      });
      setSuccessMsg(`CONFIRMED: Session booked with ${coach.name} for ${date} at ${timeSlot}. Check your Schedule!`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/member/trainers"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO COACH ROSTER</span>
      </Link>

      {/* Main Profile Header */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl overflow-hidden p-6 sm:p-8 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-40 h-40 rounded-2xl border-2 border-[#FF5500] overflow-hidden bg-zinc-900 shrink-0 shadow-[0_0_25px_rgba(255,85,0,0.2)]">
            <img src={coach.avatar_url} alt={coach.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 bg-[#FF5500] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-md">
                CERTIFIED MASTER COACH
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#FF5500] bg-black/50 border border-zinc-800 px-2.5 py-1 rounded-md">
                <Star className="w-4 h-4 fill-[#FF5500]" />
                <span className="font-bold text-white">{coach.rating}</span>
                <span className="text-zinc-500">({coach.reviews_count} reviews)</span>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-md">
                {coach.experience}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase text-white tracking-wide">
              {coach.name}
            </h1>
            <p className="text-sm font-mono text-[#FF5500] font-semibold">
              {coach.specialization}
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl font-sans">
              {coach.bio}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono">
              <div className="text-zinc-400">
                RATE: <span className="font-display text-base font-bold text-white">₹{coach.hourly_rate}</span> / SESSION
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Availability & Direct Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Box */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF5500]" />
            <h2 className="font-display text-xl uppercase font-bold text-white tracking-wide">
              OPEN TIME SLOTS & AVAILABILITY
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Select a slot to immediately schedule your one-on-one session with {coach.name}.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {coach.availability.map((slot: string) => (
              <button
                key={slot}
                onClick={() => setTimeSlot(slot)}
                className={`p-3.5 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                  timeSlot === slot
                    ? 'bg-[#FF5500]/20 border-[#FF5500] text-white font-bold shadow-[0_0_15px_rgba(255,85,0,0.25)]'
                    : 'bg-[#070709] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">AVAILABLE SLOT</div>
                <div className="font-bold text-sm">{slot}</div>
              </button>
            ))}
          </div>

          <div className="p-4 bg-[#070709] border border-zinc-800 rounded-xl space-y-2 text-xs font-mono text-zinc-300">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">SESSION SPECIALTY BLOCKS</div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>Full Barbell Trajectory & Mechanics Audit</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-3.5 h-3.5 text-[#FF5500]" />
              <span>12-Week Progressive Overload Periodization</span>
            </div>
          </div>
        </div>

        {/* Booking Form Box */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF5500]" />
            <h2 className="font-display text-xl uppercase font-bold text-white tracking-wide">
              RESERVE 1-ON-1 SESSION
            </h2>
          </div>

          {successMsg ? (
            <div className="p-5 bg-emerald-950/60 border border-emerald-500 rounded-xl space-y-3 font-mono text-xs text-emerald-300 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>BOOKING CONFIRMED</span>
              </div>
              <p>{successMsg}</p>
              <Link
                to="/member/schedule"
                className="inline-flex items-center gap-1.5 text-white underline hover:text-[#FF5500] font-bold"
              >
                <span>VIEW IN ATHLETE SCHEDULE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleBook} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">
                  SESSION DATE
                </label>
                <select
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-white focus:outline-none"
                >
                  <option value="Today">Today (Immediate)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Friday">Friday (Deload & Mobility)</option>
                  <option value="Saturday">Saturday (Max Effort)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">
                  SELECTED TIME SLOT
                </label>
                <input
                  type="text"
                  value={timeSlot}
                  readOnly
                  className="w-full bg-[#070709] border border-zinc-800 rounded-xl px-3.5 py-3 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-400 uppercase tracking-wider mb-1.5 font-bold">
                  FOCUS OBJECTIVES
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-[#070709] border border-zinc-800 focus:border-[#FF5500] rounded-xl px-3.5 py-3 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isBooking}
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-sm uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isBooking ? (
                    <span>CONFIRMING SESSION...</span>
                  ) : (
                    <>
                      <span>CONFIRM 1-ON-1 WITH {coach.name.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default MemberTrainerDetail;
