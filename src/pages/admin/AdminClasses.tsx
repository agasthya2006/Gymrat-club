// src/pages/admin/AdminClasses.tsx
import React, { useState } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { Calendar, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminClasses: React.FC = () => {
  const { classes, addClassAction, deleteClassAction, coaches } = useGymData();
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'STRENGTH' | 'HYPERTROPHY' | 'CONDITIONING' | 'ENDURANCE' | 'RECOVERY'>('STRENGTH');
  const [description, setDescription] = useState('');
  const [coachId, setCoachId] = useState('usr-coach-1');
  const [date, setDate] = useState('2026-10-04');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:15');
  const [room, setRoom] = useState('Main Platform Zone A');
  const [capacity, setCapacity] = useState(16);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const coachObj = coaches.find(c => c.id === coachId);

    try {
      await addClassAction({
        name,
        category,
        description,
        coach_id: coachId,
        coach_name: coachObj ? coachObj.name : 'Viktor "Ironclad" Stone',
        date,
        start_time: startTime,
        end_time: endTime,
        room,
        capacity: Number(capacity)
      });
      setShowModal(false);
      setName('');
      setDescription('');
      setNotice(`CLASS INITIALIZED // "${name}" is now live and bookable by members!`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: string, className: string) => {
    if (!window.confirm(`Confirm cancellation of class protocol: ${className}?`)) return;
    try {
      await deleteClassAction(id);
      setNotice(`CLASS REMOVED // ${className} cancelled.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            FACILITY CURRICULUM
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            ARENA CLASS SCHEDULER
          </h1>
          <p className="text-xs text-zinc-400">
            Publish, edit, and cancel group performance protocols across all facility zones.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded shadow-glow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>SCHEDULE NEW CLASS</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Classes Table */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0D0D11] text-zinc-500 uppercase border-b border-[#27272A] text-[10px]">
                <th className="p-4">CLASS NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">COACH</th>
                <th className="p-4">DATE & TIME</th>
                <th className="p-4">CAPACITY</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {classes.map(c => (
                <tr key={c.id} className="hover:bg-[#1E1F28]/50 transition-colors">
                  <td className="p-4 font-bold text-white max-w-xs truncate">{c.name}</td>
                  <td className="p-4">
                    <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px]">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-300">{c.coach_name}</td>
                  <td className="p-4 text-zinc-400">{c.date} • {c.start_time} - {c.end_time}</td>
                  <td className="p-4">
                    <span className="text-[#E1601B] font-bold">{c.registered_count}</span>
                    <span className="text-zinc-500"> / {c.capacity}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteClass(c.id, c.name)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      title="Cancel Protocol"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151C] border border-[#E1601B] rounded-xl p-6 max-w-lg w-full relative shadow-2xl font-mono text-xs">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              [CLOSE ×]
            </button>

            <h2 className="font-display text-2xl font-bold uppercase text-white mb-2">
              SCHEDULE GROUP PROTOCOL
            </h2>
            <p className="text-zinc-400 mb-6 text-[11px]">
              Class will immediately appear in the member discovery matrix.
            </p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase mb-1">PROTOCOL TITLE</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. OLYMPIC SNATCH PEAK VELOCITY"
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">CATEGORY</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="STRENGTH">STRENGTH</option>
                    <option value="HYPERTROPHY">HYPERTROPHY</option>
                    <option value="CONDITIONING">CONDITIONING</option>
                    <option value="ENDURANCE">ENDURANCE</option>
                    <option value="RECOVERY">RECOVERY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 uppercase mb-1">ASSIGN COACH</label>
                  <select
                    value={coachId}
                    onChange={e => setCoachId(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  >
                    {coaches.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">DATE</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">START</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">END</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">ARENA ROOM / ZONE</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 uppercase mb-1">CAPACITY (SLOTS)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Key technical goals of this session..."
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded p-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 uppercase rounded text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider rounded transition-all text-xs"
                >
                  {isSubmitting ? 'SCHEDULING...' : 'PUBLISH PROTOCOL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
