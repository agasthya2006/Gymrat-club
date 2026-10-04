// src/components/common/AchievementToast.tsx
import React, { useEffect, useState } from 'react';
import { BadgeId, getBadges, loadStreakData } from '../../services/streakService';

interface AchievementToastProps {
  badgeIds: BadgeId[];
  onDone: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ badgeIds, onDone }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const data = loadStreakData();
  const allBadges = getBadges(data);
  const badge = allBadges.find(b => b.id === badgeIds[index]);

  useEffect(() => {
    if (!badge) { onDone(); return; }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (index + 1 < badgeIds.length) {
          setIndex(i => i + 1);
        } else {
          onDone();
        }
      }, 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [index]);

  if (!badge) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-[100] transition-all duration-400 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{ maxWidth: '320px' }}
    >
      <div className="bg-[#14151C] border border-[#FF5500] rounded-2xl p-4 shadow-[0_0_40px_rgba(255,85,0,0.35)] flex items-center gap-4 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5500]/10 to-transparent pointer-events-none" />
        
        {/* HUD brackets */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FF5500]" />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FF5500]" />
        <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FF5500]" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FF5500]" />

        {/* Badge icon */}
        <div className="relative shrink-0 w-14 h-14 rounded-xl bg-[#FF5500]/15 border border-[#FF5500]/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,85,0,0.4)]">
          <span>{badge.icon}</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF5500] rounded-full flex items-center justify-center">
            <span className="text-[8px] text-black font-bold">✓</span>
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0 relative z-10">
          <span className="font-mono text-[9px] text-[#FF5500] uppercase tracking-widest font-bold block">
            ACHIEVEMENT UNLOCKED
          </span>
          <span className="font-display text-base font-bold text-white uppercase tracking-wide block">
            {badge.name}
          </span>
          <span className="font-sans text-[11px] text-zinc-400 block truncate">
            {badge.description}
          </span>
        </div>
      </div>
    </div>
  );
};
