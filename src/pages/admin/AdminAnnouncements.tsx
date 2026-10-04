// src/pages/admin/AdminAnnouncements.tsx
import React, { useState } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { useAuth } from '../../context/AuthContext';
import { demoStore } from '../../demo/mockStore';
import { Megaphone, Plus, Trash2, CheckCircle2, Pin } from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, addAnnouncementAction } = useGymData();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'OPERATIONAL' | 'EVENT' | 'MAINTENANCE' | 'PROTOCOL'>('OPERATIONAL');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const authorName = user?.name || 'Owner Rohan Alluri';
      await addAnnouncementAction({
        title,
        category,
        content,
        author: authorName,
        pinned
      });
      // Broadcast to members' notification feed
      demoStore.update(s => {
        s.notifications.unshift({
          id: `notif-broadcast-${Date.now().toString(36)}`,
          title: `📢 ${title}`,
          message: `${content} — Broadcast by ${authorName}`,
          time: 'Just now',
          read: false,
          type: 'ANNOUNCEMENT',
          recipient_role: 'MEMBER'
        });
      });
      setShowModal(false);
      setTitle('');
      setContent('');
      setNotice('NOTICE BROADCAST TO ALL ATHLETES & COACHES IN REAL TIME');
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            FACILITY COMMUNICATIONS TELEMETRY
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            CLUB ANNOUNCEMENT BROADCASTS
          </h1>
          <p className="text-xs text-zinc-400">
            Publish high-priority dispatches, event notices, and equipment updates to member and coach terminals.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded shadow-glow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>NEW BROADCAST</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map(a => (
          <div
            key={a.id}
            className={`p-6 bg-[#14151C] border rounded-xl relative ${
              a.pinned ? 'border-[#E1601B]' : 'border-[#27272A]'
            }`}
          >
            {a.pinned && (
              <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#E1601B] text-black font-mono text-[9px] font-bold uppercase rounded flex items-center gap-1">
                <Pin className="w-3 h-3" /> PINNED PRIORITY
              </span>
            )}

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-2">
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-bold uppercase">
                {a.category}
              </span>
              <span>•</span>
              <span>AUTHOR: {a.author}</span>
              <span>•</span>
              <span>{new Date(a.published_at).toLocaleDateString()}</span>
            </div>

            <h3 className="font-display text-xl font-bold uppercase text-white mb-2">
              {a.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans max-w-3xl">
              {a.content}
            </p>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
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
              DISPATCH ANNOUNCEMENT
            </h2>
            <p className="text-zinc-400 mb-6 text-[11px]">
              This notification will immediately trigger in member and coach navbars.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-zinc-400 uppercase mb-1">HEADLINE TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="e.g. BARBELL ZONE DEFICIT MAINTENANCE"
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">DISPATCH CATEGORY</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="OPERATIONAL">OPERATIONAL</option>
                  <option value="EVENT">ARENA EVENT</option>
                  <option value="MAINTENANCE">MAINTENANCE NOTICE</option>
                  <option value="PROTOCOL">NEW PROTOCOL</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase mb-1">BROADCAST BODY</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  placeholder="Full text of notification..."
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded p-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={pinned}
                  onChange={e => setPinned(e.target.checked)}
                  className="w-4 h-4 accent-[#E1601B]"
                />
                <label htmlFor="pin" className="text-zinc-300 cursor-pointer">
                  Pin to top of athlete dashboards
                </label>
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
                  {isSubmitting ? 'DISPATCHING...' : 'BROADCAST DISPATCH'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
