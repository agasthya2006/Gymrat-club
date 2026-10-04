// src/pages/member/MemberTrainers.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { demoStore } from '../../demo/mockStore';
import { mockTrainerService } from '../../demo/mockServices';
import { Search, Star, Clock, Calendar, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const MemberTrainers: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  // Booking Modal State
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('Today');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('1-on-1 Performance & Biomechanics Audit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const { coaches } = storeState;

  const specialties = ['ALL', 'Strength & Hypertrophy', 'Functional Training & Mobility', 'Performance & Conditioning'];

  const filteredCoaches = coaches.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'ALL' || c.specialization.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleOpenBooking = (coach: any, slot?: string) => {
    setSelectedCoach(coach);
    setBookingTime(slot || coach.availability[0]);
    setBookingMessage(null);
    setBookingError(null);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;
    setIsSubmitting(true);
    setBookingError(null);

    try {
      await mockTrainerService.bookSession({
        coach_id: selectedCoach.id,
        date: bookingDate,
        time: bookingTime || selectedCoach.availability[0],
        notes: bookingNotes
      });
      setBookingMessage(`CONFIRMED: Session booked with ${selectedCoach.name} for ${bookingDate} at ${bookingTime || selectedCoach.availability[0]}`);
      setTimeout(() => {
        setSelectedCoach(null);
        setBookingMessage(null);
      }, 2000);
    } catch (err: any) {
      setBookingError(err.message || 'Booking slot temporarily unavailable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            MASTER TRAINER ROSTER
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            CERTIFIED COACHES & ATHLETIC DIRECTORS
          </h1>
          <p className="text-xs text-zinc-400">
            Book 1-on-1 kinetic audits, strength periodization, and recovery sessions.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search coach or specialty..."
            className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#FF5500] rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {specialties.map(spec => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider border transition-all cursor-pointer ${
              selectedSpecialty === spec
                ? 'bg-[#FF5500] border-[#FF5500] text-black font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]'
                : 'bg-[#14151C] border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map(coach => (
          <div
            key={coach.id}
            className="bg-[#14151C] border border-[#27272A] hover:border-[#FF5500]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-lg"
          >
            <div>
              {/* Photo & Badge */}
              <div className="relative h-56 bg-zinc-900 overflow-hidden">
                <img
                  src={coach.avatar_url}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14151C] via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur border border-[#27272A] rounded-lg flex items-center gap-1.5 text-xs font-mono text-[#FF5500]">
                  <Star className="w-3.5 h-3.5 fill-[#FF5500]" />
                  <span className="font-bold text-white">{coach.rating}</span>
                  <span className="text-[10px] text-zinc-500">({coach.reviews_count})</span>
                </div>
                <div className="absolute bottom-3 left-4">
                  <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-[#FF5500] text-black font-bold rounded">
                    {coach.experience}
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white mt-1">
                    {coach.name}
                  </h3>
                  <p className="text-xs text-[#FF5500] font-mono font-medium">
                    {coach.specialization}
                  </p>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {coach.bio}
                </p>

                {/* Available Slots Preview */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#FF5500]" />
                      TODAY'S OPEN SLOTS
                    </span>
                    <span className="text-emerald-400">INSTANT BOOKING</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {coach.availability.map((slot: string) => (
                      <button
                        key={slot}
                        onClick={() => handleOpenBooking(coach, slot)}
                        className="px-2.5 py-1 bg-[#070709] border border-zinc-800 hover:border-[#FF5500] text-[10px] font-mono text-zinc-300 hover:text-white rounded-md transition-colors cursor-pointer"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs font-mono">
                  <div className="text-zinc-500">
                    EXPERIENCE: <span className="text-zinc-300 font-bold">{coach.experience_years} YRS</span>
                  </div>
                  <div className="text-[#FF5500] font-bold font-display text-sm">
                    ₹{coach.hourly_rate} / SESSION
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
              <Link
                to={`/member/trainers/${coach.id}`}
                className="py-2.5 bg-[#070709] hover:bg-[#1E1F28] border border-[#27272A] text-center text-xs font-mono text-zinc-300 hover:text-white uppercase rounded-xl transition-colors"
              >
                VIEW PROFILE
              </Link>
              <button
                onClick={() => handleOpenBooking(coach)}
                className="py-2.5 bg-[#FF5500] hover:bg-[#ff661a] text-black text-center text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(255,85,0,0.3)] transition-all cursor-pointer"
              >
                BOOK SESSION
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-[#14151C] border border-[#FF5500] rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedCoach(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-mono text-xs cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.2em] font-bold block mb-1">
              SCHEDULE PRIVATE 1-ON-1 PROTOCOL
            </span>
            <h2 className="font-display text-2xl font-bold uppercase text-white mb-1">
              BOOK WITH {selectedCoach.name}
            </h2>
            <p className="text-xs text-zinc-400 mb-5">
              {selectedCoach.specialization} • {selectedCoach.experience}
            </p>

            {bookingMessage ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{bookingMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                {bookingError && (
                  <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-300 font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    SELECT SESSION DATE
                  </label>
                  <select
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full bg-[#070709] border border-[#27272A] focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="Today">Today (Immediate Reservation)</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Friday">Friday (End of Week Deload)</option>
                    <option value="Saturday">Saturday (Weekend Peak)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    AVAILABLE TIME SLOT
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCoach.availability.map((slot: string) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingTime(slot)}
                        className={`py-2 px-3 rounded-lg border text-xs font-mono transition-colors text-center cursor-pointer ${
                          bookingTime === slot
                            ? 'bg-[#FF5500]/20 border-[#FF5500] text-white font-bold'
                            : 'bg-[#070709] border-[#27272A] text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    FOCUS & GOALS NOTES
                  </label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={e => setBookingNotes(e.target.value)}
                    placeholder="e.g. Biomechanics check, squat technique"
                    className="w-full bg-[#070709] border border-[#27272A] focus:border-[#FF5500] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-sm uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>RESERVING TIME SLOT...</span>
                    ) : (
                      <>
                        <span>CONFIRM 1-ON-1 BOOKING</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default MemberTrainers;
