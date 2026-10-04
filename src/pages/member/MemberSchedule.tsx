// src/pages/member/MemberSchedule.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { demoStore } from '../../demo/mockStore';
import { mockTrainerService } from '../../demo/mockServices';
import { Calendar, Clock, Dumbbell, Users, CheckCircle2, QrCode, ArrowRight, Trash2 } from 'lucide-react';

export const MemberSchedule: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'CALENDAR'>('UPCOMING');

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const { bookings, classes, workout } = storeState;
  const registeredClasses = classes.filter(c => c.is_registered);

  const handleCancelBooking = async (id: string) => {
    await mockTrainerService.cancelBooking(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            ATHLETE AGENDA & TIMELINE
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            MY TRAINING SCHEDULE
          </h1>
          <p className="text-xs text-zinc-400">
            Confirmed 1-on-1 coaching sessions, registered classes, and daily workout protocols.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/member/trainers"
            className="px-4 py-2 bg-[#FF5500] hover:bg-[#ff661a] text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl shadow-[0_0_15px_rgba(255,85,0,0.3)] transition-all"
          >
            + BOOK COACH
          </Link>
          <Link
            to="/member/classes"
            className="px-4 py-2 bg-[#14151C] hover:bg-[#1E1F28] border border-zinc-700 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            BROWSE CLASSES
          </Link>
        </div>
      </div>

      {/* Confirmed 1-on-1 Sessions */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl uppercase font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF5500]" />
            <span>CONFIRMED 1-ON-1 COACHING SESSIONS</span>
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            {bookings.length} SESSIONS SCHEDULED
          </span>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map(b => (
              <div
                key={b.id}
                className="p-5 bg-[#070709] border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded font-bold uppercase">
                      {b.status}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[#FF5500] font-semibold">{b.date}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-300 font-bold">{b.time}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                    COACH: {b.coach_name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono">{b.notes}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/member/check-in"
                    className="px-3.5 py-2 bg-[#FF5500] hover:bg-[#ff661a] text-black font-display font-bold uppercase tracking-wider text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>ARENA PASS</span>
                  </Link>
                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="p-2 bg-[#14151C] hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                    title="Cancel session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-xl">
            NO 1-ON-1 SESSIONS CONFIRMED.{' '}
            <Link to="/member/trainers" className="text-[#FF5500] underline font-bold ml-1">
              BOOK A CERTIFIED COACH NOW
            </Link>
          </div>
        )}
      </div>

      {/* Registered Classes */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl uppercase font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF5500]" />
            <span>MY REGISTERED GROUP CLASSES</span>
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            {registeredClasses.length} ENROLLED
          </span>
        </div>

        {registeredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredClasses.map(cls => (
              <div
                key={cls.id}
                className="p-5 bg-[#070709] border border-zinc-800 rounded-xl flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40 rounded font-bold uppercase">
                      {cls.category}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">{cls.date}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-white font-bold">{cls.time}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase text-white">
                    {cls.name}
                  </h3>
                  <div className="text-xs text-zinc-400 font-mono mt-1">
                    Coach: <span className="text-zinc-200 font-bold">{cls.coach}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ✓ SEAT RESERVED
                  </span>
                  <Link
                    to="/member/classes"
                    className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase underline"
                  >
                    MANAGE IN CLASSES
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-xl">
            NO GROUP CLASSES ENROLLED.{' '}
            <Link to="/member/classes" className="text-[#FF5500] underline font-bold ml-1">
              RESERVE A CLASS SPOT
            </Link>
          </div>
        )}
      </div>

      {/* Today's Training Protocol */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#070709] border border-[#FF5500] flex items-center justify-center text-[#FF5500] shadow-md">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-[#FF5500] uppercase tracking-wider font-bold">
              TODAY'S SCHEDULED WORKOUT
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              {workout.title} ({workout.durationMinutes} MIN)
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              {workout.exercises.length} Core Hypertrophy Movements Programmed
            </span>
          </div>
        </div>

        <Link
          to="/member/workout"
          className="px-5 py-3 bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-xs uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{workout.completed ? 'REVIEW LOGGED WORKOUT' : 'START TODAY\'S WORKOUT'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
export default MemberSchedule;
