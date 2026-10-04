// src/pages/admin/AdminPayments.tsx
import React, { useState } from 'react';
import { useGymData } from '../../context/GymDataContext';
import { Receipt, Search, DollarSign, Download } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payments } = useGymData();
  const [searchTerm, setSearchTerm] = useState('');

  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

  const filtered = payments.filter(p =>
    p.receipt_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
            FINANCIAL TRANSACTION REGISTRY
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            PAYMENTS & REVENUE AUDIT
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time ledger of membership dues, renewals, and coach commissions.
          </p>
        </div>

        <div className="bg-[#14151C] border border-[#27272A] px-4 py-2 rounded-xl font-mono text-xs text-right">
          <div className="text-zinc-500">CUMULATIVE REVENUE:</div>
          <div className="text-xl font-bold text-[#E1601B]">${totalRevenue.toLocaleString()}.00</div>
        </div>
      </div>

      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden font-mono text-xs">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search receipt, member, plan..."
              className="w-full bg-[#0D0D11] border border-[#27272A] focus:border-[#E1601B] rounded pl-9 pr-3 py-1.5 text-white focus:outline-none"
            />
          </div>
          <span className="text-zinc-400">{filtered.length} TRANSACTIONS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0D0D11] text-zinc-500 uppercase border-b border-[#27272A] text-[10px]">
                <th className="p-4">RECEIPT NO</th>
                <th className="p-4">ATHLETE</th>
                <th className="p-4">PLAN</th>
                <th className="p-4">DATE</th>
                <th className="p-4">AMOUNT</th>
                <th className="p-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#1E1F28]/50 transition-colors">
                  <td className="p-4 font-bold text-white">{p.receipt_no}</td>
                  <td className="p-4 text-zinc-200">{p.member_name}</td>
                  <td className="p-4 text-zinc-400">{p.plan_name}</td>
                  <td className="p-4 text-zinc-400">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-4 text-[#E1601B] font-bold">₹{(p.amount > 500 ? p.amount : p.amount * 25).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
