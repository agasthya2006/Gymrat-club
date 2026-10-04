// src/pages/coach/CoachBookings.tsx
import React, { useState, useEffect } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { demoStore } from '../../demo/mockStore';
import { api } from '../../services/api';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const CoachBookings: React.FC = () => {
  const { bookings, refreshAll } = useGymData();
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const mergedBookings = [
    ...(storeState.bookings || []).filter(b => b.coach_id === 'coach-akhil' || b.coach_name?.toLowerCase().includes('akhil') || !b.coach_id),
    ...bookings
  ].filter((b, idx, arr) => arr.findIndex(x => x.id === b.id) === idx);

  const handleUpdateStatus = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      demoStore.update(s => {
        const target = s.bookings.find(x => x.id === bookingId);
        if (target) {
          target.status = status as any;
          if (status === 'CONFIRMED') {
            const coachName = target.coach_name || 'Coach Akhil Gandloji';
            const dateStr = target.date || 'Today';
            const timeSlotStr = target.time_slot || (target as any).time || 'scheduled slot';

            // Check if confirmation notification already exists for this booking/session to prevent duplicates
            const alreadyNotified = s.notifications.some(
              n => n.recipient_role === 'MEMBER' && 
                   n.type === 'BOOKING' &&
                   (n.title.includes('Confirmed') || n.title.includes('Session Confirmed')) &&
                   (n.date === dateStr || n.message.includes(dateStr)) &&
                   (n.time_slot === timeSlotStr || n.message.includes(timeSlotStr))
            );

            if (!alreadyNotified) {
              s.notifications.unshift({
                id: `notif-confirm-${Date.now().toString(36)}`,
                title: `✅ Session Confirmed by ${coachName}`,
                message: `${coachName} has reviewed and confirmed your 1-on-1 private coaching session for ${dateStr} at ${timeSlotStr}. Prepare for your session!`,
                time: 'Just now',
                read: false,
                type: 'BOOKING' as const,
                recipient_role: 'MEMBER' as const,
                athlete_name: target.member_name || (target as any).athlete_name,
                date: dateStr,
                time_slot: timeSlotStr
              });
            }
            // Mark any coach notification for this booking as read
            s.notifications.forEach(n => {
              if (n.recipient_role === 'COACH' && (n.message.includes(target.member_name || '') || n.id.includes(target.id))) {
                n.read = true;
              }
            });
          }
        }
      });
      await api.updateBooking(bookingId, { status }).catch(() => {});
      await refreshAll().catch(() => {});
      setActionNotice(`APPOINTMENT UPDATED // Status changed to ${status}`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          OPERATIONAL APPOINTMENT LOGS
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          SESSION APPOINTMENT MANAGEMENT
        </h1>
        <p className="text-xs text-zinc-400">
          Confirm, complete, or reschedule athlete 1-on-1 private coaching blocks.
        </p>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between font-mono text-xs text-zinc-400">
          <span>ALL APPOINTMENTS ({mergedBookings.length})</span>
        </div>

        <div className="divide-y divide-[#27272A]/50 font-mono text-xs">
          {mergedBookings.map(b => (
            <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] mb-1">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                    b.status === 'CONFIRMED'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : b.status === 'COMPLETED'
                      ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                      : 'bg-red-950/60 text-red-400 border border-red-500/30'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-[#E1601B]">{b.date}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300">{b.time_slot || (b as any).time}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  ATHLETE: {b.member_name || (b as any).athlete_name || 'Athlete'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">{b.notes}</p>
              </div>

              <div className="flex items-center gap-2">
                {b.status !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                    className="px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 rounded text-xs uppercase"
                  >
                    CONFIRM
                  </button>
                )}
                {b.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/50 text-blue-300 rounded text-xs uppercase"
                  >
                    COMPLETE
                  </button>
                )}
                {b.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/50 text-red-300 rounded text-xs uppercase"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
