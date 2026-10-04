// src/pages/member/MemberMembership.tsx
import React, { useState, useEffect } from 'react';
import { demoStore } from '../../demo/mockStore';
import { mockMembershipService } from '../../demo/mockServices';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Receipt,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles,
  Lock,
  Download,
  X
} from 'lucide-react';

export const MemberMembership: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewStep, setRenewStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [viewingReceipt, setViewingReceipt] = useState<any | null>(null);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const { member, membershipPlan } = storeState;

  const handleStartRenew = () => {
    setRenewStep('SELECT');
    setIsRenewModalOpen(true);
  };

  const handleExecutePayment = async () => {
    setRenewStep('PROCESSING');
    await new Promise(r => setTimeout(r, 1400));
    const result = await mockMembershipService.renewMembership();
    setRenewStep('SUCCESS');
  };

  const currentReceipt = viewingReceipt || membershipPlan.paymentHistory[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
            MEMBER CREDENTIALS & SUBSCRIPTION
          </span>
          <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
            MEMBERSHIP TIERS & BILLING
          </h1>
          <p className="text-xs text-zinc-400">
            Official athlete accreditation, billing ledger, and cryptographic renewal terminal.
          </p>
        </div>

        <button
          onClick={handleStartRenew}
          className="px-5 py-2.5 bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-xs uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RENEW MEMBERSHIP</span>
        </button>
      </div>

      {/* Primary Current Membership Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#14151C] via-[#0E0F14] to-[#181922] border-2 border-[#FF5500]/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,85,0,0.12)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5500]/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Reticles */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#FF5500]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#FF5500]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#FF5500]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#FF5500]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 bg-[#FF5500] text-black font-mono text-[10px] font-black uppercase tracking-wider rounded-md">
                ACTIVE TIER
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/30 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
                VERIFIED STATUS: {membershipPlan.status}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block">
                MEMBERSHIP PROGRAM
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-wider">
                {membershipPlan.name}
              </h2>
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-[#FF5500]">{membershipPlan.price}</span>
              <span className="text-xs font-mono text-zinc-400">/ 3-MONTH RECURRING ACCESS</span>
            </div>

            {/* Key Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-800 max-w-xl text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>Unlimited Olympic Barbell & Arena Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>1-on-1 Assigned Coach Biometrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>Priority Class Reservations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500] shrink-0" />
                <span>Recovery & Hydrotherapy Lab Access</span>
              </div>
            </div>
          </div>

          {/* Right Card Status Box */}
          <div className="bg-[#070709]/80 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between gap-4 lg:min-w-[280px]">
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                <span>EXPIRATION DATE</span>
                <Calendar className="w-3.5 h-3.5 text-[#FF5500]" />
              </div>
              <div className="font-display text-2xl font-bold uppercase text-white tracking-wider">
                {membershipPlan.expires}
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                ● 82 DAYS REMAINING
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 space-y-2">
              <button
                onClick={handleStartRenew}
                className="w-full py-3 bg-[#FF5500] hover:bg-[#ff661a] text-black font-display text-xs uppercase tracking-wider font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>RENEW / EXTEND MEMBERSHIP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewingReceipt(membershipPlan.paymentHistory[0])}
                className="w-full py-2 bg-[#14151C] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                <span>VIEW LATEST RECEIPT</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Ledger */}
      <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FF5500]" />
            <h2 className="font-display text-lg uppercase font-bold text-white tracking-wider">
              PAYMENT HISTORY & INVOICE LEDGER
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            IMMUTABLE LOCAL DEMO ARCHIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest">
                <th className="pb-3 font-semibold">TRANSACTION ID</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">PLAN DESCRIPTION</th>
                <th className="pb-3 font-semibold">AMOUNT</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold text-right">DOCUMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {membershipPlan.paymentHistory.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 font-bold text-white tracking-wider">{item.id}</td>
                  <td className="py-3.5 text-zinc-400">{item.date}</td>
                  <td className="py-3.5 text-zinc-300">{item.plan}</td>
                  <td className="py-3.5 font-display text-sm font-bold text-[#FF5500]">{item.amount}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setViewingReceipt(item)}
                      className="px-2.5 py-1 bg-[#070709] hover:bg-[#1E1F28] border border-zinc-800 text-zinc-300 hover:text-white rounded text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      VIEW RECEIPT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIMULATED RENEWAL PAYMENT TERMINAL MODAL */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-[#14151C] border border-[#FF5500] rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setIsRenewModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-mono text-xs cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: PAYMENT TERMINAL */}
            {renewStep === 'SELECT' && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.2em] font-bold block mb-1">
                    SIMULATED DEMO PAYMENT TERMINAL
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wider">
                    EXTEND GYMRAT PRO
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Extend your active tier by 3 months. No real funds will be charged.
                  </p>
                </div>

                {/* Amount Breakdown */}
                <div className="p-4 bg-[#070709] border border-zinc-800 rounded-xl space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Plan:</span>
                    <span className="text-white font-bold">GYMRAT PRO (3 MONTHS)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>New Expiration:</span>
                    <span className="text-emerald-400 font-bold">18 MAR 2027</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800 text-sm">
                    <span className="font-bold text-white">Total Amount:</span>
                    <span className="font-display text-lg font-bold text-[#FF5500]">₹2,999</span>
                  </div>
                </div>

                {/* Method Options */}
                <div>
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    SELECT PAYMENT METHOD (DEMO SIMULATOR)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI', 'CARD', 'NETBANKING'] as const).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSelectedMethod(method)}
                        className={`py-2.5 px-2 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                          selectedMethod === method
                            ? 'bg-[#FF5500]/15 border-[#FF5500] text-white font-bold'
                            : 'bg-[#070709] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confirm Pay Button */}
                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-sm uppercase tracking-wider font-bold rounded-xl shadow-[0_0_25px_rgba(255,85,0,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Lock className="w-4 h-4" />
                  <span>AUTHORIZE ₹2,999 PAYMENT</span>
                </button>

                <div className="text-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  [DEMO MODE] SAFE SIMULATED TRANSACTION
                </div>
              </div>
            )}

            {/* STEP 2: PROCESSING */}
            {renewStep === 'PROCESSING' && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-[#FF5500] animate-spin" />
                  <Sparkles className="w-6 h-6 text-[#FF5500] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-white tracking-wider">
                    PROCESSING PAYMENT...
                  </h3>
                  <p className="font-mono text-xs text-[#FF5500] uppercase tracking-widest mt-1">
                    256-BIT CRYPTOGRAPHIC SETTLEMENT IN PROGRESS
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono mt-2">
                    Communicating with demo banking gateway...
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT SUCCESS */}
            {renewStep === 'SUCCESS' && (
              <div className="py-4 space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                    TRANSACTION CONFIRMED // RECEIPT GENERATED
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white tracking-wider">
                    PAYMENT SUCCESSFUL
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Your GYMRAT PRO membership has been officially extended through{' '}
                    <span className="text-white font-bold font-mono">18 MAR 2027</span>.
                  </p>
                </div>

                <div className="p-4 bg-[#070709] border border-zinc-800 rounded-xl font-mono text-xs space-y-1.5 text-left">
                  <div className="flex justify-between text-zinc-400">
                    <span>Amount Paid:</span>
                    <span className="text-white font-bold">₹2,999</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-bold">SETTLED & ACTIVE</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>New Expiry:</span>
                    <span className="text-[#FF5500] font-bold">18 MAR 2027</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsRenewModalOpen(false);
                      setViewingReceipt(membershipPlan.paymentHistory[0]);
                    }}
                    className="w-full py-3 bg-[#FF5500] hover:bg-[#ff661a] text-black font-display text-xs uppercase tracking-wider font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    VIEW OFFICIAL RECEIPT
                  </button>
                  <button
                    onClick={() => setIsRenewModalOpen(false)}
                    className="w-full py-2 bg-[#070709] hover:bg-zinc-800 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    RETURN TO DASHBOARD
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW RECEIPT MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="bg-[#14151C] border border-zinc-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-mono text-xs cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Branded Official Receipt */}
            <div className="border border-zinc-800 rounded-xl p-6 bg-[#070709] space-y-6">
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg border border-[#FF5500] p-1 bg-zinc-900 flex items-center justify-center">
                    <img src="/gymrat_badge.png" alt="GymRat" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white uppercase tracking-wider">
                      GYMRAT CLUB ARENA
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">
                      OFFICIAL PAYMENT ACKNOWLEDGEMENT
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px]">
                  <span className="text-zinc-500 block">RECEIPT ID</span>
                  <span className="text-white font-bold tracking-wider">{viewingReceipt.id}</span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">MEMBER NAME</span>
                  <span className="text-white font-bold">{member.name}</span>
                  <span className="text-[10px] text-zinc-400 block">{member.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">TRANSACTION DATE</span>
                  <span className="text-white font-bold">{viewingReceipt.date}</span>
                </div>
              </div>

              <div className="p-3 bg-[#14151C] border border-zinc-800/80 rounded-lg font-mono text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Description</span>
                  <span className="text-white">{viewingReceipt.plan}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Payment Gateway</span>
                  <span className="text-white">DEMO FASTNET ENCRYPTED UPI</span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800 font-bold text-sm">
                  <span className="text-white">TOTAL BILLED:</span>
                  <span className="text-[#FF5500] font-display text-base">{viewingReceipt.amount}</span>
                </div>
              </div>

              {/* Digital Verification Stamp */}
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 p-2.5 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DIGITALLY SIGNED & VERIFIED BY GYMRAT CLUB TREASURY</span>
                </div>
                <span className="font-bold">STATUS: {viewingReceipt.status}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setViewingReceipt(null)}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                CLOSE RECEIPT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MemberMembership;
