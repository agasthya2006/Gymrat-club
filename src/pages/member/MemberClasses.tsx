// src/pages/member/MemberClasses.tsx
import React, { useState, useEffect } from 'react';
import { demoStore } from '../../demo/mockStore';
import { mockClassService } from '../../demo/mockServices';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, Search, Sparkles, X } from 'lucide-react';

export const MemberClasses: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const { classes } = storeState;

  const categories = ['ALL', 'STRENGTH', 'CONDITIONING', 'RECOVERY'];

  const filteredClasses = classes.filter(c => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.coach.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRegister = async (classId: string, className: string) => {
    setProcessingId(classId);
    setActionMessage(null);
    setErrorMessage(null);
    try {
      await mockClassService.registerForClass(classId);
      setActionMessage(`SUCCESS: Registered for ${className}. Slot confirmed in your training agenda!`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
      setTimeout(() => setErrorMessage(null), 3500);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (classId: string, className: string) => {
    setProcessingId(classId);
    setActionMessage(null);
    setErrorMessage(null);
    try {
      await mockClassService.cancelRegistration(classId);
      setActionMessage(`CANCELLED: Registration for ${className} has been released.`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Cancellation failed');
      setTimeout(() => setErrorMessage(null), 3500);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            ARENA CLASS PROTOCOLS
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            COMMUNITY & SPECIALTY CLASSES
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time capacity tracking. Reserve slots or release anytime.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search class or coach..."
            className="w-full bg-[#14151C] border border-[#27272A] focus:border-[#FF5500] rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Notifications / Alerts */}
      {actionMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-300 font-mono text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#FF5500] border-[#FF5500] text-black font-bold shadow-[0_0_12px_rgba(255,85,0,0.3)]'
                : 'bg-[#14151C] border-[#27272A] text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Class Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredClasses.map(cls => {
          const availableSeats = cls.capacity - cls.enrolled_count;
          const isFull = availableSeats <= 0;
          const isRegistered = cls.is_registered;

          return (
            <div
              key={cls.id}
              className={`bg-[#14151C] border rounded-2xl p-6 transition-all flex flex-col justify-between shadow-lg relative ${
                isRegistered
                  ? 'border-[#FF5500] shadow-[0_0_20px_rgba(255,85,0,0.15)]'
                  : 'border-[#27272A] hover:border-zinc-700'
              }`}
            >
              {isRegistered && (
                <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-[#FF5500] text-black font-mono text-[9px] font-bold uppercase rounded-md tracking-wider">
                  YOU ARE ENROLLED
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 bg-[#070709] text-[#FF5500] border border-zinc-800 rounded font-bold uppercase">
                      {cls.category}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 font-semibold">{cls.date}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wide">
                    {cls.name}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Clock className="w-4 h-4 text-[#FF5500]" />
                    <span>{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Users className="w-4 h-4 text-[#FF5500]" />
                    <span>COACH: {cls.coach}</span>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-500 uppercase">ENROLLMENT STATUS</span>
                    <span className={`font-bold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                      {availableSeats} SEATS LEFT ({cls.enrolled_count}/{cls.capacity})
                    </span>
                  </div>
                  <div className="w-full bg-[#070709] h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFull
                          ? 'bg-red-500'
                          : isRegistered
                          ? 'bg-[#FF5500]'
                          : 'bg-zinc-500'
                      }`}
                      style={{ width: `${(cls.enrolled_count / cls.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-[#27272A]">
                {isRegistered ? (
                  <button
                    onClick={() => handleCancel(cls.id, cls.name)}
                    disabled={processingId === cls.id}
                    className="w-full py-3 bg-[#070709] hover:bg-red-950/40 border border-zinc-800 hover:border-red-500/50 text-red-300 font-mono text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>{processingId === cls.id ? 'PROCESSING...' : 'CANCEL REGISTRATION'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(cls.id, cls.name)}
                    disabled={isFull || processingId === cls.id}
                    className={`w-full py-3 rounded-xl font-display text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isFull
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white shadow-[0_0_15px_rgba(255,85,0,0.3)] active:scale-[0.98]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {processingId === cls.id
                        ? 'RESERVING SEAT...'
                        : isFull
                        ? 'CLASS FULL'
                        : 'RESERVE SEAT'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MemberClasses;
