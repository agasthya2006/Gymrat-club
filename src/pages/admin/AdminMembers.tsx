// src/pages/admin/AdminMembers.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useGymData } from '../../context/GymDataContext';
import { Users, Search, Plus, CheckCircle2, ChevronRight, UserPlus, Filter } from 'lucide-react';

export const AdminMembers: React.FC = () => {
  const { coaches } = useGymData();
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Member Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+1 (555) 789-0123');
  const [newPlan, setNewPlan] = useState('plan-pro');
  const [newCoach, setNewCoach] = useState('usr-coach-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadMembers = () => {
    api.getMembers().then(data => setMembers(data)).catch(err => console.error(err));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createMember({
        name: newName,
        email: newEmail,
        phone: newPhone,
        plan_id: newPlan,
        assigned_coach_id: newCoach
      });
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNotice(`NEW ATHLETE REGISTERED // ${newName} added to active database`);
      loadMembers();
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.profile?.athlete_code && m.profile.athlete_code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || m.profile?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            ATHLETE DATABASE REGISTRY
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            MEMBER MANAGEMENT DIRECTORY
          </h1>
          <p className="text-xs text-zinc-400">
            Search, provision new athletes, assign coaches, and audit membership standing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider text-xs rounded shadow-glow-sm transition-all flex items-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>PROVISION NEW ATHLETE</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or code..."
            className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto font-mono text-xs">
          <span className="text-zinc-500">STATUS:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#0D0D11] border border-[#27272A] rounded px-3 py-2 text-xs text-white"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="EXPIRING">EXPIRING SOON</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0D0D11] text-zinc-500 uppercase border-b border-[#27272A] text-[10px]">
                <th className="p-4">CODE</th>
                <th className="p-4">ATHLETE NAME</th>
                <th className="p-4">EMAIL</th>
                <th className="p-4">ASSIGNED COACH</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {filtered.map(m => {
                const prof = m.profile || {};
                return (
                  <tr key={m.id} className="hover:bg-[#1E1F28]/50 transition-colors">
                    <td className="p-4 text-[#E1601B] font-bold">{prof.athlete_code || 'GRC-ATH'}</td>
                    <td className="p-4 font-bold text-white">{m.name}</td>
                    <td className="p-4 text-zinc-400">{m.email}</td>
                    <td className="p-4 text-zinc-300">{m.assigned_coach_name || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prof.status === 'ACTIVE'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                      }`}>
                        {prof.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/members/${m.id}`}
                        className="px-2.5 py-1 bg-[#0D0D11] hover:bg-[#1E1F28] border border-[#27272A] rounded text-[10px] text-zinc-300 uppercase transition-colors"
                      >
                        VIEW / EDIT
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14151C] border border-[#E1601B] rounded-xl p-6 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-mono text-xs"
            >
              [CLOSE ×]
            </button>

            <h2 className="font-display text-2xl font-bold uppercase text-white mb-2">
              PROVISION NEW ARENA ATHLETE
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Add member directly to the database and assign primary coach.
            </p>

            <form onSubmit={handleCreateMember} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] text-zinc-400 uppercase mb-1">
                  FULL LEGAL NAME
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                  placeholder="e.g. Jaxson Reed"
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 uppercase mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  placeholder="athlete@gymratclub.demo"
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 uppercase mb-1">
                  PHONE NUMBER
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase mb-1">
                    INITIAL PLAN
                  </label>
                  <select
                    value={newPlan}
                    onChange={e => setNewPlan(e.target.value)}
                    className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="plan-pro">BLACK PROTOCOL (₹3,499)</option>
                    <option value="plan-elite">TITAN ELITE OPS (₹5,999)</option>
                    <option value="plan-basic">STANDARD ARENA (₹1,999)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase mb-1">
                    ASSIGN COACH
                  </label>
                  <select
                    value={newCoach}
                    onChange={e => setNewCoach(e.target.value)}
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

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 uppercase rounded text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-wider rounded transition-all text-xs"
                >
                  {isSubmitting ? 'PROVISIONING...' : 'CONFIRM ENROLLMENT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
