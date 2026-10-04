// src/pages/member/MemberPayments.tsx
import React from 'react';
import { useGymData } from '../../context/GymDataContext';
import { Receipt, CheckCircle2, Download, ShieldCheck } from 'lucide-react';

export const MemberPayments: React.FC = () => {
  const { payments } = useGymData();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-[#E1601B] uppercase tracking-widest block mb-1">
          FINANCIAL AUDIT TELEMETRY
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          BILLING & PAYMENT RECEIPTS
        </h1>
        <p className="text-xs text-zinc-400">
          Full transactional history, automated renewals, and receipt vouchers.
        </p>
      </div>

      <div className="bg-[#14151C] border border-[#27272A] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#27272A] flex items-center justify-between">
          <h2 className="font-display text-lg uppercase font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#E1601B]" /> RECORDED TRANSACTIONS
          </h2>
          <span className="text-xs font-mono text-zinc-400">{payments.length} INVOICES</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#0D0D11] text-zinc-500 uppercase border-b border-[#27272A] text-[10px]">
                <th className="p-4">RECEIPT NO</th>
                <th className="p-4">DATE</th>
                <th className="p-4">MEMBERSHIP PLAN</th>
                <th className="p-4">AMOUNT</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/50">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-[#1E1F28]/50 transition-colors">
                  <td className="p-4 font-bold text-white">{p.receipt_no}</td>
                  <td className="p-4 text-zinc-400">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-4 text-zinc-200">{p.plan_name}</td>
                  <td className="p-4 text-[#E1601B] font-bold">₹{(p.amount > 500 ? p.amount : p.amount * 25).toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => alert(`Downloading official GymRat Club invoice receipt ${p.receipt_no}`)}
                      className="px-2.5 py-1 bg-[#0D0D11] hover:bg-[#1E1F28] border border-[#27272A] rounded text-[10px] text-zinc-300 uppercase transition-colors"
                    >
                      DOWNLOAD
                    </button>
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
