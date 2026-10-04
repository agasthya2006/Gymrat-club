// src/pages/member/MemberNotifications.tsx
import React, { useState, useEffect } from 'react';
import { demoStore } from '../../demo/mockStore';
import { mockNotificationService } from '../../demo/mockServices';
import {
  Bell,
  CheckCheck,
  Check,
  Dumbbell,
  Users,
  Calendar,
  CreditCard,
  Megaphone,
  Sparkles
} from 'lucide-react';

export const MemberNotifications: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'WORKOUT' | 'BOOKING' | 'CLASS' | 'MEMBERSHIP' | 'ANNOUNCEMENT'>('ALL');

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const { notifications } = storeState;

  // Filter out coach-only dispatches so members only see their alerts & confirmations
  const memberNotifications = notifications.filter(n => n.recipient_role !== 'COACH');
  const unreadCount = memberNotifications.filter(n => !n.read).length;

  const filteredNotifications = memberNotifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !n.read;
    return n.type === activeFilter;
  });

  const handleMarkAsRead = async (id: string) => {
    await mockNotificationService.markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await mockNotificationService.markAllAsRead();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'WORKOUT':
        return <Dumbbell className="w-4 h-4 text-[#FF5500]" />;
      case 'BOOKING':
        return <Users className="w-4 h-4 text-[#FF5500]" />;
      case 'CLASS':
        return <Calendar className="w-4 h-4 text-[#FF5500]" />;
      case 'MEMBERSHIP':
        return <CreditCard className="w-4 h-4 text-[#FF5500]" />;
      default:
        return <Megaphone className="w-4 h-4 text-[#FF5500]" />;
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            DISPATCH TELEMETRY & ALERTS
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight flex items-center gap-3">
            <span>NOTIFICATIONS & DISPATCHES</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-[#FF5500] text-black font-mono text-xs font-bold rounded-full">
                {unreadCount} NEW
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time workout reminders, coach booking updates, and club announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 bg-[#14151C] hover:bg-[#1E1F28] border border-zinc-700 hover:border-[#FF5500] text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <CheckCheck className="w-4 h-4 text-[#FF5500]" />
            <span>MARK ALL AS READ</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'UNREAD', 'WORKOUT', 'BOOKING', 'CLASS', 'MEMBERSHIP', 'ANNOUNCEMENT'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider border transition-all cursor-pointer ${
              activeFilter === tab
                ? 'bg-[#FF5500] border-[#FF5500] text-black font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]'
                : 'bg-[#14151C] border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {tab}
            {tab === 'UNREAD' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(n => (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                n.read
                  ? 'bg-[#14151C]/60 border-[#27272A] text-zinc-400'
                  : 'bg-[#14151C] border-[#FF5500]/50 shadow-[0_0_20px_rgba(255,85,0,0.08)]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                    n.read
                      ? 'bg-[#070709] border-zinc-800'
                      : 'bg-[#070709] border-[#FF5500] shadow-[0_0_10px_rgba(255,85,0,0.3)]'
                  }`}
                >
                  {getIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 bg-[#070709] text-[#FF5500] border border-zinc-800 rounded font-bold uppercase">
                      {n.type}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-500 font-semibold">{n.time}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping ml-1" />
                    )}
                  </div>

                  <h3 className={`font-display text-base font-bold uppercase tracking-wide ${n.read ? 'text-zinc-300' : 'text-white'}`}>
                    {n.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                </div>
              </div>

              {!n.read && (
                <div className="shrink-0 flex sm:justify-end">
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="px-3 py-1.5 bg-[#070709] hover:bg-[#1E1F28] border border-zinc-800 hover:border-[#FF5500] text-zinc-300 hover:text-white rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#FF5500]" />
                    <span>MARK READ</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 rounded-2xl">
            NO NOTIFICATIONS FOUND IN THIS DISPATCH FILTER.
          </div>
        )}
      </div>
    </div>
  );
};
export default MemberNotifications;
