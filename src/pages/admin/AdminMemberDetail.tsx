// src/pages/admin/AdminMemberDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useGymData } from '../../context/GymDataContext';
import { ArrowLeft, Save, CheckCircle2, Shield, User } from 'lucide-react';

export const AdminMemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { coaches } = useGymData();
  const [memberData, setMemberData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [status, setStatus] = useState('ACTIVE');
  const [assignedCoachId, setAssignedCoachId] = useState('');
  const [planId, setPlanId] = useState('plan-pro');
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api.getMemberDetail(id).then(res => {
        setMemberData(res);
        if (res.profile) {
          setStatus(res.profile.status || 'ACTIVE');
          setAssignedCoachId(res.profile.assigned_coach_id || 'usr-coach-1');
          setPlanId(res.profile.plan_id || 'plan-pro');
        }
        setIsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSaving(true);
    setNotice(null);

    try {
      await api.updateMember(id, {
        status,
        assigned_coach_id: assignedCoachId,
        plan_id: planId
      });
      setNotice('MEMBER DOSSIER & COACH RELATIONSHIP UPDATED');
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !memberData) {
    return <div className="p-8 font-mono text-xs text-zinc-500">RETRIEVING MEMBER DOSSIER...</div>;
  }

  const { user: mUser, profile } = memberData;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/admin/members"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO ATHLETE REGISTRY</span>
      </Link>

      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          OPERATIONAL ATHLETE DOSSIER
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          EDIT MEMBER // {mUser.name}
        </h1>
        <p className="text-xs text-zinc-400">
          Modify membership tier status, adjust permissions, or assign coach.
        </p>
      </div>

      {notice && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#14151C] border border-[#27272A] rounded-xl p-6 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase mb-1">MEMBER STATUS</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRING">EXPIRING SOON</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">ASSIGNED COACH</label>
              <select
                value={assignedCoachId}
                onChange={e => setAssignedCoachId(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
              >
                {coaches.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.profile?.callsign || 'COACH'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase mb-1">MEMBERSHIP PLAN</label>
              <select
                value={planId}
                onChange={e => setPlanId(e.target.value)}
                className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="plan-elite">TITAN ELITE OPS (₹5,999)</option>
                <option value="plan-pro">BLACK PROTOCOL (₹3,499)</option>
                <option value="plan-basic">STANDARD ARENA (₹1,999)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 bg-[#E1601B] hover:bg-[#FF7728] text-black font-display font-bold uppercase tracking-widest text-sm rounded shadow-glow-sm transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'PERSISTING...' : 'SAVE DOSSIER MODIFICATIONS'}</span>
        </button>
      </form>
    </div>
  );
};
