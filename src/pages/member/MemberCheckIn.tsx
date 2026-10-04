// src/pages/member/MemberCheckIn.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockAttendanceService } from '../../demo/mockServices';
import { demoStore } from '../../demo/mockStore';
import { QrCode, CheckCircle2, ShieldCheck, Clock, MapPin, Scan, Radio, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recordCheckIn, BadgeId } from '../../services/streakService';
import { AchievementToast } from '../../components/common/AchievementToast';


export const MemberCheckIn: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<any | null>(null);
  const [currentTime, setCurrentTime] = useState('19:42');
  const [history, setHistory] = useState(demoStore.getState().attendanceHistory);
  const [toastBadges, setToastBadges] = useState<BadgeId[]>([]);


  useEffect(() => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const unsubscribe = demoStore.subscribe(() => {
      setHistory(demoStore.getState().attendanceHistory);
    });
    return () => unsubscribe();
  }, []);

  const handleDemoCheckIn = async () => {
    setIsScanning(true);
    setCheckInSuccess(null);

    // Simulate optical scan reader processing
    setTimeout(async () => {
      const record = await mockAttendanceService.checkIn('GYMRAT CLUB — MAIN FLOOR');

      // ── Streak & achievement update ──
      const { newlyUnlocked } = recordCheckIn();
      if (newlyUnlocked.length > 0) setToastBadges(newlyUnlocked);

      setCheckInSuccess(record);
      setIsScanning(false);
    }, 900);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto select-none">
      
      {/* Header */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            OPTICAL TURNSTILE TERMINAL
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-white tracking-wider">
            GYMRAT CLUB SCAN TERMINAL
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Present your 256-bit encrypted optical QR pass at the entrance scanner to enter the arena.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#070709] border border-zinc-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#FF5500]">
          <span className="w-2 h-2 rounded-full bg-[#FF5500]" />
          <span>TURNSTILE 01: ARMED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Pass Card with QR Scanner Visual */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs font-mono mb-6 pb-3 border-b border-[#27272A]">
            <span className="text-[#FF5500] font-bold">DIGITAL PASS TOKEN</span>
            <span className="text-zinc-500">GRC-SEC-PASS // V3</span>
          </div>

          {/* QR Code Container with Scanner Sweep Animation */}
          <div className="p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,85,0,0.15)] relative mb-5 overflow-hidden">
            <div className="w-48 h-48 bg-black p-2 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* QR Pattern Representation */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      (i % 2 === 0 || i % 7 === 0 || i < 8 || i > 28)
                        ? 'bg-white'
                        : 'bg-zinc-950'
                    }`}
                  />
                ))}
              </div>

              {/* Center GymRat Badge */}
              <div className="z-10 bg-black p-2 border-2 border-[#FF5500] rounded-lg shadow-lg">
                <img src="/gymrat_badge.png" alt="GRC" className="w-9 h-9 object-contain" />
              </div>

              {/* Laser Scan Sweep Line */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-[#FF5500] shadow-[0_0_15px_#FF5500] animate-scan-sweep z-20" />
              )}
            </div>
          </div>

          <div className="font-display text-2xl font-bold uppercase text-white tracking-wider">
            {user?.name || 'Arjun Mehta'}
          </div>
          <div className="text-xs font-mono text-[#FF5500] font-bold mt-1">
            ATHLETE CODE: GRC-PRO-022
          </div>
          <div className="text-[10px] font-mono text-zinc-500 mt-2 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#FF5500]" />
            TOKEN EXPIRY: REFRESHES HOURLY // 256-BIT ENCRYPTION
          </div>
        </div>

        {/* Turnstile Actions & Confirmation */}
        <div className="space-y-6">
          
          {/* Scanner Simulator Card */}
          <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Scan className="w-5 h-5 text-[#FF5500]" />
              <h2 className="font-display text-xl font-bold uppercase text-white">
                FACILITY CHECK-IN ACTION
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mb-6 font-sans">
              Click below to simulate hardware optical scan validation at Soho Downtown Hub entrance turnstiles.
            </p>

            <button
              onClick={handleDemoCheckIn}
              disabled={isScanning}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-base uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(255,85,0,0.4)] transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>VERIFYING CRYPTOGRAPHIC TOKEN...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  <span>DEMO CHECK-IN</span>
                </>
              )}
            </button>
          </div>

          {/* SUCCESS CONFIRMATION BOX (EXACT SPECIFICATION) */}
          {checkInSuccess && (
            <div className="p-6 bg-emerald-950/40 border border-emerald-500/60 rounded-2xl shadow-xl animate-fade-in relative overflow-hidden">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-display text-xl font-bold uppercase text-emerald-300 tracking-wider">
                    ENTRY CONFIRMED
                  </span>
                  <div className="text-xs font-mono text-emerald-400/80">
                    BIOMETRICS VERIFIED // TURNSTILE UNLOCKED
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-black/40 rounded-xl font-mono text-xs mt-3">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">TIMESTAMP</span>
                  <strong className="text-white text-base font-bold">{currentTime}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">ZONE LOCATION</span>
                  <strong className="text-white text-sm">GYMRAT CLUB — MAIN FLOOR</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-500/30 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-300/80">
                  Dashboard attendance updated.
                </span>
                <button
                  onClick={() => navigate('/member/dashboard')}
                  className="text-xs font-mono font-bold text-white hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>GOTO DASHBOARD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Recent Attendance History Table */}
          <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-5 shadow-lg">
            <h3 className="font-display text-sm font-bold uppercase text-white tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF5500]" /> RECENT ARENA ATTENDANCE LOG
            </h3>
            <div className="space-y-2">
              {history.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#070709] border border-zinc-800 rounded-lg flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white">{item.location}</span>
                  </div>
                  <span className="text-zinc-500">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Achievement Toast */}
      {toastBadges.length > 0 && (
        <AchievementToast
          badgeIds={toastBadges}
          onDone={() => setToastBadges([])}
        />
      )}

    </div>
  );
};
export default MemberCheckIn;
